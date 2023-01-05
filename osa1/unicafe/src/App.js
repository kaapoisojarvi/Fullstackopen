import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {

  const text = props.text
  const value = props.value
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const average = ((good*1 + neutral*0 + bad*(-1))/(good + neutral + bad))
  const all = good + neutral + bad
  const positive = (good/(good + neutral + bad))*100 + " %"

  if(all !== 0){
    return(
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" value ={good} />
            <StatisticLine text="neutral" value ={neutral} />
            <StatisticLine text="bad" value ={bad} />
            <StatisticLine text="all" value ={all} />
            <StatisticLine text="average" value ={average} />
            <StatisticLine text="positive" value ={positive} />
          </tbody>
        </table>
      </div>
    )
  }
  return(
  <div>
    <p>
      No feedback given
    </p>
  </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick = {() => setGood(good + 1)} text = "good">
        </Button>
        <Button handleClick = {() => setNeutral(neutral + 1)} text = "neutral">
        </Button>
        <Button handleClick = {() => setBad(bad + 1)} text = "bad">
        </Button>
      </div>
      <Statistics good = {good} neutral = {neutral} bad = {bad} ></Statistics>
    </div>
  )
}

export default App