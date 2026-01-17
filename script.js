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

// Common English word dictionary (curated list)
// In a production app, this would be loaded from a separate file
const WORD_LIST = [
    // 2-letter words
    "am", "an", "as", "at", "be", "by", "do", "go", "he", "hi", "if", "in", "is", "it", "me", "my", "no", "of", "ok", "on", "or", "so", "to", "up", "us", "we",
    // 3-letter words
    "ace", "act", "add", "age", "ago", "aid", "aim", "air", "all", "and", "ant", "any", "ape", "app", "apt", "arc", "are", "ark", "arm", "art", "ash", "ask", "ate", "awe", "axe",
    "bad", "bag", "ban", "bar", "bat", "bay", "bed", "bee", "beg", "bet", "bid", "big", "bin", "bit", "boa", "bob", "bog", "bow", "box", "boy", "bud", "bug", "bum", "bun", "bus", "but", "buy",
    "cab", "cam", "can", "cap", "car", "cat", "cob", "cod", "cog", "cop", "cot", "cow", "cox", "coy", "cry", "cub", "cud", "cue", "cup", "cur", "cut",
    "dab", "dad", "dam", "day", "den", "dew", "did", "die", "dig", "dim", "din", "dip", "doc", "doe", "dog", "don", "dot", "dry", "dub", "dud", "due", "dug", "dye",
    "ear", "eat", "ebb", "egg", "ego", "elf", "elk", "elm", "emu", "end", "era", "err", "eve", "ewe", "eye",
    "fad", "fan", "far", "fat", "fax", "fed", "fee", "few", "fib", "fig", "fin", "fir", "fit", "fix", "flu", "fly", "foe", "fog", "for", "fox", "fry", "fun", "fur",
    "gab", "gag", "gap", "gas", "gay", "gel", "gem", "get", "gig", "gin", "gnu", "god", "got", "gum", "gun", "gut", "guy", "gym",
    "had", "hag", "ham", "has", "hat", "hay", "hem", "hen", "her", "hew", "hex", "hey", "hid", "him", "hip", "his", "hit", "hog", "hop", "hot", "how", "hub", "hue", "hug", "hum", "hut",
    "ice", "icy", "ill", "imp", "ink", "inn", "ion", "irk", "its", "ivy",
    "jab", "jag", "jam", "jar", "jaw", "jay", "jet", "jig", "job", "jog", "jot", "joy", "jug",
    "keg", "ken", "key", "kid", "kin", "kit",
    "lab", "lad", "lag", "lap", "law", "lax", "lay", "lea", "led", "leg", "let", "lid", "lie", "lip", "lit", "log", "lot", "low", "lug",
    "mad", "man", "map", "mar", "mat", "max", "may", "men", "met", "mid", "mix", "mob", "mod", "mom", "mop", "mud", "mug", "mum",
    "nab", "nag", "nap", "net", "new", "nil", "nip", "nit", "nod", "nor", "not", "now", "nun", "nut",
    "oak", "oar", "oat", "odd", "ode", "off", "oft", "oil", "old", "one", "opt", "orb", "ore", "our", "out", "ova", "owe", "owl", "own",
    "pac", "pad", "pal", "pan", "pap", "par", "pat", "paw", "pay", "pea", "peg", "pen", "pep", "per", "pet", "pew", "pie", "pig", "pin", "pip", "pit", "ply", "pod", "pop", "pot", "pow", "pox", "pro", "pry", "pub", "pug", "pun", "pup", "pus", "put",
    "rad", "rag", "ram", "ran", "rap", "rat", "raw", "ray", "red", "ref", "rem", "rep", "rev", "rib", "rid", "rig", "rim", "rip", "rob", "rod", "roe", "rot", "row", "rub", "rug", "rum", "run", "rut", "rye",
    "sac", "sad", "sag", "sap", "sat", "saw", "sax", "say", "sea", "see", "set", "sew", "sex", "she", "shy", "sim", "sin", "sip", "sir", "sis", "sit", "six", "ska", "ski", "sky", "sly", "sob", "sod", "son", "sop", "sot", "sow", "soy", "spa", "spy", "sty", "sub", "sue", "sum", "sun", "sup",
    "tab", "tad", "tag", "tan", "tap", "tar", "tat", "tax", "tea", "tee", "ten", "the", "thy", "tic", "tie", "tin", "tip", "toe", "ton", "too", "top", "tow", "toy", "try", "tub", "tug", "two",
    "ugh", "ump", "urn", "use",
    "van", "vat", "vet", "vex", "via", "vie", "vim", "vow",
    "wad", "wag", "wan", "war", "was", "wax", "way", "web", "wed", "wee", "wet", "who", "why", "wig", "win", "wit", "woe", "wok", "won", "woo", "wow",
    "yak", "yam", "yap", "yaw", "yay", "yea", "yes", "yet", "yew", "yin", "yak", "yam", "yap", "yaw", "yea", "yes", "yet", "yew", "yin", "yip", "yuk", "yum",
    "zap", "zen", "zip", "zit", "zoo",
    // 4-letter words
    "able", "about", "acid", "aged", "aide", "aims", "ally", "also", "alto", "amen", "amid", "amps", "andy", "anna", "anti", "ants", "apex", "apps", "arab", "arch", "area", "args", "aria", "arms", "army", "arts", "asia", "asks", "atom", "auto", "avid", "away", "axes", "axis",
    "baby", "back", "bags", "bail", "bait", "bake", "ball", "band", "bang", "bank", "bare", "bark", "barn", "base", "bash", "bass", "bath", "bats", "bean", "bear", "beat", "beav", "beck", "been", "beep", "beer", "bell", "belt", "bend", "bent", "berg", "best", "beta", "bias", "bike", "bill", "bind", "bird", "bite", "bits", "blow", "blue", "blur", "boar", "boat", "body", "boil", "bold", "bolt", "bomb", "bond", "bone", "book", "boom", "boot", "bore", "born", "boss", "both", "bowl", "boys", "brad", "brag", "bran", "brat", "brew", "brim", "bulk", "bull", "bump", "bunk", "burn", "burp", "bury", "bush", "busy", "buzz",
    "cabo", "cage", "cake", "calf", "call", "calm", "came", "camp", "cane", "cans", "cape", "caps", "card", "care", "carp", "cars", "cart", "case", "cash", "cast", "cats", "cave", "cell", "cent", "chad", "chef", "chip", "chop", "chug", "city", "clad", "clam", "clan", "clap", "claw", "clay", "clip", "club", "clue", "coal", "coat", "cobs", "code", "coil", "coin", "cold", "cole", "colt", "coma", "comb", "come", "cone", "cook", "cool", "cope", "copy", "cord", "core", "cork", "corn", "cost", "coup", "cove", "cows", "cozy", "crab", "cram", "crap", "crew", "crib", "crop", "crow", "crux", "cube", "cubs", "cues", "cult", "cups", "curb", "cure", "curl", "curt", "cute", "cyan",
    "dads", "damp", "dams", "dane", "dang", "dare", "dark", "darn", "dart", "dash", "data", "date", "dawn", "days", "daze", "dead", "deaf", "deal", "dean", "dear", "debt", "deck", "deed", "deem", "deep", "deer", "deli", "dell", "demo", "dens", "dent", "deny", "desk", "dial", "dice", "died", "diet", "digs", "dime", "dine", "ding", "dino", "dint", "dire", "dirt", "disc", "dish", "disk", "diva", "dive", "dock", "docs", "dodo", "does", "doge", "dogs", "dojo", "doll", "dome", "done", "doom", "door", "dope", "dork", "dorm", "dose", "dote", "dots", "doug", "dove", "down", "doze", "drab", "drag", "dram", "drat", "draw", "drew", "drip", "drop", "drum", "dual", "dubs", "duck", "duct", "dude", "duel", "dues", "duet", "duke", "dull", "duly", "dumb", "dump", "dune", "dung", "dunk", "dupe", "dusk", "dust", "duty", "dyes",
    "each", "earl", "earn", "ears", "ease", "east", "easy", "eats", "eave", "ebay", "ebbs", "echo", "edge", "edgy", "edit", "eels", "eggs", "egos", "eire", "eked", "elan", "elev", "elks", "ella", "elms", "else", "emit", "emus", "ends", "envy", "epic", "eras", "eric", "ergo", "eric", "eros", "errs", "euro", "evan", "even", "ever", "eves", "evil", "evoke", "ewer", "ewes", "exam", "exec", "exit", "expo", "eyed", "eyes",
    "face", "fact", "fade", "fail", "fair", "fake", "fall", "fame", "fang", "fans", "fare", "farm", "fast", "fate", "fats", "fawn", "faze", "fear", "feat", "feed", "feel", "fees", "feet", "fell", "felt", "fend", "fern", "fest", "feud", "fibs", "fief", "fife", "figs", "file", "fill", "film", "find", "fine", "fink", "finn", "fins", "fire", "firm", "firs", "fish", "fist", "fits", "five", "fizz", "flab", "flag", "flak", "flam", "flan", "flap", "flat", "flaw", "flax", "flay", "flea", "fled", "flee", "flew", "flex", "flip", "flit", "flog", "flop", "flow", "flub", "flue", "flux", "foal", "foam", "fobs", "foes", "fogs", "foil", "fold", "folk", "fond", "font", "food", "fool", "foot", "ford", "fore", "fork", "form", "fort", "foul", "four", "fowl", "foxy", "fray", "fred", "free", "fret", "frog", "from", "fuel", "full", "fume", "fund", "funk", "funs", "fury", "fuse", "fuss", "fuzz",
    "gabs", "gags", "gain", "gait", "gala", "gale", "gall", "game", "gang", "gaps", "garb", "gary", "gash", "gasp", "gate", "gave", "gawk", "gaze", "gear", "geek", "gees", "gels", "gems", "gene", "gent", "germ", "gets", "gift", "gigs", "gill", "gilt", "gins", "girl", "gist", "give", "glad", "glen", "glib", "glow", "glue", "glum", "gnat", "gnaw", "gnus", "goad", "goal", "goat", "gobs", "gods", "goes", "gold", "golf", "gone", "gong", "good", "goof", "goon", "gore", "gory", "gosh", "gout", "gown", "grab", "grad", "gram", "gran", "gray", "grew", "grey", "grid", "grim", "grin", "grip", "grit", "grub", "gulf", "gull", "gulp", "gums", "guns", "guru", "gush", "gust", "guys", "gyms",
    "hack", "hags", "hail", "hair", "half", "hall", "halo", "halt", "hams", "hand", "hang", "hank", "hard", "hare", "hark", "harm", "harp", "hart", "hash", "hate", "haul", "have", "hawk", "haze", "hazy", "head", "heal", "heap", "hear", "heat", "heck", "heed", "heel", "heir", "held", "hell", "helm", "help", "hems", "hens", "herb", "herd", "here", "hero", "hers", "hewn", "hews", "hick", "hide", "high", "hike", "hill", "hilt", "hind", "hint", "hips", "hire", "hiss", "hits", "hive", "hoax", "hobo", "hobs", "hock", "hogs", "hold", "hole", "holy", "home", "hone", "hong", "honk", "hood", "hoof", "hook", "hoop", "hoot", "hope", "hops", "horn", "hose", "host", "hour", "hove", "howl", "hubs", "hued", "hues", "huge", "hugs", "hula", "hulk", "hull", "hums", "hung", "hunk", "hunt", "hurl", "hurt", "hush", "husk", "huts", "hyde", "hymn", "hype", "hypo",
    "ibex", "ibis", "iced", "ices", "icon", "idea", "idem", "ides", "idle", "idol", "iffy", "ills", "imps", "inch", "info", "inks", "inns", "into", "ions", "iota", "iowa", "iris", "irks", "iron", "isle", "itch", "item", "itsy", "itty", "ivan", "ives", "ixia", "izar",
    "jabs", "jack", "jade", "jags", "jail", "jake", "jams", "jane", "jars", "java", "jaws", "jays", "jazz", "jean", "jeep", "jeer", "jeff", "jell", "jerk", "jest", "jets", "jibe", "jiff", "jigs", "jilt", "jims", "jink", "jinx", "jive", "jobs", "jock", "jody", "jogs", "john", "join", "joke", "jolt", "jots", "jowl", "joys", "juan", "judo", "judy", "jugs", "july", "jump", "june", "junk", "jury", "just", "jute", "juts",
    "kale", "kate", "keel", "keen", "keep", "kegs", "kelp", "kens", "kent", "kept", "kern", "keys", "kick", "kids", "kill", "kiln", "kilo", "kilt", "kind", "king", "kink", "kins", "kirk", "kiss", "kite", "kits", "kiwi", "knee", "knew", "knit", "knob", "knot", "know", "kyle",
    "labs", "lace", "lack", "lacy", "lads", "lady", "lags", "laid", "lain", "lair", "lake", "lama", "lamb", "lame", "lamp", "land", "lane", "lank", "laps", "lard", "lark", "lars", "lash", "lass", "last", "late", "laud", "lava", "lawn", "laws", "lays", "lazy", "lead", "leaf", "leak", "lean", "leap", "leas", "lech", "leek", "leer", "lees", "left", "legs", "leis", "lena", "lend", "lens", "lent", "leon", "less", "lest", "lets", "levy", "lewd", "liar", "lice", "lick", "lids", "lied", "lien", "lies", "lieu", "life", "lift", "like", "lila", "lilt", "lily", "lima", "limb", "lime", "limp", "line", "ling", "link", "lino", "lint", "lion", "lips", "lira", "lisa", "lisp", "list", "lite", "live", "load", "loaf", "loam", "loan", "lobe", "loch", "lock", "loco", "lode", "loft", "loge", "logo", "logs", "loin", "loll", "lone", "long", "look", "loom", "loon", "loop", "loot", "lope", "lord", "lore", "lorn", "lory", "lose", "loss", "lost", "loth", "lots", "loud", "lout", "love", "lows", "luau", "lube", "luck", "lucy", "ludo", "luge", "lugs", "luke", "lull", "lulu", "lump", "lung", "lunk", "lure", "lurk", "lush", "lust", "lute", "luxe", "lyin", "lynx", "lyon", "lyre",
    "maam", "mace", "mack", "macs", "macs", "made", "mage", "magi", "maid", "mail", "maim", "main", "make", "male", "mall", "malt", "mama", "mane", "mango", "mans", "many", "maps", "marc", "mare", "mark", "mars", "mart", "mary", "mash", "mask", "mass", "mast", "mate", "math", "mats", "matt", "maul", "maya", "mayo", "maze", "mead", "meal", "mean", "meat", "mecca", "meek", "meet", "mega", "meld", "melt", "memo", "mend", "mens", "menu", "meow", "mere", "mesa", "mesh", "mess", "meta", "mete", "mewl", "mews", "mica", "mice", "mick", "midi", "mids", "mien", "miff", "mike", "mild", "mile", "milk", "mill", "milo", "mime", "mind", "mine", "ming", "mini", "mink", "mint", "minx", "mire", "miry", "miss", "mist", "mite", "mitt", "moan", "moat", "mobs", "mock", "mode", "mods", "mojo", "mold", "mole", "moll", "molt", "moms", "monk", "mono", "mood", "moon", "moor", "moot", "mope", "mops", "mora", "more", "morn", "mort", "moss", "most", "moth", "move", "mown", "mows", "much", "muck", "muds", "muff", "mugs", "mule", "mull", "mums", "mung", "murk", "muse", "mush", "musk", "muss", "must", "mute", "mutt", "myth",
    // 5-letter words (selected common ones)
    "about", "above", "abuse", "adapt", "admit", "adopt", "adult", "after", "again", "agent", "agree", "ahead", "alarm", "album", "alert", "alien", "align", "alike", "alive", "allow", "alone", "along", "alter", "angel", "anger", "angle", "angry", "apart", "apple", "apply", "arena", "argue", "arise", "armed", "armor", "array", "arrow", "aside", "asset", "avoid", "awake", "award", "aware", "badly",
    "baker", "bases", "basic", "beach", "began", "begin", "being", "below", "bench", "billy", "birth", "black", "blade", "blame", "blank", "blast", "bleed", "bless", "blind", "block", "blood", "bloom", "blues", "board", "boast", "bobby", "bonus", "boost", "booth", "bound", "brain", "brand", "brave", "bread", "break", "breed", "brian", "brick", "bride", "brief", "bring", "broad", "broke", "brown", "bruce", "brush", "build", "built", "bunch", "burns", "burst", "buyer",
    "cable", "calif", "carry", "catch", "cause", "chain", "chair", "chaos", "charm", "chart", "chase", "cheap", "check", "chess", "chest", "chief", "child", "china", "chose", "civil", "claim", "class", "clean", "clear", "click", "cliff", "climb", "clock", "close", "cloud", "coach", "coast", "cohen", "colon", "color", "couch", "could", "count", "court", "cover", "crack", "craft", "crash", "crazy", "cream", "crime", "cross", "crowd", "crown", "crude", "curve", "cycle",
    "daily", "dance", "danny", "dated", "dealt", "death", "debut", "delay", "delta", "dense", "depot", "depth", "derby", "devil", "diana", "diary", "dirty", "doing", "donna", "doubt", "dover", "dozen", "draft", "drama", "drank", "drawn", "dream", "dress", "dried", "drill", "drink", "drive", "drove", "dummy", "dutch", "dying",
    "eager", "early", "earth", "eight", "elder", "elect", "empty", "enemy", "enjoy", "enter", "entry", "equal", "error", "event", "every", "exact", "exist", "extra",
    "faced", "faith", "false", "fault", "fiber", "field", "fifth", "fifty", "fight", "final", "first", "fixed", "flame", "flash", "fleet", "flesh", "floor", "fluid", "focus", "force", "forms", "forth", "forty", "forum", "found", "frame", "frank", "fraud", "fresh", "front", "fruit", "fully", "funny",
    "giant", "given", "glass", "globe", "glory", "going", "grace", "grade", "grain", "grand", "grant", "grass", "grave", "great", "green", "gross", "group", "grown", "guard", "guess", "guest", "guide", "guild", "guilt", "happy", "harry", "heart", "heavy", "hedge", "hello", "hence", "henry", "horse", "hotel", "house", "human", "ideal", "image", "imply", "index", "inner", "input", "issue", "japan", "jimmy", "joint", "jones", "judge", "juice",
    "known", "label", "labor", "large", "laser", "later", "laugh", "layer", "learn", "lease", "least", "leave", "legal", "lemon", "level", "lewis", "light", "limit", "lines", "links", "liver", "lives", "local", "logic", "loose", "louis", "loved", "lower", "loyal", "lucky", "lunch", "lying",
    "magic", "major", "maker", "march", "maria", "match", "maybe", "mayor", "means", "meant", "media", "metal", "meter", "might", "minor", "minus", "mixed", "model", "money", "month", "moral", "motor", "mount", "mouse", "mouth", "moved", "movie", "music",
    "naked", "named", "naval", "needs", "nerve", "never", "newly", "night", "ninth", "noble", "noise", "north", "noted", "notre", "novel", "nurse", "ocean", "occur", "offer", "often", "order", "organ", "other", "ought", "outer", "owned", "owner", "oxide",
    "paint", "panel", "panic", "paper", "paris", "party", "pasta", "patch", "peace", "peter", "phase", "phone", "photo", "piano", "piece", "pilot", "pitch", "place", "plain", "plane", "plant", "plate", "plaza", "point", "poker", "polar", "policy", "pound", "power", "press", "price", "pride", "prime", "print", "prior", "prize", "proof", "proud", "prove", "queen", "quest", "quick", "quiet", "quite", "quote",
    "radio", "raise", "rally", "ralph", "ranch", "range", "ranks", "rapid", "ratio", "reach", "react", "ready", "realm", "rebel", "refer", "reign", "relax", "relay", "reply", "rider", "ridge", "rifle", "right", "rigid", "rings", "risen", "river", "roast", "robot", "rocky", "roger", "roman", "rough", "round", "route", "royal", "ruler", "rural", "rusty",
    "sacred", "safer", "salad", "salem", "sales", "salon", "sandy", "santa", "sauce", "scale", "scare", "scene", "scope", "score", "scout", "screw", "seize", "sense", "serve", "seven", "shaft", "shake", "shall", "shape", "share", "sharp", "sheep", "sheer", "sheet", "shelf", "shell", "shift", "shine", "shirt", "shock", "shoot", "shore", "short", "shown", "sided", "siege", "sight", "silly", "since", "sixth", "sixty", "sized", "skill", "skirt", "skull", "slate", "slave", "sleep", "slept", "slice", "slide", "slope", "small", "smart", "smell", "smile", "smith", "smoke", "snake", "solar", "solid", "solve", "sorry", "sound", "south", "space", "spare", "speak", "speed", "spell", "spend", "spent", "spies", "spike", "spine", "split", "spoke", "sport", "spray", "squad", "square", "stack", "staff", "stage", "stake", "stamp", "stand", "stare", "start", "state", "stays", "steam", "steel", "steep", "steer", "steve", "stick", "still", "stock", "stone", "stood", "store", "storm", "story", "stove", "strap", "strip", "stuck", "study", "stuff", "style", "sugar", "suite", "sunny", "super", "surge", "susan", "sweet", "swift", "swing", "swiss", "sword",
    "table", "taken", "tales", "taste", "taxes", "teach", "teens", "teeth", "tempo", "tends", "tenor", "tense", "tenth", "terms", "terry", "texas", "thank", "theft", "their", "theme", "there", "these", "thick", "thief", "thing", "think", "third", "those", "three", "threw", "throw", "thumb", "tiger", "tight", "times", "tired", "title", "toast", "today", "token", "tommy", "tools", "tooth", "topic", "total", "touch", "tough", "tower", "track", "tract", "trade", "trail", "train", "trait", "trash", "treat", "treaty", "trend", "trial", "tribe", "trick", "tried", "tries", "triple", "troop", "tropical", "trouble", "truck", "truly", "trunk", "trust", "truth", "tubes", "tumor", "turns", "twice", "twist", "uncle", "under", "undue", "unfair", "union", "unite", "unity", "until", "upper", "upset", "urban", "urged", "usage", "usual", "utter",
    "valid", "value", "vapor", "vault", "venue", "verde", "verse", "video", "views", "villa", "vinyl", "viral", "virus", "visit", "vital", "vivid", "vocal", "voice", "voted", "voter", "votes", "waged", "wages", "wagon", "waist", "wales", "walks", "walls", "watch", "water", "waved", "waves", "wayne", "weary", "weigh", "weird", "welsh", "western", "wheat", "wheel", "where", "which", "while", "white", "whole", "whose", "wider", "widow", "width", "woman", "women", "woods", "words", "world", "worry", "worse", "worst", "worth", "would", "wound", "wrath", "write", "wrong", "wrote", "yacht", "yards", "years", "yield", "young", "yours", "youth", "zones"
];

