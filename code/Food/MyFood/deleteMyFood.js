var remoteDB = require('./lib/remoteDB.js')

module.exports.function = function ($vivContext, myFood) {
  const bixbyUserId = $vivContext.userId
  return remoteDB.deleteMyFood(bixbyUserId, myFood)
}
