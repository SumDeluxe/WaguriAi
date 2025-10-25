let handler = async (m, { conn, text, usedPrefix, command }) => {
    const args = text.trim().split(/ +/);
    const eris = parseInt(args[0]);
    const xp = parseInt(args[1]);

    if (isNaN(eris) || isNaN(xp)) {
        return m.reply(`✧ Formato incorrecto.\n\n*Uso:* ${usedPrefix + command} <Eris> <XP>\n*Ejemplo:* ${usedPrefix + command} 5000 1000`);
    }

    let user = global.db.data.users[m.sender];
    user.bank += eris;
    user.exp += xp;

    m.reply(`✧ Cheat aplicado con éxito, KenisawaDev.\n\n≡ 💰 Eris recibidos: ${eris}\n≡ 🧬 XP recibidos: ${xp}`);
};

handler.help = ['cheatyo <Eris> <XP>'];
handler.tags = ['owner'];
handler.command = /^cheatyo$/i;
handler.rowner = true;

export default handler;