import { useState } from 'react'
import TrainSearch from './Component/InputLayout.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TrainSearch/>
    </>
  )
}

export default App
