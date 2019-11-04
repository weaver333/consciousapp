const constant = {
    AUTH_NOT_VERIFIED:              0x10000,
    AUTH_NOT_EXIST:                 0x10001,
    AUTH_WRONG_PASSWORD:            0x10002,
    AUTH_ALREADY_VERIFIED:          0x10003,
    AUTH_ALREADY_EXIST:             0x10004,

    DB_OPERATION_FAILED:            0x20000,

    EMPTY_FIELD:                    0x30000,
    INVALID_EMAIL:                  0x30001,
    PASSWORD_NOT_MATCHED:           0x30002,

    PACK_NOT_EXIST:                 0x40000,
    PACK_NOT_ALLOWED:               0x40001,

    STRIPE_INVALID_CARD:            0x50000,
    STRIPE_CARD_DECLINED:           0x50001,
    STRIPE_UNEXPECTED_ERROR:        0x50002,
    STRIPE_SAME_PLAN:               0x50003,
    STRIPE_MISSING_CARD:            0x50004,

    LOCATION_DUPLICATE_REQUEST:     0x60000,

    SESSION_NOT_EXIST:              0x70000,

    OFFER_NOT_EXIST:                0x80000,

    MESSAGES: {
        0x20000:                    'Invalid request, please try again later.',
        
        0x10000:                    'Email is not verified yet, please verify your email.',
        0x10001:                    'Seems like you don\'t have an account with us. Sign up below!',
        0x10002:                    'Please type correct password.',
        0x10003:                    'Already verified, please login now.',
        0x10004:                    'Email is registered already, please sign in using the button below.',

        0x30000:                    'You need to type required fields',
        0x30001:                    'Email is invalid format.',
        0x30002:                    'Passwords do not match.',

        0x40000:                    'Pack is not exist.',
        0x40001:                    'Pack is not allowed for you.',

        0x50000:                    'Please provide valid card',
        0x50001:                    'Your card was declined. Please provide a valid card.',
        0x50002:                    'An unexpected error occurred.',
        0x50003:                    'The selected plan is the same as the current plan.',
        0x50004:                    'Please add a card to your account before choosing a plan.',

        0x60000:                    'Duplicate request',

        0x70000:                    'Session does not exists.',

        0x80000:                    'Offer is not exist.',
    },

    uploadDir:                      '/assets/uploads/',

    stripeOptions: {
        apiKey: process.env.STRIPE_KEY || '',
        stripePubKey: process.env.STRIPE_PUB_KEY || '',
        defaultPlan: 'free',
        plans: ['free', 'premium', 'pro'],
        planData: {
            'free': {
                name: 'Free',
                price: 0,
                level: 0,
            },
            'premium': {
                name: 'Premium',
                price: 11.99,
                level: 1
            },
            'pro': {
                name: 'Premium Pro',
                price: 15.99,
                level: 2
            }
        }
    },

    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_KEY || '',
        region: process.env.AWS_REGION || '',
        bucketName: 'consciouspacks'
    }
}

module.exports = constant