const moment = require("moment");

function formatMessag(username, text) {
  return { username, text, time: moment().format("h:mm a") };
}

module.exports = formatMessag;
