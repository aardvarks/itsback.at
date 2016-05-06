'use strict'

const MongoClient = require('mongodb')

class Database {

  constructor (uri) {
    this.uri = uri
    this.db = {}
    MongoClient.connect(uri, (err, db) => {
      if (err) return console.log(err)
      this.db = db
    })
  }

  addReport (domain, cb) {
    this.db.collection('domains').findAndModify({ domain: domain }, {}, { $inc: { reported: 1 } }, { new: true , upsert: true }, cb)
  }

  findReport (domain, cb) {
    this.db.collection('domains').findOne({ domain: domain }, { _id: false, reported: true }, cb)
  }
}

module.exports = Database
