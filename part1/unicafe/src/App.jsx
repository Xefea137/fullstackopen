import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Display = ({ value, text }) => <div>{text} {value}</div>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Display value={good} text='good' />
      <Display value={neutral} text='neutral' />
      <Display value={bad} text='bad' />
      <Display value={all} text='all' />
      <Display value={average} text='average' />
      <Display value={`${positive} %`} text='positive' />
    </div>
  )
}

export default App