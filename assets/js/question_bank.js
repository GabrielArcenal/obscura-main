const QUESTION_BANK = [
  {
    id: 'html-structure',
    subject: 'HTML',
    subjectId: 'html',
    title: 'Document structure',
    description: 'Understand the parts and purpose of an HTML document.',
    questions: [
      { id: 'html-structure-e1', difficulty: 'easy', prompt: 'Which element contains the visible content of an HTML page?', choices: ['<head>', '<body>', '<title>', '<meta>'], answer: 1, explanation: 'The body element contains the page content that is displayed in the browser.' },
      { id: 'html-structure-m1', difficulty: 'medium', prompt: 'What is the main purpose of the <head> element?', choices: ['To contain the main article text', 'To hold document metadata and linked resources', 'To create the page footer', 'To display a heading'], answer: 1, explanation: 'The head contains information about the document, such as its title, metadata, and stylesheet links.' },
      { id: 'html-structure-h1', difficulty: 'hard', prompt: 'Why should an HTML document include <!doctype html>?', choices: ['It adds a visible page heading', 'It tells the browser to use modern standards mode', 'It loads the CSS file automatically', 'It defines the character encoding'], answer: 1, explanation: 'The doctype declaration tells browsers to render the document using standards mode.' }
    ]
  },
  {
    id: 'html-semantics',
    subject: 'HTML',
    subjectId: 'html',
    title: 'Semantic & accessible HTML',
    description: 'Choose meaningful elements and provide accessible names.',
    questions: [
      { id: 'html-semantics-e1', difficulty: 'easy', prompt: 'Which element is the most appropriate for a page’s main navigation links?', choices: ['<nav>', '<span>', '<strong>', '<aside>'], answer: 0, explanation: 'The nav element identifies a section whose purpose is navigation.' },
      { id: 'html-semantics-m1', difficulty: 'medium', prompt: 'A meaningful image conveys information. What should its alt attribute contain?', choices: ['The file size', 'A concise text equivalent of its meaning', 'The word “image”', 'A CSS class name'], answer: 1, explanation: 'Alternative text communicates the image’s relevant information to people who cannot see it.' },
      { id: 'html-semantics-h1', difficulty: 'hard', prompt: 'Which heading structure is generally easiest to navigate with assistive technology?', choices: ['Choose heading levels only for their visual size', 'Use headings in a logical outline without skipping levels unnecessarily', 'Use a heading element for every paragraph', 'Avoid headings and bold all section titles'], answer: 1, explanation: 'A logical heading outline communicates the organization of the page and supports heading-based navigation.' }
    ]
  },
  {
    id: 'html-forms',
    subject: 'HTML',
    subjectId: 'html',
    title: 'Forms & attributes',
    description: 'Build usable forms with correctly associated controls.',
    questions: [
      { id: 'html-forms-e1', difficulty: 'easy', prompt: 'Which element creates a single-line text input?', choices: ['<input type="text">', '<textarea type="text">', '<text>', '<form-input>'], answer: 0, explanation: 'An input element with type="text" is the standard single-line text field.' },
      { id: 'html-forms-m1', difficulty: 'medium', prompt: 'How should a visible label be associated with an input whose id is "email"?', choices: ['<label name="email">Email</label>', '<label for="email">Email</label>', '<label href="email">Email</label>', '<label id="email">Email</label>'], answer: 1, explanation: 'The label’s for value must match the input’s id, associating its text with that control.' },
      { id: 'html-forms-h1', difficulty: 'hard', prompt: 'What does the required attribute do on a form control?', choices: ['Automatically encrypts its value', 'Prevents form submission when the control has no value', 'Makes the control read-only', 'Adds a label for screen readers'], answer: 1, explanation: 'The browser’s built-in constraint validation prevents submission until a required control has a value.' }
    ]
  },
  {
    id: 'css-selectors',
    subject: 'CSS',
    subjectId: 'css',
    title: 'Selectors & box model',
    description: 'Target elements and reason about their rendered size.',
    questions: [
      { id: 'css-selectors-e1', difficulty: 'easy', prompt: 'Which selector targets every element with class "card"?', choices: ['#card', '.card', 'card()', '*card'], answer: 1, explanation: 'A period followed by a name selects elements with that class.' },
      { id: 'css-selectors-m1', difficulty: 'medium', prompt: 'With the default content-box model, what does width: 200px describe?', choices: ['Content width only', 'Content plus padding and border', 'The margin box', 'The entire element including margin'], answer: 0, explanation: 'Under content-box, the declared width is the content area; padding and borders add to the rendered size.' },
      { id: 'css-selectors-h1', difficulty: 'hard', prompt: 'What does box-sizing: border-box change?', choices: ['Margins are included in width', 'Padding and border are included in the declared width and height', 'The element becomes a flex container', 'The element ignores its width'], answer: 1, explanation: 'With border-box, the declared dimensions include content, padding, and border, making sizing more predictable.' }
    ]
  },
  {
    id: 'css-layout',
    subject: 'CSS',
    subjectId: 'css',
    title: 'Layout & responsive design',
    description: 'Arrange elements and adapt layouts to different screens.',
    questions: [
      { id: 'css-layout-e1', difficulty: 'easy', prompt: 'Which CSS declaration turns an element into a flex container?', choices: ['position: flex', 'display: flex', 'flex: display', 'layout: row'], answer: 1, explanation: 'Setting display to flex creates a flex formatting context for the element’s children.' },
      { id: 'css-layout-m1', difficulty: 'medium', prompt: 'In a row-direction flex container, which property distributes items along the main axis?', choices: ['align-items', 'justify-content', 'flex-wrap', 'align-content'], answer: 1, explanation: 'For flex-direction: row, justify-content controls distribution along the horizontal main axis.' },
      { id: 'css-layout-h1', difficulty: 'hard', prompt: 'What is the purpose of a CSS media query?', choices: ['To import audio into a page', 'To apply styles conditionally based on viewport or device features', 'To increase selector specificity', 'To make a stylesheet private'], answer: 1, explanation: 'Media queries apply rules when conditions such as viewport width or reduced-motion preference match.' }
    ]
  },
  {
    id: 'css-cascade',
    subject: 'CSS',
    subjectId: 'css',
    title: 'Cascade & states',
    description: 'Understand specificity, pseudo-classes, and reusable values.',
    questions: [
      { id: 'css-cascade-e1', difficulty: 'easy', prompt: 'Which pseudo-class applies while a pointer is over a link?', choices: [':focus', ':visited', ':hover', ':checked'], answer: 2, explanation: 'The :hover pseudo-class matches an element while the user points at it.' },
      { id: 'css-cascade-m1', difficulty: 'medium', prompt: 'For otherwise competing declarations, which selector usually has higher specificity?', choices: ['A type selector such as p', 'A class selector such as .note', 'An ID selector such as #intro', 'The universal selector *'], answer: 2, explanation: 'An ID selector has greater specificity than a class or type selector.' },
      { id: 'css-cascade-h1', difficulty: 'hard', prompt: 'How do you declare a reusable CSS custom property named --accent?', choices: ['accent := blue;', '$accent: blue;', '--accent: blue;', 'var accent = blue;'], answer: 2, explanation: 'Custom properties are declared with a -- prefix, commonly on :root, and used with var(--accent).' }
    ]
  },
  {
    id: 'js-values',
    subject: 'JavaScript',
    subjectId: 'javascript',
    title: 'Variables & values',
    description: 'Use declarations and understand common JavaScript values.',
    questions: [
      { id: 'js-values-e1', difficulty: 'easy', prompt: 'Which declaration is block-scoped and intended for a value that will not be reassigned?', choices: ['var', 'let', 'const', 'static'], answer: 2, explanation: 'const creates a block-scoped binding that cannot be reassigned.' },
      { id: 'js-values-m1', difficulty: 'medium', prompt: 'What is the result of typeof "hello" in JavaScript?', choices: ['text', 'String', 'string', 'object'], answer: 2, explanation: 'The typeof operator returns the string "string" for a string value.' },
      { id: 'js-values-h1', difficulty: 'hard', prompt: 'What does const prevent when it is used with an object?', choices: ['Changing any property of the object', 'Reassigning the binding to a different object', 'Reading properties from the object', 'Passing the object to a function'], answer: 1, explanation: 'const prevents reassignment of the variable binding, but it does not make an object’s properties immutable.' }
    ]
  },
  {
    id: 'js-logic',
    subject: 'JavaScript',
    subjectId: 'javascript',
    title: 'Control flow & functions',
    description: 'Make decisions, repeat work, and structure reusable logic.',
    questions: [
      { id: 'js-logic-e1', difficulty: 'easy', prompt: 'Which keyword starts a conditional branch in JavaScript?', choices: ['if', 'when', 'choose', 'caseif'], answer: 0, explanation: 'An if statement runs its block when its condition evaluates to true.' },
      { id: 'js-logic-m1', difficulty: 'medium', prompt: 'What does a function’s return statement do?', choices: ['Repeats the function', 'Sends a value back to the caller and ends that function call', 'Prints a value to the page', 'Declares a global variable'], answer: 1, explanation: 'return ends the current function call and provides its result to the caller.' },
      { id: 'js-logic-h1', difficulty: 'hard', prompt: 'What does the strict equality operator === check?', choices: ['Only whether two values coerce to the same number', 'Value equality without type coercion', 'Whether two variables have the same name', 'Whether both values are objects'], answer: 1, explanation: 'Strict equality compares values without converting one operand to another type first.' }
    ]
  },
  {
    id: 'js-data',
    subject: 'JavaScript',
    subjectId: 'javascript',
    title: 'Arrays & asynchronous code',
    description: 'Work with collections and recognize asynchronous results.',
    questions: [
      { id: 'js-data-e1', difficulty: 'easy', prompt: 'Which array property gives the number of elements?', choices: ['size', 'count', 'length', 'items'], answer: 2, explanation: 'An array’s length property gives its number of elements.' },
      { id: 'js-data-m1', difficulty: 'medium', prompt: 'What does Array.prototype.map() return?', choices: ['The first matching element', 'A new array containing the callback results', 'A number of matching elements', 'The original array sorted in place'], answer: 1, explanation: 'map creates a new array by applying a callback to each element.' },
      { id: 'js-data-h1', difficulty: 'hard', prompt: 'What does await do inside an async function?', choices: ['Blocks the entire browser until a value exists', 'Pauses that function until a promise settles, then gives its fulfillment value', 'Converts any value into a callback', 'Runs the promise on a separate thread'], answer: 1, explanation: 'await suspends the async function’s continuation until the promise settles; it does not block the browser’s main thread.' }
    ]
  },
  {
    id: 'cs-types',
    subject: 'C#',
    subjectId: 'csharp',
    title: 'Types & conditions',
    description: 'Recognize C# types and write basic conditional logic.',
    questions: [
      { id: 'cs-types-e1', difficulty: 'easy', prompt: 'Which C# type is commonly used for a whole number?', choices: ['string', 'int', 'bool', 'double'], answer: 1, explanation: 'int represents a signed 32-bit whole number in C#.' },
      { id: 'cs-types-m1', difficulty: 'medium', prompt: 'What value does a bool variable hold?', choices: ['Any whole number', 'A sequence of characters', 'true or false', 'A decimal number only'], answer: 2, explanation: 'The bool type represents one of two values: true or false.' },
      { id: 'cs-types-h1', difficulty: 'hard', prompt: 'What is the main difference between int and double in C#?', choices: ['int stores whole numbers; double stores floating-point numbers', 'int stores text; double stores whole numbers', 'double cannot be used in calculations', 'There is no difference'], answer: 0, explanation: 'int is an integral type; double represents approximate floating-point values and can include a fractional component.' }
    ]
  },
  {
    id: 'cs-methods',
    subject: 'C#',
    subjectId: 'csharp',
    title: 'Methods & collections',
    description: 'Organize logic into methods and work with grouped values.',
    questions: [
      { id: 'cs-methods-e1', difficulty: 'easy', prompt: 'Which keyword begins a method that returns no value in C#?', choices: ['null', 'void', 'empty', 'return'], answer: 1, explanation: 'A method declared void does not return a value.' },
      { id: 'cs-methods-m1', difficulty: 'medium', prompt: 'What does a method parameter provide?', choices: ['A value supplied to the method when it is called', 'A value that can only be used by the compiler', 'A way to end the program', 'A new namespace'], answer: 0, explanation: 'Parameters let a method receive input values from its caller.' },
      { id: 'cs-methods-h1', difficulty: 'hard', prompt: 'Which statement about a List<T> in C# is correct?', choices: ['Its size is fixed when it is created', 'It can grow or shrink as elements are added or removed', 'It can store only strings', 'It is a database table'], answer: 1, explanation: 'List<T> is a generic collection whose number of elements can change as items are added or removed.' }
    ]
  },
  {
    id: 'cs-oop',
    subject: 'C#',
    subjectId: 'csharp',
    title: 'Object-oriented programming',
    description: 'Understand classes, encapsulation, and inheritance.',
    questions: [
      { id: 'cs-oop-e1', difficulty: 'easy', prompt: 'In C#, what is a class?', choices: ['A blueprint that defines data and behavior for objects', 'A loop that repeats code', 'A special kind of variable value', 'A compiled application window'], answer: 0, explanation: 'A class defines the members and behavior that its objects can have.' },
      { id: 'cs-oop-m1', difficulty: 'medium', prompt: 'What does encapsulation help a class do?', choices: ['Expose every internal detail', 'Control access to its data and implementation', 'Convert all values to strings', 'Prevent methods from being called'], answer: 1, explanation: 'Encapsulation groups data and behavior and controls how callers interact with internal state.' },
      { id: 'cs-oop-h1', difficulty: 'hard', prompt: 'In C#, what does a derived class gain through inheritance?', choices: ['Access to eligible members of its base class', 'A guarantee that every member is public', 'The ability to inherit from multiple classes', 'An automatic database connection'], answer: 0, explanation: 'A derived class inherits accessible members from its base class; C# classes have one direct base class.' }
    ]
  }
];

