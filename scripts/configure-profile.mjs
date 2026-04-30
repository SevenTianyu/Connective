#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const interestSlots = [
  'primary',
  'writing',
  'connection',
  'agent',
  'longterm',
  'collaboration',
  'product',
  'intent',
  'organization',
];

function parseArgs(argv) {
  const args = {
    input: undefined,
    output: path.join(projectRoot, 'data.js'),
    save: path.join(projectRoot, 'profile.local.json'),
    yes: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (item === '--yes') {
      args.yes = true;
      continue;
    }

    if (item === '--input' || item === '--output' || item === '--save') {
      args[item.slice(2)] = path.resolve(projectRoot, argv[index + 1]);
      index += 1;
      continue;
    }

    if (item === '--help') {
      args.help = true;
    }
  }

  return args;
}

function usage() {
  return `Usage:
  node scripts/configure-profile.mjs
  node scripts/configure-profile.mjs --input profile.example.json --output data.js --save profile.local.json --yes

Options:
  --input <path>   Read a structured profile JSON file.
  --output <path>  Write the generated data.js file. Default: data.js
  --save <path>    Save the edited profile JSON. Default: profile.local.json
  --yes            Non-interactive mode for scripts and tests.
`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function loadProfile(inputPath) {
  if (inputPath) {
    return readJson(inputPath);
  }

  const localPath = path.join(projectRoot, 'profile.local.json');
  const examplePath = path.join(projectRoot, 'profile.example.json');
  return readJson((await exists(localPath)) ? localPath : examplePath);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getByPath(object, dottedPath) {
  return dottedPath.split('.').reduce((current, key) => (current ? current[key] : undefined), object);
}

function setByPath(object, dottedPath, value) {
  const parts = dottedPath.split('.');
  const last = parts.pop();
  const target = parts.reduce((current, key) => {
    current[key] ||= {};
    return current[key];
  }, object);
  target[last] = value;
}

function splitList(value) {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setInterests(languageData, words) {
  const fallback = languageData.profile.interests || [];
  languageData.profile.interests = interestSlots.map((slot, index) => ({
    slot,
    text: words[index] || fallback[index]?.text || slot,
  }));
}

function updateDerivedFields(profile) {
  Object.values(profile.languages).forEach((languageData) => {
    const personName = languageData.person?.name;

    if (personName) {
      languageData.title = `Connective | ${personName}`;
    }
  });
}

async function askText(rl, label, currentValue) {
  const suffix = currentValue ? ` [${currentValue}]` : '';
  const answer = await rl.question(`${label}${suffix}: `);
  return answer.trim() || currentValue;
}

async function askBoolean(rl, label, defaultValue = false) {
  const suffix = defaultValue ? 'Y/n' : 'y/N';
  const answer = (await rl.question(`${label} (${suffix}): `)).trim().toLowerCase();

  if (!answer) {
    return defaultValue;
  }

  return answer === 'y' || answer === 'yes';
}

async function runQuickWizard(profile, rl) {
  const zh = profile.languages.zh;
  const en = profile.languages.en;

  zh.person.name = await askText(rl, '中文姓名', zh.person.name);
  en.person.name = await askText(rl, 'English name', en.person.name);
  zh.person.fullName = `${zh.person.name} / ${en.person.name}`;
  en.person.fullName = `${en.person.name} / ${zh.person.name}`;
  zh.profile.interestAriaLabel = `${zh.person.name}关心的内容`;
  en.profile.interestAriaLabel = `What ${en.person.name} cares about`;

  const zhPosition = await askText(
    rl,
    '一句中文定位',
    `${zh.person.name}，一个把写作、AI 和真实连接放在一起思考的人。`,
  );
  const enPosition = await askText(
    rl,
    'One-line English positioning',
    `${en.person.name} studies writing, AI, and genuine connection together.`,
  );
  const zhInterests = splitList(
    await askText(
      rl,
      '9 个中文关心关键词，用逗号分隔',
      zh.profile.interests.map((item) => item.text).join('，'),
    ),
  );
  const enInterests = splitList(
    await askText(
      rl,
      '9 English interest words, comma-separated',
      en.profile.interests.map((item) => item.text).join(', '),
    ),
  );

  setInterests(zh, zhInterests);
  setInterests(en, enInterests);

  zh.contextCards[0].body = await askText(rl, '中文：你关心什么', zh.contextCards[0].body);
  en.contextCards[0].body = await askText(rl, 'English: what you care about', en.contextCards[0].body);
  zh.contextCards[1].body = await askText(rl, '中文：别人可以找你聊什么', zh.contextCards[1].body);
  en.contextCards[1].body = await askText(rl, 'English: what others can ask you about', en.contextCards[1].body);
  zh.contextCards[2].body = await askText(rl, '中文：公开痕迹或可信背景', zh.contextCards[2].body);
  en.contextCards[2].body = await askText(rl, 'English: public traces or credibility', en.contextCards[2].body);

  const email = await askText(rl, '公开 Email，可留空', zh.contact.links.email);
  const github = await askText(rl, 'GitHub handle or URL，可留空', zh.contact.links.github);
  const writing = await askText(rl, 'Writing link label or URL，可留空', zh.contact.links.writing);
  zh.contact.links.email = email;
  en.contact.links.email = email;
  zh.contact.links.github = github;
  en.contact.links.github = github;
  zh.contact.links.writing = writing;
  en.contact.links.writing = writing;
  zh.contact.body = `先复制 Prompt，让你的 AI 助手帮你整理第一句话。然后通过你已有的渠道联系${zh.person.name}。`;
  en.contact.body = `Copy the prompt first, let your AI assistant organize the first message, then contact ${en.person.name} through a channel you already have.`;

  zh.profileContext = `# ${zh.person.fullName}

## 一句话定位
${zhPosition}

## 关心什么
- ${zh.profile.interests.map((item) => item.text).join('、')}

## 可以找我聊什么
- ${zh.contextCards[1].body}

## 公开痕迹
- ${zh.contextCards[2].body}

## 联系方式
- Email：${email}
- GitHub：${github}
- Writing：${writing}`;

  en.profileContext = `# ${en.person.fullName}

## One-line positioning
${enPosition}

## What I care about
- ${en.profile.interests.map((item) => item.text).join(', ')}

## What you can ask me about
- ${en.contextCards[1].body}

## Public traces
- ${en.contextCards[2].body}

## Contact
- Email: ${email}
- GitHub: ${github}
- Writing: ${writing}`;

  if (!enPosition || enPosition === `${en.person.name} studies writing, AI, and genuine connection together.`) {
    console.log('English profile is still close to the demo. Review it before publishing.');
  }
}

async function runAdvancedWizard(profile, rl) {
  const fields = [
    ['languages.zh.hero.title', '中文 hero 标题'],
    ['languages.zh.hero.lede', '中文 hero 描述'],
    ['languages.en.hero.title', 'English hero title'],
    ['languages.en.hero.lede', 'English hero lede'],
    ['languages.zh.profile.status', '中文词云小标题'],
    ['languages.en.profile.status', 'English interest status'],
    ['languages.zh.purposes.meet.addition', '中文认识我 prompt guardrail'],
    ['languages.zh.purposes.thought.addition', '中文聊观点 prompt guardrail'],
    ['languages.zh.purposes.create.addition', '中文合作 prompt guardrail'],
    ['languages.en.purposes.meet.addition', 'English meet prompt guardrail'],
    ['languages.en.purposes.thought.addition', 'English thought prompt guardrail'],
    ['languages.en.purposes.create.addition', 'English create prompt guardrail'],
  ];

  for (const [fieldPath, label] of fields) {
    setByPath(profile, fieldPath, await askText(rl, label, getByPath(profile, fieldPath)));
  }

  const editContext = await askBoolean(rl, '是否编辑完整 profileContext？可用 \\n 表示换行', false);

  if (editContext) {
    setByPath(
      profile,
      'languages.zh.profileContext',
      (await askText(rl, '中文 profileContext', getByPath(profile, 'languages.zh.profileContext'))).replace(/\\n/g, '\n'),
    );
    setByPath(
      profile,
      'languages.en.profileContext',
      (await askText(rl, 'English profileContext', getByPath(profile, 'languages.en.profileContext'))).replace(/\\n/g, '\n'),
    );
  }
}

function jsString(value) {
  return JSON.stringify(value, null, 2);
}

function dataModuleSource(profile) {
  const normalized = clone(profile);
  updateDerivedFields(normalized);

  return `const defaultPurposeId = ${JSON.stringify(normalized.defaultPurposeId || 'meet')};
const defaultLanguage = ${JSON.stringify(normalized.defaultLanguage || 'zh')};

const languages = ${jsString(normalized.languages)};

function formatTemplate(template, values) {
  return String(template || '').replace(/\\{\\{(\\w+)\\}\\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match,
  );
}

function hydrateUiHelpers(languageData) {
  const ui = languageData.ui;
  const templates = { ...ui };

  ui.modelAriaLabel = (modelName) => formatTemplate(templates.modelAriaLabel, { modelName });
  ui.copiedOpening = (modelName) => formatTemplate(templates.copiedOpening, { modelName });
  ui.copiedManualOpen = (modelName) => formatTemplate(templates.copiedManualOpen, { modelName });
  ui.copyBlockedOpen = (modelName) => formatTemplate(templates.copyBlockedOpen, { modelName });
}

Object.values(languages).forEach(hydrateUiHelpers);

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
  const personName = languageData.person?.name || '';
  const prompt = languageData.prompt;
  const values = { personName };
  const tasks = prompt.tasks.map((item, index) => \`\${index + 1}. \${formatTemplate(item, values)}\`).join('\\n');
  const requirements = prompt.requirements.map((item) => \`- \${formatTemplate(item, values)}\`).join('\\n');

  return \`\${formatTemplate(prompt.assistantRole, values)}

\${formatTemplate(prompt.contextIntro, values)}

\${formatTemplate(prompt.intentLabel, values)}
\${purpose.purposeText}

\${purpose.addition}

\${formatTemplate(prompt.generationIntro, values)}

\${tasks}

\${formatTemplate(prompt.requirementsLabel, values)}

\${requirements}

\${formatTemplate(prompt.contextLabel, values)}
\${languageData.profileContext}\`;
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
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage());
    return;
  }

  const profile = await loadProfile(args.input);

  if (!args.yes) {
    const rl = createInterface({ input, output });

    try {
      console.log('Connective profile setup');
      console.log('Press Enter to keep the current value.');
      await runQuickWizard(profile, rl);

      if (await askBoolean(rl, 'Open advanced module editing', false)) {
        await runAdvancedWizard(profile, rl);
      }
    } finally {
      rl.close();
    }
  }

  updateDerivedFields(profile);
  await fs.mkdir(path.dirname(args.output), { recursive: true });
  await fs.mkdir(path.dirname(args.save), { recursive: true });
  await fs.writeFile(args.output, dataModuleSource(profile), 'utf8');
  await fs.writeFile(args.save, `${JSON.stringify(profile, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(projectRoot, args.output)}`);
  console.log(`Saved ${path.relative(projectRoot, args.save)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
