var remoteDB = require('./lib/remoteDB.js')

var console = require('console')
module.exports.function = function ($vivContext, food) {
  //const bixbyUserId = $vivContext.bixbyUserId
  const bixbyUserId = $vivContext.userId;
  console.log(bixbyUserId)
  return remoteDB.putMyFood(bixbyUserId, food)
}
