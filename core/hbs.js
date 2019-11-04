var exphbs = require('express-handlebars');

var hbs = exphbs.create({
    helpers: {
        checked: function(value) {
            return value ? 'checked' : ''
        },
        get_length: function (obj) {
            return obj.length;
        },
    },

    extname: '.hbs'
});

module.exports = hbs;