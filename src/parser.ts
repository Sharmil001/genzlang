import { CstParser } from "chevrotain";
import {
	allTokens,
	Say,
	Assign,
	Plus,
	Minus,
	Multiply,
	Divide,
	StringLiteral,
	NumberLiteral,
	Identifier,
} from "./lexer";

class GenZParser extends CstParser {
	constructor() {
		super(allTokens);
		this.performSelfAnalysis();
	}

	public program = this.RULE("program", () => {
		this.MANY(() => {
			this.SUBRULE(this.sayStatement);
		});
	});

	private sayStatement = this.RULE("sayStatement", () => {
		this.CONSUME(Say);

		this.OPTION(() => {
			this.CONSUME(Assign);
			this.SUBRULE(this.expression);
		});
	});

	private expression = this.RULE("expression", () => {
		this.SUBRULE(this.additionExpression);
	});

	private additionExpression = this.RULE("additionExpression", () => {
		this.SUBRULE(this.multiplicationExpression);
		this.MANY(() => {
			this.OR([
				{ ALT: () => this.CONSUME(Plus) },
				{ ALT: () => this.CONSUME(Minus) },
			]);
			this.SUBRULE2(this.multiplicationExpression);
		});
	});

	private multiplicationExpression = this.RULE(
		"multiplicationExpression",
		() => {
			this.SUBRULE(this.atomicExpression);
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.CONSUME(Multiply) },
					{ ALT: () => this.CONSUME(Divide) },
				]);
				this.SUBRULE2(this.atomicExpression);
			});
		},
	);

	private atomicExpression = this.RULE("atomicExpression", () => {
		this.OR([
			{ ALT: () => this.CONSUME(NumberLiteral) },
			{ ALT: () => this.CONSUME(StringLiteral) },
			{ ALT: () => this.CONSUME(Identifier) },
		]);
	});
}

export const parserInstance = new GenZParser();
