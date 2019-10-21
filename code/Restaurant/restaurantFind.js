module.exports.function = function restaurantFind(restaurantLocation, restaurantName) {
  var console = require('console');
  var http = require('http');
  var result = [];
  var url = 'http://54.180.149.204/restaurant/selectRestaurant.php'; //이 주소 뺴놓으면 될듯
  var queryParams = '';
  queryParams += '?'+'location='+restaurantLocation;
  var param={
    servername:"localhost",
    username:"root",
    password:"123300",
    dbname:"bixby",
    location : restaurantLocation
  }
  result = http.postUrl(url ,param,
    { format: 'json' });
  console.log(result);

  
  if (restaurantName) {
    result = result.filter(function (restaurant) {
      return restaurant.name.includes(restaurantName);
    });
  }

  console.log(result);

  return result;
}
