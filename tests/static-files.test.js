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
