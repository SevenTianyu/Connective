const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('configure-profile renders a loadable data module from structured profile JSON', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'connective-profile-'));
  const dataOutput = path.join(tempDir, 'data.js');
  const savedProfile = path.join(tempDir, 'profile.local.json');
  const fixture = path.join(__dirname, 'fixtures/profile.full.json');

  const result = spawnSync(
    process.execPath,
    [
      'scripts/configure-profile.mjs',
      '--input',
      fixture,
      '--output',
      dataOutput,
      '--save',
      savedProfile,
      '--yes',
    ],
    { cwd: path.join(__dirname, '..'), encoding: 'utf8' },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(fs.existsSync(dataOutput));
  assert.ok(fs.existsSync(savedProfile));

  delete require.cache[dataOutput];
  const generated = require(dataOutput);
  const zhPrompt = generated.buildPrompt('create', 'zh');
  const enPrompt = generated.buildPrompt('thought', 'en');

  assert.equal(generated.defaultLanguage, 'zh');
  assert.equal(generated.getLanguage('zh').profile.interests[0].text, '城市里的真实连接');
  assert.match(zhPrompt, /林微/);
  assert.match(zhPrompt, /城市研究/);
  assert.match(zhPrompt, /lin-wei-lab/);
  assert.match(enPrompt, /Lin Wei/);
  assert.match(enPrompt, /urban systems/);
  assert.match(enPrompt, /lin@example.com/);
});
