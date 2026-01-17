// Test script for word combinations
const fs = require('fs');

// Load the dictionary
console.log('Loading dictionary...');
const numberToWords = JSON.parse(fs.readFileSync('dictionary.json', 'utf-8'));
console.log(`Dictionary loaded: ${Object.keys(numberToWords).length} patterns\n`);

// Word combination finder (same as in script.js)
function findWordCombinations(number, maxWords = 3, maxResults = 100) {
    const results = [];

    function findCombos(startIdx, currentCombo) {
        if (results.length >= maxResults) {
            return;
        }

        if (startIdx === number.length) {
            if (currentCombo.length > 0) {
                results.push([...currentCombo]);
            }
            return;
        }

        if (currentCombo.length >= maxWords) {
            return;
        }

        for (let endIdx = startIdx + 2; endIdx <= Math.min(startIdx + 15, number.length); endIdx++) {
            const substring = number.substring(startIdx, endIdx);
            const words = numberToWords[substring];

            if (words && words.length > 0) {
                const wordsToTry = words.slice(0, 10);
                for (const word of wordsToTry) {
                    currentCombo.push(word);
                    findCombos(endIdx, currentCombo);
                    currentCombo.pop();

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

// Test cases
const testCases = [
    '726268',  // pan + bot (your example)
    '43556',   // hello (single word)
    '228',     // cat, bat, act (single word)
    '2665',    // book, cool (single word)
    '43556967', // hello + ... (combination)
];

console.log('Testing word combinations:\n');
console.log('='.repeat(60));

for (const testNum of testCases) {
    console.log(`\nNumber: ${testNum}`);
    console.log('-'.repeat(60));

    // Check single words
    const singleWords = numberToWords[testNum] || [];
    if (singleWords.length > 0) {
        console.log(`Single words (${singleWords.length}): ${singleWords.slice(0, 10).join(', ')}`);
    } else {
        console.log('Single words: None');
    }

    // Check combinations (only for 4+ digits)
    if (testNum.length >= 4) {
        const combos = findWordCombinations(testNum);
        if (combos.length > 0) {
            console.log(`\nCombinations (${combos.length} found, showing first 10):`);
            combos.slice(0, 10).forEach((combo, idx) => {
                console.log(`  ${idx + 1}. ${combo.join(' + ')}`);
            });
        } else {
            console.log('\nCombinations: None');
        }
    }
}

console.log('\n' + '='.repeat(60));
