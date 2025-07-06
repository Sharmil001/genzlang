import type { CstNode, IToken, ICstVisitor } from "chevrotain";

export interface ProgramCstNode extends CstNode {
  name: "program";
  children: ProgramCstChildren;
}

export type ProgramCstChildren = {
  sayStatement?: SayStatementCstNode[];
  variableDeclaration?: VariableDeclarationCstNode[];
  conditionalStatement?: ConditionalStatementCstNode[];
  loopStatement?: LoopStatementCstNode[];
};

export interface SayStatementCstNode extends CstNode {
  name: "sayStatement";
  children: SayStatementCstChildren;
}

export type SayStatementCstChildren = {
  Say?: IToken[];
  Shout?: IToken[];
  expression: ExpressionCstNode[];
};

export interface VariableDeclarationCstNode extends CstNode {
  name: "variableDeclaration";
  children: VariableDeclarationCstChildren;
}

export type VariableDeclarationCstChildren = {
  Vibe?: IToken[];
  Lock?: IToken[];
  Identifier: IToken[];
  Assign: IToken[];
  expression: ExpressionCstNode[];
};

export interface ConditionalStatementCstNode extends CstNode {
  name: "conditionalStatement";
  children: ConditionalStatementCstChildren;
}

export type ConditionalStatementCstChildren = {
  Fr: IToken[];
  expression: ExpressionCstNode[];
  statementOrBlock: StatementOrBlockCstNode[];
  Nah?: IToken[];
};

export interface LoopStatementCstNode extends CstNode {
  name: "loopStatement";
  children: LoopStatementCstChildren;
}

export type LoopStatementCstChildren = {
  Loop: IToken[];
  expression: ExpressionCstNode[];
  To?: IToken[];
  From?: IToken[];
  statementOrBlock: StatementOrBlockCstNode[];
};

export interface StatementOrBlockCstNode extends CstNode {
  name: "statementOrBlock";
  children: StatementOrBlockCstChildren;
}

export type StatementOrBlockCstChildren = {
  statement?: StatementCstNode[];
  block?: BlockCstNode[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  sayStatement?: SayStatementCstNode[];
  variableDeclaration?: VariableDeclarationCstNode[];
  conditionalStatement?: ConditionalStatementCstNode[];
};

export interface BlockCstNode extends CstNode {
  name: "block";
  children: BlockCstChildren;
}

export type BlockCstChildren = {
  LBrace: IToken[];
  statement: StatementCstNode[];
  RBrace: IToken[];
};

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCstChildren;
}

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCstChildren;
}

export type ExpressionCstChildren = {
  logicalExpression: LogicalExpressionCstNode[];
};

export interface LogicalExpressionCstNode extends CstNode {
  name: "logicalExpression";
  children: LogicalExpressionCstChildren;
}

export type LogicalExpressionCstChildren = {
  logicalNotExpression: LogicalNotExpressionCstNode[];
  And?: IToken[];
  Or?: IToken[];
};

export interface LogicalNotExpressionCstNode extends CstNode {
  name: "logicalNotExpression";
  children: LogicalNotExpressionCstChildren;
}

export type LogicalNotExpressionCstChildren = {
  Not?: IToken[];
  comparisonExpression: ComparisonExpressionCstNode[];
};

export interface ComparisonExpressionCstNode extends CstNode {
  name: "comparisonExpression";
  children: ComparisonExpressionCstChildren;
}

export type ComparisonExpressionCstChildren = {
  additionExpression: AdditionExpressionCstNode[];
  SameVibe?: IToken[];
  NotVibing?: IToken[];
  GreaterThan?: IToken[];
  GreaterThanEqual?: IToken[];
  LessThan?: IToken[];
  LessThanEqual?: IToken[];
};

export interface AdditionExpressionCstNode extends CstNode {
  name: "additionExpression";
  children: AdditionExpressionCstChildren;
}

export type AdditionExpressionCstChildren = {
  multiplicationExpression: MultiplicationExpressionCstNode[];
  Plus?: IToken[];
  Minus?: IToken[];
};

export interface MultiplicationExpressionCstNode extends CstNode {
  name: "multiplicationExpression";
  children: MultiplicationExpressionCstChildren;
}

export type MultiplicationExpressionCstChildren = {
  atomicExpression: AtomicExpressionCstNode[];
  Multiply?: IToken[];
  Divide?: IToken[];
  Modulo?: IToken[];
  Power?: IToken[];
};

export interface AtomicExpressionCstNode extends CstNode {
  name: "atomicExpression";
  children: AtomicExpressionCstChildren;
}

export type AtomicExpressionCstChildren = {
  NumberLiteral?: IToken[];
  StringLiteral?: IToken[];
  Identifier?: IToken[];
  LParen?: IToken[];
  expression?: ExpressionCstNode[];
  RParen?: IToken[];
  arrayLiteral?: ArrayLiteralCstNode[];
  Idk?: IToken[];
  None?: IToken[];
  arrayAccess?: ArrayAccessCstNode[];
};

export interface ArrayLiteralCstNode extends CstNode {
  name: "arrayLiteral";
  children: ArrayLiteralCstChildren;
}

export type ArrayLiteralCstChildren = {
  LBracket: IToken[];
  expression?: ExpressionCstNode[];
  Comma?: IToken[];
  expression2?: ExpressionCstNode[];
  RBracket: IToken[];
};

export interface ArrayAccessCstNode extends CstNode {
  name: "arrayAccess";
  children: ArrayAccessCstChildren;
}

export type ArrayAccessCstChildren = {
  Identifier: IToken[];
  At: IToken[];
  expression: ExpressionCstNode[];
};

export interface IGenZVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  program(children: ProgramCstChildren, param?: IN): OUT;
  sayStatement(children: SayStatementCstChildren, param?: IN): OUT;
  variableDeclaration(children: VariableDeclarationCstChildren, param?: IN): OUT;
  conditionalStatement(children: ConditionalStatementCstChildren, param?: IN): OUT;
  loopStatement(children: LoopStatementCstChildren, param?: IN): OUT;
  statementOrBlock(children: StatementOrBlockCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  block(children: BlockCstChildren, param?: IN): OUT;
  expression(children: ExpressionCstChildren, param?: IN): OUT;
  comparisonExpression(children: ComparisonExpressionCstChildren, param?: IN): OUT;
  additionExpression(children: AdditionExpressionCstChildren, param?: IN): OUT;
  multiplicationExpression(children: MultiplicationExpressionCstChildren, param?: IN): OUT;
  atomicExpression(children: AtomicExpressionCstChildren, param?: IN): OUT;
  arrayLiteral(children: ArrayLiteralCstChildren, param?: IN): OUT;
}
