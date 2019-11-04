var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
    packType:               { type: String, default: '' },
    totalSessionTime:       { type: Number, default: 0  },
    totalXP:                { type: Number, default: 0  },
    breathCycles:           { type: Number, default: 0  },
    breathsPerMin:          { type: Number, default: 0  },

    // topOfBreathData:        { type: Array,  default: [] },
    topOfBreathAvg:         { type: Number, default: 0  },

    breathDepthTimestamps:  { type: Array,  default: [] },
    breathDepthData:        { type: Array,  default: [] },

    // guideAccuracyData:      { type: Array,  default: [] },
    guideAccuracyAvg:       { type: Number, default: 0  },

    timestamp:              { type: Date,   default: Date.now}
});

var Session = mongoose.model('Session', SessionSchema);
module.exports = {
    Session,
    SessionSchema
}