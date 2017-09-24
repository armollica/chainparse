var tape = require('tape'),
    chainparse = require('../');

tape('program.commandPrefix(...) is working', function(test) {
    var argv = [
        '...', '...',
        '--boom', 'shakalaka'
    ];

    var program = chainparse()
        .commandPrefix('--')
        .command('boom', 'Make a boom')
        .parse(argv);

    test.equal(program.commandPrefix(), '--');
    test.deepEqual(program.commands, [{ commandName: 'boom', _: ['shakalaka'] }]);
    test.throws(function() { program.commandPrefix(123); }, 'Command prefix must be string');

    test.end();
});
