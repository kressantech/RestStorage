//config.js
const config = {
	port: 8080,
	uploadMaxSize: 2 * 1024 *  1024,
	rootDir: "/data/",
	checkDirs: ["/data/main","/data/archives"],
	disableDownload: false,
	disableList: false,
	disableDelete: false,
	disableUpload: false,
	disableMove:false,
	enableAccessKey: false,
	accessKey: 'ACCESS_KEY_HERE',
	logVerbose: 10,
	enableSSL:false,
	keyPath: './resources/cert/key.pem',
	certPath:'./resources/cert/cert.pem'	}

module.exports = config;
