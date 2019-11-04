var mongoose = require('mongoose');

var constant = require('../core/constant');

var PackSchema = new mongoose.Schema({
    name:                           { type: String, default: '' },
    description:                    { type: String, default: '' },
    
    imageUrl:                       { type: String, default: '' },
    
    backgroundGradientTopColor:     { type: String, default: '#000000' },
    backgroundGradientBottomColor:  { type: String, default: '#000000' },

    icon:                           { type: String, default: '' },
    link:                           { type: String, default: '' },

    sessionBackground:              { type: String, default: '' },
    audio:                          { type: String, default: '' },

    breathPattern:                  { type: JSON,  default: {
        inHale: { type: Number },
        holdIn: { type: Number },
        exHale: { type: Number },
        holdEx: { type: Number }
    }},

    archived:                       { type: Boolean, default: false },

    guideBreathsPerMin:             { type: Number, default: 1 },

    requiredLevel:                  { type: Number, default: 0 }
});

/**
 * find all packs
 */
PackSchema.statics.all = function(callback) {
    Pack.find({})
        .exec(function(e, packs) {
            if (e) return callback(constant.DB_OPERATION_FAILED);

            return callback(null, packs ? packs : []);
        });
}

PackSchema.statics.all_by_level = function(level, callback) {
    Pack.find({
            requiredLevel: {
                $lte: level
            }
        })
        .exec(function(e, packs) {
            if (e) return callback(e, []);
            
            return callback(null, packs ? packs : []);
        });
}

PackSchema.statics.locked_all_by_level = function(level, callback) {
    Pack.find({
        requiredLevel: {
            $gt: level
        }
    })
    .exec(function(e, packs) {
        if (e) return callback(e, []);
        
        return callback(null, packs ? packs : []);
    });
}

PackSchema.statics.append_new_pack = function(data, callback) {
    Pack.create(data, function(e, pack) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        return callback(null, pack);
    });
}

PackSchema.statics.update_by_id = function(packId, data, callback) {
    Pack.findById(packId)
        .exec(function(e, pack) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!pack) return callback(constant.PACK_NOT_EXIST);

            pack.update(data, function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                Pack.find_by_id(packId, callback);
            });
        });
}

PackSchema.statics.update_by_name = function(name, data, callback) {
    Pack.findOne({name})
        .exec(function(e, pack) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!pack) return callback(constant.PACK_NOT_EXIST);

            pack.update(data, function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                Pack.find_by_name(data.name, callback);
            });
        });
}

PackSchema.statics.find_by_id = function(packId, callback) {
    Pack.findById(packId)
        .exec(function(e, pack) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!pack) return callback(constant.PACK_NOT_EXIST);

            return callback(null, pack);
        });
}

PackSchema.statics.find_by_name = function(name, callback) {
    Pack.findOne({name})
        .exec(function(e, pack) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!pack) return callback(constant.PACK_NOT_EXIST);

            return callback(null, pack);
        });
}

PackSchema.statics.delete_by_id = function(packId, callback) {
    Pack.findById(packId)
        .exec(function(e, pack) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!pack) return callback(constant.PACK_NOT_EXIST);

            pack.remove(function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                return callback(null);
            });
        });
}

PackSchema.statics.delete_by_name = function(name, callback) {
    Pack.findOne({name})
        .exec(function(e, pack) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            if (!pack) return callback(constant.PACK_NOT_EXIST);

            pack.remove(function(err) {
                if (err) return callback(constant.DB_OPERATION_FAILED);
                return callback(null, pack);
            });
        });
}

var Pack = mongoose.model('Pack', PackSchema);
module.exports = Pack;