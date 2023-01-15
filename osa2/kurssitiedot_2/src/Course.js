const Header = ({text}) => {
    return (
        <div>
        <h2>
            {text}
        </h2>
        </div>
    )
}
  
const Content = ({parts}) => {
    return (
        <div>
        {parts.map(part => <Part key = {part.id} name = {part.name} exercises = {part.exercises}/>)}
        </div>
    )
}

const Total = ({parts}) => {
    const total = parts.map(part => part.exercises).reduce( (first,second) => {
        console.log('Total calculating... ',first, '+' ,second);
        return (first + second)
    })
    console.log('Total calculated',total);
    return (
        <div>
        <p>
            <b>Total of {total} exercises</b>
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

const Course = ({course}) => {
    return (
        <div>
        <Header text = {course.name}/>
        <Content parts = {course.parts}/>
        <Total parts = {course.parts}/>
        </div>
    )
}

export default Course