const ADDITIONAL_QUESTIONS = {
  'html-structure': [
    ['easy', 'Which element sets the document title shown in a browser tab?', ['<title>', '<header>', '<caption>', '<label>'], 0, 'The title element inside the head sets the document title shown in the browser tab.'],
    ['easy', 'Which attribute helps a browser interpret text using the correct character set?', ['lang', 'charset', 'class', 'role'], 1, 'A meta element with charset="UTF-8" declares the document character encoding.'],
    ['medium', 'Where should a stylesheet link usually be placed in an HTML document?', ['Inside the head element', 'Inside every paragraph', 'After the closing html tag', 'Inside the title element'], 0, 'A link element in the head can load a stylesheet for the document.'],
    ['medium', 'What does the lang attribute on the html element communicate?', ['The page background color', 'The primary language of the page content', 'The browser version', 'The page encoding'], 1, 'The lang attribute identifies the language of the document and helps assistive technologies pronounce content.'],
    ['hard', 'Which statement best describes the difference between an HTML element and an attribute?', ['An element structures content; an attribute provides additional information about an element', 'An attribute contains the whole page; an element only changes color', 'They are interchangeable names for CSS rules', 'An element is only used in the document head'], 0, 'Elements define document structure, while attributes configure or describe an element.'],
    ['hard', 'Why is it important to nest HTML elements correctly?', ['Browsers require valid structure to interpret relationships predictably', 'It automatically makes every page responsive', 'It replaces the need for accessible labels', 'It prevents CSS from loading'], 0, 'Correct nesting creates a predictable document tree for browsers, scripts, and assistive technologies.']
  ],
  'html-semantics': [
    ['easy', 'Which element is intended for a self-contained piece of content such as a news story?', ['<article>', '<em>', '<small>', '<output>'], 0, 'Article represents a self-contained composition that could be distributed or reused independently.'],
    ['easy', 'Which element represents the dominant main content of a page?', ['<main>', '<footer>', '<mark>', '<summary>'], 0, 'The main element identifies the primary content of the page.'],
    ['medium', 'When should an image usually have empty alternative text (alt="")?', ['When it is decorative and adds no information', 'Whenever it is inside a link', 'When the image file is large', 'Only when CSS is disabled'], 0, 'Empty alt text allows assistive technology to skip a purely decorative image.'],
    ['medium', 'What should you use to make a button’s purpose clear to assistive technology?', ['A meaningful visible label or accessible name', 'A longer class name', 'A title on the page', 'A CSS animation'], 0, 'A button needs an accessible name that communicates its action.'],
    ['hard', 'A page has two independent navigation regions. What helps users distinguish them?', ['Give each nav landmark a distinct accessible label', 'Place both inside a paragraph', 'Remove the nav elements', 'Give both the same label'], 0, 'Distinct labels identify the purpose of each navigation landmark.'],
    ['hard', 'Why should a clickable action generally use a button rather than a clickable div?', ['A button provides native keyboard and interaction semantics', 'A div cannot be styled', 'A button always submits a form', 'A div is only valid in the document head'], 0, 'Native buttons include expected focus, keyboard, and accessibility behavior.']
  ],
  'html-forms': [
    ['easy', 'Which input type is designed for an email address?', ['email', 'letter', 'address', 'mailbox'], 0, 'The email input type gives browsers a suitable control and basic email-format validation.'],
    ['easy', 'Which element provides a multi-line text field?', ['<textarea>', '<input type="line">', '<text>', '<multiline>'], 0, 'Textarea is the standard HTML element for multi-line text input.'],
    ['medium', 'What does the name attribute on a form control usually determine?', ['The key used for its submitted form value', 'Its text color', 'Its screen position', 'Whether it has a label'], 0, 'The name is used as the field key when successful controls are submitted with a form.'],
    ['medium', 'How can related radio buttons be grouped so only one choice is selected?', ['Give them the same name value', 'Give them the same id value', 'Put each one in a separate form', 'Set every radio to disabled'], 0, 'Radio controls with the same name form a group from which the user selects one option.'],
    ['hard', 'Which attribute connects an input to a form when the input is not nested inside that form?', ['form', 'for', 'action', 'target'], 0, 'The form attribute can reference the id of a form element elsewhere in the document.'],
    ['hard', 'Why should client-side form validation not be the only validation for sensitive data?', ['Client-side checks can be bypassed, so trusted server-side validation is also needed', 'Browsers do not support required fields', 'Validation prevents keyboard use', 'HTML forms cannot submit text'], 0, 'Users can modify client code, so a server must validate data it receives before trusting it.']
  ],
  'css-selectors': [
    ['easy', 'Which selector targets an element with id="banner"?', ['.banner', '#banner', 'banner*', '@banner'], 1, 'The # prefix selects an element by its id.'],
    ['easy', 'Which selector targets all paragraph elements?', ['.p', '#p', 'p', '*p'], 2, 'A type selector uses the element name directly.'],
    ['medium', 'What does the selector .menu a target?', ['Every anchor inside an element with class menu', 'Only anchors with id menu', 'Every element inside an anchor', 'Every menu element after an anchor'], 0, 'The space creates a descendant selector: anchors at any depth within .menu.'],
    ['medium', 'Which CSS declaration adds space inside an element’s border?', ['margin', 'padding', 'outline', 'gap'], 1, 'Padding is the space between an element’s content and its border.'],
    ['hard', 'Which selector has the greatest specificity?', ['main p', '.content p', '#content p', '* p'], 2, 'An ID selector contributes more specificity than class, type, or universal selectors.'],
    ['hard', 'Two equally specific rules match an element. Which one normally wins?', ['The rule that appears later in the cascade', 'The rule with fewer declarations', 'The rule in the smaller file', 'The rule with shorter property names'], 0, 'When origin, importance, and specificity are equal, later source order wins.']
  ],
  'css-layout': [
    ['easy', 'Which Flexbox property controls spacing along the cross axis?', ['align-items', 'justify-content', 'flex-basis', 'order'], 0, 'align-items aligns flex items along the cross axis.'],
    ['easy', 'Which CSS unit is relative to the root element’s font size?', ['px', 'rem', 'vh', 'deg'], 1, 'A rem is based on the computed font size of the root element.'],
    ['medium', 'What does flex-wrap: wrap allow flex items to do?', ['Move onto additional lines when needed', 'Overlap at all times', 'Become absolutely positioned', 'Ignore their content'], 0, 'Wrapping allows flex items to flow onto another line when they no longer fit.'],
    ['medium', 'Which property adds space between rows and columns in a CSS grid?', ['gap', 'padding', 'outline', 'z-index'], 0, 'The gap property sets gutters between grid tracks and flex items.'],
    ['hard', 'In a grid container, what does minmax(0, 1fr) commonly help with?', ['Allowing a track to shrink below its content’s automatic minimum', 'Setting a fixed one-pixel column', 'Creating a media query', 'Removing all grid gaps'], 0, 'A zero minimum can prevent long content from forcing a fractional grid track wider than its container.'],
    ['hard', 'Which approach best supports responsive images in a flexible layout?', ['Constrain image width to its container and preserve its aspect ratio', 'Set every image to a fixed 2000px width', 'Position each image outside the viewport', 'Remove image dimensions from all layouts'], 0, 'A max-width constraint and automatic height let an image shrink while retaining its aspect ratio.']
  ],
  'css-cascade': [
    ['easy', 'Which pseudo-class matches a link the user has already visited?', [':visited', ':active', ':hover', ':empty'], 0, ':visited matches links that the browser records as visited.'],
    ['easy', 'What does the :focus-visible pseudo-class help style?', ['An element when keyboard-like focus indication should be visible', 'An element only when it is empty', 'A disabled element', 'A page after it finishes loading'], 0, ':focus-visible allows a visible focus treatment when the browser determines it is useful for navigation.'],
    ['medium', 'What does the inherit keyword do for a CSS property?', ['Uses the computed value from the parent element', 'Resets every style on the page', 'Loads a stylesheet', 'Makes the property important'], 0, 'inherit explicitly takes the property value from the element’s parent.'],
    ['medium', 'Which property controls the space between lines of text?', ['line-height', 'letter-spacing', 'word-break', 'text-indent'], 0, 'line-height sets the height of a line box and affects vertical spacing between lines.'],
    ['hard', 'What is a useful benefit of CSS custom properties?', ['They can be reused and changed as values through the cascade', 'They automatically validate HTML forms', 'They only work inside media files', 'They increase the specificity of every selector'], 0, 'Custom properties are cascade-aware values that can be reused with var().'],
    ['hard', 'Why is overusing !important usually discouraged?', ['It makes later overrides and maintenance harder', 'It disables the CSS cascade entirely', 'It prevents responsive rules from working', 'It changes HTML semantics'], 0, '!important can make the cascade harder to reason about and should be reserved for cases that truly need it.']
  ],
  'js-values': [
    ['easy', 'Which JavaScript value represents the absence of an assigned object value?', ['null', 'false', '0', 'NaN'], 0, 'null is an explicit value that represents an intentional absence of an object value.'],
    ['easy', 'Which operator assigns a new value to a variable?', ['=', '===', '=>', '!=='], 0, 'The single equals sign is the assignment operator.'],
    ['medium', 'What is the result of Number.isNaN("hello")?', ['true', 'false', '"NaN"', 'It throws an error'], 1, 'Number.isNaN checks whether the value itself is the numeric NaN; the string "hello" is not NaN.'],
    ['medium', 'What does the expression 5 === "5" evaluate to?', ['true', 'false', '5', 'It throws an error'], 1, 'Strict equality does not coerce the number and string to the same type.'],
    ['hard', 'What does destructuring let you do with an object?', ['Extract property values into variables using a compact syntax', 'Prevent the object from being modified', 'Convert it automatically into JSON', 'Make all its properties private'], 0, 'Object destructuring assigns selected property values to local bindings.'],
    ['hard', 'What does Object.freeze(obj) do at the first level?', ['Prevents changing or adding the object’s own properties', 'Deep-freezes every nested object automatically', 'Serializes the object', 'Copies the object into a new array'], 0, 'Object.freeze prevents direct changes to that object, but it is shallow and does not recursively freeze nested objects.']
  ],
  'js-logic': [
    ['easy', 'Which keyword starts a loop that repeats while a condition is true?', ['while', 'when', 'repeat', 'until'], 0, 'A while loop repeats its body while its condition remains true.'],
    ['easy', 'Which keyword skips to the next iteration of a loop?', ['continue', 'break', 'return', 'stop'], 0, 'continue skips the rest of the current loop body and begins the next iteration.'],
    ['medium', 'What does an arrow function expression create?', ['A function value', 'A class instance', 'A loop', 'A JSON document'], 0, 'An arrow function is a concise syntax for creating a function value.'],
    ['medium', 'What does the else branch in an if/else statement do?', ['Runs when the if condition is false', 'Always runs before the if condition', 'Repeats the if condition forever', 'Declares a constant'], 0, 'The else block handles the alternative path when the if condition is falsy.'],
    ['hard', 'What is a closure in JavaScript?', ['A function retaining access to lexical variables from its surrounding scope', 'A function that always returns null', 'A loop with no exit condition', 'A promise that has been cancelled'], 0, 'A closure combines a function with access to variables from its lexical environment.'],
    ['hard', 'What does Array.prototype.filter() return?', ['A new array with elements that pass a test', 'The first element that passes a test', 'A single boolean for the whole array', 'The original array reversed'], 0, 'filter builds a new array containing items for which the callback returns a truthy value.']
  ],
  'js-data': [
    ['easy', 'Which value indicates that a variable has been declared but not assigned a value?', ['undefined', 'null', 'false', 'empty'], 0, 'A declared variable without an assigned value evaluates to undefined.'],
    ['easy', 'Which array method adds an element to the end of an array?', ['push()', 'pop()', 'shift()', 'slice()'], 0, 'push adds one or more elements to the end of an array.'],
    ['medium', 'What does Array.prototype.find() return?', ['The first matching element, or undefined if none matches', 'A new array of all matching elements', 'The number of matching elements', 'The last matching index'], 0, 'find returns the first element that passes the test, or undefined if no element matches.'],
    ['medium', 'What does JSON.parse() do?', ['Converts valid JSON text into a JavaScript value', 'Converts any JavaScript value into JSON text', 'Sorts an array of JSON objects', 'Validates an HTML form'], 0, 'JSON.parse reads JSON text and returns the corresponding JavaScript value.'],
    ['hard', 'What does Promise.all() do when all input promises fulfill?', ['Fulfills with an array of their fulfillment values in input order', 'Fulfills with only the fastest value', 'Runs each promise on a separate thread', 'Changes every promise into a callback'], 0, 'Promise.all fulfills after all inputs fulfill and returns values in their original input order.'],
    ['hard', 'How does Array.prototype.reduce() commonly produce one result from a collection?', ['By accumulating a value as a callback processes each element', 'By deleting every other element', 'By sorting the source array', 'By converting each item to HTML'], 0, 'reduce carries an accumulator through the callback for each item and returns the final accumulated value.']
  ],
  'cs-types': [
    ['easy', 'Which C# keyword declares a true-or-false value?', ['bool', 'char', 'string', 'decimal'], 0, 'bool is the C# type for the values true and false.'],
    ['easy', 'Which C# type stores a sequence of text characters?', ['string', 'int', 'bool', 'byte'], 0, 'string represents text as a sequence of characters.'],
    ['medium', 'What is the result type of a comparison such as age >= 18 in C#?', ['bool', 'int', 'string', 'double'], 0, 'Comparison operators produce a boolean result: true or false.'],
    ['medium', 'What does the var keyword do for a local variable in C#?', ['Lets the compiler infer its static type from the initializer', 'Makes the variable dynamically typed', 'Creates a public field', 'Allows the variable to change type at runtime'], 0, 'var is compile-time type inference; the variable still has a specific static type.'],
    ['hard', 'What can happen when converting a double to an int with an explicit cast?', ['The fractional part is discarded', 'The int begins storing text', 'The value is always rounded upward', 'The program automatically uses a decimal type'], 0, 'An explicit numeric cast from double to int truncates the fractional portion toward zero.'],
    ['hard', 'Why might decimal be preferred over double for currency calculations?', ['Decimal represents base-10 fractions more predictably for financial values', 'Decimal is always faster', 'Double cannot store numbers', 'Decimal automatically connects to a database'], 0, 'decimal has greater base-10 precision behavior suited to many financial calculations.']
  ],
  'cs-methods': [
    ['easy', 'Which keyword sends a value back from a C# method?', ['return', 'yield', 'break', 'using'], 0, 'return ends the method and provides its result to the caller.'],
    ['easy', 'Which C# keyword declares a named method?', ['void', 'method', 'func', 'define'], 0, 'A method declaration specifies a return type such as void, followed by its name and parameter list.'],
    ['medium', 'What does a return type describe in a C# method?', ['The kind of value the method returns', 'The number of loops in the method', 'The method access level only', 'The namespace name'], 0, 'A return type declares what kind of value a method returns, or void when it returns no value.'],
    ['medium', 'How can you access the third item in a C# array named scores?', ['scores[2]', 'scores[3]', 'scores(2)', 'scores{3}'], 0, 'C# arrays use zero-based indexing, so the third element is at index 2.'],
    ['hard', 'What is method overloading in C#?', ['Defining methods with the same name but different parameter lists', 'Calling a method many times in a loop', 'Changing a method’s return value after it runs', 'Making every method static'], 0, 'Overloaded methods share a name but differ in their parameter signatures.'],
    ['hard', 'What does a generic type parameter such as T in List<T> represent?', ['A type supplied when the collection is used', 'A temporary variable containing time', 'A method return value only', 'A required namespace alias'], 0, 'A generic type parameter lets a reusable type operate with a specified type argument.']
  ],
  'cs-oop': [
    ['easy', 'Which keyword creates a new instance of a C# class?', ['new', 'class', 'base', 'this'], 0, 'The new operator creates an instance and invokes an appropriate constructor.'],
    ['easy', 'What is an object in object-oriented programming?', ['An instance of a class', 'A namespace declaration', 'A loop condition', 'A compiler warning'], 0, 'An object is a runtime instance created from a class definition.'],
    ['medium', 'What does a constructor do in a C# class?', ['Initializes a new object', 'Deletes the source file', 'Runs automatically every frame', 'Defines an interface'], 0, 'A constructor is called when an object is created and can initialize its state.'],
    ['medium', 'Which access modifier makes a member available only within its containing type?', ['private', 'public', 'namespace', 'virtual'], 0, 'private restricts access to the containing type.'],
    ['hard', 'What does the override keyword indicate in C#?', ['A derived class provides a new implementation of an overridable base member', 'A class inherits from two base classes', 'A method becomes private', 'A property is converted into a field'], 0, 'override supplies a derived implementation for a base member marked virtual, abstract, or override.'],
    ['hard', 'What is the purpose of an interface in C#?', ['To define a contract that implementing types agree to provide', 'To store object instances in a list', 'To run a method without calling it', 'To prevent a class from having methods'], 0, 'An interface describes members that an implementing type must provide.']
  ]
};

