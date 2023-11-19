const v = require ('voca')
const fs = require('fs')
const myFile = require("njs-appdef/core/myFile.js")
const path = require("path")

function getDir(dir)
{
    //dir = req.param.srcdir
	if (v.isBlank(dir)) {dir = ''};
	dir = v.trim(dir,'$');
	dir = v.replaceAll(dir,'$','/')
	dir = dir + '/';
	if (dir == '/') {dir = ''};
	dir = config.rootDir + "/" + dir
	return dir;
	}
function getSrcDir(dir)
{
	return getDir(dir)
	}
	
function resMsg (res,msg,code=200)
{
	if ( logV() > 4 ) {console.info(msg)}
	return res.status(code).send({ message: msg })
	}
function resErr (res,msg)
{
	if ( logV() > 0 ) {console.error(msg)}
	return res.status(HTTP_ERR_CODE).send({ message: msg })
	}

function validateConfig()
{
	if (! v.isNumeric(config.port)) {
		throw new Error("Config port is not a numeric")}
	
	if ( config.port < 1025 )	{
		throw new Error ("Config port has to be more than 1024 numeric")}
	
	for (let i = 0; i < config.checkDirs.length; i++) 
	{
		try
		{
		fs.stat(config.checkDirs[i], (err, stats) => 
		{
		if (err) {
			throw err;}
        if (! stats.isDirectory()) {
			throw new Error(`Specific check path ${config.CheckDirs[i]} is not a directory`)
			}
		});
		} catch (ex) {throw ex}
		
	}
	
	try
		{
		fs.stat(config.rootDir, (err, stats) => 
		{
		if (err) {
			throw err;}
        if (! stats.isDirectory()) {
			throw new Error(`Specific root path ${config.rootDir} is not a directory`)
			}
		});
		} catch (ex) {throw ex}
	
	config.rootDir = v.trimRight(config.rootDir,"/")
	//console.log(config.rootDir)
	
	if ( ! v.isNumeric(config.uploadMaxSize) ) {config.uploadMaxSize = 2 * 1024 * 1024}
	if ( config.uploadMaxSize < 2 * 1024 ) {config.uploadMaxSize = 2 * 1024 * 1024}
	}
	
	function bytesForHuman(bytes, decimals = 2) {
    let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

    let i = 0
    
    for (i; bytes > 1024; i++) {
        bytes /= 1024;
    }

    return parseFloat(bytes.toFixed(decimals)) + ' ' + units[i]
  }
 
 var isLocalhost = function (req){
    
    var ip = req.connection.remoteAddress;
    var host = req.get('host');
    
    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

function getConfig(args)
{
	configFile = args[Object.keys(args).find((k) => {return k == 'config-file' || k == 'c' || k == 'config'})]
	configFile = v.trim(configFile)
	if ( v.count(configFile)< 1 ){
		configFile= path.resolve(__dirname + '/../config.js')
		if ( ! myFile.exists(configFile)){
			configFile=path.resolve(__dirname + '/../config-sample.js')
		}
	}
	else
	{
		if ( v.indexOf(configFile,'/') < 0 ) {configFile='./' + configFile}
	}
	return configFile;
	
}
module.exports = {getSrcDir, getDir, resMsg,resErr, validateConfig, bytesForHuman,isLocalhost,getConfig}
