const { model, Schema } = require('mongoose');
var userSchema = new Schema({
    dp: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value);
            },
            message: '{VALUE} is not a valid email'
        },
        required: [true, 'Email is required'], minlength: 7, maxlength: 32
    },
    fname: { type: String, required: true, minlength: 3, maxlength: 16 },
    lname: { type: String, required: false, maxlength: 16 },
    fcmToken: { type: String, required: false },
    countryCode: { type: String, required: false, minlength: 2, maxlength: 3 },
    mobile: { type: String, unique: true, required: true },
    gender: { type: String, required: false, enum: ['male', 'female', 'other'], minlength: 4, maxlength: 6 },
    verify: {
        otp: { type: Number, require: true },
        expire: { type: Date }
    },
    role: {
        type: String,
        default: 'USER',
    },
    deviceId: {
        type: String
    }
}, { timestamps: true });

userSchema.virtual('fullname').get(function () {
    return `${this.fname} ${this.lname}`;
});
userSchema.plugin(require('mongoose-unique-validator'));
var User = model('user', userSchema);
module.exports = { User };