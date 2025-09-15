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
      <MapLeaflet height="70vh" zoom={13} />
    </>
  )
}

export default App
