const defaultPurposeId = 'meet';
const defaultLanguage = 'zh';

const languages = {
  zh: {
    code: 'zh',
    htmlLang: 'zh-CN',
    title: 'Connective | 张三',
    metaDescription: 'Connective 帮助访问者复制 Prompt，并用自己的 AI 助手写出更清楚的第一句话。',
    switchLabel: 'EN',
    switchAriaLabel: 'Switch to English',
    status: {
      title: 'CONNECTIVE / PERSONAL CARD',
    },
    hero: {
      eyebrow: 'PROMPT / INTENT / CONNECTION',
      title: '让连接从更好的第一句话开始',
      lede: '选择一个联系目的，复制一段上下文 Prompt，交给你常用的大模型，让它帮你把开场白说清楚。',
    },
    profile: {
      ariaLabel: '个人状态',
      status: '关心的内容',
      interestAriaLabel: '张三关心的内容',
      interests: [
        { text: 'AI时代的表达', slot: 'primary' },
        { text: '写作', slot: 'writing' },
        { text: '个人连接', slot: 'connection' },
        { text: 'Agent', slot: 'agent' },
        { text: '长期关系', slot: 'longterm' },
        { text: '真实合作', slot: 'collaboration' },
        { text: '产品判断', slot: 'product' },
        { text: '意图表达', slot: 'intent' },
        { text: '组织观察', slot: 'organization' },
      ],
    },
    contextAriaLabel: '个人上下文',
    contextCards: [
      {
        title: '张三关心什么',
        body: 'AI 时代的表达、写作、个人连接、Agent、长期关系，以及技术如何帮助人更准确地说出自己的意图。',
      },
      {
        title: '你可以找他聊什么',
        body: '一个真实的认识、一篇文章里的判断、一个还没完全成形但值得一起推演的想法。',
      },
      {
        title: '一些虚构痕迹',
        body: '张三长期写关于 AI、产品、组织和个人判断的长文，也关注 Agent、数据、评估和真实产品落地之间的关系。',
      },
    ],
    workbench: {
      eyebrow: 'CHOOSE YOUR INTENT',
      title: '你想怎样开口？',
      previewLabel: 'Prompt 预览',
    },
    dialog: {
      closeLabel: '关闭 Prompt 窗口',
      eyebrow: 'HAND OFF PROMPT',
      title: '把 Prompt 交给你的 AI 助手',
      description: '点一个平台，会先复制 Prompt，再打开对应助手。也可以只复制。',
      purposePrefix: '当前目的：',
      platformLabel: '大语言模型平台',
      manualCopyLabel: 'Prompt 手动复制文本',
    },
    contact: {
      ariaLabel: '联系方式',
      eyebrow: 'CONTACT',
      body: '先复制 Prompt，让你的 AI 助手帮你整理第一句话。然后通过你已有的渠道联系张三。',
      links: {
        wechat: 'WeChat',
        email: 'Email',
        github: 'GitHub',
        writing: 'Writing',
      },
    },
    ui: {
      openPromptButton: '打开 Prompt',
      copyOnlyButton: '只复制 Prompt',
      copiedButton: '已复制',
      copyAndOpenLabel: '复制并打开',
      modelAriaLabel: (modelName) => `打开 ${modelName}`,
      copiedOpening: (modelName) => `Prompt 已复制，正在打开 ${modelName}。`,
      copiedManualOpen: (modelName) => `Prompt 已复制。请再次点击 ${modelName} 打开。`,
      copyBlockedOpen: (modelName) =>
        `浏览器不允许自动复制，Prompt 已选中。请按 Command+C / Ctrl+C 复制，再打开 ${modelName}。`,
      copiedPrompt: 'Prompt 已复制。现在可以粘贴到你选择的大模型里。',
      copyBlockedOnly: '浏览器不允许自动复制，Prompt 已选中。请按 Command+C / Ctrl+C 复制。',
    },
    profileContext: `# 张三 / Alex Zhang

## 一句话定位
张三，一个把写作、AI 和真实连接放在一起思考的虚构人物。

## 他关心什么
- 个人连接如何在 AI 时代变得更真诚，而不是更机械。
- 写作如何帮助一个人整理判断、经验和关系。
- AI Agent 如何成为人的表达外骨骼，而不是替代人的意图。
- 长期关系、真实合作、可以沉淀下来的对话。

## 你可以找他聊什么
- 认识他：如果你只是想认识一个具体的人，而不是交换名片。
- 聊一篇文章 / 一个观点：如果你读到某个观点，想继续推演、反驳或补充。
- 一起做点事：如果你有合作、访谈、项目、机会，或者只是一个还没有成形的想法。

## 一些虚构痕迹
- 他长期写关于 AI、产品、组织和个人判断的长文。
- 他关注 Agent、数据、评估和真实产品落地之间的关系。
- 他更在意一个人为什么开口，而不只是他通过什么渠道联系。
- 他希望技术帮助人更准确地表达自己，而不是制造更多模板化寒暄。

## 联系方式
- 微信：请先用复制出来的 Prompt 写好第一句话，再通过你已有的渠道联系他。
- GitHub：alex-zhang-lab
- 写作入口：一个公开笔记和文章入口，作为主要阅读路径。`,
    purposes: {
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
        addition:
          '这个场景偏向围绕一篇文章、一个观点或一次表达继续交流。请先提醒我补充：我读到的内容是什么、哪个观点触发了我、我想继续讨论什么。',
      },
      create: {
        id: 'create',
        number: '03',
        label: '一起做点事',
        shortDescription: '合作、访谈、项目、机会。',
        purposeText: '一起做点事',
        addition:
          '这个场景偏向合作、访谈、项目或机会。请先帮助我说清楚：我想做什么、我能提供什么、我希望张三怎么回应。',
      },
    },
  },
  en: {
    code: 'en',
    htmlLang: 'en',
    title: 'Connective | Alex Zhang',
    metaDescription:
      'Connective helps visitors copy a context prompt and use their own AI assistant to write a clearer first message.',
    switchLabel: '中文',
    switchAriaLabel: '切换到中文',
    status: {
      title: 'CONNECTIVE / PERSONAL CARD',
    },
    hero: {
      eyebrow: 'PROMPT / INTENT / CONNECTION',
      title: 'Start with a clearer first message',
      lede: 'Choose why you want to reach out, copy a context prompt, and let your usual AI assistant help shape the opening line.',
    },
    profile: {
      ariaLabel: 'Profile status',
      status: 'WHAT ALEX CARES ABOUT',
      interestAriaLabel: 'What Alex Zhang cares about',
      interests: [
        { text: 'AI EXPRESSION', slot: 'primary' },
        { text: 'WRITING', slot: 'writing' },
        { text: 'PERSONAL CONNECTION', slot: 'connection' },
        { text: 'AGENTS', slot: 'agent' },
        { text: 'LONG-TERM RELATIONSHIPS', slot: 'longterm' },
        { text: 'REAL COLLABORATION', slot: 'collaboration' },
        { text: 'PRODUCT JUDGMENT', slot: 'product' },
        { text: 'INTENT', slot: 'intent' },
        { text: 'ORGANIZATION', slot: 'organization' },
      ],
    },
    contextAriaLabel: 'Personal context',
    contextCards: [
      {
        title: 'What Alex cares about',
        body: 'Expression in the AI era, writing, personal connection, agents, long-term relationships, and tools that help people state intent more clearly.',
      },
      {
        title: 'What to ask him about',
        body: 'A genuine introduction, a judgment from an essay, or an unfinished idea that might be worth thinking through together.',
      },
      {
        title: 'Fictional traces',
        body: 'Alex writes about AI, products, organizations, and personal judgment, with a focus on agents, data, evaluation, and real product delivery.',
      },
    ],
    workbench: {
      eyebrow: 'CHOOSE YOUR INTENT',
      title: 'How do you want to begin?',
      previewLabel: 'Prompt preview',
    },
    dialog: {
      closeLabel: 'Close prompt window',
      eyebrow: 'HAND OFF PROMPT',
      title: 'Give the prompt to your AI assistant',
      description: 'Pick a platform to copy the prompt first, then open the assistant. You can also copy only.',
      purposePrefix: 'Current intent: ',
      platformLabel: 'Large language model platforms',
      manualCopyLabel: 'Prompt text for manual copy',
    },
    contact: {
      ariaLabel: 'Contact',
      eyebrow: 'CONTACT',
      body: 'Copy the prompt first, let your AI assistant organize the first message, then contact Alex through a channel you already have.',
      links: {
        wechat: 'WeChat',
        email: 'Email',
        github: 'GitHub',
        writing: 'Writing',
      },
    },
    ui: {
      openPromptButton: 'Open Prompt',
      copyOnlyButton: 'Copy Prompt Only',
      copiedButton: 'Copied',
      copyAndOpenLabel: 'Copy and open',
      modelAriaLabel: (modelName) => `Open ${modelName}`,
      copiedOpening: (modelName) => `Prompt copied. Opening ${modelName}.`,
      copiedManualOpen: (modelName) => `Prompt copied. Click ${modelName} again to open it.`,
      copyBlockedOpen: (modelName) =>
        `The browser blocked automatic copy. The prompt is selected. Press Command+C / Ctrl+C, then open ${modelName}.`,
      copiedPrompt: 'Prompt copied. You can now paste it into the model you choose.',
      copyBlockedOnly: 'The browser blocked automatic copy. The prompt is selected. Press Command+C / Ctrl+C.',
    },
    profileContext: `# Alex Zhang / 张三

## One-line positioning
Alex Zhang is a fictional writer and product thinker who studies writing, AI, and genuine connection together.

## What he cares about
- How personal connection can become more sincere in the AI era, not more mechanical.
- How writing helps people organize judgment, experience, and relationships.
- How AI agents can become an expression exoskeleton for human intent instead of replacing it.
- Long-term relationships, real collaboration, and conversations that can accumulate over time.

## What you can ask him about
- Get to know him: when you want to meet a specific person, not just exchange contact cards.
- Discuss an essay or idea: when a point made you want to extend, challenge, or add to it.
- Collaborate on something: when you have a project, interview, opportunity, or unfinished idea.

## Fictional traces
- He regularly writes long essays about AI, products, organizations, and personal judgment.
- He follows the relationship between agents, data, evaluation, and real product delivery.
- He cares more about why someone reaches out than which channel they use.
- He wants technology to help people express themselves more accurately, not create more templated small talk.

## Contact
- WeChat: use the copied prompt to write the first message, then contact him through a channel you already have.
- GitHub: alex-zhang-lab
- Writing: a public notebook and essay archive as the main reading path.`,
    purposes: {
      meet: {
        id: 'meet',
        number: '01',
        label: 'Get to know me',
        shortDescription: 'Write a natural icebreaker.',
        purposeText: 'Get to know me',
        addition:
          'This scenario is about a natural icebreaker. Make the opening feel like one real person trying to meet another real person, not a social template.',
      },
      thought: {
        id: 'thought',
        number: '02',
        label: 'Discuss an essay / idea',
        shortDescription: 'Start a conversation around writing and thinking.',
        purposeText: 'Discuss an essay / idea',
        addition:
          'This scenario is about continuing a conversation around an essay, an idea, or a piece of expression. First remind me to clarify: what I read, which point triggered me, and what I want to discuss next.',
      },
      create: {
        id: 'create',
        number: '03',
        label: 'Collaborate on something',
        shortDescription: 'Collaboration, interview, project, opportunity.',
        purposeText: 'Collaborate on something',
        addition:
          'This scenario is about collaboration, an interview, a project, or an opportunity. First help me clarify: what I want to do, what I can offer, and how I hope Alex responds.',
      },
    },
  },
};

