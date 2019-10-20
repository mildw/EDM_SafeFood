var remoteDB = require('./lib/remoteDB.js')

module.exports.function = function ($vivContext, myFoodName) {
  const bixbyUserId = $vivContext.userId
  return remoteDB.deleteOneFood(bixbyUserId, myFoodName)
}
