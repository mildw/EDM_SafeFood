module.exports.function = function restaurantFind(restaurantLocation, restaurantName) {
  var console = require('console');
  var http = require('http');
  var fail = require('fail');
  try {
    var result = [];
    var copy = [];
    var url = 'http://54.180.149.204/restaurant/selectRestaurant.php'; //이 주소 뺴놓으면 될듯
    var queryParams = '?' + 'location=' + restaurantLocation;

    result = http.getUrl(url + queryParams,
      { format: 'json' });
    console.log(result);


    if (restaurantName) {
      copy = result.filter(function (restaurant) {
        return restaurant.name.includes(restaurantName);
      });
    }

    if (copy.length == 0) {
      return result;
    }else{
      return copy;
    }

  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}