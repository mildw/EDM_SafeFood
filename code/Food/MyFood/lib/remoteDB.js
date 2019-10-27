//https://restdb.io/

var http = require('http')
var secret = require('secret')
var console = require('console')
var fail = require('fail')
var config = require('config')

module.exports = {
  deleteAllFood: deleteAllFood,
  deleteOneFood: deleteOneFood,
  getMyFoodList: getMyFoodList,
  getMyFoodStat: getMyFoodStat,
  putMyFood: putMyFood
}

function deleteAllFood(bixbyUserId) {
  try {
    var myFood = getMyFoodId(bixbyUserId, "")
    for (var i = 0; i < myFood.length; i++) {
      var dbId = myFood[i]
      console.log(dbId)
      var url = config.get('myFoodUrl') + "/" + dbId;
      var query = {
        apikey: secret.get('apikey'),
      }
      var options = {
        format: "json",
        query: query,
        cacheTime: 0
      }
      var response = http.deleteUrl(url, {}, options)
      if (!response) {
        return false;
      }
    }
    if (myFood.length == 0)
      return false;
    return true;
  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}

function deleteOneFood(bixbyUserId, myFoodName) {
  try {
    var myFood = getMyFoodId(bixbyUserId, myFoodName)
    for (var i = 0; i < myFood.length; i++) {
      var dbId = myFood[i]
      console.log(dbId)
      var url = config.get('myFoodUrl') + "/" + dbId;
      var query = {
        apikey: secret.get('apikey'),
      }
      var options = {
        format: "json",
        query: query,
        cacheTime: 0
      }
      var response = http.deleteUrl(url, {}, options)
      if (!response) {
        return false;
      }
    }
    if (myFood.length == 0)
      return false;
    return true;
  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}

function putMyFood(bixbyUserId, myFood) {
  try {
    const url = config.get('myFoodUrl');
    const query = {
      apikey: secret.get('apikey')
    }
    const body = {}
    body[config.get('myFoodIdField')] = bixbyUserId
    body[config.get('myFoodField1')] = JSON.stringify(myFood)
    body[config.get('myFoodField2')] = myFood['prdlstNm']
    //console.log(myFood)

    const options = {
      format: "json",
      query: query,
      cacheTime: 0
    }
    const response = http.postUrl(url, body, options)
    if (response) {
      return getMyFoodList(bixbyUserId);
    }
  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}

function getMyFoodList(bixbyUserId) {
  try {
    const url = config.get('myFoodUrl')
    const query = {
      apikey: secret.get('apikey'),
      q: "{\"" + config.get('myFoodIdField') + "\":\"" + bixbyUserId + "\"}"
    }
    const options = {
      format: "json",
      query: query,
      cacheTime: 0
    }
    const response = http.getUrl(url, options)
    function comparator(a, b) {
      return a['num'] * 1 < b['num'] * 1 ? -1 : 1;
    }
    response.sort(comparator);
    if (response) {
      var myFood = new Array;
      var len = response.length < 5 ? 0 : response.length - 5
      for (var i = response.length - 1; i >= len; i--) {
        var tmp = JSON.parse(response[i][config.get('myFoodField1')]);
        myFood.push(tmp);
        //console.log(response[i]['num'])
      }
      console.log("myFood")
      console.log(myFood)
      return myFood
    } else {
      // Doesn't exist
      return
    }
  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}
function getMyFoodStat(bixbyUserId) {
  try {
    const url = config.get('myFoodUrl')
    const query = {
      apikey: secret.get('apikey'),
      q: "{\"" + config.get('myFoodIdField') + "\":\"" + bixbyUserId + "\"}"
    }
    const options = {
      format: "json",
      query: query,
      cacheTime: 0
    }
    const response = http.getUrl(url, options)
    function comparator(a, b) {
      return a['num'] * 1 < b['num'] * 1 ? -1 : 1;
    }
    response.sort(comparator);

    if (response) {
      var statRes = new Array;
      var nutriTotal = [0, 0, 0, 0, 0];
      var len = response.length < 5 ? 0 : response.length - 5
      for (var i = response.length - 1; i >= len; i--) {
        var item = { 'statFlag': 1 };
        var tmp = JSON.parse(response[i][config.get('myFoodField1')]);
        item['statUrl'] = tmp['imgurl1'];
        var nutriEng = ["carbo", "fat", "natrium", "sugar", "protein"];
        for (var j = 0; j < 5; j++) {
          if (isNaN(tmp[nutriEng[j]] * 1) == false)
            nutriTotal[j] += tmp[nutriEng[j]] * 1;
        }
        //statRes.push(item);
        //console.log(nutriTotal[0] + " " + nutriTotal[1] + " " + nutriTotal[2] + " " + nutriTotal[3] + " " + nutriTotal[4]);
      }

      ////////////////차트 넣기
      nutriTotal[2] /= 1000;
      var chartUrl = config.get('chartBaseUrl')
      var queryParams = 'getStatChart.php';
      queryParams += '?' + 'carbo=' + nutriTotal[0];
      queryParams += '&' + 'fat=' + nutriTotal[1];
      queryParams += '&' + 'natrium=' + nutriTotal[2];
      queryParams += '&' + 'sugar=' + nutriTotal[3];
      queryParams += '&' + 'protein=' + nutriTotal[4];

      var chartImg = http.getUrl(chartUrl + queryParams, { format: 'text' });
      //myFoodImg.push(chartImg);

      var item = {
        'statFlag': 0, 'statUrl': chartImg, 'statCarbo': nutriTotal[0].toFixed(1),
        'statFat': nutriTotal[1].toFixed(1), 'statNatrium': nutriTotal[2].toFixed(1), 'statSugar': nutriTotal[3].toFixed(1), 'statProtein': nutriTotal[4].toFixed(1)
      };
      statRes.push(item);

      for (var i = response.length - 1; i >= len; i--) {
        var item = { 'statFlag': 1 };
        var tmp = JSON.parse(response[i][config.get('myFoodField1')]);
        item['statUrl'] = tmp['imgurl1'];
        var nutriEng = ["carbo", "fat", "natrium", "sugar", "protein"];
        for (var j = 0; j < 5; j++) {
          if (isNaN(tmp[nutriEng[j]] * 1) == false)
            nutriTotal[j] += tmp[nutriEng[j]] * 1;
        }
        statRes.push(item);
        //console.log(nutriTotal[0] + " " + nutriTotal[1] + " " + nutriTotal[2] + " " + nutriTotal[3] + " " + nutriTotal[4]);
      }

      return statRes;
    } else {
      // Doesn't exist
      return
    }
  } catch (e) {
    throw fail.checkedError('', 'Error', {});
  }
}

function getMyFoodId(bixbyUserId, myFoodName) {
  const url = config.get('myFoodUrl')
  const query = {
    apikey: secret.get('apikey'),
    q: "{\"" + config.get('myFoodIdField') + "\":\"" + bixbyUserId + "\"}"
  }
  const options = {
    format: "json",
    query: query,
    cacheTime: 0
  }
  const response = http.getUrl(url, options)
  function comparator(a, b) {
    return a['num'] * 1 < b['num'] * 1 ? -1 : 1;
  }
  response.sort(comparator);

  console.log(response)
  if (response) {
    const myFood = new Array;
    var cnt = 0;
    for (var i = response.length - 1; i >= 0; i--) {
      if (myFoodName == "" || response[i][config.get('myFoodField2')] == myFoodName || cnt >= 5) {
        console.log("이상품이 삭제된닷 " + response[i][config.get('myFoodField2')])
        var tmp = response[i]["_id"];
        myFood.push(tmp);
      }
      cnt++
    }
    console.log(myFood)
    return myFood
  } else {
    // Doesn't exist
    return
  }
}