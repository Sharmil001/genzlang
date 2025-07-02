export type ASTNode =
  | ProgramNode
  | SayExpression
  | VariableDeclaration
  | ConditionalStatement
  | BinaryExpression
  | IdentifierNode
  | NumberLiteralNode
  | StringLiteralNode
  | ArrayLiteralNode
  | BlockStatement
  | LoopStatement;

export interface ProgramNode {
  type: "Program";
  body: ASTNode[];
}

export interface SayExpression {
  type: "SayExpression";
  value: ExpressionNode;
}

export interface VariableDeclaration {
  type: "VariableDeclaration";
  kind: "vibe" | "lock";
  id: string;
  init: ExpressionNode;
}

export interface LoopStatement {
  type: "LoopStatement";
  body: StatementNode;
  start: ExpressionNode;
  end: ExpressionNode;
  loopType: string;
}

export interface ConditionalStatement {
  type: "ConditionalStatement";
  test: ExpressionNode;
  consequent: StatementNode;
  alternate: StatementNode | null;
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

export type StatementNode =
  | SayExpression
  | VariableDeclaration
  | ConditionalStatement
  | BlockStatement;

export type ExpressionNode =
  | BinaryExpression
  | IdentifierNode
  | NumberLiteralNode
  | StringLiteralNode
  | ArrayLiteralNode;
