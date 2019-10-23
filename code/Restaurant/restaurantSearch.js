module.exports.function = function restaurantSearch (myPoint) {
 var console = require('console');
  var http = require('http');
  var searchResult = [];
  var url = 'http://54.180.149.204/restaurant/searchRange.php'; //이 주소 뺴놓으면 될듯
  var sp = myPoint;
  var param = {
    servername:"localhost",
    username:"root",
    password:"123300",
    dbname:"bixby",
    lat : sp.point.latitude,
    lng : sp.point.longitude
  }
  searchResult = http.postUrl(url, param,
    { format: 'json' });
  return searchResult;
}