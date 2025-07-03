import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { generateJS } from "./js-generator";
import { GenZLexer } from "./lexer";
import { parserInstance } from "./parser";
import { ToAstVisitor } from "./visitor";

const context = vm.createContext({ console });

function interpreter(input: string) {
  const lexResult = GenZLexer.tokenize(input);
  parserInstance.input = lexResult.tokens;
  const cst = parserInstance.program();
  const visitor = new ToAstVisitor();
  const ast = visitor.visit(cst);
  console.dir(ast, { depth: null });
  const compiledjs = generateJS(ast);
  const distDir = path.resolve("dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.appendFileSync("dist/out.js", `${compiledjs}\n`);

  const script = new vm.Script(compiledjs);
  script.runInContext(context);
}

while (true) {
	const input = prompt("👾 >");
	if (input === "exit()") {
      fs.writeFileSync("dist/out.js", "");
      break;
	}
  if(input){
    interpreter(input);
  }
}
