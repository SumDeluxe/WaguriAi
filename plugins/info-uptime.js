import { clockString } from '../lib/func.js'
let handler = async (m) => {
  let uptime = process.uptime() * 1000
  m.reply(`🕒 𝙏𝙞𝙚𝙢𝙥𝙤 𝙖𝙘𝙩𝙞𝙫𝙤: *${clockString(uptime)}*`)
}
handler.command = ['uptime']
handler.tags = ['info']
handler.help = ['uptime']
export default handler