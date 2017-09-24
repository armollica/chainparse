var tape = require('tape');

tape('program.command(...) is working', function(test) {
    var program = require('../');

    test.throws(function() { program.command() }, 'Must specify both command\'s name and description.');
    test.throws(function() { program.command('boom') }, 'Must specify both command\'s name and description.');

    program.command('boom', 'Make a loud noise');
    test.deepEqual(program.__commandSpec__.boom, {
        description: 'Make a loud noise',
        keys: false,
        flags: false
    });

    program.command('boom', 'Make a loud noise', { keys: ['key', 'value'] });
    test.deepEqual(program.__commandSpec__.boom, {
        description: 'Make a loud noise',
        keys: ['key', 'value'],
        flags: false
    });

    program.command('boom', 'Make a loud noise', { keys: ['volume', 'pitch'], flags: ['crackle', 'pop'] });
    test.deepEqual(program.__commandSpec__.boom, {
        description: 'Make a loud noise',
        keys: ['volume', 'pitch'],
        flags: ['crackle', 'pop']
    });

    test.end();
});