module.exports.function = function restaurantSearch (myPoint) {
 var console = require('console');
  var http = require('http');
  var searchResult = [];
  var url = 'http://54.180.149.204/restaurant/'; //이 주소 뺴놓으면 될듯
  var sp = myPoint;
  var queryParams = 'searchRange.php';
  queryParams += '?' + 'lat='+ sp.point.latitude;
  queryParams += '&'+ 'lng='+sp.point.longitude;
  searchResult = http.getUrl(url+queryParams,
    { format: 'json' });
  return searchResult;
}