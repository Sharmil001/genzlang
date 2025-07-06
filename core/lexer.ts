import { createToken, Lexer } from "chevrotain";

// Output / Print
export const Yo = createToken({ name: "Yo", pattern: /yo/ });
// Conditionals
export const Fr = createToken({ name: "Fr", pattern: /fr/i });
export const Nah = createToken({ name: "Nah", pattern: /nah/ });

// Loops
export const Loop = createToken({ name: "Loop", pattern: /loop/ });
export const From = createToken({ name: "From", pattern: /from/ });
export const To = createToken({ name: "To", pattern: /to/ });
export const In = createToken({ name: "In", pattern: /in/ });

// Truthy / Falsy
export const Legit = createToken({ name: "Legit", pattern: /legit/ });
export const Cap = createToken({ name: "Cap", pattern: /cap/ });

// Function declaration
export const Do = createToken({ name: "Do", pattern: /do/ });
export const Async = createToken({ name: "Async", pattern: /async/ });

// Null / Undefined
export const None = createToken({ name: "None", pattern: /None/ });
export const Idk = createToken({ name: "Idk", pattern: /idk/ });

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

// Comparison Operators
export const SameVibe = createToken({ name: "SameVibe", pattern: /same vibe/ }); // ==
export const NotVibing = createToken({ name: "NotVibing", pattern: /not vibing/ }); // !=
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ }); // >
export const GreaterThanEqual = createToken({ name: "GreaterThanEqual", pattern: />=/ }); // >=
export const LessThan = createToken({ name: "LessThan", pattern: /</ }); // <
export const LessThanEqual = createToken({ name: "LessThanEqual", pattern: /<=/ }); // <=

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
  // Whitespace first and skipped
  WhiteSpace,

  // Symbols and delimiters
  LBrace,
  RBrace,
  LParen,
  RParen,
  LBracket,
  RBracket,
  Comma,
  Colon,
  At,

  // Comparison operators (longest first)
  SameVibe,
  NotVibing,
  GreaterThanEqual,
  LessThanEqual,
  GreaterThan,
  LessThan,

  // Math operators (longest first)
  Power,
  Multiply,
  Divide,
  Modulo,
  Plus,
  Minus,
  Assign,

  // Logical operators
  And,
  Or,
  Not,

  // Control flow
  From,
  Fr,
  Nah,
  Yo,
  Loop,
  To,
  In,

  // Literals & reserved words
  Legit,
  Cap,
  Do,
  Async,
  None,
  Idk,
  Hold,

  // Try/Catch
  Risk,
  Oops,
  Explode,

  // Literals (must be before Identifier)
  NumberLiteral,
  StringLiteral,

  // Identifier should come **last**
  Identifier,
];

export const GenZLexer = new Lexer(allTokens);
