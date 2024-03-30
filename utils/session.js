const { set } = require("mongoose");

module.exports = session = {
  get: function (req) {
    if (req.signedCookies.Session) {
      return JSON.parse(req.signedCookies.Session);
    }
    if (req.cookies.Session) {
      return JSON.parse(req.cookies.Session);
    }
    return null;
  },
};
