import type { ASTNode } from "./interfaces/asttype";

export function generateJS(ast: ASTNode[]): string {
  return ast.map((node) => generateNode(node)).join("\n");
}

function generateNode(node: ASTNode): string {
  switch (node.type) {
    case "SayExpression":
      console.log(node);
      return `console.log(${generateExpression(node.value)});`;
    case "VariableDeclaration":
      return `let ${node.name} = ${generateExpression(node.init)};`;
    case "ConditionalStatement":
      return `if (${generateExpression(node.test)}) {
        ${node.consequent.map(generateNode)}
      }${node.alternate
          ? `
        else {
          ${node.alternate.map(generateNode)}
        }`
          : ""
        }`;
    case "LoopStatement":
      return node.loopType === "index"
        ? `for (let i = ${generateExpression(node.start)}; i < ${generateExpression(node.end)}; i++) {${node.body.map(generateNode)}}`
        : `for (const ${generateExpression(node.start)} of ${generateExpression(node.end)}) {${node.body.map(generateNode)}}`;
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
    case "UnaryExpression":
      return `(${expr.operator} ${generateExpression(expr.argument)})`;
    case "ArrayLiteral":
      return `[${expr.elements.map((e: ASTNode) => generateExpression(e)).join(", ")}]`;
    case "ArrayAccess":
      return `${expr.name}[${generateExpression(expr.index)}]`;
    default:
      return undefined;
  }
}
