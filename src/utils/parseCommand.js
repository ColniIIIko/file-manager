export const parseCommand = (string) => {
  let command = /^[a-z]+[^\\]\s?/.exec(string);
  if (command) command = command[0].trim();

  let commandArgs = / --[a-z]+\s?/i.exec(string);
  if (commandArgs) commandArgs = commandArgs[0].trim();

  let temp = [...string.matchAll(/ [^-]{2}\S*/g)];
  let arg = temp.map((a) => a[0].trim());

  return {
    command,
    commandArgs,
    arg,
  };
};
