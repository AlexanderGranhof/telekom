const dgram = require("dgram");
const input = require("../helpers/input");
const { sequenceNumber } = require("../helpers/sequence")

const udpSocket = dgram.createSocket("udp4");

process.on("SIGINT", () => udpSocket.close())

;(async () => {
    const port = parseInt(await input.question("What port to bind to: "));
    let currentSequence = 0;

    if (isNaN(port)) {
        throw new Error(`port '${port}' is invalid`);
    }

    udpSocket.on("message", message => {
        const sequence = message.slice(0, 6).toString();
        const messageBuf = message.slice(6);

        const sequenceNum = parseInt(sequence);

        if (currentSequence + 1 !== sequenceNum) {
            console.log(`Expected next sequence to be '${sequenceNumber(currentSequence + 1)};' but recieved '${sequence}'`)
        }

        currentSequence = sequenceNum;
    })

    udpSocket.bind(port);
})()
