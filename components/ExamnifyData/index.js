import { useEffect, useState } from "react";
import { OpenAI } from "openai";
import configuration from "@/lib/openaiConfig";
import { useDispatch } from "react-redux";
import SystemMessage from "../SytemMessage";
import Loading from "../Loading";

const sendPromptToOpenAI = async ({ prompt, type }) => {
  const openai = new OpenAI(configuration);
  let createObject = {},
    result = {};
  switch (type) {
    case "Outline":
      createObject = {
        messages: [
          {
            role: "system",
            content:
              "You will return JSON object, The property names are the topic headings. You can have many objects within an object.",
          },
          {
            role: "user",
            content: `Write a summary outline based on the text below, remember USE ONLY THE TEXT BELOW, it is IMPORTANT. \n${prompt}`,
          },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      };
      break;
    case "Mock Exam":
      createObject = {
        messages: [
          {
            role: "system",
            content:
              "You will return JSON object. The JSON object should contain an ARRAY OF OBJECT DATA, this is important.",
          },
          {
            role: "user",
            content: `Return 5-10 array item of object data. Each object data item is composed of the 'question', the 'options' (in an array data of string), and the 'answer' (an integer that indicates the index of the answer in options array), THIS IS IMPORTANT. \n${prompt}`,
          },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      };
      break;
    case "Flashcards":
      createObject = {
        messages: [
          {
            role: "system",
            content:
              "You will return JSON object. The JSON object should contain an ARRAY OF OBJECT DATA, this is important.",
          },
          {
            role: "user",
            content: `Return 5-10 array item of string. The strings are the ideas/facts found in the text which will help the user to understand the text I will give, THIS IS IMPORTANT. \n${prompt}`,
          },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      };
      break;
    case "Summary":
      createObject = {
        messages: [
          {
            role: "system",
            content:
              "You will return JSON object. The JSON object should contain a string.",
          },
          {
            role: "user",
            content: `Write a short sumamry, maximum of 5 sentences, of the this text: \n${prompt}`,
          },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      };
    default:
      break;
  }
  const completion = await openai.chat.completions.create(createObject);
  result = {
    success: true,
    id: completion.id,
    data: JSON.parse(completion.choices[0].message.content),
    usage: completion.usage.total_tokens,
    outputType: type,
  };
  return result;
};

const ExamnifyData = ({
  setGeneratedOutput,
  handleDigitize,
  digitizedData,
  isLoading,
  setIsLoading,
  isError,
  setIsError,
}) => {
  const [produceType, setProduceType] = useState("Mock Exam");
  const dispatch = useDispatch();

  const handleProduceOutput = () => {
    setIsLoading(true);

    sendPromptToOpenAI({ prompt: digitizedData.text, type: produceType }).then(
      (res) => {
        if (res.success) {
          dispatch(setGeneratedOutput(res));
        } else {
          setIsError(true);
        }
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    if (digitizedData.success) {
      handleProduceOutput();
    }
  }, [digitizedData]);

  return (
    <div className="examnify-data-container">
      <div className="section-title">
        <h1>2. Select Output Type</h1>
      </div>
      <div className="option-group-container">
        <div className="option-group">
          <input
            type="radio"
            id="mockExam"
            name="produceType"
            value="Mock Exam"
            checked={produceType === "Mock Exam"}
            disabled={isLoading}
            onChange={(e) => {
              setProduceType(e.target.value);
              setIsError(false);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="mockExam">Mock Exam</label>
        </div>
        <div className="option-group">
          <input
            type="radio"
            id="flashcards"
            name="produceType"
            value="Flashcards"
            checked={produceType === "Flashcards"}
            disabled={isLoading}
            onChange={(e) => {
              setProduceType(e.target.value);
              setIsError(false);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="flashcards">Flashcards</label>
        </div>
        <div className="option-group">
          <input
            type="radio"
            id="outline"
            name="produceType"
            value="Outline"
            checked={produceType === "Outline"}
            disabled={isLoading}
            onChange={(e) => {
              setProduceType(e.target.value);
              setIsError(false);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="outline">Outline</label>
        </div>
        <div className="option-group">
          <input
            type="radio"
            id="summary"
            name="produceType"
            value="Summary"
            checked={produceType === "Summary"}
            disabled={isLoading}
            onChange={(e) => {
              setProduceType(e.target.value);
              setIsError(false);
            }}
            className="radio-input data-source-utility-input"
          />
          <label htmlFor="summary">Summary</label>
        </div>
      </div>
      <div className="button-group">
        <button
          className="primary-btn"
          onClick={() => {
            handleDigitize();
          }}
          disabled={isLoading}
        >
          Generate {produceType}
        </button>
      </div>
      {isError && <SystemMessage message="Something went wrong." />}
      {isLoading && <Loading message="Please wait for a few moments . . ." />}
    </div>
  );
};

export default ExamnifyData;
