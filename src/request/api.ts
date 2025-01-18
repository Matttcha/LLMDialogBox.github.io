export const getBotInfo = async () => {
  const res = await fetch(
    "https://api.coze.cn/v1/bot/get_online_info?bot_id=7460125530122190900",
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat_oyuR51Ie39pEnzHEbovqoM1hDFp7y8Nu1U9In5AHL1rUQHn3O7KO724CzFGGf4TM",
        "Content-Type": "application/json",
      },
    }
  );
  const resJson = await res.json();
  const { code, data, msg } = resJson;
  return data;
};
