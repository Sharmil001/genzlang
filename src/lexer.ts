import { createToken, Lexer } from "chevrotain";

export const Say = createToken({ name: "Say", pattern: /say/ });
export const Assign = createToken({ name: "Assign", pattern: /=/ });

export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Minus = createToken({ name: "Minus", pattern: /-/ });
export const Multiply = createToken({ name: "Multiply", pattern: /\*/ });
export const Divide = createToken({ name: "Divide", pattern: /\// });

export const NumberLiteral = createToken({
	name: "NumberLiteral",
	pattern: /\d+/,
});
export const StringLiteral = createToken({
	name: "StringLiteral",
	pattern: /"[^"]*"/,
});
export const Identifier = createToken({
	name: "Identifier",
	pattern: /[a-zA-Z_]\w*/,
});

export const WhiteSpace = createToken({
	name: "WhiteSpace",
	pattern: /\s+/,
	group: Lexer.SKIPPED,
});

export const allTokens = [
	WhiteSpace,
	Say,
	Assign,
	Plus,
	Minus,
	Multiply,
	Divide,
	NumberLiteral,
	StringLiteral,
	Identifier,
];

export const GenZLexer = new Lexer(allTokens);
