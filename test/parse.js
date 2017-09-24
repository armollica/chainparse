var tape = require('tape'),
    chainparse = require('../');

tape('program.parse(...) is working', function(test) {
    var argv = [
        '...', '...',
        '-yell', 'volume=11', 'pitch=3.0', 'pop', 'chainparse is awesome!',
        '-whisper', 'volume=1', 'pitch=8.2', 'muffle', 'actually, I\'m not so sure',
        '-yell', 'volume=9', 'pitch=4.4', 'crackle', 'IT\'s THE BEST!!'
    ];

    var program = chainparse()
        .command('yell', 'Say something loudly', { keys: ['volume', 'pitch'], flags: ['crackle', 'pop'] })
        .command('whisper', 'Say something quietly', { keys: ['volume', 'pitch'], flags: ['muffle'] })
        .parse(argv);

    test.deepEqual(program.commands, [
        { commandName: 'yell', volume: '11', pitch: '3.0', pop: true, crackle: false, _: ['chainparse is awesome!'] },
        { commandName: 'whisper', volume: '1', pitch: '8.2', muffle: true, _: ['actually, I\'m not so sure'] },
        { commandName: 'yell', volume: '9', pitch: '4.4', pop: false, crackle: true, _: ['IT\'s THE BEST!!'] }
    ]);

    test.end();
});
