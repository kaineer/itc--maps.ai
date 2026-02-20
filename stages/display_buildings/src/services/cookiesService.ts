type CookieJar = Record<string, string | string[]>;
type CookiesRepo = Record<string, CookieJar>;

const cookies: CookiesRepo = {
  http: {
    "500": [
      "Серверу нехорошо",
      "Хватит уже заниматься ерундой",
      "Не трогай, это на новый год",
      "Ты чего такой приставучий?",
    ],
  },
};

const randomItem = (lines: string | string[]) => {
  if (Array.isArray(lines)) {
    const idx = Math.floor(lines.length * Math.random());
    return lines[idx];
  }
  return lines;
};

export const createCookiesService = () => {
  return {
    getCookie: (code: string, defaultValue?: string): string => {
      const [upper, lower] = code.split(".");
      return (
        randomItem(cookies[upper][lower]) ||
        defaultValue ||
        "Сообщение не указано"
      );
    },
  };
};
