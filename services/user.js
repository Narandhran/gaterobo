const { User } = require('../models/user');
const { loadMulter } = require('../services/custom/multers3.service');
const config = require('../config')[process.env.NODE_ENV];
const { onlyNumber, autoIdGen } = require('../utils/autogen');
const { s3, smsGateWay } = require('../utils/constant');
const { encrypt, validate } = require('./custom/crypto.service');
const { sign } = require('./custom/jwt.service');
const moment = require('moment');
const { request } = require('express');

const axios = require('axios').default;

const tempOrgCode = ['GROBO001', 'GROBO002', 'GROBO003', 'GROBO004', 'GROBO005'];
const tempOtp = [1761, 1254, 1165, 1187, 7986, 2305];
module.exports = {
    register: async (request, cb) => {
        let regObj = request.body;
        let isUserExist = await User.findOne({ 'mobile': regObj.mobile });
        if (isUserExist) cb(new Error('User already exist', {}));
        else {
            regObj.password = encrypt(regObj.password);
            if (request.query.isAdmin == 'true') {
                if (!regObj.orgCode) cb(new Error('Organization code is must for Admin'), {});
                else {
                    if (!(tempOrgCode.some((v, i) => {
                        return v == regObj.orgCode;
                    }))) cb(new Error('Organization code is invalid'), {})
                    else {
                        regObj.role = 'ADMIN';
                        await User.create(regObj, async (err, result) => {
                            cb(err, result);
                        });
                    }
                }
            } else {
                regObj.orgCode = null;
                await User.create(regObj, async (err, result) => {
                    cb(err, result);
                });
            }
            // await axios.get(smsGateWay.uri(isUserExist.mobile, `Hi ${isUserExist.fullname}, you've successfully registered from GatePass. Verification link has been sent to your email. Team MYGATE.`));
        }
    },
    login: async (request, cb) => {
        let { username, password } = request.body;
        let isUser = await User.findOne({ 'mobile': username });
        if (!isUser.isVerified) cb(new Error('User is not verified yet'));
        else if (isUser) {
            try {
                if (validate(password, isUser.password)) {
                    let token = {};
                    token = sign({
                        _id: isUser._id,
                        email: isUser.email,
                        role: isUser.role,
                        fullname: isUser.fname
                    });
                    cb(null, token);
                    // await isUser.save();
                } else cb(new Error('Incorrect password, try again'), {});
            } catch (e) { cb(e, {}); };
        } else cb(new Error('Mobile number not registered'), {});
    },
    requestOtp: async (request, cb) => {
        /*
           let { mobile } = request.params;
           var isUser = await User.findOne({ 'mobile': mobile });
           if (isUser) {
               if (isUser.status == 'Approved') {
                   cb(null, 'OTP sent successfully');
                   let otp = autoIdGen(4, onlyNumber);
                   isUser.verify.otp = otp;
                   isUser.verify.expire = new Date();
                   await isUser.save();
                   async function makeGetRequest() {
                       let res = await axios.get(smsGateWay.uri(mobile, `Hi ${isUser.fullname}, your OTP is ${otp} will expire in another 15 mins. Kindly use this for login, don't share it with anyone. Have a great day, Team SWADHARMAA.`));
                       let data = res.data;
                   }
                   await makeGetRequest();
               } else if (isUser.status == 'Pending') {
                   cb(new Error('Your account is not yet verified, please try after sometimes or contact administratior!', {}));
               } else cb(new Error('Your account is blocked, contact administratior!', {}));
           } else cb(new Error('User not exist, please register!'), {});
       */
    },
    verifyOtp: async (request, cb) => {
        let { mobile, otp } = request.body;
        let isUser = await User.findOne({ 'mobile': mobile });
        if (isUser) {
            if (!(tempOtp.some((v, i) => {
                return v == otp;
            }))) cb(new Error('OTP entered is invalid'), {});
            else {
                isUser.isVerified = true;
                isUser.save();
                cb(null, 'Verified successfully');
            }
        } else cb(new Error('Invalid mobile number'), {});
    },
    updateDp: async (request, cb) => {
        let upload = loadMulter(5, 'dp').single('dp');
        await upload(request, null, (err) => {
            if (err)
                cb(err);
            else {
                User
                    .findByIdAndUpdate(request.verifiedToken._id, {
                        dp: request.file.key
                    }, { new: true })
                    .exec((err, result) => {
                        cb(err, request.file.key);
                    });
            }
        });
    },
    getProfileInfo: async (request, cb) => {
        await User
            .findById(request.verifiedToken._id, 'fname lname dp email gender mobile')
            .exec((err, result) => {
                cb(err, result);
            });
    },
    updateProfile: async (request, cb) => {
        await User
            .findOneAndUpdate({ _id: request.verifiedToken._id },
                request.body, { new: true })
            .exec((err, result) => {
                cb(err, result);
            });
    },
    list: async (request, cb) => {
        await User
            .find({ _id: { '$ne': request.verifiedToken._id } }, '_id fname lname dp email gender mobile status')
            .exec((err, result) => {
                cb(err, result);
            });
    }
};