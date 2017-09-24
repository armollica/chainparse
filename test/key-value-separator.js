var tape = require('tape'),
    chainparse = require('../')

tape('program.keyValueSeparator(...) is working', function(test) {
    var argv = [
        '...', '...',
        '-boom', 'shakalaka', 'key:value'
    ];

    var program = chainparse()
        .keyValueSeparator(':')
        .command('boom', 'Make a boom', { keys: ['key'] })
        .parse(argv);

    test.equal(program.keyValueSeparator(), ':');
    test.deepEqual(program.commands, [{ commandName: 'boom', _: ['shakalaka'], key: 'value' }]);

    var argv = [
        '...', '...',
        '-boom', 'shakalaka', 'key:=value'
    ];

    var program = chainparse()
        .keyValueSeparator(':=')
        .command('boom', 'Make a boom', { keys: ['key'] })
        .parse(argv);

    test.equal(program.keyValueSeparator(), ':=');
    test.deepEqual(program.commands, [{ commandName: 'boom', _: ['shakalaka'], key: 'value' }]);

    test.throws(function() { program.keyValueSeparator(123); }, 'Key-value separator must be string');

    test.end();
});
