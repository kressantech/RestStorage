//config.js
const config = {
	port: 8080,
	uploadMaxSize: 2 * 1024 *  1024,
	rootDir: "/data/",
	checkDirs: ["/data/main","/data/archives"],
	enableAccessKey: false,
	accessKey: 'ACCESS_KEY_HERE',
	logVerbose: 10,
	enableSSL:true,
	keyPath: './resources/cert/key.pem',
	certPath:'./resources/cert/cert.pem'	}

module.exports = config;
