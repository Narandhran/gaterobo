const Razorpay = require('razorpay');
const crypto = require('crypto');
const {key_id,key_secret} = require('../../utils/constant').razorPay;
var instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
});


module.exports.createPayment = async (options, cb) => {
    let { amount, currency = 'INR', receipt, payment_capture = 1, notes } = options;
    await instance.orders.create({
        amount: amount,
        currency: currency,
        receipt: receipt,
        payment_capture: payment_capture,
        notes: notes
    }, (err, result) => {
        cb(err, result);
    });
};

module.exports.verify = async (orderId, paymentId, signature) => {
    var generatedSignature = await crypto
        .createHmac('SHA256', key_secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');
    return (generatedSignature == signature);
};