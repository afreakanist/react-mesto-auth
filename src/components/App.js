import "../index.css";
import { useEffect, useState } from "react";
import { Route, Switch, useHistory, withRouter } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import api from "../utils/api";
import * as auth from "../utils/auth";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({
    isOpen: false,
    caption: "",
    link: "",
  });
  const [infoTooltip, setInfoTooltip] = useState({
    isOpen: false,
    isSuccessful: false,
  });
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards([...cardsData]);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleTokenCheck = () => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setIsLoggedIn(true);
          history.push("/");
        }
      });
    }
  };

  const handleLogin = ({ password, email }) => {
    auth
      .authorize(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setIsLoggedIn(true);
          setCurrentUser((prev) => ({ ...prev, email }));
          history.push("/");
        }
        return data;
      })
      .catch((err) => console.log(err));
  };

  const handleRegister = ({ password, email }) => {
    auth
      .register(password, email)
      .then((res) => {
        if (!res.error) {
          setInfoTooltip({
            isOpen: true,
            isSuccessful: true,
          });
          history.push("/sign-in");
        } else {
          setInfoTooltip({
            isOpen: true,
            isSuccessful: false,
          });
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard({
      isOpen: true,
      caption: card.caption,
      link: card.link,
    });
  };

  const handleUpdateUser = (userData) => {
    api
      .editUserInfo(userData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error in profile editing: ${err}`))
      .finally(() => setIsPending(false));
  };

  const handleUpdateAvatar = (link) => {
    api
      .updateAvatar(link)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error in avatar updating: ${err}`))
      .finally(() => setIsPending(false));
  };

  const handleAddPlaceSubmit = (cardData) => {
    api
      .postNewCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error in avatar updating: ${err}`))
      .finally(() => setIsPending(false));
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({
      isOpen: false,
      caption: "",
      link: "",
    });
    setInfoTooltip({
      isOpen: false,
    });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="content">
          <Switch>
            <Route path="/sign-up">
              <Register onRegister={handleRegister} />
            </Route>
            <Route path="/sign-in">
              <Login onLogin={handleLogin} />
            </Route>
            <ProtectedRoute
              path="/"
              component={Main}
              isLoggedIn={isLoggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          </Switch>
        </main>
        <Footer />
      </div>
      <InfoTooltip
        isOpen={infoTooltip.isOpen}
        onClose={closeAllPopups}
        isSuccessful={infoTooltip.isSuccessful}
      />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isPending={isPending}
        setIsPending={setIsPending}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isPending={isPending}
        setIsPending={setIsPending}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isPending={isPending}
        setIsPending={setIsPending}
      />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
