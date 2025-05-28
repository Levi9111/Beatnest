export const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  const initials = parts
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  return initials;
};

export const generateColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 45%)`; // lively pastel-style color
};
