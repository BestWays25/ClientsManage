import SignUp from './Auth/Register';
import "bootstrap/dist/js/bootstrap.min.js";
import HomePage from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Auth/Login';
import Navbar from './components/Navbar/Navbar';
import AddProductForm from './components/Products/AddProducts';
import ProductList from './components/Products/Products';
import AddClientForm from './components/Clients/AddClients';
import ClientList from './components/Clients/Clients';
import CreateQuoteForm from './components/Devis/CreateDevis';
import QuoteList from './components/Devis/Devis';
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/create" element={<AddProductForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/create" element={<AddClientForm />} />
        <Route path="/devis" element={<QuoteList />} />
        <Route path="/devis/create" element={<CreateQuoteForm />} />
        <Route path="/devis/create" element={<CreateQuoteForm />} />
      </Routes>
    </div>
  );
}

export default App;
