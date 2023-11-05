import { useState } from "react";
import { ChatGPTAPI } from "chatgpt";
import Loading from "../Loading";
import SystemMessage from "../SytemMessage";

const sendPromptToChatGPT = async ({ prompt, type }) => {
  const api = new ChatGPTAPI({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    debug: false,
  });
  let res;
  try {
    if (type === "Summarize") {
      res = await api.sendMessage(
        `Write a summary based on the text below, remember USE ONLY THE TEXT BELOW, it is IMPORTANT.\n${prompt}`,
        // timeout after 2 minutes
        {
          timeoutMs: 2 * 60 * 1000,
          systemMessage:
            "Return your response in an object data, wherein the property name is the topic heading. You can have many objects within an object. I REPEAT RETURN THE OBJECT DATA, no unnecessary words needed from you, this is the most important.",
        }
      );
      console.log(res);
    } else if (type === "Mock Exam") {
      res = await api.sendMessage(
        `Derive 5 questions of multiple choice option with answers based on the text below, USE ONLY THE TEXT BELOW, it is IMPORTANT.
        \n${prompt}`,
        // timeout after 2 minutes
        {
          timeoutMs: 2 * 60 * 1000,
          systemMessage:
            "Your response should be JUST an ARRAY OF OBJECT DATA, this is important, wherein the object data item is composed of the 'question', the 'options' (in an array data of string), and the 'answer' (an integer that indicates the index of the answer in options array), THIS IS IMPORTANT.  I REPEAT RETURN THE ARRAY DATA, no unnecessary words are needed from you, this is the most important.",
        }
      );
      console.log(res);
    }
    return {
      data: res.text,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: error,
    };
  }
};

const ExamnifyData = ({ promptData }) => {
  const [produceType, setProduceType] = useState("Mock Exam");
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleProduceOutput = () => {
    setIsLoading(true);
    sendPromptToChatGPT({ prompt: promptData.text, type: produceType }).then(
      (res) => {
        if (res.success) {
          setAiResponse(JSON.parse(res.data));
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
        <h4 style={{ fontWeight: "800" }}>{key}</h4>
        {typeof obj[key] === "object" && obj[key] !== null ? (
          renderNestedObject(obj[key])
        ) : (
          <p>{JSON.stringify(obj[key])}</p>
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
      {produceType === "Flashcards" && <div><p>Flashcards are not yet supported.</p></div>}
      {aiResponse !== null && !isLoading && (
        <div className="output-container">
          <div className="output-title">
            <h3>Output</h3>
          </div>
          <div className="output-text">
            {produceType === "Mock Exam" && (
              <div className="mock-exam-output">
                {aiResponse.map((item, index) => (
                  <div className="mock-exam-item" key={index}>
                    <h4 style={{ fontWeight: "800" }}>{item.question}</h4>
                    <ol className="mock-exam-options">
                      {item.options.map((option, index) => (
                        <li className="mock-exam-option" key={index}>
                          <p>{option}</p>
                        </li>
                      ))}
                    </ol>
                    <p style={{ fontWeight: "600" }}>
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
