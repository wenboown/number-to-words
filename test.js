// Simple test script to verify the algorithm
// Run with: node test.js

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

// Sample words for testing
const TEST_WORDS = ['hello', 'world', 'cat', 'dog', 'book', 'cool', 'code', 'test'];

function wordToNumber(word) {
    let number = '';
    for (const char of word.toLowerCase()) {
        if (LETTER_TO_NUMBER[char]) {
            number += LETTER_TO_NUMBER[char];
        } else {
            return null;
        }
    }
    return number;
}

console.log('Testing word to number conversion:\n');
TEST_WORDS.forEach(word => {
    const number = wordToNumber(word);
    console.log(`${word.padEnd(10)} -> ${number}`);
});

console.log('\n\nTesting reverse lookup:\n');
const numberToWords = {};

// Pre-compute
TEST_WORDS.forEach(word => {
    const number = wordToNumber(word);
    if (number) {
        if (!numberToWords[number]) {
            numberToWords[number] = [];
        }
        numberToWords[number].push(word);
    }
});

// Display mappings
for (const [number, words] of Object.entries(numberToWords).sort()) {
    console.log(`${number} -> ${words.join(', ')}`);
}

console.log('\n\nTest specific lookups:\n');
const testCases = ['228', '364', '2665', '43556', '9675'];
testCases.forEach(num => {
    const words = numberToWords[num] || [];
    console.log(`${num}: ${words.length > 0 ? words.join(', ') : 'No matches'}`);
});
