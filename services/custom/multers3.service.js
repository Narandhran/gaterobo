const { secretAccessKey, accessKeyId, region } = require('../../utils/constant').aws;
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');


aws.config.update({
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKeyId,
    region: region
});

var s3 = new aws.S3();

var loadMulter = (fileSize, filePath) => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: `gatepass/${filePath}`,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, `${Date.now()}${path.extname(file.originalname)}`);
            }
        }),
        fileFilter: function (req, file, cb) {
            if (file.fieldname == 'content') {
                if (path.extname(file.originalname) === '.pdf') {
                    cb(null, true);
                } else cb('Unsupported file type', false);
            } else if (file.fieldname == 'category' || file.fieldname == 'dp'
                || file.fieldname == 'pdf-thumb' || file.fieldname == 'banner' || file.fieldname == 'video-thumb') {
                let fext = path.extname(file.originalname);
                if (fext == '.jpg' || fext == '.jpeg' || fext == '.png') {
                    cb(null, true);
                } else cb(new Error('Unsupported file type'), false);
            }
            else cb(new Error('Unsupported file type', false));

        },
        limits: { fileSize: (fileSize * 1024 * 1024) }
    });
};

module.exports = { loadMulter };