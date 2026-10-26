const SUBJS = ['html','css','javascript','csharp'];

// 8 normal enemies, 2 bosses
const NORMAL_ENEMIES = [
  {id:'bug',     name:'SYNTAX BUG',       sprite:'⚠',  maxHp:28,  atk:10, weak:'html',        atkMsg:'Bug injects malformed HTML!',         isBoss:false, atkPat:'single'},
  {id:'null',    name:'NULL POINTER',     sprite:'∅',  maxHp:40,  atk:13, weak:'javascript',  atkMsg:'Null reference exception!',           isBoss:false, atkPat:'single'},
  {id:'loop',    name:'INFINITE LOOP',    sprite:'∞',  maxHp:48,  atk:9,  weak:'css',         atkMsg:'Loop drains your stamina!',           isBoss:false, atkPat:'double'},
  {id:'stack',   name:'STACK OVERFLOW',   sprite:'↯',  maxHp:58,  atk:16, weak:'csharp',      atkMsg:'Stack overflow — critical hit!',      isBoss:false, atkPat:'heavy'},
  {id:'leak',    name:'MEMORY LEAK',      sprite:'☢',  maxHp:44,  atk:11, weak:'csharp',      atkMsg:'Memory leak saps your HP!',           isBoss:false, atkPat:'double'},
  {id:'inject',  name:'SQL INJECTOR',     sprite:'⛔', maxHp:52,  atk:14, weak:'javascript',  atkMsg:'Injects malicious payload!',          isBoss:false, atkPat:'single'},
  {id:'race',    name:'RACE CONDITION',   sprite:'⇄',  maxHp:36,  atk:12, weak:'css',         atkMsg:'Simultaneous hits confuse you!',      isBoss:false, atkPat:'double'},
  {id:'corrupt', name:'CORRUPT POINTER',  sprite:'✦',  maxHp:62,  atk:17, weak:'html',        atkMsg:'Pointer corruption — brutal strike!', isBoss:false, atkPat:'heavy'},
];

const BOSS_ENEMIES = [
  {id:'boss1', name:'SEGFAULT OVERLORD', sprite:'☠', maxHp:90,  atk:20, weak:null, atkMsg:'SEGFAULT! Memory access violation!',       isBoss:true, atkPat:'boss'},
  {id:'boss2', name:'KERNEL PANIC',      sprite:'🛑', maxHp:120, atk:25, weak:null, atkMsg:'KERNEL PANIC — system integrity breach!',  isBoss:true, atkPat:'boss'},
];

const ENEMIES = [...NORMAL_ENEMIES, ...BOSS_ENEMIES];

const MANA_COST         = {atk:2, def:1, regen:3, charge:0};
const SKILL_TIMER_BONUS = {atk:0, def:3, regen:0, charge:2};
const SKILL_INFO = {
  atk:   {color:'var(--red)',   label:'⚔ ATTACK'},
  def:   {color:'var(--cyan)',  label:'🛡 DEFEND'},
  regen: {color:'var(--green)', label:'💚 REGENERATE'},
  charge:{color:'var(--gold)',  label:'⚡ CHARGE MANA'},
};
const XP_PER_DIFFICULTY = {easy:10, medium:15, hard:20};

