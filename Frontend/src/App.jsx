import { useState } from 'react'
import RouteSuggestions from './Component/RoutesBox'
import InputLayout from './Component/InputLayout'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <InputLayout/>
    </>
  )
}

export default App
