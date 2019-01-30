// Hey look, tests I started to write, and then never finished :D
// They (it) are (is) using mocha

let assert = require('assert')
let tweet = require('../tweet')

// this also doesn't work anymore, because NOTHING is returned
describe('Array', function(){
    describe('#tweetStatus()', function(){
        it('should return true with a successful callback', function(){
            assert.equal(true, tweet.tweet('Itsame! Joey Pepperoni!'))
        })
    })
})
