// some handy Helper functions
const op = {
  infix: (prio, lhs, op, rhs) => prec.left(prio, seq(
    field('lhs', lhs),
    field('operator', op),
    field('rhs', rhs)
  )),
  args: (prio, entity, open, args, close) => prec.left(prio, seq(
    field('entity', entity),
    open,
    field('args', args),
    close
  ))
};

// for comma seperated lists, like args in a call
function delimited(rule, delimiter = ',') {
  return optional(seq(
    repeat(seq(rule, delimiter)),
    rule
  ));
}

module.exports = grammar({
  name: "seed7",

  // white spaces and comments
  extras: $ => [$._space, $.comment],

  word: $ => $.identifier,

  // no conflicts, for now, let's see
  conflicts: $ => [],

  rules: {
    // PROGRAM STRUCTURE
    program: $ => seq(
      optional($._definitions),
      optional($.kEndDot)
    ),

    _definitions: $ => repeat1($._definition),
    _definition: $ => choice(
      $.declUses,
      $.declConst
    ),

    declUses: $ => seq(
      $.kDollar,
      repeat1($._single_include_statement)
    ),

    _single_include_statement: $ => seq(
      $.kInclude,
      field('file', $.string),
      ';'
    ),

    // DECLARATIONS
    declConst: $ => prec.left(seq(
      $.kConst,
      field('type', $.type),
      ':',
      field('name', $.identifier),
      $.kIs,
      field('value', $.declFunc),
      optional(';')
    )),

    declFunc: $ => seq(
      $.kFunc,
      optional(seq(
        prec(10, $.kLocal),
        optional($._local_declarations)
      )),
      field('body', $.block)
    ),

    _local_declarations: $ => repeat1(seq(
      $.declVar,
      optional(';')
    )),

    declVar: $ => prec.left(seq(
      $.kVar,
      field('type', $.type),
      ':',
      field('name', $.identifier),
      $.kIs,
      field('value', $._expr),
      ';'
    )),

    // STATEMENTS
    block: $ => seq(
      prec(10, $.kBegin),
      optional($._statements),
      $.kEndFunc
    ),

    _statements: $ => repeat1($._statement),

    _statement: $ => choice(
      prec(15, $.stmtIf),
      prec(15, $.stmtFor),
      prec(15, $.stmtRepeat),
      prec(15, $.stmtWhile),
      prec(15, $.stmtCase),
      seq(prec(10, $.exprAssign), ';'),
      seq(prec(10, $._expr), ';')
    ),

    stmtIf: $ => prec.left(15, seq(
      $.kIf,
      field('condition', $._expr),
      $.kThen,
      field('then', optional($._statements)),
      repeat(field('elsif', $.stmtElsif)),
      optional(field('else', $.stmtElse)),
      $.kEndIf,
      optional(';')
    )),

    stmtElsif: $ => seq(
      $.kElsif,
      field('condition', $._expr),
      $.kThen,
      field('then', optional($._statements))
    ),

    stmtElse: $ => seq(
      $.kElse,
      field('else', optional($._statements))
    ),

    stmtFor: $ => prec.left(15, seq(
      $.kFor,
      field('variable', $.identifier),
      $.kRange,
      field('low', $._expr),
      $.kTo,
      field('high', $._expr),
      $.kDo,
      field('body', optional($._statements)),
      $.kEndFor,
      optional(';')
    )),

    stmtRepeat: $ => prec.left(15, seq(
      $.kRepeat,
      field('body', optional($._statements)),
      $.kUntil,
      field('condition', $._expr),
      optional(';')
    )),

    stmtWhile: $ => prec.left(15, seq(
      $.kWhile,
      field('condition', $._expr),
      $.kDo,
      field('body', optional($._statements)),
      $.kEndWhile,
      optional(';')
    )),

    stmtCase: $ => prec.left(15, seq(
      $.kCase,
      field('expression', $._expr),
      $.kOf,
      repeat1(field('branch', $.caseBranch)),
      optional(field('otherwise', $.caseOtherwise)),
      $.kEndCase,
      optional(';')
    )),

    caseBranch: $ => prec.left(10, seq(
      $.kWhen,
      field('set', $.set_expression),
      ':',
      field('body', $._statements), // Non-optional to resolve conflict
      optional(';') // Delimit branches
    )),

    caseOtherwise: $ => seq(
      $.kOtherwise,
      ':', // Added colon for consistency
      field('body', optional($._statements)),
      optional(';') // Optional semicolon
    ),

    set_expression: $ => prec.left(5, choice(
      $.set_literal,
      $.set_union
    )),

    set_literal: $ => seq(
      '{',
      delimited($._expr, ','), // Allow multiple exprs, e.g., {"td", "th"}
      optional(seq(
        $.kRangeOp,
        $._expr
      )), // Optional range, e.g., 'A' .. 'Z'
      '}'
    ),

    set_union: $ => op.infix(4, $.set_expression, $.kSetUnion, $.set_expression),

    // EXPRESSIONS
    _expr: $ => choice(
      prec(10, $.exprCall),
      prec(8, $.exprArithmetic),
      prec(7, $.exprCompare),
      prec(5, $.exprBinary),
      prec(3, $.exprAssign),
      $.string,
      $.integer,
      $.identifier
    ),

    exprBinary: $ => op.infix(5, $._expr, $.kConcat, $._expr),

    exprCompare: $ => op.infix(7, $._expr, choice(
      $.kEq, $.kNeq, $.kLt, $.kGt, $.kLeq, $.kGeq
    ), $._expr),

    exprArithmetic: $ => op.infix(8, $._expr, choice(
      $.kPlus, $.kMinus, $.kMult, $.kDiv
    ), $._expr),

    exprAssign: $ => prec.right(3, seq(
      field('lhs', $.identifier),
      $.kAssign,
      field('rhs', $._expr)
    )),

    exprCall: $ => prec(10, seq(
      field('function', $.identifier),
      '(',
      field('args', optional(delimited($._expr, ','))),
      ')'
    )),

    // TYPES
    type: $ => choice(
      $.typeString,
      $.typeProc,
      $.typeInteger
    ),

    typeString: $ => /string/i,
    typeProc: $ => /proc/i,
    typeInteger: $ => /integer/i,

    // LITERALS
    string: $ => choice(
      $.string_single,
      $.string_double
    ),

    string_single: $ => seq(
      "'",
      repeat(choice(/[^\\']/, /\\./)),
      "'"
    ),

    string_double: $ => seq(
      '"',
      repeat(choice(/[^\\"]/, /\\./)),
      '"'
    ),

    integer: $ => /[0-9]+/,

    // TERMINAL SYMBOLS
    identifier: $ => token(prec(-1, /[a-zA-Z_][a-zA-Z0-9_]*/)),

comment: $ => choice(
  // Line comments
  seq('#', /.*/),
  // Block comments with nesting support (no token wrapper)
  seq(
    '(*',
    repeat(choice(
      /[^*]+/,          // Match non-* characters
      /\*+[^*)]/,       // Match * not followed by )
      $.comment         // Recursive call for nested comments
    )),
    '*)'
  ),
  // {* ... *} comments
  seq('{*', /[^*]*\*+([^*}][^*]*\*+)*/, '*}')
),

    _space: $ => /[\s\r\n\t]+/,

    // KEYWORDS
    kDollar: $ => '$',
    kInclude: $ => /include/i,
    kConst: $ => /const/i,
    kVar: $ => /var/i,
    kFunc: $ => /func/i,
    kIs: $ => /is/i,
    kBegin: $ => /begin/i,
    kEndFunc: $ => /end\s+func/i,
    kLocal: $ => /local/i,
    kEndDot: $ => /\./,
    kConcat: $ => '<&',
    kIf: $ => choice('if', 'IF', 'If'),
    kThen: $ => choice('then', 'THEN', 'Then'),
    kElsif: $ => choice('elsif', 'ELSIF', 'Elsif'),
    kElse: $ => choice('else', 'ELSE', 'Else'),
    kEndIf: $ => choice(/end\s+if/i, /END\s+IF/i),
    kFor: $ => /for/i,
    kRange: $ => /range/i,
    kTo: $ => /to/i,
    kDo: $ => /do/i,
    kEndFor: $ => /end\s+for/i,
    kRepeat: $ => /repeat/i,
    kUntil: $ => /until/i,
    kWhile: $ => /while/i,
    kEndWhile: $ => /end\s+while/i,
    kEq: $ => '=',
    kNeq: $ => '<>',
    kLt: $ => '<',
    kGt: $ => '>',
    kLeq: $ => '<=',
    kGeq: $ => '>=',
    kAssign: $ => ':=',
    kPlus: $ => '+',
    kMinus: $ => '-',
    kMult: $ => '*',
    kDiv: $ => '/',
    kCase: $ => choice('case', 'CASE', 'Case'),
    kOf: $ => choice('of', 'OF', 'Of'),
    kWhen: $ => choice('when', 'WHEN', 'When'),
    kOtherwise: $ => choice('otherwise', 'OTHERWISE', 'Otherwise'),
    kEndCase: $ => choice(/end\s+case/i, /END\s+CASE/i),
    kRangeOp: $ => '..',
    kSetUnion: $ => '|'
  }
});
