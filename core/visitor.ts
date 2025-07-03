import { parserInstance } from "./parser";
import type {
  ASTNode,
  SayExpression,
  VariableDeclaration,
  ConditionalStatement,
  BlockStatement,
  ExpressionNode,
  StatementNode,
  BinaryExpression,
  LoopStatement,
} from "./interfaces/asttype";
import type {
  AdditionExpressionCstChildren,
  ArrayAccessCstChildren,
  ArrayLiteralCstChildren,
  AtomicExpressionCstChildren,
  BlockCstChildren,
  ComparisonExpressionCstChildren,
  ConditionalStatementCstChildren,
  ExpressionCstChildren,
  LogicalExpressionCstChildren,
  LogicalNotExpressionCstChildren,
  LoopStatementCstChildren,
  MultiplicationExpressionCstChildren,
  ProgramCstChildren,
  SayStatementCstChildren,
  StatementCstChildren,
  StatementOrBlockCstChildren,
  VariableDeclarationCstChildren,
} from "./interfaces/csttype";
import type { IToken } from "chevrotain";

export class ToAstVisitor extends parserInstance.getBaseCstVisitorConstructor() {
  constructor() {
    super();
    this.validateVisitor();
  }

  program(ctx: ProgramCstChildren): ASTNode[] {
    const statements: ASTNode[] = [];

    if (ctx.sayStatement) {
      statements.push(...ctx.sayStatement.map((stmt) => this.visit(stmt)));
    }

    if (ctx.variableDeclaration) {
      statements.push(
        ...ctx.variableDeclaration.map((stmt) => this.visit(stmt)),
      );
    }

    if (ctx.conditionalStatement) {
      statements.push(
        ...ctx.conditionalStatement.map((stmt) => this.visit(stmt)),
      );
    }

    if (ctx.loopStatement) {
      statements.push(...ctx.loopStatement.map((stmt) => this.visit(stmt)));
    }
    return statements;
  }

  sayStatement(ctx: SayStatementCstChildren): SayExpression {
    return {
      type: "SayExpression",
      value: this.visit(ctx.expression),
    };
  }

  variableDeclaration(
    ctx: VariableDeclarationCstChildren,
  ): VariableDeclaration {
    if (!ctx?.Identifier || !ctx.Identifier[0]) {
      throw new Error("Invalid variable declaration");
    }
    return {
      type: "VariableDeclaration",
      name: ctx.Identifier[0].image,
      init: this.visit(ctx.expression),
    };
  }

  conditionalStatement(
    ctx: ConditionalStatementCstChildren,
  ): ConditionalStatement {
    if (
      !ctx?.If ||
      !ctx.expression ||
      !ctx.statementOrBlock ||
      !ctx.statementOrBlock[0] ||
      !ctx.statementOrBlock[1]
    ) {
      throw new Error("Invalid conditional statement");
    }
    return {
      type: "ConditionalStatement",
      test: this.visit(ctx.expression),
      consequent: this.visit(ctx.statementOrBlock[0]),
      alternate: ctx.Nah ? this.visit(ctx.statementOrBlock[1]) : null,
    };
  }

  loopStatement(ctx: LoopStatementCstChildren): LoopStatement {
    if (
      !ctx?.Loop ||
      !ctx.expression ||
      !ctx.statementOrBlock ||
      !ctx.expression[0] ||
      !ctx.expression[1]
    ) {
      throw new Error("Invalid loop statement");
    }
    return {
      type: "LoopStatement",
      start: this.visit(ctx.expression[0]),
      end: this.visit(ctx.expression[1]),
      loopType: !ctx.To ? "collection" : "index",
      body: this.visit(ctx.statementOrBlock),
    };
  }
  statementOrBlock(ctx: StatementOrBlockCstChildren): StatementNode[] {
    if (ctx.statement) {
      return ctx.statement.map((stmt) => this.visit(stmt));
    }
    throw new Error("Invalid statementOrBlock");
  }

  statement(ctx: StatementCstChildren): StatementNode {
    if (ctx.sayStatement) return this.visit(ctx.sayStatement);
    if (ctx.variableDeclaration) return this.visit(ctx.variableDeclaration);
    if (ctx.conditionalStatement) return this.visit(ctx.conditionalStatement);
    throw new Error("Unknown statement");
  }

