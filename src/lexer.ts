import { createToken, Lexer } from "chevrotain";

// Variable declaration
// export const Vibe = createToken({ name: "Vibe", pattern: /vibe/ });
// export const Lock = createToken({ name: "Lock", pattern: /lock/ });
//
// Output / Print
// export const Say = createToken({ name: "Say", pattern: /say/ });
export const Yo = createToken({ name: "Yo", pattern: /yo/ });
// Conditionals
export const If = createToken({ name: "If", pattern: /if/ });
export const Nah = createToken({ name: "Nah", pattern: /nah/ });

// Loops
export const Loop = createToken({ name: "Loop", pattern: /loop/ });
export const From = createToken({ name: "From", pattern: /from/ });
export const To = createToken({ name: "To", pattern: /to/ });
export const In = createToken({ name: "To", pattern: /in/ });

// Truthy / Falsy
export const Legit = createToken({ name: "Legit", pattern: /legit/ });
export const Cap = createToken({ name: "Cap", pattern: /cap/ });

// Function declaration
export const Do = createToken({ name: "Do", pattern: /do/ });
export const Async = createToken({ name: "Async", pattern: /async/ });
// Null / Undefined
export const Ghost = createToken({ name: "Ghost", pattern: /ghost/ });
export const Idk = createToken({ name: "Idk", pattern: /idk/ });

// Comparison Operators
export const Is = createToken({ name: "Is", pattern: /is/ });
export const SameAs = createToken({ name: "SameAs", pattern: /same as/ });
export const Aint = createToken({ name: "Aint", pattern: /aint/ });

// Logical Operators
export const And = createToken({ name: "And", pattern: /and/ });
export const Or = createToken({ name: "Or", pattern: /or/ });
export const Not = createToken({ name: "Not", pattern: /not/ });

// Try-Catch
export const Risk = createToken({ name: "Risk", pattern: /risk/ });
export const Oops = createToken({ name: "Oops", pattern: /oops/ });
export const Explode = createToken({ name: "Explode", pattern: /explode/ });

// Await
export const Hold = createToken({ name: "Hold", pattern: /hold/ });

// Math Operators
export const Assign = createToken({ name: "Assign", pattern: /=/ });
export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Minus = createToken({ name: "Minus", pattern: /-/ });
export const Multiply = createToken({ name: "Multiply", pattern: /\*/ });
export const Divide = createToken({ name: "Divide", pattern: /\// });
export const Modulo = createToken({ name: "Modulo", pattern: /%/ });
export const Power = createToken({ name: "Power", pattern: /\*\*/ });

// Comparison
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const GreaterThanOrEqualTo = createToken({
	name: "GreaterThanOrEqualTo",
	pattern: />=/,
});
export const LessThan = createToken({ name: "LessThan", pattern: /</ });
export const LessThanOrEqualTo = createToken({
	name: "LessThanOrEqualTo",
	pattern: /<=/,
});

export const LBrace = createToken({ name: "LBrace", pattern: /{/ });
export const RBrace = createToken({ name: "RBrace", pattern: /}/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const At = createToken({ name: "At", pattern: /@/ });

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
	LBrace,
	RBrace,
	LParen,
	RParen,
	LBracket,
	RBracket,
	Comma,
  Colon,
  At,

	// Keywords
	SameAs,
	// Vibe,
	// Lock,
	// Say,
	Yo,
	If,
	Nah,
	Loop,
	From,
	To,
	In,
	Do,
	Async,
	// Zoom,
	// Bounce,
	Ghost,
	Idk,
	Legit,
	Cap,
	Is,
	Aint,
	And,
	Or,
	Not,
	Risk,
	Oops,
	Explode,
	Hold,

	// Operators
	Assign,
	Plus,
	Minus,
	Power,
	Multiply,
	Divide,
	Modulo,
	GreaterThanOrEqualTo,
	GreaterThan,
	LessThanOrEqualTo,
	LessThan,

	// Literals
	NumberLiteral,
	StringLiteral,
	Identifier,
];

export const GenZLexer = new Lexer(allTokens);
