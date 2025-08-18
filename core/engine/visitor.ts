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
  FunctionDeclaration,
  FunctionCall,
} from "./interfaces/asttype";
import type {
  AdditionExpressionCstChildren,
  ArgumentListCstChildren,
  ArrayAccessCstChildren,
  ArrayLiteralCstChildren,
  AtomicExpressionCstChildren,
  BlockCstChildren,
  ComparisonExpressionCstChildren,
  ConditionalStatementCstChildren,
  ExpressionCstChildren,
  FunctionCallCstChildren,
  FunctionDeclarationCstChildren,
  LogicalExpressionCstChildren,
  LogicalNotExpressionCstChildren,
  LoopStatementCstChildren,
  MultiplicationExpressionCstChildren,
  ParameterListCstChildren,
  ProgramCstChildren,
  SayStatementCstChildren,
  StatementCstChildren,
  StatementOrBlockCstChildren,
  VariableDeclarationCstChildren,
} from "./interfaces/csttype";

export class ToAstVisitor extends parserInstance.getBaseCstVisitorConstructor() {
  constructor() {
    super();
    this.validateVisitor();
  }

  program(ctx: ProgramCstChildren): ASTNode[] {
    return [
      ...(ctx.sayStatement?.map((stmt) => this.visit(stmt)) || []),
      ...(ctx.variableDeclaration?.map((stmt) => this.visit(stmt)) || []),
      ...(ctx.conditionalStatement?.map((stmt) => this.visit(stmt)) || []),
      ...(ctx.loopStatement?.map((stmt) => this.visit(stmt)) || []),
      ...(ctx.functionDeclaration?.map((stmt) => this.visit(stmt)) || []),
    ];
  }

  sayStatement(ctx: SayStatementCstChildren): SayExpression {
    return {
      type: "SayExpression",
      value: this.visit(ctx.expression),
    };
  }

  variableDeclaration(ctx: VariableDeclarationCstChildren): VariableDeclaration {
    if (!ctx.Identifier?.[0]) throw new Error("Invalid variable declaration");
    return {
      type: "VariableDeclaration",
      name: ctx.Identifier[0].image,
      init: this.visit(ctx.expression),
    };
  }

  conditionalStatement(ctx: ConditionalStatementCstChildren): ConditionalStatement {
    if (!ctx.statementOrBlock?.[0]) throw new Error("Invalid conditional statement");
    return {
      type: "ConditionalStatement",
      test: this.visit(ctx.expression),
      consequent: this.visit(ctx.statementOrBlock[0]),
      alternate: ctx.Nah && ctx.statementOrBlock?.[1] ? this.visit(ctx.statementOrBlock[1]) : null,
    };
  }

  loopStatement(ctx: LoopStatementCstChildren): LoopStatement {
    if (!ctx.expression?.[0]) throw new Error("Invalid loop statement");
    if (!ctx.expression?.[1]) throw new Error("Invalid loop statement");
    return {
      type: "LoopStatement",
      start: this.visit(ctx.expression[0]),
      end: this.visit(ctx.expression[1]),
      loopType: ctx.To ? "index" : "collection",
      body: this.visit(ctx.statementOrBlock),
    };
  }
  
functionDeclaration(ctx: FunctionDeclarationCstChildren): FunctionDeclaration {
  if (!ctx.Identifier?.[0]) throw new Error("Invalid function declaration");

  return {
    type: "FunctionDeclaration",
    name: ctx.Identifier[0].image,
 params: ctx.parameterList ? this.visit(ctx.parameterList?.[0] || []) : [],
    body: this.visit(ctx.statementOrBlock),
  };
}

functionCall(ctx: FunctionCallCstChildren): FunctionCall {
  if (!ctx.Identifier?.[0]) throw new Error("Invalid function call");

  return {
    type: "FunctionCall",
    name: ctx.Identifier[0].image,
    args: ctx.ArgumentList && this.visit(ctx.ArgumentList?.[0] || []) || [],
  };
}

parameterList(ctx: ParameterListCstChildren): string[] {
  return ctx.Identifier ? ctx.Identifier.map((id) => id.image) : [];
}

argumentList(ctx: ArgumentListCstChildren): ExpressionNode[] {
  return ctx.expression ? ctx.expression.map((expr) => this.visit(expr)) : [];
}

  statementOrBlock(ctx: StatementOrBlockCstChildren): StatementNode[] {
    if (!ctx.statement?.[0]) throw new Error("Invalid statementOrBlock");
    return ctx.statement.map((stmt) => this.visit(stmt));
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
    if (!ctx.logicalNotExpression?.[0]) throw new Error("Invalid logical expression");
    let left = this.visit(ctx.logicalNotExpression[0]);
    for (let i = 0; i < (ctx.And?.length || 0) + (ctx.Or?.length || 0); i++) {
      const operatorToken = ctx.And?.[i] || ctx.Or?.[i];
      if (!operatorToken) throw new Error("Invalid logical expression");
      const operator = operatorToken.image === "and" ? "&&" : "||";
      const rightExpression = ctx.logicalNotExpression[i + 1];
      if (!rightExpression) throw new Error("Invalid logical expression");
      const right = this.visit(rightExpression);
      left = this.makeBinary(left, operator, right);
    }
    return left;
  }