  block(ctx: BlockCstChildren): BlockStatement {
    return {
      type: "BlockStatement",
      body: ctx.statement.map((stmt) => this.visit(stmt)),
    };
  }

  expression(ctx: ExpressionCstChildren): ExpressionNode {
    return this.visit(ctx.logicalExpression);
  }

  logicalExpression(ctx: LogicalExpressionCstChildren): ExpressionNode {
    const logicalNotExprs = ctx.logicalNotExpression;

    if (!logicalNotExprs || !logicalNotExprs[0]) {
      throw new Error("Invalid logical expression");
    }

    let left = this.visit(logicalNotExprs[0]);

    const operators = ctx.And ?? ctx.Or ?? [];

    for (let i = 0; i < operators.length; i++) {
      const operatorToken = operators[i];
      if (!operatorToken) {
        throw new Error("Invalid logical expression: missing operator");
      }
      const operator = operatorToken.image === "And" ? "&&" : "||";

      const rightExpr = logicalNotExprs[i + 1];
      if (!rightExpr) {
        throw new Error("Missing right-hand expression in logical operation");
      }

      const right = this.visit(rightExpr);
      left = this.makeBinary(left, operator, right);
    }

    return left;
  }

  logicalNotExpression(ctx: LogicalNotExpressionCstChildren): ExpressionNode {
    const expr = this.visit(ctx.comparisonExpression);
    if (ctx.Not) {
      return {
        type: "UnaryExpression",
        operator: "!",
        argument: expr,
      };
    }
    return expr;
  }

