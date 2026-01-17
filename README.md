# Number to Words Converter

Convert numbers into meaningful words using the classic phone keypad mapping (like old T9 texting).

## How It Works

Remember the old phone keypads where you had to press keys multiple times to type letters? This app reverses that concept - enter a number and find all the English words that match it.

### Phone Keypad Mapping

- 2: ABC
- 3: DEF
- 4: GHI
- 5: JKL
- 6: MNO
- 7: PQRS
- 8: TUV
- 9: WXYZ

### Examples

**Single Words:**
- `228` → "cat", "bat", "act"
- `2665` → "book", "cool"
- `43556` → "hello"
- `364` → "dog"

**Word Combinations:**
- `726268` → "pan + bot", "pan + cot", "ram + bot"
- `43556967` → "hello + you", "hello + your"

## Algorithm

The app uses two complementary approaches:

### 1. Single Word Lookup (Reverse Mapping)

1. **Pre-computation**: On page load, every word in the dictionary is converted to its numeric representation and stored in a hash map
2. **Instant lookup**: When you enter a number, it simply looks it up in the pre-computed map
3. **Performance**: No need to generate all permutations at runtime - lookup is O(1)

### 2. Word Combinations (Dynamic Programming)

For numbers 4+ digits, the app also finds word combinations:

1. **Recursive splitting**: Tries all possible ways to split the number into valid words
2. **Pruning**: Limits to 3 words max per combination, 100 results max
3. **Example**: `726268` → splits into `726` ("pan") + `268` ("bot")

### Why These Approaches?

- Generating all permutations for a 7-digit number would require 4^7 = 16,384 combinations to check
- Pre-computing takes ~100-200ms for 359,000 words and makes lookups instant
- Dictionary contains **359,000+ English words** from the dwyl/english-words repository
- Word combinations enable creative phrases like "pan + bot" or "hello + you"

## Usage

Simply open `index.html` in your web browser. No build process or server required!

1. Enter a number (digits 2-9 only)
2. Click "Convert" or press Enter
3. See all matching words instantly

## Files

- `index.html` - Main web page
- `style.css` - Styling and responsive design
- `script.js` - Core logic (loads dictionary, finds words and combinations)
- `dictionary.json` - Pre-computed mapping (359K+ words, 8.7 MB)
- `generate-dictionary.js` - Script to rebuild dictionary from word list
- `words_alpha.txt` - Source English dictionary (370K+ words)
- `test.js` - Simple test script
- `test-combinations.js` - Test script for word combinations

## Features

- **359,000+ word dictionary** from the comprehensive dwyl/english-words repository
- **Word combinations** - finds creative multi-word matches (e.g., "pan + bot")
- Clean, modern UI with gradient design
- Separate sections for single words vs combinations
- Visual keypad reference
- Responsive design for mobile devices
- Input validation (only accepts digits 2-9)
- Smart performance limits (max 15 digits, max 100 combinations)
- Instant search results with async dictionary loading

## Technical Details

**Data Structure:**
```javascript
{
  "228": ["cat", "bat", "act"],
  "2665": ["book", "cool"],
  "43556": ["hello"]
}
```

**Complexity:**
- Pre-computation: O(n * m) where n = number of words, m = average word length
- Single word lookup: O(1)
- Word combinations: O(k^d) where k = avg words per position, d = max depth (limited to 3)
- Memory: ~8.7 MB for dictionary JSON

**Dictionary Source:**
- Based on [dwyl/english-words](https://github.com/dwyl/english-words) repository
- 370,105 words filtered to 359,039 (2-15 characters, letters only)
- Up to 50 words stored per number pattern to keep file size reasonable

## Building the Dictionary

To regenerate the dictionary from scratch:

```bash
# Download the word list (already included)
curl -L "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt" -o words_alpha.txt

# Generate dictionary.json
node generate-dictionary.js
```

## Future Enhancements

- Highlight most common/popular words
- Show word definitions on hover
- Export results to clipboard
- Adjustable combination depth (2-5 words)
- Support for custom dictionaries
- Word frequency ranking
