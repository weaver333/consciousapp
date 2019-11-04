var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var constant = require('../core/constant');

var AdminSchema = new mongoose.Schema({
    username:           { type: String, default: 'admin' },
    password:           { type: String, required: true }
});

AdminSchema.pre('save', function (next) {
    if (this.isNew) {
        var admin = this;
        bcrypt.hash(admin.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }

            admin.password = hash;
            next();
        });
    } else {
        next();
    }
});


AdminSchema.statics.login = function(username, password, callback) {
    Admin.findOne({username})
        .exec(function(err, admin) {
            if (err) return callback(constant.DB_OPERATION_FAILED);
            if (!admin) return callback(constant.AUTH_NOT_EXIST);

            bcrypt.compare(password, admin.password, function(e, result) {
                if (!result) return callback(constant.AUTH_WRONG_PASSWORD);
                return callback(null, admin);
            });
        });
}

/**
 * Verify admin
 */
AdminSchema.statics.verify = function(adminId, callback) {
    Admin.findById(adminId)
        .exec(function(err, admin) {
            if (err) return callback(constant.DB_OPERATION_FAILED);
            if (!admin) return callback(constant.AUTH_NOT_EXIST);

            return callback(null, admin);
        });
}

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;