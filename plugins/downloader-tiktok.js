/*import fetch from 'node-fetch'
import ffmpeg from "fluent-ffmpeg"

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw m.reply(`*✧ Ejemplo: ${usedPrefix + command
        } https://vm.tiktok.com/ZMhAk8tLx/`);
    }

    try {
        await conn.reply ( m.chat, "✧ Espere un momento, estoy descargando su video...", m, );

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData) {
            throw m.reply("Error api!");
        }

        const videoURL = tiktokData.data.play;
        const videoURLWatermark = tiktokData.data.wmplay;
        const infonya_gan = `*✧ Descripción:* ${tiktokData.data.title}\n*✧ Publicado:* ${tiktokData.data.create_time
            }\n\n*✧ Estado:*\n=====================\nLikes = ${tiktokData.data.digg_count
            }\nComentarios = ${tiktokData.data.comment_count}\nCompartidas = ${tiktokData.data.share_count
            }\nVistas = ${tiktokData.data.play_count}\nDescargas = ${tiktokData.data.download_count
            }\n=====================\n\nUploader: ${tiktokData.data.author.nickname || "No info"
            }\n(${tiktokData.data.author.unique_id} - https://www.tiktok.com/@${tiktokData.data.author.unique_id
            } )\n*✧ Sonido:* ${tiktokData.data.music
            }\n`;

        if (videoURL || videoURLWatermark) {
            await conn.sendFile( m.chat, videoURL, "tiktok.mp4", "`DESCARGA DE TIKTOK`"+`\n\n${infonya_gan}`, m, );
            setTimeout(async () => {
                //await conn.sendFile( m.chat, videoURLWatermark, "tiktokwm.mp4", `*Ini Versi Watermark*\n\n${infonya_gan}`, m, );
                await conn.sendFile( m.chat, `${tiktokData.data.music}`, "lagutt.mp3", "", m, );
                //conn.reply( m.chat, "•⩊• Ini kak Videonya ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა\nDitonton yah ₍^ >ヮ<^₎", m, );
            }, 1500);
        } else {
            throw m.reply("No se pudo descargar.");
        }
    } catch (error1) {
        conn.reply(m.chat, `Error: ${error1}`, m);
    }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*')
handler.tags = ['downloader']
handler.command = /^t(t|iktok(d(own(load(er)?)?|l))?|td(own(load(er)?)?|l))$/i

handler.disable = false
handler.register = true
handler.limit = true

export default handler

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`
    let response = await (await fetch(tikwm)).json()
    return response
}

async function convertVideoToMp3(videoUrl, outputFileName) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
            .toFormat("mp3")
            .on("end", () => resolve())
            .on("error", (err) => reject(err))
            .save(outputFileName);
    });
}*/

import baileys from "@adiwajshing/baileys";
import axios from "axios";

