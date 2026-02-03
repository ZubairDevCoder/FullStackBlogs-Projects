"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function TypedCategories() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "<strong>Frontend Developer</strong>",
        "<strong>Backend Developer</strong>",
        "<strong>Full Stack Developer</strong>",
        "<strong>Web Developer</strong>",
        "<strong>MERN Stack Developer</strong>",
        "<strong>MEAN Stack Developer</strong>",
        "<strong>JavaScript Developer</strong>",
        "<strong>TypeScript Developer</strong>",
        "<strong>React Developer</strong>",
        "<strong>Next.js Developer</strong>",
        "<strong>Node.js Developer</strong>",
        "<strong>Express.js Developer</strong>",
        "<strong>MongoDB Developer</strong>",
        "<strong>Firebase Developer</strong>",
        "<strong>REST API Developer</strong>",
        "<strong>Data Science</strong>",
      ],
      typeSpeed: 60, // Typing speed
      backSpeed: 40, // Deleting speed
      loop: true, // Infinite loop
      contentType: "html", // Important for HTML tags
      smartBackspace: true,
    });

    return () => typed.destroy();
  }, []);

  return (
    <span className="text-purple-700 dark:text-white" ref={typedRef}></span>
  );
}
