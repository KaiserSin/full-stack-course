const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://learningartems:${password}@cluster0.lutb6w3.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema, 'persons')

if (process.argv.length === 3) {
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const person = new Person({
      name: name,
      number: number,
    })
  
    person.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
} else {
    console.log('Please use the correct format:')
    console.log('node mongo.js <password> <name> <number>')
    mongoose.connection.close()
}