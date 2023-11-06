"use client";

import { useState } from "react";
import ExamnifyData from "@/components/ExamnifyData";
import ImageDigitizer from "@/components/ImageDigitizer";

export default function Home() {
  const [promptData, setPromptData] = useState({});
  return (
    <main style={{ display: "flex", width: "100%", alignItems: "flex-start"  }}>
      <ImageDigitizer style={{ flex: "0 0 40%" }} setPromptData={setPromptData}/>
      <ExamnifyData style={{ flex: "0 0 60%" }} promptData={promptData}/>
    </main>
  );
}
