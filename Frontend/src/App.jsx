import { useState } from 'react'
import RouteSuggestions from './Component/RoutesBox'
import InputLayout from './Component/InputLayout'
import AllRoute from './Component/AllRoute'
import MapLeaflet from "./Component/MapLeaflet.jsx";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AllRoute/>
    </>
  )
}

export default App
