// pages/api/interpreter.ts
import { GenZLexer } from "@c/engine/lexer";
import { parserInstance } from "@c/engine/parser";
import { ToAstVisitor } from "@c/engine/visitor";
import { generateJS } from "@c/engine/js-generator";
import { Script, createContext } from "node:vm";
import { NextResponse, type NextRequest } from "next/server";
import { errorMessages, genZErrorMessage } from "@w/src/utils/genzErrors";

export type ResponseData = {
  output?: string;
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json() as { code: string };

    if (!code) {
      return NextResponse.json({ output: errorMessages.noCode });
    }
    

    // ==== Lexing ====
    const lexResult = GenZLexer.tokenize(code);
    if (lexResult.errors.length > 0) {

      const lexPrefix = genZErrorMessage("lex", lexResult.errors[0]);
      return NextResponse.json({
        output: `[${lexPrefix}] ${lexResult.errors[0]?.message}`,
      });
    }

    // ==== Parsing ====
    parserInstance.input = lexResult.tokens;
    const cst = parserInstance.program();
    if (parserInstance.errors.length > 0) {
      const error = parserInstance.errors[0];
      return NextResponse.json({
        output: genZErrorMessage("parse", error),
      });
    }

    // ==== AST & JS generation ====
    const ast = new ToAstVisitor().visit(cst);
    const compiledJS = generateJS(ast);

    // ==== Run JS safely using Node vm ====
    const output: string[] = [];
    const context = createContext({
      console: {
        log: (...args: unknown[]) => output.push(args.join(" ")),
        error: (...args: unknown[]) => output.push(args.join(" ")),
      },
    });

    new Script(compiledJS).runInContext(context);

    return NextResponse.json({ output: output.join("\n") || "No output" });
  } catch (error: unknown) {
    return NextResponse.json({ output: genZErrorMessage("runtime", error)}, { status: 500 });
  }
}