let handler = async (m, {
        conn,
        text
    }) => {

        const tiktokRegex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+\/video\/\d+|\w+|t\/\w+)/i;
        const hasTiktokLink = tiktokRegex.test(text) || null;
        if (!hasTiktokLink) throw m.reply(`Lo siento, ingresaste el enlace primero, ejemplo: ${m.prefix + m.command} https://vt.tiktok.com/xxxx`);

        let url;
        if (hasTiktokLink) {
            try {
                const ttwm = await tikwm(text);
                let caption = `🔥 \`[ Downloader TikTok ]\` 💙
📙Titulo: ${ttwm.title || ''}
🗾Region: ${ttwm.region || ''}
🆔Id: ${ttwm.id || ''}
🧩Tipo: ${ttwm.images ? 'image' : 'video' || ''}

🧾Cubta
🔖Nombre: @${ttwm.author.nickname || ''}
👤Usuario: @${ttwm.author.unique_id || ''}
🆔Id: @${ttwm.author.id || ''}

▶️${ttwm.play_count || ''} | 💙${ttwm.digg_count || ''} | 💬${ttwm.comment_count || ''}`;

                await conn.sendMessage(m.chat, {
                    image: {
                        url: ttwm.author.avatar
                    },
                    caption
                }, {
                    quoted: m
                });
                if (ttwm.images) {
                    const ft = ttwm.images.map(v => v);
                    let push = [];
                    for (let i = 0; i < ft.length; i++) {
                        let cap = `${caption}`;
                        const mediaMessage = await baileys.prepareWAMessageMedia({
                            image: {
                                url: ft[i]
                            }
                        }, {
                            upload: conn.waUploadToServer
                        });
                        push.push({
                            body: baileys.proto.Message.InteractiveMessage.Body.fromObject({
                                text: cap
                            }),
                            footer: baileys.proto.Message.InteractiveMessage.Footer.fromObject({
                                text: wm
                            }),
                            header: baileys.proto.Message.InteractiveMessage.Header.create({
                                title: `Imagen ${i + 1}`,
                                subtitle: '',
                                hasMediaAttachment: true,
                                ...mediaMessage
                            }),
                            nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                buttons: [{}]
                            })
                        });
                    }
                    const msg = baileys.generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                interactiveMessage: baileys.proto.Message.InteractiveMessage.fromObject({
                                    body: baileys.proto.Message.InteractiveMessage.Body.create({
                                        text: wm
                                    }),
                                    footer: baileys.proto.Message.InteractiveMessage.Footer.create({
                                        text: "Tiktok Downloader"
                                    }),
                                    header: baileys.proto.Message.InteractiveMessage.Header.create({
                                        hasMediaAttachment: false
                                    }),
                                    carouselMessage: baileys.proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                        cards: push
                                    }),
                                    contextInfo: {
                                        mentionedJid: [m.sender],
                                        forwardingScore: 999,
                                        isForwarded: true,
                                        forwardedNewsletterMessageInfo: {
                                            newsletterJid: "120363348355703366@newsletter",
                                            newsletterName: "⟬㋠⟭ 𝚱 𝐖𝚯𝐑𝐋𝐃 - 𝐃𝚵 𝐋𝐔 𝐗𝚵 ↦ 𝚻𝚵公𝕸『🔆』",
                                            serverMessageId: 143
                                        }
                                    }
                                })
                            }
                        }
                    }, {
                        quoted: m
                    });
                    await conn.relayMessage(m.chat, msg.message, {
                        messageId: msg.key.id
                    });
                } else {
                    let {
                        data: res
                    } = await axios.get(ttwm.play, {
                        responseType: 'arraybuffer'
                    });
                    conn.sendFile(m.chat, Buffer.from(res), null, caption, m);
                }
            } catch (e) {
                m.reply('❌ Perdón por el error, quizá haya demasiadas solicitudes esta vez.');
                console.error('Error: ', e);
            }
        } else {
            m.reply('❌Lo siento, no hay enlace, ya no funciona.')
        };
    }

handler.help = ['tiktok', 'ttdl', 'tt', 'tiktokdl']
handler.tags = ['downloader']
handler.command = ['tiktok', 'ttdl', 'tt', 'tiktokdl']

export default handler

async function tikwm(url) {
    let retries = 0;
    let response;
    let maxRetries = 10;
    let retryDelay = 4000;
    while (retries < maxRetries) {
        try {
            response = await axios(`https://tikwm.com/api/?url=${url}`).catch(e => e.response);
            if (response && response.data && response.data.data) {
                return response.data.data;
            } else if (response && response.data && response.data.msg) {
                console.error(`Error from API: ${response.data.msg}`);
                throw new Error(`API Error: ${response.data.msg}`);
            } else {
                console.error("Unexpected response from API. Retrying...");
                throw new Error("Unexpected API response");
            }
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed: ${error.message}`);
            retries++;
            if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error(`Max retries reached. Giving up after ${maxRetries} attempts.`);
                throw error;
            }
        }
    }
};