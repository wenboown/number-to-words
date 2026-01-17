// Test script for word split patterns
const fs = require('fs');

// Load the dictionary
console.log('Loading dictionary...');
const numberToWords = JSON.parse(fs.readFileSync('dictionary.json', 'utf-8'));
console.log(`Dictionary loaded: ${Object.keys(numberToWords).length} patterns\n`);

// Word split finder (same as in script.js)
function findWordSplits(number) {
    const splits = [];
    const len = number.length;

    if (len < 4) {
        return splits;
    }

    for (let splitPoint = 2; splitPoint <= len - 2; splitPoint++) {
        const leftNum = number.substring(0, splitPoint);
        const rightNum = number.substring(splitPoint);

        const leftWords = numberToWords[leftNum] || [];
        const rightWords = numberToWords[rightNum] || [];

        if (leftWords.length > 0 && rightWords.length > 0) {
            splits.push({
                pattern: `${splitPoint}+${len - splitPoint}`,
                leftNum: leftNum,
                rightNum: rightNum,
                leftWords: leftWords.slice(0, 20),
                rightWords: rightWords.slice(0, 20),
                leftTotal: leftWords.length,
                rightTotal: rightWords.length
            });
        }
    }

    return splits;
}

// Test cases
const testCases = [
    '726268',  // pan + bot (your example)
    '43556',   // hello (single word)
    '228',     // cat, bat, act (single word - no splits because < 4 digits)
    '2665',    // book, cool (single word)
];

console.log('Testing word split patterns:\n');
console.log('='.repeat(70));

for (const testNum of testCases) {
    console.log(`\nNumber: ${testNum} (${testNum.length} digits)`);
    console.log('-'.repeat(70));

    // Check single words
    const singleWords = numberToWords[testNum] || [];
    if (singleWords.length > 0) {
        console.log(`Full ${testNum.length}-digit words (${singleWords.length}): ${singleWords.slice(0, 10).join(', ')}`);
    } else {
        console.log(`Full ${testNum.length}-digit words: None`);
    }

    // Check splits
    const splits = findWordSplits(testNum);
    if (splits.length > 0) {
        console.log(`\nSplit patterns found: ${splits.length}`);
        splits.forEach(split => {
            console.log(`\n  ${split.pattern} Split: ${split.leftNum} + ${split.rightNum}`);
            console.log(`    ${split.leftNum} (${split.leftTotal} words): ${split.leftWords.join(', ')}`);
            console.log(`    ${split.rightNum} (${split.rightTotal} words): ${split.rightWords.join(', ')}`);

            // Check if pan+bot is in this split
            if (split.leftWords.includes('pan') && split.rightWords.includes('bot')) {
                console.log(`    ✓ FOUND: "pan + bot" in this split!`);
            }
        });
    } else {
        console.log('\nSplit patterns: None (number too short or no valid splits)');
    }
}

console.log('\n' + '='.repeat(70));
console.log('\nSUMMARY:');
console.log('The new approach shows all possible digit splits (2+4, 3+3, 4+2, etc.)');
console.log('Users can mentally combine any left word with any right word.');
console.log('Example: For 726268 with 3+3 split, user sees "pan" in left and "bot" in right.');
