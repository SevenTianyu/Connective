# Connective Static MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Connective v0 single-page static site: Pixel Paper personal homepage, three purpose cards, prompt preview, and copy button.

**Architecture:** Keep the site static and dependency-light. Put editable profile content and prompt construction in `data.js`, render semantic markup in `index.html`, apply Pixel Paper styling in `styles.css`, and wire card selection plus clipboard behavior in `app.js`.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in test runner, Python `http.server` for local preview.

---

## Spec Source

- `docs/superpowers/specs/2026-04-25-connective-mvp-design.md`

## File Structure

- Create `data.js`
  - Owns `profileContext`, three purpose definitions, prompt construction, and CommonJS export for tests.
- Create `app.js`
  - Owns DOM rendering, active purpose state, prompt preview updates, and clipboard copy behavior.
- Create `styles.css`
  - Owns Pixel Paper visual direction, responsive layout, focus states, and copied-state styling.
- Create `index.html`
  - Owns semantic page structure and loads `data.js` before `app.js`.
- Create `tests/prompt-data.test.js`
  - Verifies prompt data, prompt output, default purpose, and absence of unresolved template variables.
- Create `tests/static-files.test.js`
  - Verifies required static files, script order, CSS hooks, and interaction hooks.
- Create `README.md`
  - Documents local preview, test commands, and the MVP loop.

## Task 1: Prompt Data Module

**Files:**
- Create: `tests/prompt-data.test.js`
- Create: `data.js`

- [ ] **Step 1: Write the failing prompt data tests**

Create `tests/prompt-data.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const connective = require('../data.js');

test('exports exactly three purpose cards with meet as default', () => {
  assert.equal(connective.defaultPurposeId, 'meet');
  assert.deepEqual(Object.keys(connective.purposes), ['meet', 'thought', 'create']);
});

test('profile context contains the approved personal positioning', () => {
  assert.match(connective.profileContext, /张三/);
  assert.match(connective.profileContext, /写作/);
  assert.match(connective.profileContext, /个人连接/);
  assert.match(connective.profileContext, /AI/);
});

test('buildPrompt includes selected purpose, profile context, and guardrails', () => {
  const prompt = connective.buildPrompt('thought');

  assert.match(prompt, /聊一篇文章 \/ 一个观点/);
  assert.match(prompt, /张三的个人上下文/);
  assert.match(prompt, /不要假装我已经和张三很熟/);
  assert.match(prompt, /不要写商业套话/);
  assert.match(prompt, /我读到的内容是什么/);
  assert.doesNotMatch(prompt, /\{\{PURPOSE\}\}/);
  assert.doesNotMatch(prompt, /\{\{PROFILE_CONTEXT\}\}/);
});

test('buildPrompt falls back to default purpose for unknown ids', () => {
  const prompt = connective.buildPrompt('unknown-id');

  assert.match(prompt, /认识我/);
  assert.match(prompt, /自然破冰/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/prompt-data.test.js
```

Expected: FAIL because `../data.js` does not exist.

- [ ] **Step 3: Create the data module**

Create `data.js`:

```js
const profileContext = `# 张三 / Alex Zhang

## 一句话定位
张三，一个把写作、AI 和真实连接放在一起思考的人。

## 我关心什么
- 个人连接如何在 AI 时代变得更真诚，而不是更机械。
- 写作如何帮助一个人整理判断、经验和关系。
- AI Agent 如何成为人的表达外骨骼，而不是替代人的意图。
- 长期关系、真实合作、可以沉淀下来的对话。

## 你可以找我聊什么
- 认识我：如果你只是想认识一个具体的人，而不是交换名片。
- 聊一篇文章 / 一个观点：如果你读到某个观点，想继续推演、反驳或补充。
- 一起做点事：如果你有合作、访谈、项目、机会，或者只是一个还没有成形的想法。

## 一些真实痕迹
- 我长期写关于 AI、产品、组织和个人判断的长文。
- 我关注 Agent、数据、评估和真实产品落地之间的关系。
- 我更在意一个人为什么开口，而不只是他通过什么渠道联系我。
- 我希望技术帮助人更准确地表达自己，而不是制造更多模板化寒暄。

