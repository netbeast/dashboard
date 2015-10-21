/*
Copyright (c) 2014, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

'use strict';

var Duplex    = require('readable-stream').Duplex
  , Writable  = require('readable-stream').Writable
  , inherits  = require('inherits')

function ReaDuplexer(writable, readable, options) {
  if (!(this instanceof ReaDuplexer))
    return new ReaDuplexer(writable, readable, options)

  this._options   = options

  Duplex.call(this, options)

  this.hook(writable, readable)

  this.on('finish', function() {
    if (this._writable)
      this._writable.end()
  })

  this._lastReadCallback = null
}

inherits(ReaDuplexer, Duplex)

function callWrite2Args(chunk, enc, cb) {
  this._writable.write(chunk, enc)
  cb()
  return true
}

function callWrite3Args(chunk, enc, cb) {
  return this._writable.write(chunk, enc, cb)
}

ReaDuplexer.prototype.hookWritable = function hookWritable(writable) {
  var that = this

  if (this._writable)
    throw new Error('already hooked to a Writable')

  if (!writable)
    throw new Error('missing writable')

  this._writable = writable

  writable.on('drain', function() {
    that.emit('drain')
  })

  writable.on('error', function(err) {
    that.emit('error', err)
  })

  if (this._writable.write.length === 3) {
    this._callWrite = callWrite3Args
  } else {
    this._callWrite = callWrite2Args
  }

  if (this._firstPayload) {
    this._callWrite(
      this._firstPayload.chunk
    , this._firstPayload.enc
    , this._firstPayload.cb)

    delete this._firstPayload
  }

  return this
}

ReaDuplexer.prototype.hookReadable = function hookReadable(readable) {
  var that          = this
    , dummyWritable = new Writable(this._options)

  if (this._readable)
    throw new Error('already hooked to a Readable')

  if (!readable)
    throw new Error('missing readable')

  this._readable  = readable

  dummyWritable._write = function dummyWrite(chunk, enc, cb) {
    if (that.push(chunk, enc))
      cb()
    else
      that._lastReadCallback = cb
  }

  dummyWritable.on('finish', function() {
    that.push(null)
  })

  ;[readable, dummyWritable].forEach(function(stream) {
    stream.on('error', function(err) {
      that.emit('error', err)
    })
  })

  readable.pipe(dummyWritable)

  return this
}

ReaDuplexer.prototype.hook = function hook(writable, readable) {
  if (writable)
    this.hookWritable(writable)

  if (readable)
    this.hookReadable(readable)

  return this
}

ReaDuplexer.prototype._read = function read(n) {
  if (this._lastReadCallback)
    this._lastReadCallback()

  this._lastReadCallback = null
}

ReaDuplexer.prototype._callWrite = function nop() {
  throw new Error('hook Writable to use')
}

ReaDuplexer.prototype._write = function write(chunk, enc, cb) {
  if (this._writable)
    return this._callWrite(chunk, enc, cb)

  // we are in delayed open
  this._firstPayload = {
      chunk: chunk
    , enc: enc
    , cb: cb
  }
}

module.exports = ReaDuplexer
