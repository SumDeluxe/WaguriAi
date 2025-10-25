let handler = async (m, { conn, usedPrefix }) => {
  let plugins = Object.values(global.plugins).filter(v => v?.help && v.tags)

  let total = plugins.map(p => p.help).flat().length

  let categories = {}
  for (let p of plugins) {
    for (let tag of p.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...(p.help || []))
    }
  }

  let deco = "✦"
  let text = `╭━━〔 𝑾𝒂𝒈𝒖𝒓𝒊 𝑨𝒊 | 𝑪𝒐𝒎𝒂𝒏𝒅𝒐𝒔 〕━━╮
┃
┃ ${deco} 🔢 Total de comandos: *${total}*
┃ ${deco} 🧠 Usa *${usedPrefix}menu* para verlos.
┃
┃ ✦ 𝑪𝒂𝒕𝒆𝒈𝒐𝒓í𝒂𝒔 𝒅𝒆 𝒄𝒐𝒎𝒂𝒏𝒅𝒐𝒔:
┃`

  for (let cat in categories) {
    text += `\n┃ ${deco} ${capitalize(cat)}: *${categories[cat].length}*`
  }

  text += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`

  await conn.sendMessage(m.chat, {
    text,
    footer: '✦ Waguri Ai • Comandos Disponibles',
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '📜 Ver Menú' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

handler.help = ['totalcmd']
handler.tags = ['info']
handler.command = /^totalcmd|cmdcount|comandos$/i

export default handler