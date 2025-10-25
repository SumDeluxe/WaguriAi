const { 
    BufferJSON, 
    WA_DEFAULT_EPHEMERAL, 
    generateWAMessageFromContent, 
    proto, 
    generateWAMessageContent, 
    generateWAMessage, 
    prepareWAMessageMedia, 
    areJidsSameUser, 
    getContentType 
} = (await import('@adiwajshing/baileys')).default

process.env.TZ = 'America/Buenos_Aires'
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import moment from "moment-timezone";
import { xpRange } from '../lib/levelling.js'

let arrayMenu = [
    'all',
    'main',
    'anonymous',
    'ai',
    'jadibot',
    'confesar',
    'rpg',
    'fun',
    'search',
    'downloader',
    'internet',
    'anime',
    'nsfw',
    'sticker',
    'tools',
    'group',
    'owner',
    ''
];

let estilo = (text, style = 1) => {
  var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = Object.freeze({
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  });
  var replacer = [];
  xStr.map((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split('')[i]
  }));
  var str = text.toLowerCase().split('');
  var output = [];
  str.map(v => {
    const find = replacer.find(x => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};

const allTags = {
  all: "MENU COMPLETO",
  main: "MENU PRINCIPAL",
  downloader: "MENU DOWNLOADER",
  jadibot: "MENU SUBBOTS",
  rpg: "MENU RPG",
  ai: "MENU IA",
  search: "MENU BUSQUEDA",
  anime: "MENU ANIME",
  sticker: "MENU STICKER",
  fun: "MENU FUN",
  group: "MENU GRUPO",
  nsfw: "MENU NSFW",
  info: "MENU INFO",
  internet: "MENU INTERNET",
  owner: "MENU OWNER",
  tools: "MENU TOOLS",
  anonymous: "ANONYMOUS CHAT",
  "": "NO CATEGORY"
}

const defaultMenu = {
    before: `
¡Hola! %name 
Soy un sistema automatizado (WhatsApp Bot) diseñado para ayudarte a encontrar información y realizar tareas de manera rápida y sencilla directamente desde WhatsApp. Puedo ofrecerte ayuda en diversas áreas.

◦ *Libreria:* Baileys
◦ *Funcion:* Assistant

┌  ◦ Rutina : %uptime
│  ◦ Fecha : %date
│  ◦ Hora : %time
└  ◦ Prefijo Usado : *[ %p ]*
`.trimStart(),
    header: '┌  ◦ *%category*',
    body: '│  ◦ %cmd %islimit %isPremium',
    footer: '└  ',
    after: `*Nota:* Escribe .menu <categoría> para seleccionar un menu en específico\n✧ Ejemplo: .menu tools`
}

let handler = async (m, { conn, usedPrefix: _p, args = [], command }) => {
    try {
        let { exp, limit, level, role } = global.db.data.users[m.sender]
        let { min, xp, max } = xpRange(level, global.multiplier)
        let name = m.pushName || `@${m.sender.split`@`[0]}`
        let teks = args[0] || ''
        
        let d = new Date(new Date + 3600000)
        let locale = 'es'
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        
        let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })

        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            }
        })

        if (!teks) {
            // MENSAJE CON BOTONES (lista y botón "Owner")
            let sections = [
                {
                    title: "Lista de Menús",
                    rows: arrayMenu.filter(tag => tag && allTags[tag]).map(tag => ({
                        title: allTags[tag],
                        description: `Ver comandos de ${allTags[tag]}`,
                        rowId: `${_p}menu ${tag}`
                    }))
                }
            ]

            let listMessage = {
                text: `¡Hola! ${name}\n\nSelecciona una categoría para ver los comandos disponibles.`,
                footer: wm,
                title: 'Menú Principal',
                buttonText: 'Ver Categorías',
                sections
            }

            let buttons = [
                {
                    buttonId: `${_p}owner`,
                    buttonText: { displayText: 'Owner' },
                    type: 1
                }
            ]

            await conn.sendMessage(m.chat, { 
                text: listMessage.text, 
                footer: listMessage.footer,
                title: listMessage.title,
                buttons,
                sections: listMessage.sections,
                buttonText: listMessage.buttonText,
                mentions: [m.sender]
            }, { quoted: m })

            return
        }

        if (!allTags[teks]) {
            return m.reply(`El menú "${teks}" no está registrado.\nEscribe ${_p}menu para ver la lista de menús.`)
        }

        let menuCategory = defaultMenu.before + '\n\n'
        
        if (teks === 'all') {
            // category all
            for (let tag of arrayMenu) {
                if (tag !== 'all' && allTags[tag]) {
                    menuCategory += defaultMenu.header.replace(/%category/g, allTags[tag]) + '\n'
                    
                    let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
                    for (let menu of categoryCommands) {
                        for (let help of menu.help) {
                            menuCategory += defaultMenu.body
                                .replace(/%cmd/g, menu.prefix ? help : _p + help)
                                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n'
                        }
                    }
                    menuCategory += defaultMenu.footer + '\n'
                }
            }
        } else {
            menuCategory += defaultMenu.header.replace(/%category/g, allTags[teks]) + '\n'
            
            let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(teks) && menu.help)
            for (let menu of categoryCommands) {
                for (let help of menu.help) {
                    menuCategory += defaultMenu.body
                        .replace(/%cmd/g, menu.prefix ? help : _p + help)
                        .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                        .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n'
                }
            }
            menuCategory += defaultMenu.footer + '\n'
        }

        menuCategory += '\n' + defaultMenu.after
        
        let replace = {
            '%': '%',
            p: _p, 
            uptime, 
            name,
            date,
            time
        }

        let text = menuCategory.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), 
            (_, name) => '' + replace[name])

        // Envía texto con video de fondo, como antes
        await conn.sendFile(m.chat, "https://files.catbox.moe/qzj7we.mp4", 'menu.mp4', estilo(text), global.fliveLoc2, null)

    } catch (e) {
        conn.reply(m.chat, 'Perdón, hay un error con el menú', m)
        console.error(e)
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
handler.exp = 3

export default handler;

function clockString(ms) {
    if (isNaN(ms)) return '--'
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}