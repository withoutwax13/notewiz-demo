const Loading = ({ message }) => {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <div className="loading-message">
        {message}
      </div>
    </div>
  );
}

export default Loading;