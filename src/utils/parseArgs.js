export const parseArgs = () => {
  const parsed = process.argv.reduce((acc, arg) => {
    if (arg.startsWith("--")) {
      const keyValue = /--([a-z]+)=(\S+)/.exec(arg);
      acc[keyValue[1]] = keyValue[2];
    }
    return acc;
  }, {});
  return parsed;
};