  logicalNotExpression(ctx: LogicalNotExpressionCstChildren): ExpressionNode {
    const expr = this.visit(ctx.comparisonExpression);
    return ctx.Not ? { type: "UnaryExpression", operator: "!", argument: expr } : expr;
  }

  comparisonExpression(ctx: ComparisonExpressionCstChildren): ExpressionNode {
    if (!ctx.additionExpression?.[0]) throw new Error("Invalid comparison expression");
    const left = this.visit(ctx.additionExpression[0]);
    const right = ctx.additionExpression[1] ? this.visit(ctx.additionExpression[1]) : null;

    if (ctx.SameVibe) return this.makeBinary(left, "==", right);
    if (ctx.NotVibing) return this.makeBinary(left, "!=", right);
    if (ctx.GreaterThan) return this.makeBinary(left, ">", right);
    if (ctx.GreaterThanEqual) return this.makeBinary(left, ">=", right);
    if (ctx.LessThan) return this.makeBinary(left, "<", right);
    if (ctx.LessThanEqual) return this.makeBinary(left, "<=", right);

    return left;
  }

  additionExpression(ctx: AdditionExpressionCstChildren): ExpressionNode {
    if (!ctx.multiplicationExpression?.[0]) throw new Error("Invalid addition expression");
    let left = this.visit(ctx.multiplicationExpression[0]);
    for (let i = 0; i < (ctx.Plus?.length || 0) + (ctx.Minus?.length || 0); i++) {
      const opToken = ctx.Plus?.[i] || ctx.Minus?.[i];
      const rightExpression = ctx.multiplicationExpression[i + 1];
      if (!rightExpression) throw new Error("Invalid addition expression");
      const right = this.visit(rightExpression);
      if (!opToken) throw new Error("Invalid addition expression");
      left = this.makeBinary(left, opToken.image, right);
    }
    return left;
  }

  multiplicationExpression(ctx: MultiplicationExpressionCstChildren): ExpressionNode {
    if (!ctx.atomicExpression?.[0]) throw new Error("Invalid multiplication expression");
    let left = this.visit(ctx.atomicExpression[0]);
    const ops = [...(ctx.Multiply || []), ...(ctx.Divide || []), ...(ctx.Modulo || []), ...(ctx.Power || [])];

    for (let i = 0; i < ops.length; i++) {
      const opToken = ops[i];
      const rightExpression = ctx.atomicExpression[i + 1];
      if (!rightExpression) throw new Error("Invalid multiplication expression");
      const right = this.visit(rightExpression);
      if (!opToken) throw new Error("Invalid multiplication expression");
      left = this.makeBinary(left, opToken.image, right);
    }
    return left;
  }

  atomicExpression(ctx: AtomicExpressionCstChildren): ExpressionNode {
    if (ctx.NumberLiteral?.[0]) {
      return { type: "NumberLiteral", value: ctx.NumberLiteral[0].image };
    }

    if (ctx.StringLiteral?.[0]) {
      return { type: "StringLiteral", value: ctx.StringLiteral[0].image };
    }

    if (ctx.Idk?.[0]) {
      return { type: "UndefinedLiteral", value: undefined };
    }

    if (ctx.None?.[0]) {
      return { type: "NullLiteral", value: null };
    }

    if (ctx.Identifier?.[0]) {
      return { type: "Identifier", name: ctx.Identifier[0].image };
    }

    if (ctx.arrayLiteral?.[0]) {
      return this.visit(ctx.arrayLiteral[0]);
    }

    if (ctx.arrayAccess?.[0]) {
      return this.visit(ctx.arrayAccess[0]);
    }

    if (ctx.expression?.[0]) {
      return this.visit(ctx.expression[0]);
    }

    throw new Error("Invalid atomic expression");
  }

  arrayLiteral(ctx: ArrayLiteralCstChildren): ExpressionNode {
    return {
      type: "ArrayLiteral",
      elements: ctx.expression ? ctx.expression.map((e) => this.visit(e)) : [],
    };
  }

  arrayAccess(ctx: ArrayAccessCstChildren): ExpressionNode {
    if (!ctx?.Identifier?.[0]) {
      throw new Error("Invalid array access");
    }
    return {
      type: "ArrayAccess",
      name: ctx.Identifier[0].image,
      index: this.visit(ctx.expression),
    };
  }

  makeBinary(left: ExpressionNode, operator: string, right: ExpressionNode): BinaryExpression {
    return { type: "BinaryExpression", operator, left, right };
  }
}
