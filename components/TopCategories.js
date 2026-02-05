"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function TypedCategories() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "<strong>Full Stack Development</strong>",
        "<strong>Data Science</strong>",
        "<strong>Machine Learning</strong>",
        "<strong>Artificial Intelligence (AI)</strong>",
        "<strong>Cyber Security</strong>",
        "<strong>Cloud Computing</strong>",
        "<strong>DevOps</strong>",
        "<strong>Mobile App Development</strong>",
        "<strong>Blockchain Development</strong>",
        "<strong>Internet of Things (IoT)</strong>",
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
