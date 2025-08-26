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

function setLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
    const url = new URL(window.location.href);
    if (language === 'en') {
        url.searchParams.delete('lang');
        applyLanguage('xx'); // Changed from 'xx' to 'en'
    } else {
        url.searchParams.set('lang', language);
        applyLanguage(language);
    }
    window.history.pushState({}, '', url);
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

let cachedTranslations = {};

function translatePosition(position) {
    const currentLang = getPreferredLanguage();
    if (currentLang === 'en') {
        return position;
    }
    const positionKey = position.toLowerCase();

    if (cachedTranslations[currentLang] &&
        cachedTranslations[currentLang].positions &&
        cachedTranslations[currentLang].positions[positionKey]) {
        return cachedTranslations[currentLang].positions[positionKey];
    }
    return position;
}

function applyLanguage(language) {

    if (language === 'en') {
        // Clear currentTranslations for English
        window.currentTranslations = {};
        return;
    }

    console.log(language);
    
    fetch(`/profiles/${language}.json`)
        .then(response => {
            // Don't throw an error, just return null if response is not OK
            return response.ok ? response.json() : null;
        })
        .then(translations => {
            // Only proceed if translations exist
            if (translations) {
                cachedTranslations[language] = translations;
                // FIX: Set window.currentTranslations so getTranslation() can access them
                window.currentTranslations = translations;
                
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const keys = element.getAttribute('data-i18n').split('.');
                    let value = translations;
                    for (const key of keys) {
                        if (value === undefined || value === null) break;
                        value = value[key];
                    }
                    if (value) {
                        // Check if this element has template information
                        const namePosition = element.getAttribute('data-name-position');
                        
                        // Get current content which now has the actual player name
                        let currentContent = '';
                        if (element.tagName === 'META') {
                            currentContent = element.getAttribute('content');
                        } else {
                            currentContent = element.textContent || element.innerHTML;
                        }
                        
                        // Apply translation with player name handling
                        if (namePosition) {
                            let translatedContent = '';
                            
                            // Extract the actual player name from the current content
                            let playerName = '';
                            
                            if (namePosition === 'prefix') {
                                const footballIndex = currentContent.indexOf('Football');
                                const seasonIndex = currentContent.indexOf('2025/26');
                                
                                // Find the earliest occurrence of either delimiter
                                let delimiterIndex = -1;
                                if (footballIndex > 0 && seasonIndex > 0) {
                                    delimiterIndex = Math.min(footballIndex, seasonIndex);
                                } else if (footballIndex > 0) {
                                    delimiterIndex = footballIndex;
                                } else if (seasonIndex > 0) {
                                    delimiterIndex = seasonIndex;
                                }
                                
                                if (delimiterIndex > 0) {
                                    // Extract everything before the delimiter
                                    playerName = currentContent.substring(0, delimiterIndex).trim();
                                }
                                
                                // Apply translation with player name at beginning
                                translatedContent = playerName + ' ' + value;
                            } 
                            
                            // Apply the modified translation
                            if (element.tagName === 'META') {
                                element.setAttribute('content', translatedContent);
                            } else if (value.includes('<')) {
                                element.innerHTML = translatedContent;
                            } else {
                                element.textContent = translatedContent;
                            }
                        } 
                        // Normal translation without player name
                        else {
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
                });
                // REMOVE FOR PAGES WITH NO METADATA
                const langMeta = document.querySelector('meta[name="language"]');
                if (langMeta) {
                    langMeta.setAttribute('content', language);
                }
            }
        })
        .catch(() => {
            // Completely empty catch block to silently ignore any errors
        });
}

const preferredLanguage = getPreferredLanguage();
applyLanguage(preferredLanguage);

// BUTTON LANGUAGE SWITCHER REMOVE FOR PAGES WITH NO LANGUAGE SWITCHER
document.addEventListener('DOMContentLoaded', function() {
    const languageButton = document.getElementById('languageButton');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (languageButton) {
        languageButton.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
    }

    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('href').split('=')[1];
            setLanguage(lang);
            languageDropdown.classList.remove('show');
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.language-switcher-container')) {
            if (languageDropdown) {
                languageDropdown.classList.remove('show');
            }
        }
    });
});