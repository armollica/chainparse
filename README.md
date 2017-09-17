# chainparse

A command line parser for Node.js programs with chained commands (in the vein of [mapshaper](https://github.com/mbloch/mapshaper/wiki/Command-Reference) and [imagemagick](https://www.imagemagick.org/script/command-line-processing.php)). 

## Example

```js
// From command line...
// node program.js \
//     -i file1.csv name=demographics \
//     -i file2.json name=counties format=geojson \
//     -join left=counties right=demographics by=id name=joined \
//     -o data.json format=geojson target=joined

// In program.js...
var commands = require('chainparse')(process.argv);

// this is true
commands == [
    { command: 'i', _: ['file1.csv'], name: 'demographics' },
    { command: 'i', _: ['file2.csv'], name: 'counties', format: 'geojson' },
    { command: 'join', _: [], left: 'counties', right: 'demographics', by: 'id', name: 'joined'},
    { command: 'o', _: ['data.json'], format: 'geojson', target: 'joined' }
];
```
