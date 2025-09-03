import { useState } from 'react'
import RouteSuggestions from './Component/RoutesBox'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouteSuggestions/>
    </>
  )
}

export default App
