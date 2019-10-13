var config = require('config')
var secret = require('secret')

module.exports.get = function (type, property) {
  const override = config.get("override-properties") === "true"
  switch (type) {
    case "config":
      return override ? config.get("config." + property) : config.get(property) 
    case "secret":
      return secret.get(property)
    default:
      throw "Unrecognized type: " + type
  }
}
