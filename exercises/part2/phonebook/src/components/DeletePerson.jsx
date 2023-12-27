import personService from '../services/persons';

const DeletePerson = ({ id, persons, setPersons, setErrorMessage, setTypeOfNotification }) => {
  const handleDeleteClick = (event) => {
    event.preventDefault()
    const personToDelete = persons.find(val => val.id === id)
    const res = window.confirm(`Delete ${personToDelete.name} ?`)

    if (res) {
      personService
        .deleteOne(id)
        .then(() => {
          const updatedPersons = persons.filter(val => val.id !== id)
          setPersons(updatedPersons)
          setErrorMessage(`${personToDelete.name} was successfully deleted`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error =>{
            console.log(error)
            setTypeOfNotification("error")
            setErrorMessage(`Information of ${personToDelete.name} has already been removed from server`)
            setTimeout(() => {
                setErrorMessage(null)
                setTypeOfNotification("successful")
              }, 5000)
        })
    }
  }

  return (
    <button onClick={handleDeleteClick}>delete</button>
  )
}

export default DeletePerson;
