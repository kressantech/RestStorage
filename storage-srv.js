const cors = require("cors");
const express = require("express");
const https = require("https")
const app = express();
const fs = require("fs")
const my = require ("./src/my.js")
const v = require ("voca")
const auth_midware = require("./src/auth.js")
global.HTTP_ERR_CODE=422;
global.config = require("./config.js")

//console.log(config.port)

var corsOptions = {
  origin: "http://localhost:8081"
};

//app.use(cors(corsOptions));

const initRoutes = require("./src/routes.js");

app.use(express.urlencoded({ extended: true }));

app.use(auth_midware)

initRoutes(app);

my.validateConfig();
global.logV = function() {return config.logVerbose;}
if ( config.enableSSL ){
    httpsSrv = https.createServer({
        key:fs.readFileSync(config.keyPath),
        cert:fs.readFileSync(config.certPath),
    },app);

    httpsSrv.listen(config.port, () => {
    console.log(`Storage server running as HHTPS:${config.port}`);
    });
}
else {
    app.listen(config.port, () => {
    console.log(`Storage server running as HHTP:${config.port}`);
    });
}

