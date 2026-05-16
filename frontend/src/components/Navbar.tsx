import { NavLink } from 'react-router-dom';

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#1f2937',
  color: '#fff',
};

const linkStyle: React.CSSProperties = {
  color: '#d1d5db',
  textDecoration: 'none',
  fontWeight: 500,
};

const activeLinkStyle: React.CSSProperties = {
  color: '#fff',
  borderBottom: '2px solid #3b82f6',
  paddingBottom: '2px',
};

function Navbar() {
  return (
    <nav style={navStyle}>
      <span style={{ fontWeight: 700, fontSize: '1.1rem', marginRight: '1rem' }}>
        🛒 Mini E-commerce
      </span>
      <NavLink
        to="/"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/users"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
      >
        Usuários
      </NavLink>
      <NavLink
        to="/products"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
      >
        Produtos
      </NavLink>
    </nav>
  );
}

export default Navbar;
