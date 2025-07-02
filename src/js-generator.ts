export function generateJS(ast: any[]): string {
	return ast
		.map((node) => generateNode(node))
		.join("\n");
}

function generateNode(node: any): string {
  switch (node.type) {
    case "SayExpression":
      return `console.log(${generateExpression(node.value)});`;
    case "VariableDeclaration":
      console.log(node);
      return `${node.kind === "vibe" ? "let" : "const"} ${node.id} = ${generateExpression(node.init)};`;
    case "ConditionalStatement":
      return `if (${generateExpression(node.test)}) {
        ${generateNode(node.consequent)}
      }${node.alternate ? `
        else {
          ${generateNode(node.alternate)}
        }` : ""
      }`;
    case "BlockStatement":
      return `${node.body.map((node) => generateNode(node)).join("\n")}`;
    default:
      return "undefined";
  }
}

function generateExpression(expr: any): string {
	switch (expr.type) {
		case "StringLiteral":
			return expr.value;
		case "NumberLiteral":
			return expr.value;
		case "Identifier":
			return expr.name;
		case "BinaryExpression":
			return `(${generateExpression(expr.left)} ${expr.operator} ${generateExpression(expr.right)})`;
		default:
			return "undefined";
	}
}
