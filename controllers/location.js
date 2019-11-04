var moment = require('moment');

var constant = require('../core/constant');

var Location = require('../models/location');

module.exports = {
    getGeojson: function(req, res, next) {
        Location.all(function(e, locations) {
            if (e) {
                return res.send({
                    status: "error",
                    message: constant.MESSAGES[e]
                });
            }
    
            var result = {
                "type": "FeatureCollection",
                "features": []
            };
    
            locations.forEach(location => {
                result.features.push({
                    "type": "Feature",
                    "properties": {
                        "id": location._id,
                        "lastGuideAccuracyToday": location.lastGuideAccuracyToday,
                    }, 
                    "geometry":
                    {
                        "type": "Point",
                        "coordinates": [ location.lng, location.lat]
                    } 
                });
            });
    
            return res.send(result);
        });
    },

    postLocation: function(req, res, next) {
        if (!req.user.lastSentLocation || moment.duration(moment(Date.now()).diff(req.user.lastSentLocation)).asMinutes() > 1440) {
            Location.append_new_location(req.body.lng, req.body.lat, req.user.sessions[req.user.sessions.length] ? req.user.sessions[req.user.sessions.length].guideAccuracyAvg : 0, function(e, location) {
                if (e) {
                    return res.send({
                        status: "error",
                        message: constant.MESSAGES[e]
                    });
                }
    
                req.user.lastSentLocation = Date.now();
                req.user.save();
        
                return res.send({
                    status: "success",
                    location
                });
            });
        } else {
            return res.send({
                status: 'error',
                message: constant.MESSAGES[constant.LOCATION_DUPLICATE_REQUEST]
            });
        }
    },

    getLocation: function(req, res, next) {
        Location.all(function(e, locations) {
            if (e) {
                return res.send({
                    status: "error",
                    message: constant.MESSAGES[e]
                });
            }
    
            return res.send({
                status: "success",
                locations
            });
        });
    }
}