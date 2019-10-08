module.exports.function = function infoSearch (infoInput) {
  
  var http = require('http')
  var console = require('console')
  var config = require('config')
  
  // develope center -> team -> add secret -> write 'var secret = require('secret');' 
  var param = "?" + encodeURIComponent('ServiceKey') + '=' + "YSvQTOwm%2Bx9GAYACyyI9CrvZtkytIuGeZvzjWqDL3lvoWlu7kBMPdRH4N4pysHquS%2BHCaf5LsqKikqmyYIJwKg%3D%3D";
  param += "&" + encodeURIComponent('prdlstNm') + '=' + encodeURIComponent(infoInput);
  param += "&returnType=json";
  var infoResult = http.getUrl(config.get('remote.url') + param, { format: 'json' });
  
  //let findAllergyResult = "찾은 결과";
   return infoResult.list;
}
