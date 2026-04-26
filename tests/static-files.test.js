const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('index.html contains the approved page structure', () => {
  const html = read('index.html');

  assert.match(html, /CONNECTIVE \/ PERSONAL CARD/);
  assert.match(html, /田宇，不是一个微信二维码/);
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

test('index.html declares an inline SVG favicon', () => {
  const html = read('index.html');

  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml,/);
});

test('referenced static assets exist', () => {
  assert.ok(fs.existsSync('data.js'));
  assert.ok(fs.existsSync('styles.css'));
  assert.ok(fs.existsSync('app.js'));
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

test('app.js hardens missing runtime, fallback copy, and copied state', () => {
  const app = read('app.js');

  assert.match(app, /if \(!data\)/);
  assert.match(app, /requiredNodes/);
  assert.match(app, /requiredNodes\.some/);
  assert.match(app, /finally/);
  assert.match(app, /throw new Error\('Fallback copy failed'\)/);
  assert.match(app, /copyResetTimeout/);
  assert.match(app, /window\.clearTimeout/);
  assert.match(app, /resetCopiedState/);
});

test('README documents the static MVP workflow', () => {
  const readme = read('README.md');

  assert.match(readme, /Connective/);
  assert.match(readme, /python3 -m http\.server 4173/);
  assert.match(readme, /node --test tests\/\*\.test\.js/);
  assert.match(readme, /三张目的卡片/);
});
