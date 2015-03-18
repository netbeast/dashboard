var express = require('express'),
	multer  = require('multer'),
	sys = require('sys'),
	exec = require('child_process').exec,
	app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

  var colors = require('colors'); // just to make a colourful prompt
  var argv = require('optimist').argv; // must-have package


var pag;
var presen = 0;
var timer = 0;

/* xbian apps need to accept the port to be launched by parameters */
port = argv.port;
 
if(isNaN(port)) {
  error = "Port \"" + port + "\" is not a number.";
  console.log(error.red);
  process.kill(1);
}

function puts(error, stdout, stderr) { sys.puts(stdout) }
//exec("unoconv -f pdf ./presentation/*.pptx", puts);
//exec("unoconv -f pdf ./presentation/*.ppt", puts);

app.use(express.static("./"));

app.use(
	multer(
		{ dest: './presentation/', 
		  rename: function (fieldname, filename) {
          	return filename.replace(filename, 'Presentation').toLowerCase();
  		  } ,
  		  onFileUploadComplete: function (file) {
 			console.log(file.fieldname + ' uploaded to  ' + file.path);
			console.log(file.extension);			

			if(file.extension == "ppt") {
				exec("unoconv -f pdf presentation/*.ppt", puts);
				exec("rm presentation/*.ppt", puts);	
			} else if(file.extension == "pptx") {
				exec("unoconv -f pdf presentation/*.pptx", puts);
				exec("rm presentation/*.pptx", puts);	
			}
		  }
		}
	)
)


app.post('/', function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    res.status(204).end()
});

io.on('connection', function(socket){
  socket.on('new page', function(page){
    io.emit('new page', page);
    pag = page;
  });
});

io.on('connection', function(socket){
  socket.on('page?', function(page){
    io.emit('new page', pag);
  });
});

io.on('connection', function(socket){
  socket.on('presentation?', function(presentation){
    io.emit('presentation', presen);
  });
});

function killPresentation () {
  presen = 0;
  exec("rm ./presentation/*", puts);
  pag = null;
}

io.on('connection', function(socket) {
  socket.on('close', function () {
    killPresentation();
  })
})

io.on('connection', function(socket) {
  socket.on('download', function () {
    io.emit('download-yes');
  })
})

io.on('connection', function(socket){
  socket.on('sharing', function(){
    presen = 1;
    clearTimeout(timer);
    timer = 0;
  });
});

setInterval(function() {
  io.emit('sharing?');
  if (!timer && presen != 0) {
    timer = setTimeout(function(){
      killPresentation();
    }, 10000);
  }
}, 8000);

http.listen(port, function(){
  success = "Listening on port " + port;
  console.log(success.green);
});
