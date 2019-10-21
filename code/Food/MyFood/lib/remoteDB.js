//https://restdb.io/

var http = require('http')
var secret = require('secret')
var properties = require('./properties.js')
var console = require('console')

module.exports = {
  deleteAllFood: deleteAllFood,
  deleteOneFood: deleteOneFood,
  getMyFoodList: getMyFoodList,
  getMyFoodStat: getMyFoodStat,
  putMyFood: putMyFood
}

function deleteAllFood(bixbyUserId) {
  var myFood = getMyFoodId(bixbyUserId, "")
  for (var i = 0; i < myFood.length; i++) {
    var dbId = myFood[i]
    console.log(dbId)
    var url = "https://bixby-0c0f.restdb.io/rest/edm-safefood/" + dbId;
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
}

function deleteOneFood(bixbyUserId, myFoodName) {
  var myFood = getMyFoodId(bixbyUserId, myFoodName)
  for (var i = 0; i < myFood.length; i++) {
    var dbId = myFood[i]
    console.log(dbId)
    var url = "https://bixby-0c0f.restdb.io/rest/edm-safefood/" + dbId;
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
}

function putMyFood(bixbyUserId, myFood) {
  //const url = properties.get("config", "baseUrl") + properties.get("config", "collection")
  const url = "https://bixby-0c0f.restdb.io/rest/edm-safefood"
  const query = {
    apikey: secret.get('apikey')
  }
  const body = {}
  // body[properties.get("config", "userIdField")] = bixbyUserId
  // body[properties.get("config", "myFoodField")] = myFood
  body["bixby-user-id"] = bixbyUserId
  body["my-food"] = JSON.stringify(myFood)
  body["food-name"] = myFood['prdlstNm']
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
}

function getMyFoodList(bixbyUserId) {
  const url = "https://bixby-0c0f.restdb.io/rest/edm-safefood"
  const query = {
    apikey: secret.get('apikey'),
    q: "{\"bixby-user-id\":\"" + bixbyUserId + "\"}"
  }
  const options = {
    format: "json",
    query: query,
    cacheTime: 0
  }
  const response = http.getUrl(url, options)

  console.log("response")
  console.log(response)
  if (response) {
    var myFood = new Array;
    var len = response.length < 5 ? 0 : response.length - 5
    for (var i = response.length - 1; i >= len; i--) {
      var tmp = JSON.parse(response[i]['my-food']);
      //tmp.$id = response[i]["_id"];
      myFood.push(tmp);
    }
    console.log("myFood")
    console.log(myFood)
    return myFood
  } else {
    // Doesn't exist
    return
  }
}
function getMyFoodStat(bixbyUserId) {
  const url = "https://bixby-0c0f.restdb.io/rest/edm-safefood"
  const query = {
    apikey: secret.get('apikey'),
    q: "{\"bixby-user-id\":\"" + bixbyUserId + "\"}"
  }
  const options = {
    format: "json",
    query: query,
    cacheTime: 0
  }
  const response = http.getUrl(url, options)

  if (response) {
    var myFoodImg = new Array;
    var len = response.length < 5 ? 0 : response.length - 5
    var nutriTotal = new Array;
    for (var i = response.length - 1; i >= len; i--) {
      var tmp = JSON.parse(response[i]['my-food']);
      //tmp.$id = response[i]["_id"];
      myFoodImg.push(tmp['imgurl1']);
      var nutriEng = ["carbo", "fat", "natrium", "sugar", "protein"];
      for (var j = 0; j < 5; j++) {
        if (tmp[nutriEng[j]] != '-')
          nutriTotal[j]++;
      }
    }

    ////////////////차트 넣기
    var chartUrl = 'http://54.180.149.204/chart/';
    var queryParams = 'getStatChart.php';
    queryParams += '?' + 'carbo=' + nutriTotal[0];
    queryParams += '&' + 'fat=' + nutriTotal[1];
    queryParams += '&' + 'natrium=' + nutriTotal[2] / 1000;
    queryParams += '&' + 'sugar=' + nutriTotal[3];
    queryParams += '&' + 'protein=' + nutriTotal[4];

    var chartImg = http.getUrl(chartUrl + queryParams, { format: 'text' });
    myFoodImg.push(chartImg);

    return myFoodImg
  } else {
    // Doesn't exist
    return
  }
}

function getMyFoodId(bixbyUserId, myFoodName) {
  const url = "https://bixby-0c0f.restdb.io/rest/edm-safefood"
  const query = {
    apikey: secret.get('apikey'),
    q: "{\"bixby-user-id\":\"" + bixbyUserId + "\"}"
  }
  const options = {
    format: "json",
    query: query,
    cacheTime: 0
  }
  const response = http.getUrl(url, options)

  console.log(response)
  if (response) {
    const myFood = new Array;
    for (var i = 0; i < response.length; i++) {
      if (myFoodName == "" || response[i]['food-name'] == myFoodName) {
        console.log("이상품이 삭제된닷 " + response[i]['food-name'])
        var tmp = response[i]["_id"];
        myFood.push(tmp);
      }
    }
    console.log(myFood)
    return myFood
  } else {
    // Doesn't exist
    return
  }
}