const QS = {

  // ════════════════════════════════════════════════════════
  // HTML — 30 QUESTIONS (10 easy · 10 medium · 10 hard)
  // ════════════════════════════════════════════════════════
  html:[
    // ── EASY ──
    {q:'What tag creates a paragraph?',                                     c:['<p>','<div>','<span>','<br>'],                                                             a:0, d:'easy',   e:'<p> defines a paragraph in HTML.'},
    {q:'Which tag is used for the largest heading?',                        c:['<h6>','<head>','<h1>','<header>'],                                                         a:2, d:'easy',   e:'<h1> is the largest heading; h6 is the smallest.'},
    {q:'What does HTML stand for?',                                         c:['Hyper Text Markup Language','High Tech Modern Language','Hyperlink Text Manage Law','Home Tool Markup Language'], a:0, d:'easy', e:'HTML = Hyper Text Markup Language.'},
    {q:'Which tag creates a clickable link?',                               c:['<link>','<url>','<a>','<href>'],                                                           a:2, d:'easy',   e:'The <a> anchor tag creates hyperlinks via its href attribute.'},
    {q:'Tag for an unordered list?',                                        c:['<ul>','<ol>','<li>','<list>'],                                                             a:0, d:'easy',   e:'<ul> = bulleted list; <ol> = numbered list.'},
    {q:'Correct HTML for a line break?',                                    c:['<lb>','<break>','<br>','<hr>'],                                                            a:2, d:'easy',   e:'<br> inserts a line break; <hr> is a horizontal rule.'},
    {q:'Which tag makes text bold?',                                        c:['<b>','<bold>','<strong>','Both <b> and <strong>'],                                         a:3, d:'easy',   e:'Both <b> and <strong> render bold text; <strong> also adds semantic importance.'},
    {q:'Which tag makes text italic?',                                      c:['<i>','<italic>','<em>','Both <i> and <em>'],                                               a:3, d:'easy',   e:'<i> is stylistic italic; <em> adds emphasis semantics.'},
    {q:'What tag is used to insert an image?',                              c:['<image>','<img>','<pic>','<src>'],                                                         a:1, d:'easy',   e:'<img> is the self-closing tag for images.'},
    {q:'Which attribute adds alternative text to an image?',                c:['title','src','alt','caption'],                                                            a:2, d:'easy',   e:'The alt attribute provides text when an image cannot be displayed.'},

    // ── MEDIUM ──
    {q:'Which attribute specifies an image source?',                        c:['href','src','alt','link'],                                                                 a:1, d:'medium', e:'The src attribute specifies the image URL or file path.'},
    {q:'Correct way to make a checkbox?',                                   c:['<input type="check">','<checkbox>','<input type="checkbox">','<check>'],                  a:2, d:'medium', e:'Use <input type="checkbox"> for checkboxes.'},
    {q:'Which tag defines a table row?',                                    c:['<td>','<th>','<tr>','<table>'],                                                            a:2, d:'medium', e:'<tr> = table row; <td> = table data; <th> = table header.'},
    {q:'Which tag creates a drop-down list?',                               c:['<input>','<list>','<select>','<dropdown>'],                                                a:2, d:'medium', e:'<select> creates a dropdown; <option> tags go inside it.'},
    {q:'What does the <head> tag contain?',                                 c:['Visible page content','Navigation links','Meta info and scripts','Images'],                a:2, d:'medium', e:'<head> holds metadata, <title>, CSS links, and scripts — not visible content.'},
    {q:'Which input type creates a password field?',                        c:['type="text"','type="hidden"','type="pass"','type="password"'],                             a:3, d:'medium', e:'type="password" masks the typed characters.'},
    {q:'Which tag defines a numbered list?',                                c:['<ul>','<nl>','<ol>','<li>'],                                                               a:2, d:'medium', e:'<ol> = ordered (numbered) list; <ul> = unordered (bulleted).'},
    {q:'How do you open a link in a new tab?',                              c:['target="_new"','target="_blank"','target="_tab"','rel="new"'],                             a:1, d:'medium', e:'target="_blank" opens the link in a new browser tab.'},
    {q:'Which tag is used for a multiline text input?',                     c:['<input type="text">','<input type="area">','<textarea>','<multiline>'],                   a:2, d:'medium', e:'<textarea> allows multi-line text entry; <input type="text"> is single-line.'},
    {q:'What attribute makes an input field required?',                     c:['mandatory','validate','required','must'],                                                  a:2, d:'medium', e:'The required attribute prevents form submission if the field is empty.'},

    // ── HARD ──
    {q:'Which HTML5 element draws graphics via JavaScript?',                c:['<paint>','<canvas>','<draw>','<svg>'],                                                     a:1, d:'hard',   e:'<canvas> provides a JavaScript-controlled 2D drawing surface.'},
    {q:'Which is NOT a valid target attribute value for <a>?',              c:['_blank','_self','_parent','_new'],                                                         a:3, d:'hard',   e:'Valid values: _blank, _self, _parent, _top. _new is not valid.'},
    {q:'What does the "defer" attribute on a <script> tag do?',             c:['Loads script async','Delays script until DOM is parsed','Disables the script','Caches it'], a:1, d:'hard',  e:'defer delays script execution until HTML parsing is complete, preserving order.'},
    {q:'Which HTML element is used for scalar vector graphics?',            c:['<canvas>','<vector>','<svg>','<graphic>'],                                                  a:2, d:'hard',   e:'<svg> embeds Scalable Vector Graphics directly in HTML.'},
    {q:'What is the correct HTML for a comment?',                           c:['// comment','/* comment */','<!-- comment -->','## comment'],                              a:2, d:'hard',   e:'HTML comments use <!-- --> syntax and are not displayed in the browser.'},
    {q:'Which meta tag makes a page mobile responsive?',                    c:['<meta name="mobile">','<meta name="viewport" content="width=device-width">','<meta name="scale">','<meta responsive>'], a:1, d:'hard', e:'The viewport meta tag instructs browsers to match the device width.'},
    {q:'What does the "async" attribute on <script> do?',                   c:['Runs script after DOM','Loads and runs script asynchronously','Disables execution','Runs before CSS'], a:1, d:'hard', e:'async loads the script in parallel and executes it as soon as it is ready, without waiting for DOM.'},
    {q:'Which element represents a self-contained composition like an article?', c:['<section>','<aside>','<article>','<main>'],                                           a:2, d:'hard',   e:'<article> represents independent, self-contained content like a blog post or news story.'},
    {q:'What is the purpose of the <datalist> element?',                    c:['Stores hidden data','Provides autocomplete options for input','Creates a table','Defines a dataset'], a:1, d:'hard', e:'<datalist> provides a list of predefined options for an <input> element as autocomplete suggestions.'},
    {q:'Which attribute is used to group related form elements visually?',  c:['<group>','<fieldset>','<formgroup>','<section>'],                                          a:1, d:'hard',   e:'<fieldset> groups related fields; <legend> labels the group.'},
  ],

  // ════════════════════════════════════════════════════════
  // CSS — 30 QUESTIONS (10 easy · 10 medium · 10 hard)
  // ════════════════════════════════════════════════════════
  css:[
    // ── EASY ──
    {q:'Which CSS property changes text color?',                            c:['font-color','color','text-style','background'],                                            a:1, d:'easy',   e:'The color property sets the foreground text color.'},
    {q:'How do you select an element with id "demo"?',                      c:['.demo','#demo','demo','*demo'],                                                            a:1, d:'easy',   e:'# selects by ID; . selects by class name.'},
    {q:'Property for background color?',                                    c:['bgcolor','color','background-color','fill'],                                               a:2, d:'easy',   e:'background-color sets the background color of an element.'},
    {q:'Property to change font size?',                                     c:['text-size','font-size','size','font-style'],                                               a:1, d:'easy',   e:'font-size controls how large text appears.'},
    {q:'Property to change the element font?',                              c:['font-style','font-weight','font-family','font-type'],                                      a:2, d:'easy',   e:'font-family specifies the typeface (e.g., Arial, Georgia).'},
    {q:'How to make text bold in CSS?',                                     c:['font-weight: bold','style: bold','font: bold','text-decoration: bold'],                   a:0, d:'easy',   e:'font-weight: bold or font-weight: 700 renders bold text.'},
    {q:'How do you add a comment in CSS?',                                  c:['// comment','<!-- comment -->','/* comment */','## comment'],                              a:2, d:'easy',   e:'CSS comments use /* */ syntax.'},
    {q:'Which property sets the text alignment?',                           c:['align','text-align','font-align','align-text'],                                            a:1, d:'easy',   e:'text-align accepts left, right, center, or justify.'},
    {q:'Which property controls text decoration like underline?',           c:['font-style','text-style','text-decoration','text-effect'],                                a:2, d:'easy',   e:'text-decoration: underline adds a line below text; none removes it.'},
    {q:'Which property sets the width of an element?',                      c:['size','length','height','width'],                                                          a:3, d:'easy',   e:'width sets the horizontal size of an element.'},

    // ── MEDIUM ──
    {q:'Which property controls space OUTSIDE an element?',                 c:['padding','spacing','margin','border'],                                                     a:2, d:'medium', e:'margin is outside the element border; padding is inside.'},
    {q:'Which position keeps an element fixed during scroll?',              c:['absolute','relative','fixed','static'],                                                    a:2, d:'medium', e:'position: fixed anchors the element relative to the viewport.'},
    {q:'How to display a list without bullets?',                            c:['list-style-type: none','bullet: none','list: no-bullet','text-decoration: none'],         a:0, d:'medium', e:'list-style-type: none removes bullet points from list items.'},
    {q:'Which property changes the space INSIDE an element border?',        c:['margin','spacing','padding','gap'],                                                        a:2, d:'medium', e:'padding is the space between the content and the border.'},
    {q:'How do you select ALL <p> elements inside a <div>?',                c:['div + p','div.p','div > p','div p'],                                                      a:3, d:'medium', e:'div p (descendant selector) selects all <p> inside <div> at any depth.'},
    {q:'Which value of display makes an element a flex container?',         c:['block','flex','inline','grid'],                                                            a:1, d:'medium', e:'display: flex activates the Flexbox layout model.'},
    {q:'What does z-index control?',                                        c:['Element size','Zoom level','Stacking order on z-axis','Transparency'],                    a:2, d:'medium', e:'z-index controls which element appears on top when elements overlap.'},
    {q:'Which property sets an element\'s transparency?',                   c:['visibility','display','opacity','alpha'],                                                  a:2, d:'medium', e:'opacity: 0 is fully transparent; opacity: 1 is fully opaque.'},
    {q:'How do you apply a style to multiple selectors at once?',           c:['div + p {}','div, p {}','div & p {}','div | p {}'],                                       a:1, d:'medium', e:'Comma-separated selectors apply the same rules to all listed elements.'},
    {q:'Which property defines the space between flex or grid items?',      c:['spacing','margin','padding','gap'],                                                        a:3, d:'medium', e:'gap sets the space between flex/grid children without affecting outer edges.'},

    // ── HARD ──
    {q:'Default value of the "position" property?',                         c:['relative','static','absolute','fixed'],                                                    a:1, d:'hard',   e:'Elements are position: static by default — not affected by top/left/etc.'},
    {q:'What does "box-sizing: border-box" do?',                            c:['Adds a border automatically','Includes padding and border in width/height','Removes margin','Centers the box'], a:1, d:'hard', e:'border-box makes width/height include padding and border, simplifying layouts.'},
    {q:'Which pseudo-class targets the first child element?',               c:[':first','::first','::first-child',':first-child'],                                        a:3, d:'hard',   e:':first-child selects an element that is the first child of its parent.'},
    {q:'What is the specificity order from lowest to highest?',             c:['Element, Class, ID, Inline','Inline, ID, Class, Element','Class, Element, ID, Inline','ID, Inline, Class, Element'], a:0, d:'hard', e:'Specificity: element (0,0,1) < class (0,1,0) < ID (1,0,0) < inline style.'},
    {q:'Which CSS function applies a smooth color transition?',             c:['transition()','animate()','linear-gradient()','ease()'],                                   a:2, d:'hard',   e:'linear-gradient() creates a gradient; transition property animates property changes.'},
    {q:'What does "display: none" do compared to "visibility: hidden"?',   c:['Same effect','display:none removes from flow; visibility:hidden keeps space','visibility:hidden removes from flow','No difference'], a:1, d:'hard', e:'display: none removes element from layout; visibility: hidden hides it but keeps its space.'},
    {q:'Which at-rule is used to apply styles for specific screen sizes?',  c:['@screen','@breakpoint','@media','@viewport'],                                             a:2, d:'hard',   e:'@media queries apply styles based on device/screen conditions like width or orientation.'},
    {q:'What does the CSS "calc()" function do?',                           c:['Rounds values','Performs math calculations for property values','Converts units','Calculates animation duration'], a:1, d:'hard', e:'calc() lets you mix units in math expressions, e.g., width: calc(100% - 20px).'},
    {q:'Which property controls how flex items wrap?',                      c:['flex-direction','flex-wrap','flex-grow','flex-flow'],                                      a:1, d:'hard',   e:'flex-wrap: wrap allows items to move to the next line; nowrap (default) keeps them in one line.'},
    {q:'What is the purpose of CSS custom properties (variables)?',         c:['Only for colors','Store reusable values with --name syntax','Replace all CSS','Only work in :root'], a:1, d:'hard', e:'CSS variables (--name: value) store reusable values and can be used throughout the stylesheet via var(--name).'},
  ],

  // ════════════════════════════════════════════════════════
  // JAVASCRIPT — 30 QUESTIONS (10 easy · 10 medium · 10 hard)
  // ════════════════════════════════════════════════════════
  javascript:[
    // ── EASY ──
    {q:'Which keyword declares a variable that can be reassigned?',         c:['const','let','var','Both let and var'],                                                    a:3, d:'easy',   e:'Both let and var can be reassigned; const cannot.'},
    {q:'How do you write "Hello World" in an alert box?',                   c:['msg("Hello World")','alertBox("Hello World")','alert("Hello World")','msgbox("Hello World")'], a:2, d:'easy', e:'alert() shows a browser popup dialog.'},
    {q:'Which operator strictly checks value AND type?',                    c:['==','=','===','!=='],                                                                      a:2, d:'easy',   e:'=== is strict equality; == only checks value with type coercion.'},
    {q:'How do you write a single-line comment in JavaScript?',             c:['<!-- -->','/* */','//','#'],                                                               a:2, d:'easy',   e:'// starts a single-line comment in JavaScript.'},
    {q:'Which method prints output to the browser console?',                c:['console.print()','print()','console.log()','log()'],                                      a:2, d:'easy',   e:'console.log() outputs values to the browser developer console.'},
    {q:'Which event fires when a user clicks an element?',                  c:['onmouseover','onchange','onclick','onmouseclick'],                                         a:2, d:'easy',   e:'onclick fires on click; onmouseover fires when the mouse hovers.'},
    {q:'How do you start a FOR loop in JavaScript?',                        c:['for (i <= 5; i++)','for i = 1 to 5','for (i = 0; i <= 5; i++)','foreach i in 5'],        a:2, d:'easy',   e:'A for loop needs: initializer; condition; increment — all in the parentheses.'},
    {q:'What value does an uninitialized variable hold?',                   c:['null','0','""','undefined'],                                                               a:3, d:'easy',   e:'Variables declared but not assigned hold the value undefined.'},
    {q:'Which method adds an element to the END of an array?',              c:['push()','pop()','shift()','append()'],                                                     a:0, d:'easy',   e:'push() adds to the end; pop() removes from the end; shift() removes from the start.'},
    {q:'How do you declare a constant variable?',                           c:['let','var','constant','const'],                                                            a:3, d:'easy',   e:'const declares a variable that cannot be reassigned after initialization.'},

    // ── MEDIUM ──
    {q:'What is the result of 2 + "2" in JavaScript?',                     c:['4','"22"','NaN','undefined'],                                                              a:1, d:'medium', e:'JS coerces the number 2 to a string and concatenates, giving "22".'},
    {q:'Which method converts a JSON string into an object?',               c:['JSON.stringify()','JSON.toObject()','JSON.parse()','JSON.convert()'],                     a:2, d:'medium', e:'JSON.parse() parses a JSON string; JSON.stringify() converts an object to JSON.'},
    {q:'How do you call a function named "myFunction"?',                    c:['call myFunction()','myFunction()','call function myFunction()','run.myFunction()'],       a:1, d:'medium', e:'Write the function name followed by parentheses to invoke it.'},
    {q:'Which array method removes and returns the LAST element?',          c:['push()','pop()','shift()','splice()'],                                                     a:1, d:'medium', e:'pop() removes and returns the last element; shift() does the same for the first.'},
    {q:'What does "typeof null" return in JavaScript?',                     c:['"null"','"undefined"','"object"','"boolean"'],                                             a:2, d:'medium', e:'This is a known JS bug — typeof null returns "object", not "null".'},
    {q:'Which statement is used to handle errors in JavaScript?',           c:['if/else','try/catch','error()','throw/handle'],                                            a:1, d:'medium', e:'try/catch wraps code that might throw an error and handles it gracefully.'},
    {q:'How do you check the length of an array called "arr"?',             c:['arr.size','arr.count','arr.length','arr.len'],                                             a:2, d:'medium', e:'The length property returns the number of elements in an array.'},
    {q:'Which method joins all array elements into a string?',              c:['concat()','join()','merge()','toString()'],                                                a:1, d:'medium', e:'join() combines elements with an optional separator; toString() uses commas by default.'},
    {q:'What is a closure in JavaScript?',                                  c:['A loop that closes','A function that remembers its outer scope','A closed HTML tag','An error handler'], a:1, d:'medium', e:'A closure is a function that retains access to variables from its outer (enclosing) scope.'},
    {q:'Which keyword is used to create a class in JavaScript?',            c:['function','object','class','prototype'],                                                   a:2, d:'medium', e:'ES6 introduced the class keyword as syntactic sugar over prototype-based inheritance.'},

    // ── HARD ──
    {q:'What does "use strict" do in JavaScript?',                          c:['Speeds up code','Enables strict syntax rules to catch common errors','Locks variables','Disables console'], a:1, d:'hard', e:'"use strict" enables strict mode, preventing undeclared variables and other silent errors.'},
    {q:'What is the difference between == and ===?',                        c:['No difference','=== checks type and value; == only checks value','== is faster','=== only checks type'], a:1, d:'hard', e:'== coerces types before comparing; === requires both value and type to match.'},
    {q:'What does the spread operator (...) do?',                           c:['Creates a loop','Expands an iterable into individual elements','Declares rest params only','Merges classes'], a:1, d:'hard', e:'The spread operator unpacks arrays/objects: [...arr] copies it; fn(...arr) passes elements as args.'},
    {q:'What is event bubbling in JavaScript?',                             c:['An animation effect','Events propagating from child to parent elements','A network event','A CSS event'], a:1, d:'hard', e:'When an event fires on a child, it bubbles up through its parent elements unless stopped.'},
    {q:'What does Promise.all() do?',                                       c:['Runs promises one by one','Resolves when ALL promises resolve, rejects if any fail','Resolves the first promise','Ignores failures'], a:1, d:'hard', e:'Promise.all() takes an array of promises and resolves when all complete, or rejects on first failure.'},
    {q:'What is the output of: console.log(0.1 + 0.2 === 0.3)?',           c:['true','false','NaN','undefined'],                                                          a:1, d:'hard',   e:'Floating-point precision issues mean 0.1 + 0.2 = 0.30000000000000004, not exactly 0.3.'},
    {q:'What does "hoisting" mean in JavaScript?',                          c:['Moving elements up in DOM','Variable/function declarations moved to top of scope before execution','Sorting an array','A CSS technique'], a:1, d:'hard', e:'JS hoists var declarations and function declarations to the top of their scope before code runs.'},
    {q:'What is the purpose of the "async/await" syntax?',                  c:['Speeds up loops','Makes asynchronous code look synchronous','Replaces all callbacks','Blocks the thread'], a:1, d:'hard', e:'async/await is syntactic sugar over Promises, making async code easier to read and write.'},
    {q:'Which method creates a new array by transforming every element?',   c:['filter()','forEach()','map()','reduce()'],                                                 a:2, d:'hard',   e:'map() returns a new array with each element transformed by the callback; forEach() returns nothing.'},
    {q:'What does the nullish coalescing operator (??) do?',                c:['Checks if null only','Returns right side if left is null OR undefined','Replaces if/else','Checks falsy values'], a:1, d:'hard', e:'?? returns the right-hand value only when the left is null or undefined — unlike || which triggers on any falsy value.'},
  ],

  // ════════════════════════════════════════════════════════
  // C# — 30 QUESTIONS (10 easy · 10 medium · 10 hard)
  // ════════════════════════════════════════════════════════
  csharp:[
    // ── EASY ──
    {q:'What does Console.WriteLine() do in C#?',                           c:['Reads a line','Prints text + newline to console','Deletes a line','Closes console'],      a:1, d:'easy',   e:'Console.WriteLine() outputs a line and moves the cursor to the next line.'},
    {q:'Which symbol terminates a statement in C#?',                        c:[':','.',';',','],                                                                           a:2, d:'easy',   e:'All C# statements must end with a semicolon ;'},
    {q:'Which data type holds a single character?',                         c:['string','char','text','byte'],                                                             a:1, d:'easy',   e:'char holds a single Unicode character; string holds a sequence of characters.'},
    {q:'How do you start a single-line comment in C#?',                     c:['#','//','/*','--'],                                                                        a:1, d:'easy',   e:'// starts a single-line comment; /* */ is for multi-line comments.'},
    {q:'Which keyword declares a whole number variable?',                   c:['num','float','int','double'],                                                              a:2, d:'easy',   e:'int stores 32-bit whole numbers; float and double store decimals.'},
    {q:'What is the correct way to declare a string variable?',             c:['String name = "Ana";','string name = "Ana";','str name = "Ana";','text name = "Ana";'],  a:1, d:'easy',   e:'In C#, string (lowercase) is the alias for System.String.'},
    {q:'Which keyword is used to output without a new line?',               c:['Console.Write()','Console.Print()','Console.Out()','Console.Log()'],                     a:0, d:'easy',   e:'Console.Write() outputs without appending a newline; Console.WriteLine() adds one.'},
    {q:'What does the "bool" data type store?',                             c:['Numbers','Characters','True or false','Decimal values'],                                  a:2, d:'easy',   e:'bool stores true or false — boolean values used in conditions.'},
    {q:'Which operator is used to check equality in C#?',                   c:['=','===','==','equals'],                                                                   a:2, d:'easy',   e:'== checks equality in C#; = is assignment; === does not exist in C#.'},
    {q:'How do you read input from the console in C#?',                     c:['Console.Read()','Console.Input()','Console.ReadLine()','Console.GetLine()'],              a:2, d:'easy',   e:'Console.ReadLine() reads a full line of text input from the user.'},

    // ── MEDIUM ──
    {q:'Which keyword creates a class in C#?',                              c:['new','struct','object','class'],                                                           a:3, d:'medium', e:'class defines a blueprint; new creates instances of that class.'},
    {q:'Which access modifier limits access to within the class?',          c:['public','private','protected','internal'],                                                 a:1, d:'medium', e:'private restricts access to within the declaring class only.'},
    {q:'Correct way to create an object of class "Car"?',                   c:['Car myObj = new Car();','Car myObj = Car();','new Car myObj;','class Car = new Car();'],  a:0, d:'medium', e:'Use TypeName varName = new TypeName() to instantiate an object.'},
    {q:'How do you declare a whole number variable in C#?',                 c:['num x = 5;','float x = 5;','int x = 5;','double x = 5;'],                                a:2, d:'medium', e:'int stores whole numbers; float/double store decimal numbers.'},
    {q:"Which property returns an array's element count?",                  c:['Count','Size','Length','Dimension'],                                                       a:2, d:'medium', e:'Array.Length returns element count; List<T> uses .Count instead.'},
    {q:'What is the difference between "==" and ".Equals()" in C#?',        c:['No difference','== compares references for objects; .Equals() compares values','== is faster','Equals() only works on strings'], a:1, d:'medium', e:'For objects, == compares references by default; .Equals() is overridden to compare values (e.g., in string).'},
    {q:'Which loop runs AT LEAST once regardless of condition?',            c:['for','while','foreach','do...while'],                                                      a:3, d:'medium', e:'do...while checks its condition AFTER the first execution, guaranteeing at least one run.'},
    {q:'What keyword exits a loop immediately in C#?',                      c:['exit','stop','return','break'],                                                            a:3, d:'medium', e:'break immediately exits the nearest enclosing loop or switch statement.'},
    {q:'Which collection type stores key-value pairs in C#?',               c:['List<T>','Array','Dictionary<K,V>','Queue<T>'],                                           a:2, d:'medium', e:'Dictionary<TKey, TValue> stores data as key-value pairs with fast lookup.'},
    {q:'What is method overloading in C#?',                                 c:['Replacing a parent method','Having multiple methods with same name but different parameters','Using two classes','Calling a method twice'], a:1, d:'medium', e:'Overloading lets you define multiple methods with the same name but different parameter lists.'},

    // ── HARD ──
    {q:'C# keyword for handling exceptions?',                               c:['catch','try','finally','All of these'],                                                    a:3, d:'hard',   e:'try, catch, and finally all work together — try runs code, catch handles errors, finally always runs.'},
    {q:'What is the difference between "ref" and "out" parameters?',        c:['No difference','ref requires initialization before passing; out does not','out is faster','ref is for classes only'], a:1, d:'hard', e:'ref requires the variable be initialized before passing; out does not but must be assigned inside the method.'},
    {q:'What does the "sealed" keyword do to a class?',                     c:['Makes it abstract','Prevents inheritance','Makes all methods private','Allows multiple inheritance'], a:1, d:'hard', e:'sealed prevents other classes from inheriting from it.'},
    {q:'What is the purpose of an interface in C#?',                        c:['To store data','To define a contract of methods a class must implement','To replace inheritance','To create objects'], a:1, d:'hard', e:'An interface defines method/property signatures that implementing classes must provide.'},
    {q:'What does "async/await" do in C#?',                                 c:['Speeds up loops','Allows asynchronous non-blocking operations','Replaces threading','Locks a resource'], a:1, d:'hard', e:'async marks a method as asynchronous; await suspends execution until the awaited task completes without blocking the thread.'},
    {q:'What is boxing in C#?',                                             c:['Wrapping a class in a struct','Converting a value type to an object (reference type)','Sealing a class','Creating a new object'], a:1, d:'hard', e:'Boxing converts a value type (e.g., int) to object; unboxing is the reverse. Both have performance costs.'},
    {q:'What is the difference between abstract class and interface?',      c:['No difference','Abstract class can have implementation; interface only has signatures (pre-C#8)','Interface is faster','Abstract class cannot be inherited'], a:1, d:'hard', e:'Abstract classes can have method bodies and fields; interfaces (before C# 8) only have signatures. A class can implement multiple interfaces but inherit only one abstract class.'},
    {q:'What does LINQ stand for?',                                         c:['List Integrated Number Query','Language Integrated Query','Linear Input Query','Linked Node Queue'], a:1, d:'hard', e:'LINQ (Language Integrated Query) allows SQL-like queries directly in C# code against collections, databases, and XML.'},
    {q:'What is a delegate in C#?',                                         c:['A base class','A type that holds a reference to a method','An interface','A static method'], a:1, d:'hard', e:'A delegate is a type-safe function pointer — it stores a reference to a method and allows it to be passed and invoked.'},
    {q:'What is the "??" operator called in C#?',                           c:['Ternary operator','Null-conditional operator','Null-coalescing operator','Safe-navigation operator'], a:2, d:'hard', e:'?? is the null-coalescing operator — it returns the left operand if not null, otherwise the right operand.'},
  ]
};