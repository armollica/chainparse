var tape = require('tape');

tape('program.version(...) is working', function(test) {
    var program = require('../')
        .version('1.2.3');

    test.equal(program.version(), '1.2.3');
    test.deepEqual(program.version('2.0.1'), program);
    test.equal(program.version(), '2.0.1');

    test.throws(function() { program.version('1.0') }, 'Invalid version string: 1.0');

    test.end();
});
