// html_test.js
// this was an endpoint for my test html page to hit to retrieve a generated name
const getYonName = require('./create_name/make_name')

getYonName().then((value) => {
    value = 'Ay! It\'s ' + value + '!'
    let params = {status: value}
    console.log(value)
    return (value)
})