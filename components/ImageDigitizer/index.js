"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { pdfToImg } from "@/lib/pdf-to-img";
import Loading from "../Loading";
import SystemMessage from "../SytemMessage";

const extractTextFromImageUpload = async (imageUpload) => {
  let extractedText = {};
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(imageUpload);
    extractedText.text = ret.data.text;
    extractedText.success = true;
    await worker.terminate();
  } catch (error) {
    extractedText.success = false;
    extractedText.text =
      "Sorry. We encountered an error. This might be a server issue. Please try again later.";
  }
  return extractedText;
};

const extractTextFromPdfUpload = async (pdfUpload) => {
  let extractedText = {};
  try {
    const images = await pdfToImg(pdfUpload);
    const pages = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const worker = await createWorker("eng");

      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(image);

      // Pushing the extracted text from each page to the pages array
      pages.push(text);

      await worker.terminate();
    }

    extractedText.success = true;
    extractedText.text = pages.join("\n\n");
  } catch (error) {
    extractedText.success = false;
    extractedText.text =
      "Sorry. We encountered an error. This might be a server issue. Please try again later.";
  }
  return extractedText;
};

const ImageDigitizer = ({ setPromptData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [digitizedData, setDigitizedData] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploadedPDF, setUploadedPDF] = useState("");
  const [uploadType, setUploadType] = useState("Image Upload");
  const [customInput, setCustomInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDigitize = () => {
    if (uploadType === "Image Upload") {
      if (uploadedImage === "") {
        return alert("Please upload an image.");
      } else {
        setIsLoading(true);
        extractTextFromImageUpload(uploadedImage).then((result) => {
          setIsLoading(false);
          setDigitizedData(result);
          setPromptData(result);
        });
      }
    } else if (uploadType === "PDF Upload") {
      if (uploadedPDF === "") {
        return alert("Please upload a PDF.");
      } else {
        setIsLoading(true);
        extractTextFromPdfUpload(uploadedPDF).then((result) => {
          setIsLoading(false);
          setDigitizedData(result);
          setPromptData(result);
        });
      }
    } else if (uploadType === "Custom Input") {
      if (customInput === "") {
        return alert("Please enter some text.");
      } else {
        setIsLoading(true);
        const result = {};
        result.text = customInput;
        result.success = true;
        setIsLoading(false);
        setDigitizedData(result);
        setPromptData(result);
      }
    }
  };
  const handleReset = () => {
    setDigitizedData(null);
    setUploadedImage("");
    setUploadedPDF("");
    setCustomInput("");
  };
  return (
    <div className="image-digitizer-container">
      <div className="utilities">
        <div className="data-source-utility">
          <div className="option-group">
            <input
              type="radio"
              id="imageUpload"
              name="uploadType"
              value="Image Upload"
              checked={uploadType === "Image Upload"}
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
              onChange={(e) => {
                handleReset();
                setUploadType(e.target.value);
              }}
              className="radio-input data-source-utility-input"
            />
            <label htmlFor="pdfUpload">PDF Upload</label>
          </div>
          <div className="option-group">
            <input
              type="radio"
              id="customInput"
              name="uploadType"
              value="Custom Input"
              checked={uploadType === "Custom Input"}
              onChange={(e) => {
                handleReset();
                setUploadType(e.target.value);
              }}
              className="radio-input data-source-utility-input"
            />
            <label htmlFor="customInput">Custom Input</label>
          </div>
        </div>

        {uploadType === "Image Upload" && (
          <input
            style={{ margin: "5px" }}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            disabled={digitizedData !== null}
          />
        )}

        {uploadType === "PDF Upload" && (
          <input
            style={{ margin: "5px" }}
            type="file"
            accept="application/pdf"
            onChange={(e) => handlePdfUpload(e)}
            disabled={digitizedData !== null}
          />
        )}

        {uploadType === "Custom Input" && (
          <textarea
            style={{ color: "black", padding: "10px", marginBottom: "10px" }}
            rows={10}
            cols={35}
            value={customInput}
            onChange={(e) => handleCustomInput(e)}
          />
        )}

        <button
          className="primary-btn"
          onClick={handleDigitize}
          disabled={digitizedData !== null}
        >
          Digitize
        </button>
        <button className="secondary-btn" onClick={handleReset}>
          Reset
        </button>
        {isLoading && (
          <div style={{ margin: "5px" }}>
            <Loading message={`Processing your data...`} />
          </div>
        )}
        {!isLoading && digitizedData !== null && (
          <div style={{ margin: "5px" }}>
            <SystemMessage
              type={`success`}
              message={`Data processed succesfully.`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDigitizer;
