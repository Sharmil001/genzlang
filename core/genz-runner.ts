import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { generateJS } from "./engine/js-generator.js";
import { GenZLexer } from "./engine/lexer.js";
import { parserInstance } from "./engine/parser.js";
import { ToAstVisitor } from "./engine/visitor.js";
import zlib from "node:zlib";

const context = vm.createContext({ console });

export function interpreter(input: string): void {
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

    console.log(cst);

    // === 3. AST Generation ===
    const visitor = new ToAstVisitor();
    const ast = visitor.visit(cst);

    if (!ast) {
      console.error("🧨 AST Error: AST is undefined.");
      return;
    }

    console.dir(ast, { depth: null });

    // === 4. JS Generation ===
    const compiledjs = generateJS(ast);

    console.log(compiledjs);

    // === 5. Output & Execution ===
    const distDir = path.resolve("dist");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync("dist/out.js", compiledjs + "\n");

    const script = new vm.Script(compiledjs);
    script.runInContext(context);
  } catch (err) {
    console.error("🧨 Fatal Error:", err instanceof Error ? err.message : String(err));
  }
}

// === CLI Runner ===
let file = process.argv[2];
if (!file) {
  console.error("Usage: GENZ <file.gz>");
  process.exit(1);
}

// Auto-append .gz if missing
if (!file.endsWith(".gz")) {
  file += ".gz";
}

if (!fs.existsSync(file)) {
  console.error(`🧨 File not found: ${file}`);
  process.exit(1);
}

const sourceRaw = fs.readFileSync(file);
const source = zlib.gunzipSync(sourceRaw).toString("utf-8");

interpreter(source);
