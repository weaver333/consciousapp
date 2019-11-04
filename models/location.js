var mongoose = require('mongoose');

var constant = require('../core/constant');

var LocationSchema = new mongoose.Schema({
    lng:                    { type: Number, default: 0 },
    lat:                    { type: Number, default: 0  },
    lastGuideAccuracyToday: { type: Number, default: 0  },
    expireAt:               { type: Date,   default: Date.now,  index: { expires: '1440m' }}
});

/**
 * append new location
 */
LocationSchema.statics.append_new_location = function(lng, lat, lastGuideAccuracyToday, callback) {
    Location.create({lng, lat, lastGuideAccuracyToday }, function(e, location) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        callback(null, location);
    });
}

/**
 * find all locations
 */
LocationSchema.statics.all = function(callback) {
    Location.find({})
        .exec(function(e, locations) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            return callback(null, locations ? locations : []);
        });
}

var Location = mongoose.model('Location', LocationSchema);
module.exports = Location