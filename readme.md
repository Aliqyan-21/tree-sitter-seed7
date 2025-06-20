# Tree-sitter Parser for Seed7

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter) parser for the [Seed7](http://seed7.sourceforge.net) programming language, enabling syntax highlighting, code folding, and parsing for Seed7 code in editors like Neovim.

## Features

- **Syntax Support**:
  - Include directives: `$ include "file";`
  - Constants: `const proc: name is func ...`
  - Functions: `func local ... begin ... end func`
  - Variables: `var string: name is "value";`
  - Control structures: `if`, `else`, `elsif`, `for`, `repeat`, `while`, `case` (with `when` and set expressions)
  - Expressions: Identifiers, strings, integers, function calls, concatenation (`<&`), comparisons (`=`, `<>`, `<`, `>`, `<=`, `>=`), assignments (`:=`), arithmetic (`+`, `-`, `*`, `/`), set literals (`{}`), ranges (`..`), set unions (`|`)
  - Types: `proc`, `string`, `integer`
  - Comments: `# ...`, `(* ... *)`, `{* ... *}`

- **Editor Integration**: Syntax highlighting for Neovim via `queries/seed7/highlights.scm`.

## Installation

### Prerequisites
- [Neovim](https://neovim.io) (version 0.9.0 or later recommended).
- [Tree-sitter CLI](https://tree-sitter.github.io/tree-sitter/using-parsers#installation): Install via `npm install -g tree-sitter-cli`.
- [Node.js](https://nodejs.org) and `npm` for Tree-sitter CLI.
- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) plugin installed in Neovim.
- Git for cloning the repository.

### Manual Installation
Since this parser is not yet included in `nvim-treesitter`, follow these steps to install it manually:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aliqyan-21/tree-sitter-seed7.git ~/.local/share/nvim/site/pack/parser/start/tree-sitter-seed7
   cd ~/.local/share/nvim/site/pack/parser/start/tree-sitter-seed7
   ```

2. **Generate the Parser**:
   ```bash
   tree-sitter generate
   ```

3. **Configure Neovim for the Parser**:
   Add the following to your Neovim configuration (e.g., `~/.config/nvim/init.lua` or a file in `~/.config/nvim/lua/`):
   ```lua
   local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
   parser_config.seed7 = {
     install_info = {
       url = "~/.local/share/nvim/site/pack/parser/start/tree-sitter-seed7", -- Local path to the parser
       files = { "src/parser.c" },
       branch = "main",
       generate_requires_npm = false, -- Pre-generated parser.c included
     },
     filetype = "sd7",
   }
   ```

4. **Set Up Filetype Detection**:
   Since Vim/Neovim does not natively recognize the `sd7` filetype, add the following to `~/.config/nvim/ftdetect/seed7.vim` to associate `.sd7` files with the `seed7` filetype:
   ```lua
   vim.cmd [[autocmd BufRead,BufNewFile *.sd7 set filetype=seed7]]
   ```

   For vim:

   ```vim
   autocmd BufRead,BufNewFile *.sd7 setfiletype seed7
   ```

5. **Copy Highlight Queries**:
   Copy the highlighting queries to Neovim’s query directory:
   ```bash
   mkdir -p ~/.local/share/nvim/site/queries/seed7
   cp ~/.local/share/nvim/site/pack/parser/start/tree-sitter-seed7/queries/seed7.scm ~/.local/share/nvim/site/queries/seed7/highlights.scm
   ```

6. **Install the Parser in Neovim**:
   Open Neovim and run:
   ```vim
   :TSInstall seed7
   ```
   This compiles and installs the parser for use with `nvim-treesitter`.

7. **Verify Installation**:
   Open a Seed7 file:
   ```bash
   nvim ~/.local/share/nvim/site/pack/parser/start/tree-sitter-seed7/test_case.sd7
   ```
   Check syntax highlighting with:
   ```vim
   :TSHighlightCapturesUnderCursor
   ```

### Alternative: Using a Package Manager
If you use a Neovim package manager like `packer.nvim`, you can add the parser as a custom repository:
```lua
use {
  'aliqyan-21/tree-sitter-seed7',
  config = function()
    local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
    parser_config.seed7 = {
      install_info = {
        url = "~/.local/share/nvim/site/pack/packer/start/tree-sitter-seed7", -- Adjust path based on your package manager
        files = { "src/parser.c" },
        branch = "main",
        generate_requires_npm = false,
      },
      filetype = "sd7",
    }
  end
}
```
After adding, run `:PackerSync` (or equivalent) and `:TSInstall seed7`.

## Testing
Test the parser with provided Seed7 test files:
```bash
tree-sitter parse test_case.sd7
```
Verify output shows no `ERROR` nodes. Open in Neovim to confirm highlighting:
```bash
nvim test_case.sd7
```

## Limitations
The parser is under active development and has the following limitations:
- Unsupported types: `float`, `char`, `boolean`.
- Unsupported operators: `div`, `and`, `or`, `not`.
- Missing features:
  - Unary operators.
  - Subscripts.
  - Type declarations.
  - Function parameters (e.g., `game(in integer: min, in integer: max) is func`).
  - Constant declarations (treated as identifiers).
  - Arrays.
- See [Issues](https://github.com/aliqyan-21/tree-sitter-seed7/issues) for planned enhancements.

Contributions to address these limitations are highly encouraged.

## Contributing
We welcome contributions to improve the parser’s stability and feature set. To contribute:
1. Fork the repository: `https://github.com/aliqyan-21/tree-sitter-seed7`.
2. Create a feature branch: `git checkout -b feature-name`.
3. Modify `grammar.js`, add test files, or update `queries/seed7.scm`.
4. Test changes:
   ```bash
   tree-sitter generate
   tree-sitter parse test_*.sd7
   ```
5. Submit a pull request with a clear description of changes.

Refer to the [Seed7 Manual](http://seed7.sourceforge.net/manual/index.htm) for syntax accuracy.

## License
[MIT License](license.md)

## Acknowledgements
- [Thomas Mertes and Seed7 Community](http://seed7.sourceforge.net) for developing Seed7.
- [Tree-sitter](https://tree-sitter.github.io) and [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) for parsing and highlighting infrastructure.
