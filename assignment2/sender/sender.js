const dgram = require("dgram");
const input = require("../helpers/input");
const net = require("net");
const { sequenceNumber } = require("../helpers/sequence")

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const range = (a, b) => new Array(a + b).fill().map((_, i) => i).slice(a, b + 1);

const udpSocket = dgram.createSocket("udp4");

process.on("SIGINT", () => udpSocket.close())

;(async () => {
    const delay = parseInt(await input.question("Delay between packets (ms): "))
    const ip = await input.question("Provide target ip: ")
    const port = parseInt(await input.question("Provide target port: "))
    const shouldFake = (await input.question("Fake random requests to be out of order? [y/N]: ")).toLowerCase() === "y";

    const isValidHostname = (net.isIPv4(ip) || net.isIPv6(ip)) && !isNaN(port);

    if (!isValidHostname) {
        throw new Error(`Invalid hostname '${ip}:${port}'`);
    }

    if (isNaN(delay)) {
        throw new Error(`invalid delay '${delay}'`)
    }

    async function recursiveSendMessage(sequence=0) {
        if (sequence >= 10 ** 5) {
            return;
        }

        const mesage = Buffer.concat([Buffer.from(`${sequenceNumber(sequence)};`), Buffer.from(range(0, 1300))])
        
        console.log(`Sending sequence ${sequence}...`)
        udpSocket.send(mesage, port, ip, err => err && console.log(err));

        await sleep(delay);

        if (shouldFake && Math.random() > 0.95) {
            sequence += 1;
        }

        return recursiveSendMessage(sequence + 1);
    }

    recursiveSendMessage()
})()