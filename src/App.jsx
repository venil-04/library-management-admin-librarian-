import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import ListingPage from "./pages/ListingPage/ListingPage.jsx";
import Navbar from "./components/NavbarComp/Navbar.jsx";
import BooksList from "./pages/Booklist/Booklist.jsx";
import UsersList from "./pages/Users/UsersList.jsx";
import OrdersPage from "./pages/OrderPage/OrderPage.jsx";
import AuthPage from "./pages/AuthenticationPage/AuthenticationPage.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<UsersList/>} />
        <Route exact path="/books" element={<BooksList/>} />
        <Route exact path="/add-book" element={<ListingPage />} />
        <Route exact path="/users" element={<UsersList />} />
        <Route exact path="/orders" element={<OrdersPage />} />
        <Route exact path="/authentication" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
