var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    description:            { type: String, default: '' },

    previousCoins:          { type: Number, default: 0  },
    amount:                 { type: Number, default: 0  },
    currentCoins:           { type: Number, default: 0  },

    timestamp:              { type: Date,   default: Date.now}
});

var Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = {
    Transaction,
    TransactionSchema
}