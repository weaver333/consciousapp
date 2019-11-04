var constant = require('../core/constant');
var h = require('./_helpers');

var User = require('../models/user');

module.exports = {
    postDeleteAccount: function(req, res) {
        req.user.remove(function() {
            return res.redirect('/');
        });
    },

    getUser: function(req, res, next) {
        return h.render(req, 'user'), next();
    },

    postUser: function(req, res, next) {
        var password = req.body.password;
        var passwordConf = req.body.passwordConf;
    
        if (password !== passwordConf) {
            return render(req, 'user', {
                status: 'error',
                message: constant.MESSAGES[constant.PASSWORD_NOT_MATCHED]
            }), next();
        }
        User.update_user(req.user, req.body, function(e, user) {
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

    getBilling: function(req, res, next) {
        return h.render(req, 'billing', {user: req.user}), next();
    },

    postBilling: function(req, res, next) {
        var stripeToken = req.body.stripeToken;

        if (!stripeToken) {
            return h.render(req, 'billing', {
                user: req.user,
                status: 'error',
                message: constant.MESSAGES[constant.STRIPE_INVALID_CARD]
            }), next();
        }
    
        req.user.setCard(stripeToken, function(e) {
            if (e) {
                if (e.code && e.code == 'card_declined') {
                    return h.render(req, 'billing', {
                        user: req.user,
                        status: 'error',
                        message: constant.MESSAGES[constant.STRIPE_CARD_DECLINED]
                    }), next();
                }
                
                return h.render(req, 'billing', {
                    user: req.user,
                    status: 'error',
                    message: constant.MESSAGES[constant.STRIPE_UNEXPECTED_ERROR]
                }), next();
            }
    
            return h.render(req, 'billing', {
                user: req.user,
                status: 'success'
            }), next();
        });
    },

    getPlan: function(req, res, next) {
        return h.render(req, 'plan', {
            plans: User.getPlans(),
            currentPlan: req.user.stripe.plan,
            user: req.user
        }), next();
    },

    postPlan: function(req, res, next) {
        var plan = req.body.plan;
        var stripeToken = null;
    
        if (plan) {
            plan = plan.toLowerCase();
        }
    
        if (req.user.stripe.plan == plan) {
            return h.render(req, 'plan', {
                plans: User.getPlans(),
                user: req.user,
                status: 'error',
                message: constant.MESSAGES[constant.STRIPE_SAME_PLAN]
            }), next();
        }
    
        if (req.body.stripeToken) {
            stripeToken = req.body.stripeToken;
        }
    
        if (!req.user.stripe.last4 && !req.body.stripeToken) {
            return h.render(req, 'plan', {
                plans: User.getPlans(),
                user: req.user,
                status: 'error',
                message: constant.MESSAGES[constant.STRIPE_MISSING_CARD]
            }), next();
        }
    
        req.user.setPlan(plan, stripeToken, function(e) {
            if (e) {
                if (e.code && e.code == 'card_declined') {
                    return h.render(req, 'plan', {
                        plans: User.getPlans(),
                        user: req.user,
                        status: 'error',
                        message: constant.MESSAGES[constant.STRIPE_CARD_DECLINED]
                    }), next();
                }
                
                // console.log(e);
                return h.render(req, 'plan', {
                    plans: User.getPlans(),
                    user: req.user,
                    status: 'error',
                    message: constant.MESSAGES[constant.STRIPE_UNEXPECTED_ERROR]
                }), next();
            }
    
            return h.render(req, 'plan', {
                plans: User.getPlans(),
                user: req.user,
                status: 'success'
            }), next();
        });
    },
}