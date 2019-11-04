var User = require('../models/user');

var constant = require('../core/constant');
var h = require('./_helpers');

module.exports = {
    getSignin: function(req, res, next) {
        return h.render(req, 'sign-in'), next();
    },
    
    postSignin: function(req, res, next) {
        var email = req.body.email.toLowerCase().trim();
        var password = req.body.password;
    
        if (!email || !password) {
            return h.render(req, 'sign-in', {
                status: 'error',
                message: constant.MESSAGES[constant.EMPTY_FIELD]
            }), next();
        }
    
        User.login(email, password, function(e, user) {
            if (e) {
                if (e == constant.AUTH_NOT_VERIFIED) {
                    return res.redirect(`/login-confirm?email=${email}`);
                }
    
                return h.render(req, 'sign-in', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                }), next();
            }
    
            req.session.userId = user._id;
            return res.redirect('/dashboard');
        });
    },
    
    getSignup: function(req, res, next) {
        return h.render(req, 'sign-up'), next();
    },
    
    postSignup: function(req, res, next) {
        var email = req.body.email.toLowerCase().trim();
        var password = req.body.password;
        var passwordConf = req.body.passwordConf;
        var fullname = req.body.fullname;
    
        if (!email || !password || !passwordConf) {
            return h.render(req, 'sign-up', {
                status: 'error',
                message: constant.MESSAGES[constant.EMPTY_FIELD]
            }), next();
        }
        if (password !== passwordConf) {
            return h.render(req, 'sign-up', {
                status: 'error',
                message: constant.MESSAGES[constant.PASSWORD_NOT_MATCHED]
            }), next();
        }
        User.register(email, password, fullname, function(e, user) {
            if (e) {
                if (e == constant.AUTH_NOT_VERIFIED) {
                    return res.redirect(`/login-confirm?email=${email}`);
                }
                return h.render(req, 'sign-up', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                }), next();
            }
            
            req.session.userId = user._id;
            return res.redirect(`/login-confirm?email=${email}`);
        });
    },
    
    postResend: function(req, res, next) {
        var email = req.body.email;
        var type = req.body.type;
        User.resend_email(email, type, function(e) {
            if (e) {
                return res.send({
                    status: 'error',                
                    message: constant.MESSAGES[e]
                });
            }
    
            return res.send({
                status: 'success'
            });
        });
    },
    
    getLoginConfirm: function(req, res, next) {
        var hash = req.query.h;
        if (hash) {
            User.confirm_email(hash, function(e, user) {
                if (e) {
                    return h.render(req, 'login-confirm', {
                        status: 'error',
                        message: constant.MESSAGES[e]
                    }), next();
                }
                
                req.session.userId = user._id;
                return res.redirect('/welcome');
            });
        } else {
            var email = req.query.email != undefined ? req.query.email : '';
    
            return h.render(req, 'login-confirm', {email}), next();
        }
    },
    
    getForgotPassword: function(req, res, next) {
        return h.render(req, 'forgot-password'), next();
    },
    
    postForgotPassword: function(req, res, next) {
        var email = req.body.email.toLowerCase().trim();
        User.forgot_password(email, function(e, user) {
            if (e) {
                return h.render(req, 'forgot-password', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                }), next();
            }
            
            return h.render(req, 'forgot-password', {
                status: 'success'
            }), next();
        });
    },

    getResetPassword: function(req, res, next) {
        return h.render(req, 'reset-password'), next();
    },

    postResetPassword: function(req, res, next) {
        var hash = req.query.h;
        var password = req.body.password;
        var passwordConf = req.body.passwordConf;
    
        if (!password || !passwordConf) {
            return h.render(req, 'reset-password', {
                status: 'error',
                message: constant.MESSAGES[constant.EMPTY_FIELD]
            }), next();
        }
        if (password !== passwordConf) {
            return h.render(req, 'reset-password', {
                status: 'error',
                message: constant.MESSAGES[constant.PASSWORD_NOT_MATCHED]
            }), next();
        }
    
        if (hash) {
            User.reset_password(hash, password, function(e, user) {
                if (e) {
                    return h.render(req, 'reset-password', {
                        status: 'error',
                        message: constant.MESSAGES[e]
                    }), next();
                }
    
                return res.redirect('/');
            });
        } else {
            return res.redirect('/');
        }
    },

    getChangeEmail: function(req, res, next) {
        var email = req.body.email.toLowerCase().trim();
        User.request_change_email(req.user, email, function(e, user) {
            if (e) {
                return res.send({
                    status: 'error',
                    message: constant.MESSAGES[e]
                });
            }
            
            return res.send({
                status: 'success'
            });
        });
    },

    getEmailConfirm: function(req, res, next) {
        var hash = req.query.h;
        if (hash) {
            User.confirm_change_email(hash, function(e, user) {
                if (e) {
                    return res.redirect('/');    
                }
    
                return res.redirect('/');
            });
        } else {
            return res.redirect('/');
        }
    },

    getLogout: function(req, res) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
}