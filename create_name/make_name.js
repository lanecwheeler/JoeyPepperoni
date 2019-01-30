// make_name.js
// THIS BAD BOY. What he does is read in the two text files (one full of names, the other with food) into arrays,
// randomly pick one from each array, and throws em' together as your very own Italian-ish name!
// To combat the async issue of trying to return a name that doesn't exist yet, it uses promises to eventually return the name after it's been created

module.exports = function() {
    const fs = require('fs') //require this filesystem module
    const path = require('path') //the path is needed to get this txt file, no matter the filesystem paths
    let names = {}
    let foods = {}

    //get the first name
    let getFirstName = new Promise((resolve,reject) => {
        //read in the file
        fs.readFile(path.resolve(__dirname, 'first_names.txt'), 'utf8', (err, data) => {
            if(err) reject(err) //if error, send a rejected promise
            else{
                names = data.toString().split('\n') //split all the names read in by newlines, and assign to an array
                let firstName = names[Math.floor(Math.random() * names.length)] //randomly select one of the names
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() //capitalize the first letter, lowercase the rest
                resolve(firstName) //resolve your promise and return the name
            }
        })
    })

    //get the food name... just read the comments from above and apply them down here. same concepts.
    let getLastName = new Promise((resolve,reject) => {
        fs.readFile(path.resolve(__dirname, 'italian_foods.txt'), 'utf8', (err, data) => {
            if(err) reject(err);
            else{
                foods = data.toString().split('\n')
                let lastName = foods[Math.floor(Math.random() * foods.length)]
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
                resolve(lastName)
            }
        })
    })

    //when we have all them juicy promises resolved, throw the joined name back at your calling function (as another promise :3)
    return new Promise((resolve, reject) => {
        Promise.all([getFirstName, getLastName]).then((values) => {
            resolve(values.join(' '))
        })
    })
}