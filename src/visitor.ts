import { parserInstance } from "./parser";

export class ToAstVisitor extends parserInstance.getBaseCstVisitorConstructor() {
	constructor() {
		super();
		this.validateVisitor();
	}

	program(ctx: any) {
		return ctx.sayStatement.map((stmt: any) => this.visit(stmt));
	}

	sayStatement(ctx: any) {
		if (ctx.Assign) {
			return {
				type: "SayExpression",
				value: this.visit(ctx.expression),
			};
		} else {
			return {
				type: "SayExpression",
				value: { type: "StringLiteral", value: ctx.StringLiteral[0].image },
			};
		}
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
		let left = this.visit(ctx.atomicExpression[0]);
		for (let i = 0; i < (ctx.Multiply || []).length; i++) {
			const operator = ctx.Multiply[i].image;
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
