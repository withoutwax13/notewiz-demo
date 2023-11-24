import Link from "next/link";

export default function Home() {
  return (
    <main className="home-container">
      <div className="hero">
        <h1 className="hero-title">Elevate Your Studies with NoteWiz</h1>
        <p className="hero-paragraph">
          Digitize handwritten or printed notes, upload PDFs effortlessly, and
          let our AI create mock exams, flashcards, and concise summaries for
          your academic success. <span className="hero-highlight">All for free.</span>
        </p>
        <Link href="/product" className="hero-button">Get Started</Link>
      </div>
    </main>
  );
}
