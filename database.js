var MongoClient = require('mongodb').MongoClient

class Database {
  constructor (url) {
    MongoClient.connect(url, function(err, db) {
      console.log("Connected succesfully to server")
    })
  }

  addReport () {

  }
}
