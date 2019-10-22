module.exports.function = function findAllergy(findAllergyItem) {

  var http = require('http')
  var console = require('console')
  var config = require('config')
  var secret = require('secret')

  var param = "?" + encodeURIComponent('ServiceKey') + '=' + secret.get('foodkey');
  param += "&" + encodeURIComponent('prdlstNm') + '=' + encodeURIComponent(findAllergyItem);
  param += "&returnType=json";
  var findAllergyResults = http.getUrl(config.get('remote.url') + param, { format: 'json' });
  var findAllergyResultTmp = findAllergyResults.list;

  //검색된 값이 없으면 _ 띄어쓰기 없애서 한번 더 해주기
  if (findAllergyResultTmp.length == 0) {

    var findAllergyItemTmp = findAllergyItem.replace(" ", "");
    param = "?" + encodeURIComponent('ServiceKey') + '=' + secret.get('foodkey');
    param += "&" + encodeURIComponent('prdlstNm') + '=' + encodeURIComponent(findAllergyItemTmp);
    param += "&returnType=json";
    findAllergyResults = http.getUrl(config.get('remote.url') + param, { format: 'json' });
    findAllergyResultTmp = findAllergyResults.list;
  }

  var findAllergyResult = [];
  var name_length = 10000;
  for (var i in findAllergyResultTmp) {
    //길이가 더 짧으면 들어감
    //만약 알수 없음만 있는 경우면 그냥 pass함
    if (findAllergyResultTmp[i].prdlstNm.length <= name_length) {
      if (findAllergyResultTmp[i].allergy.substr(0, 4) != '알수없음') {
        findAllergyResult[0] = Find(findAllergyResultTmp[i]);
        name_length = findAllergyResultTmp[i].prdlstNm.length;
      }
    }
  }
  return findAllergyResult[0];

}

function Find(findAllergyResultTmp) {
  var allergy_list = ['계란', '우유', '메밀', '땅콩', '대두', '밀', '고등어', '게', '새우', '돼지', '쇠', '닭', '복숭아', '토마토', '호두', '조개']; //16개
  //나중에 url 이미지 리스트 넣어주기
  var allergy_urllist = ["Aimg/A0.jpg", "Aimg/A1.jpg", "Aimg/A2.jpg", "Aimg/A3.jpg", "Aimg/A4.jpg", "Aimg/A5.jpg", "Aimg/A6.jpg", "Aimg/A7.jpg", "Aimg/A8.jpg", "Aimg/A9.jpg", "Aimg/A10.jpg", "Aimg/A11.jpg", "Aimg/A12.jpg", "Aimg/A13.jpg", "Aimg/A14.jpg", "Aimg/A15.png"];
  //초기에는 다 없는 걸로 설정
  var allergy = ["Aimg/NoA0.png", "Aimg/NoA1.png", "Aimg/NoA2.png", "Aimg/NoA3.png", "Aimg/NoA4.png", "Aimg/NoA5.png", "Aimg/NoA6.png", "Aimg/NoA7.png", "Aimg/NoA8.png", "Aimg/NoA9.png", "Aimg/NoA10.png", "Aimg/NoA11.png", "Aimg/NoA12.png", "Aimg/NoA13.png", "Aimg/NoA14.png", "Aimg/NoA15.png"];
  
  var image_al = [];
  var cnt = 0;
  var start = 0;
  //추가로 난류
  if (findAllergyResultTmp.allergy.match('메추리알') == '메추리알') {
    allergy[0] = allergy_urllist[0];
    image_al[cnt++] = {url:allergy_urllist[0]};
    start++;
  }
  else if (findAllergyResultTmp.allergy.match('난류') == '난류') {
    allergy[0] = allergy_urllist[0];
    image_al[cnt++] = {url:allergy_urllist[0]};
    start++;
  }
  //알러지 체크해주기
  for (var i = start; i < allergy_list.length; i++) {
    if (findAllergyResultTmp.allergy.match(allergy_list[i]) == allergy_list[i]){
      allergy[i] = allergy_urllist[i];
      image_al[cnt++] = {url:allergy_urllist[i]};
    }
  }
  var findAllergyResult = {
    prdlstNm: findAllergyResultTmp.prdlstNm,
    imgurl1: findAllergyResultTmp.imgurl1,
    imgurl2: findAllergyResultTmp.imgurl2,
    //알러지체크
    allergy: findAllergyResultTmp.allergy,
    allergy_set : allergy,
    images : [{url:findAllergyResultTmp.imgurl1}, {url:findAllergyResultTmp.imgurl2}],
    aimages : image_al
  };

  return findAllergyResult;
}
