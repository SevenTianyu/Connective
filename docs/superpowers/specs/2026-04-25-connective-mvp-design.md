# Connective v0 MVP Design

## 1. Product Intent

Connective is a personal homepage for purposeful first contact.

The page should not simply ask visitors to add a WeChat account or send a cold message. It should help them understand the person behind the page, choose why they want to make contact, and copy a prompt into their own AI assistant so the first message becomes clearer, more natural, and less awkward.

The first version is a static, lightweight MVP. It proves one loop:

1. A visitor understands who Tianyu is.
2. The visitor chooses a contact purpose.
3. The page shows a purpose-specific prompt.
4. The visitor copies the prompt.
5. The visitor uses their own AI assistant to write a better opening message.

## 2. Audience

The page is for people who already have some reason to be curious about Tianyu but may not know how to start a conversation.

Primary visitor situations:

- They want to know Tianyu as a person.
- They have read something Tianyu wrote and want to discuss a thought or article.
- They want to explore a collaboration, interview, project, or opportunity.

The page should make these visitors more intentional before they contact Tianyu.

## 3. Positioning

The selected first-version identity direction is:

**Personal connection / writing / thinker**

This means the page should not lead with a resume-like career pitch or a tool-like AI interface. AI is present as a medium for better first words, but the core signal is human presence, writing, thinking, and real connection.

Working statement:

> Tianyu is not a WeChat QR code. This page helps you understand why you want to talk, then gives your AI assistant enough context to help you write the first message.

The v0 homepage should use this stance directly: personal, direct, and not sales-like.

## 4. MVP Structure

The MVP is a single-page static site.

### 4.1 Header / Status Bar

Purpose:

- Establish the page as a designed personal object.
- Give the Pixel Paper interface a clear frame.

Content:

- Small label such as `CONNECTIVE / PERSONAL CARD`.
- Small status marker such as `OPEN`, `READY`, or `AVAILABLE FOR REAL CONVERSATION`.

Behavior:

- No navigation is required in v0.
- External links appear in the contact block near the end of the page.

### 4.2 Hero / Identity

Purpose:

- Make the page feel like a personal homepage before it feels like a tool.
- Explain the core action in one sentence.

Content fields:

- Name.
- One-line identity.
- Short page purpose statement.

v0 hero copy:

- `田宇，不是一个微信二维码`
- `如果你想认识我、聊一个观点，或者一起做点事，可以先让你的 AI 助手帮你组织第一句话。`

The hero must communicate that the page helps visitors contact Tianyu with clearer intention.

### 4.3 Personal Context

Purpose:

- Give visitors enough context to decide whether and why to contact Tianyu.
- Feed the copied prompt with useful personal information.

Required content fields:

- `名字 / 一句话定位`
- `我关心什么`
- `你可以找我聊什么`
- `一些真实痕迹`
- `联系方式`

The content should not read like a full resume. It should feel like a compact personal dossier: enough to understand the person, not enough to become a biography.

### 4.4 Purpose Cards

Purpose:

- Force a small but useful moment of intention before copying the prompt.
- Keep the experience simple: choose one reason, preview one prompt, copy.

The MVP has exactly three purpose cards:

1. `认识我`
   - For visitors who want a natural, low-pressure opening.
2. `聊一篇文章 / 一个观点`
   - For visitors who read or heard something and want to continue the thought.
3. `一起做点事`
   - For collaboration, interviews, projects, opportunities, or other concrete asks.

Behavior:

- One card is active at a time.
- The active card changes the prompt preview.
- The `认识我` card is selected on page load.

### 4.5 Prompt Preview

Purpose:

- Show the visitor what will be copied.
- Make the page feel transparent, not magical.

Behavior:

- The prompt preview updates when the active purpose card changes.
- The preview shows the full active prompt.
- The preview should be readable on desktop and mobile.

### 4.6 Copy Button

Purpose:

- Complete the core loop.

Behavior:

- Copies the full active prompt to the clipboard.
- Shows a clear copied state after success.
- Falls back to a textarea-based copy method if the modern clipboard API is unavailable.

Button label:

- `复制 Prompt`

### 4.7 Contact Links

Purpose:

- Give visitors a way to contact Tianyu after they have formed a clearer opening.

Content:

- WeChat.
- Email.
- GitHub.
- Blog, newsletter, public account, or other writing channel.

Placement:

- Contact links should not dominate the first screen.
- They appear as a compact block near the end. On wider screens, the same block is visually aligned as a side rail while remaining after the main prompt flow in reading order.

## 5. Prompt Behavior

The site does not call an AI model in v0. It copies a prompt for the visitor to paste into their own assistant.

