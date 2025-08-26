// Global translation helper function
    function getTranslation(key, defaultText) {
        // Split the key into parts (e.g., "tooltip.xg-line-title" -> ["tooltip", "xg-line-title"])
        const keys = key.split('.');
        
        // Try to find the translation in the current language
        try {
            let currentTranslations = window.currentTranslations || {};
            for (const k of keys) {
                if (currentTranslations && currentTranslations[k]) {
                    currentTranslations = currentTranslations[k];
                } else {
                    return defaultText;
                }
            }
            return currentTranslations;
        } catch (e) {
            return defaultText;
        }
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

    fetch(`/plotlocales/${language}.json`)
        .then(response => {
            // Don't throw an error, just return null if response is not OK
            return response.ok ? response.json() : null;
        })
        .then(translations => {
            // Only proceed if translations exist
            if (translations) {
                // Store translations globally
                window.currentTranslations = translations;
                
                // Then translate everything else
                document.querySelectorAll('[data-i18n]').forEach(element => {
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
                });
            }
        })
        .catch(() => {
            // Completely empty catch block to silently ignore any errors
        });
}

const preferredLanguage = getPreferredLanguage();
applyLanguage(preferredLanguage);


function toggleDarkMode() {
        const body = document.querySelector("body");
        body.classList.toggle("dark-mode");
        
        const isDarkMode = body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode);
        
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const storedDarkMode = localStorage.getItem("darkMode");
        
        if (storedDarkMode === "true") {
            const body = document.querySelector("body");
            body.classList.add("dark-mode");
        }
        

    });

    function takeScreenshot() {
            const chartContainer = document.querySelector('.chart-container');
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            html2canvas(chartContainer, {
                scale: 2, // Higher quality
                backgroundColor: isDarkMode ? '#2c2c2c' : '#FFFFFF',
                allowTaint: true,
                useCORS: true,
                logging: false
            }).then(function(renderedCanvas) {
                const finalCanvas = document.createElement('canvas');
                finalCanvas.width = renderedCanvas.width;
                finalCanvas.height = renderedCanvas.height;
                const finalCtx = finalCanvas.getContext('2d');
                finalCtx.drawImage(renderedCanvas, 0, 0);
                
                // Load the watermark
                const watermarkImg = new Image();
                watermarkImg.crossOrigin = "Anonymous";
                
                watermarkImg.onload = function() {
                    const watermarkWidth = finalCanvas.width * 0.3;
                    const watermarkHeight = (watermarkWidth / watermarkImg.width) * watermarkImg.height;
                    
                    const x = (finalCanvas.width - watermarkWidth) / 2;
                    const y = (finalCanvas.height - watermarkHeight) / 2;
                    
                    finalCtx.save();
                    finalCtx.globalAlpha = 0.04;
                    finalCtx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
                    finalCtx.restore();
                    
                    const dataURL = finalCanvas.toDataURL('image/png', 1.0);
                    const link = document.createElement('a');
                    link.download = 'DataMB Screenshot.png';
                    link.href = dataURL;
                    link.click();
                };
                watermarkImg.src = 'https://datamb.football/logo.png';
            }).catch(function(error) {
            });
        }

// Function to equalize season selector button widths
function equalizeSeasonButtonWidths() {
    const seasonButtons = document.querySelectorAll('.season-selector a');
    if (seasonButtons.length >= 2) {
        // Reset widths to auto to measure natural width
        seasonButtons.forEach(btn => btn.style.width = 'auto');
        
        // Get the natural width of each button
        let maxWidth = 0;
        seasonButtons.forEach(btn => {
            const width = btn.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        
        // Set all buttons to the maximum width
        seasonButtons.forEach(btn => btn.style.width = maxWidth + 'px');
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    equalizeSeasonButtonWidths();
    
    // Also run when window is resized
    window.addEventListener('resize', equalizeSeasonButtonWidths);
});

        // Check if device supports touch events (mobile device)
 document.addEventListener('DOMContentLoaded', function() {
            const isTouchDevice = window.innerWidth < 768; // Common breakpoint for tablets/mobile
            
            if (isTouchDevice) {
                // Get references to the elements
                const positionSwitcherContainer = document.querySelector('.position-switcher-container');
                const chartWrapper = document.querySelector('.chart-wrapper');
                const container = document.querySelector('.container');
                
                // If both elements exist, move the position switcher after the chart wrapper
                if (positionSwitcherContainer && chartWrapper && container) {
                    // Remove the position switcher from its current position
                    container.removeChild(positionSwitcherContainer);
                    
                    // Insert it after the chart wrapper
                    chartWrapper.parentNode.insertBefore(positionSwitcherContainer, chartWrapper.nextSibling);
                    
                    // Add some styling to ensure proper spacing
                    positionSwitcherContainer.style.marginTop = '20px';
                }
            }
        });

// Create a function to generate a unique player identifier
function getPlayerUniqueId(d) {
    // Combine player ID and name to create a unique identifier
    return d[0] + "-" + d[1];
}

// Create a function to extract player name from the unique identifier
function getPlayerNameFromId(uniqueId) {
    // Extract the name part after the first dash
    return uniqueId.substring(uniqueId.indexOf('-') + 1);
}

// Create a function to extract player ID from the unique identifier
function getPlayerIdFromUniqueId(uniqueId) {
    // Extract the ID part before the first dash
    return uniqueId.substring(0, uniqueId.indexOf('-'));
}