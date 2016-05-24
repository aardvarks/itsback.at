'use strict'

const Database = require('../database')
    , dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
    , assert = require('assert')

describe('Database', () => {
  let database

  beforeEach((done) => {
    database = new Database(dbUrl)
    database.connect()
      .then(() => { done() })
      .catch((err) => { done(err) })
  })

  afterEach(() => {
    database.db.dropDatabase()
  })

  it('should add a domain to the database with one report', (done) => {
    database.addReport('google.com')
      .then((data) => {
        assert.equal(data.value.domain, 'google.com', 'domain not inserted')
        database.findReport('google.com')
          .then((data) => {
            assert.equal(data, 1, 'incorrect number of reports')
            done()
          })
      })
      .catch((err) => {
        done(err)
      })
  })
})
