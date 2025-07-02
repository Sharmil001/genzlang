import { parserInstance } from "./parser";

export class ToAstVisitor extends parserInstance.getBaseCstVisitorConstructor() {
	constructor() {
		super();
		this.validateVisitor();
	}

	program(ctx: any) {
  const statements: any[] = [];

  if (ctx.sayStatement) {
    statements.push(...ctx.sayStatement.map((stmt: any) => this.visit(stmt)));
  }

  if (ctx.variableDeclaration) {
    statements.push(...ctx.variableDeclaration.map((stmt: any) => this.visit(stmt)));
  }

  return statements;
}

	sayStatement(ctx: any) {
			return {
				type: "SayExpression",
				value: this.visit(ctx.expression),
			};
	}

  variableDeclaration(ctx: any) {
    return {
      type: "VariableDeclaration",
      kind: ctx.Vibe ? "vibe" : "lock",
      id: ctx.Identifier[0].image,
      init: this.visit(ctx.expression),
    };
  }

	expression(ctx: any) {
		return this.visit(ctx.additionExpression);
	}

	additionExpression(ctx: any) {
		let left = this.visit(ctx.multiplicationExpression[0]);
		for (let i = 0; i < (ctx.Plus || []).length; i++) {
			const operator = ctx.Plus[i].image;
			const right = this.visit(ctx.multiplicationExpression[i + 1]);
			left = {
				type: "BinaryExpression",
				operator,
				left,
				right,
			};
		}
		return left;
	}

	multiplicationExpression(ctx: any) {
    const keys = Object.keys(ctx);
		let left = this.visit(ctx.atomicExpression[0]);
	  const operatorGroups = ["Multiply", "Divide", "Modulo", "Power"];
    const operatorKey = operatorGroups.find((op) => keys[1] === op);
		for (let i = 0; i < (ctx[operatorKey] || []).length; i++) {
			const operator = ctx[operatorKey][i].image;
			const right = this.visit(ctx.atomicExpression[i + 1]);
			left = {
				type: "BinaryExpression",
				operator,
				left,
				right,
			};
		}
		return left;
	}

	atomicExpression(ctx: any) {
		if (ctx.NumberLiteral) {
			return { type: "NumberLiteral", value: ctx.NumberLiteral[0].image };
		}
		if (ctx.StringLiteral) {
			return { type: "StringLiteral", value: ctx.StringLiteral[0].image };
		}
		if (ctx.Identifier) {
			return { type: "Identifier", name: ctx.Identifier[0].image };
		}
	}
}
