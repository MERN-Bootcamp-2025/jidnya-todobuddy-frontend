import { Route, Routes } from "react-router-dom"

import Login from "./pages/Login"
import MyTasks from "./pages/MyTasks"
import NotFound from "./components/NotFound"


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element = { <Login/>} />
      <Route path="/tasks" element = { <MyTasks/>} />
       <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
