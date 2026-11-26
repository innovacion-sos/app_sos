const P = require('./_profiles'), { decode } = require('./_token');
module.exports = id => P[id] || (id.length > 40 ? decode(id) : null);
