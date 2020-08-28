const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config');

exports.createToken = function(id) {
      const payload = {
            sub: id,
            iat: moment().unix(),
            exp: moment().add(config.TOKEN_TIME, "minutes").unix(),
          };
      console.log(config.TOKEN_SECRET);
      return jwt.encode(payload, config.TOKEN_SECRET);
    };