export const generateDefauleUserName = (name: string) => {
  const defaultUserName = `@${name.replace(' ', '')}${Math.ceil(Math.random() * 100000)}`;

  return defaultUserName;
};
