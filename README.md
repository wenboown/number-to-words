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

- `228` → "cat", "bat", "act"
- `2665` → "book", "cool"
- `43556` → "hello"
- `364` → "dog"

## Algorithm

The app uses an **optimized reverse lookup** approach:

1. **Pre-computation**: On page load, every word in the dictionary is converted to its numeric representation and stored in a hash map
2. **Instant lookup**: When you enter a number, it simply looks it up in the pre-computed map
3. **Performance**: No need to generate all permutations at runtime - lookup is O(1)

### Why This Approach?

- Generating all permutations for a 7-digit number would require 4^7 = 16,384 combinations to check
- Pre-computing takes ~10-20ms for thousands of words and makes lookups instant
- Dictionary contains ~1000+ common English words

## Usage

Simply open `index.html` in your web browser. No build process or server required!

1. Enter a number (digits 2-9 only)
2. Click "Convert" or press Enter
3. See all matching words instantly

## Files

- `index.html` - Main web page
- `style.css` - Styling
- `script.js` - Core logic with embedded word dictionary
- `test.js` - Simple Node.js test script (run with `node test.js`)

## Features

- Clean, modern UI with gradient design
- Instant search results
- Dictionary of 1000+ common English words
- Visual keypad reference
- Responsive design for mobile devices
- Input validation (only accepts digits 2-9)
- Maximum 15 digits to prevent performance issues

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
- Lookup: O(1)
- Memory: O(n) for storing the mapping

## Future Enhancements

- Add more words to dictionary
- Support loading custom dictionaries
- Show word definitions
- Highlight most common words
- Export results
- API integration for expanded word lists
