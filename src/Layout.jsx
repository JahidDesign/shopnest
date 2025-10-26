import { useLocation, matchPath } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./Routes/Routes";

function Layout() {
  const location = useLocation();

  // Paths where Navbar/Footer should be hidden
  const hideLayoutPaths = [
    "/login",
    "/register",
    "/unauthorized",
    "/admin/*",
    "/dashboard/*",
    "/agent/*",
  ];

  // Determine if current path should hide Navbar/Footer
  const shouldHide = hideLayoutPaths.some((path) =>
    matchPath({ path, end: path.endsWith("/*") ? false : true }, location.pathname)
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
