import db from '../lib/database.js';

let handler = async (m, { args, usedPrefix, command }) => {
  // Verificación de argumentos
  if (args.length < 2) {
    return m.reply(`Uso correcto:\n${usedPrefix + command} @usuario cantidad`);
  }

  const mentionedJid = m.mentionedJid[0];
  const amount = parseInt(args[1]);

  if (!mentionedJid) return m.reply('Debes mencionar a un usuario para transferir ERIS.');
  if (isNaN(amount) || amount <= 0) return m.reply('La cantidad debe ser un número válido mayor que 0.');

  const sender = m.sender;
  const receiver = mentionedJid;

  db.data.users[sender] = db.data.users[sender] || { eris: 0 };
  db.data.users[receiver] = db.data.users[receiver] || { eris: 0 };

  if (db.data.users[sender].eris < amount) {
    return m.reply('No tienes suficiente ERIS para transferir esa cantidad.');
  }

  // Realiza la transferencia
  db.data.users[sender].eris -= amount;
  db.data.users[receiver].eris += amount;

  await m.reply(`✅ Has transferido ${amount} ERIS a @${receiver.split('@')[0]}`, null, {
    mentions: [receiver]
  });
};

handler.help = ['transferir @usuario cantidad'];
handler.tags = ['rpg'];
handler.command = ['transferir', 'enviar', 'dar'];
handler.group = true;

export default handler;