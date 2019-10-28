var remoteDB = require('./lib/remoteDB.js')

module.exports.function = function ($vivContext) {
  const bixbyUserId = $vivContext.bixbyUserId
  //const bixbyUserId = $vivContext.userId;
  return remoteDB.deleteAllFood(bixbyUserId)
}
