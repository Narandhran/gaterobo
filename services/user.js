const { User } = require('../models/user');
const { loadMulter } = require('../services/custom/multers3.service');
const config = require('../config')[process.env.NODE_ENV];
const { onlyNumber, autoIdGen } = require('../utils/autogen');
const { s3, smsGateWay } = require('../utils/constant');
const { sign } = require('./custom/jwt.service');
const moment = require('moment');
const { request } = require('express');

const axios = require('axios').default;

module.exports = {
    register: async (request, cb) => {
        let isUserExist = await User.findOne({ 'mobile': request.body.mobile });
        if (isUserExist) cb(new Error('User already exist', {}));
        else {
            await User.create(request.body, async (err, result) => {
                cb(err, result);
            });
            // await axios.get(smsGateWay.uri(isUserExist.mobile, `Hi ${isUserExist.fullname}, you've successfully registered from GatePass. Verification link has been sent to your email. Team MYGATE.`));
        }
    },
    login: async (request, cb) => {
        /*  let { mobile, otp, fcmToken = null, deviceId = null } = request.body;
          let isUser = await User.findOne({ 'mobile': mobile });
          if (isUser) {
              if (isUser.verify.expire < moment(isUser.verify.expire).add(15, 'm').toDate()) {
                  if (isUser.verify.otp == otp) {
                      let token = {};
                      isUser.fcmToken = fcmToken;
                      isUser.deviceId = deviceId;
                      try {
                          token = sign({
                              _id: isUser._id,
                              email: isUser.email,
                              role: isUser.role,
                              fullname: isUser.fullname,
                              deviceId: deviceId
                          });
                          cb(null, { role: isUser.role, token, rpath: s3.basePath });
                          await isUser.save();
                      } catch (e) { cb(e, {}); };
                  } else cb(new Error('OTP invalid, try again!'), {});
              } else cb(new Error('OTP expired'));
          } else cb(new Error('Mobile number not registered'), {});
          */

        let isUser = await User.findOne({ mobile: request.body.username }).lean();
        if (isUser) cb(null, isUser)
        else cb(new Error('Mobile not registered'), null);
    },
    requestOtp: async (request, cb) => {
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