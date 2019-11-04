var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var StripeWebhook = require('stripe-webhook-middleware');

var constant = require('./constant');
var middleware = require('./middleware');
var stripeEvents = require('./stripe-events');

var authController = require('../controllers/auth');
var userController = require('../controllers/user');
var homeController = require('../controllers/home');
var sessionController = require('../controllers/session');
var locationController = require('../controllers/location');
var adminController = require('../controllers/admin');

var upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `app/public${constant.uploadDir}`)
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err);
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        });
    }
})});

var cpPackUpload = upload.fields([
    {name: 'imageUrl', maxCount: 1},
    {name: 'icon', maxCount: 1},
    {name: 'sessionBackground', maxCount: 1},
    {name: 'audio', maxCount: 1}
]);

var cpOfferUpload = upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'placement', maxCount: 1}
]);

var router = express.Router();

router.get('/', middleware.redrect2dashboard, authController.getSignin);
router.post('/', authController.postSignin);
router.get('/sign-up', middleware.redrect2dashboard, authController.getSignup);
router.post('/sign-up', authController.postSignup);
router.post('/resend', authController.postResend);
router.get('/login-confirm', authController.getLoginConfirm);
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/change-email', middleware.auth, authController.getChangeEmail);
router.get('/email-confirm', authController.getEmailConfirm);

router.get('/welcome', middleware.auth, homeController.getWelcome);
router.get('/dashboard', middleware.auth, homeController.getDashboard);
router.get('/privacy', homeController.getPrivacy);
router.get('/terms', homeController.getTerms);
router.get('/cookies', homeController.getCookies);

router.get('/user', middleware.auth, userController.getUser);
router.post('/user', middleware.auth, userController.postUser);
router.get('/user/billing', middleware.auth, userController.getBilling);
router.post('/user/billing', middleware.auth, userController.postBilling);
router.get('/user/plan', middleware.auth, userController.getPlan);
router.post('/user/plan', middleware.auth, userController.postPlan);
router.post('/delete-account', middleware.auth, userController.postDeleteAccount);

router.get('/stats', middleware.auth, sessionController.getStats);
router.get('/session', middleware.auth, sessionController.getSession);
router.get('/session/:session_id', middleware.auth, sessionController.getSessionOne);
router.post('/session', middleware.auth, sessionController.postSession);
router.get('/session/last/:amount', middleware.auth, sessionController.getLasts);
router.get('/after-session/:session_id', middleware.auth, sessionController.getAfterSession);
router.get('/session-stats', middleware.auth, sessionController.getSessionStats);
router.get('/session-stats/:session_id', middleware.auth, sessionController.getSessionStatsOne);
router.get('/packs', middleware.auth, sessionController.getPacks);

router.get('/breath-monitor', middleware.auth, homeController.getBreathMonitor);
router.get('/heart-monitor', middleware.auth, homeController.getHeartMonitor);

router.get('/rewards', middleware.auth, homeController.getRewards);

router.get('/location.geojson', middleware.auth, locationController.getGeojson);
router.get('/location', middleware.auth, locationController.getLocation);
router.post('/location', middleware.auth, locationController.postLocation);

router.get('/admin', adminController.getAdmin);
router.post('/admin', adminController.postAdmin);
router.get('/admin/users', middleware.admin_auth, adminController.getUsers);
router.get('/admin/offers', middleware.admin_auth, adminController.getOffers);
router.get('/admin/offer/:offerName', middleware.admin_auth, adminController.getOfferOne);
router.post('/admin/offer/:offerName', middleware.admin_auth, cpOfferUpload, adminController.postOfferOne);
router.get('/admin/offer', middleware.admin_auth, adminController.getOffer);
router.post('/admin/offer', middleware.admin_auth, cpOfferUpload, adminController.postOffer);
router.get('/admin/packs', middleware.admin_auth, adminController.getPacks);
router.get('/admin/pack/:packName', middleware.admin_auth, adminController.getPackOne);
router.post('/admin/pack/:packName', middleware.admin_auth, cpPackUpload, adminController.postPackOne);
router.get('/admin/pack', middleware.admin_auth, adminController.getPack);
router.post('/admin/pack', middleware.admin_auth, cpPackUpload, adminController.postPack);
router.get('/logout', middleware.auth, authController.getLogout);

// router.get('*', function(req, res, next) {
//     next({ status: 404, message: 'Not Found' });
// });

var stripeWebhook = new StripeWebhook({
    stripeApiKey: constant.stripeOptions.apiKey,
    respond: true
});

// use this url to receive stripe webhook events
router.post('/stripe/events',
    stripeWebhook.middleware,
    stripeEvents
);

module.exports = router;