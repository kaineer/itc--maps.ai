interface MessageWithCookies {
  title: string;
  cookies: string[];
}

type CookieJar = Record<string, MessageWithCookies>;
type CookiesRepo = Record<string, CookieJar>;

const cookies: CookiesRepo = {
  http: {
    "500": {
      title: "Внутренняя ошибка сервера",
      cookies: [
        "Серверу нехорошо",
        "Хватит уже заниматься ерундой",
        "Не трогай, это на новый год",
        "Ты чего такой приставучий?",
      ],
    },
    nope: {
      title: "Не удается получить ответ",
      cookies: [
        "Никого нет дома",
        "Сервер молчит, он обиделся",
        "Включите ваш фронтенд на следующей неделе",
        "Может, туда гранату кинуть?",
      ],
    },
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
    getCookie: (
      code: string,
      defaultValue?: string,
    ): {
      title: string;
      description: string;
    } => {
      const [upper, lower] = code.split(".");
      const cookie = cookies[upper][lower];
      const description =
        randomItem(cookie.cookies) || defaultValue || "Сообщение не указано";
      const title = cookie.title;

      return {
        title,
        description,
      };
    },
  };
};
