import { useState } from "react";
import { Link, withRouter } from "react-router-dom";

function Register() {
  const [userData, setUserData] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted!!!");
  };

  return (
    <div className="sign-up">
      <h2 className="sign-up__title">Регистрация</h2>
      <form
        className="sign-up__form"
        name="edit"
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          className="sign-up__input"
          id="username"
          name="username"
          type="text"
          placeholder="Email"
          value={userData.username || ""}
          onChange={handleChange}
        />
        <input
          className="sign-up__input"
          id="password"
          name="password"
          type="text"
          placeholder="Пароль"
          value={userData.password || ""}
          onChange={handleChange}
        />
        <button type="submit" className="sign-up__submit-button">
          Зарегистрироваться
        </button>
      </form>
      <p className="sign-up__alt-option">
        Уже зарегистрированы?{" "}
        <Link to="sign-in" className="sign-up__redirect-link">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default withRouter(Register);
