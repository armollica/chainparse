
function isCommand(arg) { return arg.startsWith('-'); }
function isKeyValue(arg) { return /=/.test(arg); }

function parse(argv) {
    var args = argv.slice(2),
        i = 0,
        arg = args[i],
        n = args.length,
        commands = [],
        command;

    if (!isCommand(arg)) {
        command = { command: '_', _: [] };
        commands.push(command);
    }

    for (i = 0; i < n; i++) {
        arg = args[i];
        if (isCommand(arg)) {
            command = { command: arg.substr(1), _: [] };
            commands.push(command);
        } else if (isKeyValue(arg)) {
            var d = arg.split('=', 2),
                key = d[0],
                value = d[1];
            command[key] = value;
        } else {
            command._.push(arg);
        }
    }
    return commands;
}

module.exports = parse;
