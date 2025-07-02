import type { ASTNode } from "./interfaces/asttype";

export function generateJS(ast: ASTNode[]): string {
  return ast.map((node) => generateNode(node)).join("\n");
}

function generateNode(node: ASTNode): string {
  switch (node.type) {
    case "SayExpression":
      return `console.log(${generateExpression(node.value)});`;
    case "VariableDeclaration":
      console.log(node);
      return `${node.kind === "vibe" ? "let" : "const"} ${node.id} = ${generateExpression(node.init)};`;
    case "ConditionalStatement":
      return `if (${generateExpression(node.test)}) {
        ${generateNode(node.consequent)}
      }${node.alternate
          ? `
        else {
          ${generateNode(node.alternate)}
        }`
          : ""
        }`;
    case "LoopStatement":
      return node.loopType === "index"
        ? `for (let i = ${generateExpression(node.start)}; i < ${generateExpression(node.end)}; i++) {${generateNode(node.body)}}`
        : `for (const ${generateExpression(node.start)} of ${generateExpression(node.end)}) {${generateNode(node.body)}}`;
    case "BlockStatement":
      return `${node.body.map((node) => generateNode(node)).join("\n")}`;
    default:
      return "undefined";
  }
}

function generateExpression(expr: ASTNode): string | undefined | null {
  switch (expr.type) {
    case "StringLiteral":
      return expr.value;
    case "NumberLiteral":
      return expr.value;
    case "UndefinedLiteral":
      return undefined;
    case "NullLiteral":
      return null;
    case "Identifier":
      return expr.name;
    case "BinaryExpression":
      return `(${generateExpression(expr.left)} ${expr.operator} ${generateExpression(expr.right)})`;
    case "ArrayLiteral":
      return `[${expr.elements.map((e: ASTNode) => generateExpression(e)).join(", ")}]`;
    default:
      return "undefined";
  }
}
