const Net = require("net");
const rl = require("./helpers/input")();

console.log("Starting tcp client...");

let { host, port } = process.env;

const sleep = n => new Promise(resolve => setTimeout(resolve, n));

if (!host) {
    console.log("Host is not set, using default 'localhost'");
    host = 'server';
}

if (!port) {
    console.log("Port is not set, using default '10000'");
    port = 10000;
}

const socket = new Net.Socket();

async function writeToSocket() {
    const reply = await rl.question("Write to socket (type exit to close): ");
    let replyFromServer = false;

    if (reply === "exit") {
        socket.destroy();

        return rl.close();
    }

    socket.write(reply);

    socket.once("data", data => {
        console.log("Message from server:", data.toString(), "\n");
        replyFromServer = true;

        return writeToSocket();
    });

    await sleep(1500);

    if (!replyFromServer) {
        console.log("No response from server...\n")
        return writeToSocket();
    }
}

socket.connect(port, host, () => {
    console.log("Connected to host!\n");

    writeToSocket();
});

socket.on("end", () => {
    console.log("\nServer disconnected!");
    socket.destroy();
    rl.close();
});