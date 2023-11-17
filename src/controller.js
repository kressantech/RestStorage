//const uploadFile = require("../middleware/upload");
const fs = require("fs-extra");
//const baseUrl = "http://localhost:8080/files/";
const my = require ("./my.js")
const v = require ('voca')
const util = require("util");
const multer = require("multer");

const upload = async (req, res) => {
	var srcDir=req.params.srcdir;
	var fileName = req.params.filename;
	  srcDir = my.getSrcDir(srcDir);
	  console.log(srcDir)
	  try
	  {
		stats = fs.statSync(srcDir)
		if ( ! stats.isDirectory() ) {return my.resErr(res,"Source Dir exists but not a directory")}
		  } 
	  catch (ex) {
		  if ( ex.code == 'ENOENT' )
		  {
			  try{fs.ensureDirSync(srcDir, 0o0660)}
			  catch (ex) {return my.resErr(res,`Failed to create Source dir ${srcDir}- ${ex}`)}
			  
			  try{fs.chmod(srcDir, 0o0660)}
			  catch (ex) {return my.resErr(res,`Failed to chmod Source dir ${srcDir} - ${ex}`)}
		  }
	  }
  
  try {
	  
	  const storage = multer.diskStorage({
		  destination: (req, file, cb) => {
			  cb(null,srcDir)
		  },
		  filename: (req, file, cb) => {
			 if ( v.count( fileName ) < 1 ) {fileName = file.originalname} 
			 //console.log(fileName);
			 cb(null,fileName)
		  }
	  });
	  
	  let uploadFile = multer({
		storage: storage,
		limits: { fileSize: config.uploadMaxSize },
		}).single("file");
		
		let uploadFileMiddleware = util.promisify(uploadFile);
    
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {return my.resErr(res,"Please upload a file!")}

    return my.resMsg(res, "Uploaded the file successfully - " + fileName)
    
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {return my.resErr(res,`File size cannot be larger than ${my.bytesForHuman(config.uploadMaxSize)}`)}
	return my.resErr(res, `Could not upload the file - ${err}`);
  }
};

const createFolder = async (req, res) => {
	var srcDir=req.params.srcdir;
	  srcDir = my.getSrcDir(srcDir);
	  
	  try
	  {
		  //console.log(srcDir);
		stats = fs.statSync(srcDir)
		if ( ! stats.isDirectory() ) {return my.resErr(res,`Folder exists but not a directory (${srcDir})`)}
		else
			{return my.resMsg(res,`Folder already exists (${srcDir})`)}
		  } 
	  catch (ex) {
		  if ( ex.code == 'ENOENT' )
		  {
			  try{fs.ensureDirSync(srcDir, 0o0660)}
			  catch (ex) {return my.resErr(res,`Failed to create folder ${srcDir}- ${ex}`)}
			  
			  try{fs.chmod(srcDir, 0o0660)}
			  catch (ex) {return my.resErr(res,`Failed to set chmod for folder (${srcDir}) - ${ex}`)}
		  }
	  }
  
    return my.resMsg(res, "Folder created - " + srcDir)
};

const move = async (req, res) => {
	var srcDir=req.params.srcdir;
	var trgDir=req.params.trgdir;
	var path;
	var filename = req.params.filename;
	/* var isFile = (req.params.restype == 'file')
	
	if ( ! isFile && req.params.restype != 'folder') {
		return my.resErr(res,`Invalid move resource type suffix`);} */
		
	  srcDir = my.getDir(srcDir);
	  trgDir = my.getDir(trgDir);
	  path = srcDir;
	  
	  if ( logV() > 5 ) {console.info(`Moving ${filename} from ${srcDir} to ${trgDir}`)}
	  
	  //Check Source Folder
	  try{
		stats = fs.statSync(srcDir)
		if ( ! stats.isDirectory() ) {return my.resErr(res,`Source Folder exists but not a directory (${srcDir})`)}
		  } catch (ex) {return my.resErr(res,`Source Folder invalid or does not exists (${srcDir}) - ${ex}`)}
	  
	  //Check Target Folder
	  try{
		stats = fs.statSync(trgDir)
		if ( ! stats.isDirectory() ) {return my.resErr(res,`Target Folder exists but not a directory (${trgDir})`)}
		  } catch (ex) {return my.resErr(res,`Target Folder invalid or does not exists (${trgDir}) - ${ex}`)}
	  // Check Filename
		if (v.count(filename) < 1 ) {my.resErr(res,"Resource to move, not specified");return;}
	  
	  try{
		  fs.moveSync(srcDir + filename,trgDir + filename, {overwrite:true})
	  }catch (ex) {return my.resErr(res,`Move failed - ${ex}`)}
	  
    return my.resMsg(res, `Resource (${filename}) moved from (${srcDir}) to (${trgDir}) successfully`)
};


