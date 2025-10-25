/*import { areJidsSameUser } from '@adiwajshing/baileys'
let handler = async (m, { conn, participants }) => {
    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    let promoteUser = []
    let pene = groupMetadata.participants.find(p => p.id === conn.user.id)
    for (let user of users)
        if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
            const res = await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
            await delay(1 * 1000)
        }
    m.reply('✧ Listo')

}
handler.help = ['promote @tag']
handler.tags = ['group']
handler.command = /^(promote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

*/
import { areJidsSameUser } from '@adiwajshing/baileys'

var handler = async (m, { conn, text, participants, command }) => {

if (!text && !m.quoted && !m.mentionedJid?.length) {
return conn.reply(m.chat, `🪐 *Debes responder, mencionar o escribir un número para promover a administrador.*`, m)
    }

let user

if (m.mentionedJid?.length) {
user = m.mentionedJid[0]
} else if (m.quoted?.sender) {
user = m.quoted.sender
} else if (text) {
let number = text.replace(/[^0-9]/g, '')
if (number.length < 8 || number.length > 13) {
return conn.reply(m.chat, `🪐 *Número Incorrecto*`, m)
}
user = number + '@s.whatsapp.net'
}

if (!user) return conn.reply(m.chat, `🪐 *No se logró identificar al user.*`, m)

const senderData = participants.find(p => areJidsSameUser(p.id, m.sender))

if (!senderData?.admin) {
return conn.reply(m.chat, `🪐 *Solo los administradores pueden usar ${command}*`, m)
}

const targetData = participants.find(p => areJidsSameUser(p.id, user))
if (!targetData) {
return conn.reply(m.chat, `🪐 *El usuario no está en el grupo ._.*`, m)
}

if (targetData?.admin) {
return conn.reply(m.chat, `🪐 *El usuario ya es administrador.*`, m)
}

try {
await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
conn.reply(m.chat, `✅ *Usuario promovido a administrador exitosamente.*`, m, rcanal)

} catch (e) {
conn.reply(m.chat, `${e.message}`, m)
}}

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote', 'darpija', 'promover']

handler.group = true
// handler.admin = true
// handler.botAdmin = true // los puse así mientras arreglo el bug de que el bot no es admin...

export default handler