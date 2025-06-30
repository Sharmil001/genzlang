import path from "path";
import { generateJS } from "./src/js-generator";
import { GenZLexer } from "./src/lexer";
import { parserInstance } from "./src/parser";
import { ToAstVisitor } from "./src/visitor";
import fs from "fs";

const test = `
say = 1 + 1
say = "hello"
say = 2 - 1
`;

const lexResult = GenZLexer.tokenize(test);
console.log(lexResult, 2);
parserInstance.input = lexResult.tokens;

const cst = parserInstance.program();

const visitor = new ToAstVisitor();
const ast = visitor.visit(cst);
const compiledjs = generateJS(ast);

const distDir = path.resolve("dist");
if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync("dist/out.js", compiledjs);
console.log(ast, 4);

