// Define error handling:
var error = {
	list : {
  		// Forbidden error list
  		errorMime : "Invalid file type. Must be a .tgz or tar.gz",
  		noPkgJson : "App does not have package.json file",
  		appExists : "App already exists",
  		noMainExe : "No valid 'main' field in package.json."
  	},
  	handle : function (code, response) {
  		console.log(error.list[code] || code);
  		response.status(403).json(error.list[code] || code);
  	}
  };

module.exports = error;