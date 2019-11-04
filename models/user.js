var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var validator = require('validator');

var mail = require('../core/email');
var constant = require('../core/constant');

var {Session, SessionSchema} = require('./session');
var {Transaction, TransactionSchema} = require('./transaction');
var Pack = require('./pack');

var UserSchema = new mongoose.Schema({
  // detail
  email:                  { type: String, unique: true, required: true, trim: true },
  password:               { type: String, required: true },
  fullname:               { type: String },

  // verification
  emailConfirmed:         { type: Boolean, required: true },

  // hash codes
  hashEmailConfirmation:  { type: String, required: false },
  hashPasswordReset:      { type: String, required: false },
  hashEmailChanging:      { type: String, required: false },

  // new email for changing email
  newEmail:               { type: String, required: false, trim: true },
  
  // user's sessions data
  sessions:               { type: [SessionSchema], default: [] },

  // user activities
  lastSentLocation:       { type: Date },
  lastActivity:           { type: Date },
  dayStreak:              { type: Number, default: 0 },

  // Conscious coins
  coins:                  { type: Number, default: 0 },
  transactions:           { type: [TransactionSchema], default: [] }
});

var stripeCustomer = require('./plugins/stripe-customer');
var stripeOptions = constant.stripeOptions;

UserSchema.plugin(stripeCustomer, stripeOptions);

/**
 * append new session data to the user
 */
UserSchema.statics.append_new_session = function(user, data, callback) {
  var session = new Session(data);
  user.sessions.unshift(session);
  user.save(function(e) {
    if (e) return callback(constant.DB_OPERATION_FAILED);
    return callback(null, session);
  });
}

/**
 * confirm email verification
 */
UserSchema.statics.confirm_email = function(hash, callback) {
  User.findOne({hashEmailConfirmation: hash})
    .exec(function(err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (!user) return callback(constant.AUTH_NOT_EXIST);
      if (user.emailConfirmed) return callback(constant.AUTH_ALREADY_VERIFIED);
      
      user.emailConfirmed = true;
      user.hashEmailConfirmation = null;

      user.save(function(e) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        return callback(null, user);
      });
    });
}

/**
 * verify user confirmed
 */
UserSchema.statics.verify = function (userId, callback) {
  User.findById(userId)
    .exec(function(err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (!user) return callback(constant.AUTH_NOT_EXIST);
      if (!user.emailConfirmed) return callback(constant.AUTH_NOT_VERIFIED);

      return callback(null, user);
    });
}

/**
 * update user data
 */
UserSchema.statics.update_user = function (user, data, callback) {
  if (data.password) {
    user.set('password', data.password);
  }
  if (data.fullname) {
    user.fullname = data.fullname;
  }
  
  user.save(function(e) {
    // Error is thrown when .isNew is true
    console.error(e);
    if (e) return callback(constant.DB_OPERATION_FAILED);
    return callback(null, user);
  });
}

/**
 * user login
 */
UserSchema.statics.login = function (email, password, callback) {
  User.findOne({email})
    .exec(function (err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (user && !user.emailConfirmed) return callback(constant.AUTH_NOT_VERIFIED);
      if (!user) return callback(constant.AUTH_NOT_EXIST);

      bcrypt.compare(password, user.password, function (err, result) {
        if (!result) return callback(constant.AUTH_WRONG_PASSWORD);
        return callback(null, user);
      })
    });
}

/**
 * reset user's password
 */
UserSchema.statics.reset_password = function(hash, newPassword, callback) {
  return User.findOne({hashPasswordReset: hash})
    .exec(function(err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (!user) return callback(constant.AUTH_NOT_EXIST);
      
      user.set('password', newPassword);
      user.hashPasswordReset = null;      
      
      user.save(function(e) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        return callback(null, user);
      });
    });
}

/**
 * forgot password
 */
UserSchema.statics.forgot_password = function(email, callback) {
  var hash_code = key => {
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex');
  };

  return User.findOne({email})
    .exec(function (err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (!user) return callback(constant.AUTH_NOT_EXIST);

      if (user.hashPasswordReset) {
        return callback(null, user);
      } else {
        user.hashPasswordReset = hash_code(+new Date() + email);
        mail.send_reset_password_email(user.email, user.hashPasswordReset);
        user.save(function(e) {
          if (e) return callback(constant.DB_OPERATION_FAILED);
          return callback(null, user);
        });
      }
    });
}

/**
 * request change email
 */
