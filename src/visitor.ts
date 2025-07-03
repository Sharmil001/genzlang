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
  // IdentifierNode,
  // NumberLiteralNode,
  // StringLiteralNode
} from "./interfaces/asttype";

export class ToAstVisitor extends parserInstance.getBaseCstVisitorConstructor() {
  constructor() {
    super();
    this.validateVisitor();
  }

  program(ctx): ASTNode[] {
    const statements: ASTNode[] = [];

    if (ctx.sayStatement) {
      statements.push(...ctx.sayStatement.map((stmt: any) => this.visit(stmt)));
    }

    if (ctx.variableDeclaration) {
      statements.push(
        ...ctx.variableDeclaration.map((stmt: any) => this.visit(stmt)),
      );
    }

    if (ctx.conditionalStatement) {
      statements.push(
        ...ctx.conditionalStatement.map((stmt: any) => this.visit(stmt)),
      );
    }

    if (ctx.loopStatement) {
      statements.push(
        ...ctx.loopStatement.map((stmt: any) => this.visit(stmt)),
      );
    }
    return statements;
  }

  sayStatement(ctx: any): SayExpression {
    return {
      type: "SayExpression",
      value: this.visit(ctx.expression),
    };
  }

  variableDeclaration(ctx: any): VariableDeclaration {
    return {
      type: "VariableDeclaration",
      name: ctx.Identifier[0].image,
      init: this.visit(ctx.expression),
    };
  }

  conditionalStatement(ctx: any): ConditionalStatement {
    return {
      type: "ConditionalStatement",
      test: this.visit(ctx.expression),
      consequent: this.visit(ctx.statementOrBlock[0]),
      alternate: ctx.Nah ? this.visit(ctx.statementOrBlock[1]) : null,
    };
  }

  loopStatement(ctx: any): LoopStatement {
    return {
      type: "LoopStatement",
      start: this.visit(ctx.expression[0]),
      end: this.visit(ctx.expression[1]),
      loopType: !ctx.To ? "collection" : "index",
      body: this.visit(ctx.statementOrBlock),
    };
  }

  statementOrBlock(ctx: any): StatementNode[] {
    if (ctx.statement) {
      return ctx.statement.map((stmt: any) => this.visit(stmt));
    }
    throw new Error("Invalid statementOrBlock");
  }

  statement(ctx: any): StatementNode {
    if (ctx.sayStatement) return this.visit(ctx.sayStatement);
    if (ctx.variableDeclaration) return this.visit(ctx.variableDeclaration);
    if (ctx.conditionalStatement) return this.visit(ctx.conditionalStatement);
    throw new Error("Unknown statement");
  }

  block(ctx: any): BlockStatement {
    return {
      type: "BlockStatement",
      body: ctx.statement.map((stmt: any) => this.visit(stmt)),
    };
  }

  expression(ctx: any): ExpressionNode {
    return this.visit(ctx.comparisonExpression);
  }

  comparisonExpression(ctx: any): ExpressionNode {
    const left = this.visit(ctx.additionExpression[0]);

    if (ctx.GreaterThan) {
      return this.makeBinary(
        left,
        ctx.GreaterThan[0].image,
        this.visit(ctx.additionExpression[1]),
      );
    }
    if (ctx.GreaterThanOrEqualTo) {
      return this.makeBinary(
        left,
        ctx.GreaterThanOrEqualTo[0].image,
        this.visit(ctx.additionExpression[1]),
      );
    }
    if (ctx.LessThan) {
      return this.makeBinary(
        left,
        ctx.LessThan[0].image,
        this.visit(ctx.additionExpression[1]),
      );
    }
    if (ctx.LessThanOrEqualTo) {
      return this.makeBinary(
        left,
        ctx.LessThanOrEqualTo[0].image,
        this.visit(ctx.additionExpression[1]),
      );
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

  additionExpression(ctx: any): ExpressionNode {
    let left = this.visit(ctx.multiplicationExpression[0]);
    for (let i = 0; i < (ctx.Plus || []).length; i++) {
      const operator = ctx.Plus[i].image;
      const right = this.visit(ctx.multiplicationExpression[i + 1]);
      left = this.makeBinary(left, operator, right);
    }
    return left;
  }

  multiplicationExpression(ctx: any): ExpressionNode {
    const keys = Object.keys(ctx);
    let left = this.visit(ctx.atomicExpression[0]);
    const operatorGroups = ["Multiply", "Divide", "Modulo", "Power"];
    const operatorKey: string =
      operatorGroups.find((op) => keys.includes(op)) ?? "";
    for (let i = 0; i < (ctx[operatorKey] || []).length; i++) {
      const operator = ctx[operatorKey][i].image;
      const right = this.visit(ctx.atomicExpression[i + 1]);
      left = this.makeBinary(left, operator, right);
    }
    return left;
  }

  arrayLiteral(ctx: any): ExpressionNode {
    const elements: ExpressionNode[] = [];

    if (ctx.expression) {
      elements.push(...ctx.expression.map((expr: any) => this.visit(expr)));
    }

    return {
      type: "ArrayLiteral",
      elements,
    };
  }

  arrayAccess(ctx: any): ExpressionNode {
    return {
      type: "ArrayAccess",
      name: ctx.Identifier[0].image,
      index: this.visit(ctx.expression),
    };
  }


  atomicExpression(ctx: any): ExpressionNode | undefined {
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
