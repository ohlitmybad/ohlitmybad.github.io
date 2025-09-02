function showTooltip(element, text) {

  const existingTooltip = document.querySelector('.tooltip');
  if (existingTooltip) {
      existingTooltip.remove();
  }

  let displayText = text;
  if (window.translations && element.hasAttribute('data-i18n-tooltip')) {
      const tooltipKey = element.getAttribute('data-i18n-tooltip');
      const keys = tooltipKey.split('.');
      let translatedText = window.translations;

      for (const key of keys) {
          if (translatedText === undefined || translatedText === null) break;
          translatedText = translatedText[key];
      }

      if (translatedText) {
          displayText = translatedText;
      }
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = displayText;

  document.body.appendChild(tooltip);

  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
  let top = rect.top - tooltipRect.height - 8;

  if (left < 10) left = 10;
  if (left + tooltipRect.width > 470 - 10) {
      left = 470 - tooltipRect.width - 10;
  }
  if (top < 10) {

      top = rect.bottom + 8;
  }

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';

  setTimeout(() => {
      if (tooltip.parentNode) {
          tooltip.remove();
      }
  }, 2000);
}
async function takeScreenshot() {
  const chartContainer = document.querySelector('.screenshotcontainer');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  try {
    const canvas = await html2canvas(chartContainer, {
scale: 2, 
backgroundColor: isDarkMode ? '#0F0F0E' : '#FFFFFF',
useCORS: true,
logging: false,
      foreignObjectRendering: false,
      onclone: function(clonedDoc) {
        const similarPlayersContainer = clonedDoc.getElementById('similarPlayersContainer');
        if (similarPlayersContainer) {
          similarPlayersContainer.style.display = 'none';
        }
        
        const positionSwitcher = clonedDoc.querySelector('.position-switcher-container');
        const searchContainer = clonedDoc.querySelector('.search-container');
        if (positionSwitcher) positionSwitcher.style.display = 'none';
        if (searchContainer) searchContainer.style.display = 'none';

        const radarSVG = clonedDoc.querySelector('.radar');
      if (radarSVG) {
        radarSVG.style.display = 'block';
        radarSVG.style.margin = '0 auto';
        const svgGroup = radarSVG.querySelector('g');
        if (svgGroup) {
          svgGroup.setAttribute('transform', 'translate(195.5, 195.5)');
        }
      }
      }
    });
    
    // Create a new canvas with margins
    const margin = 20; // 10px margin on top/bottom (scaled by 2 for high DPI)
    const horizontalMargin = 0; // 0px margin on left/right
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    
    newCanvas.width = canvas.width + (horizontalMargin * 2);
    newCanvas.height = canvas.height + (margin * 2);
    
    // Fill background
    ctx.fillStyle = isDarkMode ? '#0F0F0E' : '#FFFFFF';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    
    // Draw original canvas with margins
    ctx.drawImage(canvas, horizontalMargin, margin);
    
    // Add logo to the canvas
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = function() {
      // Draw logo 20px from bottom, 10px from right with better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // Set opacity to 0.6 (60%)
      ctx.globalAlpha = 0.7;
      // Make logo slightly larger for better quality
      ctx.drawImage(logo, horizontalMargin + 45, newCanvas.height - margin - 70, 50, 50);
      // Reset opacity
      ctx.globalAlpha = 1.0;
      
      // Convert to blob and download
      newCanvas.toBlob(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'DataMB Screenshot.png';
        link.click();
      }, 'image/png');
    };
    logo.onerror = function() {
      // If logo fails to load, just download without it
      newCanvas.toBlob(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'DataMB Screenshot.png';
        link.click();
      }, 'image/png');
    };
    logo.src = 'https://datamb.football/logo.png';
    
  } catch (error) {
    console.error('Screenshot error:', error);
  }
}

  // Function to toggle dark mode
  function toggleDarkMode() {
    const body = document.querySelector("body");
    body.classList.toggle("dark-mode");

    // Store the user's preference in local storage
    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
  }

  // Check if user has a stored preference for dark mode
  const storedDarkMode = localStorage.getItem("darkMode");

  if (storedDarkMode === "true") {
    const body = document.querySelector("body");
    body.classList.add("dark-mode");
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
  return response.ok ? response.json() : null;
})
.then(translations => {
  // Only proceed if translations exist
  if (translations) {
      window.currentTranslations = translations;
          window.translations = translations;
      
    document.querySelectorAll('[data-i18n]').forEach(element => {
      translateElement(element, translations);
    });
    

    document.querySelector('meta[name="language"]').setAttribute('content', language);
    
    if (!window.translationObserver) {
      window.translationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // Element node
                if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                  translateElement(node, translations);
                }
                const elements = node.querySelectorAll ? node.querySelectorAll('[data-i18n]') : [];
                elements.forEach(function(element) {
                  translateElement(element, translations);
                });
              }
            });
          }
        });
      });
      
      window.translationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
})
.catch(() => {
});
}

// Helper function to translate a single element
function translateElement(element, translations) {
  const keys = element.getAttribute('data-i18n').split('.');
  let value = translations;
  
  for (const key of keys) {
    if (value === undefined || value === null) break;
    value = value[key];
  }
  
  if (value) {
    if (element.tagName === 'META') {
      element.setAttribute('content', value);
    } else if (element.tagName === 'INPUT') {
      element.setAttribute('placeholder', value);
    } else if (value.includes('<')) {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  }
}



const preferredLanguage = getPreferredLanguage();
applyLanguage(preferredLanguage);
