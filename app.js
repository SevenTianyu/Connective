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
  const promptDialog = document.querySelector('[data-prompt-dialog]');
  const platformLinks = document.querySelector('[data-platform-links]');
  const closeDialogButton = document.querySelector('[data-close-dialog]');
  const dialogCopyButton = document.querySelector('[data-dialog-copy-button]');
  const dialogCopyFeedback = document.querySelector('[data-dialog-copy-feedback]');
  const dialogPurposeLabel = document.querySelector('[data-dialog-purpose-label]');
  const dialogManualCopy = document.querySelector('[data-dialog-manual-copy]');
  const languageToggle = document.querySelector('[data-language-toggle]');
  const interestLockup = document.querySelector('[data-interest-lockup]');
  const metaDescription = document.querySelector('meta[name="description"]');
  const promptPanel = document.querySelector('[data-prompt-panel]');
  const profileCard = document.querySelector('[data-profile-card]');
  const contextGrid = document.querySelector('[data-context-grid]');
  const contactBlock = document.querySelector('[data-contact-block]');
  const localizedNodes = {
    statusTitle: document.querySelector('[data-status-title]'),
    heroEyebrow: document.querySelector('[data-hero-eyebrow]'),
    heroTitle: document.querySelector('[data-hero-title]'),
    heroLede: document.querySelector('[data-hero-lede]'),
    profileStatus: document.querySelector('[data-profile-status]'),
    contextTitles: Array.from(document.querySelectorAll('[data-context-title]')),
    contextBodies: Array.from(document.querySelectorAll('[data-context-body]')),
    workbenchEyebrow: document.querySelector('[data-workbench-eyebrow]'),
    workbenchTitle: document.querySelector('[data-workbench-title]'),
    dialogEyebrow: document.querySelector('[data-dialog-eyebrow]'),
    dialogTitle: document.querySelector('[data-dialog-title]'),
    dialogDescription: document.querySelector('[data-dialog-description]'),
    dialogPurposePrefix: document.querySelector('[data-dialog-purpose-prefix]'),
    contactEyebrow: document.querySelector('[data-contact-eyebrow]'),
    contactBody: document.querySelector('[data-contact-body]'),
    contactWechat: document.querySelector('[data-contact-link="wechat"]'),
    contactEmail: document.querySelector('[data-contact-link="email"]'),
    contactGithub: document.querySelector('[data-contact-link="github"]'),
    contactWriting: document.querySelector('[data-contact-link="writing"]'),
  };
  const requiredNodes = [
    purposeList,
    promptPreview,
    activePurposeLabel,
    copyButton,
    copyFeedback,
    promptDialog,
    platformLinks,
    closeDialogButton,
    dialogCopyButton,
    dialogCopyFeedback,
    dialogPurposeLabel,
    dialogManualCopy,
    languageToggle,
    interestLockup,
    promptPanel,
    profileCard,
    contextGrid,
    contactBlock,
    ...Object.values(localizedNodes).flat(),
  ];

  if (requiredNodes.some((node) => !node)) {
    return;
  }

  let activePurposeId = data.defaultPurposeId;
  let activeLanguage = data.defaultLanguage || 'zh';
  let copyResetTimeout;
  let stableLayoutTimeout;
  let isStabilizingLayout = false;
  const modelLinks = [
    {
      name: 'Gemini',
      href: 'https://gemini.google.com/app',
      logoSvg: `
        <svg class="model-logo__svg" role="img" viewBox="0 0 24 24" aria-label="Gemini logo">
          <title>Google Gemini</title>
          <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/>
        </svg>
      `,
      hint: 'Google',
    },
    {
      name: 'ChatGPT',
      href: 'https://chatgpt.com/',
      logoSvg: `
        <svg class="model-logo__svg" role="img" viewBox="0 0 24 24" aria-label="ChatGPT logo">
          <title>OpenAI</title>
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
        </svg>
      `,
      hint: 'OpenAI',
    },
    {
      name: 'DeepSeek',
      href: 'https://chat.deepseek.com/',
      logoSvg: `
        <svg class="model-logo__svg" role="img" viewBox="0 0 24 24" aria-label="DeepSeek logo">
          <title>DeepSeek</title>
          <path d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45"/>
        </svg>
      `,
      hint: 'DeepSeek',
    },
    {
      name: 'Grok',
      href: 'https://grok.com/',
      logoSvg: `
        <svg class="model-logo__svg model-logo__svg--wide" role="img" viewBox="0.36 0.5 33.33 32" aria-label="Grok logo">
          <title>Grok</title>
          <path d="M13.2371 21.0407 24.3186 12.8506C24.8619 12.4491 25.6384 12.6057 25.8973 13.2294 27.2597 16.5185 26.651 20.4712 23.9403 23.1851 21.2297 25.8989 17.4581 26.4941 14.0108 25.1386L10.2449 26.8843C15.6463 30.5806 22.2053 29.6665 26.304 25.5601 29.5551 22.3051 30.562 17.8683 29.6205 13.8673L29.629 13.8758C28.2637 7.99809 29.9647 5.64871 33.449 0.844576 33.5314 0.730667 33.6139 0.616757 33.6964 0.5L29.1113 5.09055V5.07631L13.2343 21.0436"/>
          <path d="M10.9503 23.0313C7.07343 19.3235 7.74185 13.5853 11.0498 10.2763 13.4959 7.82722 17.5036 6.82767 21.0021 8.2971L24.7595 6.55998C24.0826 6.07017 23.215 5.54334 22.2195 5.17313 17.7198 3.31926 12.3326 4.24192 8.67479 7.90126 5.15635 11.4239 4.0499 16.8403 5.94992 21.4622 7.36924 24.9165 5.04257 27.3598 2.69884 29.826 1.86829 30.7002 1.0349 31.5745.36364 32.5L10.9474 23.0341"/>
        </svg>
      `,
      hint: 'xAI',
    },
  ];
  const stableLayoutGroups = {
    shared: [
      { name: 'status', selectors: ['.status-bar'] },
      { name: 'contextCards', selectors: ['.context-grid article'] },
      { name: 'workbenchHeading', selectors: ['.section-heading'] },
      { name: 'purposeCards', selectors: ['[data-purpose-card]'] },
      { name: 'promptHeader', selectors: ['.prompt-panel__header'] },
      { name: 'promptPreview', selectors: ['[data-prompt-preview]'] },
      { name: 'contact', selectors: ['[data-contact-block]'] },
    ],
    wide: [{ name: 'hero', selectors: ['.hero-copy', '.profile-card'] }],
    narrow: [
      { name: 'heroCopy', selectors: ['.hero-copy'] },
      { name: 'profileCard', selectors: ['.profile-card'] },
    ],
  };

  function getPurposeCards() {
    return Array.from(document.querySelectorAll('[data-purpose-card]'));
  }

  function getActiveLanguageData() {
    return data.getLanguage(activeLanguage);
  }

  function getViewportProfile() {
    return window.matchMedia('(max-width: 760px)').matches ? 'narrow' : 'wide';
  }

  function applyAdaptiveType(languageCode = activeLanguage) {
    document.documentElement.dataset.language = languageCode;
    document.documentElement.dataset.viewportProfile = getViewportProfile();
  }

  function getStableLayoutElements(group) {
    return group.selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  }

  function getStableLayoutGroups() {
    return [...stableLayoutGroups.shared, ...stableLayoutGroups[getViewportProfile()]];
  }

  function resetStableLayout() {
    getStableLayoutGroups().forEach((group) => {
      getStableLayoutElements(group).forEach((element) => {
        element.style.minHeight = '';
      });
    });
  }

  function renderLanguageState(languageCode) {
    activeLanguage = languageCode;
    renderLocalizedText();
    renderPurposeCards();
    updatePromptPreview();
  }

  function measureLanguageLayout(languageCode) {
    renderLanguageState(languageCode);

    return getStableLayoutGroups().reduce((measurements, group) => {
      const heights = getStableLayoutElements(group).map((element) =>
        Math.ceil(element.getBoundingClientRect().height),
      );

      measurements[group.name] = heights.length ? Math.max(...heights) : 0;
      return measurements;
    }, {});
  }

  function applyStableLayout() {
    if (isStabilizingLayout) {
      return;
    }

    const intendedLanguage = activeLanguage;
    const stableHeights = {};

    isStabilizingLayout = true;
    document.documentElement.classList.add('is-measuring-layout');

    try {
      resetStableLayout();

      Object.keys(data.languages).forEach((languageCode) => {
        const measurements = measureLanguageLayout(languageCode);

        getStableLayoutGroups().forEach((group) => {
          stableHeights[group.name] = Math.max(stableHeights[group.name] || 0, measurements[group.name] || 0);
        });
      });

      renderLanguageState(intendedLanguage);

      getStableLayoutGroups().forEach((group) => {
        const height = stableHeights[group.name];

        if (!height) {
          return;
        }

        getStableLayoutElements(group).forEach((element) => {
          element.style.minHeight = `${height}px`;
        });
      });
    } finally {
      document.documentElement.classList.remove('is-measuring-layout');
      isStabilizingLayout = false;
    }
  }

  function scheduleStableLayout() {
    if (stableLayoutTimeout) {
      window.clearTimeout(stableLayoutTimeout);
    }

    stableLayoutTimeout = window.setTimeout(() => {
      stableLayoutTimeout = undefined;
      applyStableLayout();
    }, 80);
  }

  function renderProfileInterests(language) {
    interestLockup.innerHTML = '';
    interestLockup.dataset.language = language.code;
    interestLockup.setAttribute('aria-label', language.profile.interestAriaLabel);

    language.profile.interests.forEach((interest) => {
      const word = document.createElement('span');
      word.className = `interest-word interest-word--${interest.slot}`;
      word.textContent = interest.text;
      interestLockup.appendChild(word);
    });
  }

  function renderLocalizedText() {
    const language = getActiveLanguageData();

    document.documentElement.lang = language.htmlLang;
    document.title = language.title;
    applyAdaptiveType(language.code);

    if (metaDescription) {
      metaDescription.setAttribute('content', language.metaDescription);
    }

    localizedNodes.statusTitle.textContent = language.status.title;
    languageToggle.textContent = language.switchLabel;
    languageToggle.setAttribute('aria-label', language.switchAriaLabel);
    localizedNodes.heroEyebrow.textContent = language.hero.eyebrow;
    localizedNodes.heroTitle.textContent = language.hero.title;
    localizedNodes.heroLede.textContent = language.hero.lede;
    profileCard.setAttribute('aria-label', language.profile.ariaLabel);
    localizedNodes.profileStatus.textContent = language.profile.status;
    renderProfileInterests(language);
    contextGrid.setAttribute('aria-label', language.contextAriaLabel);

    language.contextCards.forEach((card, index) => {
      localizedNodes.contextTitles[index].textContent = card.title;
      localizedNodes.contextBodies[index].textContent = card.body;
    });

    localizedNodes.workbenchEyebrow.textContent = language.workbench.eyebrow;
    localizedNodes.workbenchTitle.textContent = language.workbench.title;
    promptPanel.setAttribute('aria-label', language.workbench.previewLabel);
    closeDialogButton.setAttribute('aria-label', language.dialog.closeLabel);
    localizedNodes.dialogEyebrow.textContent = language.dialog.eyebrow;
    localizedNodes.dialogTitle.textContent = language.dialog.title;
    localizedNodes.dialogDescription.textContent = language.dialog.description;
    localizedNodes.dialogPurposePrefix.textContent = language.dialog.purposePrefix;
    platformLinks.setAttribute('aria-label', language.dialog.platformLabel);
    dialogManualCopy.setAttribute('aria-label', language.dialog.manualCopyLabel);
    contactBlock.setAttribute('aria-label', language.contact.ariaLabel);
    localizedNodes.contactEyebrow.textContent = language.contact.eyebrow;
    localizedNodes.contactBody.textContent = language.contact.body;
    localizedNodes.contactWechat.textContent = language.contact.links.wechat;
    localizedNodes.contactEmail.textContent = language.contact.links.email;
    localizedNodes.contactGithub.textContent = language.contact.links.github;
    localizedNodes.contactWriting.textContent = language.contact.links.writing;

    renderModelLinks();
    resetCopiedState();
  }

  function resetCopiedState() {
    const language = getActiveLanguageData();

    if (copyResetTimeout) {
      window.clearTimeout(copyResetTimeout);
      copyResetTimeout = undefined;
    }

    copyButton.classList.remove('is-copied');
    dialogCopyButton.classList.remove('is-copied');
    copyButton.textContent = language.ui.openPromptButton;
    dialogCopyButton.textContent = language.ui.copyOnlyButton;
    copyFeedback.textContent = '';
    dialogCopyFeedback.textContent = '';
    dialogManualCopy.classList.remove('is-visible');
  }

  function renderModelLinks() {
    const language = getActiveLanguageData();

    platformLinks.innerHTML = '';

    modelLinks.forEach((model) => {
      const link = document.createElement('a');
      link.className = 'model-link';
      link.href = model.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('data-model-link', model.name);
      link.setAttribute('aria-label', language.ui.modelAriaLabel(model.name));
      link.innerHTML = `
        <span class="model-logo" aria-hidden="true">${model.logoSvg}</span>
        <span>
          <span class="model-link__label">${model.name}</span>
          <span class="model-link__hint">${language.ui.copyAndOpenLabel}</span>
        </span>
      `;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        copyPromptAndOpenModel(model);
      });
      platformLinks.appendChild(link);
    });
  }

  function renderPurposeCards() {
    purposeList.innerHTML = '';

    Object.values(data.getLanguage(activeLanguage).purposes).forEach((purpose) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'purpose-card';
      button.dataset.purposeCard = purpose.id;
      button.setAttribute('aria-pressed', String(purpose.id === activePurposeId));
      button.innerHTML = `
        <span class="purpose-card__number">${purpose.number}</span>
        <strong>${purpose.label}</strong>
        <span>${purpose.shortDescription}</span>
      `;
      button.addEventListener('click', () => {
        activePurposeId = purpose.id;
        resetCopiedState();
        updatePromptPreview();
        applyStableLayout();
      });
      purposeList.appendChild(button);
    });
  }

  function updatePromptPreview() {
    const purpose = data.getPurpose(activePurposeId, activeLanguage);
    const prompt = data.buildPrompt(activePurposeId, activeLanguage);

    activePurposeLabel.textContent = purpose.label;
    dialogPurposeLabel.textContent = purpose.label;
    promptPreview.textContent = prompt;
    dialogManualCopy.value = prompt;

    getPurposeCards().forEach((card) => {
      const isActive = card.dataset.purposeCard === activePurposeId;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-pressed', String(isActive));
    });
  }

  function openPromptDialog() {
    resetCopiedState();
    updatePromptPreview();

    if (typeof promptDialog.showModal === 'function') {
      promptDialog.showModal();
      return;
    }

    promptDialog.setAttribute('open', '');
  }

  function closePromptDialog() {
    if (typeof promptDialog.close === 'function') {
      promptDialog.close();
      return;
    }

    promptDialog.removeAttribute('open');
  }

  async function writeClipboard(text, fallbackRoot = document.body) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Some embedded browsers expose Clipboard API but reject writes.
      }
    }

    const textarea = document.createElement('textarea');

    try {
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      fallbackRoot.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);

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

  function selectPromptPreviewText() {
    dialogManualCopy.classList.add('is-visible');
    dialogManualCopy.focus();
    dialogManualCopy.select();
    dialogManualCopy.setSelectionRange(0, dialogManualCopy.value.length);
  }

  async function copyPromptAndOpenModel(model) {
    const language = getActiveLanguageData();
    const prompt = data.buildPrompt(activePurposeId, activeLanguage);
    const destinationWindow = window.open('', '_blank');

    if (destinationWindow) {
      destinationWindow.opener = null;
    }

    try {
      await writeClipboard(prompt, promptDialog);
      resetCopiedState();
      dialogCopyFeedback.textContent = language.ui.copiedOpening(model.name);

      if (destinationWindow) {
        destinationWindow.location.href = model.href;
      } else {
        dialogCopyFeedback.textContent = language.ui.copiedManualOpen(model.name);
      }
    } catch (error) {
      if (destinationWindow && !destinationWindow.closed) {
        destinationWindow.close();
      }

      resetCopiedState();
      selectPromptPreviewText();
      dialogCopyFeedback.textContent = language.ui.copyBlockedOpen(model.name);
    }
  }

  async function copyActivePrompt() {
    const language = getActiveLanguageData();
    const prompt = data.buildPrompt(activePurposeId, activeLanguage);

    try {
      await writeClipboard(prompt, promptDialog);
      resetCopiedState();
      dialogCopyButton.classList.add('is-copied');
      dialogCopyButton.textContent = language.ui.copiedButton;
      dialogCopyFeedback.textContent = language.ui.copiedPrompt;

      copyResetTimeout = window.setTimeout(() => {
        resetCopiedState();
      }, 1800);
    } catch (error) {
      resetCopiedState();
      selectPromptPreviewText();
      dialogCopyFeedback.textContent = language.ui.copyBlockedOnly;
    }
  }

  function switchLanguage() {
    activeLanguage = activeLanguage === 'zh' ? 'en' : 'zh';
    applyStableLayout();
  }

  copyButton.addEventListener('click', openPromptDialog);
  dialogCopyButton.addEventListener('click', copyActivePrompt);
  languageToggle.addEventListener('click', switchLanguage);
  closeDialogButton.addEventListener('click', closePromptDialog);
  window.addEventListener('resize', scheduleStableLayout);
  promptDialog.addEventListener('click', (event) => {
    if (event.target === promptDialog) {
      closePromptDialog();
    }
  });
  renderLanguageState(activeLanguage);
  applyStableLayout();
})();
