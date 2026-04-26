(function () {
  const data = window.ConnectiveData;

  if (!data) {
    return;
  }

  const purposeList = document.querySelector('[data-purpose-list]');
  const promptPreview = document.querySelector('[data-prompt-preview]');
  const activePurposeLabel = document.querySelector('[data-active-purpose-label]');
  const copyButton = document.querySelector('[data-copy-button]');
  const copyFeedback = document.querySelector('[data-copy-feedback]');
  const requiredNodes = [
    purposeList,
    promptPreview,
    activePurposeLabel,
    copyButton,
    copyFeedback,
  ];

  if (requiredNodes.some((node) => !node)) {
    return;
  }

  let activePurposeId = data.defaultPurposeId;
  let copyResetTimeout;

  function getPurposeCards() {
    return Array.from(document.querySelectorAll('[data-purpose-card]'));
  }

  function resetCopiedState() {
    if (copyResetTimeout) {
      window.clearTimeout(copyResetTimeout);
      copyResetTimeout = undefined;
    }

    copyButton.classList.remove('is-copied');
    copyButton.textContent = '复制 Prompt';
    copyFeedback.textContent = '';
  }

  function renderPurposeCards() {
    purposeList.innerHTML = '';

    Object.values(data.purposes).forEach((purpose) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'purpose-card';
      button.dataset.purposeCard = purpose.id;
      button.setAttribute('aria-pressed', String(purpose.id === activePurposeId));
      button.innerHTML = `
        <span class="purpose-card__number">${purpose.number}</span>
        <h3>${purpose.label}</h3>
        <p>${purpose.shortDescription}</p>
      `;
      button.addEventListener('click', () => {
        activePurposeId = purpose.id;
        resetCopiedState();
        updatePromptPreview();
      });
      purposeList.appendChild(button);
    });
  }

  function updatePromptPreview() {
    const purpose = data.getPurpose(activePurposeId);
    const prompt = data.buildPrompt(activePurposeId);

    activePurposeLabel.textContent = purpose.label;
    promptPreview.textContent = prompt;

    getPurposeCards().forEach((card) => {
      const isActive = card.dataset.purposeCard === activePurposeId;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-pressed', String(isActive));
    });
  }

  async function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');

    try {
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      const didCopy = document.execCommand('copy');

      if (!didCopy) {
        throw new Error('Fallback copy failed');
      }
    } finally {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  }

  async function copyActivePrompt() {
    const prompt = data.buildPrompt(activePurposeId);

    try {
      await writeClipboard(prompt);
      resetCopiedState();
      copyButton.classList.add('is-copied');
      copyButton.textContent = '已复制';
      copyFeedback.textContent = 'Prompt 已复制。现在可以粘贴到你的 AI 助手里。';

      copyResetTimeout = window.setTimeout(() => {
        resetCopiedState();
      }, 1800);
    } catch (error) {
      resetCopiedState();
      copyFeedback.textContent = '复制失败，请手动选中 Prompt 文本。';
    }
  }

  copyButton.addEventListener('click', copyActivePrompt);
  renderPurposeCards();
  updatePromptPreview();
})();
