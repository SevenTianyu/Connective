const profileContext = `# 田宇 / Tianyu

## 一句话定位
田宇，一个把写作、AI 和真实连接放在一起思考的人。

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
- GitHub：SevenTianyu
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
    addition: '这个场景偏向合作、访谈、项目或机会。请先帮助我说清楚：我想做什么、我能提供什么、我希望田宇怎么回应。',
  },
};

function getPurpose(purposeId) {
  return purposes[purposeId] || purposes[defaultPurposeId];
}

function buildPrompt(purposeId) {
  const purpose = getPurpose(purposeId);

  return `你是我的私人沟通助手。

我准备联系田宇。下面是田宇本人提供的个人上下文。

我的联系目的：
${purpose.purposeText}

${purpose.addition}

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
