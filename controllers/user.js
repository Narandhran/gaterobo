const { register, login, requestOtp, updateDp, getProfileInfo, updateProfile,
    list } = require('../services/user');
const { successHandler, errorHandler } = require('../utils/handler');

module.exports = {
    register: (req, res) => {
        register(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Successfully registered', {});
        });
    },
    login: (req, res) => {
        login(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Login success', result);
        });
    },
    requestOtp: (req, res) => {
        requestOtp(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Otp sent successfully', result);
        });
    },
    updateDp: (req, res) => {
        updateDp(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Display picture updated', result);
        });
    },
    getProfileInfo: (req, res) => {
        getProfileInfo(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Success', result);
        });
    },
    updateProfile: (req, res) => {
        updateProfile(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Updated', result);
        });
    },
    /**
     * Admin Only
     */
    list: (req, res) => {
        list(req, (err, result) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Success', result);
        });
    }
};