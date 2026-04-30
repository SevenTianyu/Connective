const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const publicFiles = ['index.html', 'data.js', 'app.js', 'README.md', 'README.zh-CN.md'];
const publicRepositoryUrl = 'https://github.com/SevenTianyu/Connective';
const forbiddenRealInfo = [
  ['田', '宇'].join(''),
  ['Tian', 'yu'].join(''),
  ['Seven', 'Tian', 'yu'].join(''),
];

test('index.html contains the approved page structure', () => {
  const html = read('index.html');

  assert.match(html, /CONNECTIVE \/ PERSONAL CARD/);
  assert.match(html, /让连接从更好的第一句话开始/);
  assert.match(html, /data-language-toggle/);
  assert.match(html, /data-interest-lockup/);
  assert.doesNotMatch(html, /AVAILABLE FOR REAL CONVERSATION/);
  assert.doesNotMatch(html, /data-status-pill/);
  assert.doesNotMatch(html, />OPEN</);
  assert.match(html, /data-purpose-list/);
  assert.match(html, /data-prompt-preview/);
  assert.match(html, /data-copy-button/);
  assert.match(html, /data-prompt-dialog/);
  assert.match(html, /data-platform-links/);
  assert.match(html, /data-dialog-copy-button/);
  assert.match(html, /data-dialog-manual-copy/);
  assert.match(html, /点一个平台，会先复制 Prompt，再打开对应助手/);
  assert.match(html, /只复制 Prompt/);
  assert.match(html, /认识我/);
  assert.match(html, /聊一篇文章 \/ 一个观点/);
  assert.match(html, /一起做点事/);
});

test('public source files use fictional profile information only', () => {
  const publicSource = publicFiles
    .map((file) => read(file))
    .join('\n')
    .replaceAll(publicRepositoryUrl, '');

  assert.match(publicSource, /张三/);
  assert.match(publicSource, /Alex Zhang/);
  forbiddenRealInfo.forEach((item) => {
    assert.equal(publicSource.includes(item), false);
  });
});

test('index.html footer exposes all required contact labels', () => {
  const html = read('index.html');

  assert.match(html, />WeChat</);
  assert.match(html, />Email</);
  assert.match(html, />GitHub</);
  assert.match(html, />Writing</);
});

test('index.html loads data before app script', () => {
  const html = read('index.html');
  const dataIndex = html.indexOf('data.js');
  const appIndex = html.indexOf('app.js');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > -1);
  assert.ok(dataIndex < appIndex);
});

test('index.html declares an inline SVG favicon', () => {
  const html = read('index.html');

  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml,/);
});

test('referenced static assets exist', () => {
  assert.ok(fs.existsSync('data.js'));
  assert.ok(fs.existsSync('styles.css'));
  assert.ok(fs.existsSync('app.js'));
  assert.ok(fs.existsSync('profile.example.json'));
  assert.ok(fs.existsSync('scripts/configure-profile.mjs'));
  assert.ok(fs.existsSync('public/readme/homepage-preview.png'));
  assert.ok(fs.existsSync('public/readme/homepage-preview-en.png'));
  assert.ok(fs.existsSync('public/readme/homepage-preview-zh.png'));
  assert.ok(fs.existsSync('public/readme/prompt-bridge-pixel.svg'));
  assert.ok(fs.existsSync('.github/workflows/pages.yml'));
});

test('styles.css defines Pixel Paper tokens and responsive rules', () => {
  const css = read('styles.css');

  assert.match(css, /--paper/);
  assert.match(css, /--ink/);
  assert.match(css, /--brick/);
  assert.match(css, /\.purpose-card/);
  assert.match(css, /\.purpose-card\.is-active/);
  assert.match(css, /\.interest-lockup/);
  assert.match(css, /\.interest-word--primary/);
  assert.match(css, /writing-mode: vertical-rl/);
  assert.match(css, /\[data-language="en"\] \.interest-word--connection/);
  assert.doesNotMatch(css, /\.status-pill/);
  assert.match(css, /width: min\(560px, calc\(100% - 32px\)\)/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /\[data-dialog-copy-button\][\s\S]*width: 100%/);
  assert.match(css, /@media \(max-width: 760px\)/);
});

