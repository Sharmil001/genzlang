interface ErrorMessage {
  token?: {
    startLine?: number;
    startColumn?: number;
  };
  line?: number;
  column?: number;
  message?: string;
  [key: string]: unknown;
}

export function genZErrorMessage(type: "lex" | "parse" | "runtime", error: ErrorMessage | unknown): string {
  const errorObj = (error && typeof error === 'object') ? error as ErrorMessage : {};
  const line = errorObj?.token?.startLine ?? errorObj?.line ?? "??";
  const col = errorObj?.token?.startColumn ?? errorObj?.column ?? "??";

  const lexMessages = [
    `📉 Bruh, fix yo' grammar`,
    `💀 Sus`,
    `🧨 Syntax Error`
  ];

  const parseMessages = [
    `🚧 Syntax looking like spaghetti at line ${line}, col ${col}.`,
    `👀 My parser just looked at line ${line} and said "nah fam".`,
    `🥴 Line ${line}:${col} really vibin’ wrong.`
  ];

  const runtimeMessages = [
    `🔥 Code blew up at runtime fam: ${errorObj?.message ?? "Unknown crash"}`,
    `🤡 JS engine tripped over: ${errorObj?.message ?? "??"}`,
    `🚨 Broke reality at runtime: ${errorObj?.message ?? "??"}`
  ];

  const pool =
    type === "lex" ? lexMessages
    : type === "parse" ? parseMessages
    : runtimeMessages;

  return pool[Math.floor(Math.random() * pool.length)] ?? "Unknow error fam 🤷";
}

export const errorMessages = {
  "noCode": "😤 Yo fam, gimme some code to vibe with.",
  "noOutput": "😤 Yo fam, gimme some output to see.",
  "syntaxError": "🧨 Syntax Error",
  "runtimeError": "🔥 Code blew up at runtime fam",
} as const;
