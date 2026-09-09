import { useEffect, useState } from 'react';

import avatar from '../../images/hombre.jpg';

import Card from './components/Card/Card';
import Popup from './components/Popup/Popup';
import ImagePopup from './components/ImagePopup/ImagePopup';
import NewCard from './components/Form/NewCard/NewCard';
import EditProfile from './components/Form/EditProfile/EditProfile';
import EditAvatar from './components/Form/EditAvatar/EditAvatar';

import api from '../../utils/api';

export default function Main({ currentUser, onUpdateUser, onUpdateAvatar }) {
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    api.getCards()
      .then((data) => {
        console.log('TARJETAS RECIBIDAS:', data);
        setCards(data.data || data);
      })
      .catch((err) => {
        console.log('ERROR AL CARGAR TARJETAS:', err);
      });
  }, [currentUser]);

  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const request = card.isLiked
      ? api.dislikeCard(card._id)
      : api.likeCard(card._id);

    request
      .then((data) => {
        const updatedCard = data.data || data;

        setCards((currentCards) =>
          currentCards.map((currentCard) =>
            currentCard._id === card._id
              ? updatedCard
              : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(cardId) {
    api.deleteCard(cardId)
      .then(() => {
        setCards((currentCards) =>
          currentCards.filter(
            (card) => card._id !== cardId
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddCard({ name, link }) {
    api.createCard({ name, link })
      .then((data) => {
        const newCard = data.data || data;

        setCards((currentCards) => [
          newCard,
          ...currentCards,
        ]);

        handleClosePopup();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateProfile({ name, about }) {
    onUpdateUser({ name, about })
      .then(() => {
        handleClosePopup();
      })
      .catch((err) => {
        console.log('ERROR AL ACTUALIZAR PERFIL:', err);
      });
  }

  function handleUpdateAvatar(avatarUrl) {
    onUpdateAvatar(avatarUrl)
      .then(() => {
        console.log('✅ Avatar actualizado:', avatarUrl);
      })
      .catch((err) => {
        console.log('❌ Error al actualizar el avatar:', err);
      });
    console.log(avatarUrl);
    handleClosePopup();
  }

  const newCardPopup = {
    title: 'Nuevo lugar',
    children: (
      <NewCard onSubmit={handleAddCard} />
    ),
  };

  const editProfilePopup = {
    title: 'Editar perfil',
    children: (
      <EditProfile
        onSubmit={handleUpdateProfile}
        currentUser={currentUser}
      />
    ),
  };

  const editAvatarPopup = {
    title: 'Cambiar avatar',
    children: (
      <EditAvatar onSubmit={handleUpdateAvatar} />
    ),
  };

  return (
    <main className="container">

      <section className="perfile">
        <div className="profile__container">

        <img
          src={
            currentUser?.avatar
              ? currentUser.avatar
              : avatar
          }
          alt="Usuario"
          className="perfile-img"
        />
        <button
          className="edit__avatar"
          type="button"
          aria-label="Editar avatar"
          onClick={() =>
            handleOpenPopup(editAvatarPopup
            )
          }
        />
        </div>

        <div className="perfile-content">

          <div className="perfile-info">

            <h1 className="perfile-title">
              {currentUser?.name || 'Jacques Cousteau'}
            </h1>

            <button
              className="edit-perfil"
              type="button"
              aria-label="Editar perfil"
              onClick={() =>
                handleOpenPopup(editProfilePopup)
              }
            ></button>

          </div>

          <p className="perfile-info">
            {currentUser?.about || 'Explorador'}
          </p>

        </div>

        <button
          aria-label="Agregar tarjeta"
          className="add"
          type="button"
          onClick={() =>
            handleOpenPopup(newCardPopup)
          }
        />

      </section>

      <section className="cards gallery">

        <ul className="cards__list">

          {cards
            .filter((card) => card)
            .map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                currentUser={currentUser}
              />
            ))}

        </ul>

      </section>

      {popup && (
        <Popup
          onClose={handleClosePopup}
          title={popup.title}
        >
          {popup.children}
        </Popup>
      )}

      {selectedCard && (
        <Popup
          onClose={() => setSelectedCard(null)}
        >
          <ImagePopup card={selectedCard} />
        </Popup>
      )}

    </main>
  );
}