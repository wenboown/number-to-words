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

// Find word split patterns for a given number string
// Returns all possible digit splits with their corresponding words
// Example: 726268 -> {3+3: {left: "726" words, right: "268" words}}
function findWordSplits(number) {
    const splits = [];
    const len = number.length;

    // Only create splits for numbers 4+ digits
    if (len < 4) {
        return splits;
    }

    // Generate all possible splits (don't split into single digits)
    for (let splitPoint = 2; splitPoint <= len - 2; splitPoint++) {
        const leftNum = number.substring(0, splitPoint);
        const rightNum = number.substring(splitPoint);

        const leftWords = numberToWords[leftNum] || [];
        const rightWords = numberToWords[rightNum] || [];

        // Only include if both sides have at least one word
        if (leftWords.length > 0 && rightWords.length > 0) {
            splits.push({
                pattern: `${splitPoint}+${len - splitPoint}`,
                leftNum: leftNum,
                rightNum: rightNum,
                leftWords: leftWords.slice(0, 20), // Limit to 20 words per side
                rightWords: rightWords.slice(0, 20),
                leftTotal: leftWords.length,
                rightTotal: rightWords.length
            });
        }
    }

    return splits;
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

    // Find word split patterns (only for numbers 4+ digits)
    const splits = findWordSplits(input);

    // Display results
    resultsDiv.style.display = 'block';

    const hasSingleWords = singleWords.length > 0;
    const hasSplits = splits.length > 0;

    if (!hasSingleWords && !hasSplits) {
        resultsCount.textContent = 'No words found';
        wordList.innerHTML = '<div class="no-results">No matching words or combinations found.</div>';
        return;
    }

    // Display count
    let countText = '';
    if (hasSingleWords && hasSplits) {
        countText = `Found ${singleWords.length} full-length word${singleWords.length === 1 ? '' : 's'} and ${splits.length} split pattern${splits.length === 1 ? '' : 's'}`;
    } else if (hasSingleWords) {
        countText = `Found ${singleWords.length} word${singleWords.length === 1 ? '' : 's'}`;
    } else {
        countText = `Found ${splits.length} split pattern${splits.length === 1 ? '' : 's'}`;
    }
    resultsCount.textContent = countText;

    // Display single words first (full-length matches)
    if (hasSingleWords) {
        const section = document.createElement('div');
        section.className = 'result-section';

        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = `Full ${input.length}-Digit Words`;
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

    // Display split patterns
    if (hasSplits) {
        splits.forEach(split => {
            const section = document.createElement('div');
            section.className = 'result-section split-section';

            const header = document.createElement('div');
            header.className = 'section-header';
            header.textContent = `${split.pattern} Split: ${split.leftNum} + ${split.rightNum}`;
            section.appendChild(header);

            // Create a split container showing both sides
            const splitContainer = document.createElement('div');
            splitContainer.className = 'split-container';

            // Left side
            const leftSide = document.createElement('div');
            leftSide.className = 'split-side';

            const leftLabel = document.createElement('div');
            leftLabel.className = 'split-label';
            leftLabel.textContent = `${split.leftNum} (${split.leftTotal} word${split.leftTotal === 1 ? '' : 's'}):`;
            leftSide.appendChild(leftLabel);

            const leftWords = document.createElement('div');
            leftWords.className = 'split-words';
            leftWords.textContent = split.leftWords.join(', ');
            if (split.leftTotal > split.leftWords.length) {
                leftWords.textContent += ` (+${split.leftTotal - split.leftWords.length} more)`;
            }
            leftSide.appendChild(leftWords);

            // Right side
            const rightSide = document.createElement('div');
            rightSide.className = 'split-side';

            const rightLabel = document.createElement('div');
            rightLabel.className = 'split-label';
            rightLabel.textContent = `${split.rightNum} (${split.rightTotal} word${split.rightTotal === 1 ? '' : 's'}):`;
            rightSide.appendChild(rightLabel);

            const rightWords = document.createElement('div');
            rightWords.className = 'split-words';
            rightWords.textContent = split.rightWords.join(', ');
            if (split.rightTotal > split.rightWords.length) {
                rightWords.textContent += ` (+${split.rightTotal - split.rightWords.length} more)`;
            }
            rightSide.appendChild(rightWords);

            splitContainer.appendChild(leftSide);
            splitContainer.appendChild(rightSide);
            section.appendChild(splitContainer);

            wordList.appendChild(section);
        });
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
