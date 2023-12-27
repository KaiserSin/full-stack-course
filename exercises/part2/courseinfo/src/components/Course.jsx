const Course = ({courses}) =>{
    return(
      <div>
        {courses.map(course =>(
          <div key = {course.id}>
            <Header course = {course.name}/>
            <Content parts = {course.parts}/>
            <Total parts = {course.parts}/>
          </div>
        ))}
        
      </div>
    )
  }


const Header = (props) => {
    return(
    <>
      <h1>{props.course}</h1>
    </>
    );
  }
  
const Part = (props) => {
    return(
      <>
        <p>{props.part}, {props.exercise}</p>
      </>
    );
  }
  
const Content = (props) => {
    return(
      <>
        {props.parts.map(value => (
      <Part key = {value.name} part = {value.name} exercise = {value.exercises}/> 
      ))}
      </>
    );
  }
  
const Total = ({parts}) => {
    return(
      <div>
        <b>total of {parts.reduce((accumulator, value) => accumulator + value.exercises, 0)}</b>
      </div>
    )
  }

  export default Course
   