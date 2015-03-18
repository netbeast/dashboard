/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// See README for overview
//

'use strict';





window.onload = function () {
  PDFJS.workerSrc = '../js/src/worker_loader.js';


var url = "../presentation/presentation.pdf"
var numPages = 1;
var page = 1;
var downloadPrompt = false;

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
      var canvas = document.getElementById('show');
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
  var time;
  var timerOn;
  
  getPdfPage(page);
  socket.emit('new page', page);
  socket.on('sharing?', function() {
    socket.emit('sharing');
  });

function goLeft () {
  if (downloadPrompt == false) {
    if (page != 1) {
      page--;
      if (timerOn == 1){
        clearTimeout(time); 
      }
      timerOn = 1;
      time = setTimeout(function(){ 
        timerOn = 0;
        socket.emit('new page', page);
        getPdfPage(page);
       }, 500);
    }
  }
}

function goRight () {
  if (downloadPrompt == false) {
    if (page != numPages) {
      page++;
      if (timerOn == 1){
          clearTimeout(time); 
        }
      timerOn = 1;
      time = setTimeout(function(){
          timerOn = 0;      
          socket.emit('new page', page);
          getPdfPage(page);
         }, 500);
    } else {
      downloadPrompt = true;
      if(document.webkitFullscreenElement) {  
        document.webkitCancelFullScreen();  
      } 
      document.getElementById('title').style.marginLeft="19.3%";
      document.getElementById('download-button').style.display="block";
    }
  }
}

function makeFullScreen () {
  var elem = document.getElementById('show-frame');  

  // Are we full screen?
  if (document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement) {  
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

function keyHandler(e) {
  switch (e.keyCode) {
    case 39:
      goRight();
      break;
    case 37:
      goLeft();
      break;
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

function allowDownload () {
  socket.emit('download')
}

  document.getElementById('button-left').addEventListener("click", goLeft); 
  document.getElementById('button-right').addEventListener("click", goRight);
  document.getElementById('fs-button').addEventListener("click", makeFullScreen);
  document.getElementById('download-button').addEventListener("click", allowDownload);
  window.addEventListener("keydown", keyHandler, false);

}