const listFiles = (req, res) => {
	var srcDir=req.params.srcdir;
	var msg;
	var isOnlyFiles = (req.params.restype == 'files')
	srcDir = my.getSrcDir(srcDir);
	
	if (!isOnlyFiles && req.params.restype != 'folders') {
		my.resErr(res,`Invalid list suffix`);return;}

  if ( logV() > 5 ) {console.info(`Listing ${req.params.restype} in ${srcDir}`)}
		
	fs.readdir(srcDir, {withFileTypes:true}, function (err, files) {
		if (err) {my.resErr(res,err.toString());return;}
	//console.log(files)
	let fileInfos = [];
	files.forEach((file) => {
		if (isOnlyFiles)
		{if (! file.isFile()) {return;}}
		else
		{if (! file.isDirectory()) {return;}}
      fileInfos.push({name: file.name});
		
		});
		
	res.status(200).send(fileInfos);
	
	});

};

const download = (req, res) => {
	
	var srcDir=req.params.srcdir;
    const filename = req.params.filename;
    srcDir = my.getSrcDir(srcDir);

	if (v.count(filename) < 1 ) {my.resErr(res,"FileName not specified");return;}
	path= srcDir + filename;

	fs.stat(path, (err,stats) => {
	  if (err) {my.resErr(res,err.toString());return;}
      else
      {
		  if ( ! stats.isFile ) {my.resErr(res,"Cannot download a resource which is not a file");return;}
		  res.download(path, filename, (err) => {
			  if (err) {my.resErr(res,"Could not download the file - " + err.toString());return;}
			  });
		  }
	   });
	   
};


const deleteFile = (req, res) => {
  var srcDir=req.params.srcdir;
	var msg,path,opts={};
	var isFile = (req.params.restype == 'file')
	srcDir = my.getSrcDir(srcDir);
	//console.log(srcDir)
	if ( ! isFile && req.params.restype != 'folder') {
		return my.resErr(res,`Invalid delete suffix`);}
  const filename = req.params.filename;
  
  
  if ( isFile){
	  if (v.count(filename) < 1 ) {my.resErr(res,"FileName not specified");return;}
	  path= srcDir + filename;
	 //console.log(path)
	fs.unlink(path, (err) => {
	  if (err) {my.resErr(res,err.toString());return;}
      else
      {my.resMsg(res, "File Deleted");return;}
	   });
	  
	  }
  else
  {

	  if (srcDir == (config.rootDir + "/") ) {my.resErr(res,"Cannot Delete root folder");return;}
	  path=srcDir; opts={recursive:true};
	  
	  try{fs.statSync(path)} catch (ex) {my.resErr(res,"Folder entry does not exists");return;}
	  
	  fs.rmdir(path, opts, (err) => {
	  if (err) {my.resErr(res,err.toString());return;}
      else
      {my.resMsg(res, "Folder Deleted");return;}
	   });
	
	  }
};


const setConfig = (req, res) => {
	var paramName=req.params.paramname;
	var paramValue=req.params.paramvalue;
	var isErr = false;
	var msg, value;
	if ( my.isLocalhost(req) )
	{
	switch(paramName){
	case "logVerbose":
		value = parseInt(paramValue,0)
		break;
	default:
		isErr=true;
	}
}
	else
	{ isErr = true}
   
	if ( isErr )
	{my.resErr(res,"Access is denied");return;}
	else
	{
		config[paramName] = paramValue;
		my.resMsg(res, `Config Key (${paramName}) assigned as (${config[paramName]})`);return;
		}
};
module.exports = {
  upload,
  download,
  listFiles,
  deleteFile,
  createFolder,
  move,
  setConfig
};
