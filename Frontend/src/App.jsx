import { useState } from 'react'
import MainPage from './Pages/MainPage.jsx'
import './App.css'
import TransportApp from './Pages/TempPage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TransportApp />
    </>
  )
}

export default App
