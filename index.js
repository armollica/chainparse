
function parse(argv, options) {
    var args = argv.slice(2),
        i = 0,
        arg = args[i],
        n = args.length,
        commands = [],
        command,
        commandPrefix = '-',
        keyValueSep = '=';

    if (options) {
       if (options.commandPrefix) commandPrefix = options.commandPrefix;
       if (options.keyValueSep) keyValueSep = options.keyValueSep;
    }

    function isCommand(arg) { return arg.startsWith(commandPrefix); }

    function isKeyValue(arg) { return arg.indexOf(keyValueSep) > -1; }

    if (!isCommand(arg)) {
        command = { command: '_', _: [] };
        commands.push(command);
    }

    for (i = 0; i < n; i++) {
        arg = args[i];
        if (isCommand(arg)) {
            var commandName = arg.replace(commandPrefix, '');
            command = { command: commandName, _: [] };
            commands.push(command);
        } else if (isKeyValue(arg)) {
            var d = arg.split(keyValueSep, 2),
                key = d[0],
                value = d[1];
            if (options && options.isKeyValue) {
                if (options.isKeyValue(command, key, value)) command[key] = value;
                else command._.push(arg);
            } else {
                command[key] = value;
            }
        } else {
            if (options && options.isFlag) {
                if (options.isFlag(command, arg)) command[arg] = true;
                else command._.push(arg);
            } else {
                command._.push(arg);
            }
        }
    }
    return commands;
}

module.exports = parse;