## 联系方式
- 微信：请先用复制出来的 Prompt 写好第一句话，再通过你已有的渠道联系我。
- GitHub：alex-zhang-lab
- 写作入口：公众号、博客或公开文章入口会作为主要阅读路径。`;

const defaultPurposeId = 'meet';

const purposes = {
  meet: {
    id: 'meet',
    number: '01',
    label: '认识我',
    shortDescription: '写一段自然的破冰开场。',
    purposeText: '认识我',
    addition: '这个场景偏向自然破冰。请让开场白像一个真实的人想认识另一个真实的人，而不是社交模板。',
  },
  thought: {
    id: 'thought',
    number: '02',
    label: '聊一篇文章 / 一个观点',
    shortDescription: '围绕写作和思考发起对话。',
    purposeText: '聊一篇文章 / 一个观点',
    addition: '这个场景偏向围绕一篇文章、一个观点或一次表达继续交流。请先提醒我补充：我读到的内容是什么、哪个观点触发了我、我想继续讨论什么。',
  },
  create: {
    id: 'create',
    number: '03',
    label: '一起做点事',
    shortDescription: '合作、访谈、项目、机会。',
    purposeText: '一起做点事',
    addition: '这个场景偏向合作、访谈、项目或机会。请先帮助我说清楚：我想做什么、我能提供什么、我希望张三怎么回应。',
  },
};

function getPurpose(purposeId) {
  return purposes[purposeId] || purposes[defaultPurposeId];
}

function buildPrompt(purposeId) {
  const purpose = getPurpose(purposeId);

  return `你是我的私人沟通助手。

我准备联系张三。下面是张三本人提供的个人上下文。

我的联系目的：
${purpose.purposeText}

${purpose.addition}

请基于这个目的和下面的个人上下文，帮我生成：

1. 一段自然、不油腻的第一句话
2. 一句我可以用来介绍自己的话
3. 一个明确但不冒犯的联系意图
4. 三个语气版本：轻松、真诚、直接

要求：

- 不要假装我已经和张三很熟
- 不要写商业套话
- 不要过度夸张或过度热情
- 不要替我编造经历
- 如果我的目的还不清楚，先向我追问 2-3 个问题
- 输出要适合发在微信、邮件或私信里

张三的个人上下文：
${profileContext}`;
}

const ConnectiveData = {
  defaultPurposeId,
  profileContext,
  purposes,
  getPurpose,
  buildPrompt,
};

if (typeof module !== 'undefined') {
  module.exports = ConnectiveData;
}

if (typeof window !== 'undefined') {
  window.ConnectiveData = ConnectiveData;
}
```

- [ ] **Step 4: Run the prompt data tests**

Run:

```bash
node --test tests/prompt-data.test.js
```

Expected: PASS, 4 tests passing.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add data.js tests/prompt-data.test.js
git commit -m "feat: add prompt data module"
```

Expected: commit succeeds.

## Task 2: Semantic HTML Shell

**Files:**
- Create: `tests/static-files.test.js`
- Create: `index.html`

- [ ] **Step 1: Write the failing static file test**

Create `tests/static-files.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('index.html contains the approved page structure', () => {
  const html = read('index.html');

  assert.match(html, /CONNECTIVE \/ PERSONAL CARD/);
  assert.match(html, /张三，不是一个微信二维码/);
  assert.match(html, /data-purpose-list/);
  assert.match(html, /data-prompt-preview/);
  assert.match(html, /data-copy-button/);
  assert.match(html, /认识我/);
  assert.match(html, /聊一篇文章 \/ 一个观点/);
  assert.match(html, /一起做点事/);
});

