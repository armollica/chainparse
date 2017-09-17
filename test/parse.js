var tape = require('tape'),
    parse = require('../');

tape('Create initial "_" command if first argument isn\'t a command', function(test) {
    var argv = [
        'node', 'program.js',
        'file1.json', 'name=counties', "format=geojson",
        '-filter', 'fips.startsWith("55")',
        '-o', 'good-counties.json', 'format=geojson'
    ];
    test.deepEqual(parse(argv), [
        { command: '_', _: ['file1.json'], name: 'counties', format:'geojson' },
        { command: 'filter', _: ['fips.startsWith("55")'] },
        { command: 'o', _: ['good-counties.json'], format: 'geojson' }
    ]);
    test.end();
});

tape('A key can be a quoted string with spaces', function(test) {
    var argv = [
        'node', 'program.js',
        '-i', 'spaced key=value', 'key=value',
    ];
    test.deepEqual(parse(argv), [
        { command: 'i', _: [], 'spaced key': 'value', key: 'value' }
    ]);
    test.end();
});

tape('A value can be a quoted string with spaces', function(test) {
    var argv = [
        'node', 'program.js',
        '-i', 'key=spaced value', 'key=value',
    ];
    test.deepEqual(parse(argv), [
        { command: 'i', _: [], 'key': 'spaced value', key: 'value' }
    ]);
    test.end();
});

tape('A key and value can be a quoted string with spaces', function(test) {
    var argv = [
        'node', 'program.js',
        '-i', 'spaced key=spaced value', 'key=value',
    ];
    test.deepEqual(parse(argv), [
        { command: 'i', _: [], 'spaced key': 'spaced value', key: 'value' }
    ]);
    test.end();
});

tape('Specifying a different command prefix works', function(test) {
    var argv = [
        'node', 'program.js',
        '--i', 'key=value',
    ];
    var options = {
        commandPrefix: '--'
    };
    test.deepEqual(parse(argv, options), [
        { command: 'i', _: [], key: 'value' }
    ]);
    test.end();
});

tape('Specifying a different key-value separator works', function(test) {
    var argv = [
        'node', 'program.js',
        '-i', 'key:value',
    ];
    var options = {
        keyValueSep: ':'
    };
    test.deepEqual(parse(argv, options), [
        { command: 'i', _: [], key: 'value' }
    ]);
    test.end();
});

tape('Specifying a different command prefix and a different key-value separator works', function(test) {
    var argv = [
        'node', 'program.js',
        '--i', 'key:value',
    ];
    var options = {
        commandPrefix: '--',
        keyValueSep: ':'
    };
    test.deepEqual(parse(argv, options), [
        { command: 'i', _: [], key: 'value' }
    ]);
    test.end();
});

tape('Multiple singular string get added to the "_" array', function(test) {
    var argv = [
        'node', 'program.js',
        '-filter', 'year > 1990', 'value < 100', 'key=value'
    ];
    test.deepEqual(parse(argv), [
        { command: 'filter', _: ['year > 1990', 'value < 100'], key: 'value' }
    ]);
    test.end();
});

tape('A hypothetical mapshaper-like program works as expected', function(test) {
    var argv = [
        'node', 'program.js',
        '-i', 'file1.csv', 'name=demographics',
        '-i', 'file2.json', 'name=counties', 'format=geojson',
        '-join', 'left=counties', 'right=demographics', 'by=id', 'name=joined',
        '-o', 'data.json', 'format=geojson', 'target=joined'
    ];
    test.deepEqual(parse(argv), [
        { command: 'i', _: ['file1.csv'], name: 'demographics' },
        { command: 'i', _: ['file2.json'], name: 'counties', format: 'geojson' },
        { command: 'join', _: [], left: 'counties', right: 'demographics', by: 'id', name: 'joined'},
        { command: 'o', _: ['data.json'], format: 'geojson', target: 'joined' }
    ]);
    test.end();
});
