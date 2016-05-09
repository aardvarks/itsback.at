const MongoClient = require('mongodb')

class Database {

  constructor (uri) {
    this.uri = uri
    this.db = {}
    return this
  }

  connect () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.uri, (err, db) => {
        if (err) return reject(err)
        this.db = db
        resolve(this)
      })
    })
  }

  addReport (domain) {
    return new Promise((resolve, reject) => {
      this.db.collection('domains').findAndModify(
        { domain: domain }
      , {}
      , { $inc: { reported: 1 } }
      , { new: true, upsert: true }
      , (err, data) => {
          if (err) return reject(err)
          resolve(data)
        })
    })

  }

  findReport (domain) {
    return new Promise((resolve, reject) => {
      this.db.collection('domains').findOne(
        { domain: domain }
      , { _id: false, reported: true }
      , (err, data) => {
          if (err) return reject(err)
          resolve(data)
        })
    })
  }
}

module.exports = Database
