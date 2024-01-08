var express = require('express');
var router = express.Router();
const upload = require('../utils/upload');

  //文件上传
  //Upload file
  router.post('/upload/:type', async function (req, res) {
    let type = req.params.type;
    let basePath = "public/";
    let directoryPath;
    if(type == 1){
      directoryPath = "files/avatar/";
    }else if(type == 2){
      directoryPath = "files/book/";
    }
    // 等到文件上传完成
    //Wait until the file upload is completed
    await upload.uploadFunction(req, res, basePath + directoryPath);
    const file = req.file;
    //如果得到了文件，就返回上传成功
    //If the file is obtained, return successful upload
    if (file) {
      const url = 'http://localhost:8080/' + directoryPath + req.file.filename
      const originalname = Buffer.from(req.file.originalname, "latin1").toString("utf8");
      return res.json({ code: 200, msg: 'Upload successed',fileName: originalname, data:url});
    } else {
      return res.json({ code: 500, msg: 'Upload failed'});
    }
  });




 module.exports = router;