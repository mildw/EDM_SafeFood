module.exports.function = function findRestaurant (restaurantLocation,restaurantName) {
 var console = require('console');
  var http = require('http');
  var result = [];
  if(restaurantName==null)restaurantName='';
  if(restaurantLocation==null)restaurantLocation='';
  var url = 'http://54.180.149.204/selectRestaurant.php';
  var queryParams = '?' + 'name='+restaurantName;
  queryParams += '&'+'location='+restaurantLocation; 
  
  result = http.getUrl(url+queryParams,
    { format: 'json' });
    console.log(result);

  return result;
}
