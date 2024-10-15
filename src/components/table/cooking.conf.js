var cooking = require('cooking');
var gen = require('../../build/gen-single-config');

cooking.set(gen(__dirname, 'OdsTable', '_index.js'));

module.exports = cooking.resolve();
