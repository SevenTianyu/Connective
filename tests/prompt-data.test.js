const test = require('node:test');
const assert = require('node:assert/strict');

const connective = require('../data.js');

test('exports exactly three purpose cards with meet as default', () => {
  assert.equal(connective.defaultPurposeId, 'meet');
  assert.deepEqual(Object.keys(connective.purposes), ['meet', 'thought', 'create']);
});

test('profile context contains the approved personal positioning', () => {
  assert.match(connective.profileContext, /田宇/);
  assert.match(connective.profileContext, /写作/);
  assert.match(connective.profileContext, /个人连接/);
  assert.match(connective.profileContext, /AI/);
});

test('buildPrompt includes selected purpose, profile context, and guardrails', () => {
  const prompt = connective.buildPrompt('thought');

  assert.match(prompt, /聊一篇文章 \/ 一个观点/);
  assert.match(prompt, /田宇的个人上下文/);
  assert.match(prompt, /不要假装我已经和田宇很熟/);
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
