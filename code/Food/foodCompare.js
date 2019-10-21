module.exports.function = function foodCompare(food, foodTwo) {
  //각 성분을 비교하고, 1번이 더 큰경우 -1 // 비교가 불가능 (같거나 Integer가 아니면)이면 0 // 2번이 더 큰 경우 1
  var nutriEng = ["calorie", "carbo", "fat", "natrium", "sugar", "protein"];
  var res = new Array;
  for (var i = 0; i < 6; i++) {
    if (food[nutriEng[i]] > foodTwo[nutriEng[i]])
      res.push(-1);
    else if (food[nutriEng[i]] < foodTwo[nutriEng[i]])
      res.push(1);
    else
      res.push(0);
  }
  return res;
}
