export default function Popup({ onClose, title, children }) {
  return (
    <div className="popup">
      <div className={`popup__container ${!title ? "popup__container_type_image" : ""}`}>
        
        <button className="popup__close" onClick={onClose}>
          &times;
        </button>

        {title && <h2 className="popup__title">{title}</h2>}

        {children}
      </div>
    </div>
  );
}