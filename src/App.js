
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home';
import { UserProvider } from './context/UserContext';
import 'tailwindcss/tailwind.css'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
