export const parseCommand = (string) => {
  let command = /^[a-z]+[^\\]\s?/.exec(string);
  if (command) command = command[0].trim();

  let commandArgs = / --[a-z]+\s?/.exec(string);
  if (commandArgs) commandArgs = commandArgs[0].trim();

  let arg = / [^-]{2}\S*\s?/.exec(string);
  if (arg) arg = arg[0].trim();
  return {
    command,
    commandArgs,
    arg,
  };
};
