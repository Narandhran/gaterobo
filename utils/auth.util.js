const { tokenVerification, authorize } = require('../middlewares/auth');

module.exports = {
    AdminOnly: [tokenVerification, authorize(['ADMIN'])],
    VendorAndAdmin: [tokenVerification, authorize(['ADMIN', 'VENDOR'])],
    AllUsers: [tokenVerification, authorize(['ADMIN', 'VENDOR', 'USER'])]
};