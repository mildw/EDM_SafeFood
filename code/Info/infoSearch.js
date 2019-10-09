module.exports.function = function infoSearch(infoInput) {

  var http = require('http')
  var console = require('console')
  var config = require('config')

  // develope center -> team -> add secret -> write 'var secret = require('secret');' 
  var param = "?" + encodeURIComponent('ServiceKey') + '=' + "YSvQTOwm%2Bx9GAYACyyI9CrvZtkytIuGeZvzjWqDL3lvoWlu7kBMPdRH4N4pysHquS%2BHCaf5LsqKikqmyYIJwKg%3D%3D";
  param += "&" + encodeURIComponent('prdlstNm') + '=' + encodeURIComponent(infoInput);
  param += "&" + encodeURIComponent('numOfRows') + '=' + "30";
  param += "&returnType=json";
  var infoResult = http.getUrl(config.get('remote.url') + param, { format: 'json' });

  var list = infoResult.list;
  //리스트의 등록 번호를 높은 순으로 정렬
  function comparator(a, b) {
    return a['prdlstReportNo'] > b['prdlstReportNo'] ? -1 : 1;
  }
  list.sort(comparator);

  // 이미 저장된 데이터가 있는지 판단하기 위한 제품명 배열
  var Nm = new Array();
  // 데이터를 가공해서 만들어줄 최종
  var res = new Array();

  // 영양소 정보나 알레르기 정보가 없으면 보여주지 않기
  // 상품명의 띄어쓰기 지우기
  for (var i = 0; i < list.length; i++) {
    list[i]['prdlstNm'] = list[i]['prdlstNm'].replace(/ /gi, '');
    if (list[i]['nutrient'] != '알수없음' && list[i]['allergy'] != '알수없음' && Nm.indexOf(list[i]['prdlstNm']) == -1) {
      Nm.push(list[i]['prdlstNm']);
      res.push(list[i]);
    }
    console.log(list[i]['allergy']);
  }
    console.log(Nm);

  // res 배열의 이름 길이순으로 정렬해서 리턴
  function comparator(a, b) {
    return a['prdlstNm'].length > b['prdlstNm'].length ? 1 : -1;
  }
  res.sort(comparator);
  //let findAllergyResult = "찾은 결과";
  return res;
}