test('index.html loads data before app script', () => {
  const html = read('index.html');
  const dataIndex = html.indexOf('data.js');
  const appIndex = html.indexOf('app.js');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > -1);
  assert.ok(dataIndex < appIndex);
});
```

- [ ] **Step 2: Run the static file test and verify it fails**

Run:

```bash
node --test tests/static-files.test.js
```

Expected: FAIL because `index.html` does not exist.

- [ ] **Step 3: Create the semantic HTML page**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Connective 是张三的个人连接页，帮助访问者带着更清楚的目的开口。">
    <title>Connective | Alex Zhang</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main class="page-shell">
      <header class="status-bar" aria-label="Page status">
        <span>CONNECTIVE / PERSONAL CARD</span>
        <span class="status-pill">OPEN</span>
      </header>

      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">PERSON / WRITING / THINKING</p>
          <h1 id="hero-title">张三，不是一个微信二维码</h1>
          <p class="hero-lede">如果你想认识我、聊一个观点，或者一起做点事，可以先让你的 AI 助手帮你组织第一句话。</p>
        </div>

        <aside class="profile-card" aria-label="个人状态">
          <p class="profile-card__status">AVAILABLE FOR REAL CONVERSATION</p>
          <p>写作 / AI 产品 / 个人连接 / 长期关系 / 真实合作</p>
        </aside>
      </section>

      <section class="context-grid" aria-label="个人上下文">
        <article>
          <h2>我关心什么</h2>
          <p>AI 时代的表达、写作、个人连接、Agent、长期关系，以及技术如何帮助人更准确地说出自己的意图。</p>
        </article>
        <article>
          <h2>你可以找我聊什么</h2>
          <p>一个真实的认识、一篇文章里的判断、一个还没完全成形但值得一起推演的想法。</p>
        </article>
        <article>
          <h2>一些真实痕迹</h2>
          <p>我长期写关于 AI、产品、组织和个人判断的长文，也关注 Agent、数据、评估和真实产品落地之间的关系。</p>
        </article>
      </section>

      <section class="prompt-workbench" aria-labelledby="prompt-title">
        <div class="section-heading">
          <p class="eyebrow">CHOOSE YOUR INTENT</p>
          <h2 id="prompt-title">你想怎样开口？</h2>
        </div>

        <div class="purpose-list" data-purpose-list></div>

        <section class="prompt-panel" aria-label="Prompt 预览">
          <div class="prompt-panel__header">
            <span data-active-purpose-label>认识我</span>
            <button type="button" data-copy-button>复制 Prompt</button>
          </div>
          <pre data-prompt-preview tabindex="0"></pre>
          <p class="copy-feedback" data-copy-feedback role="status" aria-live="polite"></p>
        </section>
      </section>

      <footer class="contact-block" aria-label="联系方式">
        <p class="eyebrow">CONTACT</p>
        <p>先复制 Prompt，让你的 AI 助手帮你整理第一句话。然后通过你已有的渠道联系我。</p>
        <div class="contact-links">
          <span>WeChat</span>
          <a href="https://github.com/alex-zhang-lab">GitHub</a>
          <span>Writing</span>
        </div>
      </footer>
    </main>

    <script src="data.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Run static tests**

Run:

```bash
node --test tests/static-files.test.js
```

Expected: PASS, 2 tests passing.

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add index.html tests/static-files.test.js
git commit -m "feat: add semantic homepage shell"
```

Expected: commit succeeds.

## Task 3: Pixel Paper Styling

**Files:**
- Modify: `tests/static-files.test.js`
- Create: `styles.css`

- [ ] **Step 1: Extend the static test for CSS requirements**

Replace `tests/static-files.test.js` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('index.html contains the approved page structure', () => {
  const html = read('index.html');

  assert.match(html, /CONNECTIVE \/ PERSONAL CARD/);
  assert.match(html, /张三，不是一个微信二维码/);
  assert.match(html, /data-purpose-list/);
  assert.match(html, /data-prompt-preview/);
  assert.match(html, /data-copy-button/);
  assert.match(html, /认识我/);
  assert.match(html, /聊一篇文章 \/ 一个观点/);
  assert.match(html, /一起做点事/);
});

test('index.html loads data before app script', () => {
  const html = read('index.html');
  const dataIndex = html.indexOf('data.js');
  const appIndex = html.indexOf('app.js');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > -1);
  assert.ok(dataIndex < appIndex);
});

