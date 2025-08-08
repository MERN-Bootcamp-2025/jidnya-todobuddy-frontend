import { Route, Routes } from "react-router-dom"

import Login from "./pages/Login"
import MyTasks from "./pages/MyTasks"


function App() {
  

  return (
    <>

    <Routes>
      <Route path="/" element = { <Login/>} />
      <Route path="/tasks" element = { <MyTasks/>} />
    </Routes>
    </>
  )
}

export default App
