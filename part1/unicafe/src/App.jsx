import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Display = ({ value, text }) => <div>{text} {value}</div>

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  
  return (
  <div>
    <Display value={good} text='good' />
    <Display value={neutral} text='neutral' />
    <Display value={bad} text='bad' />
    <Display value={all} text='all' />
    <Display value={(good - bad) / all} text='average' />
    <Display value={`${(good * 100) / all} %`} text='positive' />
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
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App