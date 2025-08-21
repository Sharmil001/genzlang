import { CstParser } from "chevrotain";
import {
  allTokens,
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
  Yo,
  Nah,
  LParen,
  RParen,
  Loop,
  From,
  To,
  LBracket,
  Comma,
  RBracket,
  Idk,
  At,
  SameVibe,
  Not,
  And,
  Or,
  NotVibing,
  GreaterThan,
  GreaterThanEqual,
  LessThan,
  LessThanEqual,
  Fr,
  None,
  Vibe,
  SBlock,
  EBlock,
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
        { ALT: () => this.SUBRULE(this.functionDeclaration) },
        { ALT: () => this.SUBRULE(this.conditionalStatement) },
        { ALT: () => this.SUBRULE(this.functionCall) },
        { ALT: () => this.SUBRULE(this.variableDeclaration) },
        { ALT: () => this.SUBRULE(this.loopStatement) },
      ]);
    });
  });

  private sayStatement = this.RULE("sayStatement", () => {
    this.CONSUME(Yo);
    this.SUBRULE(this.expression);
  });

  private variableDeclaration = this.RULE("variableDeclaration", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Assign);
    this.SUBRULE(this.expression);
  });

  private conditionalStatement = this.RULE("conditionalStatement", () => {
    this.CONSUME(Fr);
    this.SUBRULE1(this.expression);
    this.CONSUME(SBlock);
    this.SUBRULE2(this.statementOrBlock);
    this.CONSUME(EBlock);
    this.OPTION(() => {
      this.CONSUME(Nah);
      this.CONSUME2(SBlock);
      this.SUBRULE3(this.statementOrBlock);
      this.CONSUME2(EBlock);
    });
  });

  private loopStatement = this.RULE("loopStatement", () => {
    this.CONSUME(Loop);
    this.SUBRULE1(this.expression);
    this.OR([
      { ALT: () => this.CONSUME(To) },
      { ALT: () => this.CONSUME(From) },
    ]);
    this.SUBRULE2(this.expression);
    this.CONSUME(SBlock);
    this.SUBRULE3(this.statementOrBlock);
    this.CONSUME(EBlock);
  });

  private functionDeclaration = this.RULE("functionDeclaration", () => {
    this.CONSUME(Vibe);
    this.CONSUME(Identifier);
    this.CONSUME(LParen);
    this.OPTION(() => {
      this.SUBRULE(this.parameterList);
    });
    this.CONSUME(RParen);
    this.CONSUME(SBlock);
    this.SUBRULE(this.statementOrBlock);
    this.CONSUME(EBlock);
  });

  private parameterList = this.RULE("parameterList", () => {
    this.CONSUME(Identifier);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.CONSUME2(Identifier);
    });
  });

  private functionCall = this.RULE("functionCall", () => {
    this.CONSUME(Identifier);
    this.CONSUME(LParen);
    this.OPTION(() => {
      this.SUBRULE(this.argumentList);
    });
    this.CONSUME(RParen);
  });

  private argumentList = this.RULE("argumentList", () => {
    this.SUBRULE(this.expression);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.expression);
    });
  });

  private statementOrBlock = this.RULE("statementOrBlock", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.statement);
    });
  });

  private statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.sayStatement) },
      { ALT: () => this.SUBRULE(this.conditionalStatement) },
      { ALT: () => this.SUBRULE(this.functionCall) },
      { ALT: () => this.SUBRULE(this.variableDeclaration) },
    ]);
  });

  private expression = this.RULE("expression", () => {
    this.SUBRULE(this.logicalExpression);
  });

  private logicalExpression = this.RULE("logicalExpression", () => {
    this.SUBRULE(this.logicalNotExpression);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(And) },
        { ALT: () => this.CONSUME(Or) },
      ]);
      this.SUBRULE2(this.logicalNotExpression);
    });
  });

  private logicalNotExpression = this.RULE("logicalNotExpression", () => {
    this.OPTION(() => {
      this.CONSUME(Not);
    });
    this.SUBRULE(this.comparisonExpression);
  });

  private comparisonExpression = this.RULE("comparisonExpression", () => {
    this.SUBRULE(this.additionExpression);
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(SameVibe) },
        { ALT: () => this.CONSUME(NotVibing) },
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(GreaterThanEqual) },
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(LessThanEqual) },
      ]);
      this.SUBRULE2(this.additionExpression);
    });
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
    }
  );

  private atomicExpression = this.RULE("atomicExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(Idk) },
      { ALT: () => this.CONSUME(None) },
      { ALT: () => this.SUBRULE(this.functionCall) },
      { ALT: () => this.SUBRULE(this.arrayAccess) },
      { ALT: () => this.CONSUME(Identifier) },
      {
        ALT: () => {
          this.CONSUME(LParen);
          this.SUBRULE(this.expression);
          this.CONSUME(RParen);
        },
      },
      {
        ALT: () => this.SUBRULE(this.arrayLiteral),
      },
    ]);
  });

  private arrayLiteral = this.RULE("arrayLiteral", () => {
    this.CONSUME(LBracket);
    this.OPTION(() => {
      this.SUBRULE(this.expression);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.expression);
      });
    });
    this.CONSUME(RBracket);
  });

  private arrayAccess = this.RULE("arrayAccess", () => {
    this.CONSUME(Identifier);
    this.CONSUME(At);
    this.SUBRULE(this.expression);
  });
}

export const parserInstance = new GenZParser();
