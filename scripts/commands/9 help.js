module.exports.config = {
  name: "help",
  version: "1.0.2",
  permission: 0,
  credits: "EMon-BHai",
  description: "beginner's guide",
  prefix: 'awto',
  category: "user",
  usages: "help [command name]",
  cooldowns: 5,
  envConfig: {
		autoUnsend: false,
		delayUnsend: 60
	}
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ usage : %3\n❯ category : %4\n❯ waiting time : %5 seconds(s)\n❯ permission : %6\n\n» module code by ZIHAD-BHAI",
    helpList:
      `➤ there are %1 commands & %2 categories\n\n╭ ───«~»─── ╮
│          GUIDE         │
╰ ───«~»─── ╯\n➤ use : "${global.config.PREFIX}${this.config.name} ‹command›" to know how to use the command\n➤ type : "${global.config.PREFIX}${this.config.name} ‹page_number›" to show the page contents\n……………………………………\n‣ bot owner : ZIHAD ISLAM\n‣ owner fbl : https://www.facebook.com/profile.php?id=100067540204855\n……………………………………\n\n`,
    user: "user",
    adminGroup: "group admin",
    adminBot: "bot admin",
  },
};


module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;  

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0)
    return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages ? command.config.usages : ""
      }`,
      command.config.category,
      command.config.cooldowns,
      command.config.permission === 0
        ? getText("user")
        : command.config.permission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(commandList.map((cmd) => cmd.config.category.toLowerCase()));
    const categoryCount = categories.size;

    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (
        !isNaN(parsedPage) &&
        parsedPage >= 1 &&
        parsedPage <= totalPages
      ) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `➤ Oops! You went too far! Please choose a page between 1 and ${totalPages}`,
          threadID,
          messageID
        );
      }
    }
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) =>
          cmd.config.category.toLowerCase() === category
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      const numberFont = [
        "❶",
        "❷",
        "❸",
        "❹",
        "❺",
        "❻",
        "❼",
        "❽",
        "❾",
        "❿",
      ];
      msg += `[ ${numberFont[i]} ]─❍ ${
        category.charAt(0).toLowerCase() + category.slice(1)
      } category\n   ❯ ${commandNames.join("\n   ❯ ")}\n\n`;
    }
    const numberFontPage = [
      "❶",
      "❷",
      "❸",
      "❹",
      "❺",
      "❻",
      "❼",
      "❽",
      "❾",
      "❿",
      "⓫",
      "⓬",
      "⓭",
      "⓮",
      "⓯",
      "⓰",
      "⓱",
      "⓲",
      "⓳",
      "⓴",
    ];
    msg += `╭ ───«~»─── ╮
│     Page ${numberFontPage[currentPage - 1]} of ${numberFontPage[totalPages - 1]}   │\n╰ ───«~»─── ╯\n➤ total pages available: ${totalPages}\n`;
    msg += getText("helpList", commands.size, categoryCount, prefix);

    const axios = require("axios");
    const fs = require("fs-extra");
    const imgP = [];
    const img = [
      "https://i.postimg.cc/XYf3jpj9/c-HJpdm-F0-ZS9sci9pb-WFn-ZXMvd2-Vic2l0-ZS8y-MDIz-LTA4-L3-Jhd3-Bpe-GVsb2-Zma-WNl-NV9lb-XB0e-V9zc-GFj-ZV8z-ZF9y-ZW5k-ZXJf-Y2-Fy.jpg",
      "https://i.postimg.cc/XvnWp4qm/images-2023-12-07-T013946-172.jpg",
      "https://i.postimg.cc/15NsdvbC/images-2023-12-07-T014014-195.jpg",
      "https://i.postimg.cc/bwcpfQhz/images-2023-12-07-T014059-713.jpg",
      "https://i.postimg.cc/NGnQb3C2/images-2023-12-07-T014218-944.jpg"
    ];
    const path = __dirname + "/cache/menu.png";
    const rdimg = img[Math.floor(Math.random() * img.length)];

    const { data } = await axios.get(rdimg, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imgP.push(fs.createReadStream(path));
    const msgg = {
  body: `╭ ──────«~»────── ╮
│   commands and categories  │
╰ ──────«~»────── ╯\n\n`+ msg + `\n\n`
    };

    const sentMessage = await api.sendMessage(msgg, threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
				return api.unsendMessage(info.messageID);
			} else return;
		}, messageID);
  } else {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages ? command.config.usages : ""
        }`,
        command.config.category,
        command.config.cooldowns,
        command.config.permission === 0
          ? getText("user")
          : command.config.permission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
				return api.unsendMessage(info.messageID);
			} else return;
		}, messageID);
  }
};
