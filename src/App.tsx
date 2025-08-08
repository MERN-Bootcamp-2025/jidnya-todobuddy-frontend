import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import MyTasks from "./pages/MyTasks"
// import Navbar from "./components/Navbar"

function App() {

  return (
    <>
    {/* <Navbar/> */}
    <Routes>
      <Route path="/" element = { <Login/>} />
      <Route path="/tasks" element = { <MyTasks/>} />
    </Routes>
    </>
  )
}

export default App
