var not_allowed = ['PUCRS Online', 'TIM - PPM', 'PGM: VIDA COM PROPÓSITO', 'PMO - System Support']

var lastMsg = ''
var fila = []

function getAnswer(newMsg, sender = '', lastAnswer = '') {
    if (not_allowed.includes(sender)) {
        return lastMsg = null;
    }

    if (newMsg.includes("version")) {//match massage
        return lastMsg = '1.0.1'//return message
    }

    if (["Hello", "Hi"].map(v => v.toLowerCase()).includes(newMsg)) {
        return lastMsg = `Hey, *${sender}*. I'm kinda busy right now. But tell me. How can I help you?` +
            `\n\n*1*. I'ts important (Start a Conversation).\n` +
            `*2*. Ok I will talk to you later.\n` +
            `*3*. I have some cash for you.`;
    }

    if (["You ok?"].map(v => v.toLowerCase()).includes(newMsg)) {//match massage
        return lastMsg = `Yes.`; //return message
    }


}