import { useState } from 'react';

export default function EditAvatar({ onSubmit }) {
  const [avatar, setAvatar] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit(avatar);
  }

  return (
    <form
      className="popup__form"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        id="avatar-url"
        name="avatar"
        type="url"
        placeholder="URL del avatar"
        className="popup__input"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
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