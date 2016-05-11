var fs = require('fs');
var async = require('async');

var DOCUMENTATION_TOP =
  '# sublime-react-es6\n\n' +
  'This is a fork of [sublime-react-es6-snippets](https://github.com/mboperator/sublime-react-es6)\n\n' +
  '- Classes with the new ES6 shorthand.\n\n'+
  '- Static class variables (defaultProps, propTypes) are declared using ES7 property intializers.\n\n'+
  '- ES6 style exports and imports for component creating snippets.\n\n'+
  '- Added `rrc` for Redux connected components.\n\n'+
  ' The main changes I\'ve made include:\n\n' +
  '- Include more snippets:\n\n' +
  '- Stateless components\n\n' +
  '- Proptypes\n\n' +
  '- No semicolons\n\n' +
  '![alt tag](docs/img/sr-rcc-out.gif)\n\n' +
  '## Installation\n\n' +
  'Open Package Control inside of Sublime Text using shift + cmd + P\n\n'+
  'Search for: Package Control: Add Repository\n\n'+
  'Add the link to your repo: https://github.com/username/repo-name\n\n'+
  'Now install the snippets: shift + cmd + P To launch Package Control again.\n\n'+
  'Start typing: Package Control: Install Package\n\n'+
  'Search for the repo name.\n\n'+
  'Start using your new snippet collection!\n\n'+
  '#### Documentation of available snippets (JSX):\n\n' +
  '```\n';

var DOCUMENTATION_BOTTOM =
  '```\n\n' +
  '## Contributing\n\n' +
  '### Rebuilding the docs\n\n' +
  'After making changes to snippet files, run `npm install && npm run build-docs` to automatically generate this document from source. **Do not** make changes to README.md directly.\n\n';

fs.readdir('./snippets', function(err, files) {
  var snippets = files.filter(function(file) {
    return file.substr(-16) === '.sublime-snippet';
  }).map(function(file) {
    return './snippets/' + file;
  });
  async.map(snippets, readAndInspect, function(err, results) {
    if (err) {
      console.error('error mapping snippets', err);
    }
    var snippetDocs =
      DOCUMENTATION_TOP +
      results.map(function(snippet) {
        return inspectFile(snippet);
      }).sort(function(a, b) {
        return a.abbreviation > b.abbreviation
          ? 1
          : a.abbreviation === b.abbreviation
            ? 0
            : -1;
      }).map(function(snippet) {
        return snippet.docBlock;
      }).join('') +
      DOCUMENTATION_BOTTOM;
    fs.writeFile('README.md', snippetDocs, function (err) {
      if (err) {
        console.error('error appending README:', err);
      }
    });
  });
});

function readAndInspect(fileName, cb) {
  fs.readFile(fileName, 'utf-8', function(err, contents) {
    if (!err) {
      cb(null, contents);
    }
  });
}

function inspectFile(contents) {
  var match = contents.match(
    /[\s\S]*<tabTrigger>(.*?)<\/tabTrigger>[\s\S]*?<description>(React: )?(.*?)<\/description>[\s\S]*/i
  );
  var docBlock = '';
  var abbreviation = '';
  var description = '';
  if (match !== null) {
    abbreviation = match[1];
    description = match[3];
    var shortCut = '     '.substring(0, 5 - abbreviation.length) + abbreviation;
    docBlock = '  ' + shortCut + '→  ' + description + '\n\n';
  }
  return {
    docBlock: docBlock,
    abbreviation: abbreviation,
    description: description
  };
}
