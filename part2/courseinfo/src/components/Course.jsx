const Header = ({ name }) => {
    return (
      <div>
        <h2>{name}</h2>
      </div>
    )
  }
  
const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} name={part.name} exercise={part.exercises} />)}
      </div>
    )
}
  
const Part = ({ name, exercise}) => {
    return (
      <div>
        <p>{name} {exercise}</p>
      </div>
    )
}
  
const Total = ({ parts }) => {
    return (
      <div>
        <p><strong>total of {parts.reduce((total, part) => total + part.exercises, 0)} exercises</strong></p>
      </div>
    )
}
  
const Course = ({ name, parts }) => {
    return (
      <div>
        <Header name={name} />
        <Content parts={parts} />
        <Total parts={parts} />
      </div>
    )
}

export default Course