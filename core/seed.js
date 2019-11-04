var Admin = require('../models/admin');
var Pack = require('../models/pack');

var admin = {
    username: 'admin',
    password: 'admin'
}

var stressPack = {
    guideBreathsPerMin: 2.73,
    archived: false,
    breathPattern: {
        inHale: 6,
        holdIn: 5,
        exHale: 6,
        holdEx: 5
    },
    audio: "/assets/others/stress.mp3",
    sessionBackground: "/assets/others/stress.jpg",
    link: "/stress",
    icon: "/assets/others/stress.svg",
    backgroundGradientBottomColor: "#E83AA8",
    backgroundGradientTopColor: "#3A0075",
    imageUrl: "/assets/others/stress.png",
    description: "Get rid of stress with ease!",
    name: "Stress",
}

Admin.create(admin, function (e) {
    if (e) {
        throw e;
    }
});

// Pack.create(stressPack, function (e) {
//     if (e) {
//         throw e;
//     }
// });