/**  
 * Remote Database CRUD Interface for a Bixby UserData Structure
 * 
 * The functions here pass the UserData back and forth between the remote DB and Bixby.
 * In doing so, they perform the transformations required to map how the UserData is stored in each system.
 * 
 * In the remote DB Collection, a UserData Document looks like this:
 * {
 *   _id: <dbUserId>
 *   userIdField: <bixbyUserId>
 *   userDataField: {
 *     <property1>: <bixbyConceptValue1>
 *     <property2>: <bixbyConceptValue2>
 *     ...
 *   }
 * }
 * 
 * In Bixby, the UserData Structure looks like this:
 * {
 *   $id: <dbUserId> // Convenience key in Bixby to store provider specific ids (see https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.js-actions#provider-specific-identifiers)
 *   $type: <bixbyConceptType> // Bixby automaticaly adds this labeling to all Concepts, but we don't need to save it to the remote DB
 *   <property1>: <bixbyConceptValue1>
 *   <property2>: <bixbyConceptValue2>
 *   ...
 * }
 * The bixbyUserId resides in `$vivContext.userId=<bixbyUserId>`, so we pass it in as a separate param.
 **/
var http = require('http')
var secret = require('secret')
var properties = require('./properties.js')
var console = require('console')

module.exports = {
  deleteMyFood: deleteMyFood, // DELETE UserData
  getMyFood: getMyFood,       // READ UserData if exists, otherwise return nothing
  putMyFood: putMyFood        // UPDATE UserData if exists, otherwise CREATE UserData
}

// function createUserData(bixbyUserId, userData) {
//   const url = properties.get("config", "baseUrl") + properties.get("config", "collection")
//   const query = {
//     apikey: properties.get("secret", "apiKey")
//   }
//   const body = {}
//   body[properties.get("config", "userIdField")] = bixbyUserId
//   body[properties.get("config", "userDataField")] = JSON.stringify(userData)
//   const options = {
//     format: "json",
//     query: query,
//     cacheTime: 0
//   }
//   const response = http.postUrl(url, body, options)
//   if (response) {
//     userData = response[properties.get("config", "userDataField")]
//     userData.$id = response["_id"]
//     return userData
//   }
// }

function deleteMyFood(bixbyUserId) {
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
    const response = http.deleteUrl(url, {}, options)
    if (response) {
      return true
    } else {
      return false
    }
}

function getMyFood(bixbyUserId) {
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
      var tmp = JSON.parse(response[i]['bixby-my-food']);
      delete tmp.$id;
      delete tmp.$type;
      myFood.push(tmp);
    }
    console.log(myFood)
    return myFood
  } else {
    // Doesn't exist
    return
  }
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
  body["bixby-my-food"] = JSON.stringify(myFood)
  console.log(myFood)

  const options = {
    format: "json",
    query: query,
    cacheTime: 0
  }
  const response = http.postUrl(url, body, options)
  if (response) {
    return getMyFood(bixbyUserId);
  }
}

// function updateUserData(bixbyUserId, dbUserId, userData) {
//   const url = properties.get("config", "baseUrl") + properties.get("config", "collection") + "/" + dbUserId
//   const query = {
//     apikey: properties.get("secret", "apiKey")
//   }
//   const body = {}
//   body[properties.get("config", "userIdField")] = bixbyUserId
//   body[properties.get("config", "userDataField")] = JSON.stringify(userData)
//   const options = {
//     format: "json",
//     query: query,
//     cacheTime: 0
//   }
//   const response = http.putUrl(url, body, options)
//   if (response) {
//     userData = response[properties.get("config", "userDataField")]
//     userData.$id = response["_id"]
//     return userData
//   }
// }
