var http = require('http');
var console = require('console');

module.exports.function = function foodCompare(food, foodTwo) {
  console.log(food);
  console.log(foodTwo);
  //각 성분을 비교하고, 1번이 더 큰경우 -1 // 비교가 불가능 (같거나 Integer가 아니면)이면 0 // 2번이 더 큰 경우 1
  var nutriEng = ["calorie", "carbo", "fat", "protein", "natrium", "sugar"];
  var res = new Array;
  var flag = true;
  for (var i = 0; i < 6; i++) {
    if (i >= 1 && (food[nutriEng[i]] == '-' || foodTwo[nutriEng[i]] == '-'))
      flag = false;
    if (food[nutriEng[i]]*1 > foodTwo[nutriEng[i]]*1) {
      res.push(-1);
      //console.log(nutriEng[i] + " item1:" + food[nutriEng[i]] + " ::: item2:" + foodTwo[nutriEng[i]] + " ==결과 -1")
    }
    else if (food[nutriEng[i]]*1 < foodTwo[nutriEng[i]]*1) {
      res.push(1);
      //console.log(nutriEng[i] + " item1:" + food[nutriEng[i]] + " ::: item2:" + foodTwo[nutriEng[i]] + " ==결과 1")
    }
    else {
      res.push(0);
      //console.log(nutriEng[i] + " item1:" + food[nutriEng[i]] + " ::: item2:" + foodTwo[nutriEng[i]] + " ==결과 0")
    }
  }

  ////// 차트를 그릴 수 없는 경우 삽입할 default 이미지 정하기
  var chartImg = '-';
  if (flag == true) {
    ////////////////차트 넣기
    var url = 'http://54.180.149.204/chart/';
    var queryParams = 'getCompareChart.php';
    queryParams += '?' + 'carbo1=' + food['carbo'];
    queryParams += '&' + 'fat1=' + food['fat'];
    queryParams += '&' + 'natrium1=' + food['natrium'] / 1000;
    queryParams += '&' + 'sugar1=' + food['sugar'];
    queryParams += '&' + 'protein1=' + food['protein'];
    queryParams += '&' + 'carbo2=' + foodTwo['carbo'];
    queryParams += '&' + 'fat2=' + foodTwo['fat'];
    queryParams += '&' + 'natrium2=' + foodTwo['natrium'] / 1000;
    queryParams += '&' + 'sugar2=' + foodTwo['sugar'];
    queryParams += '&' + 'protein2=' + foodTwo['protein'];

    var chartImg = http.getUrl(url + queryParams, { format: 'text' });
  }

  //res 마지막 res[6] 에 차트 그림의 url이 담겨있음
  res.push(chartImg)
  return res;
}