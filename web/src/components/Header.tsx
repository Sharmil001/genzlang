"use client";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../hooks/useTheme";

export default function Header() {
 const { isDark, toggleTheme } = useTheme();

  return (
    <div className="p-4 container mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image src="/logo.png" alt="GenZ Lang Logo" width={48} height={48} />
          <h2 className="font-extrabold text-2xl font-orbitron">GenZang</h2>
        </div>

        <div className="flex items-center gap-6">
          <a
            className="font-semibold text-tertiary"
            href="https://genz-lang.gitbook.io/genz-lang-docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a
            className="font-semibold text-tertiary"
            href="https://github.com/Sharmil001/genz-lang"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          <button
            type="button"
            className="flex items-center justify-center rounded-sm cursor-pointer"
            onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
