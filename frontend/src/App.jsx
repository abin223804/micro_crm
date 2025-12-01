
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Contacts from "./pages/Contacts.jsx";
import CreateContact from "./pages/CreateContact.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/contacts/new" element={<CreateContact />} />
      </Routes>
    </BrowserRouter>
  );
}
