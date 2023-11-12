"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { pdfToImg } from "@/lib/pdf-to-img";
import Loading from "../Loading";
import SystemMessage from "../SytemMessage";
import imageToText from "@/lib/file-to-text";

const extractTextFromImageUpload = async (imageUpload) => {
  let extractedText = {};
  try {
    const result = await imageToText(imageUpload);
    extractedText.text = result;
    extractedText.success = true;
  } catch (error) {
    extractedText.success = false;
    extractedText.text =
      "Sorry. We encountered an error. This might be a server issue. Please try again later.";
  }
  console.log(extractedText)
  return extractedText;
};

const extractTextFromPdfUpload = async (pdfUpload) => {
  let extractedText = {};
  try {
    const images = await pdfToImg(pdfUpload);
    console.log(images); // log images
    const textPromises = images.map(image => imageToText(image, true));
    const pages = await Promise.all(textPromises);
    console.log(pages); // log pages

    extractedText.success = true;
    extractedText.text = pages.join("\n");
  } catch (error) {
    console.log(error); // log error
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
