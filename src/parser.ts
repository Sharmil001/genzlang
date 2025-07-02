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
    Modulo,
    Power,
    Shout,
    Vibe,
    Lock,
} from "./lexer";

class GenZParser extends CstParser {
	constructor() {
		super(allTokens);
		this.performSelfAnalysis();
  }

	public program = this.RULE("program", () => {
		this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.sayStatement) },
        { ALT: () => this.SUBRULE(this.variableDeclaration) },
      ])
		});
	});

	private sayStatement = this.RULE("sayStatement", () => {
    this.OR([
      { ALT: () => this.CONSUME(Say) },
      { ALT: () => this.CONSUME(Shout) },
    ])
    this.SUBRULE(this.expression);
	});

  private variableDeclaration = this.RULE("variableDeclaration", () => {
    this.OR([
      { ALT: () => this.CONSUME(Vibe) },
      { ALT: () => this.CONSUME(Lock) },
    ])
    this.CONSUME(Identifier);
    this.CONSUME(Assign);
    this.SUBRULE(this.expression);
  })

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
          { ALT: () => this.CONSUME(Modulo) },
          { ALT: () => this.CONSUME(Power) },
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
