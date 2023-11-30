"use client";

import { useState, useEffect } from "react";
import ExamnifyData from "@/components/ExamnifyData";
import FileDigitizer from "@/components/FileDigitizer";

import { useDispatch, useSelector } from "react-redux";
import { setDigitizedData, setGeneratedOutput } from "@/store/digitizerSlice";

import { pdfToImg } from "@/lib/pdf-to-img";
import imageToText from "@/lib/file-to-text";
import { redirect } from "next/navigation";

// To dispatch an action
// const dispatch = useDispatch();
// dispatch(setDigitizedData(data));

// To select state
// const digitizedData = useSelector((state) => state.digitizer.digitizedData);
// const generatedOutput = useSelector((state) => state.digitizer.generatedOutput);

const extractTextFromImageUpload = async (imageUpload) => {
  let extractedText = {};
  try {
    const result = await imageToText(imageUpload);
    extractedText.text = result;
    extractedText.success = true;
  } catch (error) {
    console.log(`extractTextFromImageUpload error: ${error}`);
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
    const textPromises = images.map((image) => imageToText(image, true));
    const pages = await Promise.all(textPromises);

    extractedText.success = true;
    extractedText.text = pages.join("\n");
  } catch (error) {
    console.log(`extractTextFromImageUpload error: ${error}`); // log error
    extractedText.success = false;
    extractedText.text =
      "Sorry. We encountered an error. This might be a server issue. Please try again later.";
  }
  return extractedText;
};

export default function Product() {
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploadedPDF, setUploadedPDF] = useState("");
  const [uploadType, setUploadType] = useState("Custom Input");
  const [customInput, setCustomInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [freshVisit, setFreshVisit] = useState(true);

  const dispatch = useDispatch();
  const digitizedData = useSelector((state) => state.digitizer.digitizedData);
  const generatedOutput = useSelector(
    (state) => state.digitizer.generatedOutput
  );

  useEffect(() => {
    console.log("digitizedData", digitizedData);
    console.log("generatedOutput", generatedOutput);
    if (isError) {
      alert("Sorry. We encountered an error. Please try again later.");
    }
    if (!isError && !isLoading && Object.keys(generatedOutput).length !== 0) {
      setFreshVisit(false);
      redirect("/result");
    }
    if (!freshVisit && isLoading && Object.keys(generatedOutput).length === 0 && Object.keys(digitizedData).length === 0) {
      setIsLoading(false);
      setIsError(false);
      setFreshVisit(true);
    }
  }, [generatedOutput, isError, isLoading, freshVisit]);

  const handleDigitize = () => {
    if (uploadType === "Image Upload") {
      if (uploadedImage === "") {
        return alert("Please upload an image.");
      } else {
        setIsLoading(true);
        extractTextFromImageUpload(uploadedImage).then((result) => {
          setIsLoading(false);
          if (result.success) {
            dispatch(setDigitizedData(result));
          } else {
            setIsError(true);
          }
        });
      }
    } else if (uploadType === "PDF Upload") {
      if (uploadedPDF === "") {
        return alert("Please upload a PDF.");
      } else {
        setIsLoading(true);
        extractTextFromPdfUpload(uploadedPDF).then((result) => {
          setIsLoading(false);
          if (result.success) {
            dispatch(setDigitizedData(result));
          } else {
            setIsError(true);
          }
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
        dispatch(setDigitizedData(result));
      }
    }
  };

  const handleReset = () => {
    setUploadedImage("");
    setUploadedPDF("");
    setCustomInput("");
  };

  return (
    <main className="product-container">
      <FileDigitizer
        uploadType={uploadType}
        setUploadType={setUploadType}
        setCustomInput={setCustomInput}
        customInput={customInput}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        uploadedPDF={uploadedPDF}
        setUploadedPDF={setUploadedPDF}
        handleReset={handleReset}
        isLoading={isLoading}
      />
      <ExamnifyData
        digitizedData={digitizedData}
        setGeneratedOutput={setGeneratedOutput}
        handleDigitize={handleDigitize}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isError={isError}
        setIsError={setIsError}
      />
    </main>
  );
}
