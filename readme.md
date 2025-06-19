# Tree-sitter Parser for Seed7

A [Tree-sitter](https://tree-sitter.github.io) parser for the [Seed7](http://seed7.sourceforge.net) programming language, providing syntax highlighting, code folding, and parsing for Seed7 code in editors like Neovim.

## Features

- **Syntax Support**:
  - **Include Directives**: `$ include "file";`
  - **Constants**: `const proc: name is func ...`
  - **Functions**: `func local ... begin ... end func`
  - **Variables**: `var string: name is "value";`
  - **Control Structures**: `if`, `else`, `elsif`, `for`, `repeat`, `while`, `case` (with `when` and set expressions)
  - **Expressions**: Identifiers, strings, integers, function calls, concatenation (`<&`), comparisons (`=`, `<>`, `<`, `>`, `<=`, `>=`), assignments (`:=`), arithmetic (`+`, `-`, `*`, `/`), set literals (`{}`), ranges (`..`), set unions (`|`)
  - **Types**: `proc`, `string`, `integer`
  - **Comments**: `# ...`, `(* ... *)`

- **Editor Integration**: Syntax highlighting for Neovim via `highlights.scm`.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org) and `npm` for Tree-sitter CLI.
- [Tree-sitter CLI](https://tree-sitter.github.io/tree-sitter/using-parsers#installation): `npm install -g tree-sitter-cli`
- [Neovim](https://neovim.io) with `nvim-treesitter` plugin (for highlighting).

### Build and Install
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tree-sitter-seed7.git
   cd tree-sitter-seed7
   ```
2. Generate the parser:
   ```bash
   tree-sitter generate
   ```
3. Put this in your nvim-treesitter config:
    ```lua
    -- For custom parsers, you need to add the parser manually
    local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
    parser_config.seed7 = {
      install_info = {
        url = "/home/aliqyanabid/College/neovim/treesitter/tree-sitter-seed7", -- local path
        files = { "src/parser.c" },
        branch = "main",                                                       -- if it's a git repo
        generate_requires_npm = false,                                         -- if folder contains pre-generated src/parser.c
      },
      filetype = "seed7",                                                      -- if filetype does not match the parser name
    }
    ```
    **Then run in nvim command line:**
    ```bash
    :TSInstall seed7
    ```

4. Copy queries for highlighting:
   ```bash
   mkdir -p ~/.local/share/nvim/site/queries/seed7
   cp queries/seed7.scm ~/.local/share/nvim/site/queries/seed7/highlights.scm
   ```

    > [!NOTE]
    > Steps 3 and 4 you will only have to do if u are downloading manually
    > once it is in nvim-treesitter u can just do
    > ```bash 
    > :TSInstall seed7
    > ```

## Testing
Test the parser with provided Seed7 files:
```bash
tree-sitter parse test_case.sd7
```
Open in Neovim to verify highlighting:
```bash
nvim test_case.sd7
```

## Limitations
- **Unsupported Types**: `float`, `char`, `boolean`.
- **Unsupported Operators**: `div`, `and`, `or`, `not`.
- **Missing Features**: Unary operators, subscripts, type declarations, function parameters, constant declarations (treated as identifiers).
- **Arrays**
- **Functions with parameters: like, `game(in integer: min, in integer: max) is func`**
- There are more, as I am also exploring the language we will together keep on extending it!
- Raise and See [Issues](https://github.com/aliqyan-21/tree-sitter-seed7/issues) for planned features.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a branch: `git checkout -b feature-name`.
3. Update `grammar.js`, add tests, or improve queries.
4. Test with `tree-sitter generate` and `tree-sitter parse`.
5. Submit a pull request.

Please follow the [Seed7 manual](http://seed7.sourceforge.net/manual/index.htm) for syntax accuracy.

## License
[MIT License](LICENSE)

## Acknowledgements
- [Seed7 Community and Thomas Mertes](http://seed7.sourceforge.net) for the language.
- [Tree-sitter](https://tree-sitter.github.io) and [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) for parsing and highlighting.
