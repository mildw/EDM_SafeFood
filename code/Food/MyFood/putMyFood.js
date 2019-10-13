var remoteDB = require('./lib/remoteDB.js')

var console = require('console')
module.exports.function = function ($vivContext, food) {
  const bixbyUserId = $vivContext.userId
  console.log(food)
  return remoteDB.putMyFood(bixbyUserId, food)
}
