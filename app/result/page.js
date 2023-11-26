"use client";

import GeneratedOutput from "@/components/GeneratedOutput";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

export default function Result() {
  const generatedOutput = useSelector(
    (state) => state.digitizer.generatedOutput
  );
  useEffect(() => {
    if (Object.keys(generatedOutput).length === 0) {
      redirect("/product");
    }
  }, [generatedOutput]);
  return (
    <div className="result-container">
      <GeneratedOutput aiOutput={generatedOutput.data} produceType={generatedOutput.outputType}/>
    </div>
  );
}
