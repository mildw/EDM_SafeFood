var remoteDB = require('./lib/remoteDB.js')
var console = require('console');
module.exports.function = function ($vivContext) {
  const bixbyUserId = $vivContext.bixbyUserId;
  //const bixbyUserId = $vivContext.userId;
  return remoteDB.getMyFoodStat(bixbyUserId)
}