UserSchema.statics.request_change_email = function(user, newEmail, callback) {
  var hash_code = key => {
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex');
  };

  if (!validator.isEmail(newEmail)) {
    return callback(constant.INVALID_EMAIL);
  }

  User.findOne({email: newEmail})
    .exec(function(err, _user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (_user) return callback(constant.AUTH_ALREADY_EXIST);

      if (user.hashEmailChanging) {
        user.newEmail = newEmail;
        user.save(function() {
          if (e) return callback(constant.DB_OPERATION_FAILED);
          mail.send_changing_email(user.email, user.hashEmailChanging);
          return callback(null, user);
        })
      } else {
        user.hashEmailChanging = hash_code(+new Date() + newEmail);
        user.newEmail = newEmail;
        user.save(function(e) {
          if (e) return callback(constant.DB_OPERATION_FAILED);
          mail.change_email(user.email, user.hashEmailChanging);
          return callback(null, user);
        });
      }
    });
}

/**
 * confirm email
 */
UserSchema.statics.confirm_change_email = function(hash, callback) {
  return User.findOne({hashEmailChanging: hash})
    .exec(function(err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (!user) return callback(constant.AUTH_NOT_EXIST);

      user.email = user.newEmail;
      user.newEmail = null;
      user.hashEmailChanging = null;
      user.save(function(e) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        return callback(null, user);
      });
    });
}

/**
 * register user
 */
UserSchema.statics.register = function (email, password, fullname, callback) {
  var hash_code = key => {
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex');
  }

  if (!validator.isEmail(email)) {
    return callback(constant.INVALID_EMAIL);
  }

  User.findOne({email})
    .exec(function(err, user) {
      if (err) return callback(constant.DB_OPERATION_FAILED);
      if (user && !user.emailConfirmed) return callback(constant.AUTH_NOT_VERIFIED);
      if (user) return callback(constant.AUTH_ALREADY_EXIST);

      User.create({
        email,
        password,
        fullname,
        emailConfirmed: false,
        hashEmailConfirmation: hash_code(+new Date() + email)
      }, function(e, user) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        mail.send_verification_email(user.email, user.hashEmailConfirmation);
        return callback(null, user);
      });
    });
}

UserSchema.statics.all = function(callback) {
  User.find()
    .exec(function(err, users) {
      if (err) return callback(constant.DB_OPERATION_FAILED);

      callback(null, users ? users : []);
    });
}

UserSchema.statics.resend_email = function(email, type, callback) {
  var hash_code = key => {
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex');
  }

  if (type == 'verify') {
    User.findOne({email})
      .exec(function(e, user) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        if (!user) return callback(constant.AUTH_NOT_EXIST);
        if (user.emailConfirmed) return callback(constant.AUTH_ALREADY_VERIFIED);

        if (user.hashEmailConfirmation) {
          mail.send_verification_email(user.email, user.hashEmailConfirmation);
          return callback(null, user);
        } else {
          user.hashEmailConfirmation = hash_code(+new Date() + user.email);
          user.save(function(e) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            mail.send_verification_email(user.email, user.hashEmailConfirmation);
            return callback(null, user);
          });
        }
      });
  } else if (type == 'reset') {
    User.findOne({email})
      .exec(function(e, user) {
        if (e) return callback(constant.DB_OPERATION_FAILED);
        if (!user) return callback(constant.AUTH_NOT_EXIST);

        if (user.hashPasswordReset) {
          mail.send_reset_password_email(user.email, user.hashPasswordReset);
          return callback(null, user);
        } else {
          user.hashPasswordReset = hash_code(+new Date() + user.email);
          user.save(function(e) {
            if (e) return callback(constant.DB_OPERATION_FAILED);
            mail.send_reset_password_email(user.email, user.hashPasswordReset);
            return callback(null, user);
          });
        }
      });
  }
}

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
}

UserSchema.methods.get_packs = function(callback) {
  var level = this.stripe.plan ? constant.stripeOptions.planData[this.stripe.plan].level : 0;
  Pack.all_by_level(level, callback);
}

UserSchema.methods.get_locked_packs = function(callback) {
  var level = this.stripe.plan ? constant.stripeOptions.planData[this.stripe.plan].level : 0;
  Pack.locked_all_by_level(level, callback);
}

UserSchema.methods.get_pack_by_name = function(name, callback) {
  var level = this.stripe.plan ? constant.stripeOptions.planData[this.stripe.plan].level : 0;

  Pack.find_by_name(name, function(e, pack) {
    if (e) return callback(e);

    if (level < pack.requiredLevel) {
      return callback(constant.PACK_NOT_ALLOWED);
    }
    
    return callback(null, pack);
  });
}

UserSchema.methods.make_a_transaction = function(amount, description) {
  var transaction = new Transaction({
    description,
    previousCoins: this.coins,
    amount,
    currentCoins: this.coins + amount
  });
  user.transactions.unshift(transaction);
  user.save(function(e) {
    if (e) return callback(constant.DB_OPERATION_FAILED);
    return callback(null, transaction);
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;

