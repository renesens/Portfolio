// A new id on every build. It is added to the CSS and JS links, so browsers
// load the fresh files after each update instead of an old cached copy.
export default { id: Date.now().toString(36) };
