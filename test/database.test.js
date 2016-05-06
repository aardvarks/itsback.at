'use strict'

var Database = require('../database')
  , database = new Database('mongodb://localhost:27017/test')
  , assert = require('assert')

describe('Database', () => {

  after(() => {
    database.db.dropDatabase()
  })

  it('should add a domain to the database with one report', (done) => {
    setTimeout(() => {
      database.addReport('google.com', (err, data) => {
       assert.equal(err, null, 'domain not inserted')
       assert.equal(data.value.domain, 'google.com', 'domain not inserted')
      })

      database.findReport('google.com', (err, data) => {
        assert.equal(err, null, 'failed to get result')
        assert.equal(data.reported, 1, 'incorrect number of reports')
        done()
      })
    }, 100)
  })
})






