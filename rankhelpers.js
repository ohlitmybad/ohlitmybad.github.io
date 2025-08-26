// DARK MODE //

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  setTimeout(() => {
    updateChartColors();
  }, 10);
}
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
function isDarkMode() {
  return document.body.classList.contains('dark-mode');
}

function getChartColors() {
  if (isDarkMode()) {
    return {
      textColor: '#ffffff',
      gridColor: 'rgba(255, 255, 255, 0.4)'
    };
  } else {
    return {
      textColor: '#333333',
      gridColor: 'rgba(0, 0, 0, 0.1)'
    };
  }
}

function updateChartColors() {
  const chart = Chart.getChart('pizzaChart');
  if (!chart || !chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
    return;
  }

  const colors = getChartColors();
  if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
    chart.options.plugins.legend.labels.color = colors.textColor;
  }
  if (chart.options.scales && chart.options.scales.r) {
    if (chart.options.scales.r.ticks) {
      chart.options.scales.r.ticks.color = colors.textColor;
    }
    if (chart.options.scales.r.pointLabels) {
      chart.options.scales.r.pointLabels.color = colors.textColor;
    }
    if (chart.options.scales.r.grid) {
      chart.options.scales.r.grid.color = colors.gridColor;
    }
    if (chart.options.scales.r.angleLines) {
      chart.options.scales.r.angleLines.color = colors.gridColor;
    }
  }
  if (chart.data.datasets && chart.data.datasets[0]) {
    if (isDarkMode()) {
      chart.data.datasets[0].borderColor = '#1a1a1a';
      chart.data.datasets[0].borderWidth = 2;
    } else {
      chart.data.datasets[0].borderColor = '#ffffff';
      chart.data.datasets[0].borderWidth = 2;
    }
  }
  chart.update('none');
}

window.getChartColors = getChartColors;
window.updateChartColors = updateChartColors;
window.isDarkMode = isDarkMode;

const chartColorObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.attributeName === 'class') {
      if (!window.chartUpdateInProgress) {
        window.chartUpdateInProgress = true;
        setTimeout(() => {
          updateChartColors();
          window.chartUpdateInProgress = false;
        }, 5);
      }
    }
  });
});

chartColorObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});





// TOOLTIPS //

function updateTooltips() {
  const metricsToggle = document.getElementById('toggleMetrics');
  const metricsTooltip = document.getElementById('metricsTooltip');

  if (metricsToggle && metricsTooltip) {
    const switchToTotal = (currentTranslations && currentTranslations.buttons && currentTranslations.buttons.switch_to_total) || 'Switch to total';
    const switchToPer90 = (currentTranslations && currentTranslations.buttons && currentTranslations.buttons.switch_to_per90) || 'Switch to per 90';
    metricsTooltip.textContent = metricsToggle.checked ? switchToTotal : switchToPer90;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const metricsToggle = document.getElementById('toggleMetrics');
  if (metricsToggle) {
    metricsToggle.checked = true;
    metricsToggle.addEventListener('change', function () {
      updateTooltips();
      populateSectionOptions();
    });
  }
  updateTooltips();
  initializeCustomSelectors();
});




// CUSTOM SELECTORS //

