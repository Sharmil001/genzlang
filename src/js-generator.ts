export function generateJS(ast: any[]): string {
	return ast
		.map((node) => {
			if (node.type === "SayExpression") {
				return `console.log(${generateExpression(node.value)});`;
			}
		})
		.join("\n");
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
