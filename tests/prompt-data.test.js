const test = require('node:test');
const assert = require('node:assert/strict');

const connective = require('../data.js');

const forbiddenRealInfo = [
  ['田', '宇'].join(''),
  ['Tian', 'yu'].join(''),
  ['Seven', 'Tian', 'yu'].join(''),
];

function assertNoRealUserInfo(text) {
  forbiddenRealInfo.forEach((item) => {
    assert.equal(text.includes(item), false);
  });
}

test('exports bilingual purpose cards with meet as default', () => {
  assert.equal(connective.defaultPurposeId, 'meet');
  assert.equal(connective.defaultLanguage, 'zh');
  assert.deepEqual(Object.keys(connective.languages), ['zh', 'en']);
  assert.deepEqual(Object.keys(connective.getLanguage('zh').purposes), ['meet', 'thought', 'create']);
  assert.deepEqual(Object.keys(connective.getLanguage('en').purposes), ['meet', 'thought', 'create']);
});

test('profile context uses a fictional bilingual persona', () => {
  const zh = connective.getLanguage('zh').profileContext;
  const en = connective.getLanguage('en').profileContext;

  assert.match(zh, /张三/);
  assert.match(zh, /Alex Zhang/);
  assert.match(zh, /写作/);
  assert.match(zh, /个人连接/);
  assert.match(en, /Alex Zhang/);
  assert.match(en, /writing/);
  assert.match(en, /personal connection/);
  assertNoRealUserInfo(`${zh}\n${en}`);
});

test('profile card exposes bilingual interest lockup words', () => {
  const zhProfile = connective.getLanguage('zh').profile;
  const enProfile = connective.getLanguage('en').profile;

  assert.match(zhProfile.status, /关心/);
  assert.match(enProfile.status, /CARES/);
  assert.ok(zhProfile.interests.length >= 8);
  assert.ok(enProfile.interests.length >= 8);
  assert.deepEqual(
    zhProfile.interests.map((item) => item.slot),
    enProfile.interests.map((item) => item.slot),
  );
  assert.ok(zhProfile.interests.some((item) => item.text === '个人连接'));
  assert.ok(enProfile.interests.some((item) => item.text === 'PERSONAL CONNECTION'));
});

test('buildPrompt includes selected purpose, profile context, and guardrails in Chinese', () => {
  const prompt = connective.buildPrompt('thought', 'zh');

  assert.match(prompt, /聊一篇文章 \/ 一个观点/);
  assert.match(prompt, /张三的个人上下文/);
  assert.match(prompt, /不要假装我已经和张三很熟/);
  assert.match(prompt, /不要写商业套话/);
  assert.match(prompt, /我读到的内容是什么/);
  assert.doesNotMatch(prompt, /\{\{PURPOSE\}\}/);
  assert.doesNotMatch(prompt, /\{\{PROFILE_CONTEXT\}\}/);
  assertNoRealUserInfo(prompt);
});

test('buildPrompt switches the generated prompt to English', () => {
  const prompt = connective.buildPrompt('create', 'en');

  assert.match(prompt, /You are my private communication assistant/);
  assert.match(prompt, /I am preparing to contact Alex Zhang/);
  assert.match(prompt, /My contact intent:/);
  assert.match(prompt, /Collaborate on something/);
  assert.match(prompt, /Alex Zhang's personal context/);
  assert.match(prompt, /Do not pretend I already know Alex well/);
  assert.match(prompt, /Do not invent experiences for me/);
  assert.doesNotMatch(prompt, /你是我的私人沟通助手/);
  assertNoRealUserInfo(prompt);
});

test('buildPrompt falls back to default purpose for unknown ids', () => {
  const prompt = connective.buildPrompt('unknown-id', 'en');

  assert.match(prompt, /Get to know me/);
  assert.match(prompt, /natural icebreaker/);
});
