'use strict'

var MongoClient = require('mongodb')
  , url = 'mongodb://localhost:27017/itsback'
	, db

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database

	addReport('google.com', (err, data) => { console.log(data.value.domain) })
	findReport('google.com', (err, data) => { console.log(data) })
})

function addReport (domain, cb) {
	db.collection('domains').findAndModify({ domain: domain }, {}, { $inc: { reported: 1 } }, { new: true , upsert: true }, cb)
}

function findReport (domain, cb) {
	db.collection('domains').findOne({ domain: domain }, { _id: false, reported: true }, cb)
}


