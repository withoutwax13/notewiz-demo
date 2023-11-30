const FileDigitizer = ({
  uploadType,
  setUploadType,
  setCustomInput,
  customInput,
  setUploadedImage,
  setUploadedPDF,
  handleReset,
  isLoading,
}) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
  };
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    setUploadedPDF(file);
  };

  const handleCustomInput = (e) => {
    setCustomInput(e.target.value);
  };

  return (
    <div className="image-digitizer-container">
      <div className="section-title">
        <h1>1. Upload Image/PDF or Enter Text</h1>
      </div>
      <div className="option-group-container">
        <div className="option-group">
          <input
            type="radio"
            id="customInput"
            name="uploadType"
            value="Custom Input"
            checked={uploadType === "Custom Input"}
            disabled={isLoading}
            onChange={(e) => {
              handleReset();
              setUploadType(e.target.value);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="customInput">Custom Input</label>
        </div>
        <div className="option-group">
          <input
            type="radio"
            id="imageUpload"
            name="uploadType"
            value="Image Upload"
            checked={uploadType === "Image Upload"}
            disabled={isLoading}
            onChange={(e) => {
              handleReset();
              setUploadType(e.target.value);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="imageUpload">Image Upload</label>
        </div>
        <div className="option-group">
          <input
            type="radio"
            id="pdfUpload"
            name="uploadType"
            value="PDF Upload"
            checked={uploadType === "PDF Upload"}
            disabled={isLoading}
            onChange={(e) => {
              handleReset();
              setUploadType(e.target.value);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="pdfUpload">PDF Upload</label>
        </div>
      </div>
      <div className="warning-text">
        Note: PDF and Image upload may be unavailable in certain times due to
        server and API limitations and may result to errors. Please use Custom
        Input in such cases.
      </div>
      <div className="input-container">
        {uploadType === "Image Upload" && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            disabled={isLoading}
            className="styled-input"
          />
        )}

        {uploadType === "PDF Upload" && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handlePdfUpload(e)}
            disabled={isLoading}
            className="styled-input"
          />
        )}

        {uploadType === "Custom Input" && (
          <input
            type="text"
            value={customInput}
            onChange={(e) => handleCustomInput(e)}
            disabled={isLoading}
            className="styled-textarea"
          />
        )}
      </div>
    </div>
  );
};

export default FileDigitizer;
