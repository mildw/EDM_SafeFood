var remoteDB = require('./lib/remoteDB.js')
<<<<<<< HEAD

=======
>>>>>>> e3359ef00f93a4e72e9cfcaadef7397d841da7af
var console = require('console');
module.exports.function = function ($vivContext) {
  const bixbyUserId = $vivContext.userId;
  return remoteDB.getMyFoodStat(bixbyUserId)
}
