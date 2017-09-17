# chainparse

A parser for command line programs with chained commands (in the vein of [mapshaper](https://github.com/mbloch/mapshaper/wiki/Command-Reference) and [imagemagick](https://www.imagemagick.org/script/command-line-processing.php)). 

Install with `npm install chainparse`.

## Example

```js
// From command line...
// node program.js \
//     -i file1.csv name=census-data \
//     -i file2.json name=counties format=geojson \
//     -join left=counties right=census-data by=id name=joined \
//     -o data.json format=geojson target=joined

// In program.js...
var commands = require('chainparse')(process.argv);

// this is true
commands == [
    { command: 'i', _: ['file1.csv'], name: 'census-data' },
    { command: 'i', _: ['file2.json'], name: 'counties', format: 'geojson' },
    { command: 'join', _: [], left: 'counties', right: 'census-data', by: 'id', name: 'joined'},
    { command: 'o', _: ['data.json'], format: 'geojson', target: 'joined' }
];
```

## API Reference

This module is a single function that parses an array of arguments, most likely those passed from the command line and stored in `process.argv`.

```js
var parse = require('chainparse'),
    commands = parse(process.argv);
```

**parse**(*argv[, options]*)

Parse an array of arguments, *argv*. Returns an array of "command" objects.

The parser identifies commands as strings prefixed by a hyphen. A command can be followed by a series of options. Options can either be singular strings or key-value pairs. Key-value pairs are separated by an equals sign with no spaces between values.

For example, 
```js
// node program.js \
//     -input input.csv format=csv \
//     -filter 'year > 1995' 'value < 100' \
//     -output output.tsv format=tsv
process.argv == [
    ...,
    '-input', 'input.csv', 'format=csv',
    '-filter', 'year > 1995', 'value < 100',
    '-output', 'outpu.tsv', 'format=tsv',
];  // true

var parse = require('chainparse'),
    command = parse(process.argv);

command == [
    { command: 'input', _: ['input.csv'], format: 'csv' },
    { command: 'filter', _: ['year > 1995', 'value < 100'] },
    { command: 'output', _: ['output.csv'], format: 'tsv' }
];  // true
```

Note that the order of commands and command options is preserved.

The first two elements of *argv* are ignored. Typically you'll be passing `process.argv` for which the first two elements will be `'path/to/node'` and `'path/to/script.js'`.

The second argument, *options*, is an object which lets you customize how arguments are parsed.

```js
var options = {
    commandPrefix: '-',  // String that prefixes a command
    keyValueSep: '='     // String that separates key-values options 
}
```

Say you prefer double-hyphen commands and colon key-value separators:
```js
// node program.js --input file.csv format:csv
process.argv == [..., '--input', 'file.csv', 'format:csv'];  // true

var options = { commandPrefix: '--', keyValueSep: ':' },
    commands = parse(argv, options);

commands == [{ command: 'input', _: ['file.csv'], format: 'csv' }];  // true
```
