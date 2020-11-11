var onlyNumber = '123456789';
var onlySmallCase = 'abcdefghijklmnopqrstuvwxyz';
var onlyBigCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var alphaNumeric = `${onlyNumber}${onlySmallCase}${onlyBigCase}`;
var specialString = `${alphaNumeric}_@-#`;
const uuidConstant = '0000000000000000000';

var autoIdGen = (genLength, getChar) => {
    var length = genLength;
    var charset = getChar;
    persisted = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        persisted += charset.charAt(Math.floor(Math.random() * n));
    }
    return persisted;
};

module.exports = { onlyNumber, onlySmallCase, onlyBigCase, alphaNumeric, specialString, autoIdGen, uuidConstant };