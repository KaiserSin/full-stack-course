import DeletePerson from "./DeletePerson"

const Persons = ({persons, setPersons, setErrorMessage, setTypeOfNotification}) => {
    return(
        <div>
            {persons.map(value => value.isFiltered ?
              <div key={value.id}>
                {value.name} {value.number} 
                <DeletePerson id = {value.id} persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} setTypeOfNotification={setTypeOfNotification}/>
              </div>: null)}
        </div>
      )
}

export default Persons