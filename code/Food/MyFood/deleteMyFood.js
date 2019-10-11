var remoteDB = require('./lib/remoteDB.js')

module.exports.function = function ($vivContext, myFood) {
  return remoteDB.deleteMyFood(myFood)
}
