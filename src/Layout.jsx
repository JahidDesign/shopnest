import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './Routes/Routes';

function Layout() {
  const location = useLocation();

  // Pages where Navbar and Footer should be hidden
  const hideLayout = [
    '/login',
    '/register',
    '/404',
    '/admin',
    '/customer',
    '/agent'
  ];

  // Check if current path matches exactly OR starts with any hideLayout route
  const shouldHide = hideLayout.some(route =>
    location.pathname === route || location.pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHide && <Navbar />}
      <AppRoutes />
      {!shouldHide && <Footer />}
    </>
  );
}

export default Layout;
