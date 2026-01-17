// Script to process the English dictionary and generate optimized JSON
const fs = require('fs');

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

const LETTER_TO_NUMBER = {};
for (const [digit, letters] of Object.entries(KEYPAD)) {
    for (const letter of letters) {
        LETTER_TO_NUMBER[letter] = digit;
    }
}

function wordToNumber(word) {
    let number = '';
    for (const char of word.toLowerCase()) {
        if (LETTER_TO_NUMBER[char]) {
            number += LETTER_TO_NUMBER[char];
        } else {
            return null; // Skip words with non-letter characters
        }
    }
    return number;
}

console.log('Reading dictionary...');
const words = fs.readFileSync('words_alpha.txt', 'utf-8')
    .split('\n')
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length >= 2 && w.length <= 15) // Reasonable word lengths
    .filter(w => /^[a-z]+$/.test(w)); // Only letters

console.log(`Filtered to ${words.length} words (2-15 characters, letters only)`);

console.log('Building number-to-words mapping...');
const numberToWords = {};
let processedCount = 0;

for (const word of words) {
    const number = wordToNumber(word);
    if (number) {
        if (!numberToWords[number]) {
            numberToWords[number] = [];
        }
        numberToWords[number].push(word);
        processedCount++;
    }
}

console.log(`Processed ${processedCount} words`);
console.log(`Unique number patterns: ${Object.keys(numberToWords).length}`);

// Sort words alphabetically within each number
for (const key in numberToWords) {
    numberToWords[key].sort();
    // Limit to top 50 words per number to keep file size reasonable
    if (numberToWords[key].length > 50) {
        numberToWords[key] = numberToWords[key].slice(0, 50);
    }
}

// Save to JSON file
console.log('Saving dictionary.json...');
fs.writeFileSync('dictionary.json', JSON.stringify(numberToWords));

// Calculate file size
const stats = fs.statSync('dictionary.json');
console.log(`Dictionary saved: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

// Show some sample mappings
console.log('\nSample mappings:');
const sampleNumbers = ['228', '2665', '43556', '726268'];
for (const num of sampleNumbers) {
    const words = numberToWords[num] || [];
    console.log(`${num}: ${words.slice(0, 10).join(', ')}${words.length > 10 ? '...' : ''} (${words.length} total)`);
}
