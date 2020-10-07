# Whats App Bot

This is a minified project version that I developed to bring some ideas on how powerful Chrome Extensions can be.
![wp_bot](https://user-images.githubusercontent.com/7622553/95279114-383a7000-0828-11eb-94ab-8772920b6f4f.gif)

### Instructions

To use it, first update `IA_brain.js` script. Put your logic here, when someone answer you on WP, if the message match the one you create, it will return the message you want!

You can also see the name who did send the message, so you can configure a blacklist to not answer specific peoples

```
function getAnswer(newMsg, sender = '', lastAnswer = '') {
    if (not_allowed.includes(sender)) {
        return lastMsg = null;
    }

    if (newMsg.includes("version")) {//match massage
        return lastMsg = '1.0.1'//return message
    }

    if (["Hello", "Hi"].map(v => v.toLowerCase()).includes(newMsg)) {//match massage
        return lastMsg = `Hey, *${sender}*. I'm kinda busy right now. But tell me. How can I help you?` +
            `\n\n*1*. I'ts important (Start a Conversation).\n` +
            `*2*. Ok I will talk to you later.\n` +
            `*3*. I have some cash for you.`;//return message
    }

    if (["You ok?"].map(v => v.toLowerCase()).includes(newMsg)) {//match massage
        return lastMsg = `Yes.`; //return message
    }


}
```

### Install

To test it, go to your `chrome://extensions/` and enable the option `Develop mode`. Then click on `Pack Extension` and select the root folder of this repository.

Then you are ready to start your bussiness

### Observations
Keep in mind sometime WP will changes the class names, so you might need to replace the class name in code again.