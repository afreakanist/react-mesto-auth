import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.svg";

function Header({ isLoggedIn, onLogout }) {
  const { pathname } = useLocation();
  const currentUser = useContext(CurrentUserContext);

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Логотип Mesto" className="logo" />
      </Link>
      {!isLoggedIn ? (
        <Link
          to={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
          className="header__redirect-link"
        >
          {pathname === "/sign-in" ? "Регистрация" : "Войти"}
        </Link>
      ) : (
        <div className="header__group">
          <p className="header__email">{currentUser.email}</p>
          <Link to="/sign-in" onClick={onLogout} className="header__logout">
            Выйти
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
