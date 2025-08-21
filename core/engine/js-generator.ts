import type { ASTNode } from "../interfaces/asttype";

export function generateJS(ast: ASTNode[]): string {
  return ast.map((node) => generateNode(node)).join("\n");
}

function generateNode(node: ASTNode): string {
  switch (node.type) {
    case "SayExpression":
      return `console.log(${generateExpression(node.value)});`;
    case "VariableDeclaration":
      return `let ${node.name} = ${generateExpression(node.init)};`;
    case "ConditionalStatement":
      return `if (${generateExpression(node.test)}) {
    ${node.consequent.map(generateNode).join("\n")}
  }${node.alternate
          ? `
    else {
      ${node.alternate.map(generateNode).join("\n")}
    }`
          : ""
        }`;
    case "LoopStatement":
      return node.loopType === "index"
        ? `for (let i = ${generateExpression(
          node.start
        )}; i < ${generateExpression(node.end)}; i++) {${node.body.map(
          generateNode
        )}}`
        : `for (const ${generateExpression(node.start)} of ${generateExpression(
          node.end
        )}) {${node.body.map(generateNode)}}`;
    case "BlockStatement":
      return `${node.body.map((node) => generateNode(node)).join("\n")}`;
    case "FunctionDeclaration":
      return `function ${node.name}(${node.params.join(", ")}) {
        ${node.body.map(generateNode).join("\n")}
      }`;
    case "FunctionCall":
      return `${node.name}(${node.args.map(generateExpression).join(", ")});`;
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
      return `${generateExpression(expr.left)} ${expr.operator
        } ${generateExpression(expr.right)}`;
    case "UnaryExpression":
      return `(${expr.operator} ${generateExpression(expr.argument)})`;
    case "ArrayLiteral":
      return `[${expr.elements
        .map((e: ASTNode) => generateExpression(e))
        .join(", ")}]`;
    case "ArrayAccess":
      return `(function() {
        const _arr = ${expr.name};
        const idx = ${generateExpression(expr.index)};
        if (!Array.isArray(_arr)) throw new Error('${expr.name} is not an array');
        if (idx < 0 || idx >= _arr.length) throw new Error(\`[|||] Array index out of bounds: tried \${idx}, length \${_arr.length}\`);  
          return _arr[idx];
        })()`;
    case "FunctionCall":
      return `${expr.name}(${expr.args.map(generateExpression).join(", ")})`;
    default:
      return undefined;
  }
}
