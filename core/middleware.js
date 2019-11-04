var moment = require('moment');

var Admin = require('../models/admin');
var User = require('../models/user');

var constant = require('./constant');

/**
 * Authentication Middleware
 */
function auth(req, res, next) {
    if (req.session && req.session.userId) {
        User.verify(req.session.userId, function(e, user) {
            if (e == constant.DB_OPERATION_FAILED || e == constant.AUTH_NOT_EXIST) return res.redirect('/');
            if (e == constant.AUTH_NOT_VERIFIED) return res.redirect('/login-confirm');

            req.user = user;

            // Calc lastActivity and dayStreak
            if (!req.user.lastActivity) {
                req.user.lastActivity = Date.now();
                req.user.dayStreak = 1;
                req.user.save(function() {
                    return next();
                });
            } else {
                if (moment(req.user.lastActivity).isSame(moment(), 'day')) {
                    //Nothing
                } else if (moment(req.user.lastActivity).isSame(moment().subtract(1, 'day'), 'day')) {
                    req.user.dayStreak += 1;
                } else {
                    req.user.dayStreak = 1;
                }

                req.user.lastActivity = Date.now();
                req.user.save(function() {
                    return next();
                });
            }
        });
    } else {
        return res.redirect('/');
    }
}

/**
 * Admin Authentication Middleware
 */
function admin_auth(req, res, next) {
    if (req.session && req.session.adminId) {
        Admin.verify(req.session.adminId, function(e, admin) {
            if (e) {
                return res.redirect('/admin');
            }
            
            req.admin = admin;
            return next();
        });
    } else {
        return res.redirect('/admin');
    }
}

/**
 * Auto Redirecting Dashboard Middleware
 */
function redrect2dashboard(req, res, next) {
    if (req.session && req.session.userId) {
        User.verify(req.session.userId, function(e, user) {
            if (user) {
                return res.redirect('/dashboard');
            }

            return next();
        });
    } else {
        return next();
    }
}

/**
 * Restriction for routing
 */
function restrict_routing_1(req, res, next) {
    var level = req.user.stripe.plan ? constant.stripeOptions.planData[req.user.stripe.plan].level : 0;
    if (level < 1) return next({ status: 401, message: 'Un Authorized' });
    next();
}
function restrict_routing_2(req, res, next) {
    var level = req.user.stripe.plan ? constant.stripeOptions.planData[req.user.stripe.plan].level : 0;
    if (level < 2) return next({ status: 401, message: 'Un Authorized' });
    next();
}

module.exports = {
    auth,
    admin_auth,
    redrect2dashboard,
    restrict_routing_1,
    restrict_routing_2
}