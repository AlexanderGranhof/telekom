const dgram = require("dgram");
const input = require("../helpers/input");
const net = require("net");

const shouldUseTCP = process.argv[2] === "tcp";
const { sequenceNumber } = require("../helpers/sequence");

const udpSocket = !shouldUseTCP && dgram.createSocket("udp4");

console.log(`Starting ${shouldUseTCP ? "tcp" : "udp"}...`)


;(async () => {
    const port = parseInt(await input.question("What port to bind to: "));
    let currentSequence = -1;

    function messageHandler(message) {
        const sequence = message.slice(0, 6).toString();
        const sequenceNum = parseInt(sequence);
    
        console.log("Got message, sequence is:", sequence);
    
        if (currentSequence + 1 !== sequenceNum) {
            console.log(`Expected next sequence to be '${sequenceNumber(currentSequence + 1)};' but recieved '${sequence}'`)
        }
    
        currentSequence = sequenceNum;
    }

    if (isNaN(port)) {
        throw new Error(`port '${port}' is invalid`);
    }

    if (shouldUseTCP) {
        const server = net.createServer(client => {
            client.on("data", messageHandler);
        });

        server.listen(port);

        process.on("SIGINT", () => server.close());
    } else {
        udpSocket.on("message", messageHandler);
        
        udpSocket.bind(port, console.log(`Listening on port '${port}'`));
        process.on("SIGINT", () => udpSocket.close());

    }
})()
