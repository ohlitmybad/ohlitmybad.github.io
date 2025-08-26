// DARK MODE //


    function toggleDarkMode() {
      const body = document.querySelector("body");
      body.classList.toggle("dark-mode");
      const isDarkMode = body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
    }
    const storedDarkMode = localStorage.getItem("darkMode");

    if (storedDarkMode === "true") {
      const body = document.querySelector("body");
      body.classList.add("dark-mode");
    }


          // SEARCH INPUTS //



    function setupCustomSelect(trigger, options, selectElement) {
      trigger.addEventListener('click', function() {
        document.querySelectorAll('.custom-select-trigger.open').forEach(function(openTrigger) {
          if (openTrigger !== trigger) {
            openTrigger.classList.remove('open');
            const openOptions = openTrigger.nextElementSibling;
            if (openOptions) openOptions.style.display = 'none';
          }
        });
        
        trigger.classList.toggle('open');
        const isOpen = trigger.classList.contains('open');
        options.style.display = isOpen ? 'block' : 'none';
      });
      
      options.addEventListener('click', function(e) {
        const option = e.target.closest('.custom-select-option');
        if (!option) return;
        
        options.querySelectorAll('.custom-select-option').forEach(opt => 
          opt.classList.remove('selected')
        );
        option.classList.add('selected');
        
        const dataValue = option.getAttribute('data-value');
        trigger.querySelector('span').textContent = option.textContent.trim();
        
        if (option.querySelector('iconify-icon')) {
          const iconElement = option.querySelector('iconify-icon');
          const triggerIcon = trigger.querySelector('iconify-icon');
          
          if (triggerIcon) {
            triggerIcon.setAttribute('icon', iconElement.getAttribute('icon'));
          } else {
            const newIcon = iconElement.cloneNode(true);
            trigger.insertBefore(newIcon, trigger.querySelector('span'));
          }
          
          const scotlandFlag = option.querySelector('div[style*="twemoji"]');
          if (scotlandFlag) {
            const existingFlag = trigger.querySelector('div[style*="twemoji"]');
            if (existingFlag) {
              existingFlag.remove();
            }
            const newFlag = scotlandFlag.cloneNode(true);
            trigger.insertBefore(newFlag, trigger.querySelector('span'));
            
            const iconToRemove = trigger.querySelector('iconify-icon');
            if (iconToRemove) {
              iconToRemove.remove();
            }
          } else if (scotlandFlag === null && trigger.querySelector('div[style*="twemoji"]')) {
            trigger.querySelector('div[style*="twemoji"]').remove();
          }
        }
        
        selectElement.value = dataValue;
        const event = new Event('change');
        selectElement.dispatchEvent(event);
        
        trigger.classList.remove('open');
        options.style.display = 'none';
      });
    }

    function setupInputsToggle() {
      const inputsToggle = document.querySelector('.inputs-toggle');
      const inputs = document.querySelector('.inputs');

      inputsToggle.addEventListener('click', function() {
        inputs.classList.toggle('collapsed');
        this.classList.toggle('collapsed');
      });
      
      window.addEventListener('resize', function() {
        if (window.innerWidth <= 1355) {
        } else {
          inputs.classList.remove('collapsed');
          inputsToggle.classList.remove('collapsed');
        }
      });
    }

    function customUpdateMetricLabels(dataset) {
      let position = '';
      let metricLabels = [];
      
      const fieldMappingByPosition = {
    'gk': {
      'defensiveActionsLow': { label: 'Save percentage %', key: 'metrics1.gk.save' },
      'aerialsContestedLow': { label: 'Aerial duels won', key: 'metrics1.gk.aerials' },
      'exitLineLow': { label: 'Interceptions (PAdj)', key: 'metrics1.gk.int' },
      'passesLow': { label: 'Passes completed', key: 'metrics1.gk.passes' },
      'longPassPercentageLow': { label: 'Long pass completion %', key: 'metrics1.gk.long_pass' },
      'shortPassPercentageLow': { label: 'Short pass completion %', key: 'metrics1.gk.short_pass' },
      'psxgLow': { label: 'Prevented goals', key: 'metrics1.gk.psxg_ga' }
    },
    'cb': {
      'defensiveActionsLow': { label: 'Passes completed', key: 'metrics1.cb.passes' },
      'aerialsContestedLow': { label: 'Forward pass completion %', key: 'metrics1.cb.forward_pass' },
      'exitLineLow': { label: 'Progressive passes completed', key: 'metrics1.cb.prog_passes' },
      'passesLow': { label: 'Possessions won', key: 'metrics1.cb.possWon' },
      'longPassPercentageLow': { label: 'Defensive duels won %', key: 'metrics1.cb.def_duel' },
      'shortPassPercentageLow': { label: 'Aerial duels won %', key: 'metrics1.cb.aerial' },
      'psxgLow': { label: 'Progressive carries', key: 'metrics1.cb.prog_carries' }
    },
    'fb': {
      'defensiveActionsLow': { label: 'Accurate crosses', key: 'metrics1.fb.cross' },
      'aerialsContestedLow': { label: 'Expected assists', key: 'metrics1.fb.xa' },
      'exitLineLow': { label: 'Progressive passes completed', key: 'metrics1.fb.prog_passes' },
      'passesLow': { label: 'Possessions won', key: 'metrics1.fb.def_actions' },
      'longPassPercentageLow': { label: 'Defensive duels won %', key: 'metrics1.fb.def_duel' },
      'shortPassPercentageLow': { label: 'Aerial duels won %', key: 'metrics1.fb.aerial' },
      'psxgLow': { label: 'Progressive carries', key: 'metrics1.fb.prog_carries' }
    },
    'cm': {
      'defensiveActionsLow': { label: 'Duels won %', key: 'metrics1.cm.duel' },
      'aerialsContestedLow': { label: 'Possessions won', key: 'metrics1.cm.possWon' },
      'exitLineLow': { label: 'Progressive carries', key: 'metrics1.cm.prog_carries' },
      'passesLow': { label: 'Forward passes completed', key: 'metrics1.cm.forward_passes' },
      'longPassPercentageLow': { label: 'Forward pass completion %', key: 'metrics1.cm.forward_pass' },
      'shortPassPercentageLow': { label: 'Key passes', key: 'metrics1.cm.key_passes' },
      'psxgLow': { label: 'Progressive passes completed', key: 'metrics1.cm.prog_passes' }
    },
    'fw': {
      'defensiveActionsLow': { label: 'Progressive carries', key: 'metrics1.fw.prog_carries' },
      'aerialsContestedLow': { label: 'Successful dribbles', key: 'metrics1.fw.dribbles' },
      'exitLineLow': { label: 'Non-penalty goals', key: 'metrics1.fw.npg' },
      'passesLow': { label: 'npxG + xA', key: 'metrics1.fw.xg_xa' },
      'longPassPercentageLow': { label: 'Assists', key: 'metrics1.fw.assists' },
      'shortPassPercentageLow': { label: 'Key passes', key: 'metrics1.fw.key_passes' },
      'psxgLow': { label: 'Accurate crosses', key: 'metrics1.fw.cross' }
    },
    'st': {
      'defensiveActionsLow': { label: 'Non-penalty goals', key: 'metrics1.st.npg' },
      'aerialsContestedLow': { label: 'Non-pentalty xG', key: 'metrics1.st.npxg' },
      'exitLineLow': { label: 'Goal conversion', key: 'metrics1.st.conv' },
      'passesLow': { label: 'Aerial duels won %', key: 'metrics1.st.aerial' },
      'longPassPercentageLow': { label: 'Touches in box', key: 'metrics1.st.touches' },
      'shortPassPercentageLow': { label: 'Expected assists', key: 'metrics1.st.xa' },
      'psxgLow': { label: 'Offensive duels won', key: 'metrics1.st.off_duel' }
    }
  };
      
      // Determine position code based on dataset
      switch(dataset) {
        case 'dataset1': position = 'gk'; break;
        case 'dataset2': position = 'cb'; break;
        case 'dataset3': position = 'fb'; break;
        case 'dataset4': position = 'cm'; break;
        case 'dataset5': position = 'fw'; break;
        case 'dataset6': position = 'st'; break;
      }
      
      const mappingForPosition = fieldMappingByPosition[position];
      
      Object.entries(mappingForPosition).forEach(([fieldId, metadata]) => {
        const label = document.querySelector(`label[for="${fieldId}"]`);
        if (label) {
          label.setAttribute('data-i18n', metadata.key);
          
          // Set the actual metric name directly
          label.textContent = metadata.label;
          
          if (translations && translations[metadata.key.split('.')[0]]) {
            const translation = getNestedTranslation(translations, metadata.key);
            if (translation) {
              label.textContent = translation;
            }
          }
        }
      });
    }

    document.addEventListener('DOMContentLoaded', function() {
      const positionSelector = document.getElementById('datasetSelector');
      const positionTrigger = document.getElementById('position-select-trigger');
      const positionOptions = document.getElementById('position-select-options');
      
      Array.from(positionSelector.options).forEach(option => {
        const customOption = document.createElement('div');
        customOption.className = 'custom-select-option';
        if (option.selected) customOption.classList.add('selected');
        customOption.setAttribute('data-value', option.value);
        customOption.textContent = option.textContent;
        positionOptions.appendChild(customOption);
      });
      
      setupCustomSelect(positionTrigger, positionOptions, positionSelector);
      
      const leagueSelector = document.getElementById('league');
      const leagueTrigger = document.getElementById('league-select-trigger');
      const leagueOptions = document.getElementById('league-select-options');
      

      
      setupCustomSelect(leagueTrigger, leagueOptions, leagueSelector);

      document.querySelectorAll('.range-slider').forEach(slider => {
        const valueInput = slider.nextElementSibling;
        
        const percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--slider-position', `${percent}%`);
        
        slider.addEventListener('input', function() {
          valueInput.value = this.value;
          
          this.value = valueInput.value;
          
          const percent = (this.value - this.min) / (this.max - this.min) * 100;
          this.style.setProperty('--slider-position', `${percent}%`);
        });
        
        valueInput.addEventListener('input', function() {
          let value = parseInt(this.value);
          
          if (isNaN(value)) {
            value = 0;
          }
          value = Math.max(0, Math.min(100, value));
          this.value = value;
          slider.value = value;
          const percent = (value - slider.min) / (slider.max - slider.min) * 100;
          slider.style.setProperty('--slider-position', `${percent}%`);
        });
      });

      positionSelector.addEventListener('change', function() {
        customUpdateMetricLabels(this.value);
        
        setTimeout(() => {
          document.querySelectorAll('.range-slider').forEach(slider => {
            slider.value = 0;
            const valueInput = slider.nextElementSibling;
            valueInput.value = '';
            slider.style.setProperty('--slider-position', '0%');
          });
        }, 10); 
      }, true); 
      
      leagueSelector.addEventListener('change', function() {
        setTimeout(() => {
          document.querySelectorAll('.range-slider').forEach(slider => {
            if (!slider.value) {
              slider.value = 0;
            }
            const valueInput = slider.nextElementSibling;
            
            if (valueInput.value) {
              const percent = (valueInput.value - slider.min) / (slider.max - slider.min) * 100;
              slider.style.setProperty('--slider-position', `${percent}%`);
              slider.value = valueInput.value;
            }
          });
        }, 10);
      });

      document.getElementById('searchForm').addEventListener('submit', function(event) {
        document.querySelectorAll('.range-slider').forEach(slider => {
          const valueInput = slider.nextElementSibling;
          if (valueInput.value !== '') {
            slider.value = valueInput.value;
          }
        });
        const tableWrapper = document.getElementById('tableWrapper');
        tableWrapper.innerHTML = '<div id="resultsContainer"></div>';
      }, true); 

      document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select-container')) {
          document.querySelectorAll('.custom-select-trigger.open').forEach(trigger => {
            trigger.classList.remove('open');
            trigger.nextElementSibling.style.display = 'none';
          });
        }
      });
      
      customUpdateMetricLabels('dataset1');
    });


      // TRANSLATIONS //


    let translations = {};
    let currentLanguage = 'en';

    function getPreferredLanguage() {
      // PRIORITY 1: URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      
      if (langParam) {
        return langParam; 
      }
      
      // PRIORITY 2: Stored preference
      const storedLang = localStorage.getItem('preferredLanguage');
      if (storedLang) {
        return storedLang;
      }
      
      // PRIORITY 3: Browser language
      const browserLang = navigator.language.slice(0, 2);
      return browserLang || 'en';
    }

    // Helper function to get nested translations
    function getNestedTranslation(obj, path) {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    // Load and apply translations
    async function applyLanguage(lang) {
      currentLanguage = lang;
      console.log(lang);

      // Skip fetching translations for English
      if (lang === 'en') {
        return;
      }
      
      try {
        const response = await fetch(`./locales/${lang}.json`);
        
        // Don't throw an error, just return null if response is not OK
        if (response.ok) {
          translations = await response.json();
        } else {
          translations = null;
        }
      } catch (error) {
        translations = null;
      }
      
      // Apply translations to all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations, key);
        if (translation) {
          if (translation.includes('<')) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      });

      // Update position selector options
      const datasetSelector = document.getElementById('datasetSelector');
      if (datasetSelector) {
        const defaultPositions = {
          'goalkeepers': 'Goalkeepers',
          'centre-backs': 'Centre-backs',
          'full-backs': 'Full-backs',
          'midfielders': 'Midfielders',
          'wingers': 'Wingers',
          'strikers': 'Strikers'
        };
        
        const positions = translations && translations.position ? translations.position : defaultPositions;
        
        datasetSelector.options[0].textContent = positions.goalkeepers || defaultPositions.goalkeepers;
        datasetSelector.options[1].textContent = positions['centre-backs'] || defaultPositions['centre-backs'];
        datasetSelector.options[2].textContent = positions['full-backs'] || defaultPositions['full-backs'];
        datasetSelector.options[3].textContent = positions.midfielders || defaultPositions.midfielders;
        datasetSelector.options[4].textContent = positions.wingers || defaultPositions.wingers;
        datasetSelector.options[5].textContent = positions.strikers || defaultPositions.strikers;
        
        // Update custom selector text for the selected position
        const positionTrigger = document.getElementById('position-select-trigger');
        const selectedOption = datasetSelector.options[datasetSelector.selectedIndex];
        if (positionTrigger && selectedOption) {
          positionTrigger.querySelector('span').textContent = selectedOption.textContent;
        }
        
        // Also update all options in the custom dropdown
        const positionOptions = document.getElementById('position-select-options');
        if (positionOptions) {
          // Clear existing options
          positionOptions.innerHTML = '';
          
          // Recreate all options with translated text
          Array.from(datasetSelector.options).forEach((option, index) => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-select-option';
            if (index === datasetSelector.selectedIndex) {
              customOption.classList.add('selected');
            }
            customOption.setAttribute('data-value', option.value);
            customOption.textContent = option.textContent;
            positionOptions.appendChild(customOption);
          });
        }
      }
      
      // Apply translations to metric labels based on current position
      const currentDataset = document.getElementById('datasetSelector').value;
      customUpdateMetricLabels(currentDataset);
    }

    // Initialize with preferred language following priority rules
    document.addEventListener('DOMContentLoaded', async () => {
      const preferredLanguage = getPreferredLanguage();
      await applyLanguage(preferredLanguage);
      
      // Setup inputs toggle for mobile
      setupInputsToggle();
    });



// SEASON BUTTONS //


function equalizeSeasonButtonWidths() {
    const seasonButtons = document.querySelectorAll('.season-selector a');
    if (seasonButtons.length >= 2) {
        seasonButtons.forEach(btn => btn.style.width = 'auto');
        
        let maxWidth = 0;
        seasonButtons.forEach(btn => {
            const width = btn.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        
        seasonButtons.forEach(btn => btn.style.width = maxWidth + 'px');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    equalizeSeasonButtonWidths();
    });