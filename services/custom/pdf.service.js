const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const moment = require('moment');
const config = require('../../config')[process.env.NODE_ENV];

module.exports = {
    generatePdf: (opt, doc, cb) => {
        /** Path to Font, Images for HTML */
        let resPath = 'utils/template/' + opt.resPath;
        /**Path to HTML template */
        let template = 'utils/template/' + doc.template;
        var options = {
            format: opt.format || 'A2',
            orientation: opt.orientation || 'portrait',
            base: `file://${path.resolve(resPath)}/`,
            border: opt.border || '10mm'
        };
        var document = {
            html: fs.readFileSync(path.resolve(template), 'utf8'),
            data: doc.data,
            path: `${config.POST_RESOURCE_BASE_PATH}${doc.outputPath}${Date.now()}.pdf`
        };
        pdf.create(document, options).then(result => {
            result = result.filename
                ? `${config.GET_RESOURCE_BASE_PATH}invoice/${(result.filename).substring((result.filename).lastIndexOf('/') + 1)}`
                : 'not found';
            cb(null, result);
        }).catch(error => {
            cb(error, 'Failed while generating PDF');
        });
    }
};