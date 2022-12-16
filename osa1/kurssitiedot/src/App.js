const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const Header = (props) => {
    return (
      <div>
        <h1>{props.text}</h1>
      </div>
    )
  }

  const Content = (props) => {
    return (
      <div>
        <Part name = {part1} exercises = {exercises1} />
        <Part name = {part2} exercises = {exercises2} />
        <Part name = {part3} exercises = {exercises3} />
      </div>
    )
  }

  const Total = (props) => {
    return (
      <div>
        <p>
          Number of exercises {props.exercises}
        </p>
      </div>
    )
  }

  const Part = (props) => {
    return (
        <p>
          {props.name} {props.exercises}
        </p>
    )
  }


  return (
    <div>
      <Header text={course} />
      <Content />
      <Total exercises = {exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App