const IMPOSSIBLE_QUESTIONS = {
  'html-structure': ['A comment appears before <!doctype html>, followed by the html element. In modern browsers, what rendering mode does the doctype request?', ['Standards mode', 'Quirks mode because the comment came first', 'XML mode', 'It disables CSS'], 0, 'A comment may precede the doctype. The doctype must appear before the document element to request standards mode.'],
  'html-semantics': ['A button has aria-label="Save draft" and contains an image with alt="Download". What accessible name does the button expose?', ['Save draft', 'Download', 'Save draft Download', 'Its filename'], 0, 'An explicit aria-label supplies the button’s accessible name and takes precedence over its descendant content.'],
  'html-forms': ['A form has the novalidate attribute, and one of its inputs is required. What happens when the form is submitted normally?', ['The browser skips its built-in constraint-validation blocking step', 'The required attribute removes the input value', 'The form is prevented from submitting in every browser', 'The input is automatically disabled'], 0, 'novalidate disables the browser’s interactive constraint validation for that form; an application may still validate separately.'],
  'css-selectors': ['What is the specificity of .panel:is(#featured, article)?', ['1 ID, 1 class, and 0 type selectors', '0 IDs, 2 classes, and 1 type selector', '1 ID, 0 classes, and 1 type selector', '0 IDs, 1 class, and 0 type selectors'], 0, ':is() takes the specificity of its most specific argument (#featured), which is added to .panel.'],
  'css-layout': ['A CSS grid uses grid-template-columns: 1fr 1fr, but a long unbreakable string makes one column overflow. Which change most directly allows both tracks to shrink below their automatic minimum?', ['Use minmax(0, 1fr) for both tracks', 'Add white-space: nowrap to the grid', 'Set grid-auto-flow: column', 'Increase the 1fr value'], 0, 'A bare 1fr track has an automatic minimum. minmax(0, 1fr) sets an explicit zero minimum so content cannot force the track wider.'],
  'css-cascade': ['What is the specificity of #app :where(.card, #promo)?', ['1 ID, 0 classes, and 0 type selectors', '2 IDs and 1 class', '0 IDs and 1 class', '1 ID, 1 class, and 0 type selectors'], 0, ':where() always contributes zero specificity, so only #app contributes.'],
  'js-values': ['After this runs, what is obj.nested.count? const obj = Object.freeze({ nested: { count: 0 } }); obj.nested.count++;', ['1, because Object.freeze is shallow', '0, because every nested object is frozen too', 'undefined, because nested properties are removed', 'It always throws in non-strict JavaScript'], 0, 'Object.freeze is shallow: it freezes the outer object but does not freeze nested objects.'],
  'js-logic': ['What does this produce? const fns = []; for (let i = 0; i < 3; i++) fns.push(() => i); fns.map(fn => fn());', ['[0, 1, 2]', '[3, 3, 3]', '[0, 0, 0]', 'A ReferenceError'], 0, 'A let binding is created for each loop iteration, so each closure retains its iteration’s value.'],
  'js-data': ['If one promise passed to Promise.all() rejects, what happens to the aggregate promise?', ['It rejects with that rejection; the other operations are not automatically cancelled', 'It waits for every promise and then fulfills with partial results', 'It retries the rejected promise once', 'It cancels all other promises'], 0, 'Promise.all rejects when an input rejects, but it does not cancel the other promises.'],
  'cs-types': ['Given int? count = null;, what value does count ?? 0 produce?', ['0', 'null', 'false', 'A compile-time error'], 0, 'The null-coalescing operator returns its right operand when the nullable left operand is null.'],
  'cs-methods': ['Given overloads Pick(object) and Pick(string), which overload does Pick(null) select?', ['Pick(string), because string is more specific than object', 'Pick(object), because null is an object', 'Both overloads run', 'The call is always ambiguous'], 0, 'Both overloads accept null, but string converts to object, not the other way around, so Pick(string) is the better overload.'],
  'cs-oop': ['A Base reference stores new Derived(), and both classes define a virtual/override Describe() method. Which implementation runs for reference.Describe()?', ['Derived.Describe()', 'Base.Describe() in every case', 'Both implementations run automatically', 'The compiler rejects the call'], 0, 'Virtual dispatch uses the runtime object type, so the override in Derived runs.']
};

QUESTION_BANK.forEach(topic => {
  const extras = ADDITIONAL_QUESTIONS[topic.id];
  if (!extras || !IMPOSSIBLE_QUESTIONS[topic.id]) {
    throw new Error(`Question data is incomplete for ${topic.id}.`);
  }
  extras.forEach(([difficulty, prompt, choices, answer, explanation], index) => {
    topic.questions.push({
      id: `${topic.id}-e${index + 2}`,
      difficulty,
      prompt,
      choices,
      answer,
      explanation
    });
  });
  const [prompt, choices, answer, explanation] = IMPOSSIBLE_QUESTIONS[topic.id];
  topic.questions.push({
    id: `${topic.id}-i1`,
    difficulty: 'impossible',
    prompt,
    choices,
    answer,
    explanation
  });
});
