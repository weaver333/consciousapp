var path = require('path');

var constant = require('../core/constant');
var h = require('./_helpers');

var Admin = require('../models/admin');
var Pack = require('../models/pack');
var User = require('../models/user');
var Offer = require('../models/offer');

module.exports = {
    getAdmin: function(req, res, next) {
        return h.render(req, 'admin/login'), next();
    },

    postAdmin: function(req, res, next) {
        Admin.login(req.body.username, req.body.password, function(e, admin) {
            if (e) {
                return h.render(req, 'admin/login', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                }), next();
            }
    
            req.session.adminId = admin._id;
    
            return res.redirect('/admin/packs');
        });
    },

    getUsers: function(req, res, next) {
        User.all(function(e, users) {
            if (e) {
                return h.render(req, 'admin/users', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                });
            }

            return h.render(req, 'admin/users', {users}), next();
        });
    },

    getOffers: function(req, res, next) {
        Offer.all(function(e, offers) {
            if (e) {
                return h.render(req, 'admin/offers', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                });
            }
            
            return h.render(req, 'admin/offers', {offers}), next();
        });
    },

    getOffer: function(req, res, next) {
        return h.render(req, 'admin/offer'), next();
    },

    postOffer: function(req, res, next) {
        Promise.all([
            new Promise(function(resolve) {
                if (req.files.image) h.s3_upload(req.files.image[0].filename, req.files.image[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.placement) h.s3_upload(req.files.placement[0].filename, req.files.placement[0].path, (e, url) => { resolve(url) });
                else resolve();
            })
        ]).then(function(results) {
            var data = {
                name: req.body.name,
                description: req.body.description,
                terms: req.body.terms,
                conditions: req.body.conditions,

                expiredAt: req.body.expiredAt,

                image: results[0] ? results[0] : '',
                cost: req.body.cost,
                voucher: req.body.voucher,

                placement: results[1] ? results[1] : ''
            };
        
            Offer.append_new_offer(data, function(e, offer) {
                if (e) {
                    return h.render(req, '/admin/offer', {
                        status: 'error',
                        message: constant.MESSAGES[e]
                    }), next();
                }
                return res.redirect(`/admin/offer/${offer.name}`);
            });
        });
    },

    getOfferOne: function(req, res, next) {
        Offer.find_by_name(req.params.offerName, function(e, offer) {
            if (e) {
                return h.render(req, 'admin/offer', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                }), next();
            }
    
            return h.render(req, 'admin/offer', { offer }), next();
        });
    },

    postOfferOne: function(req, res, next) {
        if (req.body.delete) {
            return Offer.delete_by_name(req.params.offerName, function(e, offer) {
                if (e) {
                    return res.redirect(`/admin/offer/${req.params.offerName}`);
                }

                Promise.all([
                    new Promise(function(resolve) {
                        if (offer.image) h.s3_delete(path.basename(offer.image), resolve);
                        else resolve();
                    }),
                    new Promise(function(resolve) {
                        if (offer.placement) h.s3_delete(path.basename(offer.placement), resolve);
                        else resolve();
                    })
                ]).then(function(results) {
                    return res.redirect('/admin/offers');
                });
            });
        }

        Promise.all([
            new Promise(function(resolve) {
                if (req.files.image) h.s3_upload(req.files.image[0].filename, req.files.image[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.placement) h.s3_upload(req.files.placement[0].filename, req.files.placement[0].path, (e, url) => { resolve(url) });
                else resolve();
            })
        ]).then(function(results) {
            var data = {
                name: req.body.name,
                description: req.body.description,
                terms: req.body.terms,
                conditions: req.body.conditions,

                expiredAt: req.body.expiredAt,
                cost: req.body.cost,
                voucher: req.body.voucher,
            };
        
            if (results[0]) data.image = results[0];
            if (results[1]) data.placement = results[1];
            
            Offer.update_by_name(req.params.offerName, data, function(e, offer) {
                if (e) {
                    return h.render(req, 'admin/offer', {
                        status: 'error',
                        message: constant.MESSAGES[e]
                    }), next();
                }

                return res.redirect(`/admin/offer/${offer.name}`);
            });
        });
    },

    getPacks: function(req, res, next) {
        Pack.all(function(e, packs) {
            if (e) {
                return h.render(req, 'admin/packs', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                });
            }
            
            return h.render(req, 'admin/packs', {packs}), next();
        });
    },

    getPackOne: function(req, res, next) {
        Pack.find_by_name(req.params.packName, function(e, pack) {
            if (e) {
                return h.render(req, 'admin/pack', {
                    status: 'error',
                    message: constant.MESSAGES[e]
                }), next();
            }
    
            return h.render(req, 'admin/pack', { status: 'success', pack }), next();
        });
    },

    postPackOne: function(req, res, next) {
        if (req.body.delete) {
            return Pack.delete_by_name(req.params.packName, function(e, pack) {
                if (e) {
                    return res.redirect(`/admin/pack/${req.params.packName}`);
                }

                Promise.all([
                    new Promise(function(resolve) {
                        if (pack.imageUrl) h.s3_delete(path.basename(pack.imageUrl), resolve);
                        else resolve();
                    }),
                    new Promise(function(resolve) {
                        if (pack.icon) h.s3_delete(path.basename(pack.icon), resolve);
                        else resolve();
                    }),
                    new Promise(function(resolve) {
                        if (pack.sessionBackground) h.s3_delete(path.basename(pack.sessionBackground), resolve);
                        else resolve();
                    }),
                    new Promise(function(resolve) {
                        if (pack.audio) h.s3_delete(path.basename(pack.audio), resolve);
                        else resolve();
                    })
                ]).then(function(results) {
                    return res.redirect('/admin/packs');
                });
            });
        }

        Promise.all([
            new Promise(function(resolve) {
                if (req.files.imageUrl) h.s3_upload(req.files.imageUrl[0].filename, req.files.imageUrl[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.icon) h.s3_upload(req.files.icon[0].filename, req.files.icon[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.sessionBackground) h.s3_upload(req.files.sessionBackground[0].filename, req.files.sessionBackground[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.audio) h.s3_upload(req.files.audio[0].filename, req.files.audio[0].path, (e, url) => { resolve(url) });
                else resolve();
            })
        ]).then(function(results) {
            var data = {
                name: req.body.name,
                description: req.body.description,
                
                backgroundGradientTopColor: req.body.backgroundGradientTopColor,
                backgroundGradientBottomColor: req.body.backgroundGradientBottomColor,
                link: req.body.link,
        
                breathPattern: {
                    inHale: req.body.inHale ? req.body.inHale : 0,
                    holdIn: req.body.holdIn ? req.body.holdIn : 0,
                    exHale: req.body.exHale ? req.body.exHale : 0,
                    holdEx: req.body.holdEx ? req.body.holdEx : 0
                },
        
                guideBreathsPerMin: 1,
        
                archived: req.body.archived,

                requiredLevel: req.body.requiredLevel ? req.body.requiredLevel : 0
            };
        
            if (results[0]) data.imageUrl = results[0];
            if (results[1]) data.icon = results[1];
            if (results[2]) data.sessionBackground = results[2];
            if (results[3]) data.audio = results[3];
        
            data.guideBreathsPerMin = (60 / (
                Math.max(
                    1,
                    parseInt(data.breathPattern.inHale) +
                    parseInt(data.breathPattern.holdIn) +
                    parseInt(data.breathPattern.exHale) +
                    parseInt(data.breathPattern.holdEx)
                )
            )).toFixed(2);
        
            Pack.update_by_name(req.params.packName, data, function(e, pack) {
                if (e) {
                    return h.render(req, 'admin/pack', {
                        status: 'error',
                        message: constant.MESSAGES[e]
                    }), next();
                }

                return res.redirect(`/admin/pack/${pack.name}`);
            });
        });
    },

    getPack: function(req, res, next) {
        return h.render(req, 'admin/pack'), next();
    },

    postPack: function(req, res, next) {
        Promise.all([
            new Promise(function(resolve) {
                if (req.files.imageUrl) h.s3_upload(req.files.imageUrl[0].filename, req.files.imageUrl[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.icon) h.s3_upload(req.files.icon[0].filename, req.files.icon[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.sessionBackground) h.s3_upload(req.files.sessionBackground[0].filename, req.files.sessionBackground[0].path, (e, url) => { resolve(url) });
                else resolve();
            }),
            new Promise(function(resolve) {
                if (req.files.audio) h.s3_upload(req.files.audio[0].filename, req.files.audio[0].path, (e, url) => { resolve(url) });
                else resolve();
            })
        ]).then(function(results) {
            var data = {
                name: req.body.name,
                description: req.body.description,
                imageUrl: results[0] ? results[0] : '',
                backgroundGradientTopColor: req.body.backgroundGradientTopColor,
                backgroundGradientBottomColor: req.body.backgroundGradientBottomColor,
                icon: results[1] ? results[1] : '',
                link: req.body.link,
        
                sessionBackground: results[2] ? results[2] : '',
                audio: results[3] ? results[3] : '',
        
                breathPattern: {
                    inHale: req.body.inHale ? req.body.inHale : 0,
                    holdIn: req.body.holdIn ? req.body.holdIn : 0,
                    exHale: req.body.exHale ? req.body.exHale : 0,
                    holdEx: req.body.holdEx ? req.body.holdEx : 0
                },
        
                guideBreathsPerMin: 1,
        
                archived: req.body.archived,

                requiredLevel: req.body.requiredLevel ? req.body.requiredLevel : 0
            };
        
            data.guideBreathsPerMin = (60 / (
                Math.max(
                    1,
                    parseInt(data.breathPattern.inHale) +
                    parseInt(data.breathPattern.holdIn) +
                    parseInt(data.breathPattern.exHale) +
                    parseInt(data.breathPattern.holdEx)
                )
            )).toFixed(2);
            
            Pack.append_new_pack(data, function(e, pack) {
                if (e) {
                    return h.render(req, '/admin/pack', {
                        status: 'error',
                        message: constant.MESSAGES[e]
                    }), next();
                }
                return res.redirect(`/admin/pack/${pack.name}`);
            });
        });
    },
}