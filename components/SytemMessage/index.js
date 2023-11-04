const SystemMessage = ({ type, message }) => {
  if (!['success', 'error'].includes(type)) {
    return null;
  }

  return (
    <div className={`system-message ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default SystemMessage;