All copied prompts must include:

1. The visitor's selected purpose.
2. Tianyu's personal context.
3. Instructions for the AI assistant to write a first message.
4. Constraints that prevent overly familiar, vague, or sales-like output.

All prompt variants should ask for:

- A natural first message.
- A one-sentence self-introduction for the visitor.
- A clear but non-invasive contact intention.
- Three tone options: relaxed, sincere, and direct.
- Avoidance of fake familiarity, empty flattery, and business cliches.

### 5.1 Base Prompt Template

```text
你是我的私人沟通助手。

我准备联系田宇。下面是田宇本人提供的个人上下文。

我的联系目的：
{{PURPOSE}}

请基于这个目的和下面的个人上下文，帮我生成：

1. 一段自然、不油腻的第一句话
2. 一句我可以用来介绍自己的话
3. 一个明确但不冒犯的联系意图
4. 三个语气版本：轻松、真诚、直接

要求：

- 不要假装我已经和田宇很熟
- 不要写商业套话
- 不要过度夸张或过度热情
- 不要替我编造经历
- 如果我的目的还不清楚，先向我追问 2-3 个问题
- 输出要适合发在微信、邮件或私信里

田宇的个人上下文：
{{PROFILE_CONTEXT}}
```

### 5.2 Purpose-Specific Additions

`认识我` should add:

```text
这个场景偏向自然破冰。请让开场白像一个真实的人想认识另一个真实的人，而不是社交模板。
```

`聊一篇文章 / 一个观点` should add:

```text
这个场景偏向围绕一篇文章、一个观点或一次表达继续交流。请先提醒我补充：我读到的内容是什么、哪个观点触发了我、我想继续讨论什么。
```

`一起做点事` should add:

```text
这个场景偏向合作、访谈、项目或机会。请先帮助我说清楚：我想做什么、我能提供什么、我希望田宇怎么回应。
```

## 6. Visual Direction

The approved visual direction is **Pixel Paper**.

The page should feel like a warm, editorial personal card with pixel-based interface details. It should not feel like a game UI, a cyberpunk terminal, or an artist portfolio clone.

Visual principles:

- Paper-like warmth first, pixel details second.
- Hard edges instead of soft rounded cards.
- Compact personal blocks instead of large decorative sections.
- Editorial hierarchy instead of dashboard density.
- Designed, but not flashy.

Suggested palette:

- Background: warm paper / off-white.
- Text: dark ink.
- Accent 1: brick red.
- Accent 2: muted green.
- Accent 3: dark gold.
- Interface marks: black or deep brown borders.

Typography:

- Title can use a more editorial serif or display face.
- Body text must be highly readable.
- Monospace should be reserved for status bars, labels, numbering, and prompt preview.

Pixel treatments:

- Hard borders.
- Square status marks.
- Numbered chips.
- Low-resolution icon feel.
- Simple stamp-like blocks.

Avoid:

- Full-game aesthetics.
- Neon cyberpunk styling.
- Excessive animation.
- Generic portfolio grids.
- Art-student imitation of the Hyacinth reference.

## 7. Technical Scope

The first version should be static and dependency-light.

Recommended implementation:

- `index.html`
- `styles.css`
- `app.js`
- Optional `README.md`

The page should work by opening a local static server and should be deployable to GitHub Pages or any static host.

No backend is required.

## 8. Explicit Non-Goals

v0 does not include:

- Calling an AI API.
- In-page AI generation.
- Visitor accounts.
- Visitor data storage.
- Forms that collect visitor identity.
- Blog CMS.
- Multi-page portfolio.
- Automatic social media scraping.
- Analytics.
- Complex animation.
- Resume-style career timeline.

These are outside v0 and should only be reconsidered after the first static loop proves useful.

## 9. Acceptance Criteria

The MVP is successful when:

1. Opening the page feels like a complete personal homepage, not a bare utility.
2. A visitor can understand within 10 seconds that the page helps them contact Tianyu with clearer intention.
3. The three purpose cards are visible and understandable.
4. Selecting each card updates the prompt preview.
5. The copy button copies the complete active prompt.
6. The copied prompt contains the selected purpose and personal context.
7. The page is readable and usable on desktop and mobile.
8. The visual result feels like Pixel Paper: warm, editorial, hard-edged, and not childish.
9. The implementation stays static and lightweight.

## 10. Implementation Notes

The implementation should keep content and prompt data easy to edit. A simple JavaScript object is enough for v0:

- `profileContext`
- `purposes`
- `promptTemplates`

The copy action should use `navigator.clipboard.writeText` first and a textarea fallback second.

The first implementation should prioritize a working static loop over a perfect content management structure.
