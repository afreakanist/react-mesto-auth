import { useState } from "react";
import { withRouter } from "react-router-dom";

function Login() {
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
      <h2 className="sign-up__title">Вход</h2>
      <form
        className="sign-up__form"
        name="edit"
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          className="sign-up__input"
          id="email"
          name="email"
          type="text"
          placeholder="Email"
          value={userData.email || ""}
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
          Войти
        </button>
      </form>
    </div>
  );
}

export default withRouter(Login);