// Pre-computed mapping: number -> words
let numberToWords = {};

// Initialize the app
function init() {
    console.log('Initializing app...');
    console.log(`Total words in dictionary: ${WORD_LIST.length}`);

    // Pre-compute the number to words mapping
    precomputeMapping();

    // Setup event listeners
    const numberInput = document.getElementById('numberInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');

    numberInput.addEventListener('input', validateInput);
    numberInput.addEventListener('keypress', handleKeyPress);
    convertBtn.addEventListener('click', convertNumber);
    clearBtn.addEventListener('click', clearInput);

    // Hide loading status
    document.getElementById('loadingStatus').style.display = 'none';

    console.log('App initialized!');
}

// Pre-compute the mapping from numbers to words
function precomputeMapping() {
    const startTime = performance.now();
    numberToWords = {};

    for (const word of WORD_LIST) {
        const number = wordToNumber(word);
        if (number) {
            if (!numberToWords[number]) {
                numberToWords[number] = [];
            }
            numberToWords[number].push(word);
        }
    }

    const endTime = performance.now();
    console.log(`Pre-computation completed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`Total unique number patterns: ${Object.keys(numberToWords).length}`);
}

// Convert a word to its numeric representation
function wordToNumber(word) {
    let number = '';
    for (const char of word.toLowerCase()) {
        if (LETTER_TO_NUMBER[char]) {
            number += LETTER_TO_NUMBER[char];
        } else {
            // Skip words with non-letter characters
            return null;
        }
    }
    return number;
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

    // Validation
    if (input.length > 15) {
        displayError('Number too long! Maximum 15 digits.');
        return;
    }

    // Look up the number in our pre-computed mapping
    const words = numberToWords[input] || [];

    // Display results
    resultsDiv.style.display = 'block';

    if (words.length === 0) {
        resultsCount.textContent = 'No words found';
        wordList.innerHTML = '<div class="no-results">No matching words found in dictionary.</div>';
    } else {
        resultsCount.textContent = `Found ${words.length} word${words.length === 1 ? '' : 's'}`;

        // Sort words alphabetically
        words.sort();

        // Display words
        words.forEach(word => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word-item';
            wordDiv.textContent = word;
            wordList.appendChild(wordDiv);
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
