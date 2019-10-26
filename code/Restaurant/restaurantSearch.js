module.exports.function = function restaurantSearch (myPoint) {
 var console = require('console');

  var http = require('http');
  var fail = require('fail');
  try {
    var searchResult = [];
    var url = 'http://54.180.149.204/restaurant/searchRange.php'; //이 주소 뺴놓으면 될듯
    var sp = myPoint;
    var queryParams = '?' + 'lat='+ sp.point.latitude;
    queryParams += '&'+ 'lng='+sp.point.longitude;
    
    
    searchResult = http.getUrl(url+queryParams,
      { format: 'json' });
    return searchResult;
  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}