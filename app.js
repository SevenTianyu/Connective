(function () {
  const data = window.ConnectiveData;
  const purposeList = document.querySelector('[data-purpose-list]');
  const promptPreview = document.querySelector('[data-prompt-preview]');
  const activePurposeLabel = document.querySelector('[data-active-purpose-label]');
  const copyButton = document.querySelector('[data-copy-button]');
  const copyFeedback = document.querySelector('[data-copy-feedback]');

  let activePurposeId = data.defaultPurposeId;

  function getPurposeCards() {
    return Array.from(document.querySelectorAll('[data-purpose-card]'));
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
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async function copyActivePrompt() {
    const prompt = data.buildPrompt(activePurposeId);

    try {
      await writeClipboard(prompt);
      copyButton.classList.add('is-copied');
      copyButton.textContent = '已复制';
      copyFeedback.textContent = 'Prompt 已复制。现在可以粘贴到你的 AI 助手里。';

      window.setTimeout(() => {
        copyButton.classList.remove('is-copied');
        copyButton.textContent = '复制 Prompt';
        copyFeedback.textContent = '';
      }, 1800);
    } catch (error) {
      copyFeedback.textContent = '复制失败，请手动选中 Prompt 文本。';
    }
  }

  copyButton.addEventListener('click', copyActivePrompt);
  renderPurposeCards();
  updatePromptPreview();
})();
