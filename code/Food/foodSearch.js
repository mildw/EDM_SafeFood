module.exports.function = function foodSearch(foodName) {

  var http = require('http')
  var console = require('console')
  var config = require('config')
  var secret = require('secret')

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

  var nutriName = ["칼로리", "열량", "탄수화물", "지방", "나트륨", "당류"];
  var nutriEng = ["calorie", "calorie", "carbo", "fat", "natrium", "sugar"];
  var nutriSym = ["kcal", "kcal", "g", "g", "mg", "g"];
  // 영양소 정보나 알레르기 정보가 없으면 보여주지 않기
  // 상품명의 띄어쓰기 지우기
  for (var i = 0; i < list.length; i++) {
    list[i]['prdlstNm'] = list[i]['prdlstNm'].replace(/ /gi, '');

    ////////////////////////////////////////////////
    // nutrient 정보를 각각 성분에 따라 나누어 넣어주는 작업. 
    // 데이터가 없을시에는 0
    list[i]['nutrient'] = list[i]['nutrient'].replace(/[,]| /gi, '');
    list[i]['calorie'] = 0;
    // if (list[i]['nutrient'].indexOf("칼로리") != -1) {
    //   var sta = list[i]['nutrient'].indexOf("칼로리");
    //   var end = list[i]['nutrient'].indexOf("kcal", sta);
    //   var val = list[i]['nutrient'].substr(sta + 2, end - sta - 3);
    //   list[i]['calorie'] = val;
    // }
    // else if (list[i]['nutrient'].indexOf("열량") != -1) {
    //   var sta = list[i]['nutrient'].indexOf("열량");
    //   var end = list[i]['nutrient'].indexOf("kcal", sta);
    //   var val = list[i]['nutrient'].substr(sta + 2, end - sta - 2);
    //   list[i]['calorie'] = val;
    // }
    list[i]['carbo'] = 0;
    // if (list[i]['nutrient'].indexOf("탄수화물") != -1) {
    //   var sta = list[i]['nutrient'].indexOf("탄수화물");
    //   var end = list[i]['nutrient'].indexOf("g", sta);
    //   var val = list[i]['nutrient'].substr(sta + 4, end - sta - 4);
    //   list[i]['carbo'] = val;
    // }
    list[i]['fat'] = 0;
    // if (list[i]['nutrient'].indexOf("지방") != -1) {
    //   var sta = list[i]['nutrient'].indexOf("지방");
    //   var end = list[i]['nutrient'].indexOf("g", sta);
    //   var val = list[i]['nutrient'].substr(sta + 2, end - sta - 2);
    //   list[i]['fat'] = val;
    // }
    list[i]['natrium'] = 0;
    // if (list[i]['nutrient'].indexOf("나트륨") != -1) {
    //   var sta = list[i]['nutrient'].indexOf("나트륨");
    //   var end = list[i]['nutrient'].indexOf("mg", sta);
    //   var val = list[i]['nutrient'].substr(sta + 3, end - sta - 3);
    //   list[i]['natrium'] = val;
    // }
    list[i]['sugar'] = 0;
    // if (list[i]['nutrient'].indexOf("당류") != -1) {
    //   var sta = list[i]['nutrient'].indexOf("당류");
    //   var end = list[i]['nutrient'].indexOf("g", sta);
    //   var val = list[i]['nutrient'].substr(sta + 2, end - sta - 2);
    //   list[i]['sugar'] = val;
    // }

    for (var j = 0; j < 6; j++) {
      if (list[i]['nutrient'].indexOf(nutriName[j]) != -1) {
        var sta = list[i]['nutrient'].indexOf(nutriName[j]);
        var end = list[i]['nutrient'].indexOf(nutriSym[j], sta);
        var val = list[i]['nutrient'].substr(sta + nutriName[j].length, end - sta - nutriName[j].length);
        list[i][nutriEng[j]] = val;
      }
    }

    if (list[i]['nutrient'] != '알수없음' && list[i]['allergy'] != '알수없음' && Nm.indexOf(list[i]['prdlstNm']) == -1) {
      Nm.push(list[i]['prdlstNm']);
      res.push(list[i]);
    }
    //console.log(list[i]['nutrient']);

  }
  console.log(list[0]['calorie']);

  // res 배열의 이름 길이순으로 정렬해서 리턴
  function comparator(a, b) {
    return a['prdlstNm'].length > b['prdlstNm'].length ? 1 : -1;
  }
  res.sort(comparator);
  //let findAllergyResult = "찾은 결과";
  return res;
}
