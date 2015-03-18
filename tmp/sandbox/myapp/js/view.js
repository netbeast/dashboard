/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
  
//
// See README for overview
//

'use strict';
  
window.onload = function () {
PDFJS.workerSrc = '../js/src/worker_loader.js';
var page = 1;
var url = "../presentation/presentation.pdf"
var numPages = 1;
var initialLoad = 0;
var oldPage = 0;
var newPage = 0;



function getPdfPage(number) {
    //
    // Fetch the PDF document from the URL using promises
    //
    PDFJS.getDocument(url).then(function(pdf) {
      numPages = pdf.numPages;
      // Using promise to fetch the page
      pdf.getPage(number).then(function(page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);
  
        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.getElementById('show-view');
        var context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        //
        // Render PDF page into canvas context
        //
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    });
  }

  var socket = io();
  socket.emit('page?');
  
  socket.on('new page', function(page){
    if (initialLoad==0) {
      var canvas = document.getElementById('show-view');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      if(page != null) {
          document.getElementById('show-view').style.display="inline";
        }
      setTimeout(function () {
        getPdfPage(page);
      }, 500);
      initialLoad = 1;

    } else {
      if(page != null) {
          document.getElementById('show-view').style.display="block";
        }
      newPage = page;
      getPdfPage(page);
    }
  });

  window.onfocus = function() { 
    setTimeout(function () {
      if (newPage!=oldPage) {
        getPdfPage(newPage);
        oldPage = newPage;
      }
    }, 500);    
  };

  window.onblur = function() {
    if (oldPage!=newPage) {
      var canvas = document.getElementById('show-view');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    } 
  }

  socket.on('download-yes', function(){
      document.getElementById('download-button-view').style.display="block";
      document.getElementById('share-button').style.marginRight="0.5%";
  });

  function shareCheck () {
    socket.emit('presentation?');
    socket.on('presentation', function(presentation) {
      if (presentation == 1)
        alert("A presentation is being shared!");
      else {
        window.location.assign("to_share.html");
      }
    });
  }

  function makeFullScreen () {
    var elem = document.getElementById('show-frame');  

    if(document.webkitFullscreenElement) {  
      document.webkitCancelFullScreen();  
    }  
    else {  
      elem.webkitRequestFullScreen();  
    }
  }
  
  function move_up() {
      document.getElementById('show-frame').scrollTop += 10;
  }
  
  function move_down() {
      document.getElementById('show-frame').scrollTop -= 10;
  }

  function onDownload(){
      window.open('../presentation/presentation.pdf');
  }
  
  function keyHandler(e) {
    switch (e.keyCode) {
      case 40:
        move_up();
        break;
      case 38:
        move_down();
        break;
      default:
        break;
    }
  }

  document.getElementById('share-button').addEventListener("click", shareCheck);  
  document.getElementById('fs-button').addEventListener("click", makeFullScreen);
  document.getElementById('download-button-view').addEventListener("click", onDownload);

  window.addEventListener("keydown", keyHandler, false);
}
