import { useState } from "react";
import { OpenAI } from "openai";
import configuration from "@/lib/openaiConfig";
import Loading from "../Loading";
import SystemMessage from "../SytemMessage";

const sendPromptToOpenAI = async ({ prompt, type }) => {
  const openai = new OpenAI(configuration);
  let createObject = {},
    result = {};
  switch (type) {
    case "Summarize":
      createObject = {
        messages: [
          {
            role: "system",
            content:
              "You will return JSON object, The property names are the topic headings. You can have many objects within an object.",
          },
          {
            role: "user",
            content: `Write a summary based on the text below, remember USE ONLY THE TEXT BELOW, it is IMPORTANT. \n${prompt}`,
          },
        ],
        model: "gpt-3.5-turbo-1106",
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
            content: `Return minimum of 5 array item of object data. If the text is long enough, the maximum of array should be at 10. Each object data item is composed of the 'question', the 'options' (in an array data of string), and the 'answer' (an integer that indicates the index of the answer in options array), THIS IS IMPORTANT. \n${prompt}`,
          },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: { type: "json_object" },
      };
      break;
    default:
      break;
  }
  const completion = await openai.chat.completions.create(createObject);
  result = {
    success: true,
    id: completion.id,
    data: JSON.parse(completion.choices[0].message.content),
    usage: completion.usage.total_tokens,
  };
  console.log(`${typeof result.data}`);
  console.log(result.data);
  return result;
};

const ExamnifyData = ({ promptData }) => {
  const [produceType, setProduceType] = useState("Mock Exam");
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleProduceOutput = () => {
    setIsLoading(true);
    sendPromptToOpenAI({ prompt: promptData.text, type: produceType }).then(
      (res) => {
        if (res.success) {
          setAiResponse(res.data);
        } else {
          setIsError(true);
        }
        setIsLoading(false);
      }
    );
  };
  const renderNestedObject = (obj) => {
    return Object.keys(obj).map((key, index) => (
      <div key={index}>
        <h4
          style={{ fontWeight: "800", marginTop: "5px", marginBottom: "5px" }}
        >
          {key}
        </h4>
        {typeof obj[key] === "object" && obj[key] !== null ? (
          renderNestedObject(obj[key])
        ) : (
          <p style={{ marginTop: "5px", marginBottom: "5px" }}>
            {JSON.stringify(obj[key]).split('"').join("")}
          </p>
        )}
      </div>
    ));
  };
  return (
    <div className="examnify-container">
      <div className="section-title">
        <h1 style={{ fontWeight: "800" }}>Examnify Digitized Data</h1>
      </div>
      <div className="examnify-data-utilities">
        <div className="option-group">
          <div className="examnify-options">
            <input
              type="radio"
              id="mockExam"
              name="produceType"
              value="Mock Exam"
              checked={produceType === "Mock Exam"}
              onChange={(e) => {
                setProduceType(e.target.value);
                setAiResponse(null);
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
              onChange={(e) => {
                setProduceType(e.target.value);
                setAiResponse(null);
                setIsError(false);
              }}
              className="radio-input data-source-utility-input"
            />
            <label htmlFor="flashcards">Flashcards</label>
          </div>
          <div className="option-group">
            <input
              type="radio"
              id="summarize"
              name="produceType"
              value="Summarize"
              checked={produceType === "Summarize"}
              onChange={(e) => {
                setProduceType(e.target.value);
                setAiResponse(null);
                setIsError(false);
              }}
              className="radio-input data-source-utility-input"
            />
            <label htmlFor="summarize">Summarize</label>
          </div>
        </div>
        <div className="examnify-actions">
          <button
            className="primary-btn"
            onClick={handleProduceOutput}
            disabled={isLoading}
          >
            Produce Output
          </button>
        </div>
      </div>
      {produceType === "Flashcards" && (
        <div>
          <p>Flashcards are not yet supported.</p>
        </div>
      )}
      {aiResponse !== null && !isLoading && (
        <div className="output-container">
          <div className="output-title">
            <h3>Output</h3>
          </div>
          <div className="output-text">
            {produceType === "Mock Exam" && (
              <div className="mock-exam-output">
                {aiResponse["questions"]
                  ? aiResponse["questions"].map((item, index) => (
                      <div className="mock-exam-item" key={index}>
                        <h4 style={{ fontWeight: "800" }}>{item.question}</h4>
                        <ol className="mock-exam-options">
                          {item.options.map((option, index) => (
                            <li className="mock-exam-option" key={index}>
                              <p>{option}</p>
                            </li>
                          ))}
                        </ol>
                        <p
                          style={{ fontWeight: "600" }}
                          className="mock-exam-answer"
                        >
                          Answer: {item.options[item.answer]}
                        </p>
                      </div>
                    ))
                  : aiResponse["data"].map((item, index) => (
                      <div className="mock-exam-item" key={index}>
                        <h4 style={{ fontWeight: "800" }}>{item.question}</h4>
                        <ol className="mock-exam-options">
                          {item.options.map((option, index) => (
                            <li className="mock-exam-option" key={index}>
                              <p>{option}</p>
                            </li>
                          ))}
                        </ol>
                        <p
                          style={{ fontWeight: "600" }}
                          className="mock-exam-answer"
                        >
                          Answer: {item.options[item.answer]}
                        </p>
                      </div>
                    ))}
              </div>
            )}
            {produceType === "Summarize" && (
              <div className="summarize-output">
                {renderNestedObject(aiResponse)}
              </div>
            )}
          </div>
        </div>
      )}
      {aiResponse === null && isLoading && (
        <Loading text="Generating Output..." style={{ color: "black" }} />
      )}
      {isError && SystemMessage({ message: "Error in generating output." })}
    </div>
  );
};

export default ExamnifyData;
