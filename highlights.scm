;; ~/.config/nvim/after/queries/seed7/highlights.scm for new grammar

; Keywords
(kDollar) @keyword
(kInclude) @keyword
(kConst) @keyword
(kVar) @keyword
(kFunc) @keyword
(kIs) @keyword
(kBegin) @keyword
(kEndFunc) @keyword
(kLocal) @keyword
(kEndDot) @keyword ; Not usually a keyword, but using it as one in grammar

; Types
(type) @type
(typeString) @type
(typeProc) @type

; Literals
(string) @string
(string_single) @string
(string_double) @string

; Operators
(kConcat) @operator

; Punctuation
":" @punctuation.delimiter
";" @punctuation.delimiter
"(" @punctuation.bracket
")" @punctuation.bracket
"." @punctuation.delimiter

; Identifiers and Variables
(identifier) @variable

(declFunc
  body: (block)
)
(declConst
  name: (identifier) @constant
  type: (type) @type
  value: (declFunc) @function.builtin ; special case for `const some_name is func ...`
)
(declVar
  name: (identifier) @variable.declaration
  type: (type) @type
)

(exprCall
  function: (identifier) @function
)

; Comments
(comment) @comment
