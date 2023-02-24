import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = (props) =>{
  return (
    <form>
      <div> filter shown with <input value = {props.value} onChange = {props.handler}/></div>
    </form>
  )
}

const AddNew = (props) =>{
  return (
    <form onSubmit = {props.addPerson}>
      <div> name: <input value = {props.newName} onChange = {props.handleNameChange}/></div>
      <div> number: <input value = {props.newNumber} onChange = {props.handleNumberChange}/></div>
      <div><button type="submit" >add</button>
      </div>
    </form>
  )
}

const Contacts = (props) =>{
  return (
    <ul>
    {props.persons.filter(person => person.name.toLowerCase().includes(props.newFilter.toLowerCase())).map(person =>
      <div key = {person.name}>
        <p className = "elements">{person.name} {person.number}</p>
        <button onClick = {() => props.deleteP(person.id,person.name)}> delete</button>
      </div>)}
  </ul>
  )
}

const Notification = (props) => {
  if (props.message === null){
    return null
  }

  return (
    <div className = 'inform'>
      {props.message}
    </div>
  )
}

const Error = (props) => {
  if (props.message === null){
    return null
  }

  return (
    <div className = 'error'>
      {props.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [newFilter, setnewFilter] = useState('')
  const [pageMessage , setPageMessage] = useState (null)
  const [errorMessage, setErrorMessage] = useState (null)

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setnewNumber(event.target.value)
  }

  const handlefilterChange = (event) => {
    console.log(event.target.value)
    setnewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const contains = persons.some(person => person.name === newName)
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if(contains){
      const confirmed = window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)
      if(confirmed){
        const foundPerson = persons.find(person => person.name === newName)
        const changedPerson = {...foundPerson, number: newNumber}
        
        personService
          .newNum(changedPerson.id,changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id === response.id ? response : person))

            setPageMessage(`${changedPerson.name}'s number was changed to ${changedPerson.number}`)

            setTimeout(() => {
              setPageMessage(null)
            }, 5000)

          }).catch(error => {
            setErrorMessage(`Information of ${changedPerson.name} has already been deleted from the server`)

            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }else{

      personService
        .create(newPerson)
          .then(person => {
            setPersons(persons.concat(person))

            setPageMessage(`Added ${newPerson.name} with number ${newPerson.number}`)

            setTimeout(() => {
              setPageMessage(null)
            }, 5000)

          }).catch(error => {
            setErrorMessage(`Information of ${newPerson.name} has already been deleted from the server`)

            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
    }
  }

  const deletePerson = (id,name) => {
    const confirmed = window.confirm(`Delete ${name}?`)
    if(confirmed){
      personService.dPerson(id)
        .then(a => {
          setPersons(persons.filter(person => person.id !== id))

          setPageMessage(`Deleted ${name}`)

          setTimeout(() => {
            setPageMessage(null)
          }, 5000)

        }).catch(error => {
          setErrorMessage(`Information of ${name} has already been deleted from the server`)

          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {pageMessage} />
      <Error message = {errorMessage} />
      <Filter value = {newFilter} handler = {handlefilterChange}/>
      <h2>Add new</h2>
      <AddNew addPerson = {addPerson} newName = {newName} handleNameChange = {handleNameChange} newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Contacts persons = {persons} newFilter = {newFilter} deleteP = {deletePerson}/>
    </div>
  )
}

export default App