# GenZ Language (genz-lang)
> ⚡ A bold, expressive, Gen Z-inspired programming language for the terminal generation.  
> It’s not just code — it’s a whole damn *vibe*.

`genz-lang` reimagines traditional programming through a Gen Z lens — with slangy keywords, emoji-rich syntax, and natural language expressions.  
Built for fun, education, and creative chaos, this language is for developers who are tired of boring old semicolons and crave a bit of ✨drip✨ in their code.

## 🌈 Why?

Because:
- `print("hello world")` is ✏️ mid — we say `yo "sup world"`
- `else` is old-school — we say `nah:`
- Indexing with `@` hits different than `[0]`
- Errors should feel like being left on read

## 🧠 Designed For:

- Curious devs who love toy languages and creative DSLs
- Educators who want to teach core concepts in a fun way
- Rebels who think `vibe = "chill"` > `let x = "chill"`

## 💻 Examples:
If / Else but make it ✨chaotic
```bash
mood = "bored"

fr mood == "bored" ->
    yo "let’s vibe 🎶"
nah:
    yo "keep grinding 💻"
```
Looping (aka infinite grindset ♾️)
```bash
loop 0 to 5 ->
  yo "Counting vibes..."  
<-
```
Fibbonaci `fibbo.gz`
```bash
vibe fibbonaci(n) -> 
  a = 0
  b = 1
  loop 2 to n ->
    yo a
    temp = a + b
    a = b
    b = temp
  <-
<-

fibbonaci(10)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Bun

### Installation
1. Clone the repository
```bash
    git clone https://github.com/genz-lang/genzlang.git
    cd genzlang
```
2. Install dependencies
```bash
    bun install
    # or, if you want to install separately
    # bun install --cwd web
    # bun install --cwd core
```
3. Run the core(Interpreter)
```bash
    bun run index.ts
    # or, bun run dev:core
```
4. Run the web(Next.js)
```bash
    bun run dev:web
```
5. Usage
```bash
    bun run dev:core
    yo "Wassup, world!"
```
6. Create & execute .gz file
```bash
#Create .gz file under examples folder
fibbo.gz 

bun run GENZ examples/fibbo.gz #execute at root
#or
npm run GENZ examples/fibbo.gz
```

## 🤝 Contribute
**Got ideas for:**
> More chaotic keywords? Cooler syntax? Gen Z style features?

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Pull up with a PR or open an issue. let’s build the weirdest language ever, together.

## 🙏 Acknowledgments
<ul>
    <li><a href="https://github.com/SAP/chevrotain">Chevrotain</a> for the PEG parser toolkit.</li>
    <li><a href="https://bun.sh/">Bun</a> for the ultra-fast JS runtime.</li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a> for the type safety.</li>
</ul>

---
<p align="center">
  Made with ❤️ by the <b>GenZ Lang</b> team. <br />
  <a href="https://github.com/Sharmil001/genzlang/issues">Report Bugs</a> · 
  <a href="https://github.com/Sharmil001/genzlang/labels/enhancement">Request Features</a>
</p>

