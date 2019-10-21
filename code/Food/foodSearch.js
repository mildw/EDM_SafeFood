module.exports.function = function foodSearch(foodName) {

  var http = require('http');
  var console = require('console');
  var config = require('config');
  var secret = require('secret');

  var param = "?" + encodeURIComponent('ServiceKey') + '=' + secret.get('foodkey');
  param += "&" + encodeURIComponent('prdlstNm') + '=' + encodeURIComponent(foodName);
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

  // var nutriName = ["칼로리", "열량", "탄수화물", "지방", "나트륨", "당류"];
  // var nutriEng = ["calorie", "calorie", "carbo", "fat", "natrium", "sugar"];
  // var nutriSym = ["kcal", "kcal", "g", "g", "mg", "g"];
  var nutriName = ["칼로리", "탄수화물", "지방", "나트륨", "당류", "단백질"];
  var nutriEng = ["calorie", "carbo", "fat", "natrium", "sugar", "protein"];
  var nutriSym = ["kcal", "g", "g", "mg", "g", "g"];
  // 영양소 정보나 알레르기 정보가 없으면 보여주지 않기
  // 상품명의 띄어쓰기 지우기
  for (var i = 0; i < list.length; i++) {
    if (list[i]['nutrient'] == '알수없음' || list[i]['allergy'] == '알수없음' || Nm.indexOf(list[i]['prdlstNm']) != -1) {
      //console.log(Nm.indexOf(list[i]['prdlstNm']) + " " + list[i]['prdlstNm']);
      continue;
    }

    list[i]['prdlstNm'] = list[i]['prdlstNm'].replace(/ /gi, '');
    list[i]['nutrient'] = list[i]['nutrient'].replace(/[,]| |\(.*\)/gi, '');
    list[i]['nutrient'] = list[i]['nutrient'].toLowerCase();

    for (var j = 0; j < 6; j++) {
      list[i][nutriEng[j]] = '-';
      if (list[i]['nutrient'].indexOf(nutriName[j]) != -1) {
        var sta = list[i]['nutrient'].indexOf(nutriName[j]);
        var end = list[i]['nutrient'].indexOf(nutriSym[j], sta);
        var val = list[i]['nutrient'].substr(sta + nutriName[j].length, end - sta - nutriName[j].length);
        list[i][nutriEng[j]] = val;
      }
    }


    ////// 차트를 그릴 수 없는 경우 삽입할 default 이미지 정하기
    list[i]['chart'] = '-';
    ////////////////차트 넣기
    var url = 'http://54.180.149.204/chart/';
    var queryParams = 'test.php';
    queryParams += '?' + 'carbo=' + list[i]['carbo'];
    queryParams += '&' + 'fat=' + list[i]['fat'];
    queryParams += '&' + 'natrium=' + list[i]['natrium'] / 1000;
    queryParams += '&' + 'sugar=' + list[i]['sugar'];
    queryParams += '&' + 'protein=' + list[i]['protein'];

    if (list[i]['carbo'] != '-' && list[i]['fat'] != '-' && list[i]['natrium'] != '-' && list[i]['sugar'] != '-' && list[i]['protein'] != '-') {
      var chartImg = http.getUrl(url + queryParams, { format: 'text' });
      list[i]['chart'] = chartImg;
    }

    Nm.push(list[i]['prdlstNm']);
    res.push(list[i]);
  }
  console.log(Nm);
  console.log(res);

  // res 배열의 이름 길이순으로 정렬해서 리턴
  function comparator(a, b) {
    return a['prdlstNm'].length > b['prdlstNm'].length ? 1 : -1;
  }
  res.sort(comparator);
  //let findAllergyResult = "찾은 결과";
  return res;
}
