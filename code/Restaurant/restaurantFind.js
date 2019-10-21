module.exports.function = function restaurantFind(restaurantLocation, restaurantName) {
  var console = require('console');
  var http = require('http');
  var result = [];
  var url = 'http://54.180.149.204/restaurant/'; //이 주소 뺴놓으면 될듯
  var queryParams = 'selectRestaurant.php';
  //queryParams += '?' + 'name='+restaurantName;
  //queryParams += '&'+'location='+restaurantLocation;
  queryParams += '?'+'location='+restaurantLocation;

  result = http.getUrl(url + queryParams,
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
