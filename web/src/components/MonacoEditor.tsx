"use client";

import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import type { ResponseData } from "../app/api/interpreter/route";

export default function MonacoEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [output, setOutput] = useState("You straight vibin\' 🔥");
  const initialCode = [
    'mood = "😎"',
    "",
    'fr mood same vibe "😎" {',
    ' yo "You straight vibin\' 🔥"',
    "}",
    "nah {",
    ' yo "Keep your head up, fam 💪😅"',
    "}",
  ].join("\n");

  // Initialize Monaco Editor
  useEffect(() => {
    const loadMonaco = async () => {
      if ((window as any).monaco) {
        createEditor();
        return;
      }

      const requireConfig = {
        paths: {
          vs: "https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs",
        },
      };
      (window as any).require = requireConfig;

      const loaderScript = document.createElement("script");
      loaderScript.src =
        "https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs/loader.js";
      loaderScript.onload = () => {
        (window as any).require(["vs/editor/editor.main"], () => {
          createEditor();
        });
      };
      document.body.appendChild(loaderScript);
    };

    const createEditor = () => {
      if (!editorRef.current) return;

      const monacoInstance = (window as any).monaco;

      monacoInstance.languages.register({ id: "genz" });

      const genzKeywords = [
        "yo",
        "fr",
        "nah",
        "loop",
        "from",
        "to",
        "in",
        "legit",
        "cap",
        "vibe",
        "none",
        "idk",
        "and",
        "or",
        "not",
        "risk",
        "oops",
        "explode",
        "hold",
        "same vibe",
        "not vibing",
      ];

      monacoInstance.languages.setMonarchTokensProvider("genz", {
        tokenizer: {
          root: [
            [new RegExp(`\\b(${genzKeywords.join("|")})\\b`, "i"), "keyword"],
            [/"[^"]*"/, "string"],
            [/\d+/, "number"],
            [/\+|\-|\*|\/|%|\*\*/, "operator"],
            [/==|!=|<=|>=|<|>/, "operator"],
            [/[a-zA-Z_]\w*/, "identifier"],
          ],
        },
      });

      monacoInstance.editor.defineTheme("genzBlock", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "F8A8A1", fontStyle: "bold" },
          { token: "operator", foreground: "F8A8A1" },
          { token: "identifier", foreground: "E0B891" },
          { token: "number", foreground: "E0B891" },
          { token: "string", foreground: "9BD0A1" },
        ],
        colors: {
          "editor.background": "#1d1d1d",
          "editor.foreground": "#E0B891",
          "editorLineNumber.foreground": "#3c3c3c",
          "editorCursor.foreground": "#F8A8A1",
          "editorIndentGuide.background": "#2b2b2b",
          "editor.selectionBackground": "#333333",
          "editor.lineHighlightBackground": "#222222",
          "editorOverviewRuler.border": "#1d1d1d",
        },
      });

      monacoInstance.editor.setTheme("genzBlock");

      const editor = monacoInstance.editor.create(editorRef.current, {
        value: initialCode,
        language: "genz",
        theme: "genzBlock",
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        fontLigatures: true,
        fontSize: 16,
        minimap: { enabled: false },
        lineNumbers: "off",
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        padding: { top: 20, bottom: 20 },
        scrollBeyondLastLine: false,
        overviewRulerLanes: 0,
        automaticLayout: true,
        renderLineHighlight: "line",
      });

      monacoRef.current = editor;
      editor.focus();
    };

    loadMonaco();
  }, []);

  const runCode = async () => {
    if (!monacoRef.current) return;
    const code = monacoRef.current.getValue();

    try {
      const res = await fetch("/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json() as ResponseData;
      setOutput(data?.output || "No output");
    } catch (err) {
      console.error(err);
      setOutput("Error running code");
    }
  };

  return (
    <div className="flex flex-wrap gap-6 w-full rounded-xl container mx-auto min-h-[400px] h-full text-start">
      {/* Editor */}
      <div className="flex-1 border-4 border-border-secondary rounded-lg shadow bg-terminal-background">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border-secondary">
          <h5 className="font-semibold text-gray-300">Playground</h5>
          <span className="text-xs text-gray-500">GenZ Editor</span>
        </div>
        <div className="flex flex-col gap-4 p-2">
          <div ref={editorRef} className="w-full min-h-[300px] h-full" />
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-primary text-lg font-bold px-6 py-1 border-2 rounded-lg bg-orange-400 hover:bg-orange-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={runCode}
            >
              Run
            </button>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="flex-1 border-4 border-border-secondary rounded-lg shadow bg-terminal-background text-terminal-foreground flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border-secondary">
          <h5 className="font-semibold text-gray-300">Output</h5>
          <span className="text-xs text-gray-500">Terminal</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