function initializeCustomSelectors() {

  const ageTrigger = document.getElementById('ageSelectTrigger');
  const ageOptions = document.getElementById('ageSelectOptions');
  const ageSelect = document.getElementById('ageSelect');

  if (ageTrigger && ageOptions && ageSelect) {
    const firstOption = ageOptions.querySelector('.custom-select-option');
    if (firstOption) {
      firstOption.classList.add('selected');
      ageSelect.value = firstOption.getAttribute('data-value');
    }

    ageTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = ageOptions.style.display === 'block';
      closeAllCustomSelectors();
      if (!isOpen) {
        ageOptions.style.display = 'block';
        ageTrigger.classList.add('open');
        const currentValue = ageSelect.value;
        const currentlyHighlighted = ageOptions.querySelector('.custom-select-option.selected');
        const shouldBeHighlighted = ageOptions.querySelector(`[data-value="${currentValue}"]`);

        if (!currentlyHighlighted || currentlyHighlighted !== shouldBeHighlighted) {
          ageOptions.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));

          if (shouldBeHighlighted) {
            shouldBeHighlighted.classList.add('selected');
            shouldBeHighlighted.scrollIntoView({ block: 'nearest' });
          }
        }
        ageTrigger.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!ageTrigger.classList.contains('open')) return;
      handleKeyboardNavigation(e, ageOptions, (option) => {
        selectOption(option, ageTrigger, ageSelect, ageOptions);
      });
    });

    ageTrigger.addEventListener('keydown', function (e) {
      if (!ageTrigger.classList.contains('open') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        ageTrigger.click();
      }
    });

    ageOptions.addEventListener('click', function (e) {
      if (e.target.classList.contains('custom-select-option')) {
        selectOption(e.target, ageTrigger, ageSelect, ageOptions);
      }
    });

    ageTrigger.setAttribute('tabindex', '0');
  }

  const sectionTrigger = document.getElementById('sectionSelectTrigger');
  const sectionOptions = document.getElementById('sectionSelectOptions');
  const sectionSelect = document.getElementById('sectionSelect');

  if (sectionTrigger && sectionOptions && sectionSelect) {
    sectionTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = sectionOptions.style.display === 'block';
      closeAllCustomSelectors();
      if (!isOpen) {
        populateSectionOptions();
        sectionOptions.style.display = 'block';
        sectionTrigger.classList.add('open');
        const currentValue = sectionSelect.value;
        const currentlyHighlighted = sectionOptions.querySelector('.custom-select-option.selected');
        const shouldBeHighlighted = sectionOptions.querySelector(`[data-value="${currentValue}"]`);
        if (!currentlyHighlighted || currentlyHighlighted !== shouldBeHighlighted) {
          sectionOptions.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));

          if (shouldBeHighlighted) {
            shouldBeHighlighted.classList.add('selected');
            shouldBeHighlighted.scrollIntoView({ block: 'nearest' });
          }
        }
        sectionTrigger.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!sectionTrigger.classList.contains('open')) return;
      handleKeyboardNavigation(e, sectionOptions, (option) => {
        selectOption(option, sectionTrigger, sectionSelect, sectionOptions);
      });
    });
    sectionTrigger.addEventListener('keydown', function (e) {
      if (!sectionTrigger.classList.contains('open') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        sectionTrigger.click();
      }
    });
    sectionOptions.addEventListener('click', function (e) {
      if (e.target.classList.contains('custom-select-option')) {
        selectOption(e.target, sectionTrigger, sectionSelect, sectionOptions);
      }
    });
    sectionTrigger.setAttribute('tabindex', '0');
  }
  document.addEventListener('click', closeAllCustomSelectors);
}

function populateSectionOptions() {
  const sectionSelect = document.getElementById('sectionSelect');
  const sectionOptions = document.getElementById('sectionSelectOptions');

  if (sectionSelect && sectionOptions) {
    sectionOptions.innerHTML = '';
    let hasSelected = false;

    Array.from(sectionSelect.options).forEach((option, index) => {
      const div = document.createElement('div');
      div.className = 'custom-select-option';
      div.setAttribute('data-value', option.value);
      div.textContent = option.textContent;

      if (option.selected || (!hasSelected && index === 0)) {
        div.classList.add('selected');
        document.getElementById('sectionSelectTrigger').querySelector('span').textContent = option.textContent;
        hasSelected = true;
      }

      sectionOptions.appendChild(div);
    });
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const trigger = document.getElementById('sectionSelectTrigger');
  const sectionSelect = document.getElementById('sectionSelect');
  if (trigger && trigger.querySelector('span') && sectionSelect && sectionSelect.options.length > 0) {
    trigger.querySelector('span').textContent = sectionSelect.options[0].textContent;
  }
});

function handleKeyboardNavigation(e, optionsContainer, selectCallback) {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault();

      const visibleOptions = Array.from(optionsContainer.querySelectorAll('.custom-select-option'));
      const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));
      let newIndex;


      if (e.key === 'ArrowDown') {
        newIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
      } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
      }
      visibleOptions.forEach(opt => opt.classList.remove('selected'));
      visibleOptions[newIndex].classList.add('selected');
      visibleOptions[newIndex].scrollIntoView({ block: 'nearest' });
      break;

    case 'Enter':
      e.preventDefault();
      const selectedOption = optionsContainer.querySelector('.selected');
      if (selectedOption) {
        selectCallback(selectedOption);
      }
      break;

    case 'Escape':
      e.preventDefault();
      closeAllCustomSelectors();
      break;
  }
}

function selectOption(option, trigger, hiddenSelect, optionsContainer) {
  const value = option.getAttribute('data-value');
  const text = option.textContent;
  trigger.querySelector('span').textContent = text;
  hiddenSelect.value = value;
  const changeEvent = new Event('change', { bubbles: true });
  hiddenSelect.dispatchEvent(changeEvent);
  optionsContainer.style.display = 'none';
  trigger.classList.remove('open');
  optionsContainer.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
}

