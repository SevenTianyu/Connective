# Connective

**A prompt-native personal homepage for better first messages.**

[中文说明](#中文说明) · [Configure](#configure-your-profile) · [Deploy](#deploy) · [Claude Code deployment prompt](#claude-code-deployment-prompt) · [Codex deployment prompt](#codex-deployment-prompt)

![Connective homepage preview](public/readme/homepage-preview.png)

![Pixel prompt bridge illustration](public/readme/prompt-bridge-pixel.svg)

Connective is a Pixel Paper static site for personal connection. A visitor reads a compact personal card, chooses an intent, copies a context-rich prompt, and gives it to their own AI assistant to write a clearer first message.

The demo persona is fictional: 张三 / Alex Zhang.

## What It Does

The page keeps one lightweight loop:

1. Read the personal context.
2. Choose from 三张目的卡片: get to know me, discuss an essay or idea, collaborate on something.
3. Preview the generated prompt.
4. Switch between Chinese and English.
5. Copy the prompt, or copy it and open Gemini, ChatGPT, DeepSeek, or Grok.
6. Paste it into an AI assistant before contacting the person.

## Run Locally

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

Run tests:

```bash
node --test tests/*.test.js
```

## Configure Your Profile

There are two ways to customize the site.

### Option A: Terminal Wizard

Run the zero-dependency setup script:

```bash
node scripts/configure-profile.mjs
```

The wizard asks for the minimum useful profile details:

- Chinese and English names
- One-line positioning
- Interest words for the visual lockup
- Three context cards
- Public contact routes
- Optional advanced edits for hero copy, purpose cards, prompt guardrails, and full prompt context

It writes:

- `data.js`, used directly by the static page
- `profile.local.json`, your local editable profile file

`profile.local.json` is ignored by Git by default so you can keep private drafts local.

### Option B: Structured Form

Copy the example form:

```bash
cp profile.example.json profile.local.json
```

Edit `profile.local.json`, then generate the site data:

```bash
node scripts/configure-profile.mjs --input profile.local.json --output data.js --save profile.local.json --yes
```

The form covers identity, hero copy, interest words, context cards, purpose cards, contact copy, bilingual profile context, and prompt guardrails.

## Deploy

Connective is a static site. It does not need a build step.

### GitHub Pages

Recommended default.

1. Push this repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set `Build and deployment` to `GitHub Actions`.
4. Push to `main`, or run the `Deploy static site to Pages` workflow manually.

The included `.github/workflows/pages.yml` publishes the repository root as the site.

### Vercel

Import the repository and use:

- Framework preset: `Other`
- Build command: leave empty
- Output directory: `.`

### Netlify

Create a new site from Git and use:

- Build command: leave empty
- Publish directory: `.`

### Cloudflare Pages

Connect the repository and use:

- Framework preset: `None`
- Build command: leave empty
- Output directory: `.`

## Claude Code Deployment Prompt

Copy this into Claude Code:

```text
You are helping me deploy a customized Connective personal homepage.

Repository: <paste the Connective repository URL here>

Please do the following step by step:
1. Clone the repository and inspect README.md, profile.example.json, data.js, and scripts/configure-profile.mjs.
2. Ask me for the personal information needed to replace the demo profile. Ask in small groups: names, one-line positioning, interests, context cards, purpose-card wording, prompt context, contact routes, and preferred deployment platform.
3. Do not invent personal experiences, contact details, credentials, or public claims. If I only provide Chinese content, draft the English version and ask me to confirm it.
4. Write the confirmed information into profile.local.json.
5. Run: node scripts/configure-profile.mjs --input profile.local.json --output data.js --save profile.local.json --yes
6. Run: node --test tests/*.test.js
7. Start a local preview with: python3 -m http.server 4173
8. Show me the local URL and summarize exactly what personal information will be public.
9. Ask for my confirmation before deploying.
10. After I confirm, deploy to my chosen static hosting target. Prefer GitHub Pages unless I choose another platform.
```

## Codex Deployment Prompt

Copy this into Codex:

```text
Implement a customized deployment of Connective.

Repository: <paste the Connective repository URL here>

Work as an implementation agent:
1. Clone the repo, inspect the current static app, and read README.md plus profile.example.json.
2. Interview me interactively for the profile content: bilingual name, one-line positioning, interest words, three context cards, three intent cards, contact routes, and deployment target.
3. Keep privacy boundaries explicit. Do not fabricate personal facts. Do not publish phone numbers, emails, social links, or other personal data until I confirm the final public summary.
4. Create or update profile.local.json from my answers.
5. Generate data.js with:
   node scripts/configure-profile.mjs --input profile.local.json --output data.js --save profile.local.json --yes
6. Run:
   node --test tests/*.test.js
7. Preview locally:
   python3 -m http.server 4173
8. Verify Chinese/English switching, prompt preview, and copy/open behavior in a browser.
9. Summarize changed files and the final public profile content.
10. Ask for my explicit confirmation before pushing or deploying. If I confirm, deploy through GitHub Pages by default, or through Vercel, Netlify, or Cloudflare Pages if I choose one.
```

## File Overview

- `index.html` defines the static page structure.
- `styles.css` defines the Pixel Paper visual system.
- `data.js` contains the active bilingual profile and prompt data.
- `profile.example.json` is the structured customization form.
- `scripts/configure-profile.mjs` turns a profile JSON file into `data.js`.
- `public/readme/` contains README visuals.
- `tests/` covers prompt data, static files, and profile generation.

---

## 中文说明

Connective 是一个以 Prompt 为核心的个人主页模板。它不是普通名片页，而是帮助访问者先理解你，再根据联系目的复制一段上下文 Prompt，交给自己的 AI 助手生成更自然、更清楚的第一句话。

### 快速运行

```bash
python3 -m http.server 4173
```

打开：

```text
http://localhost:4173
```

测试：

```bash
node --test tests/*.test.js
```

### 修改成你自己的信息

最简单的方式是运行终端向导：

```bash
node scripts/configure-profile.mjs
```

它会逐项询问你的中英文姓名、一句话定位、关心内容、三张上下文卡片、联系方式和可选高级文案。填写完成后会自动更新 `data.js`，同时保存 `profile.local.json`。

如果你更喜欢表单式编辑：

```bash
cp profile.example.json profile.local.json
node scripts/configure-profile.mjs --input profile.local.json --output data.js --save profile.local.json --yes
```

### 部署

默认推荐 GitHub Pages。这个项目没有构建步骤，推到 GitHub 后在 `Settings -> Pages` 里选择 GitHub Actions 即可。也可以部署到 Vercel、Netlify 或 Cloudflare Pages，构建命令留空，输出目录填项目根目录。

### 对话型部署

如果你想让 Claude Code 或 Codex 帮你完成，可以直接复制上面的 `Claude Code deployment prompt` 或 `Codex deployment prompt`。它们会引导代理拉取代码、询问你的个人信息、生成 `data.js`、运行测试、本地预览，并在你确认公开信息后再部署。
