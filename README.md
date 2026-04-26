# Connective

Connective is a Pixel Paper personal homepage for purposeful first contact.

It is a static MVP for helping visitors understand Tianyu, choose why they want to make contact, copy a purpose-specific prompt, and use their own AI assistant to write a clearer first message.

## MVP Loop

The page keeps one lightweight loop:

1. Read the compact personal context.
2. Choose from 三张目的卡片:
   - `认识我`
   - `聊一篇文章 / 一个观点`
   - `一起做点事`
3. Preview the matching prompt.
4. Copy the prompt.
5. Paste it into an AI assistant to shape the first message before contacting Tianyu.

## Run Locally

Start a static server from the project root:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Test

Run all static MVP tests:

```bash
node --test tests/*.test.js
```

## File Overview

- `index.html` defines the semantic page structure and loads `data.js` before `app.js`.
- `styles.css` defines the Pixel Paper visual system, responsive layout, cards, focus states, and copied state.
- `data.js` owns the profile context, the three purpose cards, and prompt construction.
- `app.js` renders the purpose cards, updates the prompt preview, and handles clipboard copy with a fallback path.
- `tests/` contains Node.js built-in test runner coverage for prompt data and required static files.
