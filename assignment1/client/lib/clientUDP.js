const { createSocket } = require("dgram");
const rl = require("./helpers/input")();

console.log("Starting udp client...")

let { port, host } = process.env;
const sleep = n => new Promise(resolve => setTimeout(resolve, n));

if (!host) {
    console.log("Host is not set, using default 'localhost'");
    host = 'localhost';
}

if (!port) {
    console.log("Port is not set, using default '10000'");
    port = 10000;
}

const socket = createSocket("udp4");

async function writeToSocket() {
    const reply = await rl.question("Write to socket (type exit to close): ");
    let replyFromServer = false;

    if (reply === "exit") {
        rl.close();

        return process.exit();
    }

    socket.send(reply, port, host, (err) => {
        if (err) {
            throw err
        }
    });

    socket.once("message", buffer => {
        console.log("Message from server:", buffer.toString(), "\n");
        replyFromServer = true;

        return writeToSocket();
    });

    await sleep(1500);

    if (!replyFromServer) {
        console.log("No reply from server...")
        return writeToSocket();
    }
}

writeToSocket();

