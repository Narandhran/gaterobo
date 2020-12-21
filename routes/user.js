const userCtl = require('../controllers/user');
const { AdminOnly, AllUsers } = require('../utils/auth.util');
const user = require('../models/user');

module.exports = app => {
    /**
     * Admin only
     */
    app.get('/user/list', AdminOnly, userCtl.list);
    /**
     * All users
     */
    app.post('/user/register', userCtl.register);
    app.post('/user/login', userCtl.login);
    app.post('/user/sign-up-verification',userCtl.verifyOtp);
    // app.get('/user/requestOtp/:mobile', userCtl.requestOtp);

    /**
     * Verified Users
     */
    app.put('/user/update_dp', AllUsers, userCtl.updateDp);
    app.get('/user/my_profile', AllUsers, userCtl.getProfileInfo);
    app.put('/user/update_profile', AllUsers, userCtl.updateProfile);
};