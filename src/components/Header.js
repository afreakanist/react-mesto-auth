import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.svg";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Header() {
  const currentUser = useContext(CurrentUserContext);
  const { pathname } = useLocation();

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Логотип Mesto" className="logo" />
      </Link>
      <div className="header__group">
        {currentUser && <p className="header__email">example@mail.com</p>}
        {!currentUser ? (
          <Link
            to={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
            className="header__redirect-link"
          >
            {pathname === "/sign-in" ? "Регистрация" : "Войти"}
          </Link>
        ) : (
          <Link to="/sign-in" className="header__redirect-link">
            Выйти
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
