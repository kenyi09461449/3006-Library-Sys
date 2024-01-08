const multer = require('multer');
const fs = require('fs'); 

// multer文件上传,可指定上传路径,不在router参数里直接用
//Multer file upload, can specify upload path, not directly used in router parameters
let uploadFunction = (req, res, dest) => {

  let storage = multer.diskStorage({
      destination: function (req, file, cb) {
          let newDestination = dest;
          let stat = null;
          try {
              // 检查传入的路径是否存在，不存在则创件
              //Check if the incoming path exists, if not, create a new one
              stat = fs.statSync(newDestination);
          } catch (err) {
              fs.mkdirSync(newDestination);
          }
          if (stat && !stat.isDirectory()) {
              throw new Error('File directory: "' + dest + 'already exists!"');
          }
          cb(null, newDestination);
      },
      filename: function (req, file, cb) {
        const originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
        cb(null, Date.now() + originalname.substring(originalname.indexOf('.'),originalname.length))
      }
  });

  let upload = multer({
      storage: storage
  }).single('file');

  return new Promise((resolve, reject) => {
      upload(req, res, (err) => {
          if (err) {
              return reject(err);
          }
          resolve();
      })
  })
};

// 导出配置
//Export Configuration
module.exports = {
  uploadFunction,
}