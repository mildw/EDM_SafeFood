var remoteDB = require('./lib/remoteDB.js')

var console = require('console');
module.exports.function = function ($vivContext, food) {
  const bixbyUserId = $vivContext.userId;

  console.log("여기까진 잘 왔음!")
  console.log(food['imgurl1']);
  var myFoodImg = new Array;
  for (var i = 0; i < food.length; i++) {
    myFoodImg.push(food['imgurl1']);
  }
  myFoodImg.push("!?");

  return myFoodImg;
  //return remoteDB.getMyFoodStat(bixbyUserId)
}
