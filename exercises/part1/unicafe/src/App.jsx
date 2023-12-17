import { useState } from 'react'

const Header = ({name}) => (<><h1>{name}</h1></>)

const Button = ({text, onSmash}) => (<><button onClick={onSmash}>{text}</button></>)

const StatisticLine = ({text, value}) => {

  const cellStyle = {
    border: "none",
    padding: "3px"
  };

  return(
    <tr>
      <td style={cellStyle}>{text}</td>
      <td style={cellStyle}>{value}</td>
    </tr>
  );
}
const Statistics = ({good, neutral, bad}) => {

  let all = good + neutral + bad;
  let average = all===0 ? 0 : (good - bad) / all;
  let posPer = all===0 ? 0 : ((good / all)*100) ; 

  return(all===0?
    <div>
      <p>No feedback given</p>  
    </div>
    :
    <table>
      <tbody>
        <StatisticLine text = "good" value = {good}/>
        <StatisticLine text = "neutral" value = {neutral}/>
        <StatisticLine text = "bad" value = {bad}/>
        <StatisticLine text = "all" value = {all}/>
        <StatisticLine text = "average" value ={average}/>
        <StatisticLine text = "positive" value ={posPer +" %"}/>
      </tbody>
    </table>
  );
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good+1)
  const handleNeutralClick = () => setNeutral(neutral+1)
  const handleBadClick = () => setBad(bad+1)

  return (
    <div>
      <Header name = "give feedback"/>
      <Button text = "good" onSmash = {handleGoodClick}/>
      <Button text = "neutral" onSmash = {handleNeutralClick}/>
      <Button text = "bad" onSmash = {handleBadClick}/>
      <Header name = "statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
