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
  If,
  Nah,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  Is,
  Aint,
  SameAs,
  LParen,
  RParen,
  Loop,
  From,
  To,
  LBracket,
  Comma,
  RBracket,
  Idk,
  Ghost,
  Colon,
  At,
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
        { ALT: () => this.SUBRULE(this.variableDeclaration) },
        { ALT: () => this.SUBRULE(this.conditionalStatement) },
        { ALT: () => this.SUBRULE(this.loopStatement) },
      ]);
    });
  });

  private sayStatement = this.RULE("sayStatement", () => {
    this.CONSUME(Yo)
    this.SUBRULE(this.expression);
  });

  private variableDeclaration = this.RULE("variableDeclaration", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Assign); this.SUBRULE(this.expression);
  });

  private conditionalStatement = this.RULE("conditionalStatement", () => {
    this.CONSUME(If);
    this.SUBRULE1(this.expression);
    this.CONSUME(Colon);
    this.SUBRULE2(this.statementOrBlock);
    this.OPTION(() => {
      this.CONSUME(Nah);
      this.CONSUME2(Colon);
      this.SUBRULE3(this.statementOrBlock);
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
    this.CONSUME(Colon);
    this.SUBRULE3(this.statementOrBlock);
  });

  private statementOrBlock = this.RULE("statementOrBlock", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.statement);
    });
  });

  private statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.sayStatement) },
      { ALT: () => this.SUBRULE(this.variableDeclaration) },
      { ALT: () => this.SUBRULE(this.conditionalStatement) },
    ]);
  });

  private expression = this.RULE("expression", () => {
    this.SUBRULE(this.comparisonExpression);
  });

  private comparisonExpression = this.RULE("comparisonExpression", () => {
    this.SUBRULE(this.additionExpression);
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(GreaterThanOrEqualTo) },
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(LessThanOrEqualTo) },
        { ALT: () => this.CONSUME(Is) },
        { ALT: () => this.CONSUME(Aint) },
        { ALT: () => this.CONSUME(SameAs) },
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
    },
  );

  private atomicExpression = this.RULE("atomicExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(Idk) },
      { ALT: () => this.CONSUME(Ghost) },
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
