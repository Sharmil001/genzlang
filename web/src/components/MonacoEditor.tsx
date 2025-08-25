"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as monaco from "monaco-editor";
import type { ResponseData } from "../app/api/interpreter/route";

interface MonacoRequire {
  (deps: string[], callback: () => void): void;
  config: (options: { paths: { vs: string } }) => void;
}

declare global {
  interface Window {
    monaco?: typeof monaco;
    require?: MonacoRequire;
  }
}

export default function MonacoEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [output, setOutput] = useState("You straight vibin' 🔥");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const initialCode = useCallback(
    () =>
      [
        'mood = "😎"',
        "",
        'fr mood same vibe "😎" ->',
        ' yo "You straight vibin\' 🔥"',
        "<-",
        "nah ->",
        ' yo "Keep your head up, fam 💪😅"',
        "<-",
      ].join("\n"),
    []
  );

  const getCSSVariable = useCallback((variable: string): string => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }, []);

  const createDynamicTheme = useCallback(
    (themeName: string, isDark: boolean) => {
      if (!window.monaco) return;

      const monacoInstance = window.monaco;

      const theme = {
        base: isDark ? "vs-dark" : "vs",
        inherit: true,
        rules: [
          {
            token: "keyword",
            foreground: getCSSVariable("--monaco-keyword").replace("#", ""),
            fontStyle: "bold",
          },
          {
            token: "operator",
            foreground: getCSSVariable("--monaco-operator").replace("#", ""),
          },
          {
            token: "identifier",
            foreground: getCSSVariable("--monaco-identifier").replace("#", ""),
          },
          {
            token: "number",
            foreground: getCSSVariable("--monaco-number").replace("#", ""),
          },
          {
            token: "string",
            foreground: getCSSVariable("--monaco-string").replace("#", ""),
          },
          {
            token: "comment",
            foreground: getCSSVariable("--monaco-comment").replace("#", ""),
          },
        ],
        colors: {
          "editor.background": getCSSVariable("--monaco-bg"),
          "editor.foreground": getCSSVariable("--monaco-fg"),
          "editorLineNumber.foreground": getCSSVariable("--monaco-line-number"),
          "editorCursor.foreground": getCSSVariable("--monaco-cursor"),
          "editorIndentGuide.background": getCSSVariable(
            "--monaco-indent-guide"
          ),
          "editor.selectionBackground": getCSSVariable("--monaco-selection"),
          "editor.lineHighlightBackground": getCSSVariable(
            "--monaco-line-highlight"
          ),
          "editorOverviewRuler.border": getCSSVariable("--monaco-ruler-border"),
          "editorGutter.background": getCSSVariable("--monaco-gutter-bg"),
          "editor.inactiveSelectionBackground": getCSSVariable(
            "--monaco-inactive-selection"
          ),
          "editorWidget.background": getCSSVariable("--monaco-widget-bg"),
          "editorWidget.border": getCSSVariable("--monaco-widget-border"),
        },
      } as monaco.editor.IStandaloneThemeData;

      monacoInstance.editor.defineTheme(themeName, theme);
      monacoInstance.editor.setTheme(themeName);
    },
    [getCSSVariable]
  );

  useEffect(() => {
    const detectTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);

      if (window.monaco && monacoRef.current) {
        createDynamicTheme("genzBlock", isDark);
      }
    };

    detectTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => detectTheme();
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [createDynamicTheme]);

  // Initialize Monaco Editor
  useEffect(() => {
    const loadMonaco = async () => {
      if (window.monaco) {
        createEditor();
        return;
      }

      // prevent injecting loader multiple times
      if (document.getElementById("monaco-loader")) {
        return;
      }

      const script = document.createElement("script");
      script.id = "monaco-loader";
      script.src =
        "https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs/loader.js";

      script.onload = () => {
        if (window.require) {
          window.require.config({
            paths: {
              vs: "https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs",
            },
          });

          window.require(["vs/editor/editor.main"], () => {
            createEditor();
          });
        }
      };

      document.head.appendChild(script);
    };

    const createEditor = () => {
      if (!editorRef.current || !window.monaco) return;

      const monacoInstance = window.monaco;

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

      createDynamicTheme("genzBlock", isDarkMode);

      const editor = monacoInstance.editor.create(editorRef.current, {
        value: initialCode(),
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
  }, [initialCode, createDynamicTheme, isDarkMode]);

  const runCode = async () => {
    if (!monacoRef.current) return;
    const code = monacoRef.current.getValue();

    try {
      const res = await fetch("/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as ResponseData;
      setOutput(data?.output || "No output");
    } catch (err) {
      console.error(err);
      setOutput("Error running code");
    }
  };

  return (
    <div className="flex flex-wrap gap-6 w-full rounded-xl container mx-auto h-full text-start">
      {/* Editor */}
      <div className="flex-1 border-4 border-border-secondary rounded-lg shadow bg-terminal-background flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border-secondary">
          <h5 className="font-bold text-gray-800 dark:text-gray-300">Playground</h5>
          <span className="text-xs text-gray-500">GenZ Editor</span>
        </div>
        <div className="flex flex-col gap-4 p-2 flex-1">
          {/* wrapper fixes hydration warning */}
          <div className="flex-1 h-full">
            <div ref={editorRef} className="w-full h-full" />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-primary text-lg font-bold px-6 py-1 border-2 border-black rounded-lg bg-button-bg hover:bg-orange-400 cursor-pointer"
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
          <h5 className="font-bold text-gray-800 dark:text-gray-300">Output</h5>
          <span className="text-xs text-gray-500">Terminal</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
