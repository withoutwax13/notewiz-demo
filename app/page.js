"use client";

import { useState } from "react";
import ExamnifyData from "@/components/ExamnifyData";
import ImageDigitizer from "@/components/ImageDigitizer";

export default function Home() {
  const [promptData, setPromptData] = useState({});
  return (
    <main>
      <ImageDigitizer setPromptData={setPromptData} />
      <ExamnifyData promptData={promptData} />
    </main>
  );
}
