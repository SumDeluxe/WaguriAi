const { proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let text = args.join(" ");
  if (!text) return conn.sendMessage(m.chat, {
    text: `✧ Escribe el texto que deseas convertir en voz.\n\nEjemplo:\n${usedPrefix + command} Buenos días, mundo`,
    footer: wm,
    buttons: [
      {
        buttonId: `${usedPrefix + command} Hola mundo`,
        buttonText: { displayText: '✧ Probar ejemplo' },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: m });

  let sections = [
    {
      title: "🌸 VOCES DISPONIBLES",
      rows: [
        { title: "🧠 Hatsune Miku", rowId: `${usedPrefix}ttszenzvoice miku|${text}` },
        { title: "🍃 Nahida (Genshin)", rowId: `${usedPrefix}ttszenzvoice nahida|${text}` },
        { title: "🌊 Nami (One Piece)", rowId: `${usedPrefix}ttszenzvoice nami|${text}` },
        { title: "👩 Ana (Femenina)", rowId: `${usedPrefix}ttszenzvoice ana|${text}` },
        { title: "🤖 Optimus Prime", rowId: `${usedPrefix}ttszenzvoice optimus|${text}` },
        { title: "🔥 Goku (DBZ)", rowId: `${usedPrefix}ttszenzvoice goku|${text}` },
        { title: "🎶 Taylor Swift", rowId: `${usedPrefix}ttszenzvoice taylor|${text}` },
        { title: "😈 Gojo Satoru", rowId: `${usedPrefix}ttszenzvoice gojo|${text}` },
        { title: "🐉 Shenlong", rowId: `${usedPrefix}ttszenzvoice shenlong|${text}` },
        { title: "🧔 Levi Ackerman", rowId: `${usedPrefix}ttszenzvoice levi|${text}` },
      ]
    }
  ];

  let listMessage = {
    text: `*「 𝗧𝗘𝗫𝗧𝗢 𝗔 𝗩𝗢𝗭 𝗔𝗡𝗜𝗠𝗘 」*\n\nTexto recibido:\n"${text}"\n\nSelecciona una voz para continuar:`,
    footer: wm,
    title: null,
    buttonText: "✨ Elegir voz",
    sections
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = /^ttsai$/i;
handler.help = ['ttsai <texto>'];
handler.tags = ['tools'];

export default handler;