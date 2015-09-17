(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//
// Angular core of dashboard app
// by jesus@netbeast
//==============================

var io = require('./lib/socket.io')

var Dashboard = angular.module('Dashboard', ['ngRoute'])

Dashboard.run([function () {
    // Error handling
    ws = io.connect('/')

    ws.on('hello', function () {
      console.log('ws/main: server fetched.')
    })

    ws.on('success', function (msg) {
      toastr.success(msg, 'xway')
      console.log('ws/main: server fetched.')
    })

    ws.on('warning', function (msg) {
      toastr.warning(msg, 'xway')
      console.log('ws/stderr: %s', stderr)
    })

    ws.on('stdout', function (stdout) {
      toastr.info(stdout, 'xway')
      console.log('ws/stdout: %s', stdout)
    })

    ws.on('stderr', function (stderr) {
      toastr.error(stderr, 'xway')
      console.log('ws/stderr: %s', stderr)
    })
  }])

Dashboard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'views/apps/index.html',
      controller: 'AppsListCtrl'
    }).
    when('/apps/:name', {
      templateUrl: 'views/apps/show.html',
      controller: 'AppsShowCtrl'
    }).
    when('/install/', {
      templateUrl: 'views/apps/new.html',
      controller: 'AppsNewCtrl'
    }).
    when('/i/:name', {
      templateUrl: 'views/apps/live.html',
      controller: 'ActivitiesLiveCtrl'
    }).
    when('/remove', {
      templateUrl: 'views/apps/delete.html',
      controller: 'AppsRmCtrl'
    }).
    when('/activities', {
      templateUrl: 'views/apps/activities.html',
      controller: 'ActivitiesListCtrl'
    }).
    when('/signin', {
      templateUrl: 'views/users/signin.html',
      controller: 'LoginCtrl'
    }).
    when('/routes', {
      templateUrl: 'views/misc/routes.html',
      controller: 'RoutesCtrl'
    }).
    when('/settings', {
      templateUrl: 'views/misc/settings.html',
      controller: 'SettingsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    })
  }])

require('./services')
require('./directives')
require('./controllers')

},{"./controllers":5,"./directives":8,"./lib/socket.io":10,"./services":13}],2:[function(require,module,exports){

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {
  var Dropzone, Emitter, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  noop = function() {};

  Emitter = (function() {
    function Emitter() {}

    Emitter.prototype.addEventListener = Emitter.prototype.on;

    Emitter.prototype.on = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    };

    Emitter.prototype.emit = function() {
      var args, callback, callbacks, event, _i, _len;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._callbacks = this._callbacks || {};
      callbacks = this._callbacks[event];
      if (callbacks) {
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback.apply(this, args);
        }
      }
      return this;
    };

    Emitter.prototype.removeListener = Emitter.prototype.off;

    Emitter.prototype.removeAllListeners = Emitter.prototype.off;

    Emitter.prototype.removeEventListener = Emitter.prototype.off;

    Emitter.prototype.off = function(event, fn) {
      var callback, callbacks, i, _i, _len;
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }
      callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }
      for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
        callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    return Emitter;

  })();

  Dropzone = (function(_super) {
    var extend, resolveOption;

    __extends(Dropzone, _super);

    Dropzone.prototype.Emitter = Emitter;


    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
     */

    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      withCredentials: false,
      parallelUploads: 2,
      uploadMultiple: false,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 120,
      thumbnailHeight: 120,
      filesizeBase: 1000,
      maxFiles: null,
      filesizeBase: 1000,
      params: {},
      clickable: true,
      ignoreHiddenFiles: true,
      acceptedFiles: null,
      acceptedMimeTypes: null,
      autoProcessQueue: true,
      autoQueue: true,
      addRemoveLinks: false,
      previewsContainer: null,
      capture: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
      dictRemoveFile: "Remove file",
      dictRemoveFileConfirmation: null,
      dictMaxFilesExceeded: "You can not upload any more files.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          span.textContent = this.options.dictFallbackMessage;
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = this.options.thumbnailWidth;
        info.optHeight = this.options.thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
      },

      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
       */
      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      paste: noop,
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }
        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement;
          this.previewsContainer.appendChild(file.previewElement);
          _ref = file.previewElement.querySelectorAll("[data-dz-name]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.textContent = file.name;
          }
          _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            node.innerHTML = this.filesize(file.size);
          }
          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
            file.previewElement.appendChild(file._removeLink);
          }
          removeFileEvent = (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                  return _this.removeFile(file);
                });
              } else {
                if (_this.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                    return _this.removeFile(file);
                  });
                } else {
                  return _this.removeFile(file);
                }
              }
            };
          })(this);
          _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            removeLink = _ref2[_k];
            _results.push(removeLink.addEventListener("click", removeFileEvent));
          }
          return _results;
        }
      },
      removedfile: function(file) {
        var _ref;
        if (file.previewElement) {
          if ((_ref = file.previewElement) != null) {
            _ref.parentNode.removeChild(file.previewElement);
          }
        }
        return this._updateMaxFilesReachedClass();
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement, _i, _len, _ref;
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumbnailElement = _ref[_i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
          }
          return setTimeout(((function(_this) {
            return function() {
              return file.previewElement.classList.add("dz-image-preview");
            };
          })(this)), 1);
        }
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if (typeof message !== "String" && message.error) {
            message = message.error;
          }
          _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
          }
          return _results;
        }
      },
      errormultiple: noop,
      processing: function(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.nodeName === 'PROGRESS') {
              _results.push(node.value = progress);
            } else {
              _results.push(node.style.width = "" + progress + "%");
            }
          }
          return _results;
        }
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          file._removeLink.textContent = this.options.dictRemoveFile;
        }
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-complete");
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      queuecomplete: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Dropzone(element, options) {
      var elementOptions, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.clickableElements = [];
      this.listeners = [];
      this.files = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      this.element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if (this.options.url == null) {
        this.options.url = this.element.getAttribute("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      }
      if (this.options.acceptedMimeTypes) {
        this.options.acceptedFiles = this.options.acceptedMimeTypes;
        delete this.options.acceptedMimeTypes;
      }
      this.options.method = this.options.method.toUpperCase();
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer !== false) {
        if (this.options.previewsContainer) {
          this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
        } else {
          this.previewsContainer = this.element;
        }
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getFilesWithStatus = function(status) {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === status) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    };

    Dropzone.prototype.getUploadingFiles = function() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    };

    Dropzone.prototype.getActiveFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = (function(_this) {
          return function() {
            if (_this.hiddenFileInput) {
              document.body.removeChild(_this.hiddenFileInput);
            }
            _this.hiddenFileInput = document.createElement("input");
            _this.hiddenFileInput.setAttribute("type", "file");
            if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
              _this.hiddenFileInput.setAttribute("multiple", "multiple");
            }
            _this.hiddenFileInput.className = "dz-hidden-input";
            if (_this.options.acceptedFiles != null) {
              _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
            }
            if (_this.options.capture != null) {
              _this.hiddenFileInput.setAttribute("capture", _this.options.capture);
            }
            _this.hiddenFileInput.style.visibility = "hidden";
            _this.hiddenFileInput.style.position = "absolute";
            _this.hiddenFileInput.style.top = "0";
            _this.hiddenFileInput.style.left = "0";
            _this.hiddenFileInput.style.height = "0";
            _this.hiddenFileInput.style.width = "0";
            document.body.appendChild(_this.hiddenFileInput);
            return _this.hiddenFileInput.addEventListener("change", function() {
              var file, files, _i, _len;
              files = _this.hiddenFileInput.files;
              if (files.length) {
                for (_i = 0, _len = files.length; _i < _len; _i++) {
                  file = files[_i];
                  _this.addFile(file);
                }
              }
              return setupHiddenFileInput();
            });
          };
        })(this);
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("removedfile", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("canceled", (function(_this) {
        return function(file) {
          return _this.emit("complete", file);
        };
      })(this));
      this.on("complete", (function(_this) {
        return function(file) {
          if (_this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
            return setTimeout((function() {
              return _this.emit("queuecomplete");
            }), 0);
          }
        };
      })(this));
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
            "dragstart": (function(_this) {
              return function(e) {
                return _this.emit("dragstart", e);
              };
            })(this),
            "dragenter": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.emit("dragenter", e);
              };
            })(this),
            "dragover": (function(_this) {
              return function(e) {
                var efct;
                try {
                  efct = e.dataTransfer.effectAllowed;
                } catch (_error) {}
                e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                noPropagation(e);
                return _this.emit("dragover", e);
              };
            })(this),
            "dragleave": (function(_this) {
              return function(e) {
                return _this.emit("dragleave", e);
              };
            })(this),
            "drop": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.drop(e);
              };
            })(this),
            "dragend": (function(_this) {
              return function(e) {
                return _this.emit("dragend", e);
              };
            })(this)
          }
        }
      ];
      this.clickableElements.forEach((function(_this) {
        return function(clickableElement) {
          return _this.listeners.push({
            element: clickableElement,
            events: {
              "click": function(evt) {
                if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                  return _this.hiddenFileInput.click();
                }
              }
            }
          });
        };
      })(this));
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
      this.disable();
      this.removeAllFiles(true);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        _ref = this.getActiveFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype._getParamName = function(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + (this._getParamName(0)) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
      units = ['TB', 'GB', 'MB', 'KB', 'b'];
      selectedSize = selectedUnit = null;
      for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
        unit = units[i];
        cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;
        if (size >= cutoff) {
          selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
          selectedUnit = unit;
          break;
        }
      }
      selectedSize = Math.round(10 * selectedSize) / 10;
      return "<strong>" + selectedSize + "</strong> " + selectedUnit;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    };

    Dropzone.prototype.drop = function(e) {
      var files, items;
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.paste = function(e) {
      var items, _ref;
      if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
        return;
      }
      this.emit("paste", e);
      items = e.clipboardData.items;
      if (items.length) {
        return this._addFilesFromItems(items);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromItems = function(items) {
      var entry, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            _results.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            _results.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            _results.push(void 0);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || item.kind === "file") {
            _results.push(this.addFile(item.getAsFile()));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
      var dirReader, entriesReader;
      dirReader = directory.createReader();
      entriesReader = (function(_this) {
        return function(entries) {
          var entry, _i, _len;
          for (_i = 0, _len = entries.length; _i < _len; _i++) {
            entry = entries[_i];
            if (entry.isFile) {
              entry.file(function(file) {
                if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                  return;
                }
                file.fullPath = "" + path + "/" + file.name;
                return _this.addFile(file);
              });
            } else if (entry.isDirectory) {
              _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
            }
          }
        };
      })(this);
      return dirReader.readEntries(entriesReader, function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      });
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);
      this._enqueueThumbnail(file);
      return this.accept(file, (function(_this) {
        return function(error) {
          if (error) {
            file.accepted = false;
            _this._errorProcessing([file], error);
          } else {
            file.accepted = true;
            if (_this.options.autoQueue) {
              _this.enqueueFile(file);
            }
          }
          return _this._updateMaxFilesReachedClass();
        };
      })(this));
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.processQueue();
            };
          })(this)), 0);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype._thumbnailQueue = [];

    Dropzone.prototype._processingThumbnail = false;

    Dropzone.prototype._enqueueThumbnail = function(file) {
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(((function(_this) {
          return function() {
            return _this._processThumbnailQueue();
          };
        })(this)), 0);
      }
    };

    Dropzone.prototype._processThumbnailQueue = function() {
      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }
      this._processingThumbnail = true;
      return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
        return function() {
          _this._processingThumbnail = false;
          return _this._processThumbnailQueue();
        };
      })(this));
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file, callback) {
      var fileReader;
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          if (file.type === "image/svg+xml") {
            _this.emit("thumbnail", file, fileReader.result);
            if (callback != null) {
              callback();
            }
            return;
          }
          return _this.createThumbnailFromUrl(file, fileReader.result, callback);
        };
      })(this);
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.createThumbnailFromUrl = function(file, imageUrl, callback) {
      var img;
      img = document.createElement("img");
      img.onload = (function(_this) {
        return function() {
          var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = resizeInfo.optWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = resizeInfo.optHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          _this.emit("thumbnail", file, thumbnail);
          if (callback != null) {
            return callback();
          }
        };
      })(this);
      if (callback != null) {
        img.onerror = callback;
      }
      return img.src = imageUrl;
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    resolveOption = function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof option === 'function') {
        return option.apply(this, args);
      }
      return option;
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      method = resolveOption(this.options.method, files);
      url = resolveOption(this.options.url, files);
      xhr.open(method, url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function(_this) {
        return function(e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function(_this) {
        return function(e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        xhr.setRequestHeader(headerName, headerValue);
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], files[i].name);
      }
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Emitter);

  Dropzone.version = "4.0.1";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";


  /*
  
  Bugfix for iOS 6 and 7
  Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  based on the work of https://github.com/stomita/ios-imagefile-megapixel
   */

  detectVerticalSquash = function(img) {
    var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = ih;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, 1, ih).data;
    sy = 0;
    ey = ih;
    py = ih;
    while (py > sy) {
      alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    ratio = py / ih;
    if (ratio === 0) {
      return 1;
    } else {
      return ratio;
    }
  };

  drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio;
    vertSquashRatio = detectVerticalSquash(img);
    return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
  };


  /*
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   */

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

},{}],3:[function(require,module,exports){
'use strict'

var helper = require('../helper')

angular.module('Dashboard')

.controller('ActivitiesListCtrl', ['$scope', 'Activities',
	function($scope, Activities) {
		helper.setTitle('Apps running')
		helper.setNavColor('yellow')
		Activities.all()
		.success(function(data) {
			$scope.apps = data
		}).
		error(function(data, status) {
			toastr.error(data, 'Status ' + status)
		})
		$scope.stop = Activities.stop
	}])

.controller('ActivitiesLiveCtrl', ['$scope', '$routeParams', 'Activities',
  function ($scope, $routeParams, Activities) {
    helper.setTitle($routeParams.name)
    helper.setNavColor('green')
    Activities.open($scope, $routeParams.name)
  }])
},{"../helper":9}],4:[function(require,module,exports){
'use strict'

var helper = require('../helper')
var app = angular.module('Dashboard')
var Dropzone = require('Dropzone')

app.controller('AppsShowCtrl', [
  '$scope', '$routeParams', 'Apps', 'Activities', '$sce',
  function($scope, $routeParams, Apps, Activities, $sce) {
    var appName = $routeParams.name
    helper.setNavColor('blue')
    helper.setTitle(appName)
    Apps.getReadme(appName).success(function(data) {
      $scope.readme = $sce.trustAsHtml(data)
    }) 
    Apps.get(appName).success(function(data) {
      $scope.app = data
    })
    Activities.launch($scope, appName)
  }])

app.controller('AppsListCtrl', ['$scope', 'Apps',
  function ($scope, Apps) {
    helper.setTitle('Your apps drawer')
    helper.setNavColor('blue')
    Apps.all().success(function(data) {
      $scope.apps = data
    })
  }])

app.controller('AppsRmCtrl', ['$scope', 'Apps',
  function ($scope, Apps) {
    helper.setTitle('Uninstall apps')
    helper.setNavColor('red')
    Apps.all().success(function(data) {
      $scope.apps = data
    })
  }])

app.controller('AppsNewCtrl', ['$scope', '$routeParams', '$http',  '$location',
  function($scope, $routeParams, $http, $location) {

    helper.hideNav()
    helper.setTitle('Install a new app')

    var dz = new Dropzone(".dropzone", {
      url: "/apps",
      maxFiles: 1,
      accept: function(file, done) {
        var fname = file.name
        var ext = [fname.split('.')[1], fname.split('.')[2]].join('.')
        if(ext === 'tar.gz' || ext === 'tgz.') {
          console.log('Uploading file with extension ' + ext)
          done()
        } else {
          done('Invalid file type. Must be a tar.gz')
          this.removeFile(file)
        }
      }
    })

    dz.on("error", function(file, error, xhr) {
      toastr.error(error)
      dz.removeFile(file)
    })

    dz.on("processing", function(file, response) {
      $location.path("/")
    })
  }])
},{"../helper":9,"Dropzone":2}],5:[function(require,module,exports){
require('./activities')
require('./apps')
require('./users')
require('./misc')


},{"./activities":3,"./apps":4,"./misc":6,"./users":7}],6:[function(require,module,exports){
'use strict'

var helper = require('../helper')

angular.module('Dashboard')
.controller('RoutesCtrl', ['$scope', '$http',
  function ($scope, $http) {
    helper.setTitle('[Dev] API')
    helper.setNavColor('orange')
    $http.get('/routes').
    success(function(data, status, headers, config) {
      $scope.routes = data
      $scope.keys = Object.keys
    }).
    error(function(data, status, headers, config) {
      console.log(status + ' when GET /routes -> ' + data)
    })
  }])

angular.module('Dashboard')
.controller('SettingsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    helper.setTitle('Settings')
    helper.setNavColor('#777777')

    $scope.update = function () {
      $http.put('/update')
    }
  }])
},{"../helper":9}],7:[function(require,module,exports){
'use strict'

var helper = require('../helper')

angular.module('Dashboard')
.controller('LoginCtrl', ['$scope', '$http', '$location', '$rootScope', 
	function ($scope, $http, $location, $rootScope) {
		helper.setTitle('Sign in')
		$scope.credentials = {}
		$scope.login = function (credentials) {
			$http.post('/login', credentials)
			.success(function(data, status, headers, config) {
				console.log('POST  /login -> ')
				console.log(data)
				$rootScope.user = data           
				$location.path("/")
			})
			.error(function(data, status, headers, config) {
				toastr.error(data)
			})
		}
	}])
},{"../helper":9}],8:[function(require,module,exports){
(function() {

	var Dashboard = angular.module('Dashboard');

	Dashboard.directive('toolBox', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/tool-box.html'
		};
	});

	Dashboard.directive('appRmBtn', ['$http',
		function($http) {
			return {
				restrict: 'E',
				scope: {
					app: '=app'
				},
				template: '<div class="del-overlay">'
				+ '<a class="btn btn-danger" ng-click="delete()">'
				+ 'Delete </a></div>',
				controller: function($scope, $element) {
					$scope.delete = function () {
						var item = $scope.app.name;
						var msg = 'Are you sure you want to uninstall ' + item + '?';
						if (confirm(msg)) {
							$http.delete('/apps/' + item).
							success(function(data, status, headers, config) {
								console.log('DELETE  /apps/' + item + ' -> ' + data);
								itemHTML = document.getElementById(item);
								itemHTML.parentElement.removeChild(itemHTML);
							}).
							error(function(data, status, headers, config) {
								console.log(status + ' when DELETE /apps/'+item+' -> ' + data);
							});
						}
					};
				}
			};
		}]);

})();
},{}],9:[function(require,module,exports){
// Some helper methods:
//=====================

exports.hideNav = function () {
  nav = document.getElementsByTagName('nav')[0];
  nav.style.height = 0;
};

exports.setNavColor = function setNavColor(str) {
  var colors = {
   blue :  "#73C5E1",
   orange :  "#FBA827",
   green :  "#1FDA9A",
   pink :  "#EB65A0",
   yellow :  "#FFD452",
   grey :  "#F2F2F3",
   black :  "#333333",
   red :  "#e65656"
 };
 nav = document.getElementsByTagName('nav')[0];
 nav.style.height = '3px';
 nav.style.backgroundColor = colors[str] || str;
};

exports.setTitle = function(str) {
  document.title = ' Beta | ' + str;
  var tooldiv = document.getElementById('title');
  tooldiv.innerHTML = '<span>' + str + '</span>';
};

},{}],10:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.io=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){module.exports=_dereq_("./lib/")},{"./lib/":2}],2:[function(_dereq_,module,exports){var url=_dereq_("./url");var parser=_dereq_("socket.io-parser");var Manager=_dereq_("./manager");var debug=_dereq_("debug")("socket.io-client");module.exports=exports=lookup;var cache=exports.managers={};function lookup(uri,opts){if(typeof uri=="object"){opts=uri;uri=undefined}opts=opts||{};var parsed=url(uri);var source=parsed.source;var id=parsed.id;var io;if(opts.forceNew||opts["force new connection"]||false===opts.multiplex){debug("ignoring socket cache for %s",source);io=Manager(source,opts)}else{if(!cache[id]){debug("new io instance for %s",source);cache[id]=Manager(source,opts)}io=cache[id]}return io.socket(parsed.path)}exports.protocol=parser.protocol;exports.connect=lookup;exports.Manager=_dereq_("./manager");exports.Socket=_dereq_("./socket")},{"./manager":3,"./socket":5,"./url":6,debug:10,"socket.io-parser":46}],3:[function(_dereq_,module,exports){var url=_dereq_("./url");var eio=_dereq_("engine.io-client");var Socket=_dereq_("./socket");var Emitter=_dereq_("component-emitter");var parser=_dereq_("socket.io-parser");var on=_dereq_("./on");var bind=_dereq_("component-bind");var object=_dereq_("object-component");var debug=_dereq_("debug")("socket.io-client:manager");var indexOf=_dereq_("indexof");var Backoff=_dereq_("backo2");module.exports=Manager;function Manager(uri,opts){if(!(this instanceof Manager))return new Manager(uri,opts);if(uri&&"object"==typeof uri){opts=uri;uri=undefined}opts=opts||{};opts.path=opts.path||"/socket.io";this.nsps={};this.subs=[];this.opts=opts;this.reconnection(opts.reconnection!==false);this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);this.reconnectionDelay(opts.reconnectionDelay||1e3);this.reconnectionDelayMax(opts.reconnectionDelayMax||5e3);this.randomizationFactor(opts.randomizationFactor||.5);this.backoff=new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()});this.timeout(null==opts.timeout?2e4:opts.timeout);this.readyState="closed";this.uri=uri;this.connected=[];this.encoding=false;this.packetBuffer=[];this.encoder=new parser.Encoder;this.decoder=new parser.Decoder;this.autoConnect=opts.autoConnect!==false;if(this.autoConnect)this.open()}Manager.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var nsp in this.nsps){this.nsps[nsp].emit.apply(this.nsps[nsp],arguments)}};Manager.prototype.updateSocketIds=function(){for(var nsp in this.nsps){this.nsps[nsp].id=this.engine.id}};Emitter(Manager.prototype);Manager.prototype.reconnection=function(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this};Manager.prototype.reconnectionAttempts=function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this};Manager.prototype.reconnectionDelay=function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay=v;this.backoff&&this.backoff.setMin(v);return this};Manager.prototype.randomizationFactor=function(v){if(!arguments.length)return this._randomizationFactor;this._randomizationFactor=v;this.backoff&&this.backoff.setJitter(v);return this};Manager.prototype.reconnectionDelayMax=function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;this.backoff&&this.backoff.setMax(v);return this};Manager.prototype.timeout=function(v){if(!arguments.length)return this._timeout;this._timeout=v;return this};Manager.prototype.maybeReconnectOnOpen=function(){if(!this.reconnecting&&this._reconnection&&this.backoff.attempts===0){this.reconnect()}};Manager.prototype.open=Manager.prototype.connect=function(fn){debug("readyState %s",this.readyState);if(~this.readyState.indexOf("open"))return this;debug("opening %s",this.uri);this.engine=eio(this.uri,this.opts);var socket=this.engine;var self=this;this.readyState="opening";this.skipReconnect=false;var openSub=on(socket,"open",function(){self.onopen();fn&&fn()});var errorSub=on(socket,"error",function(data){debug("connect_error");self.cleanup();self.readyState="closed";self.emitAll("connect_error",data);if(fn){var err=new Error("Connection error");err.data=data;fn(err)}else{self.maybeReconnectOnOpen()}});if(false!==this._timeout){var timeout=this._timeout;debug("connect attempt will timeout after %d",timeout);var timer=setTimeout(function(){debug("connect attempt timed out after %d",timeout);openSub.destroy();socket.close();socket.emit("error","timeout");self.emitAll("connect_timeout",timeout)},timeout);this.subs.push({destroy:function(){clearTimeout(timer)}})}this.subs.push(openSub);this.subs.push(errorSub);return this};Manager.prototype.onopen=function(){debug("open");this.cleanup();this.readyState="open";this.emit("open");var socket=this.engine;this.subs.push(on(socket,"data",bind(this,"ondata")));this.subs.push(on(this.decoder,"decoded",bind(this,"ondecoded")));this.subs.push(on(socket,"error",bind(this,"onerror")));this.subs.push(on(socket,"close",bind(this,"onclose")))};Manager.prototype.ondata=function(data){this.decoder.add(data)};Manager.prototype.ondecoded=function(packet){this.emit("packet",packet)};Manager.prototype.onerror=function(err){debug("error",err);this.emitAll("error",err)};Manager.prototype.socket=function(nsp){var socket=this.nsps[nsp];if(!socket){socket=new Socket(this,nsp);this.nsps[nsp]=socket;var self=this;socket.on("connect",function(){socket.id=self.engine.id;if(!~indexOf(self.connected,socket)){self.connected.push(socket)}})}return socket};Manager.prototype.destroy=function(socket){var index=indexOf(this.connected,socket);if(~index)this.connected.splice(index,1);if(this.connected.length)return;this.close()};Manager.prototype.packet=function(packet){debug("writing packet %j",packet);var self=this;if(!self.encoding){self.encoding=true;this.encoder.encode(packet,function(encodedPackets){for(var i=0;i<encodedPackets.length;i++){self.engine.write(encodedPackets[i])}self.encoding=false;self.processPacketQueue()})}else{self.packetBuffer.push(packet)}};Manager.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var pack=this.packetBuffer.shift();this.packet(pack)}};Manager.prototype.cleanup=function(){var sub;while(sub=this.subs.shift())sub.destroy();this.packetBuffer=[];this.encoding=false;this.decoder.destroy()};Manager.prototype.close=Manager.prototype.disconnect=function(){this.skipReconnect=true;this.backoff.reset();this.readyState="closed";this.engine&&this.engine.close()};Manager.prototype.onclose=function(reason){debug("close");this.cleanup();this.backoff.reset();this.readyState="closed";this.emit("close",reason);if(this._reconnection&&!this.skipReconnect){this.reconnect()}};Manager.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var self=this;if(this.backoff.attempts>=this._reconnectionAttempts){debug("reconnect failed");this.backoff.reset();this.emitAll("reconnect_failed");this.reconnecting=false}else{var delay=this.backoff.duration();debug("will wait %dms before reconnect attempt",delay);this.reconnecting=true;var timer=setTimeout(function(){if(self.skipReconnect)return;debug("attempting reconnect");self.emitAll("reconnect_attempt",self.backoff.attempts);self.emitAll("reconnecting",self.backoff.attempts);if(self.skipReconnect)return;self.open(function(err){if(err){debug("reconnect attempt error");self.reconnecting=false;self.reconnect();self.emitAll("reconnect_error",err.data)}else{debug("reconnect success");self.onreconnect()}})},delay);this.subs.push({destroy:function(){clearTimeout(timer)}})}};Manager.prototype.onreconnect=function(){var attempt=this.backoff.attempts;this.reconnecting=false;this.backoff.reset();this.updateSocketIds();this.emitAll("reconnect",attempt)}},{"./on":4,"./socket":5,"./url":6,backo2:7,"component-bind":8,"component-emitter":9,debug:10,"engine.io-client":11,indexof:42,"object-component":43,"socket.io-parser":46}],4:[function(_dereq_,module,exports){module.exports=on;function on(obj,ev,fn){obj.on(ev,fn);return{destroy:function(){obj.removeListener(ev,fn)}}}},{}],5:[function(_dereq_,module,exports){var parser=_dereq_("socket.io-parser");var Emitter=_dereq_("component-emitter");var toArray=_dereq_("to-array");var on=_dereq_("./on");var bind=_dereq_("component-bind");var debug=_dereq_("debug")("socket.io-client:socket");var hasBin=_dereq_("has-binary");module.exports=exports=Socket;var events={connect:1,connect_error:1,connect_timeout:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1};var emit=Emitter.prototype.emit;function Socket(io,nsp){this.io=io;this.nsp=nsp;this.json=this;this.ids=0;this.acks={};if(this.io.autoConnect)this.open();this.receiveBuffer=[];this.sendBuffer=[];this.connected=false;this.disconnected=true}Emitter(Socket.prototype);Socket.prototype.subEvents=function(){if(this.subs)return;var io=this.io;this.subs=[on(io,"open",bind(this,"onopen")),on(io,"packet",bind(this,"onpacket")),on(io,"close",bind(this,"onclose"))]};Socket.prototype.open=Socket.prototype.connect=function(){if(this.connected)return this;this.subEvents();this.io.open();if("open"==this.io.readyState)this.onopen();return this};Socket.prototype.send=function(){var args=toArray(arguments);args.unshift("message");this.emit.apply(this,args);return this};Socket.prototype.emit=function(ev){if(events.hasOwnProperty(ev)){emit.apply(this,arguments);return this}var args=toArray(arguments);var parserType=parser.EVENT;if(hasBin(args)){parserType=parser.BINARY_EVENT}var packet={type:parserType,data:args};if("function"==typeof args[args.length-1]){debug("emitting packet with ack id %d",this.ids);this.acks[this.ids]=args.pop();packet.id=this.ids++}if(this.connected){this.packet(packet)}else{this.sendBuffer.push(packet)}return this};Socket.prototype.packet=function(packet){packet.nsp=this.nsp;this.io.packet(packet)};Socket.prototype.onopen=function(){debug("transport is open - connecting");if("/"!=this.nsp){this.packet({type:parser.CONNECT})}};Socket.prototype.onclose=function(reason){debug("close (%s)",reason);this.connected=false;this.disconnected=true;delete this.id;this.emit("disconnect",reason)};Socket.prototype.onpacket=function(packet){if(packet.nsp!=this.nsp)return;switch(packet.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:this.onevent(packet);break;case parser.BINARY_EVENT:this.onevent(packet);break;case parser.ACK:this.onack(packet);break;case parser.BINARY_ACK:this.onack(packet);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit("error",packet.data);break}};Socket.prototype.onevent=function(packet){var args=packet.data||[];debug("emitting event %j",args);if(null!=packet.id){debug("attaching ack callback to event");args.push(this.ack(packet.id))}if(this.connected){emit.apply(this,args)}else{this.receiveBuffer.push(args)}};Socket.prototype.ack=function(id){var self=this;var sent=false;return function(){if(sent)return;sent=true;var args=toArray(arguments);debug("sending ack %j",args);var type=hasBin(args)?parser.BINARY_ACK:parser.ACK;self.packet({type:type,id:id,data:args})}};Socket.prototype.onack=function(packet){debug("calling ack %s with %j",packet.id,packet.data);var fn=this.acks[packet.id];fn.apply(this,packet.data);delete this.acks[packet.id]};Socket.prototype.onconnect=function(){this.connected=true;this.disconnected=false;this.emit("connect");this.emitBuffered()};Socket.prototype.emitBuffered=function(){var i;for(i=0;i<this.receiveBuffer.length;i++){emit.apply(this,this.receiveBuffer[i])}this.receiveBuffer=[];for(i=0;i<this.sendBuffer.length;i++){this.packet(this.sendBuffer[i])}this.sendBuffer=[]};Socket.prototype.ondisconnect=function(){debug("server disconnect (%s)",this.nsp);this.destroy();this.onclose("io server disconnect")};Socket.prototype.destroy=function(){if(this.subs){for(var i=0;i<this.subs.length;i++){this.subs[i].destroy()}this.subs=null}this.io.destroy(this)};Socket.prototype.close=Socket.prototype.disconnect=function(){if(this.connected){debug("performing disconnect (%s)",this.nsp);this.packet({type:parser.DISCONNECT})}this.destroy();if(this.connected){this.onclose("io client disconnect")}return this}},{"./on":4,"component-bind":8,"component-emitter":9,debug:10,"has-binary":38,"socket.io-parser":46,"to-array":50}],6:[function(_dereq_,module,exports){(function(global){var parseuri=_dereq_("parseuri");var debug=_dereq_("debug")("socket.io-client:url");module.exports=url;function url(uri,loc){var obj=uri;var loc=loc||global.location;if(null==uri)uri=loc.protocol+"//"+loc.host;if("string"==typeof uri){if("/"==uri.charAt(0)){if("/"==uri.charAt(1)){uri=loc.protocol+uri}else{uri=loc.hostname+uri}}if(!/^(https?|wss?):\/\//.test(uri)){debug("protocol-less url %s",uri);if("undefined"!=typeof loc){uri=loc.protocol+"//"+uri}else{uri="https://"+uri}}debug("parse %s",uri);obj=parseuri(uri)}if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port="80"}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port="443"}}obj.path=obj.path||"/";obj.id=obj.protocol+"://"+obj.host+":"+obj.port;obj.href=obj.protocol+"://"+obj.host+(loc&&loc.port==obj.port?"":":"+obj.port);return obj}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{debug:10,parseuri:44}],7:[function(_dereq_,module,exports){module.exports=Backoff;function Backoff(opts){opts=opts||{};this.ms=opts.min||100;this.max=opts.max||1e4;this.factor=opts.factor||2;this.jitter=opts.jitter>0&&opts.jitter<=1?opts.jitter:0;this.attempts=0}Backoff.prototype.duration=function(){var ms=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.jitter*ms);ms=(Math.floor(rand*10)&1)==0?ms-deviation:ms+deviation}return Math.min(ms,this.max)|0};Backoff.prototype.reset=function(){this.attempts=0};Backoff.prototype.setMin=function(min){this.ms=min};Backoff.prototype.setMax=function(max){this.max=max};Backoff.prototype.setJitter=function(jitter){this.jitter=jitter}},{}],8:[function(_dereq_,module,exports){var slice=[].slice;module.exports=function(obj,fn){if("string"==typeof fn)fn=obj[fn];if("function"!=typeof fn)throw new Error("bind() requires a function");var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)))}}},{}],9:[function(_dereq_,module,exports){module.exports=Emitter;function Emitter(obj){if(obj)return mixin(obj)}function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key]}return obj}Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks[event]=this._callbacks[event]||[]).push(fn);return this};Emitter.prototype.once=function(event,fn){var self=this;this._callbacks=this._callbacks||{};function on(){self.off(event,on);fn.apply(this,arguments)}on.fn=fn;this.on(event,on);return this};Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};if(0==arguments.length){this._callbacks={};return this}var callbacks=this._callbacks[event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks[event];return this}var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break}}return this};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args)}}return this};Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks[event]||[]};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length}},{}],10:[function(_dereq_,module,exports){module.exports=debug;function debug(name){if(!debug.enabled(name))return function(){};return function(fmt){fmt=coerce(fmt);var curr=new Date;var ms=curr-(debug[name]||curr);debug[name]=curr;fmt=name+" "+fmt+" +"+debug.humanize(ms);window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}}debug.names=[];debug.skips=[];debug.enable=function(name){try{localStorage.debug=name}catch(e){}var split=(name||"").split(/[\s,]+/),len=split.length;for(var i=0;i<len;i++){name=split[i].replace("*",".*?");if(name[0]==="-"){debug.skips.push(new RegExp("^"+name.substr(1)+"$"))}else{debug.names.push(new RegExp("^"+name+"$"))}}};debug.disable=function(){debug.enable("")};debug.humanize=function(ms){var sec=1e3,min=60*1e3,hour=60*min;if(ms>=hour)return(ms/hour).toFixed(1)+"h";if(ms>=min)return(ms/min).toFixed(1)+"m";if(ms>=sec)return(ms/sec|0)+"s";return ms+"ms"};debug.enabled=function(name){for(var i=0,len=debug.skips.length;i<len;i++){if(debug.skips[i].test(name)){return false}}for(var i=0,len=debug.names.length;i<len;i++){if(debug.names[i].test(name)){return true}}return false};function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}try{if(window.localStorage)debug.enable(localStorage.debug)}catch(e){}},{}],11:[function(_dereq_,module,exports){module.exports=_dereq_("./lib/")},{"./lib/":12}],12:[function(_dereq_,module,exports){module.exports=_dereq_("./socket");module.exports.parser=_dereq_("engine.io-parser")},{"./socket":13,"engine.io-parser":25}],13:[function(_dereq_,module,exports){(function(global){var transports=_dereq_("./transports");var Emitter=_dereq_("component-emitter");var debug=_dereq_("debug")("engine.io-client:socket");var index=_dereq_("indexof");var parser=_dereq_("engine.io-parser");var parseuri=_dereq_("parseuri");var parsejson=_dereq_("parsejson");var parseqs=_dereq_("parseqs");module.exports=Socket;function noop(){}function Socket(uri,opts){if(!(this instanceof Socket))return new Socket(uri,opts);opts=opts||{};if(uri&&"object"==typeof uri){opts=uri;uri=null}if(uri){uri=parseuri(uri);opts.host=uri.host;opts.secure=uri.protocol=="https"||uri.protocol=="wss";opts.port=uri.port;if(uri.query)opts.query=uri.query}this.secure=null!=opts.secure?opts.secure:global.location&&"https:"==location.protocol;if(opts.host){var pieces=opts.host.split(":");opts.hostname=pieces.shift();if(pieces.length){opts.port=pieces.pop()}else if(!opts.port){opts.port=this.secure?"443":"80"}}this.agent=opts.agent||false;this.hostname=opts.hostname||(global.location?location.hostname:"localhost");this.port=opts.port||(global.location&&location.port?location.port:this.secure?443:80);this.query=opts.query||{};if("string"==typeof this.query)this.query=parseqs.decode(this.query);this.upgrade=false!==opts.upgrade;this.path=(opts.path||"/engine.io").replace(/\/$/,"")+"/";this.forceJSONP=!!opts.forceJSONP;this.jsonp=false!==opts.jsonp;this.forceBase64=!!opts.forceBase64;this.enablesXDR=!!opts.enablesXDR;this.timestampParam=opts.timestampParam||"t";this.timestampRequests=opts.timestampRequests;this.transports=opts.transports||["polling","websocket"];this.readyState="";this.writeBuffer=[];this.callbackBuffer=[];this.policyPort=opts.policyPort||843;this.rememberUpgrade=opts.rememberUpgrade||false;this.binaryType=null;this.onlyBinaryUpgrades=opts.onlyBinaryUpgrades;this.pfx=opts.pfx||null;this.key=opts.key||null;this.passphrase=opts.passphrase||null;this.cert=opts.cert||null;this.ca=opts.ca||null;this.ciphers=opts.ciphers||null;this.rejectUnauthorized=opts.rejectUnauthorized||null;this.open()}Socket.priorWebsocketSuccess=false;Emitter(Socket.prototype);Socket.protocol=parser.protocol;Socket.Socket=Socket;Socket.Transport=_dereq_("./transport");Socket.transports=_dereq_("./transports");Socket.parser=_dereq_("engine.io-parser");Socket.prototype.createTransport=function(name){debug('creating transport "%s"',name);var query=clone(this.query);query.EIO=parser.protocol;query.transport=name;if(this.id)query.sid=this.id;var transport=new transports[name]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:query,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized});return transport};function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i]}}return o}Socket.prototype.open=function(){var transport;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&this.transports.indexOf("websocket")!=-1){transport="websocket"}else if(0==this.transports.length){var self=this;setTimeout(function(){self.emit("error","No transports available")},0);return}else{transport=this.transports[0]}this.readyState="opening";var transport;try{transport=this.createTransport(transport)}catch(e){this.transports.shift();this.open();return}transport.open();this.setTransport(transport)};Socket.prototype.setTransport=function(transport){debug("setting transport %s",transport.name);var self=this;if(this.transport){debug("clearing existing transport %s",this.transport.name);this.transport.removeAllListeners()}this.transport=transport;transport.on("drain",function(){self.onDrain()}).on("packet",function(packet){self.onPacket(packet)}).on("error",function(e){self.onError(e)}).on("close",function(){self.onClose("transport close")})};Socket.prototype.probe=function(name){debug('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1}),failed=false,self=this;Socket.priorWebsocketSuccess=false;function onTransportOpen(){if(self.onlyBinaryUpgrades){var upgradeLosesBinary=!this.supportsBinary&&self.transport.supportsBinary;failed=failed||upgradeLosesBinary}if(failed)return;debug('probe transport "%s" opened',name);transport.send([{type:"ping",data:"probe"}]);transport.once("packet",function(msg){if(failed)return;if("pong"==msg.type&&"probe"==msg.data){debug('probe transport "%s" pong',name);self.upgrading=true;self.emit("upgrading",transport);if(!transport)return;Socket.priorWebsocketSuccess="websocket"==transport.name;debug('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if("closed"==self.readyState)return;debug("changing transport and sending upgrade packet");cleanup();self.setTransport(transport);transport.send([{type:"upgrade"}]);self.emit("upgrade",transport);transport=null;self.upgrading=false;self.flush()})}else{debug('probe transport "%s" failed',name);var err=new Error("probe error");err.transport=transport.name;self.emit("upgradeError",err)}})}function freezeTransport(){if(failed)return;failed=true;cleanup();transport.close();transport=null}function onerror(err){var error=new Error("probe error: "+err);error.transport=transport.name;freezeTransport();debug('probe transport "%s" failed because of error: %s',name,err);self.emit("upgradeError",error)}function onTransportClose(){onerror("transport closed")}function onclose(){onerror("socket closed")}function onupgrade(to){if(transport&&to.name!=transport.name){debug('"%s" works - aborting "%s"',to.name,transport.name);freezeTransport()}}function cleanup(){transport.removeListener("open",onTransportOpen);transport.removeListener("error",onerror);transport.removeListener("close",onTransportClose);self.removeListener("close",onclose);self.removeListener("upgrading",onupgrade)}transport.once("open",onTransportOpen);transport.once("error",onerror);transport.once("close",onTransportClose);this.once("close",onclose);this.once("upgrading",onupgrade);transport.open()};Socket.prototype.onOpen=function(){debug("socket open");this.readyState="open";Socket.priorWebsocketSuccess="websocket"==this.transport.name;this.emit("open");this.flush();if("open"==this.readyState&&this.upgrade&&this.transport.pause){debug("starting upgrade probes");for(var i=0,l=this.upgrades.length;i<l;i++){this.probe(this.upgrades[i])}}};Socket.prototype.onPacket=function(packet){if("opening"==this.readyState||"open"==this.readyState){debug('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit("packet",packet);this.emit("heartbeat");switch(packet.type){case"open":this.onHandshake(parsejson(packet.data));break;case"pong":this.setPing();break;case"error":var err=new Error("server error");err.code=packet.data;this.emit("error",err);break;case"message":this.emit("data",packet.data);this.emit("message",packet.data);break}}else{debug('packet received with socket readyState "%s"',this.readyState)}};Socket.prototype.onHandshake=function(data){this.emit("handshake",data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=this.filterUpgrades(data.upgrades);this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();if("closed"==this.readyState)return;this.setPing();this.removeListener("heartbeat",this.onHeartbeat);this.on("heartbeat",this.onHeartbeat)};Socket.prototype.onHeartbeat=function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer=setTimeout(function(){if("closed"==self.readyState)return;self.onClose("ping timeout")},timeout||self.pingInterval+self.pingTimeout)};Socket.prototype.setPing=function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer=setTimeout(function(){debug("writing ping packet - expecting pong within %sms",self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout)},self.pingInterval)};Socket.prototype.ping=function(){this.sendPacket("ping")};Socket.prototype.onDrain=function(){for(var i=0;i<this.prevBufferLen;i++){if(this.callbackBuffer[i]){this.callbackBuffer[i]()}}this.writeBuffer.splice(0,this.prevBufferLen);this.callbackBuffer.splice(0,this.prevBufferLen);this.prevBufferLen=0;if(this.writeBuffer.length==0){this.emit("drain")}else{this.flush()}};Socket.prototype.flush=function(){if("closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){debug("flushing %d packets in socket",this.writeBuffer.length);this.transport.send(this.writeBuffer);this.prevBufferLen=this.writeBuffer.length;this.emit("flush")}};Socket.prototype.write=Socket.prototype.send=function(msg,fn){this.sendPacket("message",msg,fn);return this};Socket.prototype.sendPacket=function(type,data,fn){if("closing"==this.readyState||"closed"==this.readyState){return}var packet={type:type,data:data};this.emit("packetCreate",packet);this.writeBuffer.push(packet);this.callbackBuffer.push(fn);this.flush()};Socket.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.readyState="closing";var self=this;function close(){self.onClose("forced close");debug("socket closing - telling transport to close");self.transport.close()}function cleanupAndClose(){self.removeListener("upgrade",cleanupAndClose);self.removeListener("upgradeError",cleanupAndClose);close()}function waitForUpgrade(){self.once("upgrade",cleanupAndClose);self.once("upgradeError",cleanupAndClose)}if(this.writeBuffer.length){this.once("drain",function(){if(this.upgrading){waitForUpgrade()}else{close()}})}else if(this.upgrading){waitForUpgrade()}else{close()}}return this};Socket.prototype.onError=function(err){debug("socket error %j",err);Socket.priorWebsocketSuccess=false;this.emit("error",err);this.onClose("transport error",err)};Socket.prototype.onClose=function(reason,desc){if("opening"==this.readyState||"open"==this.readyState||"closing"==this.readyState){debug('socket close with reason: "%s"',reason);var self=this;clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);setTimeout(function(){self.writeBuffer=[];self.callbackBuffer=[];self.prevBufferLen=0},0);this.transport.removeAllListeners("close");this.transport.close();this.transport.removeAllListeners();this.readyState="closed";this.id=null;this.emit("close",reason,desc)}};Socket.prototype.filterUpgrades=function(upgrades){var filteredUpgrades=[];for(var i=0,j=upgrades.length;i<j;i++){if(~index(this.transports,upgrades[i]))filteredUpgrades.push(upgrades[i])}return filteredUpgrades}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./transport":14,"./transports":15,"component-emitter":9,debug:22,"engine.io-parser":25,indexof:42,parsejson:34,parseqs:35,parseuri:36}],14:[function(_dereq_,module,exports){var parser=_dereq_("engine.io-parser");var Emitter=_dereq_("component-emitter");module.exports=Transport;function Transport(opts){this.path=opts.path;this.hostname=opts.hostname;this.port=opts.port;this.secure=opts.secure;this.query=opts.query;this.timestampParam=opts.timestampParam;this.timestampRequests=opts.timestampRequests;this.readyState="";this.agent=opts.agent||false;this.socket=opts.socket;this.enablesXDR=opts.enablesXDR;this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized}Emitter(Transport.prototype);Transport.timestamps=0;Transport.prototype.onError=function(msg,desc){var err=new Error(msg);err.type="TransportError";err.description=desc;this.emit("error",err);return this};Transport.prototype.open=function(){if("closed"==this.readyState||""==this.readyState){this.readyState="opening";this.doOpen()}return this};Transport.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.doClose();this.onClose()}return this};Transport.prototype.send=function(packets){if("open"==this.readyState){this.write(packets)}else{throw new Error("Transport not open")}};Transport.prototype.onOpen=function(){this.readyState="open";this.writable=true;this.emit("open")};Transport.prototype.onData=function(data){var packet=parser.decodePacket(data,this.socket.binaryType);this.onPacket(packet)};Transport.prototype.onPacket=function(packet){this.emit("packet",packet)};Transport.prototype.onClose=function(){this.readyState="closed";this.emit("close")}},{"component-emitter":9,"engine.io-parser":25}],15:[function(_dereq_,module,exports){(function(global){var XMLHttpRequest=_dereq_("xmlhttprequest");var XHR=_dereq_("./polling-xhr");var JSONP=_dereq_("./polling-jsonp");var websocket=_dereq_("./websocket");exports.polling=polling;exports.websocket=websocket;function polling(opts){var xhr;var xd=false;var xs=false;var jsonp=false!==opts.jsonp;if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(!port){port=isSSL?443:80}xd=opts.hostname!=location.hostname||port!=opts.port;xs=opts.secure!=isSSL}opts.xdomain=xd;opts.xscheme=xs;xhr=new XMLHttpRequest(opts);if("open"in xhr&&!opts.forceJSONP){return new XHR(opts)}else{if(!jsonp)throw new Error("JSONP disabled");return new JSONP(opts)}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling-jsonp":16,"./polling-xhr":17,"./websocket":19,xmlhttprequest:20}],16:[function(_dereq_,module,exports){(function(global){var Polling=_dereq_("./polling");var inherit=_dereq_("component-inherit");module.exports=JSONPPolling;var rNewline=/\n/g;var rEscapedNewline=/\\n/g;var callbacks;var index=0;function empty(){}function JSONPPolling(opts){Polling.call(this,opts);
this.query=this.query||{};if(!callbacks){if(!global.___eio)global.___eio=[];callbacks=global.___eio}this.index=callbacks.length;var self=this;callbacks.push(function(msg){self.onData(msg)});this.query.j=this.index;if(global.document&&global.addEventListener){global.addEventListener("beforeunload",function(){if(self.script)self.script.onerror=empty},false)}}inherit(JSONPPolling,Polling);JSONPPolling.prototype.supportsBinary=false;JSONPPolling.prototype.doClose=function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}if(this.form){this.form.parentNode.removeChild(this.form);this.form=null;this.iframe=null}Polling.prototype.doClose.call(this)};JSONPPolling.prototype.doPoll=function(){var self=this;var script=document.createElement("script");if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}script.async=true;script.src=this.uri();script.onerror=function(e){self.onError("jsonp poll error",e)};var insertAt=document.getElementsByTagName("script")[0];insertAt.parentNode.insertBefore(script,insertAt);this.script=script;var isUAgecko="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);if(isUAgecko){setTimeout(function(){var iframe=document.createElement("iframe");document.body.appendChild(iframe);document.body.removeChild(iframe)},100)}};JSONPPolling.prototype.doWrite=function(data,fn){var self=this;if(!this.form){var form=document.createElement("form");var area=document.createElement("textarea");var id=this.iframeId="eio_iframe_"+this.index;var iframe;form.className="socketio";form.style.position="absolute";form.style.top="-1000px";form.style.left="-1000px";form.target=id;form.method="POST";form.setAttribute("accept-charset","utf-8");area.name="d";form.appendChild(area);document.body.appendChild(form);this.form=form;this.area=area}this.form.action=this.uri();function complete(){initIframe();fn()}function initIframe(){if(self.iframe){try{self.form.removeChild(self.iframe)}catch(e){self.onError("jsonp polling iframe removal error",e)}}try{var html='<iframe src="javascript:0" name="'+self.iframeId+'">';iframe=document.createElement(html)}catch(e){iframe=document.createElement("iframe");iframe.name=self.iframeId;iframe.src="javascript:0"}iframe.id=self.iframeId;self.form.appendChild(iframe);self.iframe=iframe}initIframe();data=data.replace(rEscapedNewline,"\\\n");this.area.value=data.replace(rNewline,"\\n");try{this.form.submit()}catch(e){}if(this.iframe.attachEvent){this.iframe.onreadystatechange=function(){if(self.iframe.readyState=="complete"){complete()}}}else{this.iframe.onload=complete}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling":18,"component-inherit":21}],17:[function(_dereq_,module,exports){(function(global){var XMLHttpRequest=_dereq_("xmlhttprequest");var Polling=_dereq_("./polling");var Emitter=_dereq_("component-emitter");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:polling-xhr");module.exports=XHR;module.exports.Request=Request;function empty(){}function XHR(opts){Polling.call(this,opts);if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(!port){port=isSSL?443:80}this.xd=opts.hostname!=global.location.hostname||port!=opts.port;this.xs=opts.secure!=isSSL}}inherit(XHR,Polling);XHR.prototype.supportsBinary=true;XHR.prototype.request=function(opts){opts=opts||{};opts.uri=this.uri();opts.xd=this.xd;opts.xs=this.xs;opts.agent=this.agent||false;opts.supportsBinary=this.supportsBinary;opts.enablesXDR=this.enablesXDR;opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;return new Request(opts)};XHR.prototype.doWrite=function(data,fn){var isBinary=typeof data!=="string"&&data!==undefined;var req=this.request({method:"POST",data:data,isBinary:isBinary});var self=this;req.on("success",fn);req.on("error",function(err){self.onError("xhr post error",err)});this.sendXhr=req};XHR.prototype.doPoll=function(){debug("xhr poll");var req=this.request();var self=this;req.on("data",function(data){self.onData(data)});req.on("error",function(err){self.onError("xhr poll error",err)});this.pollXhr=req};function Request(opts){this.method=opts.method||"GET";this.uri=opts.uri;this.xd=!!opts.xd;this.xs=!!opts.xs;this.async=false!==opts.async;this.data=undefined!=opts.data?opts.data:null;this.agent=opts.agent;this.isBinary=opts.isBinary;this.supportsBinary=opts.supportsBinary;this.enablesXDR=opts.enablesXDR;this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;this.create()}Emitter(Request.prototype);Request.prototype.create=function(){var opts={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;var xhr=this.xhr=new XMLHttpRequest(opts);var self=this;try{debug("xhr open %s: %s",this.method,this.uri);xhr.open(this.method,this.uri,this.async);if(this.supportsBinary){xhr.responseType="arraybuffer"}if("POST"==this.method){try{if(this.isBinary){xhr.setRequestHeader("Content-type","application/octet-stream")}else{xhr.setRequestHeader("Content-type","text/plain;charset=UTF-8")}}catch(e){}}if("withCredentials"in xhr){xhr.withCredentials=true}if(this.hasXDR()){xhr.onload=function(){self.onLoad()};xhr.onerror=function(){self.onError(xhr.responseText)}}else{xhr.onreadystatechange=function(){if(4!=xhr.readyState)return;if(200==xhr.status||1223==xhr.status){self.onLoad()}else{setTimeout(function(){self.onError(xhr.status)},0)}}}debug("xhr data %s",this.data);xhr.send(this.data)}catch(e){setTimeout(function(){self.onError(e)},0);return}if(global.document){this.index=Request.requestsCount++;Request.requests[this.index]=this}};Request.prototype.onSuccess=function(){this.emit("success");this.cleanup()};Request.prototype.onData=function(data){this.emit("data",data);this.onSuccess()};Request.prototype.onError=function(err){this.emit("error",err);this.cleanup(true)};Request.prototype.cleanup=function(fromError){if("undefined"==typeof this.xhr||null===this.xhr){return}if(this.hasXDR()){this.xhr.onload=this.xhr.onerror=empty}else{this.xhr.onreadystatechange=empty}if(fromError){try{this.xhr.abort()}catch(e){}}if(global.document){delete Request.requests[this.index]}this.xhr=null};Request.prototype.onLoad=function(){var data;try{var contentType;try{contentType=this.xhr.getResponseHeader("Content-Type").split(";")[0]}catch(e){}if(contentType==="application/octet-stream"){data=this.xhr.response}else{if(!this.supportsBinary){data=this.xhr.responseText}else{data="ok"}}}catch(e){this.onError(e)}if(null!=data){this.onData(data)}};Request.prototype.hasXDR=function(){return"undefined"!==typeof global.XDomainRequest&&!this.xs&&this.enablesXDR};Request.prototype.abort=function(){this.cleanup()};if(global.document){Request.requestsCount=0;Request.requests={};if(global.attachEvent){global.attachEvent("onunload",unloadHandler)}else if(global.addEventListener){global.addEventListener("beforeunload",unloadHandler,false)}}function unloadHandler(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort()}}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling":18,"component-emitter":9,"component-inherit":21,debug:22,xmlhttprequest:20}],18:[function(_dereq_,module,exports){var Transport=_dereq_("../transport");var parseqs=_dereq_("parseqs");var parser=_dereq_("engine.io-parser");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:polling");module.exports=Polling;var hasXHR2=function(){var XMLHttpRequest=_dereq_("xmlhttprequest");var xhr=new XMLHttpRequest({xdomain:false});return null!=xhr.responseType}();function Polling(opts){var forceBase64=opts&&opts.forceBase64;if(!hasXHR2||forceBase64){this.supportsBinary=false}Transport.call(this,opts)}inherit(Polling,Transport);Polling.prototype.name="polling";Polling.prototype.doOpen=function(){this.poll()};Polling.prototype.pause=function(onPause){var pending=0;var self=this;this.readyState="pausing";function pause(){debug("paused");self.readyState="paused";onPause()}if(this.polling||!this.writable){var total=0;if(this.polling){debug("we are currently polling - waiting to pause");total++;this.once("pollComplete",function(){debug("pre-pause polling complete");--total||pause()})}if(!this.writable){debug("we are currently writing - waiting to pause");total++;this.once("drain",function(){debug("pre-pause writing complete");--total||pause()})}}else{pause()}};Polling.prototype.poll=function(){debug("polling");this.polling=true;this.doPoll();this.emit("poll")};Polling.prototype.onData=function(data){var self=this;debug("polling got data %s",data);var callback=function(packet,index,total){if("opening"==self.readyState){self.onOpen()}if("close"==packet.type){self.onClose();return false}self.onPacket(packet)};parser.decodePayload(data,this.socket.binaryType,callback);if("closed"!=this.readyState){this.polling=false;this.emit("pollComplete");if("open"==this.readyState){this.poll()}else{debug('ignoring poll - transport state "%s"',this.readyState)}}};Polling.prototype.doClose=function(){var self=this;function close(){debug("writing close packet");self.write([{type:"close"}])}if("open"==this.readyState){debug("transport open - closing");close()}else{debug("transport not open - deferring close");this.once("open",close)}};Polling.prototype.write=function(packets){var self=this;this.writable=false;var callbackfn=function(){self.writable=true;self.emit("drain")};var self=this;parser.encodePayload(packets,this.supportsBinary,function(data){self.doWrite(data,callbackfn)})};Polling.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"https":"http";var port="";if(false!==this.timestampRequests){query[this.timestampParam]=+new Date+"-"+Transport.timestamps++}if(!this.supportsBinary&&!query.sid){query.b64=1}query=parseqs.encode(query);if(this.port&&("https"==schema&&this.port!=443||"http"==schema&&this.port!=80)){port=":"+this.port}if(query.length){query="?"+query}return schema+"://"+this.hostname+port+this.path+query}},{"../transport":14,"component-inherit":21,debug:22,"engine.io-parser":25,parseqs:35,xmlhttprequest:20}],19:[function(_dereq_,module,exports){var Transport=_dereq_("../transport");var parser=_dereq_("engine.io-parser");var parseqs=_dereq_("parseqs");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:websocket");var WebSocket=_dereq_("ws");module.exports=WS;function WS(opts){var forceBase64=opts&&opts.forceBase64;if(forceBase64){this.supportsBinary=false}Transport.call(this,opts)}inherit(WS,Transport);WS.prototype.name="websocket";WS.prototype.supportsBinary=true;WS.prototype.doOpen=function(){if(!this.check()){return}var self=this;var uri=this.uri();var protocols=void 0;var opts={agent:this.agent};opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;this.ws=new WebSocket(uri,protocols,opts);if(this.ws.binaryType===undefined){this.supportsBinary=false}this.ws.binaryType="arraybuffer";this.addEventListeners()};WS.prototype.addEventListeners=function(){var self=this;this.ws.onopen=function(){self.onOpen()};this.ws.onclose=function(){self.onClose()};this.ws.onmessage=function(ev){self.onData(ev.data)};this.ws.onerror=function(e){self.onError("websocket error",e)}};if("undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)){WS.prototype.onData=function(data){var self=this;setTimeout(function(){Transport.prototype.onData.call(self,data)},0)}}WS.prototype.write=function(packets){var self=this;this.writable=false;for(var i=0,l=packets.length;i<l;i++){parser.encodePacket(packets[i],this.supportsBinary,function(data){try{self.ws.send(data)}catch(e){debug("websocket closed before onclose event")}})}function ondrain(){self.writable=true;self.emit("drain")}setTimeout(ondrain,0)};WS.prototype.onClose=function(){Transport.prototype.onClose.call(this)};WS.prototype.doClose=function(){if(typeof this.ws!=="undefined"){this.ws.close()}};WS.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"wss":"ws";var port="";if(this.port&&("wss"==schema&&this.port!=443||"ws"==schema&&this.port!=80)){port=":"+this.port}if(this.timestampRequests){query[this.timestampParam]=+new Date}if(!this.supportsBinary){query.b64=1}query=parseqs.encode(query);if(query.length){query="?"+query}return schema+"://"+this.hostname+port+this.path+query};WS.prototype.check=function(){return!!WebSocket&&!("__initialize"in WebSocket&&this.name===WS.prototype.name)}},{"../transport":14,"component-inherit":21,debug:22,"engine.io-parser":25,parseqs:35,ws:37}],20:[function(_dereq_,module,exports){var hasCORS=_dereq_("has-cors");module.exports=function(opts){var xdomain=opts.xdomain;var xscheme=opts.xscheme;var enablesXDR=opts.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!xdomain||hasCORS)){return new XMLHttpRequest}}catch(e){}try{if("undefined"!=typeof XDomainRequest&&!xscheme&&enablesXDR){return new XDomainRequest}}catch(e){}if(!xdomain){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}}},{"has-cors":40}],21:[function(_dereq_,module,exports){module.exports=function(a,b){var fn=function(){};fn.prototype=b.prototype;a.prototype=new fn;a.prototype.constructor=a}},{}],22:[function(_dereq_,module,exports){exports=module.exports=_dereq_("./debug");exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"];function useColors(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}exports.formatters.j=function(v){return JSON.stringify(v)};function formatArgs(){var args=arguments;var useColors=this.useColors;args[0]=(useColors?"%c":"")+this.namespace+(useColors?" %c":" ")+args[0]+(useColors?"%c ":" ")+"+"+exports.humanize(this.diff);if(!useColors)return args;var c="color: "+this.color;args=[args[0],c,"color: inherit"].concat(Array.prototype.slice.call(args,1));var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if("%"===match)return;index++;if("%c"===match){lastC=index}});args.splice(lastC,0,c);return args}function log(){return"object"==typeof console&&"function"==typeof console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(namespaces){try{if(null==namespaces){localStorage.removeItem("debug")}else{localStorage.debug=namespaces}}catch(e){}}function load(){var r;try{r=localStorage.debug}catch(e){}return r}exports.enable(load())},{"./debug":23}],23:[function(_dereq_,module,exports){exports=module.exports=debug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=_dereq_("ms");exports.names=[];exports.skips=[];exports.formatters={};var prevColor=0;var prevTime;function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(namespace){function disabled(){}disabled.enabled=false;function enabled(){var self=enabled;var curr=+new Date;var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;if(null==self.useColors)self.useColors=exports.useColors();if(null==self.color&&self.useColors)self.color=selectColor();var args=Array.prototype.slice.call(arguments);args[0]=exports.coerce(args[0]);if("string"!==typeof args[0]){args=["%o"].concat(args)}var index=0;args[0]=args[0].replace(/%([a-z%])/g,function(match,format){if(match==="%")return match;index++;var formatter=exports.formatters[format];if("function"===typeof formatter){var val=args[index];match=formatter.call(self,val);args.splice(index,1);index--}return match});if("function"===typeof exports.formatArgs){args=exports.formatArgs.apply(self,args)}var logFn=enabled.log||exports.log||console.log.bind(console);logFn.apply(self,args)}enabled.enabled=true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace=namespace;return fn}function enable(namespaces){exports.save(namespaces);var split=(namespaces||"").split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;namespaces=split[i].replace(/\*/g,".*?");if(namespaces[0]==="-"){exports.skips.push(new RegExp("^"+namespaces.substr(1)+"$"))}else{exports.names.push(new RegExp("^"+namespaces+"$"))}}}function disable(){exports.enable("")}function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true}}return false}function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}},{ms:24}],24:[function(_dereq_,module,exports){var s=1e3;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;module.exports=function(val,options){options=options||{};if("string"==typeof val)return parse(val);return options.long?long(val):short(val)};function parse(str){var match=/^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);if(!match)return;var n=parseFloat(match[1]);var type=(match[2]||"ms").toLowerCase();switch(type){case"years":case"year":case"y":return n*y;case"days":case"day":case"d":return n*d;case"hours":case"hour":case"h":return n*h;case"minutes":case"minute":case"m":return n*m;case"seconds":case"second":case"s":return n*s;case"ms":return n}}function short(ms){if(ms>=d)return Math.round(ms/d)+"d";if(ms>=h)return Math.round(ms/h)+"h";if(ms>=m)return Math.round(ms/m)+"m";if(ms>=s)return Math.round(ms/s)+"s";return ms+"ms"}function long(ms){return plural(ms,d,"day")||plural(ms,h,"hour")||plural(ms,m,"minute")||plural(ms,s,"second")||ms+" ms"}function plural(ms,n,name){if(ms<n)return;if(ms<n*1.5)return Math.floor(ms/n)+" "+name;return Math.ceil(ms/n)+" "+name+"s"}},{}],25:[function(_dereq_,module,exports){(function(global){var keys=_dereq_("./keys");var hasBinary=_dereq_("has-binary");var sliceBuffer=_dereq_("arraybuffer.slice");var base64encoder=_dereq_("base64-arraybuffer");var after=_dereq_("after");var utf8=_dereq_("utf8");var isAndroid=navigator.userAgent.match(/Android/i);var isPhantomJS=/PhantomJS/i.test(navigator.userAgent);var dontSendBlobs=isAndroid||isPhantomJS;exports.protocol=3;var packets=exports.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=keys(packets);var err={type:"error",data:"parser error"};var Blob=_dereq_("blob");exports.encodePacket=function(packet,supportsBinary,utf8encode,callback){if("function"==typeof supportsBinary){callback=supportsBinary;supportsBinary=false}if("function"==typeof utf8encode){callback=utf8encode;utf8encode=null}var data=packet.data===undefined?undefined:packet.data.buffer||packet.data;if(global.ArrayBuffer&&data instanceof ArrayBuffer){return encodeArrayBuffer(packet,supportsBinary,callback)}else if(Blob&&data instanceof global.Blob){return encodeBlob(packet,supportsBinary,callback)}if(data&&data.base64){return encodeBase64Object(packet,callback)}var encoded=packets[packet.type];if(undefined!==packet.data){encoded+=utf8encode?utf8.encode(String(packet.data)):String(packet.data)}return callback(""+encoded)};function encodeBase64Object(packet,callback){var message="b"+exports.packets[packet.type]+packet.data.data;return callback(message)}function encodeArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}var data=packet.data;var contentArray=new Uint8Array(data);var resultBuffer=new Uint8Array(1+data.byteLength);resultBuffer[0]=packets[packet.type];for(var i=0;i<contentArray.length;i++){resultBuffer[i+1]=contentArray[i]}return callback(resultBuffer.buffer)}function encodeBlobAsArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}var fr=new FileReader;fr.onload=function(){packet.data=fr.result;exports.encodePacket(packet,supportsBinary,true,callback)};return fr.readAsArrayBuffer(packet.data)}function encodeBlob(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}if(dontSendBlobs){return encodeBlobAsArrayBuffer(packet,supportsBinary,callback)}var length=new Uint8Array(1);length[0]=packets[packet.type];var blob=new Blob([length.buffer,packet.data]);return callback(blob)}exports.encodeBase64Packet=function(packet,callback){var message="b"+exports.packets[packet.type];if(Blob&&packet.data instanceof Blob){var fr=new FileReader;fr.onload=function(){var b64=fr.result.split(",")[1];callback(message+b64)};return fr.readAsDataURL(packet.data)}var b64data;try{b64data=String.fromCharCode.apply(null,new Uint8Array(packet.data))}catch(e){var typed=new Uint8Array(packet.data);var basic=new Array(typed.length);for(var i=0;i<typed.length;i++){basic[i]=typed[i]}b64data=String.fromCharCode.apply(null,basic)}message+=global.btoa(b64data);return callback(message)};exports.decodePacket=function(data,binaryType,utf8decode){if(typeof data=="string"||data===undefined){if(data.charAt(0)=="b"){return exports.decodeBase64Packet(data.substr(1),binaryType)}if(utf8decode){try{data=utf8.decode(data)}catch(e){return err}}var type=data.charAt(0);if(Number(type)!=type||!packetslist[type]){return err}if(data.length>1){return{type:packetslist[type],data:data.substring(1)}}else{return{type:packetslist[type]}}}var asArray=new Uint8Array(data);var type=asArray[0];var rest=sliceBuffer(data,1);if(Blob&&binaryType==="blob"){rest=new Blob([rest])}return{type:packetslist[type],data:rest}};exports.decodeBase64Packet=function(msg,binaryType){var type=packetslist[msg.charAt(0)];if(!global.ArrayBuffer){return{type:type,data:{base64:true,data:msg.substr(1)}}}var data=base64encoder.decode(msg.substr(1));if(binaryType==="blob"&&Blob){data=new Blob([data])}return{type:type,data:data}};exports.encodePayload=function(packets,supportsBinary,callback){if(typeof supportsBinary=="function"){callback=supportsBinary;supportsBinary=null}var isBinary=hasBinary(packets);if(supportsBinary&&isBinary){if(Blob&&!dontSendBlobs){return exports.encodePayloadAsBlob(packets,callback)}return exports.encodePayloadAsArrayBuffer(packets,callback)}if(!packets.length){return callback("0:")}function setLengthHeader(message){return message.length+":"+message}function encodeOne(packet,doneCallback){exports.encodePacket(packet,!isBinary?false:supportsBinary,true,function(message){doneCallback(null,setLengthHeader(message))})}map(packets,encodeOne,function(err,results){return callback(results.join(""))})};function map(ary,each,done){var result=new Array(ary.length);var next=after(ary.length,done);var eachWithIndex=function(i,el,cb){each(el,function(error,msg){result[i]=msg;cb(error,result)})};for(var i=0;i<ary.length;i++){eachWithIndex(i,ary[i],next)}}exports.decodePayload=function(data,binaryType,callback){if(typeof data!="string"){return exports.decodePayloadAsBinary(data,binaryType,callback)}if(typeof binaryType==="function"){callback=binaryType;binaryType=null}var packet;if(data==""){return callback(err,0,1)}var length="",n,msg;for(var i=0,l=data.length;i<l;i++){var chr=data.charAt(i);if(":"!=chr){length+=chr}else{if(""==length||length!=(n=Number(length))){return callback(err,0,1)}msg=data.substr(i+1,n);if(length!=msg.length){return callback(err,0,1)}if(msg.length){packet=exports.decodePacket(msg,binaryType,true);if(err.type==packet.type&&err.data==packet.data){return callback(err,0,1)}var ret=callback(packet,i+n,l);if(false===ret)return}i+=n;length=""}}if(length!=""){return callback(err,0,1)}};exports.encodePayloadAsArrayBuffer=function(packets,callback){if(!packets.length){return callback(new ArrayBuffer(0))}function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(data){return doneCallback(null,data)})}map(packets,encodeOne,function(err,encodedPackets){var totalLength=encodedPackets.reduce(function(acc,p){var len;if(typeof p==="string"){len=p.length}else{len=p.byteLength}return acc+len.toString().length+len+2},0);var resultArray=new Uint8Array(totalLength);var bufferIndex=0;encodedPackets.forEach(function(p){var isString=typeof p==="string";var ab=p;if(isString){var view=new Uint8Array(p.length);for(var i=0;i<p.length;i++){view[i]=p.charCodeAt(i)}ab=view.buffer}if(isString){resultArray[bufferIndex++]=0}else{resultArray[bufferIndex++]=1}var lenStr=ab.byteLength.toString();for(var i=0;i<lenStr.length;i++){resultArray[bufferIndex++]=parseInt(lenStr[i])}resultArray[bufferIndex++]=255;var view=new Uint8Array(ab);for(var i=0;i<view.length;i++){resultArray[bufferIndex++]=view[i]}});return callback(resultArray.buffer)})};exports.encodePayloadAsBlob=function(packets,callback){function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(encoded){var binaryIdentifier=new Uint8Array(1);binaryIdentifier[0]=1;if(typeof encoded==="string"){var view=new Uint8Array(encoded.length);for(var i=0;i<encoded.length;i++){view[i]=encoded.charCodeAt(i)}encoded=view.buffer;binaryIdentifier[0]=0}var len=encoded instanceof ArrayBuffer?encoded.byteLength:encoded.size;var lenStr=len.toString();var lengthAry=new Uint8Array(lenStr.length+1);for(var i=0;i<lenStr.length;i++){lengthAry[i]=parseInt(lenStr[i])}lengthAry[lenStr.length]=255;if(Blob){var blob=new Blob([binaryIdentifier.buffer,lengthAry.buffer,encoded]);doneCallback(null,blob)}})}map(packets,encodeOne,function(err,results){return callback(new Blob(results))})};exports.decodePayloadAsBinary=function(data,binaryType,callback){if(typeof binaryType==="function"){callback=binaryType;binaryType=null}var bufferTail=data;var buffers=[];var numberTooLong=false;while(bufferTail.byteLength>0){var tailArray=new Uint8Array(bufferTail);var isString=tailArray[0]===0;var msgLength="";for(var i=1;;i++){if(tailArray[i]==255)break;if(msgLength.length>310){numberTooLong=true;break}msgLength+=tailArray[i]}if(numberTooLong)return callback(err,0,1);bufferTail=sliceBuffer(bufferTail,2+msgLength.length);msgLength=parseInt(msgLength);var msg=sliceBuffer(bufferTail,0,msgLength);if(isString){try{msg=String.fromCharCode.apply(null,new Uint8Array(msg))}catch(e){var typed=new Uint8Array(msg);msg="";for(var i=0;i<typed.length;i++){msg+=String.fromCharCode(typed[i])}}}buffers.push(msg);bufferTail=sliceBuffer(bufferTail,msgLength)}var total=buffers.length;buffers.forEach(function(buffer,i){callback(exports.decodePacket(buffer,binaryType,true),i,total)})}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./keys":26,after:27,"arraybuffer.slice":28,"base64-arraybuffer":29,blob:30,"has-binary":31,utf8:33}],26:[function(_dereq_,module,exports){module.exports=Object.keys||function keys(obj){var arr=[];var has=Object.prototype.hasOwnProperty;for(var i in obj){if(has.call(obj,i)){arr.push(i)}}return arr}},{}],27:[function(_dereq_,module,exports){module.exports=after;function after(count,callback,err_cb){var bail=false;err_cb=err_cb||noop;proxy.count=count;return count===0?callback():proxy;function proxy(err,result){if(proxy.count<=0){throw new Error("after called too many times")}--proxy.count;if(err){bail=true;callback(err);callback=err_cb}else if(proxy.count===0&&!bail){callback(null,result)}}}function noop(){}},{}],28:[function(_dereq_,module,exports){module.exports=function(arraybuffer,start,end){var bytes=arraybuffer.byteLength;start=start||0;end=end||bytes;if(arraybuffer.slice){return arraybuffer.slice(start,end)}if(start<0){start+=bytes}if(end<0){end+=bytes}if(end>bytes){end=bytes}if(start>=bytes||start>=end||bytes===0){return new ArrayBuffer(0)}var abv=new Uint8Array(arraybuffer);var result=new Uint8Array(end-start);for(var i=start,ii=0;i<end;i++,ii++){result[ii]=abv[i]}return result.buffer}},{}],29:[function(_dereq_,module,exports){(function(chars){"use strict";exports.encode=function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i=0;i<len;i+=3){base64+=chars[bytes[i]>>2];base64+=chars[(bytes[i]&3)<<4|bytes[i+1]>>4];base64+=chars[(bytes[i+1]&15)<<2|bytes[i+2]>>6];base64+=chars[bytes[i+2]&63]}if(len%3===2){base64=base64.substring(0,base64.length-1)+"="}else if(len%3===1){base64=base64.substring(0,base64.length-2)+"=="}return base64};exports.decode=function(base64){var bufferLength=base64.length*.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==="="){bufferLength--;if(base64[base64.length-2]==="="){bufferLength--}}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=chars.indexOf(base64[i]);encoded2=chars.indexOf(base64[i+1]);encoded3=chars.indexOf(base64[i+2]);encoded4=chars.indexOf(base64[i+3]);bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63}return arraybuffer}})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],30:[function(_dereq_,module,exports){(function(global){var BlobBuilder=global.BlobBuilder||global.WebKitBlobBuilder||global.MSBlobBuilder||global.MozBlobBuilder;var blobSupported=function(){try{var b=new Blob(["hi"]);return b.size==2}catch(e){return false}}();var blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;function BlobBuilderConstructor(ary,options){options=options||{};var bb=new BlobBuilder;for(var i=0;i<ary.length;i++){bb.append(ary[i])}return options.type?bb.getBlob(options.type):bb.getBlob()}module.exports=function(){if(blobSupported){return global.Blob}else if(blobBuilderSupported){return BlobBuilderConstructor}else{return undefined}}()}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],31:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");module.exports=hasBinary;function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true}}}else if(obj&&"object"==typeof obj){if(obj.toJSON){obj=obj.toJSON()}for(var key in obj){if(obj.hasOwnProperty(key)&&_hasBinary(obj[key])){return true}}}return false}return _hasBinary(data)}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{isarray:32}],32:[function(_dereq_,module,exports){module.exports=Array.isArray||function(arr){return Object.prototype.toString.call(arr)=="[object Array]"}},{}],33:[function(_dereq_,module,exports){(function(global){(function(root){var freeExports=typeof exports=="object"&&exports;var freeModule=typeof module=="object"&&module&&module.exports==freeExports&&module;var freeGlobal=typeof global=="object"&&global;if(freeGlobal.global===freeGlobal||freeGlobal.window===freeGlobal){root=freeGlobal}var stringFromCharCode=String.fromCharCode;function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter<length){value=string.charCodeAt(counter++);if(value>=55296&&value<=56319&&counter<length){extra=string.charCodeAt(counter++);if((extra&64512)==56320){output.push(((value&1023)<<10)+(extra&1023)+65536)}else{output.push(value);counter--}}else{output.push(value)}}return output}function ucs2encode(array){var length=array.length;var index=-1;var value;var output="";while(++index<length){value=array[index];if(value>65535){value-=65536;
output+=stringFromCharCode(value>>>10&1023|55296);value=56320|value&1023}output+=stringFromCharCode(value)}return output}function createByte(codePoint,shift){return stringFromCharCode(codePoint>>shift&63|128)}function encodeCodePoint(codePoint){if((codePoint&4294967168)==0){return stringFromCharCode(codePoint)}var symbol="";if((codePoint&4294965248)==0){symbol=stringFromCharCode(codePoint>>6&31|192)}else if((codePoint&4294901760)==0){symbol=stringFromCharCode(codePoint>>12&15|224);symbol+=createByte(codePoint,6)}else if((codePoint&4292870144)==0){symbol=stringFromCharCode(codePoint>>18&7|240);symbol+=createByte(codePoint,12);symbol+=createByte(codePoint,6)}symbol+=stringFromCharCode(codePoint&63|128);return symbol}function utf8encode(string){var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString="";while(++index<length){codePoint=codePoints[index];byteString+=encodeCodePoint(codePoint)}return byteString}function readContinuationByte(){if(byteIndex>=byteCount){throw Error("Invalid byte index")}var continuationByte=byteArray[byteIndex]&255;byteIndex++;if((continuationByte&192)==128){return continuationByte&63}throw Error("Invalid continuation byte")}function decodeSymbol(){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex>byteCount){throw Error("Invalid byte index")}if(byteIndex==byteCount){return false}byte1=byteArray[byteIndex]&255;byteIndex++;if((byte1&128)==0){return byte1}if((byte1&224)==192){var byte2=readContinuationByte();codePoint=(byte1&31)<<6|byte2;if(codePoint>=128){return codePoint}else{throw Error("Invalid continuation byte")}}if((byte1&240)==224){byte2=readContinuationByte();byte3=readContinuationByte();codePoint=(byte1&15)<<12|byte2<<6|byte3;if(codePoint>=2048){return codePoint}else{throw Error("Invalid continuation byte")}}if((byte1&248)==240){byte2=readContinuationByte();byte3=readContinuationByte();byte4=readContinuationByte();codePoint=(byte1&15)<<18|byte2<<12|byte3<<6|byte4;if(codePoint>=65536&&codePoint<=1114111){return codePoint}}throw Error("Invalid UTF-8 detected")}var byteArray;var byteCount;var byteIndex;function utf8decode(byteString){byteArray=ucs2decode(byteString);byteCount=byteArray.length;byteIndex=0;var codePoints=[];var tmp;while((tmp=decodeSymbol())!==false){codePoints.push(tmp)}return ucs2encode(codePoints)}var utf8={version:"2.0.0",encode:utf8encode,decode:utf8decode};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd){define(function(){return utf8})}else if(freeExports&&!freeExports.nodeType){if(freeModule){freeModule.exports=utf8}else{var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in utf8){hasOwnProperty.call(utf8,key)&&(freeExports[key]=utf8[key])}}}else{root.utf8=utf8}})(this)}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],34:[function(_dereq_,module,exports){(function(global){var rvalidchars=/^[\],:{}\s]*$/;var rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g;var rtrimLeft=/^\s+/;var rtrimRight=/\s+$/;module.exports=function parsejson(data){if("string"!=typeof data||!data){return null}data=data.replace(rtrimLeft,"").replace(rtrimRight,"");if(global.JSON&&JSON.parse){return JSON.parse(data)}if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return new Function("return "+data)()}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],35:[function(_dereq_,module,exports){exports.encode=function(obj){var str="";for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+="&";str+=encodeURIComponent(i)+"="+encodeURIComponent(obj[i])}}return str};exports.decode=function(qs){var qry={};var pairs=qs.split("&");for(var i=0,l=pairs.length;i<l;i++){var pair=pairs[i].split("=");qry[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1])}return qry}},{}],36:[function(_dereq_,module,exports){var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function parseuri(str){var src=str,b=str.indexOf("["),e=str.indexOf("]");if(b!=-1&&e!=-1){str=str.substring(0,b)+str.substring(b,e).replace(/:/g,";")+str.substring(e,str.length)}var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}if(b!=-1&&e!=-1){uri.source=src;uri.host=uri.host.substring(1,uri.host.length-1).replace(/;/g,":");uri.authority=uri.authority.replace("[","").replace("]","").replace(/;/g,":");uri.ipv6uri=true}return uri}},{}],37:[function(_dereq_,module,exports){var global=function(){return this}();var WebSocket=global.WebSocket||global.MozWebSocket;module.exports=WebSocket?ws:null;function ws(uri,protocols,opts){var instance;if(protocols){instance=new WebSocket(uri,protocols)}else{instance=new WebSocket(uri)}return instance}if(WebSocket)ws.prototype=WebSocket.prototype},{}],38:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");module.exports=hasBinary;function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true}}}else if(obj&&"object"==typeof obj){if(obj.toJSON){obj=obj.toJSON()}for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)&&_hasBinary(obj[key])){return true}}}return false}return _hasBinary(data)}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{isarray:39}],39:[function(_dereq_,module,exports){module.exports=_dereq_(32)},{}],40:[function(_dereq_,module,exports){var global=_dereq_("global");try{module.exports="XMLHttpRequest"in global&&"withCredentials"in new global.XMLHttpRequest}catch(err){module.exports=false}},{global:41}],41:[function(_dereq_,module,exports){module.exports=function(){return this}()},{}],42:[function(_dereq_,module,exports){var indexOf=[].indexOf;module.exports=function(arr,obj){if(indexOf)return arr.indexOf(obj);for(var i=0;i<arr.length;++i){if(arr[i]===obj)return i}return-1}},{}],43:[function(_dereq_,module,exports){var has=Object.prototype.hasOwnProperty;exports.keys=Object.keys||function(obj){var keys=[];for(var key in obj){if(has.call(obj,key)){keys.push(key)}}return keys};exports.values=function(obj){var vals=[];for(var key in obj){if(has.call(obj,key)){vals.push(obj[key])}}return vals};exports.merge=function(a,b){for(var key in b){if(has.call(b,key)){a[key]=b[key]}}return a};exports.length=function(obj){return exports.keys(obj).length};exports.isEmpty=function(obj){return 0==exports.length(obj)}},{}],44:[function(_dereq_,module,exports){var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function parseuri(str){var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}return uri}},{}],45:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");var isBuf=_dereq_("./is-buffer");exports.deconstructPacket=function(packet){var buffers=[];var packetData=packet.data;function _deconstructPacket(data){if(!data)return data;if(isBuf(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder}else if(isArray(data)){var newData=new Array(data.length);for(var i=0;i<data.length;i++){newData[i]=_deconstructPacket(data[i])}return newData}else if("object"==typeof data&&!(data instanceof Date)){var newData={};for(var key in data){newData[key]=_deconstructPacket(data[key])}return newData}return data}var pack=packet;pack.data=_deconstructPacket(packetData);pack.attachments=buffers.length;return{packet:pack,buffers:buffers}};exports.reconstructPacket=function(packet,buffers){var curPlaceHolder=0;function _reconstructPacket(data){if(data&&data._placeholder){var buf=buffers[data.num];return buf}else if(isArray(data)){for(var i=0;i<data.length;i++){data[i]=_reconstructPacket(data[i])}return data}else if(data&&"object"==typeof data){for(var key in data){data[key]=_reconstructPacket(data[key])}return data}return data}packet.data=_reconstructPacket(packet.data);packet.attachments=undefined;return packet};exports.removeBlobs=function(data,callback){function _removeBlobs(obj,curKey,containingObject){if(!obj)return obj;if(global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){pendingBlobs++;var fileReader=new FileReader;fileReader.onload=function(){if(containingObject){containingObject[curKey]=this.result}else{bloblessData=this.result}if(!--pendingBlobs){callback(bloblessData)}};fileReader.readAsArrayBuffer(obj)}else if(isArray(obj)){for(var i=0;i<obj.length;i++){_removeBlobs(obj[i],i,obj)}}else if(obj&&"object"==typeof obj&&!isBuf(obj)){for(var key in obj){_removeBlobs(obj[key],key,obj)}}}var pendingBlobs=0;var bloblessData=data;_removeBlobs(bloblessData);if(!pendingBlobs){callback(bloblessData)}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./is-buffer":47,isarray:48}],46:[function(_dereq_,module,exports){var debug=_dereq_("debug")("socket.io-parser");var json=_dereq_("json3");var isArray=_dereq_("isarray");var Emitter=_dereq_("component-emitter");var binary=_dereq_("./binary");var isBuf=_dereq_("./is-buffer");exports.protocol=4;exports.types=["CONNECT","DISCONNECT","EVENT","BINARY_EVENT","ACK","BINARY_ACK","ERROR"];exports.CONNECT=0;exports.DISCONNECT=1;exports.EVENT=2;exports.ACK=3;exports.ERROR=4;exports.BINARY_EVENT=5;exports.BINARY_ACK=6;exports.Encoder=Encoder;exports.Decoder=Decoder;function Encoder(){}Encoder.prototype.encode=function(obj,callback){debug("encoding packet %j",obj);if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){encodeAsBinary(obj,callback)}else{var encoding=encodeAsString(obj);callback([encoding])}};function encodeAsString(obj){var str="";var nsp=false;str+=obj.type;if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){str+=obj.attachments;str+="-"}if(obj.nsp&&"/"!=obj.nsp){nsp=true;str+=obj.nsp}if(null!=obj.id){if(nsp){str+=",";nsp=false}str+=obj.id}if(null!=obj.data){if(nsp)str+=",";str+=json.stringify(obj.data)}debug("encoded %j as %s",obj,str);return str}function encodeAsBinary(obj,callback){function writeEncoding(bloblessData){var deconstruction=binary.deconstructPacket(bloblessData);var pack=encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack);callback(buffers)}binary.removeBlobs(obj,writeEncoding)}function Decoder(){this.reconstructor=null}Emitter(Decoder.prototype);Decoder.prototype.add=function(obj){var packet;if("string"==typeof obj){packet=decodeString(obj);if(exports.BINARY_EVENT==packet.type||exports.BINARY_ACK==packet.type){this.reconstructor=new BinaryReconstructor(packet);if(this.reconstructor.reconPack.attachments===0){this.emit("decoded",packet)}}else{this.emit("decoded",packet)}}else if(isBuf(obj)||obj.base64){if(!this.reconstructor){throw new Error("got binary data when not reconstructing a packet")}else{packet=this.reconstructor.takeBinaryData(obj);if(packet){this.reconstructor=null;this.emit("decoded",packet)}}}else{throw new Error("Unknown type: "+obj)}};function decodeString(str){var p={};var i=0;p.type=Number(str.charAt(0));if(null==exports.types[p.type])return error();if(exports.BINARY_EVENT==p.type||exports.BINARY_ACK==p.type){var buf="";while(str.charAt(++i)!="-"){buf+=str.charAt(i);if(i==str.length)break}if(buf!=Number(buf)||str.charAt(i)!="-"){throw new Error("Illegal attachments")}p.attachments=Number(buf)}if("/"==str.charAt(i+1)){p.nsp="";while(++i){var c=str.charAt(i);if(","==c)break;p.nsp+=c;if(i==str.length)break}}else{p.nsp="/"}var next=str.charAt(i+1);if(""!==next&&Number(next)==next){p.id="";while(++i){var c=str.charAt(i);if(null==c||Number(c)!=c){--i;break}p.id+=str.charAt(i);if(i==str.length)break}p.id=Number(p.id)}if(str.charAt(++i)){try{p.data=json.parse(str.substr(i))}catch(e){return error()}}debug("decoded %s as %j",str,p);return p}Decoder.prototype.destroy=function(){if(this.reconstructor){this.reconstructor.finishedReconstruction()}};function BinaryReconstructor(packet){this.reconPack=packet;this.buffers=[]}BinaryReconstructor.prototype.takeBinaryData=function(binData){this.buffers.push(binData);if(this.buffers.length==this.reconPack.attachments){var packet=binary.reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet}return null};BinaryReconstructor.prototype.finishedReconstruction=function(){this.reconPack=null;this.buffers=[]};function error(data){return{type:exports.ERROR,data:"parser error"}}},{"./binary":45,"./is-buffer":47,"component-emitter":9,debug:10,isarray:48,json3:49}],47:[function(_dereq_,module,exports){(function(global){module.exports=isBuf;function isBuf(obj){return global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],48:[function(_dereq_,module,exports){module.exports=_dereq_(32)},{}],49:[function(_dereq_,module,exports){(function(window){var getClass={}.toString,isProperty,forEach,undef;var isLoader=typeof define==="function"&&define.amd;var nativeJSON=typeof JSON=="object"&&JSON;var JSON3=typeof exports=="object"&&exports&&!exports.nodeType&&exports;if(JSON3&&nativeJSON){JSON3.stringify=nativeJSON.stringify;JSON3.parse=nativeJSON.parse}else{JSON3=window.JSON=nativeJSON||{}}var isExtended=new Date(-0xc782b5b800cec);try{isExtended=isExtended.getUTCFullYear()==-109252&&isExtended.getUTCMonth()===0&&isExtended.getUTCDate()===1&&isExtended.getUTCHours()==10&&isExtended.getUTCMinutes()==37&&isExtended.getUTCSeconds()==6&&isExtended.getUTCMilliseconds()==708}catch(exception){}function has(name){if(has[name]!==undef){return has[name]}var isSupported;if(name=="bug-string-char-index"){isSupported="a"[0]!="a"}else if(name=="json"){isSupported=has("json-stringify")&&has("json-parse")}else{var value,serialized='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if(name=="json-stringify"){var stringify=JSON3.stringify,stringifySupported=typeof stringify=="function"&&isExtended;if(stringifySupported){(value=function(){return 1}).toJSON=value;try{stringifySupported=stringify(0)==="0"&&stringify(new Number)==="0"&&stringify(new String)=='""'&&stringify(getClass)===undef&&stringify(undef)===undef&&stringify()===undef&&stringify(value)==="1"&&stringify([value])=="[1]"&&stringify([undef])=="[null]"&&stringify(null)=="null"&&stringify([undef,getClass,null])=="[null,null,null]"&&stringify({a:[value,true,false,null,"\x00\b\n\f\r	"]})==serialized&&stringify(null,value)==="1"&&stringify([1,2],null,1)=="[\n 1,\n 2\n]"&&stringify(new Date(-864e13))=='"-271821-04-20T00:00:00.000Z"'&&stringify(new Date(864e13))=='"+275760-09-13T00:00:00.000Z"'&&stringify(new Date(-621987552e5))=='"-000001-01-01T00:00:00.000Z"'&&stringify(new Date(-1))=='"1969-12-31T23:59:59.999Z"'}catch(exception){stringifySupported=false}}isSupported=stringifySupported}if(name=="json-parse"){var parse=JSON3.parse;if(typeof parse=="function"){try{if(parse("0")===0&&!parse(false)){value=parse(serialized);var parseSupported=value["a"].length==5&&value["a"][0]===1;if(parseSupported){try{parseSupported=!parse('"	"')}catch(exception){}if(parseSupported){try{parseSupported=parse("01")!==1}catch(exception){}}if(parseSupported){try{parseSupported=parse("1.")!==1}catch(exception){}}}}}catch(exception){parseSupported=false}}isSupported=parseSupported}}return has[name]=!!isSupported}if(!has("json")){var functionClass="[object Function]";var dateClass="[object Date]";var numberClass="[object Number]";var stringClass="[object String]";var arrayClass="[object Array]";var booleanClass="[object Boolean]";var charIndexBuggy=has("bug-string-char-index");if(!isExtended){var floor=Math.floor;var Months=[0,31,59,90,120,151,181,212,243,273,304,334];var getDay=function(year,month){return Months[month]+365*(year-1970)+floor((year-1969+(month=+(month>1)))/4)-floor((year-1901+month)/100)+floor((year-1601+month)/400)}}if(!(isProperty={}.hasOwnProperty)){isProperty=function(property){var members={},constructor;if((members.__proto__=null,members.__proto__={toString:1},members).toString!=getClass){isProperty=function(property){var original=this.__proto__,result=property in(this.__proto__=null,this);this.__proto__=original;return result}}else{constructor=members.constructor;isProperty=function(property){var parent=(this.constructor||constructor).prototype;return property in this&&!(property in parent&&this[property]===parent[property])}}members=null;return isProperty.call(this,property)}}var PrimitiveTypes={"boolean":1,number:1,string:1,undefined:1};var isHostType=function(object,property){var type=typeof object[property];return type=="object"?!!object[property]:!PrimitiveTypes[type]};forEach=function(object,callback){var size=0,Properties,members,property;(Properties=function(){this.valueOf=0}).prototype.valueOf=0;members=new Properties;for(property in members){if(isProperty.call(members,property)){size++}}Properties=members=null;if(!size){members=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];forEach=function(object,callback){var isFunction=getClass.call(object)==functionClass,property,length;var hasProperty=!isFunction&&typeof object.constructor!="function"&&isHostType(object,"hasOwnProperty")?object.hasOwnProperty:isProperty;for(property in object){if(!(isFunction&&property=="prototype")&&hasProperty.call(object,property)){callback(property)}}for(length=members.length;property=members[--length];hasProperty.call(object,property)&&callback(property));}}else if(size==2){forEach=function(object,callback){var members={},isFunction=getClass.call(object)==functionClass,property;for(property in object){if(!(isFunction&&property=="prototype")&&!isProperty.call(members,property)&&(members[property]=1)&&isProperty.call(object,property)){callback(property)}}}}else{forEach=function(object,callback){var isFunction=getClass.call(object)==functionClass,property,isConstructor;for(property in object){if(!(isFunction&&property=="prototype")&&isProperty.call(object,property)&&!(isConstructor=property==="constructor")){callback(property)}}if(isConstructor||isProperty.call(object,property="constructor")){callback(property)}}}return forEach(object,callback)};if(!has("json-stringify")){var Escapes={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"};var leadingZeroes="000000";var toPaddedString=function(width,value){return(leadingZeroes+(value||0)).slice(-width)};var unicodePrefix="\\u00";var quote=function(value){var result='"',index=0,length=value.length,isLarge=length>10&&charIndexBuggy,symbols;if(isLarge){symbols=value.split("")}for(;index<length;index++){var charCode=value.charCodeAt(index);switch(charCode){case 8:case 9:case 10:case 12:case 13:case 34:case 92:result+=Escapes[charCode];break;default:if(charCode<32){result+=unicodePrefix+toPaddedString(2,charCode.toString(16));break}result+=isLarge?symbols[index]:charIndexBuggy?value.charAt(index):value[index]}}return result+'"'};var serialize=function(property,object,callback,properties,whitespace,indentation,stack){var value,className,year,month,date,time,hours,minutes,seconds,milliseconds,results,element,index,length,prefix,result;try{value=object[property]}catch(exception){}if(typeof value=="object"&&value){className=getClass.call(value);if(className==dateClass&&!isProperty.call(value,"toJSON")){if(value>-1/0&&value<1/0){if(getDay){date=floor(value/864e5);for(year=floor(date/365.2425)+1970-1;getDay(year+1,0)<=date;year++);for(month=floor((date-getDay(year,0))/30.42);getDay(year,month+1)<=date;month++);date=1+date-getDay(year,month);time=(value%864e5+864e5)%864e5;hours=floor(time/36e5)%24;minutes=floor(time/6e4)%60;seconds=floor(time/1e3)%60;milliseconds=time%1e3}else{year=value.getUTCFullYear();month=value.getUTCMonth();date=value.getUTCDate();hours=value.getUTCHours();minutes=value.getUTCMinutes();seconds=value.getUTCSeconds();milliseconds=value.getUTCMilliseconds()}value=(year<=0||year>=1e4?(year<0?"-":"+")+toPaddedString(6,year<0?-year:year):toPaddedString(4,year))+"-"+toPaddedString(2,month+1)+"-"+toPaddedString(2,date)+"T"+toPaddedString(2,hours)+":"+toPaddedString(2,minutes)+":"+toPaddedString(2,seconds)+"."+toPaddedString(3,milliseconds)+"Z"}else{value=null}}else if(typeof value.toJSON=="function"&&(className!=numberClass&&className!=stringClass&&className!=arrayClass||isProperty.call(value,"toJSON"))){value=value.toJSON(property)}}if(callback){value=callback.call(object,property,value)}if(value===null){return"null"}className=getClass.call(value);if(className==booleanClass){return""+value}else if(className==numberClass){return value>-1/0&&value<1/0?""+value:"null"}else if(className==stringClass){return quote(""+value)}if(typeof value=="object"){for(length=stack.length;length--;){if(stack[length]===value){throw TypeError()}}stack.push(value);results=[];prefix=indentation;indentation+=whitespace;if(className==arrayClass){for(index=0,length=value.length;index<length;index++){element=serialize(index,value,callback,properties,whitespace,indentation,stack);results.push(element===undef?"null":element)}result=results.length?whitespace?"[\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"]":"["+results.join(",")+"]":"[]"}else{forEach(properties||value,function(property){var element=serialize(property,value,callback,properties,whitespace,indentation,stack);if(element!==undef){results.push(quote(property)+":"+(whitespace?" ":"")+element)}});result=results.length?whitespace?"{\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"}":"{"+results.join(",")+"}":"{}"}stack.pop();return result}};JSON3.stringify=function(source,filter,width){var whitespace,callback,properties,className;if(typeof filter=="function"||typeof filter=="object"&&filter){if((className=getClass.call(filter))==functionClass){callback=filter}else if(className==arrayClass){properties={};for(var index=0,length=filter.length,value;index<length;value=filter[index++],(className=getClass.call(value),className==stringClass||className==numberClass)&&(properties[value]=1));}}if(width){if((className=getClass.call(width))==numberClass){if((width-=width%1)>0){for(whitespace="",width>10&&(width=10);whitespace.length<width;whitespace+=" ");}}else if(className==stringClass){whitespace=width.length<=10?width:width.slice(0,10)}}return serialize("",(value={},value[""]=source,value),callback,properties,whitespace,"",[])}}if(!has("json-parse")){var fromCharCode=String.fromCharCode;var Unescapes={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"};var Index,Source;var abort=function(){Index=Source=null;throw SyntaxError()};var lex=function(){var source=Source,length=source.length,value,begin,position,isSigned,charCode;while(Index<length){charCode=source.charCodeAt(Index);switch(charCode){case 9:case 10:case 13:case 32:Index++;break;case 123:case 125:case 91:case 93:case 58:case 44:value=charIndexBuggy?source.charAt(Index):source[Index];Index++;return value;case 34:for(value="@",Index++;Index<length;){charCode=source.charCodeAt(Index);if(charCode<32){abort()}else if(charCode==92){charCode=source.charCodeAt(++Index);switch(charCode){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:value+=Unescapes[charCode];Index++;break;case 117:begin=++Index;for(position=Index+4;Index<position;Index++){charCode=source.charCodeAt(Index);if(!(charCode>=48&&charCode<=57||charCode>=97&&charCode<=102||charCode>=65&&charCode<=70)){abort()}}value+=fromCharCode("0x"+source.slice(begin,Index));break;default:abort()}}else{if(charCode==34){break}charCode=source.charCodeAt(Index);begin=Index;while(charCode>=32&&charCode!=92&&charCode!=34){charCode=source.charCodeAt(++Index)}value+=source.slice(begin,Index)}}if(source.charCodeAt(Index)==34){Index++;return value}abort();default:begin=Index;if(charCode==45){isSigned=true;charCode=source.charCodeAt(++Index)}if(charCode>=48&&charCode<=57){if(charCode==48&&(charCode=source.charCodeAt(Index+1),charCode>=48&&charCode<=57)){abort()}isSigned=false;for(;Index<length&&(charCode=source.charCodeAt(Index),charCode>=48&&charCode<=57);Index++);if(source.charCodeAt(Index)==46){position=++Index;for(;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++);if(position==Index){abort()}Index=position}charCode=source.charCodeAt(Index);if(charCode==101||charCode==69){charCode=source.charCodeAt(++Index);if(charCode==43||charCode==45){Index++}for(position=Index;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++);if(position==Index){abort()}Index=position}return+source.slice(begin,Index)}if(isSigned){abort()}if(source.slice(Index,Index+4)=="true"){Index+=4;return true}else if(source.slice(Index,Index+5)=="false"){Index+=5;return false}else if(source.slice(Index,Index+4)=="null"){Index+=4;return null}abort()}}return"$"};var get=function(value){var results,hasMembers;if(value=="$"){abort()}if(typeof value=="string"){if((charIndexBuggy?value.charAt(0):value[0])=="@"){return value.slice(1)}if(value=="["){results=[];for(;;hasMembers||(hasMembers=true)){value=lex();if(value=="]"){break}if(hasMembers){if(value==","){value=lex();if(value=="]"){abort()}}else{abort()}}if(value==","){abort()}results.push(get(value))}return results}else if(value=="{"){results={};for(;;hasMembers||(hasMembers=true)){value=lex();if(value=="}"){break}if(hasMembers){if(value==","){value=lex();if(value=="}"){abort()}}else{abort()}}if(value==","||typeof value!="string"||(charIndexBuggy?value.charAt(0):value[0])!="@"||lex()!=":"){abort()}results[value.slice(1)]=get(lex())}return results}abort()}return value};var update=function(source,property,callback){var element=walk(source,property,callback);if(element===undef){delete source[property]}else{source[property]=element}};var walk=function(source,property,callback){var value=source[property],length;if(typeof value=="object"&&value){if(getClass.call(value)==arrayClass){for(length=value.length;length--;){update(value,length,callback)}}else{forEach(value,function(property){update(value,property,callback)})}}return callback.call(source,property,value)};JSON3.parse=function(source,callback){var result,value;Index=0;Source=""+source;result=get(lex());if(lex()!="$"){abort()}Index=Source=null;return callback&&getClass.call(callback)==functionClass?walk((value={},value[""]=result,value),"",callback):result}}}if(isLoader){define(function(){return JSON3})}})(this)},{}],50:[function(_dereq_,module,exports){module.exports=toArray;function toArray(list,index){var array=[];index=index||0;for(var i=index||0;i<list.length;i++){array[i-index]=list[i]}return array}},{}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(require,module,exports){
(function (__filename){
'use strict'

var io = require('../lib/socket.io')

angular.module("Dashboard")
.factory("Activities", ['$http', '$sce',  
  function ActivitiesFactory ($http, $sce) {

    var self = {}
    self.all = function() {
      return $http.get('/activities/')
    }
    self.stop = function(app) {
      return $http.delete('/activities/' + app)
      .success(function(data, status) {
        toastr.success(app + " succesfully stopped")
        var icon = document.getElementById(app)
        icon.parentElement.removeChild(icon)
      })
      .error(function(data, status) {
        toastr.error(data, 'An error has occurred when stopping the app')
        console.error(__filename + ' @ self.stop()')
        console.log(data)
      })
    }
    self.open = function(scope, app) {
      $http.get('/apps/' + app + '/port').
      success(function(data, status) {
        console.log('GET /apps/' + app + '/port ->' + data)
        scope.url = 'http://' + window.location.host + ':' + data
        scope.href = $sce.trustAsResourceUrl(scope.url)
      }).
      error(function(data, status, headers, config) {
        console.error(data)
        window.location.assign("/")
      })
    }
    self.launch = function(scope, app) {
      return $http.post('/activities/' + app).
      success(function(data, status, headers, config) {
        if (data.port) {
          scope.href = 'http://' + window.location.host + ':' + data.port
          return
        }
      // Force new connection after disconnect to
      // restart app
      var ws
      ws = io.connect('/' + app, {'forceNew': true})
      .on('connection', function () {
        console.log('ws/%s: server fetched.', app)
      })
      .on('stdout', function (stdout) {
        toastr.info(stdout, app)
        console.log('ws/%s/stdout: %s', app, stdout)
      })
      .on('stderr', function (stderr) {
        toastr.error(stderr, app)
        console.log('ws/%s/stderr: %s', app, stderr)
      })
      .on('close', function() {
        console.log('ws/%s/close!', app)
        ws.close().disconnect()
      })
      .on('ready', function (port) {
        console.log('ws/%s/ready!')
        scope.href = 'http://' + window.location.host + ':' + port
      })

    }).error(function(data, status, headers, config) {
      toastr.error('Dashboard', data)
      console.log(status + ' when PUT /launch/' + app + ' -> ' + data)
    })
  }

  return self
}])
}).call(this,"/public/assets/js/services/activities.js")

},{"../lib/socket.io":10}],12:[function(require,module,exports){
(function (__filename){
'use strict'

angular.module("Dashboard")
.factory("Apps", ['$http', '$sce', '$location',  
  function ActivitiesFactory ($http, $sce, $location) {

    var self = {}
    self.get = function(app) {
      return $http.get('/apps/' + app).error(function(data) {
        console.log(data.toString())  
        toastr.error(data.toString())
        $location.path('/')
      })
    }
    self.all = function() {
      return self.get('')
    }
    self.getReadme = function(app) {
      return $http.get('/apps/' + app + '/readme')
      .error(function(data) {
        console.log(data.toString())  
        toastr.error(data.toString())
      })
    }
    self.remove = function(app) {
      return $http.delete('/apps/' + app)
      .success(function(data, status) {
        toastr.success(app + " succesfully removed")
        var icon = document.getElementById(app)
        icon.parentElement.removeChild(icon)
      }).error(function(data, status) {
        toastr.error(data, 'An error has occurred when removing the app')
        console.error(__filename + ' @ self.remove()' + data)
      })
    }

    return self
  }])
}).call(this,"/public/assets/js/services/apps.js")

},{}],13:[function(require,module,exports){
'use strict'
require('./activities')
require('./apps')
},{"./activities":11,"./apps":12}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvYXNzZXRzL2pzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0Ryb3B6b25lL2Rpc3QvZHJvcHpvbmUuanMiLCJwdWJsaWMvYXNzZXRzL2pzL2NvbnRyb2xsZXJzL2FjdGl2aXRpZXMuanMiLCJwdWJsaWMvYXNzZXRzL2pzL2NvbnRyb2xsZXJzL2FwcHMuanMiLCJwdWJsaWMvYXNzZXRzL2pzL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwicHVibGljL2Fzc2V0cy9qcy9jb250cm9sbGVycy9taXNjLmpzIiwicHVibGljL2Fzc2V0cy9qcy9jb250cm9sbGVycy91c2Vycy5qcyIsInB1YmxpYy9hc3NldHMvanMvZGlyZWN0aXZlcy9pbmRleC5qcyIsInB1YmxpYy9hc3NldHMvanMvaGVscGVyLmpzIiwicHVibGljL2Fzc2V0cy9qcy9saWIvc29ja2V0LmlvLmpzIiwicHVibGljL2Fzc2V0cy9qcy9zZXJ2aWNlcy9hY3Rpdml0aWVzLmpzIiwicHVibGljL2Fzc2V0cy9qcy9zZXJ2aWNlcy9hcHBzLmpzIiwicHVibGljL2Fzc2V0cy9qcy9zZXJ2aWNlcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vXG4vLyBBbmd1bGFyIGNvcmUgb2YgZGFzaGJvYXJkIGFwcFxuLy8gYnkgamVzdXNAbmV0YmVhc3Rcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnZhciBpbyA9IHJlcXVpcmUoJy4vbGliL3NvY2tldC5pbycpXG5cbnZhciBEYXNoYm9hcmQgPSBhbmd1bGFyLm1vZHVsZSgnRGFzaGJvYXJkJywgWyduZ1JvdXRlJ10pXG5cbkRhc2hib2FyZC5ydW4oW2Z1bmN0aW9uICgpIHtcbiAgICAvLyBFcnJvciBoYW5kbGluZ1xuICAgIHdzID0gaW8uY29ubmVjdCgnLycpXG5cbiAgICB3cy5vbignaGVsbG8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnd3MvbWFpbjogc2VydmVyIGZldGNoZWQuJylcbiAgICB9KVxuXG4gICAgd3Mub24oJ3N1Y2Nlc3MnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICB0b2FzdHIuc3VjY2Vzcyhtc2csICd4d2F5JylcbiAgICAgIGNvbnNvbGUubG9nKCd3cy9tYWluOiBzZXJ2ZXIgZmV0Y2hlZC4nKVxuICAgIH0pXG5cbiAgICB3cy5vbignd2FybmluZycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgIHRvYXN0ci53YXJuaW5nKG1zZywgJ3h3YXknKVxuICAgICAgY29uc29sZS5sb2coJ3dzL3N0ZGVycjogJXMnLCBzdGRlcnIpXG4gICAgfSlcblxuICAgIHdzLm9uKCdzdGRvdXQnLCBmdW5jdGlvbiAoc3Rkb3V0KSB7XG4gICAgICB0b2FzdHIuaW5mbyhzdGRvdXQsICd4d2F5JylcbiAgICAgIGNvbnNvbGUubG9nKCd3cy9zdGRvdXQ6ICVzJywgc3Rkb3V0KVxuICAgIH0pXG5cbiAgICB3cy5vbignc3RkZXJyJywgZnVuY3Rpb24gKHN0ZGVycikge1xuICAgICAgdG9hc3RyLmVycm9yKHN0ZGVyciwgJ3h3YXknKVxuICAgICAgY29uc29sZS5sb2coJ3dzL3N0ZGVycjogJXMnLCBzdGRlcnIpXG4gICAgfSlcbiAgfV0pXG5cbkRhc2hib2FyZC5jb25maWcoWyckcm91dGVQcm92aWRlcicsXG4gIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXIuXG4gICAgd2hlbignLycsIHtcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvYXBwcy9pbmRleC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdBcHBzTGlzdEN0cmwnXG4gICAgfSkuXG4gICAgd2hlbignL2FwcHMvOm5hbWUnLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FwcHMvc2hvdy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdBcHBzU2hvd0N0cmwnXG4gICAgfSkuXG4gICAgd2hlbignL2luc3RhbGwvJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9hcHBzL25ldy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdBcHBzTmV3Q3RybCdcbiAgICB9KS5cbiAgICB3aGVuKCcvaS86bmFtZScsIHtcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvYXBwcy9saXZlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0FjdGl2aXRpZXNMaXZlQ3RybCdcbiAgICB9KS5cbiAgICB3aGVuKCcvcmVtb3ZlJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9hcHBzL2RlbGV0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdBcHBzUm1DdHJsJ1xuICAgIH0pLlxuICAgIHdoZW4oJy9hY3Rpdml0aWVzJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9hcHBzL2FjdGl2aXRpZXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQWN0aXZpdGllc0xpc3RDdHJsJ1xuICAgIH0pLlxuICAgIHdoZW4oJy9zaWduaW4nLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3VzZXJzL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSkuXG4gICAgd2hlbignL3JvdXRlcycsIHtcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbWlzYy9yb3V0ZXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnUm91dGVzQ3RybCdcbiAgICB9KS5cbiAgICB3aGVuKCcvc2V0dGluZ3MnLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL21pc2Mvc2V0dGluZ3MuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU2V0dGluZ3NDdHJsJ1xuICAgIH0pLlxuICAgIG90aGVyd2lzZSh7XG4gICAgICByZWRpcmVjdFRvOiAnLydcbiAgICB9KVxuICB9XSlcblxucmVxdWlyZSgnLi9zZXJ2aWNlcycpXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKVxucmVxdWlyZSgnLi9jb250cm9sbGVycycpXG4iLCJcbi8qXG4gKlxuICogTW9yZSBpbmZvIGF0IFt3d3cuZHJvcHpvbmVqcy5jb21dKGh0dHA6Ly93d3cuZHJvcHpvbmVqcy5jb20pXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyLCBNYXRpYXMgTWVub1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIERyb3B6b25lLCBFbWl0dGVyLCBjYW1lbGl6ZSwgY29udGVudExvYWRlZCwgZGV0ZWN0VmVydGljYWxTcXVhc2gsIGRyYXdJbWFnZUlPU0ZpeCwgbm9vcCwgd2l0aG91dCxcbiAgICBfX3NsaWNlID0gW10uc2xpY2UsXG4gICAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gICAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbiAgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbiAgRW1pdHRlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbWl0dGVyKCkge31cblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnQsIGZuKSB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICAgICBpZiAoIXRoaXMuX2NhbGxiYWNrc1tldmVudF0pIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XS5wdXNoKGZuKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgY2FsbGJhY2ssIGNhbGxiYWNrcywgZXZlbnQsIF9pLCBfbGVuO1xuICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgICAgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrc1tfaV07XG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IEVtaXR0ZXIucHJvdG90eXBlLm9mZjtcblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IEVtaXR0ZXIucHJvdG90eXBlLm9mZjtcblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFbWl0dGVyLnByb3RvdHlwZS5vZmY7XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgIHZhciBjYWxsYmFjaywgY2FsbGJhY2tzLCBpLCBfaSwgX2xlbjtcbiAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gX2kgPSAwLCBfbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgX2kgPCBfbGVuOyBpID0gKytfaSkge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSBmbikge1xuICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gRW1pdHRlcjtcblxuICB9KSgpO1xuXG4gIERyb3B6b25lID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIHZhciBleHRlbmQsIHJlc29sdmVPcHRpb247XG5cbiAgICBfX2V4dGVuZHMoRHJvcHpvbmUsIF9zdXBlcik7XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuRW1pdHRlciA9IEVtaXR0ZXI7XG5cblxuICAgIC8qXG4gICAgVGhpcyBpcyBhIGxpc3Qgb2YgYWxsIGF2YWlsYWJsZSBldmVudHMgeW91IGNhbiByZWdpc3RlciBvbiBhIGRyb3B6b25lIG9iamVjdC5cbiAgICBcbiAgICBZb3UgY2FuIHJlZ2lzdGVyIGFuIGV2ZW50IGhhbmRsZXIgbGlrZSB0aGlzOlxuICAgIFxuICAgICAgICBkcm9wem9uZS5vbihcImRyYWdFbnRlclwiLCBmdW5jdGlvbigpIHsgfSk7XG4gICAgICovXG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZXZlbnRzID0gW1wiZHJvcFwiLCBcImRyYWdzdGFydFwiLCBcImRyYWdlbmRcIiwgXCJkcmFnZW50ZXJcIiwgXCJkcmFnb3ZlclwiLCBcImRyYWdsZWF2ZVwiLCBcImFkZGVkZmlsZVwiLCBcInJlbW92ZWRmaWxlXCIsIFwidGh1bWJuYWlsXCIsIFwiZXJyb3JcIiwgXCJlcnJvcm11bHRpcGxlXCIsIFwicHJvY2Vzc2luZ1wiLCBcInByb2Nlc3NpbmdtdWx0aXBsZVwiLCBcInVwbG9hZHByb2dyZXNzXCIsIFwidG90YWx1cGxvYWRwcm9ncmVzc1wiLCBcInNlbmRpbmdcIiwgXCJzZW5kaW5nbXVsdGlwbGVcIiwgXCJzdWNjZXNzXCIsIFwic3VjY2Vzc211bHRpcGxlXCIsIFwiY2FuY2VsZWRcIiwgXCJjYW5jZWxlZG11bHRpcGxlXCIsIFwiY29tcGxldGVcIiwgXCJjb21wbGV0ZW11bHRpcGxlXCIsIFwicmVzZXRcIiwgXCJtYXhmaWxlc2V4Y2VlZGVkXCIsIFwibWF4ZmlsZXNyZWFjaGVkXCIsIFwicXVldWVjb21wbGV0ZVwiXTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHVybDogbnVsbCxcbiAgICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgcGFyYWxsZWxVcGxvYWRzOiAyLFxuICAgICAgdXBsb2FkTXVsdGlwbGU6IGZhbHNlLFxuICAgICAgbWF4RmlsZXNpemU6IDI1NixcbiAgICAgIHBhcmFtTmFtZTogXCJmaWxlXCIsXG4gICAgICBjcmVhdGVJbWFnZVRodW1ibmFpbHM6IHRydWUsXG4gICAgICBtYXhUaHVtYm5haWxGaWxlc2l6ZTogMTAsXG4gICAgICB0aHVtYm5haWxXaWR0aDogMTIwLFxuICAgICAgdGh1bWJuYWlsSGVpZ2h0OiAxMjAsXG4gICAgICBmaWxlc2l6ZUJhc2U6IDEwMDAsXG4gICAgICBtYXhGaWxlczogbnVsbCxcbiAgICAgIGZpbGVzaXplQmFzZTogMTAwMCxcbiAgICAgIHBhcmFtczoge30sXG4gICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICBpZ25vcmVIaWRkZW5GaWxlczogdHJ1ZSxcbiAgICAgIGFjY2VwdGVkRmlsZXM6IG51bGwsXG4gICAgICBhY2NlcHRlZE1pbWVUeXBlczogbnVsbCxcbiAgICAgIGF1dG9Qcm9jZXNzUXVldWU6IHRydWUsXG4gICAgICBhdXRvUXVldWU6IHRydWUsXG4gICAgICBhZGRSZW1vdmVMaW5rczogZmFsc2UsXG4gICAgICBwcmV2aWV3c0NvbnRhaW5lcjogbnVsbCxcbiAgICAgIGNhcHR1cmU6IG51bGwsXG4gICAgICBkaWN0RGVmYXVsdE1lc3NhZ2U6IFwiRHJvcCBmaWxlcyBoZXJlIHRvIHVwbG9hZFwiLFxuICAgICAgZGljdEZhbGxiYWNrTWVzc2FnZTogXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBkcmFnJ24nZHJvcCBmaWxlIHVwbG9hZHMuXCIsXG4gICAgICBkaWN0RmFsbGJhY2tUZXh0OiBcIlBsZWFzZSB1c2UgdGhlIGZhbGxiYWNrIGZvcm0gYmVsb3cgdG8gdXBsb2FkIHlvdXIgZmlsZXMgbGlrZSBpbiB0aGUgb2xkZW4gZGF5cy5cIixcbiAgICAgIGRpY3RGaWxlVG9vQmlnOiBcIkZpbGUgaXMgdG9vIGJpZyAoe3tmaWxlc2l6ZX19TWlCKS4gTWF4IGZpbGVzaXplOiB7e21heEZpbGVzaXplfX1NaUIuXCIsXG4gICAgICBkaWN0SW52YWxpZEZpbGVUeXBlOiBcIllvdSBjYW4ndCB1cGxvYWQgZmlsZXMgb2YgdGhpcyB0eXBlLlwiLFxuICAgICAgZGljdFJlc3BvbnNlRXJyb3I6IFwiU2VydmVyIHJlc3BvbmRlZCB3aXRoIHt7c3RhdHVzQ29kZX19IGNvZGUuXCIsXG4gICAgICBkaWN0Q2FuY2VsVXBsb2FkOiBcIkNhbmNlbCB1cGxvYWRcIixcbiAgICAgIGRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb246IFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCB0aGlzIHVwbG9hZD9cIixcbiAgICAgIGRpY3RSZW1vdmVGaWxlOiBcIlJlbW92ZSBmaWxlXCIsXG4gICAgICBkaWN0UmVtb3ZlRmlsZUNvbmZpcm1hdGlvbjogbnVsbCxcbiAgICAgIGRpY3RNYXhGaWxlc0V4Y2VlZGVkOiBcIllvdSBjYW4gbm90IHVwbG9hZCBhbnkgbW9yZSBmaWxlcy5cIixcbiAgICAgIGFjY2VwdDogZnVuY3Rpb24oZmlsZSwgZG9uZSkge1xuICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgfSxcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgIH0sXG4gICAgICBmb3JjZUZhbGxiYWNrOiBmYWxzZSxcbiAgICAgIGZhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoaWxkLCBtZXNzYWdlRWxlbWVudCwgc3BhbiwgX2ksIF9sZW4sIF9yZWY7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSBcIlwiICsgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArIFwiIGR6LWJyb3dzZXItbm90LXN1cHBvcnRlZFwiO1xuICAgICAgICBfcmVmID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBjaGlsZCA9IF9yZWZbX2ldO1xuICAgICAgICAgIGlmICgvKF58IClkei1tZXNzYWdlKCR8ICkvLnRlc3QoY2hpbGQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBjaGlsZDtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSA9IFwiZHotbWVzc2FnZVwiO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghbWVzc2FnZUVsZW1lbnQpIHtcbiAgICAgICAgICBtZXNzYWdlRWxlbWVudCA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8ZGl2IGNsYXNzPVxcXCJkei1tZXNzYWdlXFxcIj48c3Bhbj48L3NwYW4+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgc3BhbiA9IG1lc3NhZ2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKVswXTtcbiAgICAgICAgaWYgKHNwYW4pIHtcbiAgICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja01lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmdldEZhbGxiYWNrRm9ybSgpKTtcbiAgICAgIH0sXG4gICAgICByZXNpemU6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgdmFyIGluZm8sIHNyY1JhdGlvLCB0cmdSYXRpbztcbiAgICAgICAgaW5mbyA9IHtcbiAgICAgICAgICBzcmNYOiAwLFxuICAgICAgICAgIHNyY1k6IDAsXG4gICAgICAgICAgc3JjV2lkdGg6IGZpbGUud2lkdGgsXG4gICAgICAgICAgc3JjSGVpZ2h0OiBmaWxlLmhlaWdodFxuICAgICAgICB9O1xuICAgICAgICBzcmNSYXRpbyA9IGZpbGUud2lkdGggLyBmaWxlLmhlaWdodDtcbiAgICAgICAgaW5mby5vcHRXaWR0aCA9IHRoaXMub3B0aW9ucy50aHVtYm5haWxXaWR0aDtcbiAgICAgICAgaW5mby5vcHRIZWlnaHQgPSB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0O1xuICAgICAgICBpZiAoKGluZm8ub3B0V2lkdGggPT0gbnVsbCkgJiYgKGluZm8ub3B0SGVpZ2h0ID09IG51bGwpKSB7XG4gICAgICAgICAgaW5mby5vcHRXaWR0aCA9IGluZm8uc3JjV2lkdGg7XG4gICAgICAgICAgaW5mby5vcHRIZWlnaHQgPSBpbmZvLnNyY0hlaWdodDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLm9wdFdpZHRoID09IG51bGwpIHtcbiAgICAgICAgICBpbmZvLm9wdFdpZHRoID0gc3JjUmF0aW8gKiBpbmZvLm9wdEhlaWdodDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLm9wdEhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5mby5vcHRIZWlnaHQgPSAoMSAvIHNyY1JhdGlvKSAqIGluZm8ub3B0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgdHJnUmF0aW8gPSBpbmZvLm9wdFdpZHRoIC8gaW5mby5vcHRIZWlnaHQ7XG4gICAgICAgIGlmIChmaWxlLmhlaWdodCA8IGluZm8ub3B0SGVpZ2h0IHx8IGZpbGUud2lkdGggPCBpbmZvLm9wdFdpZHRoKSB7XG4gICAgICAgICAgaW5mby50cmdIZWlnaHQgPSBpbmZvLnNyY0hlaWdodDtcbiAgICAgICAgICBpbmZvLnRyZ1dpZHRoID0gaW5mby5zcmNXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgICAgaW5mby5zcmNIZWlnaHQgPSBmaWxlLmhlaWdodDtcbiAgICAgICAgICAgIGluZm8uc3JjV2lkdGggPSBpbmZvLnNyY0hlaWdodCAqIHRyZ1JhdGlvO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmZvLnNyY1dpZHRoID0gZmlsZS53aWR0aDtcbiAgICAgICAgICAgIGluZm8uc3JjSGVpZ2h0ID0gaW5mby5zcmNXaWR0aCAvIHRyZ1JhdGlvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbmZvLnNyY1ggPSAoZmlsZS53aWR0aCAtIGluZm8uc3JjV2lkdGgpIC8gMjtcbiAgICAgICAgaW5mby5zcmNZID0gKGZpbGUuaGVpZ2h0IC0gaW5mby5zcmNIZWlnaHQpIC8gMjtcbiAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgVGhvc2UgZnVuY3Rpb25zIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgdG8gdGhlIGV2ZW50cyBvbiBpbml0IGFuZCBoYW5kbGUgYWxsXG4gICAgICB0aGUgdXNlciBpbnRlcmZhY2Ugc3BlY2lmaWMgc3R1ZmYuIE92ZXJ3cml0aW5nIHRoZW0gd29uJ3QgYnJlYWsgdGhlIHVwbG9hZFxuICAgICAgYnV0IGNhbiBicmVhayB0aGUgd2F5IGl0J3MgZGlzcGxheWVkLlxuICAgICAgWW91IGNhbiBvdmVyd3JpdGUgdGhlbSBpZiB5b3UgZG9uJ3QgbGlrZSB0aGUgZGVmYXVsdCBiZWhhdmlvci4gSWYgeW91IGp1c3RcbiAgICAgIHdhbnQgdG8gYWRkIGFuIGFkZGl0aW9uYWwgZXZlbnQgaGFuZGxlciwgcmVnaXN0ZXIgaXQgb24gdGhlIGRyb3B6b25lIG9iamVjdFxuICAgICAgYW5kIGRvbid0IG92ZXJ3cml0ZSB0aG9zZSBvcHRpb25zLlxuICAgICAgICovXG4gICAgICBkcm9wOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgZHJhZ3N0YXJ0OiBub29wLFxuICAgICAgZHJhZ2VuZDogZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgfSxcbiAgICAgIGRyYWdlbnRlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgfSxcbiAgICAgIGRyYWdvdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgZHJhZ2xlYXZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgcGFzdGU6IG5vb3AsXG4gICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LXN0YXJ0ZWRcIik7XG4gICAgICB9LFxuICAgICAgYWRkZWRmaWxlOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHZhciBub2RlLCByZW1vdmVGaWxlRXZlbnQsIHJlbW92ZUxpbmssIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZiwgX3JlZjEsIF9yZWYyLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gdGhpcy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotc3RhcnRlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUudHJpbSgpKTtcbiAgICAgICAgICBmaWxlLnByZXZpZXdUZW1wbGF0ZSA9IGZpbGUucHJldmlld0VsZW1lbnQ7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3c0NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICBfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotbmFtZV1cIik7XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gX3JlZltfaV07XG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gZmlsZS5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfcmVmMSA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXNpemVdXCIpO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgbm9kZSA9IF9yZWYxW19qXTtcbiAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdGhpcy5maWxlc2l6ZShmaWxlLnNpemUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkZFJlbW92ZUxpbmtzKSB7XG4gICAgICAgICAgICBmaWxlLl9yZW1vdmVMaW5rID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxhIGNsYXNzPVxcXCJkei1yZW1vdmVcXFwiIGhyZWY9XFxcImphdmFzY3JpcHQ6dW5kZWZpbmVkO1xcXCIgZGF0YS1kei1yZW1vdmU+XCIgKyB0aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGUgKyBcIjwvYT5cIik7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmFwcGVuZENoaWxkKGZpbGUuX3JlbW92ZUxpbmspO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZW1vdmVGaWxlRXZlbnQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRHJvcHpvbmUuY29uZmlybShfdGhpcy5vcHRpb25zLmRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBEcm9wem9uZS5jb25maXJtKF90aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcyk7XG4gICAgICAgICAgX3JlZjIgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1yZW1vdmVdXCIpO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjIubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICAgICAgICByZW1vdmVMaW5rID0gX3JlZjJbX2tdO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChyZW1vdmVMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmVGaWxlRXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZGZpbGU6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgdmFyIF9yZWY7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKChfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgX3JlZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZpbGUucHJldmlld0VsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MoKTtcbiAgICAgIH0sXG4gICAgICB0aHVtYm5haWw6IGZ1bmN0aW9uKGZpbGUsIGRhdGFVcmwpIHtcbiAgICAgICAgdmFyIHRodW1ibmFpbEVsZW1lbnQsIF9pLCBfbGVuLCBfcmVmO1xuICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWZpbGUtcHJldmlld1wiKTtcbiAgICAgICAgICBfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotdGh1bWJuYWlsXVwiKTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQgPSBfcmVmW19pXTtcbiAgICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQuYWx0ID0gZmlsZS5uYW1lO1xuICAgICAgICAgICAgdGh1bWJuYWlsRWxlbWVudC5zcmMgPSBkYXRhVXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1pbWFnZS1wcmV2aWV3XCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKSksIDEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGZpbGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIG5vZGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1lcnJvclwiKTtcbiAgICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09IFwiU3RyaW5nXCIgJiYgbWVzc2FnZS5lcnJvcikge1xuICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIF9yZWYgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1lcnJvcm1lc3NhZ2VdXCIpO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gX3JlZltfaV07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG5vZGUudGV4dENvbnRlbnQgPSBtZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3JtdWx0aXBsZTogbm9vcCxcbiAgICAgIHByb2Nlc3Npbmc6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1wcm9jZXNzaW5nXCIpO1xuICAgICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5fcmVtb3ZlTGluay50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0Q2FuY2VsVXBsb2FkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2Nlc3NpbmdtdWx0aXBsZTogbm9vcCxcbiAgICAgIHVwbG9hZHByb2dyZXNzOiBmdW5jdGlvbihmaWxlLCBwcm9ncmVzcywgYnl0ZXNTZW50KSB7XG4gICAgICAgIHZhciBub2RlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgX3JlZiA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXVwbG9hZHByb2dyZXNzXVwiKTtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgbm9kZSA9IF9yZWZbX2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09ICdQUk9HUkVTUycpIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChub2RlLnZhbHVlID0gcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChub2RlLnN0eWxlLndpZHRoID0gXCJcIiArIHByb2dyZXNzICsgXCIlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b3RhbHVwbG9hZHByb2dyZXNzOiBub29wLFxuICAgICAgc2VuZGluZzogbm9vcCxcbiAgICAgIHNlbmRpbmdtdWx0aXBsZTogbm9vcCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotc3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3NtdWx0aXBsZTogbm9vcCxcbiAgICAgIGNhbmNlbGVkOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJlcnJvclwiLCBmaWxlLCBcIlVwbG9hZCBjYW5jZWxlZC5cIik7XG4gICAgICB9LFxuICAgICAgY2FuY2VsZWRtdWx0aXBsZTogbm9vcCxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgZmlsZS5fcmVtb3ZlTGluay50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0UmVtb3ZlRmlsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1jb21wbGV0ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlbXVsdGlwbGU6IG5vb3AsXG4gICAgICBtYXhmaWxlc2V4Y2VlZGVkOiBub29wLFxuICAgICAgbWF4ZmlsZXNyZWFjaGVkOiBub29wLFxuICAgICAgcXVldWVjb21wbGV0ZTogbm9vcCxcbiAgICAgIHByZXZpZXdUZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPVxcXCJkei1wcmV2aWV3IGR6LWZpbGUtcHJldmlld1xcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1pbWFnZVxcXCI+PGltZyBkYXRhLWR6LXRodW1ibmFpbCAvPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZGV0YWlsc1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImR6LXNpemVcXFwiPjxzcGFuIGRhdGEtZHotc2l6ZT48L3NwYW4+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImR6LWZpbGVuYW1lXFxcIj48c3BhbiBkYXRhLWR6LW5hbWU+PC9zcGFuPjwvZGl2PlxcbiAgPC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1wcm9ncmVzc1xcXCI+PHNwYW4gY2xhc3M9XFxcImR6LXVwbG9hZFxcXCIgZGF0YS1kei11cGxvYWRwcm9ncmVzcz48L3NwYW4+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1lcnJvci1tZXNzYWdlXFxcIj48c3BhbiBkYXRhLWR6LWVycm9ybWVzc2FnZT48L3NwYW4+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1zdWNjZXNzLW1hcmtcXFwiPlxcbiAgICA8c3ZnIHdpZHRoPVxcXCI1NHB4XFxcIiBoZWlnaHQ9XFxcIjU0cHhcXFwiIHZpZXdCb3g9XFxcIjAgMCA1NCA1NFxcXCIgdmVyc2lvbj1cXFwiMS4xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4bWxuczpza2V0Y2g9XFxcImh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9uc1xcXCI+XFxuICAgICAgPHRpdGxlPkNoZWNrPC90aXRsZT5cXG4gICAgICA8ZGVmcz48L2RlZnM+XFxuICAgICAgPGcgaWQ9XFxcIlBhZ2UtMVxcXCIgc3Ryb2tlPVxcXCJub25lXFxcIiBzdHJva2Utd2lkdGg9XFxcIjFcXFwiIGZpbGw9XFxcIm5vbmVcXFwiIGZpbGwtcnVsZT1cXFwiZXZlbm9kZFxcXCIgc2tldGNoOnR5cGU9XFxcIk1TUGFnZVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMjMuNSwzMS44NDMxNDU4IEwxNy41ODUyNDE5LDI1LjkyODM4NzcgQzE2LjAyNDgyNTMsMjQuMzY3OTcxMSAxMy40OTEwMjk0LDI0LjM2NjgzNSAxMS45Mjg5MzIyLDI1LjkyODkzMjIgQzEwLjM3MDAxMzYsMjcuNDg3ODUwOCAxMC4zNjY1OTEyLDMwLjAyMzQ0NTUgMTEuOTI4Mzg3NywzMS41ODUyNDE5IEwyMC40MTQ3NTgxLDQwLjA3MTYxMjMgQzIwLjUxMzM5OTksNDAuMTcwMjU0MSAyMC42MTU5MzE1LDQwLjI2MjY2NDkgMjAuNzIxODYxNSw0MC4zNDg4NDM1IEMyMi4yODM1NjY5LDQxLjg3MjU2NTEgMjQuNzk0MjM0LDQxLjg2MjYyMDIgMjYuMzQ2MTU2NCw0MC4zMTA2OTc4IEw0My4zMTA2OTc4LDIzLjM0NjE1NjQgQzQ0Ljg3NzEwMjEsMjEuNzc5NzUyMSA0NC44NzU4MDU3LDE5LjI0ODM4ODcgNDMuMzEzNzA4NSwxNy42ODYyOTE1IEM0MS43NTQ3ODk5LDE2LjEyNzM3MjkgMzkuMjE3NjAzNSwxNi4xMjU1NDIyIDM3LjY1Mzg0MzYsMTcuNjg5MzAyMiBMMjMuNSwzMS44NDMxNDU4IFogTTI3LDUzIEM0MS4zNTk0MDM1LDUzIDUzLDQxLjM1OTQwMzUgNTMsMjcgQzUzLDEyLjY0MDU5NjUgNDEuMzU5NDAzNSwxIDI3LDEgQzEyLjY0MDU5NjUsMSAxLDEyLjY0MDU5NjUgMSwyNyBDMSw0MS4zNTk0MDM1IDEyLjY0MDU5NjUsNTMgMjcsNTMgWlxcXCIgaWQ9XFxcIk92YWwtMlxcXCIgc3Ryb2tlLW9wYWNpdHk9XFxcIjAuMTk4Nzk0MTU4XFxcIiBzdHJva2U9XFxcIiM3NDc0NzRcXFwiIGZpbGwtb3BhY2l0eT1cXFwiMC44MTY1MTk0NzVcXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU1NoYXBlR3JvdXBcXFwiPjwvcGF0aD5cXG4gICAgICA8L2c+XFxuICAgIDwvc3ZnPlxcbiAgPC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1lcnJvci1tYXJrXFxcIj5cXG4gICAgPHN2ZyB3aWR0aD1cXFwiNTRweFxcXCIgaGVpZ2h0PVxcXCI1NHB4XFxcIiB2aWV3Qm94PVxcXCIwIDAgNTQgNTRcXFwiIHZlcnNpb249XFxcIjEuMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeG1sbnM6c2tldGNoPVxcXCJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnNcXFwiPlxcbiAgICAgIDx0aXRsZT5FcnJvcjwvdGl0bGU+XFxuICAgICAgPGRlZnM+PC9kZWZzPlxcbiAgICAgIDxnIGlkPVxcXCJQYWdlLTFcXFwiIHN0cm9rZT1cXFwibm9uZVxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxXFxcIiBmaWxsPVxcXCJub25lXFxcIiBmaWxsLXJ1bGU9XFxcImV2ZW5vZGRcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU1BhZ2VcXFwiPlxcbiAgICAgICAgPGcgaWQ9XFxcIkNoZWNrLSstT3ZhbC0yXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNMYXllckdyb3VwXFxcIiBzdHJva2U9XFxcIiM3NDc0NzRcXFwiIHN0cm9rZS1vcGFjaXR5PVxcXCIwLjE5ODc5NDE1OFxcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgZmlsbC1vcGFjaXR5PVxcXCIwLjgxNjUxOTQ3NVxcXCI+XFxuICAgICAgICAgIDxwYXRoIGQ9XFxcIk0zMi42NTY4NTQyLDI5IEwzOC4zMTA2OTc4LDIzLjM0NjE1NjQgQzM5Ljg3NzEwMjEsMjEuNzc5NzUyMSAzOS44NzU4MDU3LDE5LjI0ODM4ODcgMzguMzEzNzA4NSwxNy42ODYyOTE1IEMzNi43NTQ3ODk5LDE2LjEyNzM3MjkgMzQuMjE3NjAzNSwxNi4xMjU1NDIyIDMyLjY1Mzg0MzYsMTcuNjg5MzAyMiBMMjcsMjMuMzQzMTQ1OCBMMjEuMzQ2MTU2NCwxNy42ODkzMDIyIEMxOS43ODIzOTY1LDE2LjEyNTU0MjIgMTcuMjQ1MjEwMSwxNi4xMjczNzI5IDE1LjY4NjI5MTUsMTcuNjg2MjkxNSBDMTQuMTI0MTk0MywxOS4yNDgzODg3IDE0LjEyMjg5NzksMjEuNzc5NzUyMSAxNS42ODkzMDIyLDIzLjM0NjE1NjQgTDIxLjM0MzE0NTgsMjkgTDE1LjY4OTMwMjIsMzQuNjUzODQzNiBDMTQuMTIyODk3OSwzNi4yMjAyNDc5IDE0LjEyNDE5NDMsMzguNzUxNjExMyAxNS42ODYyOTE1LDQwLjMxMzcwODUgQzE3LjI0NTIxMDEsNDEuODcyNjI3MSAxOS43ODIzOTY1LDQxLjg3NDQ1NzggMjEuMzQ2MTU2NCw0MC4zMTA2OTc4IEwyNywzNC42NTY4NTQyIEwzMi42NTM4NDM2LDQwLjMxMDY5NzggQzM0LjIxNzYwMzUsNDEuODc0NDU3OCAzNi43NTQ3ODk5LDQxLjg3MjYyNzEgMzguMzEzNzA4NSw0MC4zMTM3MDg1IEMzOS44NzU4MDU3LDM4Ljc1MTYxMTMgMzkuODc3MTAyMSwzNi4yMjAyNDc5IDM4LjMxMDY5NzgsMzQuNjUzODQzNiBMMzIuNjU2ODU0MiwyOSBaIE0yNyw1MyBDNDEuMzU5NDAzNSw1MyA1Myw0MS4zNTk0MDM1IDUzLDI3IEM1MywxMi42NDA1OTY1IDQxLjM1OTQwMzUsMSAyNywxIEMxMi42NDA1OTY1LDEgMSwxMi42NDA1OTY1IDEsMjcgQzEsNDEuMzU5NDAzNSAxMi42NDA1OTY1LDUzIDI3LDUzIFpcXFwiIGlkPVxcXCJPdmFsLTJcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU1NoYXBlR3JvdXBcXFwiPjwvcGF0aD5cXG4gICAgICAgIDwvZz5cXG4gICAgICA8L2c+XFxuICAgIDwvc3ZnPlxcbiAgPC9kaXY+XFxuPC9kaXY+XCJcbiAgICB9O1xuXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5LCBvYmplY3QsIG9iamVjdHMsIHRhcmdldCwgdmFsLCBfaSwgX2xlbjtcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSwgb2JqZWN0cyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IG9iamVjdHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb2JqZWN0ID0gb2JqZWN0c1tfaV07XG4gICAgICAgIGZvciAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIHZhbCA9IG9iamVjdFtrZXldO1xuICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBEcm9wem9uZShlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICB2YXIgZWxlbWVudE9wdGlvbnMsIGZhbGxiYWNrLCBfcmVmO1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIHRoaXMudmVyc2lvbiA9IERyb3B6b25lLnZlcnNpb247XG4gICAgICB0aGlzLmRlZmF1bHRPcHRpb25zLnByZXZpZXdUZW1wbGF0ZSA9IHRoaXMuZGVmYXVsdE9wdGlvbnMucHJldmlld1RlbXBsYXRlLnJlcGxhY2UoL1xcbiovZywgXCJcIik7XG4gICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzID0gW107XG4gICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5maWxlcyA9IFtdO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgaWYgKCEodGhpcy5lbGVtZW50ICYmICh0aGlzLmVsZW1lbnQubm9kZVR5cGUgIT0gbnVsbCkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZHJvcHpvbmUgZWxlbWVudC5cIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50LmRyb3B6b25lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRyb3B6b25lIGFscmVhZHkgYXR0YWNoZWQuXCIpO1xuICAgICAgfVxuICAgICAgRHJvcHpvbmUuaW5zdGFuY2VzLnB1c2godGhpcyk7XG4gICAgICB0aGlzLmVsZW1lbnQuZHJvcHpvbmUgPSB0aGlzO1xuICAgICAgZWxlbWVudE9wdGlvbnMgPSAoX3JlZiA9IERyb3B6b25lLm9wdGlvbnNGb3JFbGVtZW50KHRoaXMuZWxlbWVudCkpICE9IG51bGwgPyBfcmVmIDoge307XG4gICAgICB0aGlzLm9wdGlvbnMgPSBleHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIGVsZW1lbnRPcHRpb25zLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zIDoge30pO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5mb3JjZUZhbGxiYWNrIHx8ICFEcm9wem9uZS5pc0Jyb3dzZXJTdXBwb3J0ZWQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZhbGxiYWNrLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVybCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy51cmwgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMudXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIFVSTCBwcm92aWRlZC5cIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFjY2VwdGVkRmlsZXMgJiYgdGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBjYW4ndCBwcm92aWRlIGJvdGggJ2FjY2VwdGVkRmlsZXMnIGFuZCAnYWNjZXB0ZWRNaW1lVHlwZXMnLiAnYWNjZXB0ZWRNaW1lVHlwZXMnIGlzIGRlcHJlY2F0ZWQuXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hY2NlcHRlZE1pbWVUeXBlcykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyA9IHRoaXMub3B0aW9ucy5hY2NlcHRlZE1pbWVUeXBlcztcbiAgICAgICAgZGVsZXRlIHRoaXMub3B0aW9ucy5hY2NlcHRlZE1pbWVUeXBlcztcbiAgICAgIH1cbiAgICAgIHRoaXMub3B0aW9ucy5tZXRob2QgPSB0aGlzLm9wdGlvbnMubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gICAgICBpZiAoKGZhbGxiYWNrID0gdGhpcy5nZXRFeGlzdGluZ0ZhbGxiYWNrKCkpICYmIGZhbGxiYWNrLnBhcmVudE5vZGUpIHtcbiAgICAgICAgZmFsbGJhY2sucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnByZXZpZXdzQ29udGFpbmVyICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByZXZpZXdzQ29udGFpbmVyKSB7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3c0NvbnRhaW5lciA9IERyb3B6b25lLmdldEVsZW1lbnQodGhpcy5vcHRpb25zLnByZXZpZXdzQ29udGFpbmVyLCBcInByZXZpZXdzQ29udGFpbmVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJldmlld3NDb250YWluZXIgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2xpY2thYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2xpY2thYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cyA9IFt0aGlzLmVsZW1lbnRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMgPSBEcm9wem9uZS5nZXRFbGVtZW50cyh0aGlzLm9wdGlvbnMuY2xpY2thYmxlLCBcImNsaWNrYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldEFjY2VwdGVkRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5maWxlcztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoZmlsZS5hY2NlcHRlZCkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldFJlamVjdGVkRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5maWxlcztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoIWZpbGUuYWNjZXB0ZWQpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGZpbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRGaWxlc1dpdGhTdGF0dXMgPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5maWxlcztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IHN0YXR1cykge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldFF1ZXVlZEZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRGaWxlc1dpdGhTdGF0dXMoRHJvcHpvbmUuUVVFVUVEKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldFVwbG9hZGluZ0ZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRGaWxlc1dpdGhTdGF0dXMoRHJvcHpvbmUuVVBMT0FESU5HKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldEFjdGl2ZUZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcgfHwgZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlFVRVVFRCkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBldmVudE5hbWUsIG5vUHJvcGFnYXRpb24sIHNldHVwSGlkZGVuRmlsZUlucHV0LCBfaSwgX2xlbiwgX3JlZiwgX3JlZjE7XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT09IFwiZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZHJvcHpvbmVcIikgJiYgIXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmR6LW1lc3NhZ2VcIikpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8ZGl2IGNsYXNzPVxcXCJkei1kZWZhdWx0IGR6LW1lc3NhZ2VcXFwiPjxzcGFuPlwiICsgdGhpcy5vcHRpb25zLmRpY3REZWZhdWx0TWVzc2FnZSArIFwiPC9zcGFuPjwvZGl2PlwiKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jbGlja2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgc2V0dXBIaWRkZW5GaWxlSW5wdXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaGlkZGVuRmlsZUlucHV0KSB7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoX3RoaXMuaGlkZGVuRmlsZUlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZmlsZVwiKTtcbiAgICAgICAgICAgIGlmICgoX3RoaXMub3B0aW9ucy5tYXhGaWxlcyA9PSBudWxsKSB8fCBfdGhpcy5vcHRpb25zLm1heEZpbGVzID4gMSkge1xuICAgICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIiwgXCJtdWx0aXBsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5jbGFzc05hbWUgPSBcImR6LWhpZGRlbi1pbnB1dFwiO1xuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJhY2NlcHRcIiwgX3RoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmNhcHR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwiY2FwdHVyZVwiLCBfdGhpcy5vcHRpb25zLmNhcHR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLmxlZnQgPSBcIjBcIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS53aWR0aCA9IFwiMFwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfdGhpcy5oaWRkZW5GaWxlSW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgZmlsZSwgZmlsZXMsIF9pLCBfbGVuO1xuICAgICAgICAgICAgICBmaWxlcyA9IF90aGlzLmhpZGRlbkZpbGVJbnB1dC5maWxlcztcbiAgICAgICAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgICAgICAgICAgICBfdGhpcy5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gc2V0dXBIaWRkZW5GaWxlSW5wdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpO1xuICAgICAgICBzZXR1cEhpZGRlbkZpbGVJbnB1dCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5VUkwgPSAoX3JlZiA9IHdpbmRvdy5VUkwpICE9IG51bGwgPyBfcmVmIDogd2luZG93LndlYmtpdFVSTDtcbiAgICAgIF9yZWYxID0gdGhpcy5ldmVudHM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGV2ZW50TmFtZSA9IF9yZWYxW19pXTtcbiAgICAgICAgdGhpcy5vbihldmVudE5hbWUsIHRoaXMub3B0aW9uc1tldmVudE5hbWVdKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub24oXCJ1cGxvYWRwcm9ncmVzc1wiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVUb3RhbFVwbG9hZFByb2dyZXNzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLm9uKFwicmVtb3ZlZGZpbGVcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgdGhpcy5vbihcImNhbmNlbGVkXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLm9uKFwiY29tcGxldGVcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgaWYgKF90aGlzLmdldFVwbG9hZGluZ0ZpbGVzKCkubGVuZ3RoID09PSAwICYmIF90aGlzLmdldFF1ZXVlZEZpbGVzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwicXVldWVjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICBub1Byb3BhZ2F0aW9uID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHRoaXMubGlzdGVuZXJzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZWxlbWVudDogdGhpcy5lbGVtZW50LFxuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgXCJkcmFnc3RhcnRcIjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJkcmFnc3RhcnRcIiwgZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgICAgIFwiZHJhZ2VudGVyXCI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJkcmFnZW50ZXJcIiwgZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgICAgIFwiZHJhZ292ZXJcIjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVmY3Q7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGVmY3QgPSBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnID09PSBlZmN0IHx8ICdsaW5rTW92ZScgPT09IGVmY3QgPyAnbW92ZScgOiAnY29weSc7XG4gICAgICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcImRyYWdvdmVyXCIsIGUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcyksXG4gICAgICAgICAgICBcImRyYWdsZWF2ZVwiOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcImRyYWdsZWF2ZVwiLCBlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpLFxuICAgICAgICAgICAgXCJkcm9wXCI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmRyb3AoZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgICAgIFwiZHJhZ2VuZFwiOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcImRyYWdlbmRcIiwgZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNsaWNrYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgZWxlbWVudDogY2xpY2thYmxlRWxlbWVudCxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBcImNsaWNrXCI6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgICAgIGlmICgoY2xpY2thYmxlRWxlbWVudCAhPT0gX3RoaXMuZWxlbWVudCkgfHwgKGV2dC50YXJnZXQgPT09IF90aGlzLmVsZW1lbnQgfHwgRHJvcHpvbmUuZWxlbWVudEluc2lkZShldnQudGFyZ2V0LCBfdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHotbWVzc2FnZVwiKSkpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuaGlkZGVuRmlsZUlucHV0LmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbml0LmNhbGwodGhpcyk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3JlZjtcbiAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgdGhpcy5yZW1vdmVBbGxGaWxlcyh0cnVlKTtcbiAgICAgIGlmICgoX3JlZiA9IHRoaXMuaGlkZGVuRmlsZUlucHV0KSAhPSBudWxsID8gX3JlZi5wYXJlbnROb2RlIDogdm9pZCAwKSB7XG4gICAgICAgIHRoaXMuaGlkZGVuRmlsZUlucHV0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5oaWRkZW5GaWxlSW5wdXQpO1xuICAgICAgICB0aGlzLmhpZGRlbkZpbGVJbnB1dCA9IG51bGw7XG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5lbGVtZW50LmRyb3B6b25lO1xuICAgICAgcmV0dXJuIERyb3B6b25lLmluc3RhbmNlcy5zcGxpY2UoRHJvcHpvbmUuaW5zdGFuY2VzLmluZGV4T2YodGhpcyksIDEpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjdGl2ZUZpbGVzLCBmaWxlLCB0b3RhbEJ5dGVzLCB0b3RhbEJ5dGVzU2VudCwgdG90YWxVcGxvYWRQcm9ncmVzcywgX2ksIF9sZW4sIF9yZWY7XG4gICAgICB0b3RhbEJ5dGVzU2VudCA9IDA7XG4gICAgICB0b3RhbEJ5dGVzID0gMDtcbiAgICAgIGFjdGl2ZUZpbGVzID0gdGhpcy5nZXRBY3RpdmVGaWxlcygpO1xuICAgICAgaWYgKGFjdGl2ZUZpbGVzLmxlbmd0aCkge1xuICAgICAgICBfcmVmID0gdGhpcy5nZXRBY3RpdmVGaWxlcygpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgICAgdG90YWxCeXRlc1NlbnQgKz0gZmlsZS51cGxvYWQuYnl0ZXNTZW50O1xuICAgICAgICAgIHRvdGFsQnl0ZXMgKz0gZmlsZS51cGxvYWQudG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxVcGxvYWRQcm9ncmVzcyA9IDEwMCAqIHRvdGFsQnl0ZXNTZW50IC8gdG90YWxCeXRlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSAxMDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbWl0KFwidG90YWx1cGxvYWRwcm9ncmVzc1wiLCB0b3RhbFVwbG9hZFByb2dyZXNzLCB0b3RhbEJ5dGVzLCB0b3RhbEJ5dGVzU2VudCk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fZ2V0UGFyYW1OYW1lID0gZnVuY3Rpb24obikge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGFyYW1OYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUobik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUgKyAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlID8gXCJbXCIgKyBuICsgXCJdXCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldEZhbGxiYWNrRm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4aXN0aW5nRmFsbGJhY2ssIGZpZWxkcywgZmllbGRzU3RyaW5nLCBmb3JtO1xuICAgICAgaWYgKGV4aXN0aW5nRmFsbGJhY2sgPSB0aGlzLmdldEV4aXN0aW5nRmFsbGJhY2soKSkge1xuICAgICAgICByZXR1cm4gZXhpc3RpbmdGYWxsYmFjaztcbiAgICAgIH1cbiAgICAgIGZpZWxkc1N0cmluZyA9IFwiPGRpdiBjbGFzcz1cXFwiZHotZmFsbGJhY2tcXFwiPlwiO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tUZXh0KSB7XG4gICAgICAgIGZpZWxkc1N0cmluZyArPSBcIjxwPlwiICsgdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja1RleHQgKyBcIjwvcD5cIjtcbiAgICAgIH1cbiAgICAgIGZpZWxkc1N0cmluZyArPSBcIjxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBuYW1lPVxcXCJcIiArICh0aGlzLl9nZXRQYXJhbU5hbWUoMCkpICsgXCJcXFwiIFwiICsgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSA/ICdtdWx0aXBsZT1cIm11bHRpcGxlXCInIDogdm9pZCAwKSArIFwiIC8+PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIlVwbG9hZCFcXFwiPjwvZGl2PlwiO1xuICAgICAgZmllbGRzID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChmaWVsZHNTdHJpbmcpO1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lICE9PSBcIkZPUk1cIikge1xuICAgICAgICBmb3JtID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxmb3JtIGFjdGlvbj1cXFwiXCIgKyB0aGlzLm9wdGlvbnMudXJsICsgXCJcXFwiIGVuY3R5cGU9XFxcIm11bHRpcGFydC9mb3JtLWRhdGFcXFwiIG1ldGhvZD1cXFwiXCIgKyB0aGlzLm9wdGlvbnMubWV0aG9kICsgXCJcXFwiPjwvZm9ybT5cIik7XG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmllbGRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcIm1ldGhvZFwiLCB0aGlzLm9wdGlvbnMubWV0aG9kKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JtICE9IG51bGwgPyBmb3JtIDogZmllbGRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0RXhpc3RpbmdGYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZhbGxiYWNrLCBnZXRGYWxsYmFjaywgdGFnTmFtZSwgX2ksIF9sZW4sIF9yZWY7XG4gICAgICBnZXRGYWxsYmFjayA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBlbCwgX2ksIF9sZW47XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWxlbWVudHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBlbCA9IGVsZW1lbnRzW19pXTtcbiAgICAgICAgICBpZiAoLyhefCApZmFsbGJhY2soJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX3JlZiA9IFtcImRpdlwiLCBcImZvcm1cIl07XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgdGFnTmFtZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoZmFsbGJhY2sgPSBnZXRGYWxsYmFjayh0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSkpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5zZXR1cEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWxlbWVudExpc3RlbmVycywgZXZlbnQsIGxpc3RlbmVyLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGVsZW1lbnRMaXN0ZW5lcnMgPSBfcmVmW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYxLCBfcmVzdWx0czE7XG4gICAgICAgICAgX3JlZjEgPSBlbGVtZW50TGlzdGVuZXJzLmV2ZW50cztcbiAgICAgICAgICBfcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICBmb3IgKGV2ZW50IGluIF9yZWYxKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IF9yZWYxW2V2ZW50XTtcbiAgICAgICAgICAgIF9yZXN1bHRzMS5wdXNoKGVsZW1lbnRMaXN0ZW5lcnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzMTtcbiAgICAgICAgfSkoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsZW1lbnRMaXN0ZW5lcnMsIGV2ZW50LCBsaXN0ZW5lciwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBlbGVtZW50TGlzdGVuZXJzID0gX3JlZltfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfcmVmMSwgX3Jlc3VsdHMxO1xuICAgICAgICAgIF9yZWYxID0gZWxlbWVudExpc3RlbmVycy5ldmVudHM7XG4gICAgICAgICAgX3Jlc3VsdHMxID0gW107XG4gICAgICAgICAgZm9yIChldmVudCBpbiBfcmVmMSkge1xuICAgICAgICAgICAgbGlzdGVuZXIgPSBfcmVmMVtldmVudF07XG4gICAgICAgICAgICBfcmVzdWx0czEucHVzaChlbGVtZW50TGlzdGVuZXJzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0czE7XG4gICAgICAgIH0pKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1jbGlja2FibGVcIik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIF9yZWYgPSB0aGlzLmZpbGVzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5jYW5jZWxVcGxvYWQoZmlsZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotY2xpY2thYmxlXCIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5maWxlc2l6ZSA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciBjdXRvZmYsIGksIHNlbGVjdGVkU2l6ZSwgc2VsZWN0ZWRVbml0LCB1bml0LCB1bml0cywgX2ksIF9sZW47XG4gICAgICB1bml0cyA9IFsnVEInLCAnR0InLCAnTUInLCAnS0InLCAnYiddO1xuICAgICAgc2VsZWN0ZWRTaXplID0gc2VsZWN0ZWRVbml0ID0gbnVsbDtcbiAgICAgIGZvciAoaSA9IF9pID0gMCwgX2xlbiA9IHVuaXRzLmxlbmd0aDsgX2kgPCBfbGVuOyBpID0gKytfaSkge1xuICAgICAgICB1bml0ID0gdW5pdHNbaV07XG4gICAgICAgIGN1dG9mZiA9IE1hdGgucG93KHRoaXMub3B0aW9ucy5maWxlc2l6ZUJhc2UsIDQgLSBpKSAvIDEwO1xuICAgICAgICBpZiAoc2l6ZSA+PSBjdXRvZmYpIHtcbiAgICAgICAgICBzZWxlY3RlZFNpemUgPSBzaXplIC8gTWF0aC5wb3codGhpcy5vcHRpb25zLmZpbGVzaXplQmFzZSwgNCAtIGkpO1xuICAgICAgICAgIHNlbGVjdGVkVW5pdCA9IHVuaXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlbGVjdGVkU2l6ZSA9IE1hdGgucm91bmQoMTAgKiBzZWxlY3RlZFNpemUpIC8gMTA7XG4gICAgICByZXR1cm4gXCI8c3Ryb25nPlwiICsgc2VsZWN0ZWRTaXplICsgXCI8L3N0cm9uZz4gXCIgKyBzZWxlY3RlZFVuaXQ7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgodGhpcy5vcHRpb25zLm1heEZpbGVzICE9IG51bGwpICYmIHRoaXMuZ2V0QWNjZXB0ZWRGaWxlcygpLmxlbmd0aCA+PSB0aGlzLm9wdGlvbnMubWF4RmlsZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0QWNjZXB0ZWRGaWxlcygpLmxlbmd0aCA9PT0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdtYXhmaWxlc3JlYWNoZWQnLCB0aGlzLmZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1tYXgtZmlsZXMtcmVhY2hlZFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LW1heC1maWxlcy1yZWFjaGVkXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZHJvcCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBmaWxlcywgaXRlbXM7XG4gICAgICBpZiAoIWUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdChcImRyb3BcIiwgZSk7XG4gICAgICBmaWxlcyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICBpdGVtcyA9IGUuZGF0YVRyYW5zZmVyLml0ZW1zO1xuICAgICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoICYmIChpdGVtc1swXS53ZWJraXRHZXRBc0VudHJ5ICE9IG51bGwpKSB7XG4gICAgICAgICAgdGhpcy5fYWRkRmlsZXNGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaGFuZGxlRmlsZXMoZmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5wYXN0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpdGVtcywgX3JlZjtcbiAgICAgIGlmICgoZSAhPSBudWxsID8gKF9yZWYgPSBlLmNsaXBib2FyZERhdGEpICE9IG51bGwgPyBfcmVmLml0ZW1zIDogdm9pZCAwIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdChcInBhc3RlXCIsIGUpO1xuICAgICAgaXRlbXMgPSBlLmNsaXBib2FyZERhdGEuaXRlbXM7XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRGaWxlc0Zyb21JdGVtcyhpdGVtcyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5oYW5kbGVGaWxlcyA9IGZ1bmN0aW9uKGZpbGVzKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmFkZEZpbGUoZmlsZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2FkZEZpbGVzRnJvbUl0ZW1zID0gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgIHZhciBlbnRyeSwgaXRlbSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gaXRlbXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgaXRlbSA9IGl0ZW1zW19pXTtcbiAgICAgICAgaWYgKChpdGVtLndlYmtpdEdldEFzRW50cnkgIT0gbnVsbCkgJiYgKGVudHJ5ID0gaXRlbS53ZWJraXRHZXRBc0VudHJ5KCkpKSB7XG4gICAgICAgICAgaWYgKGVudHJ5LmlzRmlsZSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmFkZEZpbGUoaXRlbS5nZXRBc0ZpbGUoKSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5fYWRkRmlsZXNGcm9tRGlyZWN0b3J5KGVudHJ5LCBlbnRyeS5uYW1lKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5nZXRBc0ZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgIGlmICgoaXRlbS5raW5kID09IG51bGwpIHx8IGl0ZW0ua2luZCA9PT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5hZGRGaWxlKGl0ZW0uZ2V0QXNGaWxlKCkpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9hZGRGaWxlc0Zyb21EaXJlY3RvcnkgPSBmdW5jdGlvbihkaXJlY3RvcnksIHBhdGgpIHtcbiAgICAgIHZhciBkaXJSZWFkZXIsIGVudHJpZXNSZWFkZXI7XG4gICAgICBkaXJSZWFkZXIgPSBkaXJlY3RvcnkuY3JlYXRlUmVhZGVyKCk7XG4gICAgICBlbnRyaWVzUmVhZGVyID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlbnRyaWVzKSB7XG4gICAgICAgICAgdmFyIGVudHJ5LCBfaSwgX2xlbjtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVudHJpZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGVudHJ5ID0gZW50cmllc1tfaV07XG4gICAgICAgICAgICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmZpbGUoZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmlnbm9yZUhpZGRlbkZpbGVzICYmIGZpbGUubmFtZS5zdWJzdHJpbmcoMCwgMSkgPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaWxlLmZ1bGxQYXRoID0gXCJcIiArIHBhdGggKyBcIi9cIiArIGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRkRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAgIF90aGlzLl9hZGRGaWxlc0Zyb21EaXJlY3RvcnkoZW50cnksIFwiXCIgKyBwYXRoICsgXCIvXCIgKyBlbnRyeS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHJldHVybiBkaXJSZWFkZXIucmVhZEVudHJpZXMoZW50cmllc1JlYWRlciwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyB0eXBlb2YgY29uc29sZS5sb2cgPT09IFwiZnVuY3Rpb25cIiA/IGNvbnNvbGUubG9nKGVycm9yKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24oZmlsZSwgZG9uZSkge1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IHRoaXMub3B0aW9ucy5tYXhGaWxlc2l6ZSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHJldHVybiBkb25lKHRoaXMub3B0aW9ucy5kaWN0RmlsZVRvb0JpZy5yZXBsYWNlKFwie3tmaWxlc2l6ZX19XCIsIE1hdGgucm91bmQoZmlsZS5zaXplIC8gMTAyNCAvIDEwLjI0KSAvIDEwMCkucmVwbGFjZShcInt7bWF4RmlsZXNpemV9fVwiLCB0aGlzLm9wdGlvbnMubWF4RmlsZXNpemUpKTtcbiAgICAgIH0gZWxzZSBpZiAoIURyb3B6b25lLmlzVmFsaWRGaWxlKGZpbGUsIHRoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzKSkge1xuICAgICAgICByZXR1cm4gZG9uZSh0aGlzLm9wdGlvbnMuZGljdEludmFsaWRGaWxlVHlwZSk7XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLm9wdGlvbnMubWF4RmlsZXMgIT0gbnVsbCkgJiYgdGhpcy5nZXRBY2NlcHRlZEZpbGVzKCkubGVuZ3RoID49IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICBkb25lKHRoaXMub3B0aW9ucy5kaWN0TWF4RmlsZXNFeGNlZWRlZC5yZXBsYWNlKFwie3ttYXhGaWxlc319XCIsIHRoaXMub3B0aW9ucy5tYXhGaWxlcykpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KFwibWF4ZmlsZXNleGNlZWRlZFwiLCBmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWNjZXB0LmNhbGwodGhpcywgZmlsZSwgZG9uZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5hZGRGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgZmlsZS51cGxvYWQgPSB7XG4gICAgICAgIHByb2dyZXNzOiAwLFxuICAgICAgICB0b3RhbDogZmlsZS5zaXplLFxuICAgICAgICBieXRlc1NlbnQ6IDBcbiAgICAgIH07XG4gICAgICB0aGlzLmZpbGVzLnB1c2goZmlsZSk7XG4gICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLkFEREVEO1xuICAgICAgdGhpcy5lbWl0KFwiYWRkZWRmaWxlXCIsIGZpbGUpO1xuICAgICAgdGhpcy5fZW5xdWV1ZVRodW1ibmFpbChmaWxlKTtcbiAgICAgIHJldHVybiB0aGlzLmFjY2VwdChmaWxlLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBmaWxlLmFjY2VwdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBfdGhpcy5fZXJyb3JQcm9jZXNzaW5nKFtmaWxlXSwgZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWxlLmFjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmF1dG9RdWV1ZSkge1xuICAgICAgICAgICAgICBfdGhpcy5lbnF1ZXVlRmlsZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF90aGlzLl91cGRhdGVNYXhGaWxlc1JlYWNoZWRDbGFzcygpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZW5xdWV1ZUZpbGVzID0gZnVuY3Rpb24oZmlsZXMpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbjtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgdGhpcy5lbnF1ZXVlRmlsZShmaWxlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZW5xdWV1ZUZpbGUgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLkFEREVEICYmIGZpbGUuYWNjZXB0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5RVUVVRUQ7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKSksIDApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGZpbGUgY2FuJ3QgYmUgcXVldWVkIGJlY2F1c2UgaXQgaGFzIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQgb3Igd2FzIHJlamVjdGVkLlwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl90aHVtYm5haWxRdWV1ZSA9IFtdO1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9wcm9jZXNzaW5nVGh1bWJuYWlsID0gZmFsc2U7XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2VucXVldWVUaHVtYm5haWwgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNyZWF0ZUltYWdlVGh1bWJuYWlscyAmJiBmaWxlLnR5cGUubWF0Y2goL2ltYWdlLiovKSAmJiBmaWxlLnNpemUgPD0gdGhpcy5vcHRpb25zLm1heFRodW1ibmFpbEZpbGVzaXplICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgdGhpcy5fdGh1bWJuYWlsUXVldWUucHVzaChmaWxlKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpLCAwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9wcm9jZXNzVGh1bWJuYWlsUXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9wcm9jZXNzaW5nVGh1bWJuYWlsIHx8IHRoaXMuX3RodW1ibmFpbFF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9wcm9jZXNzaW5nVGh1bWJuYWlsID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVRodW1ibmFpbCh0aGlzLl90aHVtYm5haWxRdWV1ZS5zaGlmdCgpLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIF90aGlzLl9wcm9jZXNzaW5nVGh1bWJuYWlsID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLl9wcm9jZXNzVGh1bWJuYWlsUXVldWUoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnJlbW92ZUZpbGUgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORykge1xuICAgICAgICB0aGlzLmNhbmNlbFVwbG9hZChmaWxlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsZXMgPSB3aXRob3V0KHRoaXMuZmlsZXMsIGZpbGUpO1xuICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZGZpbGVcIiwgZmlsZSk7XG4gICAgICBpZiAodGhpcy5maWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChcInJlc2V0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUucmVtb3ZlQWxsRmlsZXMgPSBmdW5jdGlvbihjYW5jZWxJZk5lY2Vzc2FyeSkge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVmO1xuICAgICAgaWYgKGNhbmNlbElmTmVjZXNzYXJ5ID09IG51bGwpIHtcbiAgICAgICAgY2FuY2VsSWZOZWNlc3NhcnkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIF9yZWYgPSB0aGlzLmZpbGVzLnNsaWNlKCk7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoZmlsZS5zdGF0dXMgIT09IERyb3B6b25lLlVQTE9BRElORyB8fCBjYW5jZWxJZk5lY2Vzc2FyeSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5jcmVhdGVUaHVtYm5haWwgPSBmdW5jdGlvbihmaWxlLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGZpbGVSZWFkZXI7XG4gICAgICBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXI7XG4gICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGZpbGUudHlwZSA9PT0gXCJpbWFnZS9zdmcreG1sXCIpIHtcbiAgICAgICAgICAgIF90aGlzLmVtaXQoXCJ0aHVtYm5haWxcIiwgZmlsZSwgZmlsZVJlYWRlci5yZXN1bHQpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNyZWF0ZVRodW1ibmFpbEZyb21VcmwoZmlsZSwgZmlsZVJlYWRlci5yZXN1bHQsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgcmV0dXJuIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmNyZWF0ZVRodW1ibmFpbEZyb21VcmwgPSBmdW5jdGlvbihmaWxlLCBpbWFnZVVybCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBpbWc7XG4gICAgICBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgaW1nLm9ubG9hZCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGNhbnZhcywgY3R4LCByZXNpemVJbmZvLCB0aHVtYm5haWwsIF9yZWYsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICAgICAgZmlsZS53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICBmaWxlLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgICAgcmVzaXplSW5mbyA9IF90aGlzLm9wdGlvbnMucmVzaXplLmNhbGwoX3RoaXMsIGZpbGUpO1xuICAgICAgICAgIGlmIChyZXNpemVJbmZvLnRyZ1dpZHRoID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc2l6ZUluZm8udHJnV2lkdGggPSByZXNpemVJbmZvLm9wdFdpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzaXplSW5mby50cmdIZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzaXplSW5mby50cmdIZWlnaHQgPSByZXNpemVJbmZvLm9wdEhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc2l6ZUluZm8udHJnV2lkdGg7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHJlc2l6ZUluZm8udHJnSGVpZ2h0O1xuICAgICAgICAgIGRyYXdJbWFnZUlPU0ZpeChjdHgsIGltZywgKF9yZWYgPSByZXNpemVJbmZvLnNyY1gpICE9IG51bGwgPyBfcmVmIDogMCwgKF9yZWYxID0gcmVzaXplSW5mby5zcmNZKSAhPSBudWxsID8gX3JlZjEgOiAwLCByZXNpemVJbmZvLnNyY1dpZHRoLCByZXNpemVJbmZvLnNyY0hlaWdodCwgKF9yZWYyID0gcmVzaXplSW5mby50cmdYKSAhPSBudWxsID8gX3JlZjIgOiAwLCAoX3JlZjMgPSByZXNpemVJbmZvLnRyZ1kpICE9IG51bGwgPyBfcmVmMyA6IDAsIHJlc2l6ZUluZm8udHJnV2lkdGgsIHJlc2l6ZUluZm8udHJnSGVpZ2h0KTtcbiAgICAgICAgICB0aHVtYm5haWwgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xuICAgICAgICAgIF90aGlzLmVtaXQoXCJ0aHVtYm5haWxcIiwgZmlsZSwgdGh1bWJuYWlsKTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICBpbWcub25lcnJvciA9IGNhbGxiYWNrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGltZy5zcmMgPSBpbWFnZVVybDtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnByb2Nlc3NRdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGksIHBhcmFsbGVsVXBsb2FkcywgcHJvY2Vzc2luZ0xlbmd0aCwgcXVldWVkRmlsZXM7XG4gICAgICBwYXJhbGxlbFVwbG9hZHMgPSB0aGlzLm9wdGlvbnMucGFyYWxsZWxVcGxvYWRzO1xuICAgICAgcHJvY2Vzc2luZ0xlbmd0aCA9IHRoaXMuZ2V0VXBsb2FkaW5nRmlsZXMoKS5sZW5ndGg7XG4gICAgICBpID0gcHJvY2Vzc2luZ0xlbmd0aDtcbiAgICAgIGlmIChwcm9jZXNzaW5nTGVuZ3RoID49IHBhcmFsbGVsVXBsb2Fkcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBxdWV1ZWRGaWxlcyA9IHRoaXMuZ2V0UXVldWVkRmlsZXMoKTtcbiAgICAgIGlmICghKHF1ZXVlZEZpbGVzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKHF1ZXVlZEZpbGVzLnNsaWNlKDAsIHBhcmFsbGVsVXBsb2FkcyAtIHByb2Nlc3NpbmdMZW5ndGgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChpIDwgcGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgICAgaWYgKCFxdWV1ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5wcm9jZXNzRmlsZShxdWV1ZWRGaWxlcy5zaGlmdCgpKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnByb2Nlc3NGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKFtmaWxlXSk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5wcm9jZXNzRmlsZXMgPSBmdW5jdGlvbihmaWxlcykge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBmaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gZmlsZXNbX2ldO1xuICAgICAgICBmaWxlLnByb2Nlc3NpbmcgPSB0cnVlO1xuICAgICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLlVQTE9BRElORztcbiAgICAgICAgdGhpcy5lbWl0KFwicHJvY2Vzc2luZ1wiLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKGZpbGVzKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9nZXRGaWxlc1dpdGhYaHIgPSBmdW5jdGlvbih4aHIpIHtcbiAgICAgIHZhciBmaWxlLCBmaWxlcztcbiAgICAgIHJldHVybiBmaWxlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgICBpZiAoZmlsZS54aHIgPT09IHhocikge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChmaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmNhbmNlbFVwbG9hZCA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHZhciBncm91cGVkRmlsZSwgZ3JvdXBlZEZpbGVzLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmO1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgZ3JvdXBlZEZpbGVzID0gdGhpcy5fZ2V0RmlsZXNXaXRoWGhyKGZpbGUueGhyKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBncm91cGVkRmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBncm91cGVkRmlsZSA9IGdyb3VwZWRGaWxlc1tfaV07XG4gICAgICAgICAgZ3JvdXBlZEZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQ0FOQ0VMRUQ7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZS54aHIuYWJvcnQoKTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gZ3JvdXBlZEZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGdyb3VwZWRGaWxlID0gZ3JvdXBlZEZpbGVzW19qXTtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjYW5jZWxlZFwiLCBncm91cGVkRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkbXVsdGlwbGVcIiwgZ3JvdXBlZEZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgoX3JlZiA9IGZpbGUuc3RhdHVzKSA9PT0gRHJvcHpvbmUuQURERUQgfHwgX3JlZiA9PT0gRHJvcHpvbmUuUVVFVUVEKSB7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQ0FOQ0VMRUQ7XG4gICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkXCIsIGZpbGUpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBbZmlsZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlc29sdmVPcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBvcHRpb247XG4gICAgICBvcHRpb24gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb247XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS51cGxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoW2ZpbGVdKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnVwbG9hZEZpbGVzID0gZnVuY3Rpb24oZmlsZXMpIHtcbiAgICAgIHZhciBmaWxlLCBmb3JtRGF0YSwgaGFuZGxlRXJyb3IsIGhlYWRlck5hbWUsIGhlYWRlclZhbHVlLCBoZWFkZXJzLCBpLCBpbnB1dCwgaW5wdXROYW1lLCBpbnB1dFR5cGUsIGtleSwgbWV0aG9kLCBvcHRpb24sIHByb2dyZXNzT2JqLCByZXNwb25zZSwgdXBkYXRlUHJvZ3Jlc3MsIHVybCwgdmFsdWUsIHhociwgX2ksIF9qLCBfaywgX2wsIF9sZW4sIF9sZW4xLCBfbGVuMiwgX2xlbjMsIF9tLCBfcmVmLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3JlZjU7XG4gICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgZmlsZS54aHIgPSB4aHI7XG4gICAgICB9XG4gICAgICBtZXRob2QgPSByZXNvbHZlT3B0aW9uKHRoaXMub3B0aW9ucy5tZXRob2QsIGZpbGVzKTtcbiAgICAgIHVybCA9IHJlc29sdmVPcHRpb24odGhpcy5vcHRpb25zLnVybCwgZmlsZXMpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhdGhpcy5vcHRpb25zLndpdGhDcmVkZW50aWFscztcbiAgICAgIHJlc3BvbnNlID0gbnVsbDtcbiAgICAgIGhhbmRsZUVycm9yID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX2osIF9sZW4xLCBfcmVzdWx0cztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IGZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgZmlsZSA9IGZpbGVzW19qXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goX3RoaXMuX2Vycm9yUHJvY2Vzc2luZyhmaWxlcywgcmVzcG9uc2UgfHwgX3RoaXMub3B0aW9ucy5kaWN0UmVzcG9uc2VFcnJvci5yZXBsYWNlKFwie3tzdGF0dXNDb2RlfX1cIiwgeGhyLnN0YXR1cyksIHhocikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHVwZGF0ZVByb2dyZXNzID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGFsbEZpbGVzRmluaXNoZWQsIHByb2dyZXNzLCBfaiwgX2ssIF9sLCBfbGVuMSwgX2xlbjIsIF9sZW4zLCBfcmVzdWx0cztcbiAgICAgICAgICBpZiAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBwcm9ncmVzcyA9IDEwMCAqIGUubG9hZGVkIC8gZS50b3RhbDtcbiAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IGZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICBmaWxlID0gZmlsZXNbX2pdO1xuICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3MsXG4gICAgICAgICAgICAgICAgdG90YWw6IGUudG90YWwsXG4gICAgICAgICAgICAgICAgYnl0ZXNTZW50OiBlLmxvYWRlZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGxGaWxlc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHByb2dyZXNzID0gMTAwO1xuICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gZmlsZXMubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICAgICAgICAgIGZpbGUgPSBmaWxlc1tfa107XG4gICAgICAgICAgICAgIGlmICghKGZpbGUudXBsb2FkLnByb2dyZXNzID09PSAxMDAgJiYgZmlsZS51cGxvYWQuYnl0ZXNTZW50ID09PSBmaWxlLnVwbG9hZC50b3RhbCkpIHtcbiAgICAgICAgICAgICAgICBhbGxGaWxlc0ZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQuYnl0ZXNTZW50ID0gZmlsZS51cGxvYWQudG90YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsRmlsZXNGaW5pc2hlZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfbCA9IDAsIF9sZW4zID0gZmlsZXMubGVuZ3RoOyBfbCA8IF9sZW4zOyBfbCsrKSB7XG4gICAgICAgICAgICBmaWxlID0gZmlsZXNbX2xdO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChfdGhpcy5lbWl0KFwidXBsb2FkcHJvZ3Jlc3NcIiwgZmlsZSwgcHJvZ3Jlc3MsIGZpbGUudXBsb2FkLmJ5dGVzU2VudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHhoci5vbmxvYWQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB2YXIgX3JlZjtcbiAgICAgICAgICBpZiAoZmlsZXNbMF0uc3RhdHVzID09PSBEcm9wem9uZS5DQU5DRUxFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgIGlmICh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJjb250ZW50LXR5cGVcIikgJiYgfnhoci5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKS5pbmRleE9mKFwiYXBwbGljYXRpb24vanNvblwiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICAgICAgICByZXNwb25zZSA9IFwiSW52YWxpZCBKU09OIHJlc3BvbnNlIGZyb20gc2VydmVyLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGRhdGVQcm9ncmVzcygpO1xuICAgICAgICAgIGlmICghKCgyMDAgPD0gKF9yZWYgPSB4aHIuc3RhdHVzKSAmJiBfcmVmIDwgMzAwKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVFcnJvcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX2ZpbmlzaGVkKGZpbGVzLCByZXNwb25zZSwgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICB4aHIub25lcnJvciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGZpbGVzWzBdLnN0YXR1cyA9PT0gRHJvcHpvbmUuQ0FOQ0VMRUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHByb2dyZXNzT2JqID0gKF9yZWYgPSB4aHIudXBsb2FkKSAhPSBudWxsID8gX3JlZiA6IHhocjtcbiAgICAgIHByb2dyZXNzT2JqLm9ucHJvZ3Jlc3MgPSB1cGRhdGVQcm9ncmVzcztcbiAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJuby1jYWNoZVwiLFxuICAgICAgICBcIlgtUmVxdWVzdGVkLVdpdGhcIjogXCJYTUxIdHRwUmVxdWVzdFwiXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIGV4dGVuZChoZWFkZXJzLCB0aGlzLm9wdGlvbnMuaGVhZGVycyk7XG4gICAgICB9XG4gICAgICBmb3IgKGhlYWRlck5hbWUgaW4gaGVhZGVycykge1xuICAgICAgICBoZWFkZXJWYWx1ZSA9IGhlYWRlcnNbaGVhZGVyTmFtZV07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIGhlYWRlclZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhcmFtcykge1xuICAgICAgICBfcmVmMSA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG4gICAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgICAgdmFsdWUgPSBfcmVmMVtrZXldO1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gZmlsZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1tfal07XG4gICAgICAgIHRoaXMuZW1pdChcInNlbmRpbmdcIiwgZmlsZSwgeGhyLCBmb3JtRGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcInNlbmRpbmdtdWx0aXBsZVwiLCBmaWxlcywgeGhyLCBmb3JtRGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT09IFwiRk9STVwiKSB7XG4gICAgICAgIF9yZWYyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCwgYnV0dG9uXCIpO1xuICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmMi5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICBpbnB1dCA9IF9yZWYyW19rXTtcbiAgICAgICAgICBpbnB1dE5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgICAgICAgIGlucHV0VHlwZSA9IGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIik7XG4gICAgICAgICAgaWYgKGlucHV0LnRhZ05hbWUgPT09IFwiU0VMRUNUXCIgJiYgaW5wdXQuaGFzQXR0cmlidXRlKFwibXVsdGlwbGVcIikpIHtcbiAgICAgICAgICAgIF9yZWYzID0gaW5wdXQub3B0aW9ucztcbiAgICAgICAgICAgIGZvciAoX2wgPSAwLCBfbGVuMyA9IF9yZWYzLmxlbmd0aDsgX2wgPCBfbGVuMzsgX2wrKykge1xuICAgICAgICAgICAgICBvcHRpb24gPSBfcmVmM1tfbF07XG4gICAgICAgICAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoaW5wdXROYW1lLCBvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghaW5wdXRUeXBlIHx8ICgoX3JlZjQgPSBpbnB1dFR5cGUudG9Mb3dlckNhc2UoKSkgIT09IFwiY2hlY2tib3hcIiAmJiBfcmVmNCAhPT0gXCJyYWRpb1wiKSB8fCBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoaW5wdXROYW1lLCBpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSBfbSA9IDAsIF9yZWY1ID0gZmlsZXMubGVuZ3RoIC0gMTsgMCA8PSBfcmVmNSA/IF9tIDw9IF9yZWY1IDogX20gPj0gX3JlZjU7IGkgPSAwIDw9IF9yZWY1ID8gKytfbSA6IC0tX20pIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKHRoaXMuX2dldFBhcmFtTmFtZShpKSwgZmlsZXNbaV0sIGZpbGVzW2ldLm5hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9maW5pc2hlZCA9IGZ1bmN0aW9uKGZpbGVzLCByZXNwb25zZVRleHQsIGUpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbjtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5TVUNDRVNTO1xuICAgICAgICB0aGlzLmVtaXQoXCJzdWNjZXNzXCIsIGZpbGUsIHJlc3BvbnNlVGV4dCwgZSk7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJzdWNjZXNzbXVsdGlwbGVcIiwgZmlsZXMsIHJlc3BvbnNlVGV4dCwgZSk7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2Vycm9yUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGZpbGVzLCBtZXNzYWdlLCB4aHIpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbjtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5FUlJPUjtcbiAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZmlsZSwgbWVzc2FnZSwgeGhyKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9ybXVsdGlwbGVcIiwgZmlsZXMsIG1lc3NhZ2UsIHhocik7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gRHJvcHpvbmU7XG5cbiAgfSkoRW1pdHRlcik7XG5cbiAgRHJvcHpvbmUudmVyc2lvbiA9IFwiNC4wLjFcIjtcblxuICBEcm9wem9uZS5vcHRpb25zID0ge307XG5cbiAgRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIikpIHtcbiAgICAgIHJldHVybiBEcm9wem9uZS5vcHRpb25zW2NhbWVsaXplKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIikpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgRHJvcHpvbmUuaW5zdGFuY2VzID0gW107XG5cbiAgRHJvcHpvbmUuZm9yRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpO1xuICAgIH1cbiAgICBpZiAoKGVsZW1lbnQgIT0gbnVsbCA/IGVsZW1lbnQuZHJvcHpvbmUgOiB2b2lkIDApID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIERyb3B6b25lIGZvdW5kIGZvciBnaXZlbiBlbGVtZW50LiBUaGlzIGlzIHByb2JhYmx5IGJlY2F1c2UgeW91J3JlIHRyeWluZyB0byBhY2Nlc3MgaXQgYmVmb3JlIERyb3B6b25lIGhhZCB0aGUgdGltZSB0byBpbml0aWFsaXplLiBVc2UgdGhlIGBpbml0YCBvcHRpb24gdG8gc2V0dXAgYW55IGFkZGl0aW9uYWwgb2JzZXJ2ZXJzIG9uIHlvdXIgRHJvcHpvbmUuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudC5kcm9wem9uZTtcbiAgfTtcblxuICBEcm9wem9uZS5hdXRvRGlzY292ZXIgPSB0cnVlO1xuXG4gIERyb3B6b25lLmRpc2NvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoZWNrRWxlbWVudHMsIGRyb3B6b25lLCBkcm9wem9uZXMsIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgZHJvcHpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wem9uZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJvcHpvbmVzID0gW107XG4gICAgICBjaGVja0VsZW1lbnRzID0gZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIGVsLCBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWxlbWVudHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBlbCA9IGVsZW1lbnRzW19pXTtcbiAgICAgICAgICBpZiAoLyhefCApZHJvcHpvbmUoJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGRyb3B6b25lcy5wdXNoKGVsKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfTtcbiAgICAgIGNoZWNrRWxlbWVudHMoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkaXZcIikpO1xuICAgICAgY2hlY2tFbGVtZW50cyhkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImZvcm1cIikpO1xuICAgIH1cbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZHJvcHpvbmVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBkcm9wem9uZSA9IGRyb3B6b25lc1tfaV07XG4gICAgICBpZiAoRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQoZHJvcHpvbmUpICE9PSBmYWxzZSkge1xuICAgICAgICBfcmVzdWx0cy5wdXNoKG5ldyBEcm9wem9uZShkcm9wem9uZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgRHJvcHpvbmUuYmxhY2tsaXN0ZWRCcm93c2VycyA9IFsvb3BlcmEuKk1hY2ludG9zaC4qdmVyc2lvblxcLzEyL2ldO1xuXG4gIERyb3B6b25lLmlzQnJvd3NlclN1cHBvcnRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXBhYmxlQnJvd3NlciwgcmVnZXgsIF9pLCBfbGVuLCBfcmVmO1xuICAgIGNhcGFibGVCcm93c2VyID0gdHJ1ZTtcbiAgICBpZiAod2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iICYmIHdpbmRvdy5Gb3JtRGF0YSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKSB7XG4gICAgICBpZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpKSkge1xuICAgICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3JlZiA9IERyb3B6b25lLmJsYWNrbGlzdGVkQnJvd3NlcnM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHJlZ2V4ID0gX3JlZltfaV07XG4gICAgICAgICAgaWYgKHJlZ2V4LnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgIGNhcGFibGVCcm93c2VyID0gZmFsc2U7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2FwYWJsZUJyb3dzZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNhcGFibGVCcm93c2VyO1xuICB9O1xuXG4gIHdpdGhvdXQgPSBmdW5jdGlvbihsaXN0LCByZWplY3RlZEl0ZW0pIHtcbiAgICB2YXIgaXRlbSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBsaXN0Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBpdGVtID0gbGlzdFtfaV07XG4gICAgICBpZiAoaXRlbSAhPT0gcmVqZWN0ZWRJdGVtKSB7XG4gICAgICAgIF9yZXN1bHRzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBjYW1lbGl6ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLV9dKFxcdykvZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXRjaC5jaGFyQXQoMSkudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgfTtcblxuICBEcm9wem9uZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdmFyIGRpdjtcbiAgICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHJpbmc7XG4gICAgcmV0dXJuIGRpdi5jaGlsZE5vZGVzWzBdO1xuICB9O1xuXG4gIERyb3B6b25lLmVsZW1lbnRJbnNpZGUgPSBmdW5jdGlvbihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBEcm9wem9uZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24oZWwsIG5hbWUpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBpZiAodHlwZW9mIGVsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgfSBlbHNlIGlmIChlbC5ub2RlVHlwZSAhPSBudWxsKSB7XG4gICAgICBlbGVtZW50ID0gZWw7XG4gICAgfVxuICAgIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYFwiICsgbmFtZSArIFwiYCBvcHRpb24gcHJvdmlkZWQuIFBsZWFzZSBwcm92aWRlIGEgQ1NTIHNlbGVjdG9yIG9yIGEgcGxhaW4gSFRNTCBlbGVtZW50LlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH07XG5cbiAgRHJvcHpvbmUuZ2V0RWxlbWVudHMgPSBmdW5jdGlvbihlbHMsIG5hbWUpIHtcbiAgICB2YXIgZSwgZWwsIGVsZW1lbnRzLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmO1xuICAgIGlmIChlbHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZWxlbWVudHMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWxzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZWwgPSBlbHNbX2ldO1xuICAgICAgICAgIGVsZW1lbnRzLnB1c2godGhpcy5nZXRFbGVtZW50KGVsLCBuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICBlbGVtZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZWxzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBlbGVtZW50cyA9IFtdO1xuICAgICAgX3JlZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxzKTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGVsID0gX3JlZltfal07XG4gICAgICAgIGVsZW1lbnRzLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZWxzLm5vZGVUeXBlICE9IG51bGwpIHtcbiAgICAgIGVsZW1lbnRzID0gW2Vsc107XG4gICAgfVxuICAgIGlmICghKChlbGVtZW50cyAhPSBudWxsKSAmJiBlbGVtZW50cy5sZW5ndGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGBcIiArIG5hbWUgKyBcImAgb3B0aW9uIHByb3ZpZGVkLiBQbGVhc2UgcHJvdmlkZSBhIENTUyBzZWxlY3RvciwgYSBwbGFpbiBIVE1MIGVsZW1lbnQgb3IgYSBsaXN0IG9mIHRob3NlLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRzO1xuICB9O1xuXG4gIERyb3B6b25lLmNvbmZpcm0gPSBmdW5jdGlvbihxdWVzdGlvbiwgYWNjZXB0ZWQsIHJlamVjdGVkKSB7XG4gICAgaWYgKHdpbmRvdy5jb25maXJtKHF1ZXN0aW9uKSkge1xuICAgICAgcmV0dXJuIGFjY2VwdGVkKCk7XG4gICAgfSBlbHNlIGlmIChyZWplY3RlZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWQoKTtcbiAgICB9XG4gIH07XG5cbiAgRHJvcHpvbmUuaXNWYWxpZEZpbGUgPSBmdW5jdGlvbihmaWxlLCBhY2NlcHRlZEZpbGVzKSB7XG4gICAgdmFyIGJhc2VNaW1lVHlwZSwgbWltZVR5cGUsIHZhbGlkVHlwZSwgX2ksIF9sZW47XG4gICAgaWYgKCFhY2NlcHRlZEZpbGVzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYWNjZXB0ZWRGaWxlcyA9IGFjY2VwdGVkRmlsZXMuc3BsaXQoXCIsXCIpO1xuICAgIG1pbWVUeXBlID0gZmlsZS50eXBlO1xuICAgIGJhc2VNaW1lVHlwZSA9IG1pbWVUeXBlLnJlcGxhY2UoL1xcLy4qJC8sIFwiXCIpO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYWNjZXB0ZWRGaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdmFsaWRUeXBlID0gYWNjZXB0ZWRGaWxlc1tfaV07XG4gICAgICB2YWxpZFR5cGUgPSB2YWxpZFR5cGUudHJpbSgpO1xuICAgICAgaWYgKHZhbGlkVHlwZS5jaGFyQXQoMCkgPT09IFwiLlwiKSB7XG4gICAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHZhbGlkVHlwZS50b0xvd2VyQ2FzZSgpLCBmaWxlLm5hbWUubGVuZ3RoIC0gdmFsaWRUeXBlLmxlbmd0aCkgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodmFsaWRUeXBlKSkge1xuICAgICAgICBpZiAoYmFzZU1pbWVUeXBlID09PSB2YWxpZFR5cGUucmVwbGFjZSgvXFwvLiokLywgXCJcIikpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1pbWVUeXBlID09PSB2YWxpZFR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgalF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgalF1ZXJ5LmZuLmRyb3B6b25lID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEcm9wem9uZSh0aGlzLCBvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IERyb3B6b25lO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5Ecm9wem9uZSA9IERyb3B6b25lO1xuICB9XG5cbiAgRHJvcHpvbmUuQURERUQgPSBcImFkZGVkXCI7XG5cbiAgRHJvcHpvbmUuUVVFVUVEID0gXCJxdWV1ZWRcIjtcblxuICBEcm9wem9uZS5BQ0NFUFRFRCA9IERyb3B6b25lLlFVRVVFRDtcblxuICBEcm9wem9uZS5VUExPQURJTkcgPSBcInVwbG9hZGluZ1wiO1xuXG4gIERyb3B6b25lLlBST0NFU1NJTkcgPSBEcm9wem9uZS5VUExPQURJTkc7XG5cbiAgRHJvcHpvbmUuQ0FOQ0VMRUQgPSBcImNhbmNlbGVkXCI7XG5cbiAgRHJvcHpvbmUuRVJST1IgPSBcImVycm9yXCI7XG5cbiAgRHJvcHpvbmUuU1VDQ0VTUyA9IFwic3VjY2Vzc1wiO1xuXG5cbiAgLypcbiAgXG4gIEJ1Z2ZpeCBmb3IgaU9TIDYgYW5kIDdcbiAgU291cmNlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExOTI5MDk5L2h0bWw1LWNhbnZhcy1kcmF3aW1hZ2UtcmF0aW8tYnVnLWlvc1xuICBiYXNlZCBvbiB0aGUgd29yayBvZiBodHRwczovL2dpdGh1Yi5jb20vc3RvbWl0YS9pb3MtaW1hZ2VmaWxlLW1lZ2FwaXhlbFxuICAgKi9cblxuICBkZXRlY3RWZXJ0aWNhbFNxdWFzaCA9IGZ1bmN0aW9uKGltZykge1xuICAgIHZhciBhbHBoYSwgY2FudmFzLCBjdHgsIGRhdGEsIGV5LCBpaCwgaXcsIHB5LCByYXRpbywgc3k7XG4gICAgaXcgPSBpbWcubmF0dXJhbFdpZHRoO1xuICAgIGloID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXMud2lkdGggPSAxO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpaDtcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICBkYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCAxLCBpaCkuZGF0YTtcbiAgICBzeSA9IDA7XG4gICAgZXkgPSBpaDtcbiAgICBweSA9IGloO1xuICAgIHdoaWxlIChweSA+IHN5KSB7XG4gICAgICBhbHBoYSA9IGRhdGFbKHB5IC0gMSkgKiA0ICsgM107XG4gICAgICBpZiAoYWxwaGEgPT09IDApIHtcbiAgICAgICAgZXkgPSBweTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN5ID0gcHk7XG4gICAgICB9XG4gICAgICBweSA9IChleSArIHN5KSA+PiAxO1xuICAgIH1cbiAgICByYXRpbyA9IHB5IC8gaWg7XG4gICAgaWYgKHJhdGlvID09PSAwKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJhdGlvO1xuICAgIH1cbiAgfTtcblxuICBkcmF3SW1hZ2VJT1NGaXggPSBmdW5jdGlvbihjdHgsIGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKSB7XG4gICAgdmFyIHZlcnRTcXVhc2hSYXRpbztcbiAgICB2ZXJ0U3F1YXNoUmF0aW8gPSBkZXRlY3RWZXJ0aWNhbFNxdWFzaChpbWcpO1xuICAgIHJldHVybiBjdHguZHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoIC8gdmVydFNxdWFzaFJhdGlvKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIGNvbnRlbnRsb2FkZWQuanNcbiAgICpcbiAgICogQXV0aG9yOiBEaWVnbyBQZXJpbmkgKGRpZWdvLnBlcmluaSBhdCBnbWFpbC5jb20pXG4gICAqIFN1bW1hcnk6IGNyb3NzLWJyb3dzZXIgd3JhcHBlciBmb3IgRE9NQ29udGVudExvYWRlZFxuICAgKiBVcGRhdGVkOiAyMDEwMTAyMFxuICAgKiBMaWNlbnNlOiBNSVRcbiAgICogVmVyc2lvbjogMS4yXG4gICAqXG4gICAqIFVSTDpcbiAgICogaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0NvbnRlbnRMb2FkZWQvXG4gICAqIGh0dHA6Ly9qYXZhc2NyaXB0Lm53Ym94LmNvbS9Db250ZW50TG9hZGVkL01JVC1MSUNFTlNFXG4gICAqL1xuXG4gIGNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbih3aW4sIGZuKSB7XG4gICAgdmFyIGFkZCwgZG9jLCBkb25lLCBpbml0LCBwb2xsLCBwcmUsIHJlbSwgcm9vdCwgdG9wO1xuICAgIGRvbmUgPSBmYWxzZTtcbiAgICB0b3AgPSB0cnVlO1xuICAgIGRvYyA9IHdpbi5kb2N1bWVudDtcbiAgICByb290ID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICBhZGQgPSAoZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyBcImFkZEV2ZW50TGlzdGVuZXJcIiA6IFwiYXR0YWNoRXZlbnRcIik7XG4gICAgcmVtID0gKGRvYy5hZGRFdmVudExpc3RlbmVyID8gXCJyZW1vdmVFdmVudExpc3RlbmVyXCIgOiBcImRldGFjaEV2ZW50XCIpO1xuICAgIHByZSA9IChkb2MuYWRkRXZlbnRMaXN0ZW5lciA/IFwiXCIgOiBcIm9uXCIpO1xuICAgIGluaXQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS50eXBlID09PSBcInJlYWR5c3RhdGVjaGFuZ2VcIiAmJiBkb2MucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIChlLnR5cGUgPT09IFwibG9hZFwiID8gd2luIDogZG9jKVtyZW1dKHByZSArIGUudHlwZSwgaW5pdCwgZmFsc2UpO1xuICAgICAgaWYgKCFkb25lICYmIChkb25lID0gdHJ1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwod2luLCBlLnR5cGUgfHwgZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJvb3QuZG9TY3JvbGwoXCJsZWZ0XCIpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICAgIHNldFRpbWVvdXQocG9sbCwgNTApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5pdChcInBvbGxcIik7XG4gICAgfTtcbiAgICBpZiAoZG9jLnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xuICAgICAgaWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCAmJiByb290LmRvU2Nyb2xsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdG9wID0gIXdpbi5mcmFtZUVsZW1lbnQ7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgICAgaWYgKHRvcCkge1xuICAgICAgICAgIHBvbGwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9jW2FkZF0ocHJlICsgXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQsIGZhbHNlKTtcbiAgICAgIGRvY1thZGRdKHByZSArIFwicmVhZHlzdGF0ZWNoYW5nZVwiLCBpbml0LCBmYWxzZSk7XG4gICAgICByZXR1cm4gd2luW2FkZF0ocHJlICsgXCJsb2FkXCIsIGluaXQsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKERyb3B6b25lLmF1dG9EaXNjb3Zlcikge1xuICAgICAgcmV0dXJuIERyb3B6b25lLmRpc2NvdmVyKCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnRlbnRMb2FkZWQod2luZG93LCBEcm9wem9uZS5fYXV0b0Rpc2NvdmVyRnVuY3Rpb24pO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBoZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXInKVxuXG5hbmd1bGFyLm1vZHVsZSgnRGFzaGJvYXJkJylcblxuLmNvbnRyb2xsZXIoJ0FjdGl2aXRpZXNMaXN0Q3RybCcsIFsnJHNjb3BlJywgJ0FjdGl2aXRpZXMnLFxuXHRmdW5jdGlvbigkc2NvcGUsIEFjdGl2aXRpZXMpIHtcblx0XHRoZWxwZXIuc2V0VGl0bGUoJ0FwcHMgcnVubmluZycpXG5cdFx0aGVscGVyLnNldE5hdkNvbG9yKCd5ZWxsb3cnKVxuXHRcdEFjdGl2aXRpZXMuYWxsKClcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHQkc2NvcGUuYXBwcyA9IGRhdGFcblx0XHR9KS5cblx0XHRlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcblx0XHRcdHRvYXN0ci5lcnJvcihkYXRhLCAnU3RhdHVzICcgKyBzdGF0dXMpXG5cdFx0fSlcblx0XHQkc2NvcGUuc3RvcCA9IEFjdGl2aXRpZXMuc3RvcFxuXHR9XSlcblxuLmNvbnRyb2xsZXIoJ0FjdGl2aXRpZXNMaXZlQ3RybCcsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdBY3Rpdml0aWVzJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBBY3Rpdml0aWVzKSB7XG4gICAgaGVscGVyLnNldFRpdGxlKCRyb3V0ZVBhcmFtcy5uYW1lKVxuICAgIGhlbHBlci5zZXROYXZDb2xvcignZ3JlZW4nKVxuICAgIEFjdGl2aXRpZXMub3Blbigkc2NvcGUsICRyb3V0ZVBhcmFtcy5uYW1lKVxuICB9XSkiLCIndXNlIHN0cmljdCdcblxudmFyIGhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcicpXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Rhc2hib2FyZCcpXG52YXIgRHJvcHpvbmUgPSByZXF1aXJlKCdEcm9wem9uZScpXG5cbmFwcC5jb250cm9sbGVyKCdBcHBzU2hvd0N0cmwnLCBbXG4gICckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0FwcHMnLCAnQWN0aXZpdGllcycsICckc2NlJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGVQYXJhbXMsIEFwcHMsIEFjdGl2aXRpZXMsICRzY2UpIHtcbiAgICB2YXIgYXBwTmFtZSA9ICRyb3V0ZVBhcmFtcy5uYW1lXG4gICAgaGVscGVyLnNldE5hdkNvbG9yKCdibHVlJylcbiAgICBoZWxwZXIuc2V0VGl0bGUoYXBwTmFtZSlcbiAgICBBcHBzLmdldFJlYWRtZShhcHBOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5yZWFkbWUgPSAkc2NlLnRydXN0QXNIdG1sKGRhdGEpXG4gICAgfSkgXG4gICAgQXBwcy5nZXQoYXBwTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUuYXBwID0gZGF0YVxuICAgIH0pXG4gICAgQWN0aXZpdGllcy5sYXVuY2goJHNjb3BlLCBhcHBOYW1lKVxuICB9XSlcblxuYXBwLmNvbnRyb2xsZXIoJ0FwcHNMaXN0Q3RybCcsIFsnJHNjb3BlJywgJ0FwcHMnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCBBcHBzKSB7XG4gICAgaGVscGVyLnNldFRpdGxlKCdZb3VyIGFwcHMgZHJhd2VyJylcbiAgICBoZWxwZXIuc2V0TmF2Q29sb3IoJ2JsdWUnKVxuICAgIEFwcHMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUuYXBwcyA9IGRhdGFcbiAgICB9KVxuICB9XSlcblxuYXBwLmNvbnRyb2xsZXIoJ0FwcHNSbUN0cmwnLCBbJyRzY29wZScsICdBcHBzJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgQXBwcykge1xuICAgIGhlbHBlci5zZXRUaXRsZSgnVW5pbnN0YWxsIGFwcHMnKVxuICAgIGhlbHBlci5zZXROYXZDb2xvcigncmVkJylcbiAgICBBcHBzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLmFwcHMgPSBkYXRhXG4gICAgfSlcbiAgfV0pXG5cbmFwcC5jb250cm9sbGVyKCdBcHBzTmV3Q3RybCcsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICckaHR0cCcsICAnJGxvY2F0aW9uJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwLCAkbG9jYXRpb24pIHtcblxuICAgIGhlbHBlci5oaWRlTmF2KClcbiAgICBoZWxwZXIuc2V0VGl0bGUoJ0luc3RhbGwgYSBuZXcgYXBwJylcblxuICAgIHZhciBkeiA9IG5ldyBEcm9wem9uZShcIi5kcm9wem9uZVwiLCB7XG4gICAgICB1cmw6IFwiL2FwcHNcIixcbiAgICAgIG1heEZpbGVzOiAxLFxuICAgICAgYWNjZXB0OiBmdW5jdGlvbihmaWxlLCBkb25lKSB7XG4gICAgICAgIHZhciBmbmFtZSA9IGZpbGUubmFtZVxuICAgICAgICB2YXIgZXh0ID0gW2ZuYW1lLnNwbGl0KCcuJylbMV0sIGZuYW1lLnNwbGl0KCcuJylbMl1dLmpvaW4oJy4nKVxuICAgICAgICBpZihleHQgPT09ICd0YXIuZ3onIHx8IGV4dCA9PT0gJ3Rnei4nKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1VwbG9hZGluZyBmaWxlIHdpdGggZXh0ZW5zaW9uICcgKyBleHQpXG4gICAgICAgICAgZG9uZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgnSW52YWxpZCBmaWxlIHR5cGUuIE11c3QgYmUgYSB0YXIuZ3onKVxuICAgICAgICAgIHRoaXMucmVtb3ZlRmlsZShmaWxlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIGR6Lm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oZmlsZSwgZXJyb3IsIHhocikge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yKVxuICAgICAgZHoucmVtb3ZlRmlsZShmaWxlKVxuICAgIH0pXG5cbiAgICBkei5vbihcInByb2Nlc3NpbmdcIiwgZnVuY3Rpb24oZmlsZSwgcmVzcG9uc2UpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKVxuICAgIH0pXG4gIH1dKSIsInJlcXVpcmUoJy4vYWN0aXZpdGllcycpXG5yZXF1aXJlKCcuL2FwcHMnKVxucmVxdWlyZSgnLi91c2VycycpXG5yZXF1aXJlKCcuL21pc2MnKVxuXG4iLCIndXNlIHN0cmljdCdcblxudmFyIGhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcicpXG5cbmFuZ3VsYXIubW9kdWxlKCdEYXNoYm9hcmQnKVxuLmNvbnRyb2xsZXIoJ1JvdXRlc0N0cmwnLCBbJyRzY29wZScsICckaHR0cCcsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwKSB7XG4gICAgaGVscGVyLnNldFRpdGxlKCdbRGV2XSBBUEknKVxuICAgIGhlbHBlci5zZXROYXZDb2xvcignb3JhbmdlJylcbiAgICAkaHR0cC5nZXQoJy9yb3V0ZXMnKS5cbiAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAkc2NvcGUucm91dGVzID0gZGF0YVxuICAgICAgJHNjb3BlLmtleXMgPSBPYmplY3Qua2V5c1xuICAgIH0pLlxuICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0dXMgKyAnIHdoZW4gR0VUIC9yb3V0ZXMgLT4gJyArIGRhdGEpXG4gICAgfSlcbiAgfV0pXG5cbmFuZ3VsYXIubW9kdWxlKCdEYXNoYm9hcmQnKVxuLmNvbnRyb2xsZXIoJ1NldHRpbmdzQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHApIHtcbiAgICBoZWxwZXIuc2V0VGl0bGUoJ1NldHRpbmdzJylcbiAgICBoZWxwZXIuc2V0TmF2Q29sb3IoJyM3Nzc3NzcnKVxuXG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRodHRwLnB1dCgnL3VwZGF0ZScpXG4gICAgfVxuICB9XSkiLCIndXNlIHN0cmljdCdcblxudmFyIGhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcicpXG5cbmFuZ3VsYXIubW9kdWxlKCdEYXNoYm9hcmQnKVxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcblx0XHRoZWxwZXIuc2V0VGl0bGUoJ1NpZ24gaW4nKVxuXHRcdCRzY29wZS5jcmVkZW50aWFscyA9IHt9XG5cdFx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG5cdFx0XHQkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscylcblx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQT1NUICAvbG9naW4gLT4gJylcblx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSlcblx0XHRcdFx0JHJvb3RTY29wZS51c2VyID0gZGF0YSAgICAgICAgICAgXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKFwiL1wiKVxuXHRcdFx0fSlcblx0XHRcdC5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoZGF0YSlcblx0XHRcdH0pXG5cdFx0fVxuXHR9XSkiLCIoZnVuY3Rpb24oKSB7XG5cblx0dmFyIERhc2hib2FyZCA9IGFuZ3VsYXIubW9kdWxlKCdEYXNoYm9hcmQnKTtcblxuXHREYXNoYm9hcmQuZGlyZWN0aXZlKCd0b29sQm94JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Rvb2wtYm94Lmh0bWwnXG5cdFx0fTtcblx0fSk7XG5cblx0RGFzaGJvYXJkLmRpcmVjdGl2ZSgnYXBwUm1CdG4nLCBbJyRodHRwJyxcblx0XHRmdW5jdGlvbigkaHR0cCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0XHRhcHA6ICc9YXBwJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkZWwtb3ZlcmxheVwiPidcblx0XHRcdFx0KyAnPGEgY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIG5nLWNsaWNrPVwiZGVsZXRlKClcIj4nXG5cdFx0XHRcdCsgJ0RlbGV0ZSA8L2E+PC9kaXY+Jyxcblx0XHRcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCkge1xuXHRcdFx0XHRcdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9ICRzY29wZS5hcHAubmFtZTtcblx0XHRcdFx0XHRcdHZhciBtc2cgPSAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHVuaW5zdGFsbCAnICsgaXRlbSArICc/Jztcblx0XHRcdFx0XHRcdGlmIChjb25maXJtKG1zZykpIHtcblx0XHRcdFx0XHRcdFx0JGh0dHAuZGVsZXRlKCcvYXBwcy8nICsgaXRlbSkuXG5cdFx0XHRcdFx0XHRcdHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnREVMRVRFICAvYXBwcy8nICsgaXRlbSArICcgLT4gJyArIGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdGl0ZW1IVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0aXRlbUhUTUwucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpdGVtSFRNTCk7XG5cdFx0XHRcdFx0XHRcdH0pLlxuXHRcdFx0XHRcdFx0XHRlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0YXR1cyArICcgd2hlbiBERUxFVEUgL2FwcHMvJytpdGVtKycgLT4gJyArIGRhdGEpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1dKTtcblxufSkoKTsiLCIvLyBTb21lIGhlbHBlciBtZXRob2RzOlxuLy89PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0cy5oaWRlTmF2ID0gZnVuY3Rpb24gKCkge1xuICBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmF2JylbMF07XG4gIG5hdi5zdHlsZS5oZWlnaHQgPSAwO1xufTtcblxuZXhwb3J0cy5zZXROYXZDb2xvciA9IGZ1bmN0aW9uIHNldE5hdkNvbG9yKHN0cikge1xuICB2YXIgY29sb3JzID0ge1xuICAgYmx1ZSA6ICBcIiM3M0M1RTFcIixcbiAgIG9yYW5nZSA6ICBcIiNGQkE4MjdcIixcbiAgIGdyZWVuIDogIFwiIzFGREE5QVwiLFxuICAgcGluayA6ICBcIiNFQjY1QTBcIixcbiAgIHllbGxvdyA6ICBcIiNGRkQ0NTJcIixcbiAgIGdyZXkgOiAgXCIjRjJGMkYzXCIsXG4gICBibGFjayA6ICBcIiMzMzMzMzNcIixcbiAgIHJlZCA6ICBcIiNlNjU2NTZcIlxuIH07XG4gbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25hdicpWzBdO1xuIG5hdi5zdHlsZS5oZWlnaHQgPSAnM3B4JztcbiBuYXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JzW3N0cl0gfHwgc3RyO1xufTtcblxuZXhwb3J0cy5zZXRUaXRsZSA9IGZ1bmN0aW9uKHN0cikge1xuICBkb2N1bWVudC50aXRsZSA9ICcgQmV0YSB8ICcgKyBzdHI7XG4gIHZhciB0b29sZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJyk7XG4gIHRvb2xkaXYuaW5uZXJIVE1MID0gJzxzcGFuPicgKyBzdHIgKyAnPC9zcGFuPic7XG59O1xuIiwiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuaW89ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiBmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30oezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPV9kZXJlcV8oXCIuL2xpYi9cIil9LHtcIi4vbGliL1wiOjJ9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXt2YXIgdXJsPV9kZXJlcV8oXCIuL3VybFwiKTt2YXIgcGFyc2VyPV9kZXJlcV8oXCJzb2NrZXQuaW8tcGFyc2VyXCIpO3ZhciBNYW5hZ2VyPV9kZXJlcV8oXCIuL21hbmFnZXJcIik7dmFyIGRlYnVnPV9kZXJlcV8oXCJkZWJ1Z1wiKShcInNvY2tldC5pby1jbGllbnRcIik7bW9kdWxlLmV4cG9ydHM9ZXhwb3J0cz1sb29rdXA7dmFyIGNhY2hlPWV4cG9ydHMubWFuYWdlcnM9e307ZnVuY3Rpb24gbG9va3VwKHVyaSxvcHRzKXtpZih0eXBlb2YgdXJpPT1cIm9iamVjdFwiKXtvcHRzPXVyaTt1cmk9dW5kZWZpbmVkfW9wdHM9b3B0c3x8e307dmFyIHBhcnNlZD11cmwodXJpKTt2YXIgc291cmNlPXBhcnNlZC5zb3VyY2U7dmFyIGlkPXBhcnNlZC5pZDt2YXIgaW87aWYob3B0cy5mb3JjZU5ld3x8b3B0c1tcImZvcmNlIG5ldyBjb25uZWN0aW9uXCJdfHxmYWxzZT09PW9wdHMubXVsdGlwbGV4KXtkZWJ1ZyhcImlnbm9yaW5nIHNvY2tldCBjYWNoZSBmb3IgJXNcIixzb3VyY2UpO2lvPU1hbmFnZXIoc291cmNlLG9wdHMpfWVsc2V7aWYoIWNhY2hlW2lkXSl7ZGVidWcoXCJuZXcgaW8gaW5zdGFuY2UgZm9yICVzXCIsc291cmNlKTtjYWNoZVtpZF09TWFuYWdlcihzb3VyY2Usb3B0cyl9aW89Y2FjaGVbaWRdfXJldHVybiBpby5zb2NrZXQocGFyc2VkLnBhdGgpfWV4cG9ydHMucHJvdG9jb2w9cGFyc2VyLnByb3RvY29sO2V4cG9ydHMuY29ubmVjdD1sb29rdXA7ZXhwb3J0cy5NYW5hZ2VyPV9kZXJlcV8oXCIuL21hbmFnZXJcIik7ZXhwb3J0cy5Tb2NrZXQ9X2RlcmVxXyhcIi4vc29ja2V0XCIpfSx7XCIuL21hbmFnZXJcIjozLFwiLi9zb2NrZXRcIjo1LFwiLi91cmxcIjo2LGRlYnVnOjEwLFwic29ja2V0LmlvLXBhcnNlclwiOjQ2fV0sMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIHVybD1fZGVyZXFfKFwiLi91cmxcIik7dmFyIGVpbz1fZGVyZXFfKFwiZW5naW5lLmlvLWNsaWVudFwiKTt2YXIgU29ja2V0PV9kZXJlcV8oXCIuL3NvY2tldFwiKTt2YXIgRW1pdHRlcj1fZGVyZXFfKFwiY29tcG9uZW50LWVtaXR0ZXJcIik7dmFyIHBhcnNlcj1fZGVyZXFfKFwic29ja2V0LmlvLXBhcnNlclwiKTt2YXIgb249X2RlcmVxXyhcIi4vb25cIik7dmFyIGJpbmQ9X2RlcmVxXyhcImNvbXBvbmVudC1iaW5kXCIpO3ZhciBvYmplY3Q9X2RlcmVxXyhcIm9iamVjdC1jb21wb25lbnRcIik7dmFyIGRlYnVnPV9kZXJlcV8oXCJkZWJ1Z1wiKShcInNvY2tldC5pby1jbGllbnQ6bWFuYWdlclwiKTt2YXIgaW5kZXhPZj1fZGVyZXFfKFwiaW5kZXhvZlwiKTt2YXIgQmFja29mZj1fZGVyZXFfKFwiYmFja28yXCIpO21vZHVsZS5leHBvcnRzPU1hbmFnZXI7ZnVuY3Rpb24gTWFuYWdlcih1cmksb3B0cyl7aWYoISh0aGlzIGluc3RhbmNlb2YgTWFuYWdlcikpcmV0dXJuIG5ldyBNYW5hZ2VyKHVyaSxvcHRzKTtpZih1cmkmJlwib2JqZWN0XCI9PXR5cGVvZiB1cmkpe29wdHM9dXJpO3VyaT11bmRlZmluZWR9b3B0cz1vcHRzfHx7fTtvcHRzLnBhdGg9b3B0cy5wYXRofHxcIi9zb2NrZXQuaW9cIjt0aGlzLm5zcHM9e307dGhpcy5zdWJzPVtdO3RoaXMub3B0cz1vcHRzO3RoaXMucmVjb25uZWN0aW9uKG9wdHMucmVjb25uZWN0aW9uIT09ZmFsc2UpO3RoaXMucmVjb25uZWN0aW9uQXR0ZW1wdHMob3B0cy5yZWNvbm5lY3Rpb25BdHRlbXB0c3x8SW5maW5pdHkpO3RoaXMucmVjb25uZWN0aW9uRGVsYXkob3B0cy5yZWNvbm5lY3Rpb25EZWxheXx8MWUzKTt0aGlzLnJlY29ubmVjdGlvbkRlbGF5TWF4KG9wdHMucmVjb25uZWN0aW9uRGVsYXlNYXh8fDVlMyk7dGhpcy5yYW5kb21pemF0aW9uRmFjdG9yKG9wdHMucmFuZG9taXphdGlvbkZhY3Rvcnx8LjUpO3RoaXMuYmFja29mZj1uZXcgQmFja29mZih7bWluOnRoaXMucmVjb25uZWN0aW9uRGVsYXkoKSxtYXg6dGhpcy5yZWNvbm5lY3Rpb25EZWxheU1heCgpLGppdHRlcjp0aGlzLnJhbmRvbWl6YXRpb25GYWN0b3IoKX0pO3RoaXMudGltZW91dChudWxsPT1vcHRzLnRpbWVvdXQ/MmU0Om9wdHMudGltZW91dCk7dGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCI7dGhpcy51cmk9dXJpO3RoaXMuY29ubmVjdGVkPVtdO3RoaXMuZW5jb2Rpbmc9ZmFsc2U7dGhpcy5wYWNrZXRCdWZmZXI9W107dGhpcy5lbmNvZGVyPW5ldyBwYXJzZXIuRW5jb2Rlcjt0aGlzLmRlY29kZXI9bmV3IHBhcnNlci5EZWNvZGVyO3RoaXMuYXV0b0Nvbm5lY3Q9b3B0cy5hdXRvQ29ubmVjdCE9PWZhbHNlO2lmKHRoaXMuYXV0b0Nvbm5lY3QpdGhpcy5vcGVuKCl9TWFuYWdlci5wcm90b3R5cGUuZW1pdEFsbD1mdW5jdGlvbigpe3RoaXMuZW1pdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7Zm9yKHZhciBuc3AgaW4gdGhpcy5uc3BzKXt0aGlzLm5zcHNbbnNwXS5lbWl0LmFwcGx5KHRoaXMubnNwc1tuc3BdLGFyZ3VtZW50cyl9fTtNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGVTb2NrZXRJZHM9ZnVuY3Rpb24oKXtmb3IodmFyIG5zcCBpbiB0aGlzLm5zcHMpe3RoaXMubnNwc1tuc3BdLmlkPXRoaXMuZW5naW5lLmlkfX07RW1pdHRlcihNYW5hZ2VyLnByb3RvdHlwZSk7TWFuYWdlci5wcm90b3R5cGUucmVjb25uZWN0aW9uPWZ1bmN0aW9uKHYpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9yZWNvbm5lY3Rpb247dGhpcy5fcmVjb25uZWN0aW9uPSEhdjtyZXR1cm4gdGhpc307TWFuYWdlci5wcm90b3R5cGUucmVjb25uZWN0aW9uQXR0ZW1wdHM9ZnVuY3Rpb24odil7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3JlY29ubmVjdGlvbkF0dGVtcHRzO3RoaXMuX3JlY29ubmVjdGlvbkF0dGVtcHRzPXY7cmV0dXJuIHRoaXN9O01hbmFnZXIucHJvdG90eXBlLnJlY29ubmVjdGlvbkRlbGF5PWZ1bmN0aW9uKHYpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9yZWNvbm5lY3Rpb25EZWxheTt0aGlzLl9yZWNvbm5lY3Rpb25EZWxheT12O3RoaXMuYmFja29mZiYmdGhpcy5iYWNrb2ZmLnNldE1pbih2KTtyZXR1cm4gdGhpc307TWFuYWdlci5wcm90b3R5cGUucmFuZG9taXphdGlvbkZhY3Rvcj1mdW5jdGlvbih2KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fcmFuZG9taXphdGlvbkZhY3Rvcjt0aGlzLl9yYW5kb21pemF0aW9uRmFjdG9yPXY7dGhpcy5iYWNrb2ZmJiZ0aGlzLmJhY2tvZmYuc2V0Sml0dGVyKHYpO3JldHVybiB0aGlzfTtNYW5hZ2VyLnByb3RvdHlwZS5yZWNvbm5lY3Rpb25EZWxheU1heD1mdW5jdGlvbih2KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fcmVjb25uZWN0aW9uRGVsYXlNYXg7dGhpcy5fcmVjb25uZWN0aW9uRGVsYXlNYXg9djt0aGlzLmJhY2tvZmYmJnRoaXMuYmFja29mZi5zZXRNYXgodik7cmV0dXJuIHRoaXN9O01hbmFnZXIucHJvdG90eXBlLnRpbWVvdXQ9ZnVuY3Rpb24odil7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3RpbWVvdXQ7dGhpcy5fdGltZW91dD12O3JldHVybiB0aGlzfTtNYW5hZ2VyLnByb3RvdHlwZS5tYXliZVJlY29ubmVjdE9uT3Blbj1mdW5jdGlvbigpe2lmKCF0aGlzLnJlY29ubmVjdGluZyYmdGhpcy5fcmVjb25uZWN0aW9uJiZ0aGlzLmJhY2tvZmYuYXR0ZW1wdHM9PT0wKXt0aGlzLnJlY29ubmVjdCgpfX07TWFuYWdlci5wcm90b3R5cGUub3Blbj1NYW5hZ2VyLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKGZuKXtkZWJ1ZyhcInJlYWR5U3RhdGUgJXNcIix0aGlzLnJlYWR5U3RhdGUpO2lmKH50aGlzLnJlYWR5U3RhdGUuaW5kZXhPZihcIm9wZW5cIikpcmV0dXJuIHRoaXM7ZGVidWcoXCJvcGVuaW5nICVzXCIsdGhpcy51cmkpO3RoaXMuZW5naW5lPWVpbyh0aGlzLnVyaSx0aGlzLm9wdHMpO3ZhciBzb2NrZXQ9dGhpcy5lbmdpbmU7dmFyIHNlbGY9dGhpczt0aGlzLnJlYWR5U3RhdGU9XCJvcGVuaW5nXCI7dGhpcy5za2lwUmVjb25uZWN0PWZhbHNlO3ZhciBvcGVuU3ViPW9uKHNvY2tldCxcIm9wZW5cIixmdW5jdGlvbigpe3NlbGYub25vcGVuKCk7Zm4mJmZuKCl9KTt2YXIgZXJyb3JTdWI9b24oc29ja2V0LFwiZXJyb3JcIixmdW5jdGlvbihkYXRhKXtkZWJ1ZyhcImNvbm5lY3RfZXJyb3JcIik7c2VsZi5jbGVhbnVwKCk7c2VsZi5yZWFkeVN0YXRlPVwiY2xvc2VkXCI7c2VsZi5lbWl0QWxsKFwiY29ubmVjdF9lcnJvclwiLGRhdGEpO2lmKGZuKXt2YXIgZXJyPW5ldyBFcnJvcihcIkNvbm5lY3Rpb24gZXJyb3JcIik7ZXJyLmRhdGE9ZGF0YTtmbihlcnIpfWVsc2V7c2VsZi5tYXliZVJlY29ubmVjdE9uT3BlbigpfX0pO2lmKGZhbHNlIT09dGhpcy5fdGltZW91dCl7dmFyIHRpbWVvdXQ9dGhpcy5fdGltZW91dDtkZWJ1ZyhcImNvbm5lY3QgYXR0ZW1wdCB3aWxsIHRpbWVvdXQgYWZ0ZXIgJWRcIix0aW1lb3V0KTt2YXIgdGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe2RlYnVnKFwiY29ubmVjdCBhdHRlbXB0IHRpbWVkIG91dCBhZnRlciAlZFwiLHRpbWVvdXQpO29wZW5TdWIuZGVzdHJveSgpO3NvY2tldC5jbG9zZSgpO3NvY2tldC5lbWl0KFwiZXJyb3JcIixcInRpbWVvdXRcIik7c2VsZi5lbWl0QWxsKFwiY29ubmVjdF90aW1lb3V0XCIsdGltZW91dCl9LHRpbWVvdXQpO3RoaXMuc3Vicy5wdXNoKHtkZXN0cm95OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRpbWVyKX19KX10aGlzLnN1YnMucHVzaChvcGVuU3ViKTt0aGlzLnN1YnMucHVzaChlcnJvclN1Yik7cmV0dXJuIHRoaXN9O01hbmFnZXIucHJvdG90eXBlLm9ub3Blbj1mdW5jdGlvbigpe2RlYnVnKFwib3BlblwiKTt0aGlzLmNsZWFudXAoKTt0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCI7dGhpcy5lbWl0KFwib3BlblwiKTt2YXIgc29ja2V0PXRoaXMuZW5naW5lO3RoaXMuc3Vicy5wdXNoKG9uKHNvY2tldCxcImRhdGFcIixiaW5kKHRoaXMsXCJvbmRhdGFcIikpKTt0aGlzLnN1YnMucHVzaChvbih0aGlzLmRlY29kZXIsXCJkZWNvZGVkXCIsYmluZCh0aGlzLFwib25kZWNvZGVkXCIpKSk7dGhpcy5zdWJzLnB1c2gob24oc29ja2V0LFwiZXJyb3JcIixiaW5kKHRoaXMsXCJvbmVycm9yXCIpKSk7dGhpcy5zdWJzLnB1c2gob24oc29ja2V0LFwiY2xvc2VcIixiaW5kKHRoaXMsXCJvbmNsb3NlXCIpKSl9O01hbmFnZXIucHJvdG90eXBlLm9uZGF0YT1mdW5jdGlvbihkYXRhKXt0aGlzLmRlY29kZXIuYWRkKGRhdGEpfTtNYW5hZ2VyLnByb3RvdHlwZS5vbmRlY29kZWQ9ZnVuY3Rpb24ocGFja2V0KXt0aGlzLmVtaXQoXCJwYWNrZXRcIixwYWNrZXQpfTtNYW5hZ2VyLnByb3RvdHlwZS5vbmVycm9yPWZ1bmN0aW9uKGVycil7ZGVidWcoXCJlcnJvclwiLGVycik7dGhpcy5lbWl0QWxsKFwiZXJyb3JcIixlcnIpfTtNYW5hZ2VyLnByb3RvdHlwZS5zb2NrZXQ9ZnVuY3Rpb24obnNwKXt2YXIgc29ja2V0PXRoaXMubnNwc1tuc3BdO2lmKCFzb2NrZXQpe3NvY2tldD1uZXcgU29ja2V0KHRoaXMsbnNwKTt0aGlzLm5zcHNbbnNwXT1zb2NrZXQ7dmFyIHNlbGY9dGhpcztzb2NrZXQub24oXCJjb25uZWN0XCIsZnVuY3Rpb24oKXtzb2NrZXQuaWQ9c2VsZi5lbmdpbmUuaWQ7aWYoIX5pbmRleE9mKHNlbGYuY29ubmVjdGVkLHNvY2tldCkpe3NlbGYuY29ubmVjdGVkLnB1c2goc29ja2V0KX19KX1yZXR1cm4gc29ja2V0fTtNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKHNvY2tldCl7dmFyIGluZGV4PWluZGV4T2YodGhpcy5jb25uZWN0ZWQsc29ja2V0KTtpZih+aW5kZXgpdGhpcy5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LDEpO2lmKHRoaXMuY29ubmVjdGVkLmxlbmd0aClyZXR1cm47dGhpcy5jbG9zZSgpfTtNYW5hZ2VyLnByb3RvdHlwZS5wYWNrZXQ9ZnVuY3Rpb24ocGFja2V0KXtkZWJ1ZyhcIndyaXRpbmcgcGFja2V0ICVqXCIscGFja2V0KTt2YXIgc2VsZj10aGlzO2lmKCFzZWxmLmVuY29kaW5nKXtzZWxmLmVuY29kaW5nPXRydWU7dGhpcy5lbmNvZGVyLmVuY29kZShwYWNrZXQsZnVuY3Rpb24oZW5jb2RlZFBhY2tldHMpe2Zvcih2YXIgaT0wO2k8ZW5jb2RlZFBhY2tldHMubGVuZ3RoO2krKyl7c2VsZi5lbmdpbmUud3JpdGUoZW5jb2RlZFBhY2tldHNbaV0pfXNlbGYuZW5jb2Rpbmc9ZmFsc2U7c2VsZi5wcm9jZXNzUGFja2V0UXVldWUoKX0pfWVsc2V7c2VsZi5wYWNrZXRCdWZmZXIucHVzaChwYWNrZXQpfX07TWFuYWdlci5wcm90b3R5cGUucHJvY2Vzc1BhY2tldFF1ZXVlPWZ1bmN0aW9uKCl7aWYodGhpcy5wYWNrZXRCdWZmZXIubGVuZ3RoPjAmJiF0aGlzLmVuY29kaW5nKXt2YXIgcGFjaz10aGlzLnBhY2tldEJ1ZmZlci5zaGlmdCgpO3RoaXMucGFja2V0KHBhY2spfX07TWFuYWdlci5wcm90b3R5cGUuY2xlYW51cD1mdW5jdGlvbigpe3ZhciBzdWI7d2hpbGUoc3ViPXRoaXMuc3Vicy5zaGlmdCgpKXN1Yi5kZXN0cm95KCk7dGhpcy5wYWNrZXRCdWZmZXI9W107dGhpcy5lbmNvZGluZz1mYWxzZTt0aGlzLmRlY29kZXIuZGVzdHJveSgpfTtNYW5hZ2VyLnByb3RvdHlwZS5jbG9zZT1NYW5hZ2VyLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7dGhpcy5za2lwUmVjb25uZWN0PXRydWU7dGhpcy5iYWNrb2ZmLnJlc2V0KCk7dGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCI7dGhpcy5lbmdpbmUmJnRoaXMuZW5naW5lLmNsb3NlKCl9O01hbmFnZXIucHJvdG90eXBlLm9uY2xvc2U9ZnVuY3Rpb24ocmVhc29uKXtkZWJ1ZyhcImNsb3NlXCIpO3RoaXMuY2xlYW51cCgpO3RoaXMuYmFja29mZi5yZXNldCgpO3RoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiO3RoaXMuZW1pdChcImNsb3NlXCIscmVhc29uKTtpZih0aGlzLl9yZWNvbm5lY3Rpb24mJiF0aGlzLnNraXBSZWNvbm5lY3Qpe3RoaXMucmVjb25uZWN0KCl9fTtNYW5hZ2VyLnByb3RvdHlwZS5yZWNvbm5lY3Q9ZnVuY3Rpb24oKXtpZih0aGlzLnJlY29ubmVjdGluZ3x8dGhpcy5za2lwUmVjb25uZWN0KXJldHVybiB0aGlzO3ZhciBzZWxmPXRoaXM7aWYodGhpcy5iYWNrb2ZmLmF0dGVtcHRzPj10aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0cyl7ZGVidWcoXCJyZWNvbm5lY3QgZmFpbGVkXCIpO3RoaXMuYmFja29mZi5yZXNldCgpO3RoaXMuZW1pdEFsbChcInJlY29ubmVjdF9mYWlsZWRcIik7dGhpcy5yZWNvbm5lY3Rpbmc9ZmFsc2V9ZWxzZXt2YXIgZGVsYXk9dGhpcy5iYWNrb2ZmLmR1cmF0aW9uKCk7ZGVidWcoXCJ3aWxsIHdhaXQgJWRtcyBiZWZvcmUgcmVjb25uZWN0IGF0dGVtcHRcIixkZWxheSk7dGhpcy5yZWNvbm5lY3Rpbmc9dHJ1ZTt2YXIgdGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe2lmKHNlbGYuc2tpcFJlY29ubmVjdClyZXR1cm47ZGVidWcoXCJhdHRlbXB0aW5nIHJlY29ubmVjdFwiKTtzZWxmLmVtaXRBbGwoXCJyZWNvbm5lY3RfYXR0ZW1wdFwiLHNlbGYuYmFja29mZi5hdHRlbXB0cyk7c2VsZi5lbWl0QWxsKFwicmVjb25uZWN0aW5nXCIsc2VsZi5iYWNrb2ZmLmF0dGVtcHRzKTtpZihzZWxmLnNraXBSZWNvbm5lY3QpcmV0dXJuO3NlbGYub3BlbihmdW5jdGlvbihlcnIpe2lmKGVycil7ZGVidWcoXCJyZWNvbm5lY3QgYXR0ZW1wdCBlcnJvclwiKTtzZWxmLnJlY29ubmVjdGluZz1mYWxzZTtzZWxmLnJlY29ubmVjdCgpO3NlbGYuZW1pdEFsbChcInJlY29ubmVjdF9lcnJvclwiLGVyci5kYXRhKX1lbHNle2RlYnVnKFwicmVjb25uZWN0IHN1Y2Nlc3NcIik7c2VsZi5vbnJlY29ubmVjdCgpfX0pfSxkZWxheSk7dGhpcy5zdWJzLnB1c2goe2Rlc3Ryb3k6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGltZXIpfX0pfX07TWFuYWdlci5wcm90b3R5cGUub25yZWNvbm5lY3Q9ZnVuY3Rpb24oKXt2YXIgYXR0ZW1wdD10aGlzLmJhY2tvZmYuYXR0ZW1wdHM7dGhpcy5yZWNvbm5lY3Rpbmc9ZmFsc2U7dGhpcy5iYWNrb2ZmLnJlc2V0KCk7dGhpcy51cGRhdGVTb2NrZXRJZHMoKTt0aGlzLmVtaXRBbGwoXCJyZWNvbm5lY3RcIixhdHRlbXB0KX19LHtcIi4vb25cIjo0LFwiLi9zb2NrZXRcIjo1LFwiLi91cmxcIjo2LGJhY2tvMjo3LFwiY29tcG9uZW50LWJpbmRcIjo4LFwiY29tcG9uZW50LWVtaXR0ZXJcIjo5LGRlYnVnOjEwLFwiZW5naW5lLmlvLWNsaWVudFwiOjExLGluZGV4b2Y6NDIsXCJvYmplY3QtY29tcG9uZW50XCI6NDMsXCJzb2NrZXQuaW8tcGFyc2VyXCI6NDZ9XSw0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1vbjtmdW5jdGlvbiBvbihvYmosZXYsZm4pe29iai5vbihldixmbik7cmV0dXJue2Rlc3Ryb3k6ZnVuY3Rpb24oKXtvYmoucmVtb3ZlTGlzdGVuZXIoZXYsZm4pfX19fSx7fV0sNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIHBhcnNlcj1fZGVyZXFfKFwic29ja2V0LmlvLXBhcnNlclwiKTt2YXIgRW1pdHRlcj1fZGVyZXFfKFwiY29tcG9uZW50LWVtaXR0ZXJcIik7dmFyIHRvQXJyYXk9X2RlcmVxXyhcInRvLWFycmF5XCIpO3ZhciBvbj1fZGVyZXFfKFwiLi9vblwiKTt2YXIgYmluZD1fZGVyZXFfKFwiY29tcG9uZW50LWJpbmRcIik7dmFyIGRlYnVnPV9kZXJlcV8oXCJkZWJ1Z1wiKShcInNvY2tldC5pby1jbGllbnQ6c29ja2V0XCIpO3ZhciBoYXNCaW49X2RlcmVxXyhcImhhcy1iaW5hcnlcIik7bW9kdWxlLmV4cG9ydHM9ZXhwb3J0cz1Tb2NrZXQ7dmFyIGV2ZW50cz17Y29ubmVjdDoxLGNvbm5lY3RfZXJyb3I6MSxjb25uZWN0X3RpbWVvdXQ6MSxkaXNjb25uZWN0OjEsZXJyb3I6MSxyZWNvbm5lY3Q6MSxyZWNvbm5lY3RfYXR0ZW1wdDoxLHJlY29ubmVjdF9mYWlsZWQ6MSxyZWNvbm5lY3RfZXJyb3I6MSxyZWNvbm5lY3Rpbmc6MX07dmFyIGVtaXQ9RW1pdHRlci5wcm90b3R5cGUuZW1pdDtmdW5jdGlvbiBTb2NrZXQoaW8sbnNwKXt0aGlzLmlvPWlvO3RoaXMubnNwPW5zcDt0aGlzLmpzb249dGhpczt0aGlzLmlkcz0wO3RoaXMuYWNrcz17fTtpZih0aGlzLmlvLmF1dG9Db25uZWN0KXRoaXMub3BlbigpO3RoaXMucmVjZWl2ZUJ1ZmZlcj1bXTt0aGlzLnNlbmRCdWZmZXI9W107dGhpcy5jb25uZWN0ZWQ9ZmFsc2U7dGhpcy5kaXNjb25uZWN0ZWQ9dHJ1ZX1FbWl0dGVyKFNvY2tldC5wcm90b3R5cGUpO1NvY2tldC5wcm90b3R5cGUuc3ViRXZlbnRzPWZ1bmN0aW9uKCl7aWYodGhpcy5zdWJzKXJldHVybjt2YXIgaW89dGhpcy5pbzt0aGlzLnN1YnM9W29uKGlvLFwib3BlblwiLGJpbmQodGhpcyxcIm9ub3BlblwiKSksb24oaW8sXCJwYWNrZXRcIixiaW5kKHRoaXMsXCJvbnBhY2tldFwiKSksb24oaW8sXCJjbG9zZVwiLGJpbmQodGhpcyxcIm9uY2xvc2VcIikpXX07U29ja2V0LnByb3RvdHlwZS5vcGVuPVNvY2tldC5wcm90b3R5cGUuY29ubmVjdD1mdW5jdGlvbigpe2lmKHRoaXMuY29ubmVjdGVkKXJldHVybiB0aGlzO3RoaXMuc3ViRXZlbnRzKCk7dGhpcy5pby5vcGVuKCk7aWYoXCJvcGVuXCI9PXRoaXMuaW8ucmVhZHlTdGF0ZSl0aGlzLm9ub3BlbigpO3JldHVybiB0aGlzfTtTb2NrZXQucHJvdG90eXBlLnNlbmQ9ZnVuY3Rpb24oKXt2YXIgYXJncz10b0FycmF5KGFyZ3VtZW50cyk7YXJncy51bnNoaWZ0KFwibWVzc2FnZVwiKTt0aGlzLmVtaXQuYXBwbHkodGhpcyxhcmdzKTtyZXR1cm4gdGhpc307U29ja2V0LnByb3RvdHlwZS5lbWl0PWZ1bmN0aW9uKGV2KXtpZihldmVudHMuaGFzT3duUHJvcGVydHkoZXYpKXtlbWl0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtyZXR1cm4gdGhpc312YXIgYXJncz10b0FycmF5KGFyZ3VtZW50cyk7dmFyIHBhcnNlclR5cGU9cGFyc2VyLkVWRU5UO2lmKGhhc0JpbihhcmdzKSl7cGFyc2VyVHlwZT1wYXJzZXIuQklOQVJZX0VWRU5UfXZhciBwYWNrZXQ9e3R5cGU6cGFyc2VyVHlwZSxkYXRhOmFyZ3N9O2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGFyZ3NbYXJncy5sZW5ndGgtMV0pe2RlYnVnKFwiZW1pdHRpbmcgcGFja2V0IHdpdGggYWNrIGlkICVkXCIsdGhpcy5pZHMpO3RoaXMuYWNrc1t0aGlzLmlkc109YXJncy5wb3AoKTtwYWNrZXQuaWQ9dGhpcy5pZHMrK31pZih0aGlzLmNvbm5lY3RlZCl7dGhpcy5wYWNrZXQocGFja2V0KX1lbHNle3RoaXMuc2VuZEJ1ZmZlci5wdXNoKHBhY2tldCl9cmV0dXJuIHRoaXN9O1NvY2tldC5wcm90b3R5cGUucGFja2V0PWZ1bmN0aW9uKHBhY2tldCl7cGFja2V0Lm5zcD10aGlzLm5zcDt0aGlzLmlvLnBhY2tldChwYWNrZXQpfTtTb2NrZXQucHJvdG90eXBlLm9ub3Blbj1mdW5jdGlvbigpe2RlYnVnKFwidHJhbnNwb3J0IGlzIG9wZW4gLSBjb25uZWN0aW5nXCIpO2lmKFwiL1wiIT10aGlzLm5zcCl7dGhpcy5wYWNrZXQoe3R5cGU6cGFyc2VyLkNPTk5FQ1R9KX19O1NvY2tldC5wcm90b3R5cGUub25jbG9zZT1mdW5jdGlvbihyZWFzb24pe2RlYnVnKFwiY2xvc2UgKCVzKVwiLHJlYXNvbik7dGhpcy5jb25uZWN0ZWQ9ZmFsc2U7dGhpcy5kaXNjb25uZWN0ZWQ9dHJ1ZTtkZWxldGUgdGhpcy5pZDt0aGlzLmVtaXQoXCJkaXNjb25uZWN0XCIscmVhc29uKX07U29ja2V0LnByb3RvdHlwZS5vbnBhY2tldD1mdW5jdGlvbihwYWNrZXQpe2lmKHBhY2tldC5uc3AhPXRoaXMubnNwKXJldHVybjtzd2l0Y2gocGFja2V0LnR5cGUpe2Nhc2UgcGFyc2VyLkNPTk5FQ1Q6dGhpcy5vbmNvbm5lY3QoKTticmVhaztjYXNlIHBhcnNlci5FVkVOVDp0aGlzLm9uZXZlbnQocGFja2V0KTticmVhaztjYXNlIHBhcnNlci5CSU5BUllfRVZFTlQ6dGhpcy5vbmV2ZW50KHBhY2tldCk7YnJlYWs7Y2FzZSBwYXJzZXIuQUNLOnRoaXMub25hY2socGFja2V0KTticmVhaztjYXNlIHBhcnNlci5CSU5BUllfQUNLOnRoaXMub25hY2socGFja2V0KTticmVhaztjYXNlIHBhcnNlci5ESVNDT05ORUNUOnRoaXMub25kaXNjb25uZWN0KCk7YnJlYWs7Y2FzZSBwYXJzZXIuRVJST1I6dGhpcy5lbWl0KFwiZXJyb3JcIixwYWNrZXQuZGF0YSk7YnJlYWt9fTtTb2NrZXQucHJvdG90eXBlLm9uZXZlbnQ9ZnVuY3Rpb24ocGFja2V0KXt2YXIgYXJncz1wYWNrZXQuZGF0YXx8W107ZGVidWcoXCJlbWl0dGluZyBldmVudCAlalwiLGFyZ3MpO2lmKG51bGwhPXBhY2tldC5pZCl7ZGVidWcoXCJhdHRhY2hpbmcgYWNrIGNhbGxiYWNrIHRvIGV2ZW50XCIpO2FyZ3MucHVzaCh0aGlzLmFjayhwYWNrZXQuaWQpKX1pZih0aGlzLmNvbm5lY3RlZCl7ZW1pdC5hcHBseSh0aGlzLGFyZ3MpfWVsc2V7dGhpcy5yZWNlaXZlQnVmZmVyLnB1c2goYXJncyl9fTtTb2NrZXQucHJvdG90eXBlLmFjaz1mdW5jdGlvbihpZCl7dmFyIHNlbGY9dGhpczt2YXIgc2VudD1mYWxzZTtyZXR1cm4gZnVuY3Rpb24oKXtpZihzZW50KXJldHVybjtzZW50PXRydWU7dmFyIGFyZ3M9dG9BcnJheShhcmd1bWVudHMpO2RlYnVnKFwic2VuZGluZyBhY2sgJWpcIixhcmdzKTt2YXIgdHlwZT1oYXNCaW4oYXJncyk/cGFyc2VyLkJJTkFSWV9BQ0s6cGFyc2VyLkFDSztzZWxmLnBhY2tldCh7dHlwZTp0eXBlLGlkOmlkLGRhdGE6YXJnc30pfX07U29ja2V0LnByb3RvdHlwZS5vbmFjaz1mdW5jdGlvbihwYWNrZXQpe2RlYnVnKFwiY2FsbGluZyBhY2sgJXMgd2l0aCAlalwiLHBhY2tldC5pZCxwYWNrZXQuZGF0YSk7dmFyIGZuPXRoaXMuYWNrc1twYWNrZXQuaWRdO2ZuLmFwcGx5KHRoaXMscGFja2V0LmRhdGEpO2RlbGV0ZSB0aGlzLmFja3NbcGFja2V0LmlkXX07U29ja2V0LnByb3RvdHlwZS5vbmNvbm5lY3Q9ZnVuY3Rpb24oKXt0aGlzLmNvbm5lY3RlZD10cnVlO3RoaXMuZGlzY29ubmVjdGVkPWZhbHNlO3RoaXMuZW1pdChcImNvbm5lY3RcIik7dGhpcy5lbWl0QnVmZmVyZWQoKX07U29ja2V0LnByb3RvdHlwZS5lbWl0QnVmZmVyZWQ9ZnVuY3Rpb24oKXt2YXIgaTtmb3IoaT0wO2k8dGhpcy5yZWNlaXZlQnVmZmVyLmxlbmd0aDtpKyspe2VtaXQuYXBwbHkodGhpcyx0aGlzLnJlY2VpdmVCdWZmZXJbaV0pfXRoaXMucmVjZWl2ZUJ1ZmZlcj1bXTtmb3IoaT0wO2k8dGhpcy5zZW5kQnVmZmVyLmxlbmd0aDtpKyspe3RoaXMucGFja2V0KHRoaXMuc2VuZEJ1ZmZlcltpXSl9dGhpcy5zZW5kQnVmZmVyPVtdfTtTb2NrZXQucHJvdG90eXBlLm9uZGlzY29ubmVjdD1mdW5jdGlvbigpe2RlYnVnKFwic2VydmVyIGRpc2Nvbm5lY3QgKCVzKVwiLHRoaXMubnNwKTt0aGlzLmRlc3Ryb3koKTt0aGlzLm9uY2xvc2UoXCJpbyBzZXJ2ZXIgZGlzY29ubmVjdFwiKX07U29ja2V0LnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7aWYodGhpcy5zdWJzKXtmb3IodmFyIGk9MDtpPHRoaXMuc3Vicy5sZW5ndGg7aSsrKXt0aGlzLnN1YnNbaV0uZGVzdHJveSgpfXRoaXMuc3Vicz1udWxsfXRoaXMuaW8uZGVzdHJveSh0aGlzKX07U29ja2V0LnByb3RvdHlwZS5jbG9zZT1Tb2NrZXQucHJvdG90eXBlLmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXtpZih0aGlzLmNvbm5lY3RlZCl7ZGVidWcoXCJwZXJmb3JtaW5nIGRpc2Nvbm5lY3QgKCVzKVwiLHRoaXMubnNwKTt0aGlzLnBhY2tldCh7dHlwZTpwYXJzZXIuRElTQ09OTkVDVH0pfXRoaXMuZGVzdHJveSgpO2lmKHRoaXMuY29ubmVjdGVkKXt0aGlzLm9uY2xvc2UoXCJpbyBjbGllbnQgZGlzY29ubmVjdFwiKX1yZXR1cm4gdGhpc319LHtcIi4vb25cIjo0LFwiY29tcG9uZW50LWJpbmRcIjo4LFwiY29tcG9uZW50LWVtaXR0ZXJcIjo5LGRlYnVnOjEwLFwiaGFzLWJpbmFyeVwiOjM4LFwic29ja2V0LmlvLXBhcnNlclwiOjQ2LFwidG8tYXJyYXlcIjo1MH1dLDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpe3ZhciBwYXJzZXVyaT1fZGVyZXFfKFwicGFyc2V1cmlcIik7dmFyIGRlYnVnPV9kZXJlcV8oXCJkZWJ1Z1wiKShcInNvY2tldC5pby1jbGllbnQ6dXJsXCIpO21vZHVsZS5leHBvcnRzPXVybDtmdW5jdGlvbiB1cmwodXJpLGxvYyl7dmFyIG9iaj11cmk7dmFyIGxvYz1sb2N8fGdsb2JhbC5sb2NhdGlvbjtpZihudWxsPT11cmkpdXJpPWxvYy5wcm90b2NvbCtcIi8vXCIrbG9jLmhvc3Q7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHVyaSl7aWYoXCIvXCI9PXVyaS5jaGFyQXQoMCkpe2lmKFwiL1wiPT11cmkuY2hhckF0KDEpKXt1cmk9bG9jLnByb3RvY29sK3VyaX1lbHNle3VyaT1sb2MuaG9zdG5hbWUrdXJpfX1pZighL14oaHR0cHM/fHdzcz8pOlxcL1xcLy8udGVzdCh1cmkpKXtkZWJ1ZyhcInByb3RvY29sLWxlc3MgdXJsICVzXCIsdXJpKTtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgbG9jKXt1cmk9bG9jLnByb3RvY29sK1wiLy9cIit1cml9ZWxzZXt1cmk9XCJodHRwczovL1wiK3VyaX19ZGVidWcoXCJwYXJzZSAlc1wiLHVyaSk7b2JqPXBhcnNldXJpKHVyaSl9aWYoIW9iai5wb3J0KXtpZigvXihodHRwfHdzKSQvLnRlc3Qob2JqLnByb3RvY29sKSl7b2JqLnBvcnQ9XCI4MFwifWVsc2UgaWYoL14oaHR0cHx3cylzJC8udGVzdChvYmoucHJvdG9jb2wpKXtvYmoucG9ydD1cIjQ0M1wifX1vYmoucGF0aD1vYmoucGF0aHx8XCIvXCI7b2JqLmlkPW9iai5wcm90b2NvbCtcIjovL1wiK29iai5ob3N0K1wiOlwiK29iai5wb3J0O29iai5ocmVmPW9iai5wcm90b2NvbCtcIjovL1wiK29iai5ob3N0Kyhsb2MmJmxvYy5wb3J0PT1vYmoucG9ydD9cIlwiOlwiOlwiK29iai5wb3J0KTtyZXR1cm4gb2JqfX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIj93aW5kb3c6e30pfSx7ZGVidWc6MTAscGFyc2V1cmk6NDR9XSw3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1CYWNrb2ZmO2Z1bmN0aW9uIEJhY2tvZmYob3B0cyl7b3B0cz1vcHRzfHx7fTt0aGlzLm1zPW9wdHMubWlufHwxMDA7dGhpcy5tYXg9b3B0cy5tYXh8fDFlNDt0aGlzLmZhY3Rvcj1vcHRzLmZhY3Rvcnx8Mjt0aGlzLmppdHRlcj1vcHRzLmppdHRlcj4wJiZvcHRzLmppdHRlcjw9MT9vcHRzLmppdHRlcjowO3RoaXMuYXR0ZW1wdHM9MH1CYWNrb2ZmLnByb3RvdHlwZS5kdXJhdGlvbj1mdW5jdGlvbigpe3ZhciBtcz10aGlzLm1zKk1hdGgucG93KHRoaXMuZmFjdG9yLHRoaXMuYXR0ZW1wdHMrKyk7aWYodGhpcy5qaXR0ZXIpe3ZhciByYW5kPU1hdGgucmFuZG9tKCk7dmFyIGRldmlhdGlvbj1NYXRoLmZsb29yKHJhbmQqdGhpcy5qaXR0ZXIqbXMpO21zPShNYXRoLmZsb29yKHJhbmQqMTApJjEpPT0wP21zLWRldmlhdGlvbjptcytkZXZpYXRpb259cmV0dXJuIE1hdGgubWluKG1zLHRoaXMubWF4KXwwfTtCYWNrb2ZmLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuYXR0ZW1wdHM9MH07QmFja29mZi5wcm90b3R5cGUuc2V0TWluPWZ1bmN0aW9uKG1pbil7dGhpcy5tcz1taW59O0JhY2tvZmYucHJvdG90eXBlLnNldE1heD1mdW5jdGlvbihtYXgpe3RoaXMubWF4PW1heH07QmFja29mZi5wcm90b3R5cGUuc2V0Sml0dGVyPWZ1bmN0aW9uKGppdHRlcil7dGhpcy5qaXR0ZXI9aml0dGVyfX0se31dLDg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBzbGljZT1bXS5zbGljZTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihvYmosZm4pe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBmbilmbj1vYmpbZm5dO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGZuKXRocm93IG5ldyBFcnJvcihcImJpbmQoKSByZXF1aXJlcyBhIGZ1bmN0aW9uXCIpO3ZhciBhcmdzPXNsaWNlLmNhbGwoYXJndW1lbnRzLDIpO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBmbi5hcHBseShvYmosYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSl9fX0se31dLDk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPUVtaXR0ZXI7ZnVuY3Rpb24gRW1pdHRlcihvYmope2lmKG9iailyZXR1cm4gbWl4aW4ob2JqKX1mdW5jdGlvbiBtaXhpbihvYmope2Zvcih2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKXtvYmpba2V5XT1FbWl0dGVyLnByb3RvdHlwZVtrZXldfXJldHVybiBvYmp9RW1pdHRlci5wcm90b3R5cGUub249RW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbihldmVudCxmbil7dGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e307KHRoaXMuX2NhbGxiYWNrc1tldmVudF09dGhpcy5fY2FsbGJhY2tzW2V2ZW50XXx8W10pLnB1c2goZm4pO3JldHVybiB0aGlzfTtFbWl0dGVyLnByb3RvdHlwZS5vbmNlPWZ1bmN0aW9uKGV2ZW50LGZuKXt2YXIgc2VsZj10aGlzO3RoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9O2Z1bmN0aW9uIG9uKCl7c2VsZi5vZmYoZXZlbnQsb24pO2ZuLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1vbi5mbj1mbjt0aGlzLm9uKGV2ZW50LG9uKTtyZXR1cm4gdGhpc307RW1pdHRlci5wcm90b3R5cGUub2ZmPUVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyPUVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycz1FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKGV2ZW50LGZuKXt0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fTtpZigwPT1hcmd1bWVudHMubGVuZ3RoKXt0aGlzLl9jYWxsYmFja3M9e307cmV0dXJuIHRoaXN9dmFyIGNhbGxiYWNrcz10aGlzLl9jYWxsYmFja3NbZXZlbnRdO2lmKCFjYWxsYmFja3MpcmV0dXJuIHRoaXM7aWYoMT09YXJndW1lbnRzLmxlbmd0aCl7ZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07cmV0dXJuIHRoaXN9dmFyIGNiO2Zvcih2YXIgaT0wO2k8Y2FsbGJhY2tzLmxlbmd0aDtpKyspe2NiPWNhbGxiYWNrc1tpXTtpZihjYj09PWZufHxjYi5mbj09PWZuKXtjYWxsYmFja3Muc3BsaWNlKGksMSk7YnJlYWt9fXJldHVybiB0aGlzfTtFbWl0dGVyLnByb3RvdHlwZS5lbWl0PWZ1bmN0aW9uKGV2ZW50KXt0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fTt2YXIgYXJncz1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxjYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtpZihjYWxsYmFja3Mpe2NhbGxiYWNrcz1jYWxsYmFja3Muc2xpY2UoMCk7Zm9yKHZhciBpPTAsbGVuPWNhbGxiYWNrcy5sZW5ndGg7aTxsZW47KytpKXtjYWxsYmFja3NbaV0uYXBwbHkodGhpcyxhcmdzKX19cmV0dXJuIHRoaXN9O0VtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycz1mdW5jdGlvbihldmVudCl7dGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e307cmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF18fFtdfTtFbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnM9ZnVuY3Rpb24oZXZlbnQpe3JldHVybiEhdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aH19LHt9XSwxMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9ZGVidWc7ZnVuY3Rpb24gZGVidWcobmFtZSl7aWYoIWRlYnVnLmVuYWJsZWQobmFtZSkpcmV0dXJuIGZ1bmN0aW9uKCl7fTtyZXR1cm4gZnVuY3Rpb24oZm10KXtmbXQ9Y29lcmNlKGZtdCk7dmFyIGN1cnI9bmV3IERhdGU7dmFyIG1zPWN1cnItKGRlYnVnW25hbWVdfHxjdXJyKTtkZWJ1Z1tuYW1lXT1jdXJyO2ZtdD1uYW1lK1wiIFwiK2ZtdCtcIiArXCIrZGVidWcuaHVtYW5pemUobXMpO3dpbmRvdy5jb25zb2xlJiZjb25zb2xlLmxvZyYmRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csY29uc29sZSxhcmd1bWVudHMpfX1kZWJ1Zy5uYW1lcz1bXTtkZWJ1Zy5za2lwcz1bXTtkZWJ1Zy5lbmFibGU9ZnVuY3Rpb24obmFtZSl7dHJ5e2xvY2FsU3RvcmFnZS5kZWJ1Zz1uYW1lfWNhdGNoKGUpe312YXIgc3BsaXQ9KG5hbWV8fFwiXCIpLnNwbGl0KC9bXFxzLF0rLyksbGVuPXNwbGl0Lmxlbmd0aDtmb3IodmFyIGk9MDtpPGxlbjtpKyspe25hbWU9c3BsaXRbaV0ucmVwbGFjZShcIipcIixcIi4qP1wiKTtpZihuYW1lWzBdPT09XCItXCIpe2RlYnVnLnNraXBzLnB1c2gobmV3IFJlZ0V4cChcIl5cIituYW1lLnN1YnN0cigxKStcIiRcIikpfWVsc2V7ZGVidWcubmFtZXMucHVzaChuZXcgUmVnRXhwKFwiXlwiK25hbWUrXCIkXCIpKX19fTtkZWJ1Zy5kaXNhYmxlPWZ1bmN0aW9uKCl7ZGVidWcuZW5hYmxlKFwiXCIpfTtkZWJ1Zy5odW1hbml6ZT1mdW5jdGlvbihtcyl7dmFyIHNlYz0xZTMsbWluPTYwKjFlMyxob3VyPTYwKm1pbjtpZihtcz49aG91cilyZXR1cm4obXMvaG91cikudG9GaXhlZCgxKStcImhcIjtpZihtcz49bWluKXJldHVybihtcy9taW4pLnRvRml4ZWQoMSkrXCJtXCI7aWYobXM+PXNlYylyZXR1cm4obXMvc2VjfDApK1wic1wiO3JldHVybiBtcytcIm1zXCJ9O2RlYnVnLmVuYWJsZWQ9ZnVuY3Rpb24obmFtZSl7Zm9yKHZhciBpPTAsbGVuPWRlYnVnLnNraXBzLmxlbmd0aDtpPGxlbjtpKyspe2lmKGRlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpe3JldHVybiBmYWxzZX19Zm9yKHZhciBpPTAsbGVuPWRlYnVnLm5hbWVzLmxlbmd0aDtpPGxlbjtpKyspe2lmKGRlYnVnLm5hbWVzW2ldLnRlc3QobmFtZSkpe3JldHVybiB0cnVlfX1yZXR1cm4gZmFsc2V9O2Z1bmN0aW9uIGNvZXJjZSh2YWwpe2lmKHZhbCBpbnN0YW5jZW9mIEVycm9yKXJldHVybiB2YWwuc3RhY2t8fHZhbC5tZXNzYWdlO3JldHVybiB2YWx9dHJ5e2lmKHdpbmRvdy5sb2NhbFN0b3JhZ2UpZGVidWcuZW5hYmxlKGxvY2FsU3RvcmFnZS5kZWJ1Zyl9Y2F0Y2goZSl7fX0se31dLDExOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1fZGVyZXFfKFwiLi9saWIvXCIpfSx7XCIuL2xpYi9cIjoxMn1dLDEyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1fZGVyZXFfKFwiLi9zb2NrZXRcIik7bW9kdWxlLmV4cG9ydHMucGFyc2VyPV9kZXJlcV8oXCJlbmdpbmUuaW8tcGFyc2VyXCIpfSx7XCIuL3NvY2tldFwiOjEzLFwiZW5naW5lLmlvLXBhcnNlclwiOjI1fV0sMTM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpe3ZhciB0cmFuc3BvcnRzPV9kZXJlcV8oXCIuL3RyYW5zcG9ydHNcIik7dmFyIEVtaXR0ZXI9X2RlcmVxXyhcImNvbXBvbmVudC1lbWl0dGVyXCIpO3ZhciBkZWJ1Zz1fZGVyZXFfKFwiZGVidWdcIikoXCJlbmdpbmUuaW8tY2xpZW50OnNvY2tldFwiKTt2YXIgaW5kZXg9X2RlcmVxXyhcImluZGV4b2ZcIik7dmFyIHBhcnNlcj1fZGVyZXFfKFwiZW5naW5lLmlvLXBhcnNlclwiKTt2YXIgcGFyc2V1cmk9X2RlcmVxXyhcInBhcnNldXJpXCIpO3ZhciBwYXJzZWpzb249X2RlcmVxXyhcInBhcnNlanNvblwiKTt2YXIgcGFyc2Vxcz1fZGVyZXFfKFwicGFyc2Vxc1wiKTttb2R1bGUuZXhwb3J0cz1Tb2NrZXQ7ZnVuY3Rpb24gbm9vcCgpe31mdW5jdGlvbiBTb2NrZXQodXJpLG9wdHMpe2lmKCEodGhpcyBpbnN0YW5jZW9mIFNvY2tldCkpcmV0dXJuIG5ldyBTb2NrZXQodXJpLG9wdHMpO29wdHM9b3B0c3x8e307aWYodXJpJiZcIm9iamVjdFwiPT10eXBlb2YgdXJpKXtvcHRzPXVyaTt1cmk9bnVsbH1pZih1cmkpe3VyaT1wYXJzZXVyaSh1cmkpO29wdHMuaG9zdD11cmkuaG9zdDtvcHRzLnNlY3VyZT11cmkucHJvdG9jb2w9PVwiaHR0cHNcInx8dXJpLnByb3RvY29sPT1cIndzc1wiO29wdHMucG9ydD11cmkucG9ydDtpZih1cmkucXVlcnkpb3B0cy5xdWVyeT11cmkucXVlcnl9dGhpcy5zZWN1cmU9bnVsbCE9b3B0cy5zZWN1cmU/b3B0cy5zZWN1cmU6Z2xvYmFsLmxvY2F0aW9uJiZcImh0dHBzOlwiPT1sb2NhdGlvbi5wcm90b2NvbDtpZihvcHRzLmhvc3Qpe3ZhciBwaWVjZXM9b3B0cy5ob3N0LnNwbGl0KFwiOlwiKTtvcHRzLmhvc3RuYW1lPXBpZWNlcy5zaGlmdCgpO2lmKHBpZWNlcy5sZW5ndGgpe29wdHMucG9ydD1waWVjZXMucG9wKCl9ZWxzZSBpZighb3B0cy5wb3J0KXtvcHRzLnBvcnQ9dGhpcy5zZWN1cmU/XCI0NDNcIjpcIjgwXCJ9fXRoaXMuYWdlbnQ9b3B0cy5hZ2VudHx8ZmFsc2U7dGhpcy5ob3N0bmFtZT1vcHRzLmhvc3RuYW1lfHwoZ2xvYmFsLmxvY2F0aW9uP2xvY2F0aW9uLmhvc3RuYW1lOlwibG9jYWxob3N0XCIpO3RoaXMucG9ydD1vcHRzLnBvcnR8fChnbG9iYWwubG9jYXRpb24mJmxvY2F0aW9uLnBvcnQ/bG9jYXRpb24ucG9ydDp0aGlzLnNlY3VyZT80NDM6ODApO3RoaXMucXVlcnk9b3B0cy5xdWVyeXx8e307aWYoXCJzdHJpbmdcIj09dHlwZW9mIHRoaXMucXVlcnkpdGhpcy5xdWVyeT1wYXJzZXFzLmRlY29kZSh0aGlzLnF1ZXJ5KTt0aGlzLnVwZ3JhZGU9ZmFsc2UhPT1vcHRzLnVwZ3JhZGU7dGhpcy5wYXRoPShvcHRzLnBhdGh8fFwiL2VuZ2luZS5pb1wiKS5yZXBsYWNlKC9cXC8kLyxcIlwiKStcIi9cIjt0aGlzLmZvcmNlSlNPTlA9ISFvcHRzLmZvcmNlSlNPTlA7dGhpcy5qc29ucD1mYWxzZSE9PW9wdHMuanNvbnA7dGhpcy5mb3JjZUJhc2U2ND0hIW9wdHMuZm9yY2VCYXNlNjQ7dGhpcy5lbmFibGVzWERSPSEhb3B0cy5lbmFibGVzWERSO3RoaXMudGltZXN0YW1wUGFyYW09b3B0cy50aW1lc3RhbXBQYXJhbXx8XCJ0XCI7dGhpcy50aW1lc3RhbXBSZXF1ZXN0cz1vcHRzLnRpbWVzdGFtcFJlcXVlc3RzO3RoaXMudHJhbnNwb3J0cz1vcHRzLnRyYW5zcG9ydHN8fFtcInBvbGxpbmdcIixcIndlYnNvY2tldFwiXTt0aGlzLnJlYWR5U3RhdGU9XCJcIjt0aGlzLndyaXRlQnVmZmVyPVtdO3RoaXMuY2FsbGJhY2tCdWZmZXI9W107dGhpcy5wb2xpY3lQb3J0PW9wdHMucG9saWN5UG9ydHx8ODQzO3RoaXMucmVtZW1iZXJVcGdyYWRlPW9wdHMucmVtZW1iZXJVcGdyYWRlfHxmYWxzZTt0aGlzLmJpbmFyeVR5cGU9bnVsbDt0aGlzLm9ubHlCaW5hcnlVcGdyYWRlcz1vcHRzLm9ubHlCaW5hcnlVcGdyYWRlczt0aGlzLnBmeD1vcHRzLnBmeHx8bnVsbDt0aGlzLmtleT1vcHRzLmtleXx8bnVsbDt0aGlzLnBhc3NwaHJhc2U9b3B0cy5wYXNzcGhyYXNlfHxudWxsO3RoaXMuY2VydD1vcHRzLmNlcnR8fG51bGw7dGhpcy5jYT1vcHRzLmNhfHxudWxsO3RoaXMuY2lwaGVycz1vcHRzLmNpcGhlcnN8fG51bGw7dGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ9b3B0cy5yZWplY3RVbmF1dGhvcml6ZWR8fG51bGw7dGhpcy5vcGVuKCl9U29ja2V0LnByaW9yV2Vic29ja2V0U3VjY2Vzcz1mYWxzZTtFbWl0dGVyKFNvY2tldC5wcm90b3R5cGUpO1NvY2tldC5wcm90b2NvbD1wYXJzZXIucHJvdG9jb2w7U29ja2V0LlNvY2tldD1Tb2NrZXQ7U29ja2V0LlRyYW5zcG9ydD1fZGVyZXFfKFwiLi90cmFuc3BvcnRcIik7U29ja2V0LnRyYW5zcG9ydHM9X2RlcmVxXyhcIi4vdHJhbnNwb3J0c1wiKTtTb2NrZXQucGFyc2VyPV9kZXJlcV8oXCJlbmdpbmUuaW8tcGFyc2VyXCIpO1NvY2tldC5wcm90b3R5cGUuY3JlYXRlVHJhbnNwb3J0PWZ1bmN0aW9uKG5hbWUpe2RlYnVnKCdjcmVhdGluZyB0cmFuc3BvcnQgXCIlc1wiJyxuYW1lKTt2YXIgcXVlcnk9Y2xvbmUodGhpcy5xdWVyeSk7cXVlcnkuRUlPPXBhcnNlci5wcm90b2NvbDtxdWVyeS50cmFuc3BvcnQ9bmFtZTtpZih0aGlzLmlkKXF1ZXJ5LnNpZD10aGlzLmlkO3ZhciB0cmFuc3BvcnQ9bmV3IHRyYW5zcG9ydHNbbmFtZV0oe2FnZW50OnRoaXMuYWdlbnQsaG9zdG5hbWU6dGhpcy5ob3N0bmFtZSxwb3J0OnRoaXMucG9ydCxzZWN1cmU6dGhpcy5zZWN1cmUscGF0aDp0aGlzLnBhdGgscXVlcnk6cXVlcnksZm9yY2VKU09OUDp0aGlzLmZvcmNlSlNPTlAsanNvbnA6dGhpcy5qc29ucCxmb3JjZUJhc2U2NDp0aGlzLmZvcmNlQmFzZTY0LGVuYWJsZXNYRFI6dGhpcy5lbmFibGVzWERSLHRpbWVzdGFtcFJlcXVlc3RzOnRoaXMudGltZXN0YW1wUmVxdWVzdHMsdGltZXN0YW1wUGFyYW06dGhpcy50aW1lc3RhbXBQYXJhbSxwb2xpY3lQb3J0OnRoaXMucG9saWN5UG9ydCxzb2NrZXQ6dGhpcyxwZng6dGhpcy5wZngsa2V5OnRoaXMua2V5LHBhc3NwaHJhc2U6dGhpcy5wYXNzcGhyYXNlLGNlcnQ6dGhpcy5jZXJ0LGNhOnRoaXMuY2EsY2lwaGVyczp0aGlzLmNpcGhlcnMscmVqZWN0VW5hdXRob3JpemVkOnRoaXMucmVqZWN0VW5hdXRob3JpemVkfSk7cmV0dXJuIHRyYW5zcG9ydH07ZnVuY3Rpb24gY2xvbmUob2JqKXt2YXIgbz17fTtmb3IodmFyIGkgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe29baV09b2JqW2ldfX1yZXR1cm4gb31Tb2NrZXQucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oKXt2YXIgdHJhbnNwb3J0O2lmKHRoaXMucmVtZW1iZXJVcGdyYWRlJiZTb2NrZXQucHJpb3JXZWJzb2NrZXRTdWNjZXNzJiZ0aGlzLnRyYW5zcG9ydHMuaW5kZXhPZihcIndlYnNvY2tldFwiKSE9LTEpe3RyYW5zcG9ydD1cIndlYnNvY2tldFwifWVsc2UgaWYoMD09dGhpcy50cmFuc3BvcnRzLmxlbmd0aCl7dmFyIHNlbGY9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2VsZi5lbWl0KFwiZXJyb3JcIixcIk5vIHRyYW5zcG9ydHMgYXZhaWxhYmxlXCIpfSwwKTtyZXR1cm59ZWxzZXt0cmFuc3BvcnQ9dGhpcy50cmFuc3BvcnRzWzBdfXRoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIjt2YXIgdHJhbnNwb3J0O3RyeXt0cmFuc3BvcnQ9dGhpcy5jcmVhdGVUcmFuc3BvcnQodHJhbnNwb3J0KX1jYXRjaChlKXt0aGlzLnRyYW5zcG9ydHMuc2hpZnQoKTt0aGlzLm9wZW4oKTtyZXR1cm59dHJhbnNwb3J0Lm9wZW4oKTt0aGlzLnNldFRyYW5zcG9ydCh0cmFuc3BvcnQpfTtTb2NrZXQucHJvdG90eXBlLnNldFRyYW5zcG9ydD1mdW5jdGlvbih0cmFuc3BvcnQpe2RlYnVnKFwic2V0dGluZyB0cmFuc3BvcnQgJXNcIix0cmFuc3BvcnQubmFtZSk7dmFyIHNlbGY9dGhpcztpZih0aGlzLnRyYW5zcG9ydCl7ZGVidWcoXCJjbGVhcmluZyBleGlzdGluZyB0cmFuc3BvcnQgJXNcIix0aGlzLnRyYW5zcG9ydC5uYW1lKTt0aGlzLnRyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoKX10aGlzLnRyYW5zcG9ydD10cmFuc3BvcnQ7dHJhbnNwb3J0Lm9uKFwiZHJhaW5cIixmdW5jdGlvbigpe3NlbGYub25EcmFpbigpfSkub24oXCJwYWNrZXRcIixmdW5jdGlvbihwYWNrZXQpe3NlbGYub25QYWNrZXQocGFja2V0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXtzZWxmLm9uRXJyb3IoZSl9KS5vbihcImNsb3NlXCIsZnVuY3Rpb24oKXtzZWxmLm9uQ2xvc2UoXCJ0cmFuc3BvcnQgY2xvc2VcIil9KX07U29ja2V0LnByb3RvdHlwZS5wcm9iZT1mdW5jdGlvbihuYW1lKXtkZWJ1ZygncHJvYmluZyB0cmFuc3BvcnQgXCIlc1wiJyxuYW1lKTt2YXIgdHJhbnNwb3J0PXRoaXMuY3JlYXRlVHJhbnNwb3J0KG5hbWUse3Byb2JlOjF9KSxmYWlsZWQ9ZmFsc2Usc2VsZj10aGlzO1NvY2tldC5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9ZmFsc2U7ZnVuY3Rpb24gb25UcmFuc3BvcnRPcGVuKCl7aWYoc2VsZi5vbmx5QmluYXJ5VXBncmFkZXMpe3ZhciB1cGdyYWRlTG9zZXNCaW5hcnk9IXRoaXMuc3VwcG9ydHNCaW5hcnkmJnNlbGYudHJhbnNwb3J0LnN1cHBvcnRzQmluYXJ5O2ZhaWxlZD1mYWlsZWR8fHVwZ3JhZGVMb3Nlc0JpbmFyeX1pZihmYWlsZWQpcmV0dXJuO2RlYnVnKCdwcm9iZSB0cmFuc3BvcnQgXCIlc1wiIG9wZW5lZCcsbmFtZSk7dHJhbnNwb3J0LnNlbmQoW3t0eXBlOlwicGluZ1wiLGRhdGE6XCJwcm9iZVwifV0pO3RyYW5zcG9ydC5vbmNlKFwicGFja2V0XCIsZnVuY3Rpb24obXNnKXtpZihmYWlsZWQpcmV0dXJuO2lmKFwicG9uZ1wiPT1tc2cudHlwZSYmXCJwcm9iZVwiPT1tc2cuZGF0YSl7ZGVidWcoJ3Byb2JlIHRyYW5zcG9ydCBcIiVzXCIgcG9uZycsbmFtZSk7c2VsZi51cGdyYWRpbmc9dHJ1ZTtzZWxmLmVtaXQoXCJ1cGdyYWRpbmdcIix0cmFuc3BvcnQpO2lmKCF0cmFuc3BvcnQpcmV0dXJuO1NvY2tldC5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9XCJ3ZWJzb2NrZXRcIj09dHJhbnNwb3J0Lm5hbWU7ZGVidWcoJ3BhdXNpbmcgY3VycmVudCB0cmFuc3BvcnQgXCIlc1wiJyxzZWxmLnRyYW5zcG9ydC5uYW1lKTtzZWxmLnRyYW5zcG9ydC5wYXVzZShmdW5jdGlvbigpe2lmKGZhaWxlZClyZXR1cm47aWYoXCJjbG9zZWRcIj09c2VsZi5yZWFkeVN0YXRlKXJldHVybjtkZWJ1ZyhcImNoYW5naW5nIHRyYW5zcG9ydCBhbmQgc2VuZGluZyB1cGdyYWRlIHBhY2tldFwiKTtjbGVhbnVwKCk7c2VsZi5zZXRUcmFuc3BvcnQodHJhbnNwb3J0KTt0cmFuc3BvcnQuc2VuZChbe3R5cGU6XCJ1cGdyYWRlXCJ9XSk7c2VsZi5lbWl0KFwidXBncmFkZVwiLHRyYW5zcG9ydCk7dHJhbnNwb3J0PW51bGw7c2VsZi51cGdyYWRpbmc9ZmFsc2U7c2VsZi5mbHVzaCgpfSl9ZWxzZXtkZWJ1ZygncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBmYWlsZWQnLG5hbWUpO3ZhciBlcnI9bmV3IEVycm9yKFwicHJvYmUgZXJyb3JcIik7ZXJyLnRyYW5zcG9ydD10cmFuc3BvcnQubmFtZTtzZWxmLmVtaXQoXCJ1cGdyYWRlRXJyb3JcIixlcnIpfX0pfWZ1bmN0aW9uIGZyZWV6ZVRyYW5zcG9ydCgpe2lmKGZhaWxlZClyZXR1cm47ZmFpbGVkPXRydWU7Y2xlYW51cCgpO3RyYW5zcG9ydC5jbG9zZSgpO3RyYW5zcG9ydD1udWxsfWZ1bmN0aW9uIG9uZXJyb3IoZXJyKXt2YXIgZXJyb3I9bmV3IEVycm9yKFwicHJvYmUgZXJyb3I6IFwiK2Vycik7ZXJyb3IudHJhbnNwb3J0PXRyYW5zcG9ydC5uYW1lO2ZyZWV6ZVRyYW5zcG9ydCgpO2RlYnVnKCdwcm9iZSB0cmFuc3BvcnQgXCIlc1wiIGZhaWxlZCBiZWNhdXNlIG9mIGVycm9yOiAlcycsbmFtZSxlcnIpO3NlbGYuZW1pdChcInVwZ3JhZGVFcnJvclwiLGVycm9yKX1mdW5jdGlvbiBvblRyYW5zcG9ydENsb3NlKCl7b25lcnJvcihcInRyYW5zcG9ydCBjbG9zZWRcIil9ZnVuY3Rpb24gb25jbG9zZSgpe29uZXJyb3IoXCJzb2NrZXQgY2xvc2VkXCIpfWZ1bmN0aW9uIG9udXBncmFkZSh0byl7aWYodHJhbnNwb3J0JiZ0by5uYW1lIT10cmFuc3BvcnQubmFtZSl7ZGVidWcoJ1wiJXNcIiB3b3JrcyAtIGFib3J0aW5nIFwiJXNcIicsdG8ubmFtZSx0cmFuc3BvcnQubmFtZSk7ZnJlZXplVHJhbnNwb3J0KCl9fWZ1bmN0aW9uIGNsZWFudXAoKXt0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJvcGVuXCIsb25UcmFuc3BvcnRPcGVuKTt0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLG9uZXJyb3IpO3RyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsb25UcmFuc3BvcnRDbG9zZSk7c2VsZi5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsb25jbG9zZSk7c2VsZi5yZW1vdmVMaXN0ZW5lcihcInVwZ3JhZGluZ1wiLG9udXBncmFkZSl9dHJhbnNwb3J0Lm9uY2UoXCJvcGVuXCIsb25UcmFuc3BvcnRPcGVuKTt0cmFuc3BvcnQub25jZShcImVycm9yXCIsb25lcnJvcik7dHJhbnNwb3J0Lm9uY2UoXCJjbG9zZVwiLG9uVHJhbnNwb3J0Q2xvc2UpO3RoaXMub25jZShcImNsb3NlXCIsb25jbG9zZSk7dGhpcy5vbmNlKFwidXBncmFkaW5nXCIsb251cGdyYWRlKTt0cmFuc3BvcnQub3BlbigpfTtTb2NrZXQucHJvdG90eXBlLm9uT3Blbj1mdW5jdGlvbigpe2RlYnVnKFwic29ja2V0IG9wZW5cIik7dGhpcy5yZWFkeVN0YXRlPVwib3BlblwiO1NvY2tldC5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9XCJ3ZWJzb2NrZXRcIj09dGhpcy50cmFuc3BvcnQubmFtZTt0aGlzLmVtaXQoXCJvcGVuXCIpO3RoaXMuZmx1c2goKTtpZihcIm9wZW5cIj09dGhpcy5yZWFkeVN0YXRlJiZ0aGlzLnVwZ3JhZGUmJnRoaXMudHJhbnNwb3J0LnBhdXNlKXtkZWJ1ZyhcInN0YXJ0aW5nIHVwZ3JhZGUgcHJvYmVzXCIpO2Zvcih2YXIgaT0wLGw9dGhpcy51cGdyYWRlcy5sZW5ndGg7aTxsO2krKyl7dGhpcy5wcm9iZSh0aGlzLnVwZ3JhZGVzW2ldKX19fTtTb2NrZXQucHJvdG90eXBlLm9uUGFja2V0PWZ1bmN0aW9uKHBhY2tldCl7aWYoXCJvcGVuaW5nXCI9PXRoaXMucmVhZHlTdGF0ZXx8XCJvcGVuXCI9PXRoaXMucmVhZHlTdGF0ZSl7ZGVidWcoJ3NvY2tldCByZWNlaXZlOiB0eXBlIFwiJXNcIiwgZGF0YSBcIiVzXCInLHBhY2tldC50eXBlLHBhY2tldC5kYXRhKTt0aGlzLmVtaXQoXCJwYWNrZXRcIixwYWNrZXQpO3RoaXMuZW1pdChcImhlYXJ0YmVhdFwiKTtzd2l0Y2gocGFja2V0LnR5cGUpe2Nhc2VcIm9wZW5cIjp0aGlzLm9uSGFuZHNoYWtlKHBhcnNlanNvbihwYWNrZXQuZGF0YSkpO2JyZWFrO2Nhc2VcInBvbmdcIjp0aGlzLnNldFBpbmcoKTticmVhaztjYXNlXCJlcnJvclwiOnZhciBlcnI9bmV3IEVycm9yKFwic2VydmVyIGVycm9yXCIpO2Vyci5jb2RlPXBhY2tldC5kYXRhO3RoaXMuZW1pdChcImVycm9yXCIsZXJyKTticmVhaztjYXNlXCJtZXNzYWdlXCI6dGhpcy5lbWl0KFwiZGF0YVwiLHBhY2tldC5kYXRhKTt0aGlzLmVtaXQoXCJtZXNzYWdlXCIscGFja2V0LmRhdGEpO2JyZWFrfX1lbHNle2RlYnVnKCdwYWNrZXQgcmVjZWl2ZWQgd2l0aCBzb2NrZXQgcmVhZHlTdGF0ZSBcIiVzXCInLHRoaXMucmVhZHlTdGF0ZSl9fTtTb2NrZXQucHJvdG90eXBlLm9uSGFuZHNoYWtlPWZ1bmN0aW9uKGRhdGEpe3RoaXMuZW1pdChcImhhbmRzaGFrZVwiLGRhdGEpO3RoaXMuaWQ9ZGF0YS5zaWQ7dGhpcy50cmFuc3BvcnQucXVlcnkuc2lkPWRhdGEuc2lkO3RoaXMudXBncmFkZXM9dGhpcy5maWx0ZXJVcGdyYWRlcyhkYXRhLnVwZ3JhZGVzKTt0aGlzLnBpbmdJbnRlcnZhbD1kYXRhLnBpbmdJbnRlcnZhbDt0aGlzLnBpbmdUaW1lb3V0PWRhdGEucGluZ1RpbWVvdXQ7dGhpcy5vbk9wZW4oKTtpZihcImNsb3NlZFwiPT10aGlzLnJlYWR5U3RhdGUpcmV0dXJuO3RoaXMuc2V0UGluZygpO3RoaXMucmVtb3ZlTGlzdGVuZXIoXCJoZWFydGJlYXRcIix0aGlzLm9uSGVhcnRiZWF0KTt0aGlzLm9uKFwiaGVhcnRiZWF0XCIsdGhpcy5vbkhlYXJ0YmVhdCl9O1NvY2tldC5wcm90b3R5cGUub25IZWFydGJlYXQ9ZnVuY3Rpb24odGltZW91dCl7Y2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7dmFyIHNlbGY9dGhpcztzZWxmLnBpbmdUaW1lb3V0VGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe2lmKFwiY2xvc2VkXCI9PXNlbGYucmVhZHlTdGF0ZSlyZXR1cm47c2VsZi5vbkNsb3NlKFwicGluZyB0aW1lb3V0XCIpfSx0aW1lb3V0fHxzZWxmLnBpbmdJbnRlcnZhbCtzZWxmLnBpbmdUaW1lb3V0KX07U29ja2V0LnByb3RvdHlwZS5zZXRQaW5nPWZ1bmN0aW9uKCl7dmFyIHNlbGY9dGhpcztjbGVhclRpbWVvdXQoc2VsZi5waW5nSW50ZXJ2YWxUaW1lcik7c2VsZi5waW5nSW50ZXJ2YWxUaW1lcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZGVidWcoXCJ3cml0aW5nIHBpbmcgcGFja2V0IC0gZXhwZWN0aW5nIHBvbmcgd2l0aGluICVzbXNcIixzZWxmLnBpbmdUaW1lb3V0KTtzZWxmLnBpbmcoKTtzZWxmLm9uSGVhcnRiZWF0KHNlbGYucGluZ1RpbWVvdXQpfSxzZWxmLnBpbmdJbnRlcnZhbCl9O1NvY2tldC5wcm90b3R5cGUucGluZz1mdW5jdGlvbigpe3RoaXMuc2VuZFBhY2tldChcInBpbmdcIil9O1NvY2tldC5wcm90b3R5cGUub25EcmFpbj1mdW5jdGlvbigpe2Zvcih2YXIgaT0wO2k8dGhpcy5wcmV2QnVmZmVyTGVuO2krKyl7aWYodGhpcy5jYWxsYmFja0J1ZmZlcltpXSl7dGhpcy5jYWxsYmFja0J1ZmZlcltpXSgpfX10aGlzLndyaXRlQnVmZmVyLnNwbGljZSgwLHRoaXMucHJldkJ1ZmZlckxlbik7dGhpcy5jYWxsYmFja0J1ZmZlci5zcGxpY2UoMCx0aGlzLnByZXZCdWZmZXJMZW4pO3RoaXMucHJldkJ1ZmZlckxlbj0wO2lmKHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoPT0wKXt0aGlzLmVtaXQoXCJkcmFpblwiKX1lbHNle3RoaXMuZmx1c2goKX19O1NvY2tldC5wcm90b3R5cGUuZmx1c2g9ZnVuY3Rpb24oKXtpZihcImNsb3NlZFwiIT10aGlzLnJlYWR5U3RhdGUmJnRoaXMudHJhbnNwb3J0LndyaXRhYmxlJiYhdGhpcy51cGdyYWRpbmcmJnRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKXtkZWJ1ZyhcImZsdXNoaW5nICVkIHBhY2tldHMgaW4gc29ja2V0XCIsdGhpcy53cml0ZUJ1ZmZlci5sZW5ndGgpO3RoaXMudHJhbnNwb3J0LnNlbmQodGhpcy53cml0ZUJ1ZmZlcik7dGhpcy5wcmV2QnVmZmVyTGVuPXRoaXMud3JpdGVCdWZmZXIubGVuZ3RoO3RoaXMuZW1pdChcImZsdXNoXCIpfX07U29ja2V0LnByb3RvdHlwZS53cml0ZT1Tb2NrZXQucHJvdG90eXBlLnNlbmQ9ZnVuY3Rpb24obXNnLGZuKXt0aGlzLnNlbmRQYWNrZXQoXCJtZXNzYWdlXCIsbXNnLGZuKTtyZXR1cm4gdGhpc307U29ja2V0LnByb3RvdHlwZS5zZW5kUGFja2V0PWZ1bmN0aW9uKHR5cGUsZGF0YSxmbil7aWYoXCJjbG9zaW5nXCI9PXRoaXMucmVhZHlTdGF0ZXx8XCJjbG9zZWRcIj09dGhpcy5yZWFkeVN0YXRlKXtyZXR1cm59dmFyIHBhY2tldD17dHlwZTp0eXBlLGRhdGE6ZGF0YX07dGhpcy5lbWl0KFwicGFja2V0Q3JlYXRlXCIscGFja2V0KTt0aGlzLndyaXRlQnVmZmVyLnB1c2gocGFja2V0KTt0aGlzLmNhbGxiYWNrQnVmZmVyLnB1c2goZm4pO3RoaXMuZmx1c2goKX07U29ja2V0LnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe2lmKFwib3BlbmluZ1wiPT10aGlzLnJlYWR5U3RhdGV8fFwib3BlblwiPT10aGlzLnJlYWR5U3RhdGUpe3RoaXMucmVhZHlTdGF0ZT1cImNsb3NpbmdcIjt2YXIgc2VsZj10aGlzO2Z1bmN0aW9uIGNsb3NlKCl7c2VsZi5vbkNsb3NlKFwiZm9yY2VkIGNsb3NlXCIpO2RlYnVnKFwic29ja2V0IGNsb3NpbmcgLSB0ZWxsaW5nIHRyYW5zcG9ydCB0byBjbG9zZVwiKTtzZWxmLnRyYW5zcG9ydC5jbG9zZSgpfWZ1bmN0aW9uIGNsZWFudXBBbmRDbG9zZSgpe3NlbGYucmVtb3ZlTGlzdGVuZXIoXCJ1cGdyYWRlXCIsY2xlYW51cEFuZENsb3NlKTtzZWxmLnJlbW92ZUxpc3RlbmVyKFwidXBncmFkZUVycm9yXCIsY2xlYW51cEFuZENsb3NlKTtjbG9zZSgpfWZ1bmN0aW9uIHdhaXRGb3JVcGdyYWRlKCl7c2VsZi5vbmNlKFwidXBncmFkZVwiLGNsZWFudXBBbmRDbG9zZSk7c2VsZi5vbmNlKFwidXBncmFkZUVycm9yXCIsY2xlYW51cEFuZENsb3NlKX1pZih0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCl7dGhpcy5vbmNlKFwiZHJhaW5cIixmdW5jdGlvbigpe2lmKHRoaXMudXBncmFkaW5nKXt3YWl0Rm9yVXBncmFkZSgpfWVsc2V7Y2xvc2UoKX19KX1lbHNlIGlmKHRoaXMudXBncmFkaW5nKXt3YWl0Rm9yVXBncmFkZSgpfWVsc2V7Y2xvc2UoKX19cmV0dXJuIHRoaXN9O1NvY2tldC5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbihlcnIpe2RlYnVnKFwic29ja2V0IGVycm9yICVqXCIsZXJyKTtTb2NrZXQucHJpb3JXZWJzb2NrZXRTdWNjZXNzPWZhbHNlO3RoaXMuZW1pdChcImVycm9yXCIsZXJyKTt0aGlzLm9uQ2xvc2UoXCJ0cmFuc3BvcnQgZXJyb3JcIixlcnIpfTtTb2NrZXQucHJvdG90eXBlLm9uQ2xvc2U9ZnVuY3Rpb24ocmVhc29uLGRlc2Mpe2lmKFwib3BlbmluZ1wiPT10aGlzLnJlYWR5U3RhdGV8fFwib3BlblwiPT10aGlzLnJlYWR5U3RhdGV8fFwiY2xvc2luZ1wiPT10aGlzLnJlYWR5U3RhdGUpe2RlYnVnKCdzb2NrZXQgY2xvc2Ugd2l0aCByZWFzb246IFwiJXNcIicscmVhc29uKTt2YXIgc2VsZj10aGlzO2NsZWFyVGltZW91dCh0aGlzLnBpbmdJbnRlcnZhbFRpbWVyKTtjbGVhclRpbWVvdXQodGhpcy5waW5nVGltZW91dFRpbWVyKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2VsZi53cml0ZUJ1ZmZlcj1bXTtzZWxmLmNhbGxiYWNrQnVmZmVyPVtdO3NlbGYucHJldkJ1ZmZlckxlbj0wfSwwKTt0aGlzLnRyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJjbG9zZVwiKTt0aGlzLnRyYW5zcG9ydC5jbG9zZSgpO3RoaXMudHJhbnNwb3J0LnJlbW92ZUFsbExpc3RlbmVycygpO3RoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiO3RoaXMuaWQ9bnVsbDt0aGlzLmVtaXQoXCJjbG9zZVwiLHJlYXNvbixkZXNjKX19O1NvY2tldC5wcm90b3R5cGUuZmlsdGVyVXBncmFkZXM9ZnVuY3Rpb24odXBncmFkZXMpe3ZhciBmaWx0ZXJlZFVwZ3JhZGVzPVtdO2Zvcih2YXIgaT0wLGo9dXBncmFkZXMubGVuZ3RoO2k8ajtpKyspe2lmKH5pbmRleCh0aGlzLnRyYW5zcG9ydHMsdXBncmFkZXNbaV0pKWZpbHRlcmVkVXBncmFkZXMucHVzaCh1cGdyYWRlc1tpXSl9cmV0dXJuIGZpbHRlcmVkVXBncmFkZXN9fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiP3dpbmRvdzp7fSl9LHtcIi4vdHJhbnNwb3J0XCI6MTQsXCIuL3RyYW5zcG9ydHNcIjoxNSxcImNvbXBvbmVudC1lbWl0dGVyXCI6OSxkZWJ1ZzoyMixcImVuZ2luZS5pby1wYXJzZXJcIjoyNSxpbmRleG9mOjQyLHBhcnNlanNvbjozNCxwYXJzZXFzOjM1LHBhcnNldXJpOjM2fV0sMTQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBwYXJzZXI9X2RlcmVxXyhcImVuZ2luZS5pby1wYXJzZXJcIik7dmFyIEVtaXR0ZXI9X2RlcmVxXyhcImNvbXBvbmVudC1lbWl0dGVyXCIpO21vZHVsZS5leHBvcnRzPVRyYW5zcG9ydDtmdW5jdGlvbiBUcmFuc3BvcnQob3B0cyl7dGhpcy5wYXRoPW9wdHMucGF0aDt0aGlzLmhvc3RuYW1lPW9wdHMuaG9zdG5hbWU7dGhpcy5wb3J0PW9wdHMucG9ydDt0aGlzLnNlY3VyZT1vcHRzLnNlY3VyZTt0aGlzLnF1ZXJ5PW9wdHMucXVlcnk7dGhpcy50aW1lc3RhbXBQYXJhbT1vcHRzLnRpbWVzdGFtcFBhcmFtO3RoaXMudGltZXN0YW1wUmVxdWVzdHM9b3B0cy50aW1lc3RhbXBSZXF1ZXN0czt0aGlzLnJlYWR5U3RhdGU9XCJcIjt0aGlzLmFnZW50PW9wdHMuYWdlbnR8fGZhbHNlO3RoaXMuc29ja2V0PW9wdHMuc29ja2V0O3RoaXMuZW5hYmxlc1hEUj1vcHRzLmVuYWJsZXNYRFI7dGhpcy5wZng9b3B0cy5wZng7dGhpcy5rZXk9b3B0cy5rZXk7dGhpcy5wYXNzcGhyYXNlPW9wdHMucGFzc3BocmFzZTt0aGlzLmNlcnQ9b3B0cy5jZXJ0O3RoaXMuY2E9b3B0cy5jYTt0aGlzLmNpcGhlcnM9b3B0cy5jaXBoZXJzO3RoaXMucmVqZWN0VW5hdXRob3JpemVkPW9wdHMucmVqZWN0VW5hdXRob3JpemVkfUVtaXR0ZXIoVHJhbnNwb3J0LnByb3RvdHlwZSk7VHJhbnNwb3J0LnRpbWVzdGFtcHM9MDtUcmFuc3BvcnQucHJvdG90eXBlLm9uRXJyb3I9ZnVuY3Rpb24obXNnLGRlc2Mpe3ZhciBlcnI9bmV3IEVycm9yKG1zZyk7ZXJyLnR5cGU9XCJUcmFuc3BvcnRFcnJvclwiO2Vyci5kZXNjcmlwdGlvbj1kZXNjO3RoaXMuZW1pdChcImVycm9yXCIsZXJyKTtyZXR1cm4gdGhpc307VHJhbnNwb3J0LnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKCl7aWYoXCJjbG9zZWRcIj09dGhpcy5yZWFkeVN0YXRlfHxcIlwiPT10aGlzLnJlYWR5U3RhdGUpe3RoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIjt0aGlzLmRvT3BlbigpfXJldHVybiB0aGlzfTtUcmFuc3BvcnQucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7aWYoXCJvcGVuaW5nXCI9PXRoaXMucmVhZHlTdGF0ZXx8XCJvcGVuXCI9PXRoaXMucmVhZHlTdGF0ZSl7dGhpcy5kb0Nsb3NlKCk7dGhpcy5vbkNsb3NlKCl9cmV0dXJuIHRoaXN9O1RyYW5zcG9ydC5wcm90b3R5cGUuc2VuZD1mdW5jdGlvbihwYWNrZXRzKXtpZihcIm9wZW5cIj09dGhpcy5yZWFkeVN0YXRlKXt0aGlzLndyaXRlKHBhY2tldHMpfWVsc2V7dGhyb3cgbmV3IEVycm9yKFwiVHJhbnNwb3J0IG5vdCBvcGVuXCIpfX07VHJhbnNwb3J0LnByb3RvdHlwZS5vbk9wZW49ZnVuY3Rpb24oKXt0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCI7dGhpcy53cml0YWJsZT10cnVlO3RoaXMuZW1pdChcIm9wZW5cIil9O1RyYW5zcG9ydC5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKGRhdGEpe3ZhciBwYWNrZXQ9cGFyc2VyLmRlY29kZVBhY2tldChkYXRhLHRoaXMuc29ja2V0LmJpbmFyeVR5cGUpO3RoaXMub25QYWNrZXQocGFja2V0KX07VHJhbnNwb3J0LnByb3RvdHlwZS5vblBhY2tldD1mdW5jdGlvbihwYWNrZXQpe3RoaXMuZW1pdChcInBhY2tldFwiLHBhY2tldCl9O1RyYW5zcG9ydC5wcm90b3R5cGUub25DbG9zZT1mdW5jdGlvbigpe3RoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiO3RoaXMuZW1pdChcImNsb3NlXCIpfX0se1wiY29tcG9uZW50LWVtaXR0ZXJcIjo5LFwiZW5naW5lLmlvLXBhcnNlclwiOjI1fV0sMTU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpe3ZhciBYTUxIdHRwUmVxdWVzdD1fZGVyZXFfKFwieG1saHR0cHJlcXVlc3RcIik7dmFyIFhIUj1fZGVyZXFfKFwiLi9wb2xsaW5nLXhoclwiKTt2YXIgSlNPTlA9X2RlcmVxXyhcIi4vcG9sbGluZy1qc29ucFwiKTt2YXIgd2Vic29ja2V0PV9kZXJlcV8oXCIuL3dlYnNvY2tldFwiKTtleHBvcnRzLnBvbGxpbmc9cG9sbGluZztleHBvcnRzLndlYnNvY2tldD13ZWJzb2NrZXQ7ZnVuY3Rpb24gcG9sbGluZyhvcHRzKXt2YXIgeGhyO3ZhciB4ZD1mYWxzZTt2YXIgeHM9ZmFsc2U7dmFyIGpzb25wPWZhbHNlIT09b3B0cy5qc29ucDtpZihnbG9iYWwubG9jYXRpb24pe3ZhciBpc1NTTD1cImh0dHBzOlwiPT1sb2NhdGlvbi5wcm90b2NvbDt2YXIgcG9ydD1sb2NhdGlvbi5wb3J0O2lmKCFwb3J0KXtwb3J0PWlzU1NMPzQ0Mzo4MH14ZD1vcHRzLmhvc3RuYW1lIT1sb2NhdGlvbi5ob3N0bmFtZXx8cG9ydCE9b3B0cy5wb3J0O3hzPW9wdHMuc2VjdXJlIT1pc1NTTH1vcHRzLnhkb21haW49eGQ7b3B0cy54c2NoZW1lPXhzO3hocj1uZXcgWE1MSHR0cFJlcXVlc3Qob3B0cyk7aWYoXCJvcGVuXCJpbiB4aHImJiFvcHRzLmZvcmNlSlNPTlApe3JldHVybiBuZXcgWEhSKG9wdHMpfWVsc2V7aWYoIWpzb25wKXRocm93IG5ldyBFcnJvcihcIkpTT05QIGRpc2FibGVkXCIpO3JldHVybiBuZXcgSlNPTlAob3B0cyl9fX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIj93aW5kb3c6e30pfSx7XCIuL3BvbGxpbmctanNvbnBcIjoxNixcIi4vcG9sbGluZy14aHJcIjoxNyxcIi4vd2Vic29ja2V0XCI6MTkseG1saHR0cHJlcXVlc3Q6MjB9XSwxNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7dmFyIFBvbGxpbmc9X2RlcmVxXyhcIi4vcG9sbGluZ1wiKTt2YXIgaW5oZXJpdD1fZGVyZXFfKFwiY29tcG9uZW50LWluaGVyaXRcIik7bW9kdWxlLmV4cG9ydHM9SlNPTlBQb2xsaW5nO3ZhciByTmV3bGluZT0vXFxuL2c7dmFyIHJFc2NhcGVkTmV3bGluZT0vXFxcXG4vZzt2YXIgY2FsbGJhY2tzO3ZhciBpbmRleD0wO2Z1bmN0aW9uIGVtcHR5KCl7fWZ1bmN0aW9uIEpTT05QUG9sbGluZyhvcHRzKXtQb2xsaW5nLmNhbGwodGhpcyxvcHRzKTtcbnRoaXMucXVlcnk9dGhpcy5xdWVyeXx8e307aWYoIWNhbGxiYWNrcyl7aWYoIWdsb2JhbC5fX19laW8pZ2xvYmFsLl9fX2Vpbz1bXTtjYWxsYmFja3M9Z2xvYmFsLl9fX2Vpb310aGlzLmluZGV4PWNhbGxiYWNrcy5sZW5ndGg7dmFyIHNlbGY9dGhpcztjYWxsYmFja3MucHVzaChmdW5jdGlvbihtc2cpe3NlbGYub25EYXRhKG1zZyl9KTt0aGlzLnF1ZXJ5Lmo9dGhpcy5pbmRleDtpZihnbG9iYWwuZG9jdW1lbnQmJmdsb2JhbC5hZGRFdmVudExpc3RlbmVyKXtnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLGZ1bmN0aW9uKCl7aWYoc2VsZi5zY3JpcHQpc2VsZi5zY3JpcHQub25lcnJvcj1lbXB0eX0sZmFsc2UpfX1pbmhlcml0KEpTT05QUG9sbGluZyxQb2xsaW5nKTtKU09OUFBvbGxpbmcucHJvdG90eXBlLnN1cHBvcnRzQmluYXJ5PWZhbHNlO0pTT05QUG9sbGluZy5wcm90b3R5cGUuZG9DbG9zZT1mdW5jdGlvbigpe2lmKHRoaXMuc2NyaXB0KXt0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KTt0aGlzLnNjcmlwdD1udWxsfWlmKHRoaXMuZm9ybSl7dGhpcy5mb3JtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5mb3JtKTt0aGlzLmZvcm09bnVsbDt0aGlzLmlmcmFtZT1udWxsfVBvbGxpbmcucHJvdG90eXBlLmRvQ2xvc2UuY2FsbCh0aGlzKX07SlNPTlBQb2xsaW5nLnByb3RvdHlwZS5kb1BvbGw9ZnVuY3Rpb24oKXt2YXIgc2VsZj10aGlzO3ZhciBzY3JpcHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtpZih0aGlzLnNjcmlwdCl7dGhpcy5zY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNjcmlwdCk7dGhpcy5zY3JpcHQ9bnVsbH1zY3JpcHQuYXN5bmM9dHJ1ZTtzY3JpcHQuc3JjPXRoaXMudXJpKCk7c2NyaXB0Lm9uZXJyb3I9ZnVuY3Rpb24oZSl7c2VsZi5vbkVycm9yKFwianNvbnAgcG9sbCBlcnJvclwiLGUpfTt2YXIgaW5zZXJ0QXQ9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIilbMF07aW5zZXJ0QXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LGluc2VydEF0KTt0aGlzLnNjcmlwdD1zY3JpcHQ7dmFyIGlzVUFnZWNrbz1cInVuZGVmaW5lZFwiIT10eXBlb2YgbmF2aWdhdG9yJiYvZ2Vja28vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2lmKGlzVUFnZWNrbyl7c2V0VGltZW91dChmdW5jdGlvbigpe3ZhciBpZnJhbWU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpZnJhbWUpfSwxMDApfX07SlNPTlBQb2xsaW5nLnByb3RvdHlwZS5kb1dyaXRlPWZ1bmN0aW9uKGRhdGEsZm4pe3ZhciBzZWxmPXRoaXM7aWYoIXRoaXMuZm9ybSl7dmFyIGZvcm09ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7dmFyIGFyZWE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO3ZhciBpZD10aGlzLmlmcmFtZUlkPVwiZWlvX2lmcmFtZV9cIit0aGlzLmluZGV4O3ZhciBpZnJhbWU7Zm9ybS5jbGFzc05hbWU9XCJzb2NrZXRpb1wiO2Zvcm0uc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiO2Zvcm0uc3R5bGUudG9wPVwiLTEwMDBweFwiO2Zvcm0uc3R5bGUubGVmdD1cIi0xMDAwcHhcIjtmb3JtLnRhcmdldD1pZDtmb3JtLm1ldGhvZD1cIlBPU1RcIjtmb3JtLnNldEF0dHJpYnV0ZShcImFjY2VwdC1jaGFyc2V0XCIsXCJ1dGYtOFwiKTthcmVhLm5hbWU9XCJkXCI7Zm9ybS5hcHBlbmRDaGlsZChhcmVhKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO3RoaXMuZm9ybT1mb3JtO3RoaXMuYXJlYT1hcmVhfXRoaXMuZm9ybS5hY3Rpb249dGhpcy51cmkoKTtmdW5jdGlvbiBjb21wbGV0ZSgpe2luaXRJZnJhbWUoKTtmbigpfWZ1bmN0aW9uIGluaXRJZnJhbWUoKXtpZihzZWxmLmlmcmFtZSl7dHJ5e3NlbGYuZm9ybS5yZW1vdmVDaGlsZChzZWxmLmlmcmFtZSl9Y2F0Y2goZSl7c2VsZi5vbkVycm9yKFwianNvbnAgcG9sbGluZyBpZnJhbWUgcmVtb3ZhbCBlcnJvclwiLGUpfX10cnl7dmFyIGh0bWw9JzxpZnJhbWUgc3JjPVwiamF2YXNjcmlwdDowXCIgbmFtZT1cIicrc2VsZi5pZnJhbWVJZCsnXCI+JztpZnJhbWU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChodG1sKX1jYXRjaChlKXtpZnJhbWU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtpZnJhbWUubmFtZT1zZWxmLmlmcmFtZUlkO2lmcmFtZS5zcmM9XCJqYXZhc2NyaXB0OjBcIn1pZnJhbWUuaWQ9c2VsZi5pZnJhbWVJZDtzZWxmLmZvcm0uYXBwZW5kQ2hpbGQoaWZyYW1lKTtzZWxmLmlmcmFtZT1pZnJhbWV9aW5pdElmcmFtZSgpO2RhdGE9ZGF0YS5yZXBsYWNlKHJFc2NhcGVkTmV3bGluZSxcIlxcXFxcXG5cIik7dGhpcy5hcmVhLnZhbHVlPWRhdGEucmVwbGFjZShyTmV3bGluZSxcIlxcXFxuXCIpO3RyeXt0aGlzLmZvcm0uc3VibWl0KCl9Y2F0Y2goZSl7fWlmKHRoaXMuaWZyYW1lLmF0dGFjaEV2ZW50KXt0aGlzLmlmcmFtZS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihzZWxmLmlmcmFtZS5yZWFkeVN0YXRlPT1cImNvbXBsZXRlXCIpe2NvbXBsZXRlKCl9fX1lbHNle3RoaXMuaWZyYW1lLm9ubG9hZD1jb21wbGV0ZX19fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiP3dpbmRvdzp7fSl9LHtcIi4vcG9sbGluZ1wiOjE4LFwiY29tcG9uZW50LWluaGVyaXRcIjoyMX1dLDE3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXt2YXIgWE1MSHR0cFJlcXVlc3Q9X2RlcmVxXyhcInhtbGh0dHByZXF1ZXN0XCIpO3ZhciBQb2xsaW5nPV9kZXJlcV8oXCIuL3BvbGxpbmdcIik7dmFyIEVtaXR0ZXI9X2RlcmVxXyhcImNvbXBvbmVudC1lbWl0dGVyXCIpO3ZhciBpbmhlcml0PV9kZXJlcV8oXCJjb21wb25lbnQtaW5oZXJpdFwiKTt2YXIgZGVidWc9X2RlcmVxXyhcImRlYnVnXCIpKFwiZW5naW5lLmlvLWNsaWVudDpwb2xsaW5nLXhoclwiKTttb2R1bGUuZXhwb3J0cz1YSFI7bW9kdWxlLmV4cG9ydHMuUmVxdWVzdD1SZXF1ZXN0O2Z1bmN0aW9uIGVtcHR5KCl7fWZ1bmN0aW9uIFhIUihvcHRzKXtQb2xsaW5nLmNhbGwodGhpcyxvcHRzKTtpZihnbG9iYWwubG9jYXRpb24pe3ZhciBpc1NTTD1cImh0dHBzOlwiPT1sb2NhdGlvbi5wcm90b2NvbDt2YXIgcG9ydD1sb2NhdGlvbi5wb3J0O2lmKCFwb3J0KXtwb3J0PWlzU1NMPzQ0Mzo4MH10aGlzLnhkPW9wdHMuaG9zdG5hbWUhPWdsb2JhbC5sb2NhdGlvbi5ob3N0bmFtZXx8cG9ydCE9b3B0cy5wb3J0O3RoaXMueHM9b3B0cy5zZWN1cmUhPWlzU1NMfX1pbmhlcml0KFhIUixQb2xsaW5nKTtYSFIucHJvdG90eXBlLnN1cHBvcnRzQmluYXJ5PXRydWU7WEhSLnByb3RvdHlwZS5yZXF1ZXN0PWZ1bmN0aW9uKG9wdHMpe29wdHM9b3B0c3x8e307b3B0cy51cmk9dGhpcy51cmkoKTtvcHRzLnhkPXRoaXMueGQ7b3B0cy54cz10aGlzLnhzO29wdHMuYWdlbnQ9dGhpcy5hZ2VudHx8ZmFsc2U7b3B0cy5zdXBwb3J0c0JpbmFyeT10aGlzLnN1cHBvcnRzQmluYXJ5O29wdHMuZW5hYmxlc1hEUj10aGlzLmVuYWJsZXNYRFI7b3B0cy5wZng9dGhpcy5wZng7b3B0cy5rZXk9dGhpcy5rZXk7b3B0cy5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZTtvcHRzLmNlcnQ9dGhpcy5jZXJ0O29wdHMuY2E9dGhpcy5jYTtvcHRzLmNpcGhlcnM9dGhpcy5jaXBoZXJzO29wdHMucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkO3JldHVybiBuZXcgUmVxdWVzdChvcHRzKX07WEhSLnByb3RvdHlwZS5kb1dyaXRlPWZ1bmN0aW9uKGRhdGEsZm4pe3ZhciBpc0JpbmFyeT10eXBlb2YgZGF0YSE9PVwic3RyaW5nXCImJmRhdGEhPT11bmRlZmluZWQ7dmFyIHJlcT10aGlzLnJlcXVlc3Qoe21ldGhvZDpcIlBPU1RcIixkYXRhOmRhdGEsaXNCaW5hcnk6aXNCaW5hcnl9KTt2YXIgc2VsZj10aGlzO3JlcS5vbihcInN1Y2Nlc3NcIixmbik7cmVxLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlcnIpe3NlbGYub25FcnJvcihcInhociBwb3N0IGVycm9yXCIsZXJyKX0pO3RoaXMuc2VuZFhocj1yZXF9O1hIUi5wcm90b3R5cGUuZG9Qb2xsPWZ1bmN0aW9uKCl7ZGVidWcoXCJ4aHIgcG9sbFwiKTt2YXIgcmVxPXRoaXMucmVxdWVzdCgpO3ZhciBzZWxmPXRoaXM7cmVxLm9uKFwiZGF0YVwiLGZ1bmN0aW9uKGRhdGEpe3NlbGYub25EYXRhKGRhdGEpfSk7cmVxLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlcnIpe3NlbGYub25FcnJvcihcInhociBwb2xsIGVycm9yXCIsZXJyKX0pO3RoaXMucG9sbFhocj1yZXF9O2Z1bmN0aW9uIFJlcXVlc3Qob3B0cyl7dGhpcy5tZXRob2Q9b3B0cy5tZXRob2R8fFwiR0VUXCI7dGhpcy51cmk9b3B0cy51cmk7dGhpcy54ZD0hIW9wdHMueGQ7dGhpcy54cz0hIW9wdHMueHM7dGhpcy5hc3luYz1mYWxzZSE9PW9wdHMuYXN5bmM7dGhpcy5kYXRhPXVuZGVmaW5lZCE9b3B0cy5kYXRhP29wdHMuZGF0YTpudWxsO3RoaXMuYWdlbnQ9b3B0cy5hZ2VudDt0aGlzLmlzQmluYXJ5PW9wdHMuaXNCaW5hcnk7dGhpcy5zdXBwb3J0c0JpbmFyeT1vcHRzLnN1cHBvcnRzQmluYXJ5O3RoaXMuZW5hYmxlc1hEUj1vcHRzLmVuYWJsZXNYRFI7dGhpcy5wZng9b3B0cy5wZng7dGhpcy5rZXk9b3B0cy5rZXk7dGhpcy5wYXNzcGhyYXNlPW9wdHMucGFzc3BocmFzZTt0aGlzLmNlcnQ9b3B0cy5jZXJ0O3RoaXMuY2E9b3B0cy5jYTt0aGlzLmNpcGhlcnM9b3B0cy5jaXBoZXJzO3RoaXMucmVqZWN0VW5hdXRob3JpemVkPW9wdHMucmVqZWN0VW5hdXRob3JpemVkO3RoaXMuY3JlYXRlKCl9RW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7UmVxdWVzdC5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIG9wdHM9e2FnZW50OnRoaXMuYWdlbnQseGRvbWFpbjp0aGlzLnhkLHhzY2hlbWU6dGhpcy54cyxlbmFibGVzWERSOnRoaXMuZW5hYmxlc1hEUn07b3B0cy5wZng9dGhpcy5wZng7b3B0cy5rZXk9dGhpcy5rZXk7b3B0cy5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZTtvcHRzLmNlcnQ9dGhpcy5jZXJ0O29wdHMuY2E9dGhpcy5jYTtvcHRzLmNpcGhlcnM9dGhpcy5jaXBoZXJzO29wdHMucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkO3ZhciB4aHI9dGhpcy54aHI9bmV3IFhNTEh0dHBSZXF1ZXN0KG9wdHMpO3ZhciBzZWxmPXRoaXM7dHJ5e2RlYnVnKFwieGhyIG9wZW4gJXM6ICVzXCIsdGhpcy5tZXRob2QsdGhpcy51cmkpO3hoci5vcGVuKHRoaXMubWV0aG9kLHRoaXMudXJpLHRoaXMuYXN5bmMpO2lmKHRoaXMuc3VwcG9ydHNCaW5hcnkpe3hoci5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwifWlmKFwiUE9TVFwiPT10aGlzLm1ldGhvZCl7dHJ5e2lmKHRoaXMuaXNCaW5hcnkpe3hoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIil9ZWxzZXt4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCIpfX1jYXRjaChlKXt9fWlmKFwid2l0aENyZWRlbnRpYWxzXCJpbiB4aHIpe3hoci53aXRoQ3JlZGVudGlhbHM9dHJ1ZX1pZih0aGlzLmhhc1hEUigpKXt4aHIub25sb2FkPWZ1bmN0aW9uKCl7c2VsZi5vbkxvYWQoKX07eGhyLm9uZXJyb3I9ZnVuY3Rpb24oKXtzZWxmLm9uRXJyb3IoeGhyLnJlc3BvbnNlVGV4dCl9fWVsc2V7eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKDQhPXhoci5yZWFkeVN0YXRlKXJldHVybjtpZigyMDA9PXhoci5zdGF0dXN8fDEyMjM9PXhoci5zdGF0dXMpe3NlbGYub25Mb2FkKCl9ZWxzZXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2VsZi5vbkVycm9yKHhoci5zdGF0dXMpfSwwKX19fWRlYnVnKFwieGhyIGRhdGEgJXNcIix0aGlzLmRhdGEpO3hoci5zZW5kKHRoaXMuZGF0YSl9Y2F0Y2goZSl7c2V0VGltZW91dChmdW5jdGlvbigpe3NlbGYub25FcnJvcihlKX0sMCk7cmV0dXJufWlmKGdsb2JhbC5kb2N1bWVudCl7dGhpcy5pbmRleD1SZXF1ZXN0LnJlcXVlc3RzQ291bnQrKztSZXF1ZXN0LnJlcXVlc3RzW3RoaXMuaW5kZXhdPXRoaXN9fTtSZXF1ZXN0LnByb3RvdHlwZS5vblN1Y2Nlc3M9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJzdWNjZXNzXCIpO3RoaXMuY2xlYW51cCgpfTtSZXF1ZXN0LnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24oZGF0YSl7dGhpcy5lbWl0KFwiZGF0YVwiLGRhdGEpO3RoaXMub25TdWNjZXNzKCl9O1JlcXVlc3QucHJvdG90eXBlLm9uRXJyb3I9ZnVuY3Rpb24oZXJyKXt0aGlzLmVtaXQoXCJlcnJvclwiLGVycik7dGhpcy5jbGVhbnVwKHRydWUpfTtSZXF1ZXN0LnByb3RvdHlwZS5jbGVhbnVwPWZ1bmN0aW9uKGZyb21FcnJvcil7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHRoaXMueGhyfHxudWxsPT09dGhpcy54aHIpe3JldHVybn1pZih0aGlzLmhhc1hEUigpKXt0aGlzLnhoci5vbmxvYWQ9dGhpcy54aHIub25lcnJvcj1lbXB0eX1lbHNle3RoaXMueGhyLm9ucmVhZHlzdGF0ZWNoYW5nZT1lbXB0eX1pZihmcm9tRXJyb3Ipe3RyeXt0aGlzLnhoci5hYm9ydCgpfWNhdGNoKGUpe319aWYoZ2xvYmFsLmRvY3VtZW50KXtkZWxldGUgUmVxdWVzdC5yZXF1ZXN0c1t0aGlzLmluZGV4XX10aGlzLnhocj1udWxsfTtSZXF1ZXN0LnByb3RvdHlwZS5vbkxvYWQ9ZnVuY3Rpb24oKXt2YXIgZGF0YTt0cnl7dmFyIGNvbnRlbnRUeXBlO3RyeXtjb250ZW50VHlwZT10aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKS5zcGxpdChcIjtcIilbMF19Y2F0Y2goZSl7fWlmKGNvbnRlbnRUeXBlPT09XCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIil7ZGF0YT10aGlzLnhoci5yZXNwb25zZX1lbHNle2lmKCF0aGlzLnN1cHBvcnRzQmluYXJ5KXtkYXRhPXRoaXMueGhyLnJlc3BvbnNlVGV4dH1lbHNle2RhdGE9XCJva1wifX19Y2F0Y2goZSl7dGhpcy5vbkVycm9yKGUpfWlmKG51bGwhPWRhdGEpe3RoaXMub25EYXRhKGRhdGEpfX07UmVxdWVzdC5wcm90b3R5cGUuaGFzWERSPWZ1bmN0aW9uKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWwuWERvbWFpblJlcXVlc3QmJiF0aGlzLnhzJiZ0aGlzLmVuYWJsZXNYRFJ9O1JlcXVlc3QucHJvdG90eXBlLmFib3J0PWZ1bmN0aW9uKCl7dGhpcy5jbGVhbnVwKCl9O2lmKGdsb2JhbC5kb2N1bWVudCl7UmVxdWVzdC5yZXF1ZXN0c0NvdW50PTA7UmVxdWVzdC5yZXF1ZXN0cz17fTtpZihnbG9iYWwuYXR0YWNoRXZlbnQpe2dsb2JhbC5hdHRhY2hFdmVudChcIm9udW5sb2FkXCIsdW5sb2FkSGFuZGxlcil9ZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcil7Z2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIix1bmxvYWRIYW5kbGVyLGZhbHNlKX19ZnVuY3Rpb24gdW5sb2FkSGFuZGxlcigpe2Zvcih2YXIgaSBpbiBSZXF1ZXN0LnJlcXVlc3RzKXtpZihSZXF1ZXN0LnJlcXVlc3RzLmhhc093blByb3BlcnR5KGkpKXtSZXF1ZXN0LnJlcXVlc3RzW2ldLmFib3J0KCl9fX19KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCI/d2luZG93Ont9KX0se1wiLi9wb2xsaW5nXCI6MTgsXCJjb21wb25lbnQtZW1pdHRlclwiOjksXCJjb21wb25lbnQtaW5oZXJpdFwiOjIxLGRlYnVnOjIyLHhtbGh0dHByZXF1ZXN0OjIwfV0sMTg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBUcmFuc3BvcnQ9X2RlcmVxXyhcIi4uL3RyYW5zcG9ydFwiKTt2YXIgcGFyc2Vxcz1fZGVyZXFfKFwicGFyc2Vxc1wiKTt2YXIgcGFyc2VyPV9kZXJlcV8oXCJlbmdpbmUuaW8tcGFyc2VyXCIpO3ZhciBpbmhlcml0PV9kZXJlcV8oXCJjb21wb25lbnQtaW5oZXJpdFwiKTt2YXIgZGVidWc9X2RlcmVxXyhcImRlYnVnXCIpKFwiZW5naW5lLmlvLWNsaWVudDpwb2xsaW5nXCIpO21vZHVsZS5leHBvcnRzPVBvbGxpbmc7dmFyIGhhc1hIUjI9ZnVuY3Rpb24oKXt2YXIgWE1MSHR0cFJlcXVlc3Q9X2RlcmVxXyhcInhtbGh0dHByZXF1ZXN0XCIpO3ZhciB4aHI9bmV3IFhNTEh0dHBSZXF1ZXN0KHt4ZG9tYWluOmZhbHNlfSk7cmV0dXJuIG51bGwhPXhoci5yZXNwb25zZVR5cGV9KCk7ZnVuY3Rpb24gUG9sbGluZyhvcHRzKXt2YXIgZm9yY2VCYXNlNjQ9b3B0cyYmb3B0cy5mb3JjZUJhc2U2NDtpZighaGFzWEhSMnx8Zm9yY2VCYXNlNjQpe3RoaXMuc3VwcG9ydHNCaW5hcnk9ZmFsc2V9VHJhbnNwb3J0LmNhbGwodGhpcyxvcHRzKX1pbmhlcml0KFBvbGxpbmcsVHJhbnNwb3J0KTtQb2xsaW5nLnByb3RvdHlwZS5uYW1lPVwicG9sbGluZ1wiO1BvbGxpbmcucHJvdG90eXBlLmRvT3Blbj1mdW5jdGlvbigpe3RoaXMucG9sbCgpfTtQb2xsaW5nLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihvblBhdXNlKXt2YXIgcGVuZGluZz0wO3ZhciBzZWxmPXRoaXM7dGhpcy5yZWFkeVN0YXRlPVwicGF1c2luZ1wiO2Z1bmN0aW9uIHBhdXNlKCl7ZGVidWcoXCJwYXVzZWRcIik7c2VsZi5yZWFkeVN0YXRlPVwicGF1c2VkXCI7b25QYXVzZSgpfWlmKHRoaXMucG9sbGluZ3x8IXRoaXMud3JpdGFibGUpe3ZhciB0b3RhbD0wO2lmKHRoaXMucG9sbGluZyl7ZGVidWcoXCJ3ZSBhcmUgY3VycmVudGx5IHBvbGxpbmcgLSB3YWl0aW5nIHRvIHBhdXNlXCIpO3RvdGFsKys7dGhpcy5vbmNlKFwicG9sbENvbXBsZXRlXCIsZnVuY3Rpb24oKXtkZWJ1ZyhcInByZS1wYXVzZSBwb2xsaW5nIGNvbXBsZXRlXCIpOy0tdG90YWx8fHBhdXNlKCl9KX1pZighdGhpcy53cml0YWJsZSl7ZGVidWcoXCJ3ZSBhcmUgY3VycmVudGx5IHdyaXRpbmcgLSB3YWl0aW5nIHRvIHBhdXNlXCIpO3RvdGFsKys7dGhpcy5vbmNlKFwiZHJhaW5cIixmdW5jdGlvbigpe2RlYnVnKFwicHJlLXBhdXNlIHdyaXRpbmcgY29tcGxldGVcIik7LS10b3RhbHx8cGF1c2UoKX0pfX1lbHNle3BhdXNlKCl9fTtQb2xsaW5nLnByb3RvdHlwZS5wb2xsPWZ1bmN0aW9uKCl7ZGVidWcoXCJwb2xsaW5nXCIpO3RoaXMucG9sbGluZz10cnVlO3RoaXMuZG9Qb2xsKCk7dGhpcy5lbWl0KFwicG9sbFwiKX07UG9sbGluZy5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKGRhdGEpe3ZhciBzZWxmPXRoaXM7ZGVidWcoXCJwb2xsaW5nIGdvdCBkYXRhICVzXCIsZGF0YSk7dmFyIGNhbGxiYWNrPWZ1bmN0aW9uKHBhY2tldCxpbmRleCx0b3RhbCl7aWYoXCJvcGVuaW5nXCI9PXNlbGYucmVhZHlTdGF0ZSl7c2VsZi5vbk9wZW4oKX1pZihcImNsb3NlXCI9PXBhY2tldC50eXBlKXtzZWxmLm9uQ2xvc2UoKTtyZXR1cm4gZmFsc2V9c2VsZi5vblBhY2tldChwYWNrZXQpfTtwYXJzZXIuZGVjb2RlUGF5bG9hZChkYXRhLHRoaXMuc29ja2V0LmJpbmFyeVR5cGUsY2FsbGJhY2spO2lmKFwiY2xvc2VkXCIhPXRoaXMucmVhZHlTdGF0ZSl7dGhpcy5wb2xsaW5nPWZhbHNlO3RoaXMuZW1pdChcInBvbGxDb21wbGV0ZVwiKTtpZihcIm9wZW5cIj09dGhpcy5yZWFkeVN0YXRlKXt0aGlzLnBvbGwoKX1lbHNle2RlYnVnKCdpZ25vcmluZyBwb2xsIC0gdHJhbnNwb3J0IHN0YXRlIFwiJXNcIicsdGhpcy5yZWFkeVN0YXRlKX19fTtQb2xsaW5nLnByb3RvdHlwZS5kb0Nsb3NlPWZ1bmN0aW9uKCl7dmFyIHNlbGY9dGhpcztmdW5jdGlvbiBjbG9zZSgpe2RlYnVnKFwid3JpdGluZyBjbG9zZSBwYWNrZXRcIik7c2VsZi53cml0ZShbe3R5cGU6XCJjbG9zZVwifV0pfWlmKFwib3BlblwiPT10aGlzLnJlYWR5U3RhdGUpe2RlYnVnKFwidHJhbnNwb3J0IG9wZW4gLSBjbG9zaW5nXCIpO2Nsb3NlKCl9ZWxzZXtkZWJ1ZyhcInRyYW5zcG9ydCBub3Qgb3BlbiAtIGRlZmVycmluZyBjbG9zZVwiKTt0aGlzLm9uY2UoXCJvcGVuXCIsY2xvc2UpfX07UG9sbGluZy5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24ocGFja2V0cyl7dmFyIHNlbGY9dGhpczt0aGlzLndyaXRhYmxlPWZhbHNlO3ZhciBjYWxsYmFja2ZuPWZ1bmN0aW9uKCl7c2VsZi53cml0YWJsZT10cnVlO3NlbGYuZW1pdChcImRyYWluXCIpfTt2YXIgc2VsZj10aGlzO3BhcnNlci5lbmNvZGVQYXlsb2FkKHBhY2tldHMsdGhpcy5zdXBwb3J0c0JpbmFyeSxmdW5jdGlvbihkYXRhKXtzZWxmLmRvV3JpdGUoZGF0YSxjYWxsYmFja2ZuKX0pfTtQb2xsaW5nLnByb3RvdHlwZS51cmk9ZnVuY3Rpb24oKXt2YXIgcXVlcnk9dGhpcy5xdWVyeXx8e307dmFyIHNjaGVtYT10aGlzLnNlY3VyZT9cImh0dHBzXCI6XCJodHRwXCI7dmFyIHBvcnQ9XCJcIjtpZihmYWxzZSE9PXRoaXMudGltZXN0YW1wUmVxdWVzdHMpe3F1ZXJ5W3RoaXMudGltZXN0YW1wUGFyYW1dPStuZXcgRGF0ZStcIi1cIitUcmFuc3BvcnQudGltZXN0YW1wcysrfWlmKCF0aGlzLnN1cHBvcnRzQmluYXJ5JiYhcXVlcnkuc2lkKXtxdWVyeS5iNjQ9MX1xdWVyeT1wYXJzZXFzLmVuY29kZShxdWVyeSk7aWYodGhpcy5wb3J0JiYoXCJodHRwc1wiPT1zY2hlbWEmJnRoaXMucG9ydCE9NDQzfHxcImh0dHBcIj09c2NoZW1hJiZ0aGlzLnBvcnQhPTgwKSl7cG9ydD1cIjpcIit0aGlzLnBvcnR9aWYocXVlcnkubGVuZ3RoKXtxdWVyeT1cIj9cIitxdWVyeX1yZXR1cm4gc2NoZW1hK1wiOi8vXCIrdGhpcy5ob3N0bmFtZStwb3J0K3RoaXMucGF0aCtxdWVyeX19LHtcIi4uL3RyYW5zcG9ydFwiOjE0LFwiY29tcG9uZW50LWluaGVyaXRcIjoyMSxkZWJ1ZzoyMixcImVuZ2luZS5pby1wYXJzZXJcIjoyNSxwYXJzZXFzOjM1LHhtbGh0dHByZXF1ZXN0OjIwfV0sMTk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBUcmFuc3BvcnQ9X2RlcmVxXyhcIi4uL3RyYW5zcG9ydFwiKTt2YXIgcGFyc2VyPV9kZXJlcV8oXCJlbmdpbmUuaW8tcGFyc2VyXCIpO3ZhciBwYXJzZXFzPV9kZXJlcV8oXCJwYXJzZXFzXCIpO3ZhciBpbmhlcml0PV9kZXJlcV8oXCJjb21wb25lbnQtaW5oZXJpdFwiKTt2YXIgZGVidWc9X2RlcmVxXyhcImRlYnVnXCIpKFwiZW5naW5lLmlvLWNsaWVudDp3ZWJzb2NrZXRcIik7dmFyIFdlYlNvY2tldD1fZGVyZXFfKFwid3NcIik7bW9kdWxlLmV4cG9ydHM9V1M7ZnVuY3Rpb24gV1Mob3B0cyl7dmFyIGZvcmNlQmFzZTY0PW9wdHMmJm9wdHMuZm9yY2VCYXNlNjQ7aWYoZm9yY2VCYXNlNjQpe3RoaXMuc3VwcG9ydHNCaW5hcnk9ZmFsc2V9VHJhbnNwb3J0LmNhbGwodGhpcyxvcHRzKX1pbmhlcml0KFdTLFRyYW5zcG9ydCk7V1MucHJvdG90eXBlLm5hbWU9XCJ3ZWJzb2NrZXRcIjtXUy5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnk9dHJ1ZTtXUy5wcm90b3R5cGUuZG9PcGVuPWZ1bmN0aW9uKCl7aWYoIXRoaXMuY2hlY2soKSl7cmV0dXJufXZhciBzZWxmPXRoaXM7dmFyIHVyaT10aGlzLnVyaSgpO3ZhciBwcm90b2NvbHM9dm9pZCAwO3ZhciBvcHRzPXthZ2VudDp0aGlzLmFnZW50fTtvcHRzLnBmeD10aGlzLnBmeDtvcHRzLmtleT10aGlzLmtleTtvcHRzLnBhc3NwaHJhc2U9dGhpcy5wYXNzcGhyYXNlO29wdHMuY2VydD10aGlzLmNlcnQ7b3B0cy5jYT10aGlzLmNhO29wdHMuY2lwaGVycz10aGlzLmNpcGhlcnM7b3B0cy5yZWplY3RVbmF1dGhvcml6ZWQ9dGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ7dGhpcy53cz1uZXcgV2ViU29ja2V0KHVyaSxwcm90b2NvbHMsb3B0cyk7aWYodGhpcy53cy5iaW5hcnlUeXBlPT09dW5kZWZpbmVkKXt0aGlzLnN1cHBvcnRzQmluYXJ5PWZhbHNlfXRoaXMud3MuYmluYXJ5VHlwZT1cImFycmF5YnVmZmVyXCI7dGhpcy5hZGRFdmVudExpc3RlbmVycygpfTtXUy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgc2VsZj10aGlzO3RoaXMud3Mub25vcGVuPWZ1bmN0aW9uKCl7c2VsZi5vbk9wZW4oKX07dGhpcy53cy5vbmNsb3NlPWZ1bmN0aW9uKCl7c2VsZi5vbkNsb3NlKCl9O3RoaXMud3Mub25tZXNzYWdlPWZ1bmN0aW9uKGV2KXtzZWxmLm9uRGF0YShldi5kYXRhKX07dGhpcy53cy5vbmVycm9yPWZ1bmN0aW9uKGUpe3NlbGYub25FcnJvcihcIndlYnNvY2tldCBlcnJvclwiLGUpfX07aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL2lQYWR8aVBob25lfGlQb2QvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKXtXUy5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKGRhdGEpe3ZhciBzZWxmPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe1RyYW5zcG9ydC5wcm90b3R5cGUub25EYXRhLmNhbGwoc2VsZixkYXRhKX0sMCl9fVdTLnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbihwYWNrZXRzKXt2YXIgc2VsZj10aGlzO3RoaXMud3JpdGFibGU9ZmFsc2U7Zm9yKHZhciBpPTAsbD1wYWNrZXRzLmxlbmd0aDtpPGw7aSsrKXtwYXJzZXIuZW5jb2RlUGFja2V0KHBhY2tldHNbaV0sdGhpcy5zdXBwb3J0c0JpbmFyeSxmdW5jdGlvbihkYXRhKXt0cnl7c2VsZi53cy5zZW5kKGRhdGEpfWNhdGNoKGUpe2RlYnVnKFwid2Vic29ja2V0IGNsb3NlZCBiZWZvcmUgb25jbG9zZSBldmVudFwiKX19KX1mdW5jdGlvbiBvbmRyYWluKCl7c2VsZi53cml0YWJsZT10cnVlO3NlbGYuZW1pdChcImRyYWluXCIpfXNldFRpbWVvdXQob25kcmFpbiwwKX07V1MucHJvdG90eXBlLm9uQ2xvc2U9ZnVuY3Rpb24oKXtUcmFuc3BvcnQucHJvdG90eXBlLm9uQ2xvc2UuY2FsbCh0aGlzKX07V1MucHJvdG90eXBlLmRvQ2xvc2U9ZnVuY3Rpb24oKXtpZih0eXBlb2YgdGhpcy53cyE9PVwidW5kZWZpbmVkXCIpe3RoaXMud3MuY2xvc2UoKX19O1dTLnByb3RvdHlwZS51cmk9ZnVuY3Rpb24oKXt2YXIgcXVlcnk9dGhpcy5xdWVyeXx8e307dmFyIHNjaGVtYT10aGlzLnNlY3VyZT9cIndzc1wiOlwid3NcIjt2YXIgcG9ydD1cIlwiO2lmKHRoaXMucG9ydCYmKFwid3NzXCI9PXNjaGVtYSYmdGhpcy5wb3J0IT00NDN8fFwid3NcIj09c2NoZW1hJiZ0aGlzLnBvcnQhPTgwKSl7cG9ydD1cIjpcIit0aGlzLnBvcnR9aWYodGhpcy50aW1lc3RhbXBSZXF1ZXN0cyl7cXVlcnlbdGhpcy50aW1lc3RhbXBQYXJhbV09K25ldyBEYXRlfWlmKCF0aGlzLnN1cHBvcnRzQmluYXJ5KXtxdWVyeS5iNjQ9MX1xdWVyeT1wYXJzZXFzLmVuY29kZShxdWVyeSk7aWYocXVlcnkubGVuZ3RoKXtxdWVyeT1cIj9cIitxdWVyeX1yZXR1cm4gc2NoZW1hK1wiOi8vXCIrdGhpcy5ob3N0bmFtZStwb3J0K3RoaXMucGF0aCtxdWVyeX07V1MucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7cmV0dXJuISFXZWJTb2NrZXQmJiEoXCJfX2luaXRpYWxpemVcImluIFdlYlNvY2tldCYmdGhpcy5uYW1lPT09V1MucHJvdG90eXBlLm5hbWUpfX0se1wiLi4vdHJhbnNwb3J0XCI6MTQsXCJjb21wb25lbnQtaW5oZXJpdFwiOjIxLGRlYnVnOjIyLFwiZW5naW5lLmlvLXBhcnNlclwiOjI1LHBhcnNlcXM6MzUsd3M6Mzd9XSwyMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIGhhc0NPUlM9X2RlcmVxXyhcImhhcy1jb3JzXCIpO21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKG9wdHMpe3ZhciB4ZG9tYWluPW9wdHMueGRvbWFpbjt2YXIgeHNjaGVtZT1vcHRzLnhzY2hlbWU7dmFyIGVuYWJsZXNYRFI9b3B0cy5lbmFibGVzWERSO3RyeXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgWE1MSHR0cFJlcXVlc3QmJigheGRvbWFpbnx8aGFzQ09SUykpe3JldHVybiBuZXcgWE1MSHR0cFJlcXVlc3R9fWNhdGNoKGUpe310cnl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFhEb21haW5SZXF1ZXN0JiYheHNjaGVtZSYmZW5hYmxlc1hEUil7cmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdH19Y2F0Y2goZSl7fWlmKCF4ZG9tYWluKXt0cnl7cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIil9Y2F0Y2goZSl7fX19fSx7XCJoYXMtY29yc1wiOjQwfV0sMjE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGEsYil7dmFyIGZuPWZ1bmN0aW9uKCl7fTtmbi5wcm90b3R5cGU9Yi5wcm90b3R5cGU7YS5wcm90b3R5cGU9bmV3IGZuO2EucHJvdG90eXBlLmNvbnN0cnVjdG9yPWF9fSx7fV0sMjI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe2V4cG9ydHM9bW9kdWxlLmV4cG9ydHM9X2RlcmVxXyhcIi4vZGVidWdcIik7ZXhwb3J0cy5sb2c9bG9nO2V4cG9ydHMuZm9ybWF0QXJncz1mb3JtYXRBcmdzO2V4cG9ydHMuc2F2ZT1zYXZlO2V4cG9ydHMubG9hZD1sb2FkO2V4cG9ydHMudXNlQ29sb3JzPXVzZUNvbG9ycztleHBvcnRzLmNvbG9ycz1bXCJsaWdodHNlYWdyZWVuXCIsXCJmb3Jlc3RncmVlblwiLFwiZ29sZGVucm9kXCIsXCJkb2RnZXJibHVlXCIsXCJkYXJrb3JjaGlkXCIsXCJjcmltc29uXCJdO2Z1bmN0aW9uIHVzZUNvbG9ycygpe3JldHVyblwiV2Via2l0QXBwZWFyYW5jZVwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlfHx3aW5kb3cuY29uc29sZSYmKGNvbnNvbGUuZmlyZWJ1Z3x8Y29uc29sZS5leGNlcHRpb24mJmNvbnNvbGUudGFibGUpfHxuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSYmcGFyc2VJbnQoUmVnRXhwLiQxLDEwKT49MzF9ZXhwb3J0cy5mb3JtYXR0ZXJzLmo9ZnVuY3Rpb24odil7cmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpfTtmdW5jdGlvbiBmb3JtYXRBcmdzKCl7dmFyIGFyZ3M9YXJndW1lbnRzO3ZhciB1c2VDb2xvcnM9dGhpcy51c2VDb2xvcnM7YXJnc1swXT0odXNlQ29sb3JzP1wiJWNcIjpcIlwiKSt0aGlzLm5hbWVzcGFjZSsodXNlQ29sb3JzP1wiICVjXCI6XCIgXCIpK2FyZ3NbMF0rKHVzZUNvbG9ycz9cIiVjIFwiOlwiIFwiKStcIitcIitleHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZik7aWYoIXVzZUNvbG9ycylyZXR1cm4gYXJnczt2YXIgYz1cImNvbG9yOiBcIit0aGlzLmNvbG9yO2FyZ3M9W2FyZ3NbMF0sYyxcImNvbG9yOiBpbmhlcml0XCJdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLDEpKTt2YXIgaW5kZXg9MDt2YXIgbGFzdEM9MDthcmdzWzBdLnJlcGxhY2UoLyVbYS16JV0vZyxmdW5jdGlvbihtYXRjaCl7aWYoXCIlXCI9PT1tYXRjaClyZXR1cm47aW5kZXgrKztpZihcIiVjXCI9PT1tYXRjaCl7bGFzdEM9aW5kZXh9fSk7YXJncy5zcGxpY2UobGFzdEMsMCxjKTtyZXR1cm4gYXJnc31mdW5jdGlvbiBsb2coKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgY29uc29sZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgY29uc29sZS5sb2cmJkZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLGNvbnNvbGUsYXJndW1lbnRzKX1mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpe3RyeXtpZihudWxsPT1uYW1lc3BhY2VzKXtsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRlYnVnXCIpfWVsc2V7bG9jYWxTdG9yYWdlLmRlYnVnPW5hbWVzcGFjZXN9fWNhdGNoKGUpe319ZnVuY3Rpb24gbG9hZCgpe3ZhciByO3RyeXtyPWxvY2FsU3RvcmFnZS5kZWJ1Z31jYXRjaChlKXt9cmV0dXJuIHJ9ZXhwb3J0cy5lbmFibGUobG9hZCgpKX0se1wiLi9kZWJ1Z1wiOjIzfV0sMjM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe2V4cG9ydHM9bW9kdWxlLmV4cG9ydHM9ZGVidWc7ZXhwb3J0cy5jb2VyY2U9Y29lcmNlO2V4cG9ydHMuZGlzYWJsZT1kaXNhYmxlO2V4cG9ydHMuZW5hYmxlPWVuYWJsZTtleHBvcnRzLmVuYWJsZWQ9ZW5hYmxlZDtleHBvcnRzLmh1bWFuaXplPV9kZXJlcV8oXCJtc1wiKTtleHBvcnRzLm5hbWVzPVtdO2V4cG9ydHMuc2tpcHM9W107ZXhwb3J0cy5mb3JtYXR0ZXJzPXt9O3ZhciBwcmV2Q29sb3I9MDt2YXIgcHJldlRpbWU7ZnVuY3Rpb24gc2VsZWN0Q29sb3IoKXtyZXR1cm4gZXhwb3J0cy5jb2xvcnNbcHJldkNvbG9yKyslZXhwb3J0cy5jb2xvcnMubGVuZ3RoXX1mdW5jdGlvbiBkZWJ1ZyhuYW1lc3BhY2Upe2Z1bmN0aW9uIGRpc2FibGVkKCl7fWRpc2FibGVkLmVuYWJsZWQ9ZmFsc2U7ZnVuY3Rpb24gZW5hYmxlZCgpe3ZhciBzZWxmPWVuYWJsZWQ7dmFyIGN1cnI9K25ldyBEYXRlO3ZhciBtcz1jdXJyLShwcmV2VGltZXx8Y3Vycik7c2VsZi5kaWZmPW1zO3NlbGYucHJldj1wcmV2VGltZTtzZWxmLmN1cnI9Y3VycjtwcmV2VGltZT1jdXJyO2lmKG51bGw9PXNlbGYudXNlQ29sb3JzKXNlbGYudXNlQ29sb3JzPWV4cG9ydHMudXNlQ29sb3JzKCk7aWYobnVsbD09c2VsZi5jb2xvciYmc2VsZi51c2VDb2xvcnMpc2VsZi5jb2xvcj1zZWxlY3RDb2xvcigpO3ZhciBhcmdzPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7YXJnc1swXT1leHBvcnRzLmNvZXJjZShhcmdzWzBdKTtpZihcInN0cmluZ1wiIT09dHlwZW9mIGFyZ3NbMF0pe2FyZ3M9W1wiJW9cIl0uY29uY2F0KGFyZ3MpfXZhciBpbmRleD0wO2FyZ3NbMF09YXJnc1swXS5yZXBsYWNlKC8lKFthLXolXSkvZyxmdW5jdGlvbihtYXRjaCxmb3JtYXQpe2lmKG1hdGNoPT09XCIlXCIpcmV0dXJuIG1hdGNoO2luZGV4Kys7dmFyIGZvcm1hdHRlcj1leHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZm9ybWF0dGVyKXt2YXIgdmFsPWFyZ3NbaW5kZXhdO21hdGNoPWZvcm1hdHRlci5jYWxsKHNlbGYsdmFsKTthcmdzLnNwbGljZShpbmRleCwxKTtpbmRleC0tfXJldHVybiBtYXRjaH0pO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBleHBvcnRzLmZvcm1hdEFyZ3Mpe2FyZ3M9ZXhwb3J0cy5mb3JtYXRBcmdzLmFwcGx5KHNlbGYsYXJncyl9dmFyIGxvZ0ZuPWVuYWJsZWQubG9nfHxleHBvcnRzLmxvZ3x8Y29uc29sZS5sb2cuYmluZChjb25zb2xlKTtsb2dGbi5hcHBseShzZWxmLGFyZ3MpfWVuYWJsZWQuZW5hYmxlZD10cnVlO3ZhciBmbj1leHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKT9lbmFibGVkOmRpc2FibGVkO2ZuLm5hbWVzcGFjZT1uYW1lc3BhY2U7cmV0dXJuIGZufWZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKXtleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7dmFyIHNwbGl0PShuYW1lc3BhY2VzfHxcIlwiKS5zcGxpdCgvW1xccyxdKy8pO3ZhciBsZW49c3BsaXQubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bGVuO2krKyl7aWYoIXNwbGl0W2ldKWNvbnRpbnVlO25hbWVzcGFjZXM9c3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csXCIuKj9cIik7aWYobmFtZXNwYWNlc1swXT09PVwiLVwiKXtleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cChcIl5cIituYW1lc3BhY2VzLnN1YnN0cigxKStcIiRcIikpfWVsc2V7ZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoXCJeXCIrbmFtZXNwYWNlcytcIiRcIikpfX19ZnVuY3Rpb24gZGlzYWJsZSgpe2V4cG9ydHMuZW5hYmxlKFwiXCIpfWZ1bmN0aW9uIGVuYWJsZWQobmFtZSl7dmFyIGksbGVuO2ZvcihpPTAsbGVuPWV4cG9ydHMuc2tpcHMubGVuZ3RoO2k8bGVuO2krKyl7aWYoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKXtyZXR1cm4gZmFsc2V9fWZvcihpPTAsbGVuPWV4cG9ydHMubmFtZXMubGVuZ3RoO2k8bGVuO2krKyl7aWYoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKXtyZXR1cm4gdHJ1ZX19cmV0dXJuIGZhbHNlfWZ1bmN0aW9uIGNvZXJjZSh2YWwpe2lmKHZhbCBpbnN0YW5jZW9mIEVycm9yKXJldHVybiB2YWwuc3RhY2t8fHZhbC5tZXNzYWdlO3JldHVybiB2YWx9fSx7bXM6MjR9XSwyNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIHM9MWUzO3ZhciBtPXMqNjA7dmFyIGg9bSo2MDt2YXIgZD1oKjI0O3ZhciB5PWQqMzY1LjI1O21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKHZhbCxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O2lmKFwic3RyaW5nXCI9PXR5cGVvZiB2YWwpcmV0dXJuIHBhcnNlKHZhbCk7cmV0dXJuIG9wdGlvbnMubG9uZz9sb25nKHZhbCk6c2hvcnQodmFsKX07ZnVuY3Rpb24gcGFyc2Uoc3RyKXt2YXIgbWF0Y2g9L14oKD86XFxkKyk/XFwuP1xcZCspICoobXN8c2Vjb25kcz98c3xtaW51dGVzP3xtfGhvdXJzP3xofGRheXM/fGR8eWVhcnM/fHkpPyQvaS5leGVjKHN0cik7aWYoIW1hdGNoKXJldHVybjt2YXIgbj1wYXJzZUZsb2F0KG1hdGNoWzFdKTt2YXIgdHlwZT0obWF0Y2hbMl18fFwibXNcIikudG9Mb3dlckNhc2UoKTtzd2l0Y2godHlwZSl7Y2FzZVwieWVhcnNcIjpjYXNlXCJ5ZWFyXCI6Y2FzZVwieVwiOnJldHVybiBuKnk7Y2FzZVwiZGF5c1wiOmNhc2VcImRheVwiOmNhc2VcImRcIjpyZXR1cm4gbipkO2Nhc2VcImhvdXJzXCI6Y2FzZVwiaG91clwiOmNhc2VcImhcIjpyZXR1cm4gbipoO2Nhc2VcIm1pbnV0ZXNcIjpjYXNlXCJtaW51dGVcIjpjYXNlXCJtXCI6cmV0dXJuIG4qbTtjYXNlXCJzZWNvbmRzXCI6Y2FzZVwic2Vjb25kXCI6Y2FzZVwic1wiOnJldHVybiBuKnM7Y2FzZVwibXNcIjpyZXR1cm4gbn19ZnVuY3Rpb24gc2hvcnQobXMpe2lmKG1zPj1kKXJldHVybiBNYXRoLnJvdW5kKG1zL2QpK1wiZFwiO2lmKG1zPj1oKXJldHVybiBNYXRoLnJvdW5kKG1zL2gpK1wiaFwiO2lmKG1zPj1tKXJldHVybiBNYXRoLnJvdW5kKG1zL20pK1wibVwiO2lmKG1zPj1zKXJldHVybiBNYXRoLnJvdW5kKG1zL3MpK1wic1wiO3JldHVybiBtcytcIm1zXCJ9ZnVuY3Rpb24gbG9uZyhtcyl7cmV0dXJuIHBsdXJhbChtcyxkLFwiZGF5XCIpfHxwbHVyYWwobXMsaCxcImhvdXJcIil8fHBsdXJhbChtcyxtLFwibWludXRlXCIpfHxwbHVyYWwobXMscyxcInNlY29uZFwiKXx8bXMrXCIgbXNcIn1mdW5jdGlvbiBwbHVyYWwobXMsbixuYW1lKXtpZihtczxuKXJldHVybjtpZihtczxuKjEuNSlyZXR1cm4gTWF0aC5mbG9vcihtcy9uKStcIiBcIituYW1lO3JldHVybiBNYXRoLmNlaWwobXMvbikrXCIgXCIrbmFtZStcInNcIn19LHt9XSwyNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7dmFyIGtleXM9X2RlcmVxXyhcIi4va2V5c1wiKTt2YXIgaGFzQmluYXJ5PV9kZXJlcV8oXCJoYXMtYmluYXJ5XCIpO3ZhciBzbGljZUJ1ZmZlcj1fZGVyZXFfKFwiYXJyYXlidWZmZXIuc2xpY2VcIik7dmFyIGJhc2U2NGVuY29kZXI9X2RlcmVxXyhcImJhc2U2NC1hcnJheWJ1ZmZlclwiKTt2YXIgYWZ0ZXI9X2RlcmVxXyhcImFmdGVyXCIpO3ZhciB1dGY4PV9kZXJlcV8oXCJ1dGY4XCIpO3ZhciBpc0FuZHJvaWQ9bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKTt2YXIgaXNQaGFudG9tSlM9L1BoYW50b21KUy9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7dmFyIGRvbnRTZW5kQmxvYnM9aXNBbmRyb2lkfHxpc1BoYW50b21KUztleHBvcnRzLnByb3RvY29sPTM7dmFyIHBhY2tldHM9ZXhwb3J0cy5wYWNrZXRzPXtvcGVuOjAsY2xvc2U6MSxwaW5nOjIscG9uZzozLG1lc3NhZ2U6NCx1cGdyYWRlOjUsbm9vcDo2fTt2YXIgcGFja2V0c2xpc3Q9a2V5cyhwYWNrZXRzKTt2YXIgZXJyPXt0eXBlOlwiZXJyb3JcIixkYXRhOlwicGFyc2VyIGVycm9yXCJ9O3ZhciBCbG9iPV9kZXJlcV8oXCJibG9iXCIpO2V4cG9ydHMuZW5jb2RlUGFja2V0PWZ1bmN0aW9uKHBhY2tldCxzdXBwb3J0c0JpbmFyeSx1dGY4ZW5jb2RlLGNhbGxiYWNrKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBzdXBwb3J0c0JpbmFyeSl7Y2FsbGJhY2s9c3VwcG9ydHNCaW5hcnk7c3VwcG9ydHNCaW5hcnk9ZmFsc2V9aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdXRmOGVuY29kZSl7Y2FsbGJhY2s9dXRmOGVuY29kZTt1dGY4ZW5jb2RlPW51bGx9dmFyIGRhdGE9cGFja2V0LmRhdGE9PT11bmRlZmluZWQ/dW5kZWZpbmVkOnBhY2tldC5kYXRhLmJ1ZmZlcnx8cGFja2V0LmRhdGE7aWYoZ2xvYmFsLkFycmF5QnVmZmVyJiZkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpe3JldHVybiBlbmNvZGVBcnJheUJ1ZmZlcihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spfWVsc2UgaWYoQmxvYiYmZGF0YSBpbnN0YW5jZW9mIGdsb2JhbC5CbG9iKXtyZXR1cm4gZW5jb2RlQmxvYihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spfWlmKGRhdGEmJmRhdGEuYmFzZTY0KXtyZXR1cm4gZW5jb2RlQmFzZTY0T2JqZWN0KHBhY2tldCxjYWxsYmFjayl9dmFyIGVuY29kZWQ9cGFja2V0c1twYWNrZXQudHlwZV07aWYodW5kZWZpbmVkIT09cGFja2V0LmRhdGEpe2VuY29kZWQrPXV0ZjhlbmNvZGU/dXRmOC5lbmNvZGUoU3RyaW5nKHBhY2tldC5kYXRhKSk6U3RyaW5nKHBhY2tldC5kYXRhKX1yZXR1cm4gY2FsbGJhY2soXCJcIitlbmNvZGVkKX07ZnVuY3Rpb24gZW5jb2RlQmFzZTY0T2JqZWN0KHBhY2tldCxjYWxsYmFjayl7dmFyIG1lc3NhZ2U9XCJiXCIrZXhwb3J0cy5wYWNrZXRzW3BhY2tldC50eXBlXStwYWNrZXQuZGF0YS5kYXRhO3JldHVybiBjYWxsYmFjayhtZXNzYWdlKX1mdW5jdGlvbiBlbmNvZGVBcnJheUJ1ZmZlcihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spe2lmKCFzdXBwb3J0c0JpbmFyeSl7cmV0dXJuIGV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCxjYWxsYmFjayl9dmFyIGRhdGE9cGFja2V0LmRhdGE7dmFyIGNvbnRlbnRBcnJheT1uZXcgVWludDhBcnJheShkYXRhKTt2YXIgcmVzdWx0QnVmZmVyPW5ldyBVaW50OEFycmF5KDErZGF0YS5ieXRlTGVuZ3RoKTtyZXN1bHRCdWZmZXJbMF09cGFja2V0c1twYWNrZXQudHlwZV07Zm9yKHZhciBpPTA7aTxjb250ZW50QXJyYXkubGVuZ3RoO2krKyl7cmVzdWx0QnVmZmVyW2krMV09Y29udGVudEFycmF5W2ldfXJldHVybiBjYWxsYmFjayhyZXN1bHRCdWZmZXIuYnVmZmVyKX1mdW5jdGlvbiBlbmNvZGVCbG9iQXNBcnJheUJ1ZmZlcihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spe2lmKCFzdXBwb3J0c0JpbmFyeSl7cmV0dXJuIGV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCxjYWxsYmFjayl9dmFyIGZyPW5ldyBGaWxlUmVhZGVyO2ZyLm9ubG9hZD1mdW5jdGlvbigpe3BhY2tldC5kYXRhPWZyLnJlc3VsdDtleHBvcnRzLmVuY29kZVBhY2tldChwYWNrZXQsc3VwcG9ydHNCaW5hcnksdHJ1ZSxjYWxsYmFjayl9O3JldHVybiBmci5yZWFkQXNBcnJheUJ1ZmZlcihwYWNrZXQuZGF0YSl9ZnVuY3Rpb24gZW5jb2RlQmxvYihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spe2lmKCFzdXBwb3J0c0JpbmFyeSl7cmV0dXJuIGV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCxjYWxsYmFjayl9aWYoZG9udFNlbmRCbG9icyl7cmV0dXJuIGVuY29kZUJsb2JBc0FycmF5QnVmZmVyKHBhY2tldCxzdXBwb3J0c0JpbmFyeSxjYWxsYmFjayl9dmFyIGxlbmd0aD1uZXcgVWludDhBcnJheSgxKTtsZW5ndGhbMF09cGFja2V0c1twYWNrZXQudHlwZV07dmFyIGJsb2I9bmV3IEJsb2IoW2xlbmd0aC5idWZmZXIscGFja2V0LmRhdGFdKTtyZXR1cm4gY2FsbGJhY2soYmxvYil9ZXhwb3J0cy5lbmNvZGVCYXNlNjRQYWNrZXQ9ZnVuY3Rpb24ocGFja2V0LGNhbGxiYWNrKXt2YXIgbWVzc2FnZT1cImJcIitleHBvcnRzLnBhY2tldHNbcGFja2V0LnR5cGVdO2lmKEJsb2ImJnBhY2tldC5kYXRhIGluc3RhbmNlb2YgQmxvYil7dmFyIGZyPW5ldyBGaWxlUmVhZGVyO2ZyLm9ubG9hZD1mdW5jdGlvbigpe3ZhciBiNjQ9ZnIucmVzdWx0LnNwbGl0KFwiLFwiKVsxXTtjYWxsYmFjayhtZXNzYWdlK2I2NCl9O3JldHVybiBmci5yZWFkQXNEYXRhVVJMKHBhY2tldC5kYXRhKX12YXIgYjY0ZGF0YTt0cnl7YjY0ZGF0YT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkocGFja2V0LmRhdGEpKX1jYXRjaChlKXt2YXIgdHlwZWQ9bmV3IFVpbnQ4QXJyYXkocGFja2V0LmRhdGEpO3ZhciBiYXNpYz1uZXcgQXJyYXkodHlwZWQubGVuZ3RoKTtmb3IodmFyIGk9MDtpPHR5cGVkLmxlbmd0aDtpKyspe2Jhc2ljW2ldPXR5cGVkW2ldfWI2NGRhdGE9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGJhc2ljKX1tZXNzYWdlKz1nbG9iYWwuYnRvYShiNjRkYXRhKTtyZXR1cm4gY2FsbGJhY2sobWVzc2FnZSl9O2V4cG9ydHMuZGVjb2RlUGFja2V0PWZ1bmN0aW9uKGRhdGEsYmluYXJ5VHlwZSx1dGY4ZGVjb2RlKXtpZih0eXBlb2YgZGF0YT09XCJzdHJpbmdcInx8ZGF0YT09PXVuZGVmaW5lZCl7aWYoZGF0YS5jaGFyQXQoMCk9PVwiYlwiKXtyZXR1cm4gZXhwb3J0cy5kZWNvZGVCYXNlNjRQYWNrZXQoZGF0YS5zdWJzdHIoMSksYmluYXJ5VHlwZSl9aWYodXRmOGRlY29kZSl7dHJ5e2RhdGE9dXRmOC5kZWNvZGUoZGF0YSl9Y2F0Y2goZSl7cmV0dXJuIGVycn19dmFyIHR5cGU9ZGF0YS5jaGFyQXQoMCk7aWYoTnVtYmVyKHR5cGUpIT10eXBlfHwhcGFja2V0c2xpc3RbdHlwZV0pe3JldHVybiBlcnJ9aWYoZGF0YS5sZW5ndGg+MSl7cmV0dXJue3R5cGU6cGFja2V0c2xpc3RbdHlwZV0sZGF0YTpkYXRhLnN1YnN0cmluZygxKX19ZWxzZXtyZXR1cm57dHlwZTpwYWNrZXRzbGlzdFt0eXBlXX19fXZhciBhc0FycmF5PW5ldyBVaW50OEFycmF5KGRhdGEpO3ZhciB0eXBlPWFzQXJyYXlbMF07dmFyIHJlc3Q9c2xpY2VCdWZmZXIoZGF0YSwxKTtpZihCbG9iJiZiaW5hcnlUeXBlPT09XCJibG9iXCIpe3Jlc3Q9bmV3IEJsb2IoW3Jlc3RdKX1yZXR1cm57dHlwZTpwYWNrZXRzbGlzdFt0eXBlXSxkYXRhOnJlc3R9fTtleHBvcnRzLmRlY29kZUJhc2U2NFBhY2tldD1mdW5jdGlvbihtc2csYmluYXJ5VHlwZSl7dmFyIHR5cGU9cGFja2V0c2xpc3RbbXNnLmNoYXJBdCgwKV07aWYoIWdsb2JhbC5BcnJheUJ1ZmZlcil7cmV0dXJue3R5cGU6dHlwZSxkYXRhOntiYXNlNjQ6dHJ1ZSxkYXRhOm1zZy5zdWJzdHIoMSl9fX12YXIgZGF0YT1iYXNlNjRlbmNvZGVyLmRlY29kZShtc2cuc3Vic3RyKDEpKTtpZihiaW5hcnlUeXBlPT09XCJibG9iXCImJkJsb2Ipe2RhdGE9bmV3IEJsb2IoW2RhdGFdKX1yZXR1cm57dHlwZTp0eXBlLGRhdGE6ZGF0YX19O2V4cG9ydHMuZW5jb2RlUGF5bG9hZD1mdW5jdGlvbihwYWNrZXRzLHN1cHBvcnRzQmluYXJ5LGNhbGxiYWNrKXtpZih0eXBlb2Ygc3VwcG9ydHNCaW5hcnk9PVwiZnVuY3Rpb25cIil7Y2FsbGJhY2s9c3VwcG9ydHNCaW5hcnk7c3VwcG9ydHNCaW5hcnk9bnVsbH12YXIgaXNCaW5hcnk9aGFzQmluYXJ5KHBhY2tldHMpO2lmKHN1cHBvcnRzQmluYXJ5JiZpc0JpbmFyeSl7aWYoQmxvYiYmIWRvbnRTZW5kQmxvYnMpe3JldHVybiBleHBvcnRzLmVuY29kZVBheWxvYWRBc0Jsb2IocGFja2V0cyxjYWxsYmFjayl9cmV0dXJuIGV4cG9ydHMuZW5jb2RlUGF5bG9hZEFzQXJyYXlCdWZmZXIocGFja2V0cyxjYWxsYmFjayl9aWYoIXBhY2tldHMubGVuZ3RoKXtyZXR1cm4gY2FsbGJhY2soXCIwOlwiKX1mdW5jdGlvbiBzZXRMZW5ndGhIZWFkZXIobWVzc2FnZSl7cmV0dXJuIG1lc3NhZ2UubGVuZ3RoK1wiOlwiK21lc3NhZ2V9ZnVuY3Rpb24gZW5jb2RlT25lKHBhY2tldCxkb25lQ2FsbGJhY2spe2V4cG9ydHMuZW5jb2RlUGFja2V0KHBhY2tldCwhaXNCaW5hcnk/ZmFsc2U6c3VwcG9ydHNCaW5hcnksdHJ1ZSxmdW5jdGlvbihtZXNzYWdlKXtkb25lQ2FsbGJhY2sobnVsbCxzZXRMZW5ndGhIZWFkZXIobWVzc2FnZSkpfSl9bWFwKHBhY2tldHMsZW5jb2RlT25lLGZ1bmN0aW9uKGVycixyZXN1bHRzKXtyZXR1cm4gY2FsbGJhY2socmVzdWx0cy5qb2luKFwiXCIpKX0pfTtmdW5jdGlvbiBtYXAoYXJ5LGVhY2gsZG9uZSl7dmFyIHJlc3VsdD1uZXcgQXJyYXkoYXJ5Lmxlbmd0aCk7dmFyIG5leHQ9YWZ0ZXIoYXJ5Lmxlbmd0aCxkb25lKTt2YXIgZWFjaFdpdGhJbmRleD1mdW5jdGlvbihpLGVsLGNiKXtlYWNoKGVsLGZ1bmN0aW9uKGVycm9yLG1zZyl7cmVzdWx0W2ldPW1zZztjYihlcnJvcixyZXN1bHQpfSl9O2Zvcih2YXIgaT0wO2k8YXJ5Lmxlbmd0aDtpKyspe2VhY2hXaXRoSW5kZXgoaSxhcnlbaV0sbmV4dCl9fWV4cG9ydHMuZGVjb2RlUGF5bG9hZD1mdW5jdGlvbihkYXRhLGJpbmFyeVR5cGUsY2FsbGJhY2spe2lmKHR5cGVvZiBkYXRhIT1cInN0cmluZ1wiKXtyZXR1cm4gZXhwb3J0cy5kZWNvZGVQYXlsb2FkQXNCaW5hcnkoZGF0YSxiaW5hcnlUeXBlLGNhbGxiYWNrKX1pZih0eXBlb2YgYmluYXJ5VHlwZT09PVwiZnVuY3Rpb25cIil7Y2FsbGJhY2s9YmluYXJ5VHlwZTtiaW5hcnlUeXBlPW51bGx9dmFyIHBhY2tldDtpZihkYXRhPT1cIlwiKXtyZXR1cm4gY2FsbGJhY2soZXJyLDAsMSl9dmFyIGxlbmd0aD1cIlwiLG4sbXNnO2Zvcih2YXIgaT0wLGw9ZGF0YS5sZW5ndGg7aTxsO2krKyl7dmFyIGNocj1kYXRhLmNoYXJBdChpKTtpZihcIjpcIiE9Y2hyKXtsZW5ndGgrPWNocn1lbHNle2lmKFwiXCI9PWxlbmd0aHx8bGVuZ3RoIT0obj1OdW1iZXIobGVuZ3RoKSkpe3JldHVybiBjYWxsYmFjayhlcnIsMCwxKX1tc2c9ZGF0YS5zdWJzdHIoaSsxLG4pO2lmKGxlbmd0aCE9bXNnLmxlbmd0aCl7cmV0dXJuIGNhbGxiYWNrKGVyciwwLDEpfWlmKG1zZy5sZW5ndGgpe3BhY2tldD1leHBvcnRzLmRlY29kZVBhY2tldChtc2csYmluYXJ5VHlwZSx0cnVlKTtpZihlcnIudHlwZT09cGFja2V0LnR5cGUmJmVyci5kYXRhPT1wYWNrZXQuZGF0YSl7cmV0dXJuIGNhbGxiYWNrKGVyciwwLDEpfXZhciByZXQ9Y2FsbGJhY2socGFja2V0LGkrbixsKTtpZihmYWxzZT09PXJldClyZXR1cm59aSs9bjtsZW5ndGg9XCJcIn19aWYobGVuZ3RoIT1cIlwiKXtyZXR1cm4gY2FsbGJhY2soZXJyLDAsMSl9fTtleHBvcnRzLmVuY29kZVBheWxvYWRBc0FycmF5QnVmZmVyPWZ1bmN0aW9uKHBhY2tldHMsY2FsbGJhY2spe2lmKCFwYWNrZXRzLmxlbmd0aCl7cmV0dXJuIGNhbGxiYWNrKG5ldyBBcnJheUJ1ZmZlcigwKSl9ZnVuY3Rpb24gZW5jb2RlT25lKHBhY2tldCxkb25lQ2FsbGJhY2spe2V4cG9ydHMuZW5jb2RlUGFja2V0KHBhY2tldCx0cnVlLHRydWUsZnVuY3Rpb24oZGF0YSl7cmV0dXJuIGRvbmVDYWxsYmFjayhudWxsLGRhdGEpfSl9bWFwKHBhY2tldHMsZW5jb2RlT25lLGZ1bmN0aW9uKGVycixlbmNvZGVkUGFja2V0cyl7dmFyIHRvdGFsTGVuZ3RoPWVuY29kZWRQYWNrZXRzLnJlZHVjZShmdW5jdGlvbihhY2MscCl7dmFyIGxlbjtpZih0eXBlb2YgcD09PVwic3RyaW5nXCIpe2xlbj1wLmxlbmd0aH1lbHNle2xlbj1wLmJ5dGVMZW5ndGh9cmV0dXJuIGFjYytsZW4udG9TdHJpbmcoKS5sZW5ndGgrbGVuKzJ9LDApO3ZhciByZXN1bHRBcnJheT1uZXcgVWludDhBcnJheSh0b3RhbExlbmd0aCk7dmFyIGJ1ZmZlckluZGV4PTA7ZW5jb2RlZFBhY2tldHMuZm9yRWFjaChmdW5jdGlvbihwKXt2YXIgaXNTdHJpbmc9dHlwZW9mIHA9PT1cInN0cmluZ1wiO3ZhciBhYj1wO2lmKGlzU3RyaW5nKXt2YXIgdmlldz1uZXcgVWludDhBcnJheShwLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxwLmxlbmd0aDtpKyspe3ZpZXdbaV09cC5jaGFyQ29kZUF0KGkpfWFiPXZpZXcuYnVmZmVyfWlmKGlzU3RyaW5nKXtyZXN1bHRBcnJheVtidWZmZXJJbmRleCsrXT0wfWVsc2V7cmVzdWx0QXJyYXlbYnVmZmVySW5kZXgrK109MX12YXIgbGVuU3RyPWFiLmJ5dGVMZW5ndGgudG9TdHJpbmcoKTtmb3IodmFyIGk9MDtpPGxlblN0ci5sZW5ndGg7aSsrKXtyZXN1bHRBcnJheVtidWZmZXJJbmRleCsrXT1wYXJzZUludChsZW5TdHJbaV0pfXJlc3VsdEFycmF5W2J1ZmZlckluZGV4KytdPTI1NTt2YXIgdmlldz1uZXcgVWludDhBcnJheShhYik7Zm9yKHZhciBpPTA7aTx2aWV3Lmxlbmd0aDtpKyspe3Jlc3VsdEFycmF5W2J1ZmZlckluZGV4KytdPXZpZXdbaV19fSk7cmV0dXJuIGNhbGxiYWNrKHJlc3VsdEFycmF5LmJ1ZmZlcil9KX07ZXhwb3J0cy5lbmNvZGVQYXlsb2FkQXNCbG9iPWZ1bmN0aW9uKHBhY2tldHMsY2FsbGJhY2spe2Z1bmN0aW9uIGVuY29kZU9uZShwYWNrZXQsZG9uZUNhbGxiYWNrKXtleHBvcnRzLmVuY29kZVBhY2tldChwYWNrZXQsdHJ1ZSx0cnVlLGZ1bmN0aW9uKGVuY29kZWQpe3ZhciBiaW5hcnlJZGVudGlmaWVyPW5ldyBVaW50OEFycmF5KDEpO2JpbmFyeUlkZW50aWZpZXJbMF09MTtpZih0eXBlb2YgZW5jb2RlZD09PVwic3RyaW5nXCIpe3ZhciB2aWV3PW5ldyBVaW50OEFycmF5KGVuY29kZWQubGVuZ3RoKTtmb3IodmFyIGk9MDtpPGVuY29kZWQubGVuZ3RoO2krKyl7dmlld1tpXT1lbmNvZGVkLmNoYXJDb2RlQXQoaSl9ZW5jb2RlZD12aWV3LmJ1ZmZlcjtiaW5hcnlJZGVudGlmaWVyWzBdPTB9dmFyIGxlbj1lbmNvZGVkIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI/ZW5jb2RlZC5ieXRlTGVuZ3RoOmVuY29kZWQuc2l6ZTt2YXIgbGVuU3RyPWxlbi50b1N0cmluZygpO3ZhciBsZW5ndGhBcnk9bmV3IFVpbnQ4QXJyYXkobGVuU3RyLmxlbmd0aCsxKTtmb3IodmFyIGk9MDtpPGxlblN0ci5sZW5ndGg7aSsrKXtsZW5ndGhBcnlbaV09cGFyc2VJbnQobGVuU3RyW2ldKX1sZW5ndGhBcnlbbGVuU3RyLmxlbmd0aF09MjU1O2lmKEJsb2Ipe3ZhciBibG9iPW5ldyBCbG9iKFtiaW5hcnlJZGVudGlmaWVyLmJ1ZmZlcixsZW5ndGhBcnkuYnVmZmVyLGVuY29kZWRdKTtkb25lQ2FsbGJhY2sobnVsbCxibG9iKX19KX1tYXAocGFja2V0cyxlbmNvZGVPbmUsZnVuY3Rpb24oZXJyLHJlc3VsdHMpe3JldHVybiBjYWxsYmFjayhuZXcgQmxvYihyZXN1bHRzKSl9KX07ZXhwb3J0cy5kZWNvZGVQYXlsb2FkQXNCaW5hcnk9ZnVuY3Rpb24oZGF0YSxiaW5hcnlUeXBlLGNhbGxiYWNrKXtpZih0eXBlb2YgYmluYXJ5VHlwZT09PVwiZnVuY3Rpb25cIil7Y2FsbGJhY2s9YmluYXJ5VHlwZTtiaW5hcnlUeXBlPW51bGx9dmFyIGJ1ZmZlclRhaWw9ZGF0YTt2YXIgYnVmZmVycz1bXTt2YXIgbnVtYmVyVG9vTG9uZz1mYWxzZTt3aGlsZShidWZmZXJUYWlsLmJ5dGVMZW5ndGg+MCl7dmFyIHRhaWxBcnJheT1uZXcgVWludDhBcnJheShidWZmZXJUYWlsKTt2YXIgaXNTdHJpbmc9dGFpbEFycmF5WzBdPT09MDt2YXIgbXNnTGVuZ3RoPVwiXCI7Zm9yKHZhciBpPTE7O2krKyl7aWYodGFpbEFycmF5W2ldPT0yNTUpYnJlYWs7aWYobXNnTGVuZ3RoLmxlbmd0aD4zMTApe251bWJlclRvb0xvbmc9dHJ1ZTticmVha31tc2dMZW5ndGgrPXRhaWxBcnJheVtpXX1pZihudW1iZXJUb29Mb25nKXJldHVybiBjYWxsYmFjayhlcnIsMCwxKTtidWZmZXJUYWlsPXNsaWNlQnVmZmVyKGJ1ZmZlclRhaWwsMittc2dMZW5ndGgubGVuZ3RoKTttc2dMZW5ndGg9cGFyc2VJbnQobXNnTGVuZ3RoKTt2YXIgbXNnPXNsaWNlQnVmZmVyKGJ1ZmZlclRhaWwsMCxtc2dMZW5ndGgpO2lmKGlzU3RyaW5nKXt0cnl7bXNnPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuZXcgVWludDhBcnJheShtc2cpKX1jYXRjaChlKXt2YXIgdHlwZWQ9bmV3IFVpbnQ4QXJyYXkobXNnKTttc2c9XCJcIjtmb3IodmFyIGk9MDtpPHR5cGVkLmxlbmd0aDtpKyspe21zZys9U3RyaW5nLmZyb21DaGFyQ29kZSh0eXBlZFtpXSl9fX1idWZmZXJzLnB1c2gobXNnKTtidWZmZXJUYWlsPXNsaWNlQnVmZmVyKGJ1ZmZlclRhaWwsbXNnTGVuZ3RoKX12YXIgdG90YWw9YnVmZmVycy5sZW5ndGg7YnVmZmVycy5mb3JFYWNoKGZ1bmN0aW9uKGJ1ZmZlcixpKXtjYWxsYmFjayhleHBvcnRzLmRlY29kZVBhY2tldChidWZmZXIsYmluYXJ5VHlwZSx0cnVlKSxpLHRvdGFsKX0pfX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIj93aW5kb3c6e30pfSx7XCIuL2tleXNcIjoyNixhZnRlcjoyNyxcImFycmF5YnVmZmVyLnNsaWNlXCI6MjgsXCJiYXNlNjQtYXJyYXlidWZmZXJcIjoyOSxibG9iOjMwLFwiaGFzLWJpbmFyeVwiOjMxLHV0Zjg6MzN9XSwyNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uIGtleXMob2JqKXt2YXIgYXJyPVtdO3ZhciBoYXM9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtmb3IodmFyIGkgaW4gb2JqKXtpZihoYXMuY2FsbChvYmosaSkpe2Fyci5wdXNoKGkpfX1yZXR1cm4gYXJyfX0se31dLDI3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1hZnRlcjtmdW5jdGlvbiBhZnRlcihjb3VudCxjYWxsYmFjayxlcnJfY2Ipe3ZhciBiYWlsPWZhbHNlO2Vycl9jYj1lcnJfY2J8fG5vb3A7cHJveHkuY291bnQ9Y291bnQ7cmV0dXJuIGNvdW50PT09MD9jYWxsYmFjaygpOnByb3h5O2Z1bmN0aW9uIHByb3h5KGVycixyZXN1bHQpe2lmKHByb3h5LmNvdW50PD0wKXt0aHJvdyBuZXcgRXJyb3IoXCJhZnRlciBjYWxsZWQgdG9vIG1hbnkgdGltZXNcIil9LS1wcm94eS5jb3VudDtpZihlcnIpe2JhaWw9dHJ1ZTtjYWxsYmFjayhlcnIpO2NhbGxiYWNrPWVycl9jYn1lbHNlIGlmKHByb3h5LmNvdW50PT09MCYmIWJhaWwpe2NhbGxiYWNrKG51bGwscmVzdWx0KX19fWZ1bmN0aW9uIG5vb3AoKXt9fSx7fV0sMjg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGFycmF5YnVmZmVyLHN0YXJ0LGVuZCl7dmFyIGJ5dGVzPWFycmF5YnVmZmVyLmJ5dGVMZW5ndGg7c3RhcnQ9c3RhcnR8fDA7ZW5kPWVuZHx8Ynl0ZXM7aWYoYXJyYXlidWZmZXIuc2xpY2Upe3JldHVybiBhcnJheWJ1ZmZlci5zbGljZShzdGFydCxlbmQpfWlmKHN0YXJ0PDApe3N0YXJ0Kz1ieXRlc31pZihlbmQ8MCl7ZW5kKz1ieXRlc31pZihlbmQ+Ynl0ZXMpe2VuZD1ieXRlc31pZihzdGFydD49Ynl0ZXN8fHN0YXJ0Pj1lbmR8fGJ5dGVzPT09MCl7cmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKX12YXIgYWJ2PW5ldyBVaW50OEFycmF5KGFycmF5YnVmZmVyKTt2YXIgcmVzdWx0PW5ldyBVaW50OEFycmF5KGVuZC1zdGFydCk7Zm9yKHZhciBpPXN0YXJ0LGlpPTA7aTxlbmQ7aSsrLGlpKyspe3Jlc3VsdFtpaV09YWJ2W2ldfXJldHVybiByZXN1bHQuYnVmZmVyfX0se31dLDI5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oY2hhcnMpe1widXNlIHN0cmljdFwiO2V4cG9ydHMuZW5jb2RlPWZ1bmN0aW9uKGFycmF5YnVmZmVyKXt2YXIgYnl0ZXM9bmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpLGksbGVuPWJ5dGVzLmxlbmd0aCxiYXNlNjQ9XCJcIjtmb3IoaT0wO2k8bGVuO2krPTMpe2Jhc2U2NCs9Y2hhcnNbYnl0ZXNbaV0+PjJdO2Jhc2U2NCs9Y2hhcnNbKGJ5dGVzW2ldJjMpPDw0fGJ5dGVzW2krMV0+PjRdO2Jhc2U2NCs9Y2hhcnNbKGJ5dGVzW2krMV0mMTUpPDwyfGJ5dGVzW2krMl0+PjZdO2Jhc2U2NCs9Y2hhcnNbYnl0ZXNbaSsyXSY2M119aWYobGVuJTM9PT0yKXtiYXNlNjQ9YmFzZTY0LnN1YnN0cmluZygwLGJhc2U2NC5sZW5ndGgtMSkrXCI9XCJ9ZWxzZSBpZihsZW4lMz09PTEpe2Jhc2U2ND1iYXNlNjQuc3Vic3RyaW5nKDAsYmFzZTY0Lmxlbmd0aC0yKStcIj09XCJ9cmV0dXJuIGJhc2U2NH07ZXhwb3J0cy5kZWNvZGU9ZnVuY3Rpb24oYmFzZTY0KXt2YXIgYnVmZmVyTGVuZ3RoPWJhc2U2NC5sZW5ndGgqLjc1LGxlbj1iYXNlNjQubGVuZ3RoLGkscD0wLGVuY29kZWQxLGVuY29kZWQyLGVuY29kZWQzLGVuY29kZWQ0O2lmKGJhc2U2NFtiYXNlNjQubGVuZ3RoLTFdPT09XCI9XCIpe2J1ZmZlckxlbmd0aC0tO2lmKGJhc2U2NFtiYXNlNjQubGVuZ3RoLTJdPT09XCI9XCIpe2J1ZmZlckxlbmd0aC0tfX12YXIgYXJyYXlidWZmZXI9bmV3IEFycmF5QnVmZmVyKGJ1ZmZlckxlbmd0aCksYnl0ZXM9bmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpO2ZvcihpPTA7aTxsZW47aSs9NCl7ZW5jb2RlZDE9Y2hhcnMuaW5kZXhPZihiYXNlNjRbaV0pO2VuY29kZWQyPWNoYXJzLmluZGV4T2YoYmFzZTY0W2krMV0pO2VuY29kZWQzPWNoYXJzLmluZGV4T2YoYmFzZTY0W2krMl0pO2VuY29kZWQ0PWNoYXJzLmluZGV4T2YoYmFzZTY0W2krM10pO2J5dGVzW3ArK109ZW5jb2RlZDE8PDJ8ZW5jb2RlZDI+PjQ7Ynl0ZXNbcCsrXT0oZW5jb2RlZDImMTUpPDw0fGVuY29kZWQzPj4yO2J5dGVzW3ArK109KGVuY29kZWQzJjMpPDw2fGVuY29kZWQ0JjYzfXJldHVybiBhcnJheWJ1ZmZlcn19KShcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIil9LHt9XSwzMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7dmFyIEJsb2JCdWlsZGVyPWdsb2JhbC5CbG9iQnVpbGRlcnx8Z2xvYmFsLldlYktpdEJsb2JCdWlsZGVyfHxnbG9iYWwuTVNCbG9iQnVpbGRlcnx8Z2xvYmFsLk1vekJsb2JCdWlsZGVyO3ZhciBibG9iU3VwcG9ydGVkPWZ1bmN0aW9uKCl7dHJ5e3ZhciBiPW5ldyBCbG9iKFtcImhpXCJdKTtyZXR1cm4gYi5zaXplPT0yfWNhdGNoKGUpe3JldHVybiBmYWxzZX19KCk7dmFyIGJsb2JCdWlsZGVyU3VwcG9ydGVkPUJsb2JCdWlsZGVyJiZCbG9iQnVpbGRlci5wcm90b3R5cGUuYXBwZW5kJiZCbG9iQnVpbGRlci5wcm90b3R5cGUuZ2V0QmxvYjtmdW5jdGlvbiBCbG9iQnVpbGRlckNvbnN0cnVjdG9yKGFyeSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBiYj1uZXcgQmxvYkJ1aWxkZXI7Zm9yKHZhciBpPTA7aTxhcnkubGVuZ3RoO2krKyl7YmIuYXBwZW5kKGFyeVtpXSl9cmV0dXJuIG9wdGlvbnMudHlwZT9iYi5nZXRCbG9iKG9wdGlvbnMudHlwZSk6YmIuZ2V0QmxvYigpfW1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKCl7aWYoYmxvYlN1cHBvcnRlZCl7cmV0dXJuIGdsb2JhbC5CbG9ifWVsc2UgaWYoYmxvYkJ1aWxkZXJTdXBwb3J0ZWQpe3JldHVybiBCbG9iQnVpbGRlckNvbnN0cnVjdG9yfWVsc2V7cmV0dXJuIHVuZGVmaW5lZH19KCl9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCI/d2luZG93Ont9KX0se31dLDMxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXt2YXIgaXNBcnJheT1fZGVyZXFfKFwiaXNhcnJheVwiKTttb2R1bGUuZXhwb3J0cz1oYXNCaW5hcnk7ZnVuY3Rpb24gaGFzQmluYXJ5KGRhdGEpe2Z1bmN0aW9uIF9oYXNCaW5hcnkob2JqKXtpZighb2JqKXJldHVybiBmYWxzZTtpZihnbG9iYWwuQnVmZmVyJiZnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKG9iail8fGdsb2JhbC5BcnJheUJ1ZmZlciYmb2JqIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fGdsb2JhbC5CbG9iJiZvYmogaW5zdGFuY2VvZiBCbG9ifHxnbG9iYWwuRmlsZSYmb2JqIGluc3RhbmNlb2YgRmlsZSl7cmV0dXJuIHRydWV9aWYoaXNBcnJheShvYmopKXtmb3IodmFyIGk9MDtpPG9iai5sZW5ndGg7aSsrKXtpZihfaGFzQmluYXJ5KG9ialtpXSkpe3JldHVybiB0cnVlfX19ZWxzZSBpZihvYmomJlwib2JqZWN0XCI9PXR5cGVvZiBvYmope2lmKG9iai50b0pTT04pe29iaj1vYmoudG9KU09OKCl9Zm9yKHZhciBrZXkgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoa2V5KSYmX2hhc0JpbmFyeShvYmpba2V5XSkpe3JldHVybiB0cnVlfX19cmV0dXJuIGZhbHNlfXJldHVybiBfaGFzQmluYXJ5KGRhdGEpfX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIj93aW5kb3c6e30pfSx7aXNhcnJheTozMn1dLDMyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1BcnJheS5pc0FycmF5fHxmdW5jdGlvbihhcnIpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKT09XCJbb2JqZWN0IEFycmF5XVwifX0se31dLDMzOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXsoZnVuY3Rpb24ocm9vdCl7dmFyIGZyZWVFeHBvcnRzPXR5cGVvZiBleHBvcnRzPT1cIm9iamVjdFwiJiZleHBvcnRzO3ZhciBmcmVlTW9kdWxlPXR5cGVvZiBtb2R1bGU9PVwib2JqZWN0XCImJm1vZHVsZSYmbW9kdWxlLmV4cG9ydHM9PWZyZWVFeHBvcnRzJiZtb2R1bGU7dmFyIGZyZWVHbG9iYWw9dHlwZW9mIGdsb2JhbD09XCJvYmplY3RcIiYmZ2xvYmFsO2lmKGZyZWVHbG9iYWwuZ2xvYmFsPT09ZnJlZUdsb2JhbHx8ZnJlZUdsb2JhbC53aW5kb3c9PT1mcmVlR2xvYmFsKXtyb290PWZyZWVHbG9iYWx9dmFyIHN0cmluZ0Zyb21DaGFyQ29kZT1TdHJpbmcuZnJvbUNoYXJDb2RlO2Z1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKXt2YXIgb3V0cHV0PVtdO3ZhciBjb3VudGVyPTA7dmFyIGxlbmd0aD1zdHJpbmcubGVuZ3RoO3ZhciB2YWx1ZTt2YXIgZXh0cmE7d2hpbGUoY291bnRlcjxsZW5ndGgpe3ZhbHVlPXN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7aWYodmFsdWU+PTU1Mjk2JiZ2YWx1ZTw9NTYzMTkmJmNvdW50ZXI8bGVuZ3RoKXtleHRyYT1zdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO2lmKChleHRyYSY2NDUxMik9PTU2MzIwKXtvdXRwdXQucHVzaCgoKHZhbHVlJjEwMjMpPDwxMCkrKGV4dHJhJjEwMjMpKzY1NTM2KX1lbHNle291dHB1dC5wdXNoKHZhbHVlKTtjb3VudGVyLS19fWVsc2V7b3V0cHV0LnB1c2godmFsdWUpfX1yZXR1cm4gb3V0cHV0fWZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpe3ZhciBsZW5ndGg9YXJyYXkubGVuZ3RoO3ZhciBpbmRleD0tMTt2YXIgdmFsdWU7dmFyIG91dHB1dD1cIlwiO3doaWxlKCsraW5kZXg8bGVuZ3RoKXt2YWx1ZT1hcnJheVtpbmRleF07aWYodmFsdWU+NjU1MzUpe3ZhbHVlLT02NTUzNjtcbm91dHB1dCs9c3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlPj4+MTAmMTAyM3w1NTI5Nik7dmFsdWU9NTYzMjB8dmFsdWUmMTAyM31vdXRwdXQrPXN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSl9cmV0dXJuIG91dHB1dH1mdW5jdGlvbiBjcmVhdGVCeXRlKGNvZGVQb2ludCxzaGlmdCl7cmV0dXJuIHN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQ+PnNoaWZ0JjYzfDEyOCl9ZnVuY3Rpb24gZW5jb2RlQ29kZVBvaW50KGNvZGVQb2ludCl7aWYoKGNvZGVQb2ludCY0Mjk0OTY3MTY4KT09MCl7cmV0dXJuIHN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQpfXZhciBzeW1ib2w9XCJcIjtpZigoY29kZVBvaW50JjQyOTQ5NjUyNDgpPT0wKXtzeW1ib2w9c3RyaW5nRnJvbUNoYXJDb2RlKGNvZGVQb2ludD4+NiYzMXwxOTIpfWVsc2UgaWYoKGNvZGVQb2ludCY0Mjk0OTAxNzYwKT09MCl7c3ltYm9sPXN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQ+PjEyJjE1fDIyNCk7c3ltYm9sKz1jcmVhdGVCeXRlKGNvZGVQb2ludCw2KX1lbHNlIGlmKChjb2RlUG9pbnQmNDI5Mjg3MDE0NCk9PTApe3N5bWJvbD1zdHJpbmdGcm9tQ2hhckNvZGUoY29kZVBvaW50Pj4xOCY3fDI0MCk7c3ltYm9sKz1jcmVhdGVCeXRlKGNvZGVQb2ludCwxMik7c3ltYm9sKz1jcmVhdGVCeXRlKGNvZGVQb2ludCw2KX1zeW1ib2wrPXN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQmNjN8MTI4KTtyZXR1cm4gc3ltYm9sfWZ1bmN0aW9uIHV0ZjhlbmNvZGUoc3RyaW5nKXt2YXIgY29kZVBvaW50cz11Y3MyZGVjb2RlKHN0cmluZyk7dmFyIGxlbmd0aD1jb2RlUG9pbnRzLmxlbmd0aDt2YXIgaW5kZXg9LTE7dmFyIGNvZGVQb2ludDt2YXIgYnl0ZVN0cmluZz1cIlwiO3doaWxlKCsraW5kZXg8bGVuZ3RoKXtjb2RlUG9pbnQ9Y29kZVBvaW50c1tpbmRleF07Ynl0ZVN0cmluZys9ZW5jb2RlQ29kZVBvaW50KGNvZGVQb2ludCl9cmV0dXJuIGJ5dGVTdHJpbmd9ZnVuY3Rpb24gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKXtpZihieXRlSW5kZXg+PWJ5dGVDb3VudCl7dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGJ5dGUgaW5kZXhcIil9dmFyIGNvbnRpbnVhdGlvbkJ5dGU9Ynl0ZUFycmF5W2J5dGVJbmRleF0mMjU1O2J5dGVJbmRleCsrO2lmKChjb250aW51YXRpb25CeXRlJjE5Mik9PTEyOCl7cmV0dXJuIGNvbnRpbnVhdGlvbkJ5dGUmNjN9dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfWZ1bmN0aW9uIGRlY29kZVN5bWJvbCgpe3ZhciBieXRlMTt2YXIgYnl0ZTI7dmFyIGJ5dGUzO3ZhciBieXRlNDt2YXIgY29kZVBvaW50O2lmKGJ5dGVJbmRleD5ieXRlQ291bnQpe3Rocm93IEVycm9yKFwiSW52YWxpZCBieXRlIGluZGV4XCIpfWlmKGJ5dGVJbmRleD09Ynl0ZUNvdW50KXtyZXR1cm4gZmFsc2V9Ynl0ZTE9Ynl0ZUFycmF5W2J5dGVJbmRleF0mMjU1O2J5dGVJbmRleCsrO2lmKChieXRlMSYxMjgpPT0wKXtyZXR1cm4gYnl0ZTF9aWYoKGJ5dGUxJjIyNCk9PTE5Mil7dmFyIGJ5dGUyPXJlYWRDb250aW51YXRpb25CeXRlKCk7Y29kZVBvaW50PShieXRlMSYzMSk8PDZ8Ynl0ZTI7aWYoY29kZVBvaW50Pj0xMjgpe3JldHVybiBjb2RlUG9pbnR9ZWxzZXt0aHJvdyBFcnJvcihcIkludmFsaWQgY29udGludWF0aW9uIGJ5dGVcIil9fWlmKChieXRlMSYyNDApPT0yMjQpe2J5dGUyPXJlYWRDb250aW51YXRpb25CeXRlKCk7Ynl0ZTM9cmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtjb2RlUG9pbnQ9KGJ5dGUxJjE1KTw8MTJ8Ynl0ZTI8PDZ8Ynl0ZTM7aWYoY29kZVBvaW50Pj0yMDQ4KXtyZXR1cm4gY29kZVBvaW50fWVsc2V7dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfX1pZigoYnl0ZTEmMjQ4KT09MjQwKXtieXRlMj1yZWFkQ29udGludWF0aW9uQnl0ZSgpO2J5dGUzPXJlYWRDb250aW51YXRpb25CeXRlKCk7Ynl0ZTQ9cmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtjb2RlUG9pbnQ9KGJ5dGUxJjE1KTw8MTh8Ynl0ZTI8PDEyfGJ5dGUzPDw2fGJ5dGU0O2lmKGNvZGVQb2ludD49NjU1MzYmJmNvZGVQb2ludDw9MTExNDExMSl7cmV0dXJuIGNvZGVQb2ludH19dGhyb3cgRXJyb3IoXCJJbnZhbGlkIFVURi04IGRldGVjdGVkXCIpfXZhciBieXRlQXJyYXk7dmFyIGJ5dGVDb3VudDt2YXIgYnl0ZUluZGV4O2Z1bmN0aW9uIHV0ZjhkZWNvZGUoYnl0ZVN0cmluZyl7Ynl0ZUFycmF5PXVjczJkZWNvZGUoYnl0ZVN0cmluZyk7Ynl0ZUNvdW50PWJ5dGVBcnJheS5sZW5ndGg7Ynl0ZUluZGV4PTA7dmFyIGNvZGVQb2ludHM9W107dmFyIHRtcDt3aGlsZSgodG1wPWRlY29kZVN5bWJvbCgpKSE9PWZhbHNlKXtjb2RlUG9pbnRzLnB1c2godG1wKX1yZXR1cm4gdWNzMmVuY29kZShjb2RlUG9pbnRzKX12YXIgdXRmOD17dmVyc2lvbjpcIjIuMC4wXCIsZW5jb2RlOnV0ZjhlbmNvZGUsZGVjb2RlOnV0ZjhkZWNvZGV9O2lmKHR5cGVvZiBkZWZpbmU9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIGRlZmluZS5hbWQ9PVwib2JqZWN0XCImJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiB1dGY4fSl9ZWxzZSBpZihmcmVlRXhwb3J0cyYmIWZyZWVFeHBvcnRzLm5vZGVUeXBlKXtpZihmcmVlTW9kdWxlKXtmcmVlTW9kdWxlLmV4cG9ydHM9dXRmOH1lbHNle3ZhciBvYmplY3Q9e307dmFyIGhhc093blByb3BlcnR5PW9iamVjdC5oYXNPd25Qcm9wZXJ0eTtmb3IodmFyIGtleSBpbiB1dGY4KXtoYXNPd25Qcm9wZXJ0eS5jYWxsKHV0Zjgsa2V5KSYmKGZyZWVFeHBvcnRzW2tleV09dXRmOFtrZXldKX19fWVsc2V7cm9vdC51dGY4PXV0Zjh9fSkodGhpcyl9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCI/d2luZG93Ont9KX0se31dLDM0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXt2YXIgcnZhbGlkY2hhcnM9L15bXFxdLDp7fVxcc10qJC87dmFyIHJ2YWxpZGVzY2FwZT0vXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVswLTlhLWZBLUZdezR9KS9nO3ZhciBydmFsaWR0b2tlbnM9L1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nO3ZhciBydmFsaWRicmFjZXM9Lyg/Ol58OnwsKSg/OlxccypcXFspKy9nO3ZhciBydHJpbUxlZnQ9L15cXHMrLzt2YXIgcnRyaW1SaWdodD0vXFxzKyQvO21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIHBhcnNlanNvbihkYXRhKXtpZihcInN0cmluZ1wiIT10eXBlb2YgZGF0YXx8IWRhdGEpe3JldHVybiBudWxsfWRhdGE9ZGF0YS5yZXBsYWNlKHJ0cmltTGVmdCxcIlwiKS5yZXBsYWNlKHJ0cmltUmlnaHQsXCJcIik7aWYoZ2xvYmFsLkpTT04mJkpTT04ucGFyc2Upe3JldHVybiBKU09OLnBhcnNlKGRhdGEpfWlmKHJ2YWxpZGNoYXJzLnRlc3QoZGF0YS5yZXBsYWNlKHJ2YWxpZGVzY2FwZSxcIkBcIikucmVwbGFjZShydmFsaWR0b2tlbnMsXCJdXCIpLnJlcGxhY2UocnZhbGlkYnJhY2VzLFwiXCIpKSl7cmV0dXJuIG5ldyBGdW5jdGlvbihcInJldHVybiBcIitkYXRhKSgpfX19KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCI/d2luZG93Ont9KX0se31dLDM1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtleHBvcnRzLmVuY29kZT1mdW5jdGlvbihvYmope3ZhciBzdHI9XCJcIjtmb3IodmFyIGkgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe2lmKHN0ci5sZW5ndGgpc3RyKz1cIiZcIjtzdHIrPWVuY29kZVVSSUNvbXBvbmVudChpKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQob2JqW2ldKX19cmV0dXJuIHN0cn07ZXhwb3J0cy5kZWNvZGU9ZnVuY3Rpb24ocXMpe3ZhciBxcnk9e307dmFyIHBhaXJzPXFzLnNwbGl0KFwiJlwiKTtmb3IodmFyIGk9MCxsPXBhaXJzLmxlbmd0aDtpPGw7aSsrKXt2YXIgcGFpcj1wYWlyc1tpXS5zcGxpdChcIj1cIik7cXJ5W2RlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKV09ZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pfXJldHVybiBxcnl9fSx7fV0sMzY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciByZT0vXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShodHRwfGh0dHBzfHdzfHdzcyk6XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPygoPzpbYS1mMC05XXswLDR9Oil7Miw3fVthLWYwLTldezAsNH18W146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLzt2YXIgcGFydHM9W1wic291cmNlXCIsXCJwcm90b2NvbFwiLFwiYXV0aG9yaXR5XCIsXCJ1c2VySW5mb1wiLFwidXNlclwiLFwicGFzc3dvcmRcIixcImhvc3RcIixcInBvcnRcIixcInJlbGF0aXZlXCIsXCJwYXRoXCIsXCJkaXJlY3RvcnlcIixcImZpbGVcIixcInF1ZXJ5XCIsXCJhbmNob3JcIl07bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gcGFyc2V1cmkoc3RyKXt2YXIgc3JjPXN0cixiPXN0ci5pbmRleE9mKFwiW1wiKSxlPXN0ci5pbmRleE9mKFwiXVwiKTtpZihiIT0tMSYmZSE9LTEpe3N0cj1zdHIuc3Vic3RyaW5nKDAsYikrc3RyLnN1YnN0cmluZyhiLGUpLnJlcGxhY2UoLzovZyxcIjtcIikrc3RyLnN1YnN0cmluZyhlLHN0ci5sZW5ndGgpfXZhciBtPXJlLmV4ZWMoc3RyfHxcIlwiKSx1cmk9e30saT0xNDt3aGlsZShpLS0pe3VyaVtwYXJ0c1tpXV09bVtpXXx8XCJcIn1pZihiIT0tMSYmZSE9LTEpe3VyaS5zb3VyY2U9c3JjO3VyaS5ob3N0PXVyaS5ob3N0LnN1YnN0cmluZygxLHVyaS5ob3N0Lmxlbmd0aC0xKS5yZXBsYWNlKC87L2csXCI6XCIpO3VyaS5hdXRob3JpdHk9dXJpLmF1dGhvcml0eS5yZXBsYWNlKFwiW1wiLFwiXCIpLnJlcGxhY2UoXCJdXCIsXCJcIikucmVwbGFjZSgvOy9nLFwiOlwiKTt1cmkuaXB2NnVyaT10cnVlfXJldHVybiB1cml9fSx7fV0sMzc6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBnbG9iYWw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKTt2YXIgV2ViU29ja2V0PWdsb2JhbC5XZWJTb2NrZXR8fGdsb2JhbC5Nb3pXZWJTb2NrZXQ7bW9kdWxlLmV4cG9ydHM9V2ViU29ja2V0P3dzOm51bGw7ZnVuY3Rpb24gd3ModXJpLHByb3RvY29scyxvcHRzKXt2YXIgaW5zdGFuY2U7aWYocHJvdG9jb2xzKXtpbnN0YW5jZT1uZXcgV2ViU29ja2V0KHVyaSxwcm90b2NvbHMpfWVsc2V7aW5zdGFuY2U9bmV3IFdlYlNvY2tldCh1cmkpfXJldHVybiBpbnN0YW5jZX1pZihXZWJTb2NrZXQpd3MucHJvdG90eXBlPVdlYlNvY2tldC5wcm90b3R5cGV9LHt9XSwzODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7dmFyIGlzQXJyYXk9X2RlcmVxXyhcImlzYXJyYXlcIik7bW9kdWxlLmV4cG9ydHM9aGFzQmluYXJ5O2Z1bmN0aW9uIGhhc0JpbmFyeShkYXRhKXtmdW5jdGlvbiBfaGFzQmluYXJ5KG9iail7aWYoIW9iailyZXR1cm4gZmFsc2U7aWYoZ2xvYmFsLkJ1ZmZlciYmZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihvYmopfHxnbG9iYWwuQXJyYXlCdWZmZXImJm9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxnbG9iYWwuQmxvYiYmb2JqIGluc3RhbmNlb2YgQmxvYnx8Z2xvYmFsLkZpbGUmJm9iaiBpbnN0YW5jZW9mIEZpbGUpe3JldHVybiB0cnVlfWlmKGlzQXJyYXkob2JqKSl7Zm9yKHZhciBpPTA7aTxvYmoubGVuZ3RoO2krKyl7aWYoX2hhc0JpbmFyeShvYmpbaV0pKXtyZXR1cm4gdHJ1ZX19fWVsc2UgaWYob2JqJiZcIm9iamVjdFwiPT10eXBlb2Ygb2JqKXtpZihvYmoudG9KU09OKXtvYmo9b2JqLnRvSlNPTigpfWZvcih2YXIga2V5IGluIG9iail7aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaixrZXkpJiZfaGFzQmluYXJ5KG9ialtrZXldKSl7cmV0dXJuIHRydWV9fX1yZXR1cm4gZmFsc2V9cmV0dXJuIF9oYXNCaW5hcnkoZGF0YSl9fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiP3dpbmRvdzp7fSl9LHtpc2FycmF5OjM5fV0sMzk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPV9kZXJlcV8oMzIpfSx7fV0sNDA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBnbG9iYWw9X2RlcmVxXyhcImdsb2JhbFwiKTt0cnl7bW9kdWxlLmV4cG9ydHM9XCJYTUxIdHRwUmVxdWVzdFwiaW4gZ2xvYmFsJiZcIndpdGhDcmVkZW50aWFsc1wiaW4gbmV3IGdsb2JhbC5YTUxIdHRwUmVxdWVzdH1jYXRjaChlcnIpe21vZHVsZS5leHBvcnRzPWZhbHNlfX0se2dsb2JhbDo0MX1dLDQxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbigpe3JldHVybiB0aGlzfSgpfSx7fV0sNDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBpbmRleE9mPVtdLmluZGV4T2Y7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oYXJyLG9iail7aWYoaW5kZXhPZilyZXR1cm4gYXJyLmluZGV4T2Yob2JqKTtmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7KytpKXtpZihhcnJbaV09PT1vYmopcmV0dXJuIGl9cmV0dXJuLTF9fSx7fV0sNDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBoYXM9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtleHBvcnRzLmtleXM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKG9iail7dmFyIGtleXM9W107Zm9yKHZhciBrZXkgaW4gb2JqKXtpZihoYXMuY2FsbChvYmosa2V5KSl7a2V5cy5wdXNoKGtleSl9fXJldHVybiBrZXlzfTtleHBvcnRzLnZhbHVlcz1mdW5jdGlvbihvYmope3ZhciB2YWxzPVtdO2Zvcih2YXIga2V5IGluIG9iail7aWYoaGFzLmNhbGwob2JqLGtleSkpe3ZhbHMucHVzaChvYmpba2V5XSl9fXJldHVybiB2YWxzfTtleHBvcnRzLm1lcmdlPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBrZXkgaW4gYil7aWYoaGFzLmNhbGwoYixrZXkpKXthW2tleV09YltrZXldfX1yZXR1cm4gYX07ZXhwb3J0cy5sZW5ndGg9ZnVuY3Rpb24ob2JqKXtyZXR1cm4gZXhwb3J0cy5rZXlzKG9iaikubGVuZ3RofTtleHBvcnRzLmlzRW1wdHk9ZnVuY3Rpb24ob2JqKXtyZXR1cm4gMD09ZXhwb3J0cy5sZW5ndGgob2JqKX19LHt9XSw0NDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIHJlPS9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKGh0dHB8aHR0cHN8d3N8d3NzKTpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KCg/OlthLWYwLTldezAsNH06KXsyLDd9W2EtZjAtOV17MCw0fXxbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvO3ZhciBwYXJ0cz1bXCJzb3VyY2VcIixcInByb3RvY29sXCIsXCJhdXRob3JpdHlcIixcInVzZXJJbmZvXCIsXCJ1c2VyXCIsXCJwYXNzd29yZFwiLFwiaG9zdFwiLFwicG9ydFwiLFwicmVsYXRpdmVcIixcInBhdGhcIixcImRpcmVjdG9yeVwiLFwiZmlsZVwiLFwicXVlcnlcIixcImFuY2hvclwiXTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbiBwYXJzZXVyaShzdHIpe3ZhciBtPXJlLmV4ZWMoc3RyfHxcIlwiKSx1cmk9e30saT0xNDt3aGlsZShpLS0pe3VyaVtwYXJ0c1tpXV09bVtpXXx8XCJcIn1yZXR1cm4gdXJpfX0se31dLDQ1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXt2YXIgaXNBcnJheT1fZGVyZXFfKFwiaXNhcnJheVwiKTt2YXIgaXNCdWY9X2RlcmVxXyhcIi4vaXMtYnVmZmVyXCIpO2V4cG9ydHMuZGVjb25zdHJ1Y3RQYWNrZXQ9ZnVuY3Rpb24ocGFja2V0KXt2YXIgYnVmZmVycz1bXTt2YXIgcGFja2V0RGF0YT1wYWNrZXQuZGF0YTtmdW5jdGlvbiBfZGVjb25zdHJ1Y3RQYWNrZXQoZGF0YSl7aWYoIWRhdGEpcmV0dXJuIGRhdGE7aWYoaXNCdWYoZGF0YSkpe3ZhciBwbGFjZWhvbGRlcj17X3BsYWNlaG9sZGVyOnRydWUsbnVtOmJ1ZmZlcnMubGVuZ3RofTtidWZmZXJzLnB1c2goZGF0YSk7cmV0dXJuIHBsYWNlaG9sZGVyfWVsc2UgaWYoaXNBcnJheShkYXRhKSl7dmFyIG5ld0RhdGE9bmV3IEFycmF5KGRhdGEubGVuZ3RoKTtmb3IodmFyIGk9MDtpPGRhdGEubGVuZ3RoO2krKyl7bmV3RGF0YVtpXT1fZGVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtpXSl9cmV0dXJuIG5ld0RhdGF9ZWxzZSBpZihcIm9iamVjdFwiPT10eXBlb2YgZGF0YSYmIShkYXRhIGluc3RhbmNlb2YgRGF0ZSkpe3ZhciBuZXdEYXRhPXt9O2Zvcih2YXIga2V5IGluIGRhdGEpe25ld0RhdGFba2V5XT1fZGVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtrZXldKX1yZXR1cm4gbmV3RGF0YX1yZXR1cm4gZGF0YX12YXIgcGFjaz1wYWNrZXQ7cGFjay5kYXRhPV9kZWNvbnN0cnVjdFBhY2tldChwYWNrZXREYXRhKTtwYWNrLmF0dGFjaG1lbnRzPWJ1ZmZlcnMubGVuZ3RoO3JldHVybntwYWNrZXQ6cGFjayxidWZmZXJzOmJ1ZmZlcnN9fTtleHBvcnRzLnJlY29uc3RydWN0UGFja2V0PWZ1bmN0aW9uKHBhY2tldCxidWZmZXJzKXt2YXIgY3VyUGxhY2VIb2xkZXI9MDtmdW5jdGlvbiBfcmVjb25zdHJ1Y3RQYWNrZXQoZGF0YSl7aWYoZGF0YSYmZGF0YS5fcGxhY2Vob2xkZXIpe3ZhciBidWY9YnVmZmVyc1tkYXRhLm51bV07cmV0dXJuIGJ1Zn1lbHNlIGlmKGlzQXJyYXkoZGF0YSkpe2Zvcih2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtkYXRhW2ldPV9yZWNvbnN0cnVjdFBhY2tldChkYXRhW2ldKX1yZXR1cm4gZGF0YX1lbHNlIGlmKGRhdGEmJlwib2JqZWN0XCI9PXR5cGVvZiBkYXRhKXtmb3IodmFyIGtleSBpbiBkYXRhKXtkYXRhW2tleV09X3JlY29uc3RydWN0UGFja2V0KGRhdGFba2V5XSl9cmV0dXJuIGRhdGF9cmV0dXJuIGRhdGF9cGFja2V0LmRhdGE9X3JlY29uc3RydWN0UGFja2V0KHBhY2tldC5kYXRhKTtwYWNrZXQuYXR0YWNobWVudHM9dW5kZWZpbmVkO3JldHVybiBwYWNrZXR9O2V4cG9ydHMucmVtb3ZlQmxvYnM9ZnVuY3Rpb24oZGF0YSxjYWxsYmFjayl7ZnVuY3Rpb24gX3JlbW92ZUJsb2JzKG9iaixjdXJLZXksY29udGFpbmluZ09iamVjdCl7aWYoIW9iailyZXR1cm4gb2JqO2lmKGdsb2JhbC5CbG9iJiZvYmogaW5zdGFuY2VvZiBCbG9ifHxnbG9iYWwuRmlsZSYmb2JqIGluc3RhbmNlb2YgRmlsZSl7cGVuZGluZ0Jsb2JzKys7dmFyIGZpbGVSZWFkZXI9bmV3IEZpbGVSZWFkZXI7ZmlsZVJlYWRlci5vbmxvYWQ9ZnVuY3Rpb24oKXtpZihjb250YWluaW5nT2JqZWN0KXtjb250YWluaW5nT2JqZWN0W2N1cktleV09dGhpcy5yZXN1bHR9ZWxzZXtibG9ibGVzc0RhdGE9dGhpcy5yZXN1bHR9aWYoIS0tcGVuZGluZ0Jsb2JzKXtjYWxsYmFjayhibG9ibGVzc0RhdGEpfX07ZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihvYmopfWVsc2UgaWYoaXNBcnJheShvYmopKXtmb3IodmFyIGk9MDtpPG9iai5sZW5ndGg7aSsrKXtfcmVtb3ZlQmxvYnMob2JqW2ldLGksb2JqKX19ZWxzZSBpZihvYmomJlwib2JqZWN0XCI9PXR5cGVvZiBvYmomJiFpc0J1ZihvYmopKXtmb3IodmFyIGtleSBpbiBvYmope19yZW1vdmVCbG9icyhvYmpba2V5XSxrZXksb2JqKX19fXZhciBwZW5kaW5nQmxvYnM9MDt2YXIgYmxvYmxlc3NEYXRhPWRhdGE7X3JlbW92ZUJsb2JzKGJsb2JsZXNzRGF0YSk7aWYoIXBlbmRpbmdCbG9icyl7Y2FsbGJhY2soYmxvYmxlc3NEYXRhKX19fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiP3dpbmRvdzp7fSl9LHtcIi4vaXMtYnVmZmVyXCI6NDcsaXNhcnJheTo0OH1dLDQ2OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXt2YXIgZGVidWc9X2RlcmVxXyhcImRlYnVnXCIpKFwic29ja2V0LmlvLXBhcnNlclwiKTt2YXIganNvbj1fZGVyZXFfKFwianNvbjNcIik7dmFyIGlzQXJyYXk9X2RlcmVxXyhcImlzYXJyYXlcIik7dmFyIEVtaXR0ZXI9X2RlcmVxXyhcImNvbXBvbmVudC1lbWl0dGVyXCIpO3ZhciBiaW5hcnk9X2RlcmVxXyhcIi4vYmluYXJ5XCIpO3ZhciBpc0J1Zj1fZGVyZXFfKFwiLi9pcy1idWZmZXJcIik7ZXhwb3J0cy5wcm90b2NvbD00O2V4cG9ydHMudHlwZXM9W1wiQ09OTkVDVFwiLFwiRElTQ09OTkVDVFwiLFwiRVZFTlRcIixcIkJJTkFSWV9FVkVOVFwiLFwiQUNLXCIsXCJCSU5BUllfQUNLXCIsXCJFUlJPUlwiXTtleHBvcnRzLkNPTk5FQ1Q9MDtleHBvcnRzLkRJU0NPTk5FQ1Q9MTtleHBvcnRzLkVWRU5UPTI7ZXhwb3J0cy5BQ0s9MztleHBvcnRzLkVSUk9SPTQ7ZXhwb3J0cy5CSU5BUllfRVZFTlQ9NTtleHBvcnRzLkJJTkFSWV9BQ0s9NjtleHBvcnRzLkVuY29kZXI9RW5jb2RlcjtleHBvcnRzLkRlY29kZXI9RGVjb2RlcjtmdW5jdGlvbiBFbmNvZGVyKCl7fUVuY29kZXIucHJvdG90eXBlLmVuY29kZT1mdW5jdGlvbihvYmosY2FsbGJhY2spe2RlYnVnKFwiZW5jb2RpbmcgcGFja2V0ICVqXCIsb2JqKTtpZihleHBvcnRzLkJJTkFSWV9FVkVOVD09b2JqLnR5cGV8fGV4cG9ydHMuQklOQVJZX0FDSz09b2JqLnR5cGUpe2VuY29kZUFzQmluYXJ5KG9iaixjYWxsYmFjayl9ZWxzZXt2YXIgZW5jb2Rpbmc9ZW5jb2RlQXNTdHJpbmcob2JqKTtjYWxsYmFjayhbZW5jb2RpbmddKX19O2Z1bmN0aW9uIGVuY29kZUFzU3RyaW5nKG9iail7dmFyIHN0cj1cIlwiO3ZhciBuc3A9ZmFsc2U7c3RyKz1vYmoudHlwZTtpZihleHBvcnRzLkJJTkFSWV9FVkVOVD09b2JqLnR5cGV8fGV4cG9ydHMuQklOQVJZX0FDSz09b2JqLnR5cGUpe3N0cis9b2JqLmF0dGFjaG1lbnRzO3N0cis9XCItXCJ9aWYob2JqLm5zcCYmXCIvXCIhPW9iai5uc3Ape25zcD10cnVlO3N0cis9b2JqLm5zcH1pZihudWxsIT1vYmouaWQpe2lmKG5zcCl7c3RyKz1cIixcIjtuc3A9ZmFsc2V9c3RyKz1vYmouaWR9aWYobnVsbCE9b2JqLmRhdGEpe2lmKG5zcClzdHIrPVwiLFwiO3N0cis9anNvbi5zdHJpbmdpZnkob2JqLmRhdGEpfWRlYnVnKFwiZW5jb2RlZCAlaiBhcyAlc1wiLG9iaixzdHIpO3JldHVybiBzdHJ9ZnVuY3Rpb24gZW5jb2RlQXNCaW5hcnkob2JqLGNhbGxiYWNrKXtmdW5jdGlvbiB3cml0ZUVuY29kaW5nKGJsb2JsZXNzRGF0YSl7dmFyIGRlY29uc3RydWN0aW9uPWJpbmFyeS5kZWNvbnN0cnVjdFBhY2tldChibG9ibGVzc0RhdGEpO3ZhciBwYWNrPWVuY29kZUFzU3RyaW5nKGRlY29uc3RydWN0aW9uLnBhY2tldCk7dmFyIGJ1ZmZlcnM9ZGVjb25zdHJ1Y3Rpb24uYnVmZmVycztidWZmZXJzLnVuc2hpZnQocGFjayk7Y2FsbGJhY2soYnVmZmVycyl9YmluYXJ5LnJlbW92ZUJsb2JzKG9iaix3cml0ZUVuY29kaW5nKX1mdW5jdGlvbiBEZWNvZGVyKCl7dGhpcy5yZWNvbnN0cnVjdG9yPW51bGx9RW1pdHRlcihEZWNvZGVyLnByb3RvdHlwZSk7RGVjb2Rlci5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKG9iail7dmFyIHBhY2tldDtpZihcInN0cmluZ1wiPT10eXBlb2Ygb2JqKXtwYWNrZXQ9ZGVjb2RlU3RyaW5nKG9iaik7aWYoZXhwb3J0cy5CSU5BUllfRVZFTlQ9PXBhY2tldC50eXBlfHxleHBvcnRzLkJJTkFSWV9BQ0s9PXBhY2tldC50eXBlKXt0aGlzLnJlY29uc3RydWN0b3I9bmV3IEJpbmFyeVJlY29uc3RydWN0b3IocGFja2V0KTtpZih0aGlzLnJlY29uc3RydWN0b3IucmVjb25QYWNrLmF0dGFjaG1lbnRzPT09MCl7dGhpcy5lbWl0KFwiZGVjb2RlZFwiLHBhY2tldCl9fWVsc2V7dGhpcy5lbWl0KFwiZGVjb2RlZFwiLHBhY2tldCl9fWVsc2UgaWYoaXNCdWYob2JqKXx8b2JqLmJhc2U2NCl7aWYoIXRoaXMucmVjb25zdHJ1Y3Rvcil7dGhyb3cgbmV3IEVycm9yKFwiZ290IGJpbmFyeSBkYXRhIHdoZW4gbm90IHJlY29uc3RydWN0aW5nIGEgcGFja2V0XCIpfWVsc2V7cGFja2V0PXRoaXMucmVjb25zdHJ1Y3Rvci50YWtlQmluYXJ5RGF0YShvYmopO2lmKHBhY2tldCl7dGhpcy5yZWNvbnN0cnVjdG9yPW51bGw7dGhpcy5lbWl0KFwiZGVjb2RlZFwiLHBhY2tldCl9fX1lbHNle3Rocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZTogXCIrb2JqKX19O2Z1bmN0aW9uIGRlY29kZVN0cmluZyhzdHIpe3ZhciBwPXt9O3ZhciBpPTA7cC50eXBlPU51bWJlcihzdHIuY2hhckF0KDApKTtpZihudWxsPT1leHBvcnRzLnR5cGVzW3AudHlwZV0pcmV0dXJuIGVycm9yKCk7aWYoZXhwb3J0cy5CSU5BUllfRVZFTlQ9PXAudHlwZXx8ZXhwb3J0cy5CSU5BUllfQUNLPT1wLnR5cGUpe3ZhciBidWY9XCJcIjt3aGlsZShzdHIuY2hhckF0KCsraSkhPVwiLVwiKXtidWYrPXN0ci5jaGFyQXQoaSk7aWYoaT09c3RyLmxlbmd0aClicmVha31pZihidWYhPU51bWJlcihidWYpfHxzdHIuY2hhckF0KGkpIT1cIi1cIil7dGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBhdHRhY2htZW50c1wiKX1wLmF0dGFjaG1lbnRzPU51bWJlcihidWYpfWlmKFwiL1wiPT1zdHIuY2hhckF0KGkrMSkpe3AubnNwPVwiXCI7d2hpbGUoKytpKXt2YXIgYz1zdHIuY2hhckF0KGkpO2lmKFwiLFwiPT1jKWJyZWFrO3AubnNwKz1jO2lmKGk9PXN0ci5sZW5ndGgpYnJlYWt9fWVsc2V7cC5uc3A9XCIvXCJ9dmFyIG5leHQ9c3RyLmNoYXJBdChpKzEpO2lmKFwiXCIhPT1uZXh0JiZOdW1iZXIobmV4dCk9PW5leHQpe3AuaWQ9XCJcIjt3aGlsZSgrK2kpe3ZhciBjPXN0ci5jaGFyQXQoaSk7aWYobnVsbD09Y3x8TnVtYmVyKGMpIT1jKXstLWk7YnJlYWt9cC5pZCs9c3RyLmNoYXJBdChpKTtpZihpPT1zdHIubGVuZ3RoKWJyZWFrfXAuaWQ9TnVtYmVyKHAuaWQpfWlmKHN0ci5jaGFyQXQoKytpKSl7dHJ5e3AuZGF0YT1qc29uLnBhcnNlKHN0ci5zdWJzdHIoaSkpfWNhdGNoKGUpe3JldHVybiBlcnJvcigpfX1kZWJ1ZyhcImRlY29kZWQgJXMgYXMgJWpcIixzdHIscCk7cmV0dXJuIHB9RGVjb2Rlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2lmKHRoaXMucmVjb25zdHJ1Y3Rvcil7dGhpcy5yZWNvbnN0cnVjdG9yLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKX19O2Z1bmN0aW9uIEJpbmFyeVJlY29uc3RydWN0b3IocGFja2V0KXt0aGlzLnJlY29uUGFjaz1wYWNrZXQ7dGhpcy5idWZmZXJzPVtdfUJpbmFyeVJlY29uc3RydWN0b3IucHJvdG90eXBlLnRha2VCaW5hcnlEYXRhPWZ1bmN0aW9uKGJpbkRhdGEpe3RoaXMuYnVmZmVycy5wdXNoKGJpbkRhdGEpO2lmKHRoaXMuYnVmZmVycy5sZW5ndGg9PXRoaXMucmVjb25QYWNrLmF0dGFjaG1lbnRzKXt2YXIgcGFja2V0PWJpbmFyeS5yZWNvbnN0cnVjdFBhY2tldCh0aGlzLnJlY29uUGFjayx0aGlzLmJ1ZmZlcnMpO3RoaXMuZmluaXNoZWRSZWNvbnN0cnVjdGlvbigpO3JldHVybiBwYWNrZXR9cmV0dXJuIG51bGx9O0JpbmFyeVJlY29uc3RydWN0b3IucHJvdG90eXBlLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb249ZnVuY3Rpb24oKXt0aGlzLnJlY29uUGFjaz1udWxsO3RoaXMuYnVmZmVycz1bXX07ZnVuY3Rpb24gZXJyb3IoZGF0YSl7cmV0dXJue3R5cGU6ZXhwb3J0cy5FUlJPUixkYXRhOlwicGFyc2VyIGVycm9yXCJ9fX0se1wiLi9iaW5hcnlcIjo0NSxcIi4vaXMtYnVmZmVyXCI6NDcsXCJjb21wb25lbnQtZW1pdHRlclwiOjksZGVidWc6MTAsaXNhcnJheTo0OCxqc29uMzo0OX1dLDQ3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXttb2R1bGUuZXhwb3J0cz1pc0J1ZjtmdW5jdGlvbiBpc0J1ZihvYmope3JldHVybiBnbG9iYWwuQnVmZmVyJiZnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKG9iail8fGdsb2JhbC5BcnJheUJ1ZmZlciYmb2JqIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ9fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiP3dpbmRvdzp7fSl9LHt9XSw0ODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9X2RlcmVxXygzMil9LHt9XSw0OTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHdpbmRvdyl7dmFyIGdldENsYXNzPXt9LnRvU3RyaW5nLGlzUHJvcGVydHksZm9yRWFjaCx1bmRlZjt2YXIgaXNMb2FkZXI9dHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZDt2YXIgbmF0aXZlSlNPTj10eXBlb2YgSlNPTj09XCJvYmplY3RcIiYmSlNPTjt2YXIgSlNPTjM9dHlwZW9mIGV4cG9ydHM9PVwib2JqZWN0XCImJmV4cG9ydHMmJiFleHBvcnRzLm5vZGVUeXBlJiZleHBvcnRzO2lmKEpTT04zJiZuYXRpdmVKU09OKXtKU09OMy5zdHJpbmdpZnk9bmF0aXZlSlNPTi5zdHJpbmdpZnk7SlNPTjMucGFyc2U9bmF0aXZlSlNPTi5wYXJzZX1lbHNle0pTT04zPXdpbmRvdy5KU09OPW5hdGl2ZUpTT058fHt9fXZhciBpc0V4dGVuZGVkPW5ldyBEYXRlKC0weGM3ODJiNWI4MDBjZWMpO3RyeXtpc0V4dGVuZGVkPWlzRXh0ZW5kZWQuZ2V0VVRDRnVsbFllYXIoKT09LTEwOTI1MiYmaXNFeHRlbmRlZC5nZXRVVENNb250aCgpPT09MCYmaXNFeHRlbmRlZC5nZXRVVENEYXRlKCk9PT0xJiZpc0V4dGVuZGVkLmdldFVUQ0hvdXJzKCk9PTEwJiZpc0V4dGVuZGVkLmdldFVUQ01pbnV0ZXMoKT09MzcmJmlzRXh0ZW5kZWQuZ2V0VVRDU2Vjb25kcygpPT02JiZpc0V4dGVuZGVkLmdldFVUQ01pbGxpc2Vjb25kcygpPT03MDh9Y2F0Y2goZXhjZXB0aW9uKXt9ZnVuY3Rpb24gaGFzKG5hbWUpe2lmKGhhc1tuYW1lXSE9PXVuZGVmKXtyZXR1cm4gaGFzW25hbWVdfXZhciBpc1N1cHBvcnRlZDtpZihuYW1lPT1cImJ1Zy1zdHJpbmctY2hhci1pbmRleFwiKXtpc1N1cHBvcnRlZD1cImFcIlswXSE9XCJhXCJ9ZWxzZSBpZihuYW1lPT1cImpzb25cIil7aXNTdXBwb3J0ZWQ9aGFzKFwianNvbi1zdHJpbmdpZnlcIikmJmhhcyhcImpzb24tcGFyc2VcIil9ZWxzZXt2YXIgdmFsdWUsc2VyaWFsaXplZD0ne1wiYVwiOlsxLHRydWUsZmFsc2UsbnVsbCxcIlxcXFx1MDAwMFxcXFxiXFxcXG5cXFxcZlxcXFxyXFxcXHRcIl19JztpZihuYW1lPT1cImpzb24tc3RyaW5naWZ5XCIpe3ZhciBzdHJpbmdpZnk9SlNPTjMuc3RyaW5naWZ5LHN0cmluZ2lmeVN1cHBvcnRlZD10eXBlb2Ygc3RyaW5naWZ5PT1cImZ1bmN0aW9uXCImJmlzRXh0ZW5kZWQ7aWYoc3RyaW5naWZ5U3VwcG9ydGVkKXsodmFsdWU9ZnVuY3Rpb24oKXtyZXR1cm4gMX0pLnRvSlNPTj12YWx1ZTt0cnl7c3RyaW5naWZ5U3VwcG9ydGVkPXN0cmluZ2lmeSgwKT09PVwiMFwiJiZzdHJpbmdpZnkobmV3IE51bWJlcik9PT1cIjBcIiYmc3RyaW5naWZ5KG5ldyBTdHJpbmcpPT0nXCJcIicmJnN0cmluZ2lmeShnZXRDbGFzcyk9PT11bmRlZiYmc3RyaW5naWZ5KHVuZGVmKT09PXVuZGVmJiZzdHJpbmdpZnkoKT09PXVuZGVmJiZzdHJpbmdpZnkodmFsdWUpPT09XCIxXCImJnN0cmluZ2lmeShbdmFsdWVdKT09XCJbMV1cIiYmc3RyaW5naWZ5KFt1bmRlZl0pPT1cIltudWxsXVwiJiZzdHJpbmdpZnkobnVsbCk9PVwibnVsbFwiJiZzdHJpbmdpZnkoW3VuZGVmLGdldENsYXNzLG51bGxdKT09XCJbbnVsbCxudWxsLG51bGxdXCImJnN0cmluZ2lmeSh7YTpbdmFsdWUsdHJ1ZSxmYWxzZSxudWxsLFwiXFx4MDBcXGJcXG5cXGZcXHJcdFwiXX0pPT1zZXJpYWxpemVkJiZzdHJpbmdpZnkobnVsbCx2YWx1ZSk9PT1cIjFcIiYmc3RyaW5naWZ5KFsxLDJdLG51bGwsMSk9PVwiW1xcbiAxLFxcbiAyXFxuXVwiJiZzdHJpbmdpZnkobmV3IERhdGUoLTg2NGUxMykpPT0nXCItMjcxODIxLTA0LTIwVDAwOjAwOjAwLjAwMFpcIicmJnN0cmluZ2lmeShuZXcgRGF0ZSg4NjRlMTMpKT09J1wiKzI3NTc2MC0wOS0xM1QwMDowMDowMC4wMDBaXCInJiZzdHJpbmdpZnkobmV3IERhdGUoLTYyMTk4NzU1MmU1KSk9PSdcIi0wMDAwMDEtMDEtMDFUMDA6MDA6MDAuMDAwWlwiJyYmc3RyaW5naWZ5KG5ldyBEYXRlKC0xKSk9PSdcIjE5NjktMTItMzFUMjM6NTk6NTkuOTk5WlwiJ31jYXRjaChleGNlcHRpb24pe3N0cmluZ2lmeVN1cHBvcnRlZD1mYWxzZX19aXNTdXBwb3J0ZWQ9c3RyaW5naWZ5U3VwcG9ydGVkfWlmKG5hbWU9PVwianNvbi1wYXJzZVwiKXt2YXIgcGFyc2U9SlNPTjMucGFyc2U7aWYodHlwZW9mIHBhcnNlPT1cImZ1bmN0aW9uXCIpe3RyeXtpZihwYXJzZShcIjBcIik9PT0wJiYhcGFyc2UoZmFsc2UpKXt2YWx1ZT1wYXJzZShzZXJpYWxpemVkKTt2YXIgcGFyc2VTdXBwb3J0ZWQ9dmFsdWVbXCJhXCJdLmxlbmd0aD09NSYmdmFsdWVbXCJhXCJdWzBdPT09MTtpZihwYXJzZVN1cHBvcnRlZCl7dHJ5e3BhcnNlU3VwcG9ydGVkPSFwYXJzZSgnXCJcdFwiJyl9Y2F0Y2goZXhjZXB0aW9uKXt9aWYocGFyc2VTdXBwb3J0ZWQpe3RyeXtwYXJzZVN1cHBvcnRlZD1wYXJzZShcIjAxXCIpIT09MX1jYXRjaChleGNlcHRpb24pe319aWYocGFyc2VTdXBwb3J0ZWQpe3RyeXtwYXJzZVN1cHBvcnRlZD1wYXJzZShcIjEuXCIpIT09MX1jYXRjaChleGNlcHRpb24pe319fX19Y2F0Y2goZXhjZXB0aW9uKXtwYXJzZVN1cHBvcnRlZD1mYWxzZX19aXNTdXBwb3J0ZWQ9cGFyc2VTdXBwb3J0ZWR9fXJldHVybiBoYXNbbmFtZV09ISFpc1N1cHBvcnRlZH1pZighaGFzKFwianNvblwiKSl7dmFyIGZ1bmN0aW9uQ2xhc3M9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiO3ZhciBkYXRlQ2xhc3M9XCJbb2JqZWN0IERhdGVdXCI7dmFyIG51bWJlckNsYXNzPVwiW29iamVjdCBOdW1iZXJdXCI7dmFyIHN0cmluZ0NsYXNzPVwiW29iamVjdCBTdHJpbmddXCI7dmFyIGFycmF5Q2xhc3M9XCJbb2JqZWN0IEFycmF5XVwiO3ZhciBib29sZWFuQ2xhc3M9XCJbb2JqZWN0IEJvb2xlYW5dXCI7dmFyIGNoYXJJbmRleEJ1Z2d5PWhhcyhcImJ1Zy1zdHJpbmctY2hhci1pbmRleFwiKTtpZighaXNFeHRlbmRlZCl7dmFyIGZsb29yPU1hdGguZmxvb3I7dmFyIE1vbnRocz1bMCwzMSw1OSw5MCwxMjAsMTUxLDE4MSwyMTIsMjQzLDI3MywzMDQsMzM0XTt2YXIgZ2V0RGF5PWZ1bmN0aW9uKHllYXIsbW9udGgpe3JldHVybiBNb250aHNbbW9udGhdKzM2NSooeWVhci0xOTcwKStmbG9vcigoeWVhci0xOTY5Kyhtb250aD0rKG1vbnRoPjEpKSkvNCktZmxvb3IoKHllYXItMTkwMSttb250aCkvMTAwKStmbG9vcigoeWVhci0xNjAxK21vbnRoKS80MDApfX1pZighKGlzUHJvcGVydHk9e30uaGFzT3duUHJvcGVydHkpKXtpc1Byb3BlcnR5PWZ1bmN0aW9uKHByb3BlcnR5KXt2YXIgbWVtYmVycz17fSxjb25zdHJ1Y3RvcjtpZigobWVtYmVycy5fX3Byb3RvX189bnVsbCxtZW1iZXJzLl9fcHJvdG9fXz17dG9TdHJpbmc6MX0sbWVtYmVycykudG9TdHJpbmchPWdldENsYXNzKXtpc1Byb3BlcnR5PWZ1bmN0aW9uKHByb3BlcnR5KXt2YXIgb3JpZ2luYWw9dGhpcy5fX3Byb3RvX18scmVzdWx0PXByb3BlcnR5IGluKHRoaXMuX19wcm90b19fPW51bGwsdGhpcyk7dGhpcy5fX3Byb3RvX189b3JpZ2luYWw7cmV0dXJuIHJlc3VsdH19ZWxzZXtjb25zdHJ1Y3Rvcj1tZW1iZXJzLmNvbnN0cnVjdG9yO2lzUHJvcGVydHk9ZnVuY3Rpb24ocHJvcGVydHkpe3ZhciBwYXJlbnQ9KHRoaXMuY29uc3RydWN0b3J8fGNvbnN0cnVjdG9yKS5wcm90b3R5cGU7cmV0dXJuIHByb3BlcnR5IGluIHRoaXMmJiEocHJvcGVydHkgaW4gcGFyZW50JiZ0aGlzW3Byb3BlcnR5XT09PXBhcmVudFtwcm9wZXJ0eV0pfX1tZW1iZXJzPW51bGw7cmV0dXJuIGlzUHJvcGVydHkuY2FsbCh0aGlzLHByb3BlcnR5KX19dmFyIFByaW1pdGl2ZVR5cGVzPXtcImJvb2xlYW5cIjoxLG51bWJlcjoxLHN0cmluZzoxLHVuZGVmaW5lZDoxfTt2YXIgaXNIb3N0VHlwZT1mdW5jdGlvbihvYmplY3QscHJvcGVydHkpe3ZhciB0eXBlPXR5cGVvZiBvYmplY3RbcHJvcGVydHldO3JldHVybiB0eXBlPT1cIm9iamVjdFwiPyEhb2JqZWN0W3Byb3BlcnR5XTohUHJpbWl0aXZlVHlwZXNbdHlwZV19O2ZvckVhY2g9ZnVuY3Rpb24ob2JqZWN0LGNhbGxiYWNrKXt2YXIgc2l6ZT0wLFByb3BlcnRpZXMsbWVtYmVycyxwcm9wZXJ0eTsoUHJvcGVydGllcz1mdW5jdGlvbigpe3RoaXMudmFsdWVPZj0wfSkucHJvdG90eXBlLnZhbHVlT2Y9MDttZW1iZXJzPW5ldyBQcm9wZXJ0aWVzO2Zvcihwcm9wZXJ0eSBpbiBtZW1iZXJzKXtpZihpc1Byb3BlcnR5LmNhbGwobWVtYmVycyxwcm9wZXJ0eSkpe3NpemUrK319UHJvcGVydGllcz1tZW1iZXJzPW51bGw7aWYoIXNpemUpe21lbWJlcnM9W1widmFsdWVPZlwiLFwidG9TdHJpbmdcIixcInRvTG9jYWxlU3RyaW5nXCIsXCJwcm9wZXJ0eUlzRW51bWVyYWJsZVwiLFwiaXNQcm90b3R5cGVPZlwiLFwiaGFzT3duUHJvcGVydHlcIixcImNvbnN0cnVjdG9yXCJdO2ZvckVhY2g9ZnVuY3Rpb24ob2JqZWN0LGNhbGxiYWNrKXt2YXIgaXNGdW5jdGlvbj1nZXRDbGFzcy5jYWxsKG9iamVjdCk9PWZ1bmN0aW9uQ2xhc3MscHJvcGVydHksbGVuZ3RoO3ZhciBoYXNQcm9wZXJ0eT0haXNGdW5jdGlvbiYmdHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciE9XCJmdW5jdGlvblwiJiZpc0hvc3RUeXBlKG9iamVjdCxcImhhc093blByb3BlcnR5XCIpP29iamVjdC5oYXNPd25Qcm9wZXJ0eTppc1Byb3BlcnR5O2Zvcihwcm9wZXJ0eSBpbiBvYmplY3Qpe2lmKCEoaXNGdW5jdGlvbiYmcHJvcGVydHk9PVwicHJvdG90eXBlXCIpJiZoYXNQcm9wZXJ0eS5jYWxsKG9iamVjdCxwcm9wZXJ0eSkpe2NhbGxiYWNrKHByb3BlcnR5KX19Zm9yKGxlbmd0aD1tZW1iZXJzLmxlbmd0aDtwcm9wZXJ0eT1tZW1iZXJzWy0tbGVuZ3RoXTtoYXNQcm9wZXJ0eS5jYWxsKG9iamVjdCxwcm9wZXJ0eSkmJmNhbGxiYWNrKHByb3BlcnR5KSk7fX1lbHNlIGlmKHNpemU9PTIpe2ZvckVhY2g9ZnVuY3Rpb24ob2JqZWN0LGNhbGxiYWNrKXt2YXIgbWVtYmVycz17fSxpc0Z1bmN0aW9uPWdldENsYXNzLmNhbGwob2JqZWN0KT09ZnVuY3Rpb25DbGFzcyxwcm9wZXJ0eTtmb3IocHJvcGVydHkgaW4gb2JqZWN0KXtpZighKGlzRnVuY3Rpb24mJnByb3BlcnR5PT1cInByb3RvdHlwZVwiKSYmIWlzUHJvcGVydHkuY2FsbChtZW1iZXJzLHByb3BlcnR5KSYmKG1lbWJlcnNbcHJvcGVydHldPTEpJiZpc1Byb3BlcnR5LmNhbGwob2JqZWN0LHByb3BlcnR5KSl7Y2FsbGJhY2socHJvcGVydHkpfX19fWVsc2V7Zm9yRWFjaD1mdW5jdGlvbihvYmplY3QsY2FsbGJhY2spe3ZhciBpc0Z1bmN0aW9uPWdldENsYXNzLmNhbGwob2JqZWN0KT09ZnVuY3Rpb25DbGFzcyxwcm9wZXJ0eSxpc0NvbnN0cnVjdG9yO2Zvcihwcm9wZXJ0eSBpbiBvYmplY3Qpe2lmKCEoaXNGdW5jdGlvbiYmcHJvcGVydHk9PVwicHJvdG90eXBlXCIpJiZpc1Byb3BlcnR5LmNhbGwob2JqZWN0LHByb3BlcnR5KSYmIShpc0NvbnN0cnVjdG9yPXByb3BlcnR5PT09XCJjb25zdHJ1Y3RvclwiKSl7Y2FsbGJhY2socHJvcGVydHkpfX1pZihpc0NvbnN0cnVjdG9yfHxpc1Byb3BlcnR5LmNhbGwob2JqZWN0LHByb3BlcnR5PVwiY29uc3RydWN0b3JcIikpe2NhbGxiYWNrKHByb3BlcnR5KX19fXJldHVybiBmb3JFYWNoKG9iamVjdCxjYWxsYmFjayl9O2lmKCFoYXMoXCJqc29uLXN0cmluZ2lmeVwiKSl7dmFyIEVzY2FwZXM9ezkyOlwiXFxcXFxcXFxcIiwzNDonXFxcXFwiJyw4OlwiXFxcXGJcIiwxMjpcIlxcXFxmXCIsMTA6XCJcXFxcblwiLDEzOlwiXFxcXHJcIiw5OlwiXFxcXHRcIn07dmFyIGxlYWRpbmdaZXJvZXM9XCIwMDAwMDBcIjt2YXIgdG9QYWRkZWRTdHJpbmc9ZnVuY3Rpb24od2lkdGgsdmFsdWUpe3JldHVybihsZWFkaW5nWmVyb2VzKyh2YWx1ZXx8MCkpLnNsaWNlKC13aWR0aCl9O3ZhciB1bmljb2RlUHJlZml4PVwiXFxcXHUwMFwiO3ZhciBxdW90ZT1mdW5jdGlvbih2YWx1ZSl7dmFyIHJlc3VsdD0nXCInLGluZGV4PTAsbGVuZ3RoPXZhbHVlLmxlbmd0aCxpc0xhcmdlPWxlbmd0aD4xMCYmY2hhckluZGV4QnVnZ3ksc3ltYm9scztpZihpc0xhcmdlKXtzeW1ib2xzPXZhbHVlLnNwbGl0KFwiXCIpfWZvcig7aW5kZXg8bGVuZ3RoO2luZGV4Kyspe3ZhciBjaGFyQ29kZT12YWx1ZS5jaGFyQ29kZUF0KGluZGV4KTtzd2l0Y2goY2hhckNvZGUpe2Nhc2UgODpjYXNlIDk6Y2FzZSAxMDpjYXNlIDEyOmNhc2UgMTM6Y2FzZSAzNDpjYXNlIDkyOnJlc3VsdCs9RXNjYXBlc1tjaGFyQ29kZV07YnJlYWs7ZGVmYXVsdDppZihjaGFyQ29kZTwzMil7cmVzdWx0Kz11bmljb2RlUHJlZml4K3RvUGFkZGVkU3RyaW5nKDIsY2hhckNvZGUudG9TdHJpbmcoMTYpKTticmVha31yZXN1bHQrPWlzTGFyZ2U/c3ltYm9sc1tpbmRleF06Y2hhckluZGV4QnVnZ3k/dmFsdWUuY2hhckF0KGluZGV4KTp2YWx1ZVtpbmRleF19fXJldHVybiByZXN1bHQrJ1wiJ307dmFyIHNlcmlhbGl6ZT1mdW5jdGlvbihwcm9wZXJ0eSxvYmplY3QsY2FsbGJhY2sscHJvcGVydGllcyx3aGl0ZXNwYWNlLGluZGVudGF0aW9uLHN0YWNrKXt2YXIgdmFsdWUsY2xhc3NOYW1lLHllYXIsbW9udGgsZGF0ZSx0aW1lLGhvdXJzLG1pbnV0ZXMsc2Vjb25kcyxtaWxsaXNlY29uZHMscmVzdWx0cyxlbGVtZW50LGluZGV4LGxlbmd0aCxwcmVmaXgscmVzdWx0O3RyeXt2YWx1ZT1vYmplY3RbcHJvcGVydHldfWNhdGNoKGV4Y2VwdGlvbil7fWlmKHR5cGVvZiB2YWx1ZT09XCJvYmplY3RcIiYmdmFsdWUpe2NsYXNzTmFtZT1nZXRDbGFzcy5jYWxsKHZhbHVlKTtpZihjbGFzc05hbWU9PWRhdGVDbGFzcyYmIWlzUHJvcGVydHkuY2FsbCh2YWx1ZSxcInRvSlNPTlwiKSl7aWYodmFsdWU+LTEvMCYmdmFsdWU8MS8wKXtpZihnZXREYXkpe2RhdGU9Zmxvb3IodmFsdWUvODY0ZTUpO2Zvcih5ZWFyPWZsb29yKGRhdGUvMzY1LjI0MjUpKzE5NzAtMTtnZXREYXkoeWVhcisxLDApPD1kYXRlO3llYXIrKyk7Zm9yKG1vbnRoPWZsb29yKChkYXRlLWdldERheSh5ZWFyLDApKS8zMC40Mik7Z2V0RGF5KHllYXIsbW9udGgrMSk8PWRhdGU7bW9udGgrKyk7ZGF0ZT0xK2RhdGUtZ2V0RGF5KHllYXIsbW9udGgpO3RpbWU9KHZhbHVlJTg2NGU1Kzg2NGU1KSU4NjRlNTtob3Vycz1mbG9vcih0aW1lLzM2ZTUpJTI0O21pbnV0ZXM9Zmxvb3IodGltZS82ZTQpJTYwO3NlY29uZHM9Zmxvb3IodGltZS8xZTMpJTYwO21pbGxpc2Vjb25kcz10aW1lJTFlM31lbHNle3llYXI9dmFsdWUuZ2V0VVRDRnVsbFllYXIoKTttb250aD12YWx1ZS5nZXRVVENNb250aCgpO2RhdGU9dmFsdWUuZ2V0VVRDRGF0ZSgpO2hvdXJzPXZhbHVlLmdldFVUQ0hvdXJzKCk7bWludXRlcz12YWx1ZS5nZXRVVENNaW51dGVzKCk7c2Vjb25kcz12YWx1ZS5nZXRVVENTZWNvbmRzKCk7bWlsbGlzZWNvbmRzPXZhbHVlLmdldFVUQ01pbGxpc2Vjb25kcygpfXZhbHVlPSh5ZWFyPD0wfHx5ZWFyPj0xZTQ/KHllYXI8MD9cIi1cIjpcIitcIikrdG9QYWRkZWRTdHJpbmcoNix5ZWFyPDA/LXllYXI6eWVhcik6dG9QYWRkZWRTdHJpbmcoNCx5ZWFyKSkrXCItXCIrdG9QYWRkZWRTdHJpbmcoMixtb250aCsxKStcIi1cIit0b1BhZGRlZFN0cmluZygyLGRhdGUpK1wiVFwiK3RvUGFkZGVkU3RyaW5nKDIsaG91cnMpK1wiOlwiK3RvUGFkZGVkU3RyaW5nKDIsbWludXRlcykrXCI6XCIrdG9QYWRkZWRTdHJpbmcoMixzZWNvbmRzKStcIi5cIit0b1BhZGRlZFN0cmluZygzLG1pbGxpc2Vjb25kcykrXCJaXCJ9ZWxzZXt2YWx1ZT1udWxsfX1lbHNlIGlmKHR5cGVvZiB2YWx1ZS50b0pTT049PVwiZnVuY3Rpb25cIiYmKGNsYXNzTmFtZSE9bnVtYmVyQ2xhc3MmJmNsYXNzTmFtZSE9c3RyaW5nQ2xhc3MmJmNsYXNzTmFtZSE9YXJyYXlDbGFzc3x8aXNQcm9wZXJ0eS5jYWxsKHZhbHVlLFwidG9KU09OXCIpKSl7dmFsdWU9dmFsdWUudG9KU09OKHByb3BlcnR5KX19aWYoY2FsbGJhY2spe3ZhbHVlPWNhbGxiYWNrLmNhbGwob2JqZWN0LHByb3BlcnR5LHZhbHVlKX1pZih2YWx1ZT09PW51bGwpe3JldHVyblwibnVsbFwifWNsYXNzTmFtZT1nZXRDbGFzcy5jYWxsKHZhbHVlKTtpZihjbGFzc05hbWU9PWJvb2xlYW5DbGFzcyl7cmV0dXJuXCJcIit2YWx1ZX1lbHNlIGlmKGNsYXNzTmFtZT09bnVtYmVyQ2xhc3Mpe3JldHVybiB2YWx1ZT4tMS8wJiZ2YWx1ZTwxLzA/XCJcIit2YWx1ZTpcIm51bGxcIn1lbHNlIGlmKGNsYXNzTmFtZT09c3RyaW5nQ2xhc3Mpe3JldHVybiBxdW90ZShcIlwiK3ZhbHVlKX1pZih0eXBlb2YgdmFsdWU9PVwib2JqZWN0XCIpe2ZvcihsZW5ndGg9c3RhY2subGVuZ3RoO2xlbmd0aC0tOyl7aWYoc3RhY2tbbGVuZ3RoXT09PXZhbHVlKXt0aHJvdyBUeXBlRXJyb3IoKX19c3RhY2sucHVzaCh2YWx1ZSk7cmVzdWx0cz1bXTtwcmVmaXg9aW5kZW50YXRpb247aW5kZW50YXRpb24rPXdoaXRlc3BhY2U7aWYoY2xhc3NOYW1lPT1hcnJheUNsYXNzKXtmb3IoaW5kZXg9MCxsZW5ndGg9dmFsdWUubGVuZ3RoO2luZGV4PGxlbmd0aDtpbmRleCsrKXtlbGVtZW50PXNlcmlhbGl6ZShpbmRleCx2YWx1ZSxjYWxsYmFjayxwcm9wZXJ0aWVzLHdoaXRlc3BhY2UsaW5kZW50YXRpb24sc3RhY2spO3Jlc3VsdHMucHVzaChlbGVtZW50PT09dW5kZWY/XCJudWxsXCI6ZWxlbWVudCl9cmVzdWx0PXJlc3VsdHMubGVuZ3RoP3doaXRlc3BhY2U/XCJbXFxuXCIraW5kZW50YXRpb24rcmVzdWx0cy5qb2luKFwiLFxcblwiK2luZGVudGF0aW9uKStcIlxcblwiK3ByZWZpeCtcIl1cIjpcIltcIityZXN1bHRzLmpvaW4oXCIsXCIpK1wiXVwiOlwiW11cIn1lbHNle2ZvckVhY2gocHJvcGVydGllc3x8dmFsdWUsZnVuY3Rpb24ocHJvcGVydHkpe3ZhciBlbGVtZW50PXNlcmlhbGl6ZShwcm9wZXJ0eSx2YWx1ZSxjYWxsYmFjayxwcm9wZXJ0aWVzLHdoaXRlc3BhY2UsaW5kZW50YXRpb24sc3RhY2spO2lmKGVsZW1lbnQhPT11bmRlZil7cmVzdWx0cy5wdXNoKHF1b3RlKHByb3BlcnR5KStcIjpcIisod2hpdGVzcGFjZT9cIiBcIjpcIlwiKStlbGVtZW50KX19KTtyZXN1bHQ9cmVzdWx0cy5sZW5ndGg/d2hpdGVzcGFjZT9cIntcXG5cIitpbmRlbnRhdGlvbityZXN1bHRzLmpvaW4oXCIsXFxuXCIraW5kZW50YXRpb24pK1wiXFxuXCIrcHJlZml4K1wifVwiOlwie1wiK3Jlc3VsdHMuam9pbihcIixcIikrXCJ9XCI6XCJ7fVwifXN0YWNrLnBvcCgpO3JldHVybiByZXN1bHR9fTtKU09OMy5zdHJpbmdpZnk9ZnVuY3Rpb24oc291cmNlLGZpbHRlcix3aWR0aCl7dmFyIHdoaXRlc3BhY2UsY2FsbGJhY2sscHJvcGVydGllcyxjbGFzc05hbWU7aWYodHlwZW9mIGZpbHRlcj09XCJmdW5jdGlvblwifHx0eXBlb2YgZmlsdGVyPT1cIm9iamVjdFwiJiZmaWx0ZXIpe2lmKChjbGFzc05hbWU9Z2V0Q2xhc3MuY2FsbChmaWx0ZXIpKT09ZnVuY3Rpb25DbGFzcyl7Y2FsbGJhY2s9ZmlsdGVyfWVsc2UgaWYoY2xhc3NOYW1lPT1hcnJheUNsYXNzKXtwcm9wZXJ0aWVzPXt9O2Zvcih2YXIgaW5kZXg9MCxsZW5ndGg9ZmlsdGVyLmxlbmd0aCx2YWx1ZTtpbmRleDxsZW5ndGg7dmFsdWU9ZmlsdGVyW2luZGV4KytdLChjbGFzc05hbWU9Z2V0Q2xhc3MuY2FsbCh2YWx1ZSksY2xhc3NOYW1lPT1zdHJpbmdDbGFzc3x8Y2xhc3NOYW1lPT1udW1iZXJDbGFzcykmJihwcm9wZXJ0aWVzW3ZhbHVlXT0xKSk7fX1pZih3aWR0aCl7aWYoKGNsYXNzTmFtZT1nZXRDbGFzcy5jYWxsKHdpZHRoKSk9PW51bWJlckNsYXNzKXtpZigod2lkdGgtPXdpZHRoJTEpPjApe2Zvcih3aGl0ZXNwYWNlPVwiXCIsd2lkdGg+MTAmJih3aWR0aD0xMCk7d2hpdGVzcGFjZS5sZW5ndGg8d2lkdGg7d2hpdGVzcGFjZSs9XCIgXCIpO319ZWxzZSBpZihjbGFzc05hbWU9PXN0cmluZ0NsYXNzKXt3aGl0ZXNwYWNlPXdpZHRoLmxlbmd0aDw9MTA/d2lkdGg6d2lkdGguc2xpY2UoMCwxMCl9fXJldHVybiBzZXJpYWxpemUoXCJcIiwodmFsdWU9e30sdmFsdWVbXCJcIl09c291cmNlLHZhbHVlKSxjYWxsYmFjayxwcm9wZXJ0aWVzLHdoaXRlc3BhY2UsXCJcIixbXSl9fWlmKCFoYXMoXCJqc29uLXBhcnNlXCIpKXt2YXIgZnJvbUNoYXJDb2RlPVN0cmluZy5mcm9tQ2hhckNvZGU7dmFyIFVuZXNjYXBlcz17OTI6XCJcXFxcXCIsMzQ6J1wiJyw0NzpcIi9cIiw5ODpcIlxcYlwiLDExNjpcIlx0XCIsMTEwOlwiXFxuXCIsMTAyOlwiXFxmXCIsMTE0OlwiXFxyXCJ9O3ZhciBJbmRleCxTb3VyY2U7dmFyIGFib3J0PWZ1bmN0aW9uKCl7SW5kZXg9U291cmNlPW51bGw7dGhyb3cgU3ludGF4RXJyb3IoKX07dmFyIGxleD1mdW5jdGlvbigpe3ZhciBzb3VyY2U9U291cmNlLGxlbmd0aD1zb3VyY2UubGVuZ3RoLHZhbHVlLGJlZ2luLHBvc2l0aW9uLGlzU2lnbmVkLGNoYXJDb2RlO3doaWxlKEluZGV4PGxlbmd0aCl7Y2hhckNvZGU9c291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO3N3aXRjaChjaGFyQ29kZSl7Y2FzZSA5OmNhc2UgMTA6Y2FzZSAxMzpjYXNlIDMyOkluZGV4Kys7YnJlYWs7Y2FzZSAxMjM6Y2FzZSAxMjU6Y2FzZSA5MTpjYXNlIDkzOmNhc2UgNTg6Y2FzZSA0NDp2YWx1ZT1jaGFySW5kZXhCdWdneT9zb3VyY2UuY2hhckF0KEluZGV4KTpzb3VyY2VbSW5kZXhdO0luZGV4Kys7cmV0dXJuIHZhbHVlO2Nhc2UgMzQ6Zm9yKHZhbHVlPVwiQFwiLEluZGV4Kys7SW5kZXg8bGVuZ3RoOyl7Y2hhckNvZGU9c291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO2lmKGNoYXJDb2RlPDMyKXthYm9ydCgpfWVsc2UgaWYoY2hhckNvZGU9PTkyKXtjaGFyQ29kZT1zb3VyY2UuY2hhckNvZGVBdCgrK0luZGV4KTtzd2l0Y2goY2hhckNvZGUpe2Nhc2UgOTI6Y2FzZSAzNDpjYXNlIDQ3OmNhc2UgOTg6Y2FzZSAxMTY6Y2FzZSAxMTA6Y2FzZSAxMDI6Y2FzZSAxMTQ6dmFsdWUrPVVuZXNjYXBlc1tjaGFyQ29kZV07SW5kZXgrKzticmVhaztjYXNlIDExNzpiZWdpbj0rK0luZGV4O2Zvcihwb3NpdGlvbj1JbmRleCs0O0luZGV4PHBvc2l0aW9uO0luZGV4Kyspe2NoYXJDb2RlPXNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KTtpZighKGNoYXJDb2RlPj00OCYmY2hhckNvZGU8PTU3fHxjaGFyQ29kZT49OTcmJmNoYXJDb2RlPD0xMDJ8fGNoYXJDb2RlPj02NSYmY2hhckNvZGU8PTcwKSl7YWJvcnQoKX19dmFsdWUrPWZyb21DaGFyQ29kZShcIjB4XCIrc291cmNlLnNsaWNlKGJlZ2luLEluZGV4KSk7YnJlYWs7ZGVmYXVsdDphYm9ydCgpfX1lbHNle2lmKGNoYXJDb2RlPT0zNCl7YnJlYWt9Y2hhckNvZGU9c291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO2JlZ2luPUluZGV4O3doaWxlKGNoYXJDb2RlPj0zMiYmY2hhckNvZGUhPTkyJiZjaGFyQ29kZSE9MzQpe2NoYXJDb2RlPXNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpfXZhbHVlKz1zb3VyY2Uuc2xpY2UoYmVnaW4sSW5kZXgpfX1pZihzb3VyY2UuY2hhckNvZGVBdChJbmRleCk9PTM0KXtJbmRleCsrO3JldHVybiB2YWx1ZX1hYm9ydCgpO2RlZmF1bHQ6YmVnaW49SW5kZXg7aWYoY2hhckNvZGU9PTQ1KXtpc1NpZ25lZD10cnVlO2NoYXJDb2RlPXNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpfWlmKGNoYXJDb2RlPj00OCYmY2hhckNvZGU8PTU3KXtpZihjaGFyQ29kZT09NDgmJihjaGFyQ29kZT1zb3VyY2UuY2hhckNvZGVBdChJbmRleCsxKSxjaGFyQ29kZT49NDgmJmNoYXJDb2RlPD01Nykpe2Fib3J0KCl9aXNTaWduZWQ9ZmFsc2U7Zm9yKDtJbmRleDxsZW5ndGgmJihjaGFyQ29kZT1zb3VyY2UuY2hhckNvZGVBdChJbmRleCksY2hhckNvZGU+PTQ4JiZjaGFyQ29kZTw9NTcpO0luZGV4KyspO2lmKHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KT09NDYpe3Bvc2l0aW9uPSsrSW5kZXg7Zm9yKDtwb3NpdGlvbjxsZW5ndGgmJihjaGFyQ29kZT1zb3VyY2UuY2hhckNvZGVBdChwb3NpdGlvbiksY2hhckNvZGU+PTQ4JiZjaGFyQ29kZTw9NTcpO3Bvc2l0aW9uKyspO2lmKHBvc2l0aW9uPT1JbmRleCl7YWJvcnQoKX1JbmRleD1wb3NpdGlvbn1jaGFyQ29kZT1zb3VyY2UuY2hhckNvZGVBdChJbmRleCk7aWYoY2hhckNvZGU9PTEwMXx8Y2hhckNvZGU9PTY5KXtjaGFyQ29kZT1zb3VyY2UuY2hhckNvZGVBdCgrK0luZGV4KTtpZihjaGFyQ29kZT09NDN8fGNoYXJDb2RlPT00NSl7SW5kZXgrK31mb3IocG9zaXRpb249SW5kZXg7cG9zaXRpb248bGVuZ3RoJiYoY2hhckNvZGU9c291cmNlLmNoYXJDb2RlQXQocG9zaXRpb24pLGNoYXJDb2RlPj00OCYmY2hhckNvZGU8PTU3KTtwb3NpdGlvbisrKTtpZihwb3NpdGlvbj09SW5kZXgpe2Fib3J0KCl9SW5kZXg9cG9zaXRpb259cmV0dXJuK3NvdXJjZS5zbGljZShiZWdpbixJbmRleCl9aWYoaXNTaWduZWQpe2Fib3J0KCl9aWYoc291cmNlLnNsaWNlKEluZGV4LEluZGV4KzQpPT1cInRydWVcIil7SW5kZXgrPTQ7cmV0dXJuIHRydWV9ZWxzZSBpZihzb3VyY2Uuc2xpY2UoSW5kZXgsSW5kZXgrNSk9PVwiZmFsc2VcIil7SW5kZXgrPTU7cmV0dXJuIGZhbHNlfWVsc2UgaWYoc291cmNlLnNsaWNlKEluZGV4LEluZGV4KzQpPT1cIm51bGxcIil7SW5kZXgrPTQ7cmV0dXJuIG51bGx9YWJvcnQoKX19cmV0dXJuXCIkXCJ9O3ZhciBnZXQ9ZnVuY3Rpb24odmFsdWUpe3ZhciByZXN1bHRzLGhhc01lbWJlcnM7aWYodmFsdWU9PVwiJFwiKXthYm9ydCgpfWlmKHR5cGVvZiB2YWx1ZT09XCJzdHJpbmdcIil7aWYoKGNoYXJJbmRleEJ1Z2d5P3ZhbHVlLmNoYXJBdCgwKTp2YWx1ZVswXSk9PVwiQFwiKXtyZXR1cm4gdmFsdWUuc2xpY2UoMSl9aWYodmFsdWU9PVwiW1wiKXtyZXN1bHRzPVtdO2Zvcig7O2hhc01lbWJlcnN8fChoYXNNZW1iZXJzPXRydWUpKXt2YWx1ZT1sZXgoKTtpZih2YWx1ZT09XCJdXCIpe2JyZWFrfWlmKGhhc01lbWJlcnMpe2lmKHZhbHVlPT1cIixcIil7dmFsdWU9bGV4KCk7aWYodmFsdWU9PVwiXVwiKXthYm9ydCgpfX1lbHNle2Fib3J0KCl9fWlmKHZhbHVlPT1cIixcIil7YWJvcnQoKX1yZXN1bHRzLnB1c2goZ2V0KHZhbHVlKSl9cmV0dXJuIHJlc3VsdHN9ZWxzZSBpZih2YWx1ZT09XCJ7XCIpe3Jlc3VsdHM9e307Zm9yKDs7aGFzTWVtYmVyc3x8KGhhc01lbWJlcnM9dHJ1ZSkpe3ZhbHVlPWxleCgpO2lmKHZhbHVlPT1cIn1cIil7YnJlYWt9aWYoaGFzTWVtYmVycyl7aWYodmFsdWU9PVwiLFwiKXt2YWx1ZT1sZXgoKTtpZih2YWx1ZT09XCJ9XCIpe2Fib3J0KCl9fWVsc2V7YWJvcnQoKX19aWYodmFsdWU9PVwiLFwifHx0eXBlb2YgdmFsdWUhPVwic3RyaW5nXCJ8fChjaGFySW5kZXhCdWdneT92YWx1ZS5jaGFyQXQoMCk6dmFsdWVbMF0pIT1cIkBcInx8bGV4KCkhPVwiOlwiKXthYm9ydCgpfXJlc3VsdHNbdmFsdWUuc2xpY2UoMSldPWdldChsZXgoKSl9cmV0dXJuIHJlc3VsdHN9YWJvcnQoKX1yZXR1cm4gdmFsdWV9O3ZhciB1cGRhdGU9ZnVuY3Rpb24oc291cmNlLHByb3BlcnR5LGNhbGxiYWNrKXt2YXIgZWxlbWVudD13YWxrKHNvdXJjZSxwcm9wZXJ0eSxjYWxsYmFjayk7aWYoZWxlbWVudD09PXVuZGVmKXtkZWxldGUgc291cmNlW3Byb3BlcnR5XX1lbHNle3NvdXJjZVtwcm9wZXJ0eV09ZWxlbWVudH19O3ZhciB3YWxrPWZ1bmN0aW9uKHNvdXJjZSxwcm9wZXJ0eSxjYWxsYmFjayl7dmFyIHZhbHVlPXNvdXJjZVtwcm9wZXJ0eV0sbGVuZ3RoO2lmKHR5cGVvZiB2YWx1ZT09XCJvYmplY3RcIiYmdmFsdWUpe2lmKGdldENsYXNzLmNhbGwodmFsdWUpPT1hcnJheUNsYXNzKXtmb3IobGVuZ3RoPXZhbHVlLmxlbmd0aDtsZW5ndGgtLTspe3VwZGF0ZSh2YWx1ZSxsZW5ndGgsY2FsbGJhY2spfX1lbHNle2ZvckVhY2godmFsdWUsZnVuY3Rpb24ocHJvcGVydHkpe3VwZGF0ZSh2YWx1ZSxwcm9wZXJ0eSxjYWxsYmFjayl9KX19cmV0dXJuIGNhbGxiYWNrLmNhbGwoc291cmNlLHByb3BlcnR5LHZhbHVlKX07SlNPTjMucGFyc2U9ZnVuY3Rpb24oc291cmNlLGNhbGxiYWNrKXt2YXIgcmVzdWx0LHZhbHVlO0luZGV4PTA7U291cmNlPVwiXCIrc291cmNlO3Jlc3VsdD1nZXQobGV4KCkpO2lmKGxleCgpIT1cIiRcIil7YWJvcnQoKX1JbmRleD1Tb3VyY2U9bnVsbDtyZXR1cm4gY2FsbGJhY2smJmdldENsYXNzLmNhbGwoY2FsbGJhY2spPT1mdW5jdGlvbkNsYXNzP3dhbGsoKHZhbHVlPXt9LHZhbHVlW1wiXCJdPXJlc3VsdCx2YWx1ZSksXCJcIixjYWxsYmFjayk6cmVzdWx0fX19aWYoaXNMb2FkZXIpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBKU09OM30pfX0pKHRoaXMpfSx7fV0sNTA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXRvQXJyYXk7ZnVuY3Rpb24gdG9BcnJheShsaXN0LGluZGV4KXt2YXIgYXJyYXk9W107aW5kZXg9aW5kZXh8fDA7Zm9yKHZhciBpPWluZGV4fHwwO2k8bGlzdC5sZW5ndGg7aSsrKXthcnJheVtpLWluZGV4XT1saXN0W2ldfXJldHVybiBhcnJheX19LHt9XX0se30sWzFdKSgxKX0pOyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgaW8gPSByZXF1aXJlKCcuLi9saWIvc29ja2V0LmlvJylcblxuYW5ndWxhci5tb2R1bGUoXCJEYXNoYm9hcmRcIilcbi5mYWN0b3J5KFwiQWN0aXZpdGllc1wiLCBbJyRodHRwJywgJyRzY2UnLCAgXG4gIGZ1bmN0aW9uIEFjdGl2aXRpZXNGYWN0b3J5ICgkaHR0cCwgJHNjZSkge1xuXG4gICAgdmFyIHNlbGYgPSB7fVxuICAgIHNlbGYuYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYWN0aXZpdGllcy8nKVxuICAgIH1cbiAgICBzZWxmLnN0b3AgPSBmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hY3Rpdml0aWVzLycgKyBhcHApXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoYXBwICsgXCIgc3VjY2VzZnVsbHkgc3RvcHBlZFwiKVxuICAgICAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFwcClcbiAgICAgICAgaWNvbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGljb24pXG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cykge1xuICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YSwgJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCB3aGVuIHN0b3BwaW5nIHRoZSBhcHAnKVxuICAgICAgICBjb25zb2xlLmVycm9yKF9fZmlsZW5hbWUgKyAnIEDCoHNlbGYuc3RvcCgpJylcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHNlbGYub3BlbiA9IGZ1bmN0aW9uKHNjb3BlLCBhcHApIHtcbiAgICAgICRodHRwLmdldCgnL2FwcHMvJyArIGFwcCArICcvcG9ydCcpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0dFVCAvYXBwcy8nICsgYXBwICsgJy9wb3J0IC0+JyArIGRhdGEpXG4gICAgICAgIHNjb3BlLnVybCA9ICdodHRwOi8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgJzonICsgZGF0YVxuICAgICAgICBzY29wZS5ocmVmID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc2NvcGUudXJsKVxuICAgICAgfSkuXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGRhdGEpXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvXCIpXG4gICAgICB9KVxuICAgIH1cbiAgICBzZWxmLmxhdW5jaCA9IGZ1bmN0aW9uKHNjb3BlLCBhcHApIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYWN0aXZpdGllcy8nICsgYXBwKS5cbiAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgaWYgKGRhdGEucG9ydCkge1xuICAgICAgICAgIHNjb3BlLmhyZWYgPSAnaHR0cDovLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICc6JyArIGRhdGEucG9ydFxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAvLyBGb3JjZSBuZXcgY29ubmVjdGlvbiBhZnRlciBkaXNjb25uZWN0IHRvXG4gICAgICAvLyByZXN0YXJ0IGFwcFxuICAgICAgdmFyIHdzXG4gICAgICB3cyA9IGlvLmNvbm5lY3QoJy8nICsgYXBwLCB7J2ZvcmNlTmV3JzogdHJ1ZX0pXG4gICAgICAub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3cy8lczogc2VydmVyIGZldGNoZWQuJywgYXBwKVxuICAgICAgfSlcbiAgICAgIC5vbignc3Rkb3V0JywgZnVuY3Rpb24gKHN0ZG91dCkge1xuICAgICAgICB0b2FzdHIuaW5mbyhzdGRvdXQsIGFwcClcbiAgICAgICAgY29uc29sZS5sb2coJ3dzLyVzL3N0ZG91dDogJXMnLCBhcHAsIHN0ZG91dClcbiAgICAgIH0pXG4gICAgICAub24oJ3N0ZGVycicsIGZ1bmN0aW9uIChzdGRlcnIpIHtcbiAgICAgICAgdG9hc3RyLmVycm9yKHN0ZGVyciwgYXBwKVxuICAgICAgICBjb25zb2xlLmxvZygnd3MvJXMvc3RkZXJyOiAlcycsIGFwcCwgc3RkZXJyKVxuICAgICAgfSlcbiAgICAgIC5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3dzLyVzL2Nsb3NlIScsIGFwcClcbiAgICAgICAgd3MuY2xvc2UoKS5kaXNjb25uZWN0KClcbiAgICAgIH0pXG4gICAgICAub24oJ3JlYWR5JywgZnVuY3Rpb24gKHBvcnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3dzLyVzL3JlYWR5IScpXG4gICAgICAgIHNjb3BlLmhyZWYgPSAnaHR0cDovLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICc6JyArIHBvcnRcbiAgICAgIH0pXG5cbiAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgdG9hc3RyLmVycm9yKCdEYXNoYm9hcmQnLCBkYXRhKVxuICAgICAgY29uc29sZS5sb2coc3RhdHVzICsgJyB3aGVuIFBVVCAvbGF1bmNoLycgKyBhcHAgKyAnIC0+ICcgKyBkYXRhKVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gc2VsZlxufV0pIiwiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXIubW9kdWxlKFwiRGFzaGJvYXJkXCIpXG4uZmFjdG9yeShcIkFwcHNcIiwgWyckaHR0cCcsICckc2NlJywgJyRsb2NhdGlvbicsICBcbiAgZnVuY3Rpb24gQWN0aXZpdGllc0ZhY3RvcnkgKCRodHRwLCAkc2NlLCAkbG9jYXRpb24pIHtcblxuICAgIHZhciBzZWxmID0ge31cbiAgICBzZWxmLmdldCA9IGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwcHMvJyArIGFwcCkuZXJyb3IoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnRvU3RyaW5nKCkpICBcbiAgICAgICAgdG9hc3RyLmVycm9yKGRhdGEudG9TdHJpbmcoKSlcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKVxuICAgICAgfSlcbiAgICB9XG4gICAgc2VsZi5hbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZWxmLmdldCgnJylcbiAgICB9XG4gICAgc2VsZi5nZXRSZWFkbWUgPSBmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcHBzLycgKyBhcHAgKyAnL3JlYWRtZScpXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnRvU3RyaW5nKCkpICBcbiAgICAgICAgdG9hc3RyLmVycm9yKGRhdGEudG9TdHJpbmcoKSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHNlbGYucmVtb3ZlID0gZnVuY3Rpb24oYXBwKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBwcy8nICsgYXBwKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzKSB7XG4gICAgICAgIHRvYXN0ci5zdWNjZXNzKGFwcCArIFwiIHN1Y2Nlc2Z1bGx5IHJlbW92ZWRcIilcbiAgICAgICAgdmFyIGljb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhcHApXG4gICAgICAgIGljb24ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpY29uKVxuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzKSB7XG4gICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLCAnQW4gZXJyb3IgaGFzIG9jY3VycmVkIHdoZW4gcmVtb3ZpbmcgdGhlIGFwcCcpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoX19maWxlbmFtZSArICcgQMKgc2VsZi5yZW1vdmUoKScgKyBkYXRhKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZlxuICB9XSkiLCIndXNlIHN0cmljdCdcbnJlcXVpcmUoJy4vYWN0aXZpdGllcycpXG5yZXF1aXJlKCcuL2FwcHMnKSJdfQ==

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJidW5kbGUuanMiXSwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZVJvb3QiOiIuL3B1YmxpYy9kaXN0L2pzLyJ9