var constant = require('../core/constant');
var h = require('./_helpers');

var User = require('../models/user');
var Pack = require('../models/pack');

module.exports = {
    getSession: function(req, res, next) {
        var packName = req.query.pack ? req.query.pack : '';
        
        if (!packName) {
            return res.redirect('/');
        }

        req.user.get_pack_by_name(packName, function(e, pack) {
            if (e) {
                return res.redirect('/');
            }
            return h.render(req, 'session', {pack}), next();
        });
    },

    getSessionOne: function (req, res) {
        var user = req.user;
        var session_id= req.params.session_id;
        var session = null;
        user.sessions.forEach(s => {if (s._id == session_id) session = s;});
        return res.send({
            status: 'success',
            session
        });
    },

    postSession: function (req, res) {
        if (!req.body.session) {
            return res.send({
                status: 'error',
                message: constant.MESSAGES[constant.EMPTY_FIELD]
            });
        }
        User.append_new_session(req.user, req.body.session, function (e, session) {
            if (e) {
                return res.send({
                    status: 'error',
                    message: constant.MESSAGES[e]
                });
            }
    
            return res.send({
                status: 'success',
                session
            });
        });
    },
    
    getLasts: function(req, res) {
        var attrs = [];
        if (req.query.attr) {
            attrs = req.query.attr.split(',');
        }

        h.detailedSessions(h.last(req.user.sessions, req.params.amount, attrs), function(e, _sessions) {
            return res.send({
                status: 'success',
                sessions: _sessions
            });
        });
    },

    getStats: function(req, res, next) {
        Promise.all([
            new Promise(function(resolve) {
                h.detailedSessions(h.last(req.user.sessions), function(e, sessions) {
                    resolve(sessions ? sessions : []);
                });
            }),
            new Promise(function(resolve) {
                req.user.get_packs(function(e, packs) {
                    resolve(packs ? packs : []);
                });
            })
        ])
        .then(function(results) {
            return h.render(req, 'stats', {
                sessions: results[0],
                packs: results[1]
            }), next();
        });
    },

    getAfterSession: function(req, res, next) {
        var user = req.user;
        var session_id= req.params.session_id;
        var session = null;
        user.sessions.forEach(s => {if (s._id == session_id) session = s;});
        var breathDepthData = JSON.stringify(session.breathDepthData);
        return h.render(req, 'after-session', {
            session,
            breathDepthData
        }), next();
    },

    getSessionStats: function(req, res, next) {
        return h.render(req, 'session-stats'), next();
    },

    getSessionStatsOne: function(req, res, next) {
        var user = req.user;
        var session_id= req.params.session_id;
        var session = null;
        user.sessions.forEach(s => {if (s._id == session_id) session = s;});
        if (session) {
            Pack.find_by_name(session.packType, function(e, pack) {
                session.pack = pack;
                var breathDepthData = JSON.stringify(session.breathDepthData);
                return h.render(req, 'session-stats', {
                    session,
                    breathDepthData
                }), next();
            });
        } else {
            return h.render(req, 'session-stats', {
                status: 'error',
                message: constant.MESSAGES[constant.SESSION_NOT_EXIST]
            }), next();
        }
    },

    getPacks: function(req, res, next) {
        req.user.get_packs(function(e, packs) {
            if (e) {
                return res.send({
                    status: 'error',
                    message: constant.MESSAGES[e]
                })
            }

            return res.send({
                status: 'success',
                packs
            });
        });
    }
}