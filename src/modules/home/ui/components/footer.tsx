import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="text-muted-foreground text-lg border-t border-muted   text-center w-full p-2 mt-2">
      Made with ❤️ by the{" "}
      <Link
        href={"https://github.com/TheMercury1229"}
        className="hover:underline hover:text-primary"
      >
        Mercury
      </Link>
    </footer>
  );
};
