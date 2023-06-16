import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./useAppContext";
import style from "./styles/Layout.module.css";

const Layout = ({ children }) => {
  // Retrieves the loading state from the app context
  const { loading } = useAppContext();

  return (
    <div>
      <header className={style.header}>
        <Link to="/">Podcaster</Link>
        {loading && (
          <div className={style.spinner}>
            <svg className={style.spinnerSvg} viewBox="0 0 50 50">
              <circle
                className={style.spinnerCircle}
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
              />
            </svg>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