  comparisonExpression(ctx: ComparisonExpressionCstChildren): ExpressionNode {
    if (
      !ctx?.Is ||
      !ctx.Aint ||
      !ctx.SameAs ||
      !ctx.GreaterThan ||
      !ctx.GreaterThanOrEqualTo ||
      !ctx.LessThan ||
      !ctx.LessThanOrEqualTo ||
      !ctx.SameVibe
    ) {
      throw new Error("Invalid comparison expression");
    }
    if (
      !ctx.additionExpression ||
      !ctx.additionExpression[0] ||
      !ctx.additionExpression[1]
    ) {
      throw new Error("Invalid comparison expression");
    }
    const left = this.visit(ctx.additionExpression[0]);

    if (ctx.SameVibe) {
      return this.makeBinary(
        left,
        "===",
        this.visit(ctx.additionExpression[1]),
      );
    }
    if (ctx.Aint) {
      return this.makeBinary(left, "!=", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.Highkey) {
      return this.makeBinary(left, ">", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.NoCap) {
      return this.makeBinary(left, ">=", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.Lowkey) {
      return this.makeBinary(left, "<", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.LowkeyMax) {
      return this.makeBinary(left, "<=", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.Is) {
      return this.makeBinary(left, "==", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.Aint) {
      return this.makeBinary(left, "!=", this.visit(ctx.additionExpression[1]));
    }
    if (ctx.SameAs) {
      return this.makeBinary(
        left,
        "===",
        this.visit(ctx.additionExpression[1]),
      );
    }

    return left;
  }

  additionExpression(ctx: AdditionExpressionCstChildren): ExpressionNode {
    const { multiplicationExpression, Plus, Minus } = ctx;

    if (!multiplicationExpression || !multiplicationExpression[0]) {
      throw new SyntaxError(
        "Addition expression must contain at least one operand.",
      );
    }

    let left = this.visit(multiplicationExpression[0]);

    const operators = (Plus ?? []).concat(Minus ?? []);
    const totalOps = operators.length;

    if (multiplicationExpression.length !== totalOps + 1) {
      throw new SyntaxError(
        `Invalid addition expression: expected ${totalOps + 1
        } operands but got ${multiplicationExpression.length}.`,
      );
    }

    for (let i = 0; i < totalOps; i++) {
      const operator = Plus?.[i]?.image || Minus?.[i]?.image;

      const rightExpression = multiplicationExpression[i + 1];
      if (!rightExpression) {
        throw new Error("Missing right-hand expression for operator");
      }

      const right = this.visit(rightExpression);
      if (!operator) {
        throw new SyntaxError("Invalid addition expression: missing operator.");
      }
      left = this.makeBinary(left, operator, right);
    }

    return left;
  }

  multiplicationExpression(
    ctx: MultiplicationExpressionCstChildren,
  ): ExpressionNode {
    const { atomicExpression, Multiply, Divide, Modulo, Power } = ctx;

    if (!atomicExpression || !atomicExpression[0]) {
      throw new SyntaxError(
        "Multiplication expression must contain at least one operand.",
      );
    }

    let left = this.visit(atomicExpression[0]);

    const operators = (Multiply ?? [])
      .concat(Divide ?? [])
      .concat(Modulo ?? [])
      .concat(Power ?? []);

    const totalOps = operators.length;

    if (atomicExpression.length !== totalOps + 1) {
      throw new SyntaxError(
        `Invalid multiplication expression: expected ${totalOps + 1
        } operands but got ${atomicExpression.length}.`,
      );
    }

    let opIndex = 0;

    for (let i = 0; i < totalOps; i++) {
      let operatorToken: IToken | undefined;

      if (Multiply?.[opIndex]) operatorToken = Multiply[opIndex];
      else if (Divide?.[opIndex]) operatorToken = Divide[opIndex];
      else if (Modulo?.[opIndex]) operatorToken = Modulo[opIndex];
      else if (Power?.[opIndex]) operatorToken = Power[opIndex];

      if (!operatorToken) {
        throw new SyntaxError(
          "Unrecognized operator in multiplication expression.",
        );
      }

      const operator = operatorToken.image;
      const rightExpression = atomicExpression[i + 1];
      if (!rightExpression) {
        throw new Error("Missing right-hand expression for operator");
      }
      const right = this.visit(rightExpression);
      left = this.makeBinary(left, operator, right);
      opIndex++;
    }

    return left;
  }

  arrayLiteral(ctx: ArrayLiteralCstChildren): ExpressionNode {
    const elements: ExpressionNode[] = [];

    if (ctx.expression) {
      elements.push(...ctx.expression.map((expr) => this.visit(expr)));
    }

    return {
      type: "ArrayLiteral",
      elements,
    };
  }

  arrayAccess(ctx: ArrayAccessCstChildren): ExpressionNode {
    if (!ctx?.Identifier || !ctx.Identifier[0] || !ctx.At || !ctx.expression) {
      throw new Error("Invalid array access");
    }
    return {
      type: "ArrayAccess",
      name: ctx.Identifier[0].image,
      index: this.visit(ctx.expression),
    };
  }

  atomicExpression(
    ctx: AtomicExpressionCstChildren,
  ): ExpressionNode | undefined {
    if (
      !ctx?.NumberLiteral ||
      !ctx?.StringLiteral ||
      !ctx?.Idk ||
      !ctx?.Ghost ||
      !ctx?.Identifier ||
      !ctx.LParen ||
      !ctx.expression ||
      !ctx.RParen ||
      !ctx.arrayLiteral
    ) {
      throw new Error("Invalid atomic expression");
    }
    if (
      !ctx.NumberLiteral[0] ||
      !ctx.StringLiteral[0] ||
      !ctx.Identifier[0] ||
      !ctx.arrayLiteral[0] ||
      !ctx.arrayAccess
    ) {
      throw new Error("Invalid atomic expression");
    }
    if (ctx.NumberLiteral) {
      return { type: "NumberLiteral", value: ctx.NumberLiteral[0].image };
    }
    if (ctx.StringLiteral) {
      return { type: "StringLiteral", value: ctx.StringLiteral[0].image };
    }
    if (ctx.Idk) {
      return { type: "UndefinedLiteral", value: undefined };
    }
    if (ctx.Ghost) {
      return { type: "NullLiteral", value: null };
    }
    if (ctx.Identifier) {
      return { type: "Identifier", name: ctx.Identifier[0].image };
    }
    if (ctx.arrayLiteral) {
      return this.visit(ctx.arrayLiteral[0]);
    }
    if (ctx.arrayAccess) {
      return this.visit(ctx.arrayAccess);
    }
  }

  makeBinary(
    left: ExpressionNode,
    operator: string,
    right: ExpressionNode,
  ): BinaryExpression {
    return {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
  }
}
