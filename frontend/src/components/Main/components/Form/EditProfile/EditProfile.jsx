import { useEffect, useState } from 'react';

export default function EditProfile({ onSubmit, currentUser }) {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAbout(currentUser.about || '');
    }
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      about,
    });
  }

  return (
    <form
      className="popup__form"
      id="edit-profile-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        className="popup__input"
        type="text"
        id="input-name"
        name="name"
        placeholder="Nombre"
        minLength="2"
        maxLength="40"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <span className="input-name-error popup__error"></span>

      <input
        className="popup__input"
        type="text"
        id="input-about"
        name="about"
        placeholder="Acerca de mí"
        minLength="2"
        maxLength="200"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        required
      />

      <span className="input-about-error popup__error"></span>

      <button
        type="submit"
        className="popup__save"
      >
        Guardar
      </button>
    </form>
  );
}