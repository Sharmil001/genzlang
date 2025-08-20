import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { generateJS } from "./engine/js-generator";
import { GenZLexer } from "./engine/lexer";
import { parserInstance } from "./engine/parser";
import { ToAstVisitor } from "./engine/visitor";
import { serve } from "bun";

serve({
  port: 3000,
  fetch: async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (req.method === "POST") {
      try {
        const body = (await req.json()) as { code: string };
        const { code } = body;

        // === Lexing ===
        const lexResult = GenZLexer.tokenize(code);
        if (lexResult.errors.length > 0) {
          return new Response(
            JSON.stringify({
              output: `🧨 Lexer Error: ${lexResult?.errors?.[0]?.message}`,
            }),
            {
              status: 200,
              headers: { "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        // === Parsing ===
        parserInstance.input = lexResult.tokens;
        const cst = parserInstance.program();
        if (parserInstance.errors.length > 0) {
          const err = parserInstance.errors[0];
          return new Response(
            JSON.stringify({
              output: `🧨 Syntax Error at line ${err?.token.startLine}, col ${err?.token.startColumn}: ${err?.message}`,
            }),
            {
              status: 200,
              headers: { "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        // === AST & JS generation ===
        const ast = new ToAstVisitor().visit(cst);
        const compiledJS = generateJS(ast);

        // === 5. Output & Execution ===
        const distDir = path.resolve("dist");
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
        fs.appendFileSync("dist/out.js", `${compiledJS}\n`);

        const output: string[] = [];
        const contextNew = vm.createContext({
          console: {
            log: (...args: unknown[]) => output.push(args.join(" ")),
            error: (...args: unknown[]) => output.push(args.join(" ")),
          },
        });

        const script = new vm.Script(compiledJS);
        script.runInContext(contextNew);

        return new Response(JSON.stringify({ output: output.join("\n") }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (err: unknown) {
        return new Response(
          JSON.stringify({ error: (err as Error).message || String(err) }),
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          }
        );
      }
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
});
