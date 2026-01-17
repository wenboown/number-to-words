// Phone keypad mapping
const KEYPAD = {
    '2': 'abc',
    '3': 'def',
    '4': 'ghi',
    '5': 'jkl',
    '6': 'mno',
    '7': 'pqrs',
    '8': 'tuv',
    '9': 'wxyz'
};

// Create reverse mapping: letter -> number
const LETTER_TO_NUMBER = {};
for (const [digit, letters] of Object.entries(KEYPAD)) {
    for (const letter of letters) {
        LETTER_TO_NUMBER[letter] = digit;
    }
}

// Dictionary mapping: number -> words (loaded from JSON)
let numberToWords = {};
let isLoading = true;

// Initialize the app
async function init() {
    console.log('Initializing app...');

    try {
        // Load dictionary from JSON file
        await loadDictionary();

        // Setup event listeners
        setupEventListeners();

        // Hide loading status
        document.getElementById('loadingStatus').style.display = 'none';

        console.log('App initialized!');
        console.log(`Dictionary loaded with ${Object.keys(numberToWords).length} unique number patterns`);
    } catch (error) {
        console.error('Failed to initialize app:', error);
        document.getElementById('loadingStatus').textContent = 'Error loading dictionary. Please refresh.';
        document.getElementById('loadingStatus').style.color = '#c62828';
    }
}

// Load dictionary from JSON file
async function loadDictionary() {
    const startTime = performance.now();

    try {
        const response = await fetch('dictionary.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        numberToWords = await response.json();
        isLoading = false;

        const endTime = performance.now();
        console.log(`Dictionary loaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
        console.error('Error loading dictionary:', error);
        throw error;
    }
}

// Setup event listeners
function setupEventListeners() {
    const numberInput = document.getElementById('numberInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');

    numberInput.addEventListener('input', validateInput);
    numberInput.addEventListener('keypress', handleKeyPress);
    convertBtn.addEventListener('click', convertNumber);
    clearBtn.addEventListener('click', clearInput);
}

// Validate input to only allow digits 2-9
function validateInput(event) {
    const input = event.target;
    // Remove any characters that aren't 2-9
    input.value = input.value.replace(/[^2-9]/g, '');
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        convertNumber();
    }
}

// Find all word combinations for a given number string
// Uses dynamic programming to find all valid ways to split the number into words
function findWordCombinations(number, maxWords = 3, maxResults = 100) {
    const results = [];

    // Helper function to recursively find combinations
    function findCombos(startIdx, currentCombo) {
        // Stop if we've found enough results
        if (results.length >= maxResults) {
            return;
        }

        // If we've reached the end, we found a valid combination
        if (startIdx === number.length) {
            if (currentCombo.length > 0) {
                results.push([...currentCombo]);
            }
            return;
        }

        // Don't allow too many words in a combination
        if (currentCombo.length >= maxWords) {
            return;
        }

        // Try all possible word lengths from current position
        for (let endIdx = startIdx + 2; endIdx <= Math.min(startIdx + 15, number.length); endIdx++) {
            const substring = number.substring(startIdx, endIdx);
            const words = numberToWords[substring];

            if (words && words.length > 0) {
                // Try each matching word
                const wordsToTry = words.slice(0, 10); // Limit words per position to prevent explosion
                for (const word of wordsToTry) {
                    currentCombo.push(word);
                    findCombos(endIdx, currentCombo);
                    currentCombo.pop();

                    // Stop if we've found enough results
                    if (results.length >= maxResults) {
                        return;
                    }
                }
            }
        }
    }

    findCombos(0, []);
    return results;
}

// Convert number to words
function convertNumber() {
    const input = document.getElementById('numberInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const resultsCount = document.getElementById('resultsCount');
    const wordList = document.getElementById('wordList');

    // Clear previous results
    wordList.innerHTML = '';

    if (!input) {
        resultsDiv.style.display = 'none';
        return;
    }

    if (isLoading) {
        displayMessage('Dictionary is still loading...', 'info');
        return;
    }

    // Validation
    if (input.length > 15) {
        displayError('Number too long! Maximum 15 digits.');
        return;
    }

    // Look up single word matches
    const singleWords = numberToWords[input] || [];

    // Find word combinations (only for numbers 4+ digits)
    let combinations = [];
    if (input.length >= 4) {
        combinations = findWordCombinations(input);
    }

    // Display results
    resultsDiv.style.display = 'block';

    const totalResults = singleWords.length + combinations.length;

    if (totalResults === 0) {
        resultsCount.textContent = 'No words found';
        wordList.innerHTML = '<div class="no-results">No matching words or combinations found.</div>';
        return;
    }

    // Display count
    let countText = '';
    if (singleWords.length > 0 && combinations.length > 0) {
        countText = `Found ${singleWords.length} word${singleWords.length === 1 ? '' : 's'} and ${combinations.length} combination${combinations.length === 1 ? '' : 's'}`;
    } else if (singleWords.length > 0) {
        countText = `Found ${singleWords.length} word${singleWords.length === 1 ? '' : 's'}`;
    } else {
        countText = `Found ${combinations.length} combination${combinations.length === 1 ? '' : 's'}`;
    }
    resultsCount.textContent = countText;

    // Display single words first
    if (singleWords.length > 0) {
        const section = document.createElement('div');
        section.className = 'result-section';

        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = 'Single Words';
        section.appendChild(header);

        // Limit display to first 50 words
        const wordsToShow = singleWords.slice(0, 50);
        wordsToShow.forEach(word => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word-item';
            wordDiv.textContent = word;
            section.appendChild(wordDiv);
        });

        if (singleWords.length > 50) {
            const moreDiv = document.createElement('div');
            moreDiv.className = 'more-results';
            moreDiv.textContent = `+ ${singleWords.length - 50} more...`;
            section.appendChild(moreDiv);
        }

        wordList.appendChild(section);
    }

    // Display combinations
    if (combinations.length > 0) {
        const section = document.createElement('div');
        section.className = 'result-section';

        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = 'Word Combinations';
        section.appendChild(header);

        combinations.forEach(combo => {
            const comboDiv = document.createElement('div');
            comboDiv.className = 'word-item combo-item';
            comboDiv.textContent = combo.join(' + ');
            section.appendChild(comboDiv);
        });

        wordList.appendChild(section);
    }
}

// Display error message
function displayError(message) {
    const resultsDiv = document.getElementById('results');
    const resultsCount = document.getElementById('resultsCount');
    const wordList = document.getElementById('wordList');

    resultsDiv.style.display = 'block';
    resultsCount.textContent = 'Error';
    wordList.innerHTML = `<div class="error-message">${message}</div>`;
}

// Display info message
function displayMessage(message, type = 'info') {
    const resultsDiv = document.getElementById('results');
    const resultsCount = document.getElementById('resultsCount');
    const wordList = document.getElementById('wordList');

    resultsDiv.style.display = 'block';
    resultsCount.textContent = type === 'info' ? 'Info' : 'Notice';
    wordList.innerHTML = `<div class="info-message">${message}</div>`;
}

// Clear input and results
function clearInput() {
    document.getElementById('numberInput').value = '';
    document.getElementById('results').style.display = 'none';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
