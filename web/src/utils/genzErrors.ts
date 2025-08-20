export function genZErrorMessage(type: "lex" | "parse" | "runtime", error: any): string {
  const line = error?.token?.startLine ?? error?.line ?? "??";
  const col = error?.token?.startColumn ?? error?.column ?? "??";

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
    `🔥 Code blew up at runtime fam: ${error?.message ?? "Unknown crash"}`,
    `🤡 JS engine tripped over: ${error?.message ?? "??"}`,
    `🚨 Broke reality at runtime: ${error?.message ?? "??"}`
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
}
