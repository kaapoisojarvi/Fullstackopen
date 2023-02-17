import { useState, useEffect } from 'react'
import axios from 'axios'

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
    {props.persons.filter(person => person.name.toLowerCase().includes(props.newFilter.toLowerCase())).map(person => <p key = {person.name}>{person.name} {person.number}</p>)}
  </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [newFilter, setnewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
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
    console.log(newName, contains, persons)
    const newPerson = {
      name: newName,
      number: newNumber
    }
    contains ? alert(`${newName} is already added to the phonebook!`) : setPersons(persons.concat(newPerson))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value = {newFilter} handler = {handlefilterChange}/>
      <h2>Add new</h2>
      <AddNew addPerson = {addPerson} newName = {newName} handleNameChange = {handleNameChange} newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Contacts persons = {persons} newFilter = {newFilter}/>
    </div>
  )

}

export default App