const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.get("/download/:srcdir/:filename",controller.download);
  router.post("/upload/:srcdir/:filename",controller.upload);
  router.post("/upload/:srcdir/",controller.upload);
  router.get("/createfolder/:srcdir/",controller.createFolder);
  router.get("/list:restype/:srcdir",controller.listFiles);
  router.get("/list:restype/",controller.listFiles);
  router.get("/delete:restype/:srcdir/:filename",controller.deleteFile);
  router.get("/delete:restype/:srcdir/",controller.deleteFile);
  router.get("/move/:srcdir/:trgdir/:filename",controller.move);
  router.get("/setconfig/:paramname/:paramvalue",controller.setConfig);
  
  app.use(router);
};

module.exports = routes;