function getLanguage(language = defaultLanguage) {
  return languages[language] || languages[defaultLanguage];
}

function getPurpose(purposeId, language = defaultLanguage) {
  const languageData = getLanguage(language);

  return languageData.purposes[purposeId] || languageData.purposes[defaultPurposeId];
}

function buildPrompt(purposeId, language = defaultLanguage) {
  const languageData = getLanguage(language);
  const purpose = getPurpose(purposeId, language);

  if (languageData.code === 'en') {
    return `You are my private communication assistant.

I am preparing to contact Alex Zhang. Below is the personal context provided by Alex.

My contact intent:
${purpose.purposeText}

${purpose.addition}

Based on this intent and the personal context below, help me generate:

1. A natural first line that does not feel greasy or overdone
2. One sentence I can use to introduce myself
3. A clear but non-intrusive contact intent
4. Three tone options: casual, sincere, direct

Requirements:

- Do not pretend I already know Alex well
- Do not write corporate boilerplate
- Do not exaggerate or sound overly enthusiastic
- Do not invent experiences for me
- If my intent is still unclear, ask me 2-3 follow-up questions first
- The output should work for WeChat, email, or direct messages

Alex Zhang's personal context:
${languageData.profileContext}`;
  }

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
${languageData.profileContext}`;
}

const ConnectiveData = {
  defaultPurposeId,
  defaultLanguage,
  languages,
  profileContext: languages[defaultLanguage].profileContext,
  purposes: languages[defaultLanguage].purposes,
  getLanguage,
  getPurpose,
  buildPrompt,
};

if (typeof module !== 'undefined') {
  module.exports = ConnectiveData;
}

if (typeof window !== 'undefined') {
  window.ConnectiveData = ConnectiveData;
}
