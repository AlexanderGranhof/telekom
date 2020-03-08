const dgram = require("dgram");
const input = require("../helpers/input");
const net = require("net");
const { sequenceNumber } = require("../helpers/sequence");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const range = (a, b) => new Array(a + b).fill().map((_, i) => i).slice(a, b + 1);

const shouldUseTCP = process.argv[2] === "tcp";

const udpSocket = !shouldUseTCP && dgram.createSocket("udp4");

console.log(`Starting ${shouldUseTCP ? "tcp" : "udp"}...`)

;(async () => {
    const delay = parseInt(await input.question("Delay between packets (ms): "))
    let packetCount = parseInt(await input.question("Number of packets sent (default 10000): "))
    const ip = await input.question("Provide target ip: ")
    const port = parseInt(await input.question("Provide target port: "))
    const shouldFake = (await input.question("Fake random requests to be out of order? [y/N]: ")).toLowerCase() === "y";

    const isValidHostname = net.isIP(ip) && !isNaN(port);

    if (!isValidHostname) {
        throw new Error(`Invalid hostname '${ip}:${port}'`);
    }

    if (isNaN(delay)) {
        throw new Error(`invalid delay '${delay}'`)
    }

    if (isNaN(packetCount)) {
        packetCount = 10 ** 5
    }

    const tcpSocket = shouldUseTCP && net.createConnection({ host: ip, port });

    process.on("SIGINT", () => shouldUseTCP ? tcpSocket.destroy() : udpSocket.close())

    async function recursiveSendMessage(sequence=0) {
        if (sequence >= packetCount) {
            return shouldUseTCP ? tcpSocket.destroy() : udpSocket.close();
        }

        const message = Buffer.concat([Buffer.from(`${sequenceNumber(sequence)};`), Buffer.from(range(0, 1300))])
        
        console.log(`Sending sequence ${sequence}...`)

        if (shouldUseTCP) {
            tcpSocket.write(message, err => err && console.log(err));
        } else {
            udpSocket.send(message, port, ip, err => err && console.log(err));
        }

        await sleep(delay);

        if (shouldFake && Math.random() > 0.95) {
            sequence += 1;
        }

        return recursiveSendMessage(sequence + 1);
    }

    recursiveSendMessage()
})()