import '../../blocks/InfoTooltip.css';

function InfoTooltip({ isOpen, onClose, isSuccess }) {
  console.log('🔔 InfoTooltip dice: isOpen=', isOpen, ' | isSuccess=', isSuccess);

  if (!isOpen) return null;

  return (
    <div className={`tooltip ${isOpen ? 'tooltip_opened' : ''}`} onClick={onClose}>
      <div className="tooltip__container" onClick={(e) => e.stopPropagation()}>
        <button className="tooltip__close" type="button" onClick={onClose}>✕</button>
        <div className={`tooltip__icon ${isSuccess ? 'tooltip__icon_success' : 'tooltip__icon_fail'}`}></div>
        <h2 className="tooltip__message">
          {isSuccess
            ? '¡Correcto! Ya estás registrado.'
            : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.'}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;