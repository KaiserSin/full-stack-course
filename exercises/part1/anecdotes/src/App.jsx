import { useState } from 'react'

const Button = ({text, onSmash}) => (<><button onClick={onSmash}>{text}</button></>)

const Header = ({name}) => (<><h1>{name}</h1></>)

const Information = ({anecdotes, voteArray, selected}) => {
  return(
    <p>{anecdotes[selected]} <br />
        has {voteArray[selected]} votes
    </p>

  );
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const intialArray = Array(anecdotes.length).fill(0);

  const [voteArray, setVoteArray] = useState(intialArray)
  const [selected, setSelected] = useState(0)

  
  const best = () =>{
    const maxVotes = Math.max(...voteArray)
    return voteArray.indexOf(maxVotes)
  }


  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const handleNextClick = () => {
    let random = getRandomInt(anecdotes.length)
    setSelected(random === selected ? getRandomInt(anecdotes.length) : random)
  }

  const handleVoteClick = () => {
    let copy = [...voteArray]
    copy[selected]++
    setVoteArray(copy)
  }

  return (
    <div>
      <Header name = "Anecdote of the day"/>
      <Information anecdotes={anecdotes} voteArray={voteArray} selected={selected}/>
      <Button text = "vote" onSmash = {handleVoteClick}/>
      <Button text = "next anecdote" onSmash = {handleNextClick}/>

      <Header name = "Anecdote with most votes"/>
      <Information anecdotes={anecdotes} voteArray={voteArray} selected={best()}/>
    </div>
  )
}

export default App
