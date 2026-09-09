import like from "../../../../images/corazon.svg";
import likeActive from "../../../../images/corazon negro.png";

export default function Card({
  card,
  onCardClick,
  onCardLike,
  onCardDelete,
  currentUser,
}) {
  const ownerId = card.owner?._id || card.owner;
  const isOwn = ownerId === currentUser?._id;

  const isLiked = card.likes?.some(
    (like) => (like._id || like).toString() === currentUser?._id,
  );

  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    onCardDelete(card._id);
  }

  return (
    <li className="card">
      <img
        src={card.link}
        alt={card.name}
        className="card__image"
        onClick={() => onCardClick(card)}
      />

      {/* Bote de basura */}
      <button
        type="button"
        className={`card__delete-button ${
          isOwn ? "card__delete-button_is-visible" : ""
        }`}
        onClick={handleDeleteClick}
        aria-label="Eliminar tarjeta"
      ></button>

      <div className="card__description">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like">
          <button
            type="button"
            className={`card__like-button ${
              isLiked ? "card__like-button_is-active" : ""
            }`}
            onClick={handleLikeClick}
            aria-label="Me gusta"
          >
            <img src={isLiked ? likeActive : like} alt="Me gusta" />
          </button>
          <span className="card__like-count">{card.likes?.length || 0}</span>
        </div>
      </div>
    </li>
  );
}
