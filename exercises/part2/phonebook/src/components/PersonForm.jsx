import personService from '../services/persons'

const PersonForm = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber, setErrorMessage, setTypeOfNotification}) =>{

    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)

    const actionWithPerson = (event) => {
      event.preventDefault()
      let whoEdited = persons.find(val => val.name === newName.trim())
      if(whoEdited){
        editPerson(whoEdited)
      }
      else{
        addPerson()
      }
    }

    const editPerson = (whoEdited) => {
      let res = window.confirm(`${whoEdited.name} is already added to phonebook, replace the old number with a new one?`)
      if(res){
        let newObj = {...whoEdited, number: newNumber}
        personService
        .update(whoEdited.id, newObj)
        .then(returnedObj => {
            let newPersons = persons.map(val =>{
              if(val.id === returnedObj.id){
                  return returnedObj
              } else {
                return val
              }
            })
            setPersons(newPersons)
            setNewName("")
            setNewNumber("")
            setErrorMessage(
              `${returnedObj.name}'s number was successfully changed`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          }
        )
        .catch(error =>{
          console.log(error)
          setTypeOfNotification("error")
          setErrorMessage(`Information of ${whoEdited.name} has already been removed from server`)
          setTimeout(() => {
              setErrorMessage(null)
              setTypeOfNotification("successful")
            }, 5000)
        })
      }
    }

    const addPerson = () => {
        const personObject ={
          name: newName.trim(),
          number: newNumber,
          id: persons.reduce((max, val) =>(val.id > max ? val.id : max), 0) +1,
          isFiltered: true
        }
          
        personService.
        create(personObject)
        .then(per => {
          setPersons(persons.concat(per))
          setNewNumber('')
          setNewName('')
          setErrorMessage(
            `Added ${per.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        
    }

    return(
        <form onSubmit={actionWithPerson}>
        <div>
          name: <input
                value={newName}
                onChange={handleNameChange}
                />
        </div>
        <div>
          number: <input
                value={newNumber}
                onChange={handleNumberChange} 
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm