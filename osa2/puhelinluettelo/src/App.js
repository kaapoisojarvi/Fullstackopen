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
        <p>{person.name} {person.number}</p>
        <button onClick = {() => props.deleteP(person.id,person.name)}> delete</button>
      </div>)}
  </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [newFilter, setnewFilter] = useState('')

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
        console.log(changedPerson);
        
        personService
          .newNum(foundPerson.id,changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id === response.id ? response : person))
            console.log('Persons set');
          }).catch(('Error when editing existing person!')
          )
      }
    }else{
      personService
        .create(newPerson)
          .then(person => {
            setPersons(persons.concat(person))
            console.log('Persons set');
          }).catch(('Error when adding new person to server!')
          )
        }
  }

  const deletePerson = (id,name) => {
    const confirmed = window.confirm(`Delete ${name}?`)
    if(confirmed){
      setPersons(persons.filter(person => person.id !== id))
      personService.dPerson(id)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value = {newFilter} handler = {handlefilterChange}/>
      <h2>Add new</h2>
      <AddNew addPerson = {addPerson} newName = {newName} handleNameChange = {handleNameChange} newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Contacts persons = {persons} newFilter = {newFilter} deleteP = {deletePerson}/>
    </div>
  )
}

export default App