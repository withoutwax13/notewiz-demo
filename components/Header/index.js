"use client";
import React, { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-logo">
          <Link href="/">
            NoteWiz
          </Link>
        </h1>
        <button onClick={() => setIsOpen(true)} className="menu-button">
          Menu
        </button>
        <nav className={isOpen ? "menu show" : "menu"}>
          <button onClick={() => setIsOpen(false)} className="close-button">
            X
          </button>
          <a
            href="https://github.com/withoutwax13/notewiz-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item-secondary"
          >
            REPOSITORY
          </a>
          <a
            href="https://jpvalera.carrd.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item-secondary"
          >
            DEVELOPER
          </a>
          <a
            // todo: add donate logic
            // href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            DONATE
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
