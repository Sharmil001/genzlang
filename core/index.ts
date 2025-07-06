import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { generateJS } from "./js-generator";
import { GenZLexer } from "./lexer";
import { parserInstance } from "./parser";
import { ToAstVisitor } from "./visitor";

const context = vm.createContext({ console });

function interpreter(input: string) {
  try {
    // === 1. Lexing ===
    const lexResult = GenZLexer.tokenize(input);
    if (lexResult.errors.length > 0) {
      console.error("🧨 Lexer Error:", lexResult?.errors?.[0]?.message);
      return;
    }

    // === 2. Parsing ===
    parserInstance.input = lexResult.tokens;
    const cst = parserInstance.program();

    if (parserInstance.errors.length > 0) {
      const err = parserInstance.errors[0];
      console.error(
        `🧨 Syntax Error at line ${err?.token.startLine}, col ${err?.token.startColumn}: ${err?.message}`
      );
      return;
    }

    // === 3. AST Generation ===
    const visitor = new ToAstVisitor();
    const ast = visitor.visit(cst);


    if (!ast) {
      console.error("🧨 AST Error: AST is undefined.");
      return;
    }

    // === 4. JS Generation ===
    const compiledjs = generateJS(ast);

    // === 5. Output & Execution ===
    const distDir = path.resolve("dist");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.appendFileSync("dist/out.js", `${compiledjs}\n`);

    const script = new vm.Script(compiledjs);
    script.runInContext(context);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("🧨 Fatal Error:", err.message);
    } else {
      console.error("🧨 Fatal Error:", String(err));
    }
  }
}

while (true) {
  const input = prompt("👾 >");
  if (input === "exit()") {
    fs.writeFileSync("dist/out.js", "");
    break;
  }
  if (input) {
    interpreter(input);
  }
}