test('styles.css defines Pixel Paper tokens and responsive rules', () => {
  const css = read('styles.css');

  assert.match(css, /--paper/);
  assert.match(css, /--ink/);
  assert.match(css, /--brick/);
  assert.match(css, /\.purpose-card/);
  assert.match(css, /\.purpose-card\.is-active/);
  assert.match(css, /@media \(max-width: 760px\)/);
});
```

- [ ] **Step 2: Run static tests and verify CSS test fails**

Run:

```bash
node --test tests/static-files.test.js
```

Expected: FAIL because `styles.css` does not exist or lacks required tokens.

- [ ] **Step 3: Create Pixel Paper CSS**

Create `styles.css`:

```css
:root {
  --paper: #f3ead5;
  --paper-light: #fff8e8;
  --ink: #241d16;
  --muted: #80694d;
  --line: #2a241c;
  --brick: #c95e3b;
  --green: #4b7f77;
  --gold: #9b6b2f;
  --shadow: rgba(36, 29, 22, 0.14);
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --serif: Georgia, "Times New Roman", serif;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    linear-gradient(rgba(36, 29, 22, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(36, 29, 22, 0.035) 1px, transparent 1px),
    var(--paper);
  background-size: 18px 18px;
  color: var(--ink);
  font-family: var(--sans);
}

button,
a {
  font: inherit;
}

a {
  color: inherit;
}

.page-shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 48px;
}

