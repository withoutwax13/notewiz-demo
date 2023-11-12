"use client";

import { useState } from "react";
import ExamnifyData from "@/components/ExamnifyData";
import ImageDigitizer from "@/components/ImageDigitizer";

export default function Home() {
  const [promptData, setPromptData] = useState({});
  return (
    <main className="container">
      <ImageDigitizer className="image-digitizer" style={{ flex: "0 0 40%" }} setPromptData={setPromptData}/>
      <ExamnifyData className="examnify-data" style={{ flex: "0 0 60%" }} promptData={promptData}/>
    </main>
  );
}
