import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './modules/home/pages/HomePage';
import UsersPage from './modules/users/pages/UsersPage';
import ProductsPage from './modules/products/pages/ProductsPage';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
