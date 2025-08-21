export type ASTNode =
  | ProgramNode
  | SayExpression
  | VariableDeclaration
  | ConditionalStatement
  | BinaryExpression
  | UnaryExpression
  | IdentifierNode
  | NumberLiteralNode
  | StringLiteralNode
  | NullLiteral
  | UndefinedLiteral
  | ArrayLiteralNode
  | ArrayAccessNode
  | BlockStatement
  | LoopStatement
  | FunctionDeclaration
  | FunctionCall;
export interface ProgramNode { type: "Program";
  body: ASTNode[];
}

export interface SayExpression {
  type: "SayExpression";
  value: ExpressionNode;
}

export interface VariableDeclaration {
  type: "VariableDeclaration";
  name: string;
  init: ExpressionNode;
}

export interface LoopStatement {
  type: "LoopStatement";
  body: StatementNode[];
  start: ExpressionNode;
  end: ExpressionNode;
  loopType: string;
}

export interface ConditionalStatement {
  type: "ConditionalStatement";
  test: ExpressionNode;
  consequent: StatementNode[];
  alternate: StatementNode[] | null;
}

export interface BlockStatement {
  type: "BlockStatement";
  body: StatementNode[];
}

export interface BinaryExpression {
  type: "BinaryExpression";
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface UnaryExpression {
  type: "UnaryExpression";
  operator: string;
  argument: ExpressionNode;
}

export interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export interface NumberLiteralNode {
  type: "NumberLiteral";
  value: string;
}

export interface StringLiteralNode {
  type: "StringLiteral";
  value: string;
}

export interface ArrayLiteralNode {
  type: "ArrayLiteral";
  elements: ExpressionNode[];
}

export interface ArrayAccessNode {
  type: "ArrayAccess";
  name: string;
  index: ExpressionNode;
}

export interface NullLiteral {
  type: "NullLiteral";
  value: null;
}

export interface UndefinedLiteral {
  type: "UndefinedLiteral";
  value: undefined;
}

export interface FunctionDeclaration {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
  body: StatementNode[];
}

export interface FunctionCall {
  type: "FunctionCall";
  name: string;
  args: ExpressionNode[];
}

export type StatementNode =
  | SayExpression
  | VariableDeclaration
  | ConditionalStatement
  | BlockStatement
  | FunctionCall;

export type ExpressionNode =
  | BinaryExpression
  | UnaryExpression
  | IdentifierNode
  | NumberLiteralNode
  | StringLiteralNode
  | ArrayLiteralNode
  | ArrayAccessNode
  | NullLiteral
  | UndefinedLiteral
  | FunctionCall;
  
