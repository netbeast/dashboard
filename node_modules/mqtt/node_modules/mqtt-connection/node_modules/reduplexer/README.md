# reduplexer(writable, readable, options)

[![build status][1]][2]

Takes a [`Writable`][5] stream and a [`Readable`][4] stream and makes them appear as a `Duplex` stream.
Heavily inspired by [duplexer](http://npm.im/duplexer) but using Stream2
with a bundled [readable-stream](http://npm.im/readable-stream).

It is assumed that the two streams are connected to each other in some way.

## Example

```js
var cp        = require('child_process')
  , duplexer  = require('reduplexer')
  , grep      = cp.exec('grep Stream')

duplexer(grep.stdin, grep.stdout, { objectMode: true })
```

## Installation

`npm install reduplexer --save`

## API

  * <a href="#reduplexer"><code><b>reduplexer()</b></code></a>
  * <a href="#hookWritable"><code>duplex.<b>hookWritable()</b></code></a>
  * <a href="#hookReadable"><code>duplex.<b>hookReadable()</b></code></a>
  * <a href="#hook"><code>duplex.<b>hook()</b></code></a>

-------------------------------------------------------
<a name="reduplexer"></a>
### reduplexer(writable, readable, options)

Create a [`Duplex`][3] stream based on `writable` and `readable` using
the given options.
`writable` and `readable` can be null, and in that case they can be
'hooked' later.

-------------------------------------------------------
<a name="hookWritable"></a>

### duplex.hookWritable(writable)

Hooks a `Writable` stream. It will throw if a `Writable` is already hooked.

-------------------------------------------------------
<a name="hookReadable"></a>
### duplex.hookReadable(writable)

Hooks a `Readable` stream. It will throw if a `Readable` stream is already hooked.

-------------------------------------------------------
<a name="hook"></a>
### duplex.hook(writable, readable)

Shortcut for:

```js
duplex.hookWritable(writable)
duplex.hookReadable(readable)
```

But it will not throw if any of the two are missing.

## Tests

`npm test`

## License

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

  [1]: https://secure.travis-ci.org/mcollina/reduplexer.png
  [2]: https://travis-ci.org/mcollina/reduplexer
  [3]: http://nodejs.org/api/stream.html#stream_class_stream_duplex
  [4]: http://nodejs.org/api/stream.html#stream_class_stream_readable
  [5]: http://nodejs.org/api/stream.html#stream_class_stream_writable
