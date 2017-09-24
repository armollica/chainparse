
function arrayIncludes(array, element) {
    return array.indexOf(element) > -1;
}

function version(__version__) {
    if (__version__ === undefined) return this.__version__;

    var isString = typeof __version__ === 'string',
        isValid = /\d+\.\d+\.\d+/.test(__version__);
    if (!(isString && isValid)) throw new Error('Invalid version string: ' + __version__);

    this.__version__ = __version__;

    return this;
}

function command(name, description, options) {
    if (arguments.length < 2) throw new Error('Must specify both command\'s name and description.');
    this.__commandSpec__[name] = {
        description: description,
        keys: options && options.keys || false,
        flags: options && options.flags || false
    };
    return this;
}

function parse(argv) {
    var args = argv.slice(2),
        command,
        commands = [],
        validKeys = [],
        validFlags = [],
        commandPrefix = this.__commandPrefix__,
        commandSpec = this.__commandSpec__,
        keyValueSeparator = this.__keyValueSeparator__;

    args.forEach(function(arg) {
        if (isCommand(arg)) handleCommand(arg);
        else if (isKeyValue(arg)) handleKeyValue(arg);
        else if (isFlag(arg)) handleFlag(arg);
        else handleBareArgument(arg);
    });

    this.commands = commands;

    return this;

    function isCommand(arg) {
        return arg.slice(0, commandPrefix.length) === commandPrefix;
    }

    function handleCommand(arg) {
        var name = arg.slice(commandPrefix.length),
            spec = commandSpec[name];

        if (spec === undefined) throw new Error('Invalid command name: ' + name);

        if (spec.keys === false) validKeys = [];
        else if (spec.keys !== undefined) validKeys = spec.keys;

        if (spec.flags === false) validFlags = [];
        else if (spec.flags !== undefined) validFlags = spec.flags;

        command = { commandName: name, _: [] };
        validFlags.forEach(function(flag) { command[flag] = false; });
        commands.push(command);
    }

    function isKeyValue(arg) {
        var key = arg.split(keyValueSeparator)[0];
        return arrayIncludes(validKeys, key);
    }

    function handleKeyValue(arg) {
        var argSplit = arg.split(keyValueSeparator),
            key = argSplit[0],
            value = argSplit[1];
        command[key] = value;
    }

    function isFlag(arg) {
        return arrayIncludes(validFlags, arg);
    }

    function handleFlag(arg) {
        command[arg] = true;
    }

    function handleBareArgument(arg) {
        command._.push(arg);
    }
}

var program = {
    __keyValueSeparator__: '=',
    __commandPrefix__: '-',
    __commandSpec__: {},
    version: version,
    command: command,
    commands: [],
    parse: parse
};

module.exports = program;
