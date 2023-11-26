import { useState } from "react";
import { Parser } from "json2csv";
import { useDispatch } from "react-redux";
import { setGeneratedOutput, setDigitizedData } from "@/store/digitizerSlice";
import { redirect } from "next/navigation";

const renderNestedObject = (obj) => {
  return Object.keys(obj).map((key, index) => (
    <div className="nested-object-container" key={index}>
      <h4 className="nested-object-title">{key.toUpperCase()}</h4>
      {typeof obj[key] === "object" && obj[key] !== null ? (
        renderNestedObject(obj[key])
      ) : (
        <p className="nested-object-value">
          {JSON.stringify(obj[key]).split('"').join("")}
        </p>
      )}
    </div>
  ));
};

const downloadCSV = (type, jsonObj) => {
  // Flatten the data
  const data = Object.values(jsonObj).reduce((acc, item) => {
    // For each item, check each property
    for (let key in item) {
      // If the property is an array, create a new row for each element
      if (Array.isArray(item[key])) {
        item[key].forEach((element) => {
          // Clone the item and replace the array with the current element
          const newItem = { ...item, [key]: element };
          acc.push(newItem);
        });
      } else {
        acc.push(item);
      }
    }
    return acc;
  }, []);

  // function flattenObject(obj, prefix = "") {
  //   return Object.keys(obj).reduce((acc, k) => {
  //     const pre = prefix.length ? prefix + "." : "";
  //     if (typeof obj[k] === "object" && obj[k] !== null) {
  //       Object.assign(acc, flattenObject(obj[k], pre + k));
  //     } else {
  //       acc[pre + k] = obj[k];
  //     }
  //     return acc;
  //   }, {});
  // }

  const parser = new Parser();
  const csv = parser.parse(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `notewiz-${Date.now()}.csv`;
  link.click();
};

const GeneratedOutput = ({ produceType, aiOutput }) => {
  const dispatch = useDispatch();
  return (
    <>
      {
        <div className="output-container">
          <div className="output-title">
            <button
              className="secondary-btn"
              onClick={() => {
                dispatch(setGeneratedOutput({}));
                dispatch(setDigitizedData({}));
                redirect("/product");
              }}
            >
              Reset
            </button>
            <button
              className="primary-btn"
              onClick={() => downloadCSV(produceType, aiOutput)}
            >
              Download CSV
            </button>
          </div>
          <div className="output-text">
            {produceType === "Flashcards" && (
              <div className="flashcard-output">
                {Object.keys(aiOutput).map((key, _) => {
                  return aiOutput[key].map((item, index) => {
                    return Object.keys(item).map((ideaItem, ideaIndex) => {
                      return (
                        <div className="flashcard-item" key={ideaIndex}>
                          <h4># {index + 1}</h4>
                          <p>{item[ideaItem]}</p>
                        </div>
                      );
                    });
                  });
                })}
              </div>
            )}
            {produceType === "Mock Exam" && (
              <div className="mock-exam-output">
                {Object.keys(aiOutput).map((key, _) => {
                  return aiOutput[key].map((item, index) => {
                    const [isOpen, setIsOpen] = useState(false);

                    return (
                      <div className="mock-exam-item" key={index}>
                        <h4>#{index+1}: {item.question}</h4>
                        <ol className="mock-exam-options">
                          {item.options.map((option, index) => (
                            <li className="mock-exam-option" key={index}>
                              <p>{option}</p>
                            </li>
                          ))}
                        </ol>
                        <button
                          className="secondary-btn"
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          {isOpen ? "Hide Answer" : "Show Answer"}
                        </button>
                        {isOpen && (
                          <p className="mock-exam-answer">
                            Answer: {item.options[item.answer]}
                          </p>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            )}
            {produceType === "Outline" && (
              <div className="outline-output">
                {renderNestedObject(aiOutput)}
              </div>
            )}
            {produceType === "Summary" && (
              <div className="summary-output">
                {renderNestedObject(aiOutput)}
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
};

export default GeneratedOutput;
