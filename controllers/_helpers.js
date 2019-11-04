/**
 * Handlebars rendering
 */

var fs = require('fs');
var AWS = require('aws-sdk');

var constant = require('../core/constant');

var Pack = require('../models/pack');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = constant.aws.accessKeyId;
AWS.config.secretAccessKey = constant.aws.secretAccessKey;
AWS.config.region = constant.aws.region;

var s3 = new AWS.S3();

function render(req, filePath, data = {}) {
    req.filePath = filePath;
    req.data = data;
}

function s3_upload(filename, path, cb) {
    var params = {
        Bucket: constant.aws.bucketName,
        Key: filename,
        Body: fs.readFileSync(path),
        ACL: 'public-read'
    };

    s3.upload(params, function (perr, pres) {
        if (perr) {
            cb(perr, '');
        } else {
            cb(perr, pres.Location);
        }
    });
}

function s3_delete(key, cb) {
    var params = {
        Bucket: constant.aws.bucketName,
        Key: key
    };

    s3.deleteObject(params, function(perr, pres) {
        cb(perr);
    });
}

function detailedSessions(sessions, cb) {
    var p = [];

    sessions.forEach(session => {
        p.push(new Promise(function(resolve) {
            Pack.find_by_name(session.packType, function(e, pack) {
                var _session = JSON.parse(JSON.stringify(session));

                if ( pack ) {
                    _session['pack'] = {
                        'icon': pack.icon,
                        'backgroundGradientBottomColor': pack.backgroundGradientBottomColor,
                        'backgroundGradientTopColor': pack.backgroundGradientTopColor
                    };
                }
                
                resolve(_session);
            });
        }));
    });

    Promise.all(p)
        .then(function(results) {
            cb(null, results);
        });
}

function last(array, amount = 4, attrs = []) {
    var _array = [];
    for (var i = Math.max(0, array.length - amount); i<= array.length - 1; i++) {
        if (!attrs.length) {
            _array.push(array[i]);
        } else {
            var item = {};
            for (attr of attrs) item[attr] = array[i][attr];
            _array.push(item);
        }
    }
    return _array;
}

module.exports = {
    render,
    s3_upload,
    s3_delete,
    detailedSessions,
    last
}