function closeAllCustomSelectors() {
  document.querySelectorAll('.custom-select-options').forEach(options => {
    options.style.display = 'none';
  });
  document.querySelectorAll('.custom-select-trigger').forEach(trigger => {
    trigger.classList.remove('open');
  });
}




// TRANSLATIONS // 

function translateLeague(league) {
  if (!currentTranslations || !currentTranslations.leagues) return league;
  if (league === "Top 5 League") return currentTranslations.leagues. top5; 
  if (league === "Top 7 League") return currentTranslations. leagues. top7;
    const key = league.toLowerCase().replace(/\s+/g, '');
  return currentTranslations.leagues[key] || league;
}

function translatePosition(position) {
  if (!currentTranslations || !currentTranslations.positions) return position;
  if (position === "Player") return currentTranslations.positions.all;
  const key = position.toLowerCase().replace(/[-\s]+/g, '');
  return currentTranslations.positions[key] || position;
}

function translatePositionPlural(position) {
  if (!currentTranslations) return position + "s";
  if (currentTranslations.positions_plural) {
    if (position === "Player") return currentTranslations.positions_plural.all;
    const key = position.toLowerCase().replace(/[-\s]+/g, '');
    return currentTranslations.positions_plural[key] || (currentTranslations.positions[key] + "s");
  }
  return translatePosition(position) + "s";
}

function translateTitle(league, suffix, position, includePer90 = false) {
  if (!currentTranslations || !currentTranslations.player_comparison) {
    return "vs " + league + " " + suffix + " " + position + "s" + (includePer90 ? ", per 90" : "");
  }
  const template = currentTranslations.player_comparison.title;
  const translatedLeague = translateLeague(league);
  const translatedPositionPlural = translatePositionPlural(position);
  const per90Text = includePer90 ? (currentTranslations.player_comparison.per90 || ", per 90") : "";

  return template
    .replace('{league}', translatedLeague)
    .replace('{suffix}', suffix)
    .replace('{position}', translatedPositionPlural) + per90Text;
}

let currentTranslations = null;

function translateMetricName(metricName) {
  if (currentTranslations && currentTranslations.metrics && currentTranslations.metrics[metricName]) {
    return currentTranslations.metrics[metricName];
  }
  return metricName;
}

function translateRankSuffix(suffix) {
  if (currentTranslations && currentTranslations.rankSuffixes && currentTranslations.rankSuffixes[suffix]) {
    return currentTranslations.rankSuffixes[suffix];
  }
  return suffix;
}

function getPreferredLanguage() {
  // PRIORITY 1: Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam) {
    return langParam;
  }
  // PRIORITY 2: Check localStorage
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang) {
    return storedLang;
  }
  // PRIORITY 3: Use browser language
  return getBrowserLanguage() || 'en';
}

function getBrowserLanguage() {
  return navigator.language.slice(0, 2);
}

function applyLanguage(language) {
  console.log(language);

  if (language === 'en') {
    return;
  }


  fetch(`locales/${language}.json`)
    .then(response => {
      // Don't throw an error, just return null if response is not OK
      return response.ok ? response.json() : null;
    })
    .then(translations => {
      // Only proceed if translations exist
      if (translations) {
        currentTranslations = translations;
        document.querySelectorAll('[data-i18n]').forEach(element => {
          const keys = element.getAttribute('data-i18n').split('.');
          let value = translations;
          for (const key of keys) {
            if (value === undefined || value === null) break;
            value = value[key];
          }
          if (value) {
            if (element.tagName === 'OPTION') {
              element.text = value;
              element.textContent = value;
            } else if (element.tagName === 'META') {
              element.setAttribute('content', value);
            } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
              element.setAttribute('placeholder', value);
            } else if (value.includes('<')) {
              element.innerHTML = value;
            } else {
              element.textContent = value;
            }
          }



        });

        populateSectionOptions();
        updateTooltips();

        if (window.displaySelectedPlayer) {
          displaySelectedPlayer();
        }
      }
    })
    .catch(() => {
      // Completely empty catch block to silently ignore any errors
    });
}

// Translate new dynamic elements  
function translateNewElements() {
  if (!currentTranslations) return;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const keys = element.getAttribute('data-i18n').split('.');
    let translation = currentTranslations;
    for (const key of keys) translation = translation?.[key];
    if (translation) element.textContent = translation;
  });
}

window.translateMetricName = translateMetricName;
window.translateRankSuffix = translateRankSuffix;
window.translatePositionPlural = translatePositionPlural;
window.translateNewElements = translateNewElements;
const preferredLanguage = getPreferredLanguage();
applyLanguage(preferredLanguage);