var moment = require('moment');

var constant = require('../core/constant');
var h = require('./_helpers');

var Location = require('../models/location');
var Pack = require('../models/pack');

module.exports = {
    getWelcome: function(req, res, next) {
        return h.render(req, 'welcome'), next();
    },

    getDashboard: function(req, res, next) {
        Promise.all([
            new Promise(function(resolve) {
                Location.all(function(e, locations) {
                    resolve(locations ? locations.length : 0);
                });
            }),
            new Promise(function(resolve) {
                var weeklyMeditationTime = 0;
                for (var i = req.user.sessions.length - 1; i >= 0; i --) {
                    var session = req.user.sessions[i];
                    if (moment().isSame(moment(session.timestamp), 'week')) {
                        weeklyMeditationTime += session.totalSessionTime;
                    } else break;
                }
                resolve(weeklyMeditationTime);
            }),
            new Promise(function(resolve) {
                h.detailedSessions(h.last(req.user.sessions), function(e, sessions) {
                    resolve(sessions ? sessions : []);
                });
            }),
            new Promise(function(resolve) {
                req.user.get_packs(function(e, packs) {
                    resolve(packs ? packs : []);
                });
            }),
            new Promise(function(resolve) {
                req.user.get_locked_packs(function(e, packs) {
                    resolve(packs ? packs: []);
                });
            })
        ]).then(function(results) {
            return h.render(req, 'dashboard', {
                totalMeditationApp: results[0],
                weeklyMeditationTime: `${moment.utc(results[1] * 1000).hours()}h ${moment.utc(results[1] * 1000).minutes()}m`,
                dayStreak: req.user.dayStreak,
                sessions: results[2],
                packs: results[3],
                lockedPacks: results[4]
            }), next();
        });
    },

    getRewards: function(req, res, next) {
        return h.render(req, 'rewards'), next();
    },

    getBreathMonitor: function(req, res, next) {
        return h.render(req, 'breath-monitor'), next();
    },

    getHeartMonitor: function(req, res, next) {
        return h.render(req, 'heart-monitor'), next();
    },

    getPrivacy: function(req, res, next) {
        return h.render(req, 'privacy'), next();
    },

    getTerms: function(req, res, next) {
        return h.render(req, 'terms'), next();
    },

    getCookies: function(req, res, next) {
        return h.render(req, 'cookies'), next();
    }
}