.status-bar,
.profile-card,
.context-grid article,
.purpose-card,
.prompt-panel,
.contact-block {
  border: 2px solid var(--line);
  background: var(--paper-light);
  box-shadow: 6px 6px 0 var(--shadow);
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  font-family: var(--mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

.status-pill {
  background: var(--line);
  color: var(--paper-light);
  padding: 4px 8px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
  gap: 18px;
  margin-top: 18px;
}

.hero-copy {
  border: 2px solid var(--line);
  background: var(--paper-light);
  padding: clamp(22px, 4vw, 48px);
  box-shadow: 6px 6px 0 var(--shadow);
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  line-height: 1.05;
}

h1 {
  max-width: 11ch;
  font-family: var(--serif);
  font-size: clamp(3rem, 8vw, 6.8rem);
  font-weight: 700;
}

h2 {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
}

.hero-lede {
  max-width: 620px;
  margin: 22px 0 0;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.7;
}

.profile-card {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.profile-card__status {
  margin: 0 0 18px;
  color: var(--green);
  font-family: var(--mono);
  font-size: 0.82rem;
}

.context-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.context-grid article {
  padding: 18px;
}

.context-grid h2 {
  font-size: 1.35rem;
}

.context-grid p,
.contact-block p {
  line-height: 1.7;
}

.prompt-workbench {
  margin-top: 44px;
}

.section-heading {
  margin-bottom: 16px;
}

.purpose-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.purpose-card {
  cursor: pointer;
  padding: 16px;
  text-align: left;
  transition: transform 140ms ease, background 140ms ease;
}

.purpose-card:hover,
.purpose-card:focus-visible {
  transform: translate(-2px, -2px);
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

.purpose-card.is-active {
  background: #f8ddc6;
  box-shadow: 6px 6px 0 rgba(201, 94, 59, 0.28);
}

.purpose-card__number {
  display: inline-block;
  margin-bottom: 18px;
  color: var(--brick);
  font-family: var(--mono);
}

.purpose-card h3 {
  margin: 0;
  font-family: var(--serif);
  font-size: 1.45rem;
}

.purpose-card p {
  margin: 10px 0 0;
  line-height: 1.5;
}

.prompt-panel {
  margin-top: 14px;
  overflow: hidden;
}

.prompt-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 2px solid var(--line);
  background: var(--ink);
  color: var(--paper-light);
  padding: 12px;
  font-family: var(--mono);
}

[data-copy-button] {
  border: 2px solid var(--paper-light);
  background: var(--brick);
  color: var(--paper-light);
  cursor: pointer;
  padding: 8px 12px;
}

[data-copy-button]:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

[data-copy-button].is-copied {
  background: var(--green);
}

[data-prompt-preview] {
  max-height: 440px;
  margin: 0;
  overflow: auto;
  background: var(--ink);
  color: var(--paper-light);
  padding: 18px;
  white-space: pre-wrap;
  font-family: var(--mono);
  font-size: 0.9rem;
  line-height: 1.65;
}

.copy-feedback {
  min-height: 1.4em;
  margin: 0;
  padding: 10px 12px;
  color: var(--green);
  font-family: var(--mono);
  font-size: 0.85rem;
}

.contact-block {
  margin-top: 22px;
  padding: 18px;
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.contact-links span,
.contact-links a {
  border: 1px solid var(--line);
  background: var(--paper);
  padding: 8px 10px;
  font-family: var(--mono);
  font-size: 0.85rem;
  text-decoration: none;
}

@media (max-width: 760px) {
  .page-shell {
    width: min(100% - 20px, 680px);
    padding-top: 10px;
  }

  .status-bar,
  .prompt-panel__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero,
  .context-grid,
  .purpose-list {
    grid-template-columns: 1fr;
  }

  h1 {
    max-width: 9ch;
  }

  [data-copy-button] {
    width: 100%;
  }
}
```

- [ ] **Step 4: Run all Node tests**

Run:

```bash
node --test tests/*.test.js
```

Expected: PASS, all tests passing.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add styles.css tests/static-files.test.js
git commit -m "feat: add pixel paper styling"
```

Expected: commit succeeds.

## Task 4: Purpose Card Rendering and Clipboard Interaction

**Files:**
- Modify: `tests/static-files.test.js`
- Create: `app.js`

- [ ] **Step 1: Extend static tests for app interaction hooks**

Replace `tests/static-files.test.js` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('index.html contains the approved page structure', () => {
  const html = read('index.html');

  assert.match(html, /CONNECTIVE \/ PERSONAL CARD/);
  assert.match(html, /张三，不是一个微信二维码/);
  assert.match(html, /data-purpose-list/);
  assert.match(html, /data-prompt-preview/);
  assert.match(html, /data-copy-button/);
  assert.match(html, /认识我/);
  assert.match(html, /聊一篇文章 \/ 一个观点/);
  assert.match(html, /一起做点事/);
});

test('index.html loads data before app script', () => {
  const html = read('index.html');
  const dataIndex = html.indexOf('data.js');
  const appIndex = html.indexOf('app.js');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > -1);
  assert.ok(dataIndex < appIndex);
});

test('styles.css defines Pixel Paper tokens and responsive rules', () => {
  const css = read('styles.css');

  assert.match(css, /--paper/);
  assert.match(css, /--ink/);
  assert.match(css, /--brick/);
  assert.match(css, /\.purpose-card/);
  assert.match(css, /\.purpose-card\.is-active/);
  assert.match(css, /@media \(max-width: 760px\)/);
});

test('app.js wires purpose rendering, prompt preview, and copy behavior', () => {
  const app = read('app.js');

  assert.match(app, /ConnectiveData/);
  assert.match(app, /renderPurposeCards/);
  assert.match(app, /updatePromptPreview/);
  assert.match(app, /copyActivePrompt/);
  assert.match(app, /navigator\.clipboard\.writeText/);
  assert.match(app, /document\.execCommand\('copy'\)/);
});
```

- [ ] **Step 2: Run static tests and verify app test fails**

Run:

```bash
node --test tests/static-files.test.js
```

Expected: FAIL because `app.js` does not exist.

- [ ] **Step 3: Create the app interaction script**

Create `app.js`:

```js
(function () {
  const data = window.ConnectiveData;
  const purposeList = document.querySelector('[data-purpose-list]');
  const promptPreview = document.querySelector('[data-prompt-preview]');
  const activePurposeLabel = document.querySelector('[data-active-purpose-label]');
  const copyButton = document.querySelector('[data-copy-button]');
  const copyFeedback = document.querySelector('[data-copy-feedback]');

  let activePurposeId = data.defaultPurposeId;

  function getPurposeCards() {
    return Array.from(document.querySelectorAll('[data-purpose-card]'));
  }

  function renderPurposeCards() {
    purposeList.innerHTML = '';

    Object.values(data.purposes).forEach((purpose) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'purpose-card';
      button.dataset.purposeCard = purpose.id;
      button.setAttribute('aria-pressed', String(purpose.id === activePurposeId));
      button.innerHTML = `
        <span class="purpose-card__number">${purpose.number}</span>
        <h3>${purpose.label}</h3>
        <p>${purpose.shortDescription}</p>
      `;
      button.addEventListener('click', () => {
        activePurposeId = purpose.id;
        updatePromptPreview();
      });
      purposeList.appendChild(button);
    });
  }

  function updatePromptPreview() {
    const purpose = data.getPurpose(activePurposeId);
    const prompt = data.buildPrompt(activePurposeId);

    activePurposeLabel.textContent = purpose.label;
    promptPreview.textContent = prompt;

    getPurposeCards().forEach((card) => {
      const isActive = card.dataset.purposeCard === activePurposeId;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-pressed', String(isActive));
    });
  }

  async function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async function copyActivePrompt() {
    const prompt = data.buildPrompt(activePurposeId);

    try {
      await writeClipboard(prompt);
      copyButton.classList.add('is-copied');
      copyButton.textContent = '已复制';
      copyFeedback.textContent = 'Prompt 已复制。现在可以粘贴到你的 AI 助手里。';

      window.setTimeout(() => {
        copyButton.classList.remove('is-copied');
        copyButton.textContent = '复制 Prompt';
        copyFeedback.textContent = '';
      }, 1800);
    } catch (error) {
      copyFeedback.textContent = '复制失败，请手动选中 Prompt 文本。';
    }
  }

  copyButton.addEventListener('click', copyActivePrompt);
  renderPurposeCards();
  updatePromptPreview();
})();
```

- [ ] **Step 4: Run all Node tests**

Run:

```bash
node --test tests/*.test.js
```

Expected: PASS, all tests passing.

- [ ] **Step 5: Run local browser smoke check**

Run:

```bash
python3 -m http.server 4173
```

Expected: server prints `Serving HTTP on :: port 4173` or `Serving HTTP on 0.0.0.0 port 4173`.

Open `http://127.0.0.1:4173/` in a browser and verify:

- The `认识我` card is active on load.
- Clicking `聊一篇文章 / 一个观点` changes the prompt preview.
- Clicking `一起做点事` changes the prompt preview.
- Clicking `复制 Prompt` changes the button to `已复制`.

Stop the server with `Ctrl+C`.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add app.js tests/static-files.test.js
git commit -m "feat: add prompt card interactions"
```

Expected: commit succeeds.

## Task 5: README and Final Verification

**Files:**
- Create: `README.md`
- Modify: `tests/static-files.test.js`

- [ ] **Step 1: Extend static tests for README and local run instructions**

Replace `tests/static-files.test.js` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('index.html contains the approved page structure', () => {
  const html = read('index.html');

  assert.match(html, /CONNECTIVE \/ PERSONAL CARD/);
  assert.match(html, /张三，不是一个微信二维码/);
  assert.match(html, /data-purpose-list/);
  assert.match(html, /data-prompt-preview/);
  assert.match(html, /data-copy-button/);
  assert.match(html, /认识我/);
  assert.match(html, /聊一篇文章 \/ 一个观点/);
  assert.match(html, /一起做点事/);
});

test('index.html loads data before app script', () => {
  const html = read('index.html');
  const dataIndex = html.indexOf('data.js');
  const appIndex = html.indexOf('app.js');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > -1);
  assert.ok(dataIndex < appIndex);
});

test('styles.css defines Pixel Paper tokens and responsive rules', () => {
  const css = read('styles.css');

  assert.match(css, /--paper/);
  assert.match(css, /--ink/);
  assert.match(css, /--brick/);
  assert.match(css, /\.purpose-card/);
  assert.match(css, /\.purpose-card\.is-active/);
  assert.match(css, /@media \(max-width: 760px\)/);
});

test('app.js wires purpose rendering, prompt preview, and copy behavior', () => {
  const app = read('app.js');

  assert.match(app, /ConnectiveData/);
  assert.match(app, /renderPurposeCards/);
  assert.match(app, /updatePromptPreview/);
  assert.match(app, /copyActivePrompt/);
  assert.match(app, /navigator\.clipboard\.writeText/);
  assert.match(app, /document\.execCommand\('copy'\)/);
});

test('README documents the static MVP workflow', () => {
  const readme = read('README.md');

  assert.match(readme, /Connective/);
  assert.match(readme, /python3 -m http\.server 4173/);
  assert.match(readme, /node --test tests\/\*\.test\.js/);
  assert.match(readme, /三张目的卡片/);
});
```

- [ ] **Step 2: Run static tests and verify README test fails**

Run:

```bash
node --test tests/static-files.test.js
```

Expected: FAIL because `README.md` does not exist.

- [ ] **Step 3: Create README**

Create `README.md`:

```markdown
# Connective

Connective is a Pixel Paper personal homepage for purposeful first contact.

It helps a visitor do one small thing before contacting Alex Zhang: choose why they want to talk, copy a purpose-specific prompt, and let their own AI assistant help write a clearer first message.

## MVP Loop

1. Read the personal context.
2. Choose one of 三张目的卡片:
   - 认识我
   - 聊一篇文章 / 一个观点
   - 一起做点事
3. Preview the generated prompt.
4. Click `复制 Prompt`.
5. Paste the prompt into an AI assistant.

## Run Locally

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

## Test

```bash
node --test tests/*.test.js
```

## Files

- `index.html` - semantic single-page homepage.
- `styles.css` - Pixel Paper visual system and responsive layout.
- `data.js` - profile context, purpose cards, and prompt generation.
- `app.js` - purpose selection, prompt preview, and clipboard copy behavior.
- `tests/` - Node built-in tests for data and static file structure.
```

- [ ] **Step 4: Run all tests**

Run:

```bash
node --test tests/*.test.js
```

Expected: PASS, all tests passing.

- [ ] **Step 5: Verify static server responses**

Run:

```bash
python3 -m http.server 4173
```

In a second terminal, run:

```bash
curl -I http://127.0.0.1:4173/
curl -I http://127.0.0.1:4173/styles.css
curl -I http://127.0.0.1:4173/data.js
curl -I http://127.0.0.1:4173/app.js
```

Expected: each command returns `HTTP/1.0 200 OK` or `HTTP/1.1 200 OK`.

Stop the server with `Ctrl+C`.

- [ ] **Step 6: Commit Task 5**

Run:

```bash
git add README.md tests/static-files.test.js
git commit -m "docs: add connective mvp README"
```

Expected: commit succeeds.

## Final Verification

- [ ] **Step 1: Run all automated tests**

Run:

```bash
node --test tests/*.test.js
```

Expected: PASS, all tests passing.

- [ ] **Step 2: Confirm final git status**

Run:

```bash
git status --short
```

Expected: no output.

- [ ] **Step 3: Confirm recent commits**

Run:

```bash
git log --oneline -5
```

Expected: the log includes these task commits:

```text
docs: add connective mvp README
feat: add prompt card interactions
feat: add pixel paper styling
feat: add semantic homepage shell
feat: add prompt data module
```

## Self-Review

Spec coverage:

- Product intent: implemented by single-page loop in `index.html`, `data.js`, and `app.js`.
- Audience and positioning: implemented by hero copy and profile context in `index.html` and `data.js`.
- Three purpose cards: implemented by `purposes` in `data.js` and rendered by `app.js`.
- Prompt preview and copy button: implemented by `app.js`.
- Pixel Paper visual direction: implemented by `styles.css`.
- Static technical scope: implemented with static files and no backend.
- Non-goals: no AI API, no forms, no storage, no CMS, no analytics.
- Acceptance criteria: covered by Node tests, local server checks, and manual browser smoke checks.

- Placeholder scan:

- No task leaves unresolved markers, dangling template variables, or fake API integrations.
- Prompt template variables are resolved inside `buildPrompt`.

Type and name consistency:

- Purpose ids are `meet`, `thought`, and `create` everywhere.
- Default purpose id is `meet`.
- Browser data namespace is `window.ConnectiveData`.
- Test import namespace is `require('../data.js')`.
