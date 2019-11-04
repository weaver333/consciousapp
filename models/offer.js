var mongoose = require('mongoose');

var constant = require('../core/constant');

var OfferSchema = new mongoose.Schema({
    name:                           { type: String, default: '' },
    description:                    { type: String, default: '' },
    terms:                          { type: String, default: '' },
    conditions:                     { type: String, default: '' },

    expiredAt:                      { type: Date },
    
    image:                          { type: String, default: '' },
    cost:                           { type: Number, default: 1 },
    voucher:                        { type: String, default: '' },

    placement:                      { type: String, default: '' }
});

/**
 * find all offers
 */
OfferSchema.statics.all = function(callback) {
    Offer.find({})
        .exec(function(e, offers) {
            if (e) return callback(constant.DB_OPERATION_FAILED);

            return callback(null, offers ? offers : []);
        });
}

OfferSchema.statics.append_new_offer = function(data, callback) {
    Offer.create(data, function(e, offer) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        return callback(null, offer);
    });
}

OfferSchema.statics.update_by_id = function(offerId, data, callback) {
    Offer.findById(offerId)
        .exec(function(e, offer) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!offer) return callback(constant.OFFER_NOT_EXIST);

            offer.update(data, function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                Offer.find_by_id(offerId, callback);
            });
        });
}

OfferSchema.statics.update_by_name = function(name, data, callback) {
    Offer.findOne({name})
        .exec(function(e, offer) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!offer) return callback(constant.OFFER_NOT_EXIST);

            offer.update(data, function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                Offer.find_by_name(offer.name, callback);
            });
        });
}

OfferSchema.statics.find_by_id = function(offerId, callback) {
    Offer.findById(offerId)
        .exec(function(e, offer) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!offer) return callback(constant.OFFER_NOT_EXIST);

            return callback(null, offer);
        });
}

OfferSchema.statics.find_by_name = function(name, callback) {
    Offer.findOne({name})
        .exec(function(e, offer) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!offer) return callback(constant.OFFER_NOT_EXIST);

            return callback(null, offer);
        });
}

OfferSchema.statics.delete_by_id = function(offerId, callback) {
    Offer.findById(offerId)
        .exec(function(e, offer) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!offer) return callback(constant.OFFER_NOT_EXIST);

            offer.remove(function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                return callback(null);
            });
        });
}

OfferSchema.statics.delete_by_name = function(name, callback) {
    Offer.findOne({name})
        .exec(function(e, offer) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!offer) return callback(constant.OFFER_NOT_EXIST);

            offer.remove(function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                return callback(null, offer);
            });
        });
}

var Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;