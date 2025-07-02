import { CstParser } from "chevrotain";
import {
  allTokens,
  Say,
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
  Shout,
  Vibe,
  Lock,
  If,
  Nah,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  Is,
  Aint,
  SameAs,
  LBrace,
  RBrace,
  LParen,
  RParen,
  Loop,
  From,
  To,
  In,
  LBracket,
  Comma,
  RBracket,
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
    this.OR([
      { ALT: () => this.CONSUME(Say) },
      { ALT: () => this.CONSUME(Shout) },
    ]);
    this.SUBRULE(this.expression);
  });

  private variableDeclaration = this.RULE("variableDeclaration", () => {
    this.OR([
      { ALT: () => this.CONSUME(Vibe) },
      { ALT: () => this.CONSUME(Lock) },
    ]);
    this.CONSUME(Identifier);
    this.CONSUME(Assign);
    this.SUBRULE(this.expression);
  });

  private conditionalStatement = this.RULE("conditionalStatement", () => {
    this.CONSUME(If);
    this.SUBRULE1(this.expression);
    this.SUBRULE2(this.statementOrBlock);
    this.OPTION(() => {
      this.CONSUME(Nah);
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
    this.SUBRULE3(this.statementOrBlock);
  });

  private statementOrBlock = this.RULE("statementOrBlock", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.statement) },
      { ALT: () => this.SUBRULE(this.block) },
    ]);
  });

  private block = this.RULE("block", () => {
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
    this.CONSUME(RBrace);
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
}

export const parserInstance = new GenZParser();
