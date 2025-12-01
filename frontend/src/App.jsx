    
import React from "react";
    import { BrowserRouter, Routes, Route } from "react-router-dom";
    import Login from "./pages/Login.jsx";
    import Contacts from "./pages/Contacts.jsx";
    import CreateContact from "./pages/CreateContact.jsx";
    import EditContact from "./pages/EditContact.jsx";
    import AdminUsers from "./pages/AdminUsers.jsx";
    import Navbar from "./components/Navbar.jsx";
    import AdminRoute from "./components/AdminRoute.jsx";

    export default function App() {
      return (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/new" element={<CreateContact />} />
            <Route path="/contacts/:id/edit" element={<EditContact />} />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
);
    }
