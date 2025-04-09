import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [elementFilter, setElementFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [typeOfNotification, setTypeOfNotification] = useState("successful")

  useEffect(() =>{
    personService
      .getAll()
      .then(per => 
        setPersons(per.map(val => ({
          ...val,
          isFiltered: true
        })))
      )
  }, [])
  

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message = {errorMessage} typeOfNotification = {typeOfNotification}/>

      <Filter elementFilter ={elementFilter} setElementFilter = {setElementFilter} persons = {persons}/>

      <h2>add a new</h2>

      <PersonForm 
      persons={persons} setPersons={setPersons} 
      newName={newName} setNewName={setNewName} 
      newNumber={newNumber} setNewNumber={setNewNumber}
      setErrorMessage={setErrorMessage} setTypeOfNotification={setTypeOfNotification}/>

      <h2>Numbers</h2>

      <Persons persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} setTypeOfNotification={setTypeOfNotification}/>
    </div>
  )
}

export default App