test('styles.css keeps the hero and interest lockup compact across widths', () => {
  const css = read('styles.css');

  assert.match(css, /\.hero\s*{[\s\S]*--hero-card-height:/);
  assert.match(css, /\.hero-copy,[\s\S]*\.profile-card\s*{[\s\S]*min-height: var\(--hero-card-height\)/);
  assert.match(css, /\.profile-card\s*{[\s\S]*container-type: inline-size/);
  assert.match(css, /\.interest-word--primary\s*{[\s\S]*cqw/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.hero\s*{[\s\S]*--hero-card-height: auto/);
  assert.match(
    css,
    /@media \(max-width: 760px\)[\s\S]*\.interest-lockup\s*{[\s\S]*grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/
  );
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.interest-lockup\s*{[\s\S]*flex: 1 1 214px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.interest-lockup\s*{[\s\S]*align-content: stretch/);
  assert.match(
    css,
    /@media \(max-width: 760px\)[\s\S]*\.interest-lockup\[data-language="en"\]\s*{[\s\S]*min-height: clamp\(190px, 28vw, 220px\)/
  );
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.interest-word--primary\s*{[\s\S]*grid-column: 1 \/ 5/);
});

test('styles.css keeps the language switcher stable in the status bar', () => {
  const css = read('styles.css');

  assert.match(css, /\.status-bar\s*{[\s\S]*min-height: 52px/);
  assert.match(css, /\[data-status-title\]\s*{[\s\S]*white-space: nowrap/);
  assert.match(css, /\.status-actions\s*{[\s\S]*flex: 0 0 auto/);
  assert.match(css, /\.language-toggle\s*{[\s\S]*width: 56px[\s\S]*height: 34px/);
  assert.match(css, /\.language-toggle\s*{[\s\S]*display: grid[\s\S]*place-items: center/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.status-bar\s*{[\s\S]*flex-direction: row/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.status-actions\s*{[\s\S]*width: auto/);
  assert.doesNotMatch(
    css,
    /@media \(max-width: 760px\)[\s\S]*\.status-bar,\s*\.prompt-panel__header\s*{[\s\S]*flex-direction: column/
  );
});

test('styles.css exposes adaptive type variables for language and viewport balancing', () => {
  const css = read('styles.css');

  assert.match(css, /--hero-title-min/);
  assert.match(css, /--hero-title-fluid/);
  assert.match(css, /--hero-title-max/);
  assert.match(css, /font-size: clamp\(var\(--hero-title-min\), var\(--hero-title-fluid\), var\(--hero-title-max\)\)/);
  assert.match(css, /\[data-language="en"\]\s*{[\s\S]*--hero-title-max:/);
  assert.match(css, /\[data-viewport-profile="narrow"\]\s*{[\s\S]*--hero-title-max:/);
  assert.match(css, /\.is-measuring-layout \.page-shell\s*{[\s\S]*visibility: hidden/);
});

test('app.js wires purpose rendering, prompt preview, and copy behavior', () => {
  const app = read('app.js');

  assert.match(app, /ConnectiveData/);
  assert.match(app, /activeLanguage/);
  assert.match(app, /data-language-toggle/);
  assert.match(app, /data-interest-lockup/);
  assert.match(app, /renderProfileInterests/);
  assert.doesNotMatch(app, /statusPill/);
  assert.doesNotMatch(app, /data-status-pill/);
  assert.match(app, /renderLocalizedText/);
  assert.match(app, /document\.documentElement\.lang/);
  assert.match(app, /renderPurposeCards/);
  assert.match(app, /updatePromptPreview/);
  assert.match(app, /openPromptDialog/);
  assert.match(app, /copyActivePrompt/);
  assert.match(app, /navigator\.clipboard\.writeText/);
  assert.match(app, /document\.execCommand\('copy'\)/);
});

test('app.js balances module heights across languages and viewport widths', () => {
  const app = read('app.js');

  assert.match(app, /stableLayoutGroups/);
  assert.match(app, /getStableLayoutGroups/);
  assert.match(app, /heroCopy/);
  assert.match(app, /profileCard/);
  assert.match(app, /getViewportProfile/);
  assert.match(app, /applyAdaptiveType/);
  assert.match(app, /resetStableLayout/);
  assert.match(app, /measureLanguageLayout/);
  assert.match(app, /applyStableLayout/);
  assert.match(app, /scheduleStableLayout/);
  assert.match(app, /Object\.keys\(data\.languages\)/);
  assert.match(app, /document\.documentElement\.dataset\.language/);
  assert.match(app, /document\.documentElement\.dataset\.viewportProfile/);
  assert.match(app, /document\.documentElement\.classList\.add\('is-measuring-layout'\)/);
  assert.match(app, /element\.style\.minHeight = `\$\{height\}px`/);
  assert.match(app, /window\.addEventListener\('resize', scheduleStableLayout\)/);
});

test('app.js exposes model destination buttons for prompt handoff', () => {
  const app = read('app.js');

  assert.match(app, /modelLinks/);
  assert.match(app, /logoSvg/);
  assert.match(app, /model-logo__svg/);
  assert.match(app, /copyPromptAndOpenModel/);
  assert.match(app, /data-model-link/);
  assert.match(app, /event\.preventDefault\(\)/);
  assert.match(app, /window\.open\('', '_blank'\)/);
  assert.match(app, /destinationWindow\.opener = null/);
  assert.match(app, /destinationWindow\.location\.href = model\.href/);
  assert.match(app, /Gemini/);
  assert.match(app, /ChatGPT/);
  assert.match(app, /DeepSeek/);
  assert.match(app, /Grok/);
  assert.match(app, /title>OpenAI<\/title/);
  assert.match(app, /title>DeepSeek<\/title/);
  assert.match(app, /title>Grok<\/title/);
  assert.doesNotMatch(app, /logo: 'GPT'/);
  assert.doesNotMatch(app, /logo: 'DS'/);
  assert.doesNotMatch(app, /logo: 'xAI'/);
  assert.match(app, /https:\/\/gemini\.google\.com\/app/);
  assert.match(app, /https:\/\/chatgpt\.com/);
  assert.match(app, /https:\/\/chat\.deepseek\.com/);
  assert.match(app, /https:\/\/grok\.com/);
});

test('app.js renders purpose cards with phrasing content inside buttons', () => {
  const app = read('app.js');

  assert.match(app, /data\.getLanguage\(activeLanguage\)\.purposes/);
  assert.match(app, /<strong>\$\{purpose\.label\}<\/strong>/);
  assert.match(app, /<span>\$\{purpose\.shortDescription\}<\/span>/);
  assert.doesNotMatch(app, /<h3>/);
  assert.doesNotMatch(app, /<p>/);
});

test('app.js hardens missing runtime, fallback copy, and copied state', () => {
  const app = read('app.js');
  const appAndData = `${app}\n${read('data.js')}`;

  assert.match(app, /if \(!data\)/);
  assert.match(app, /requiredNodes/);
  assert.match(app, /requiredNodes\.some/);
  assert.match(app, /finally/);
  assert.match(app, /throw new Error\('Fallback copy failed'\)/);
  assert.match(app, /selectPromptPreviewText/);
  assert.match(app, /dialogManualCopy\.select/);
  assert.match(app, /dialogManualCopy\.setSelectionRange/);
  assert.match(appAndData, /Command\+C \/ Ctrl\+C/);
  assert.match(app, /copyResetTimeout/);
  assert.match(app, /window\.clearTimeout/);
  assert.match(app, /resetCopiedState/);
});

test('README documents the static MVP workflow', () => {
  const readme = read('README.md');
  const zhReadme = read('README.zh-CN.md');

  assert.match(readme, /Connective/);
  assert.match(readme, /\[中文说明\]\(README\.zh-CN\.md\)/);
  assert.match(readme, /^!\[Connective prompt bridge illustration\]\(public\/readme\/prompt-bridge-pixel\.svg\)/);
  assert.match(readme, /public\/readme\/homepage-preview-en\.png/);
  assert.match(readme, /public\/readme\/prompt-bridge-pixel\.svg/);
  assert.match(readme, /profile\.example\.json/);
  assert.match(readme, /scripts\/configure-profile\.mjs/);
  assert.match(readme, /python3 -m http\.server 4173/);
  assert.match(readme, /node --test tests\/\*\.test\.js/);
  assert.match(readme, /GitHub Pages/);
  assert.match(readme, /Vercel/);
  assert.match(readme, /Netlify/);
  assert.match(readme, /Cloudflare Pages/);
  assert.match(readme, /Claude Code Deployment Prompt/);
  assert.match(readme, /Codex Deployment Prompt/);
  assert.match(readme, new RegExp(`Repository: ${publicRepositoryUrl.replaceAll('/', '\\/')}`));
  assert.match(readme, /three intent cards/);
  assert.doesNotMatch(readme, /<paste the Connective repository URL here>/);
  assert.doesNotMatch(readme, /public\/readme\/homepage-preview-zh\.png/);

  assert.match(zhReadme, /Connective \/ 接点/);
  assert.match(zhReadme, /\[English README\]\(README\.md\)/);
  assert.match(zhReadme, /^!\[Connective Prompt 桥接宣传图\]\(public\/readme\/prompt-bridge-pixel\.svg\)/);
  assert.match(zhReadme, /public\/readme\/homepage-preview-zh\.png/);
  assert.match(zhReadme, /profile\.example\.json/);
  assert.match(zhReadme, /scripts\/configure-profile\.mjs/);
  assert.match(zhReadme, /python3 -m http\.server 4173/);
  assert.match(zhReadme, /node --test tests\/\*\.test\.js/);
  assert.match(zhReadme, /GitHub Pages/);
  assert.match(zhReadme, /Vercel/);
  assert.match(zhReadme, /Netlify/);
  assert.match(zhReadme, /Cloudflare Pages/);
  assert.match(zhReadme, /Claude Code 部署提示词/);
  assert.match(zhReadme, /Codex 部署提示词/);
  assert.match(zhReadme, new RegExp(`仓库：${publicRepositoryUrl.replaceAll('/', '\\/')}`));
  assert.match(zhReadme, /三张目的卡片/);
  assert.doesNotMatch(zhReadme, /<在这里粘贴 Connective 仓库 URL>/);
  assert.doesNotMatch(zhReadme, /public\/readme\/homepage-preview-en\.png/);
});

test('profile customization files are documented and local profile is ignored', () => {
  const example = read('profile.example.json');
  const gitignore = read('.gitignore');
  const workflow = read('.github/workflows/pages.yml');
  const promoSvg = read('public/readme/prompt-bridge-pixel.svg');

  assert.doesNotThrow(() => JSON.parse(example));
  assert.match(example, /"languages"/);
  assert.match(example, /"profileContext"/);
  assert.match(example, /"interests"/);
  assert.match(example, /"purposes"/);
  assert.match(gitignore, /profile\.local\.json/);
  assert.match(workflow, /pages/);
  assert.match(workflow, /upload-pages-artifact/);
  assert.doesNotMatch(promoSvg, /<text\b/i);
});
