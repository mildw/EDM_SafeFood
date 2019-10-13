module.exports.function = function searchRestaurant (isourcePoint) {
 var console = require('console');
  var http = require('http');
  var searchResult = [];
  var url = 'http://54.180.149.204/';
  var sp = isourcePoint;
  var queryParams = 'searchRange.php';
  queryParams += '?' + 'lat='+ sp.point.latitude;
  queryParams += '&'+ 'lng='+sp.point.longitude;
  searchResult = http.getUrl(url+queryParams,
    { format: 'json' });
  return searchResult;
}