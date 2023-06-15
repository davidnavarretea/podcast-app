import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./useAppContext";

const Layout = ({ children }) => {
  // Retrieves the loading state from the app context
  const { loading } = useAppContext();

  return (
    <div>
      <header>
        <Link to="/">Podcast Test</Link>
        {loading && <div>Cargando...</div>}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
