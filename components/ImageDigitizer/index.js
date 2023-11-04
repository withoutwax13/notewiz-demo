"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { pdfToImg } from "@/lib/pdf-to-img";
import Loading from "../Loading";

const extractTextFromImageUrl = async (imageUrl) => {
  let extractedText = "";
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(imageUrl);
    extractedText = ret.data.text;
    await worker.terminate();
  } catch (error) {
    extractedText =
      "Sorry. We encountered an error. Image URL is not publicly available. Please try another image URL, or please download the image and upload it.";
  }
  return extractedText;
};

const extractTextFromImageUpload = async (imageUpload) => {
  let extractedText = "";
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(imageUpload);
    extractedText = ret.data.text;
    await worker.terminate();
  } catch (error) {
    extractedText =
      "Sorry. We encountered an error. Please try another image URL, or please download the image and upload it.";
  }
  return extractedText;
};

const extractTextFromPdfUpload = async (pdfUpload) => {
  let extractedText = "";
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

    extractedText = pages.join("\n\n");
  } catch (error) {
    extractedText =
      "Sorry. We encountered an error. Please try another image URL, or please download the image and upload it.";
  }
  return extractedText;
};

const ImageDigitizer = () => {
  const [digitizedData, setDigitizedData] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploadedPDF, setUploadedPDF] = useState("");
  const [uploadType, setUploadType] = useState("Image URL");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
  };
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    setUploadedPDF(file);
  };

  const handleDigitize = () => {
    if (uploadType === "Image URL") {
      if (imageURL === "") {
        return alert("Please enter an image URL.");
      } else {
        setIsLoading(true);
        extractTextFromImageUrl(imageURL).then((text) => {
          setIsLoading(false);
          setDigitizedData(text);
        });
      }
    } else if (uploadType === "Image Upload") {
      if (uploadedImage === "") {
        return alert("Please upload an image.");
      } else {
        setIsLoading(true);
        extractTextFromImageUpload(uploadedImage).then((text) => {
          setIsLoading(false);
          setDigitizedData(text);
        });
      }
    } else if (uploadType === "PDF Upload") {
      if (uploadedPDF === "") {
        return alert("Please upload a PDF.");
      } else {
        setIsLoading(true);
        extractTextFromPdfUpload(uploadedPDF).then((text) => {
          setIsLoading(false);
          setDigitizedData(text);
        });
      }
    }
  };
  const handleReset = () => {
    setDigitizedData(null);
    setImageURL("");
    setUploadedImage("");
    setUploadedPDF("");
  };
  return (
    <div className="image-digitizer">
      <div className="utilities">
        <div className="data-source-utility">
          <input
            type="radio"
            id="imageUrl"
            name="uploadType"
            value="Image URL"
            checked={uploadType === "Image URL"}
            onChange={(e) => {
              handleReset();
              setUploadType(e.target.value);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="imageUrl">ImageURL</label>

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

        {uploadType === "Image URL" && (
          <input
            type="text"
            placeholder="Enter Image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            disabled={digitizedData !== null}
          />
        )}

        {uploadType === "Image Upload" && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            disabled={digitizedData !== null}
          />
        )}

        {uploadType === "PDF Upload" && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handlePdfUpload(e)}
            disabled={digitizedData !== null}
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
      </div>
      <div className="digitized-output">
        {isLoading && digitizedData === null && (
          <Loading message="Digitizing..." />
        )}
        {digitizedData !== null && (
          <div className="digitized-data">
            <h2 style={{ fontWeight: "800" }}>Digitized Data</h2>
            <br />
            {digitizedData !== null && (
              <p className="digitized-text">{digitizedData}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDigitizer;
