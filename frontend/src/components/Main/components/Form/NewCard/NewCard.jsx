import { useState } from 'react';

export default function NewCard({ onSubmit }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      link,
    });
  }

  return (
    <form
      className="popup__form"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        id="card-name"
        name="name"
        type="text"
        placeholder="Título"
        className="popup__input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        minLength="2"
        maxLength="30"
        required
      />

      <input
        id="card-link"
        name="link"
        type="url"
        placeholder="URL"
        className="popup__input"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        required
      />

      <button
        type="submit"
        className="popup__save"
      >
        Guardar
      </button>
    </form>
  );
}