const { Socket } = require("net");
const URL = require("url").URL;

const socket = new Socket();
const url = new URL("http://www.ingonline.nu/tictactoe/index.php?board=xoxoeoeex");

let body = "";

socket.on("connect", () => {
    let request = [
        `GET ${url.pathname}${url.search} HTTP/1.1`,
        `Host: ${url.host}`,
        "Connection: close",
        "\r\n"
    ];

    socket.write(request.join("\r\n"));
});

socket.on("data", buffer => {
    body += buffer.toString();
});

socket.on("end", () => {
    let [headers, ...rest] = body.split("\r\n\r\n");
    let responseBody = rest.join("\r\n\r\n");

    console.log("Response headers:")
    console.log(headers);

    console.log()

    console.log("Response Body:")
    console.log(responseBody);
})

socket.connect(80, url.hostname);

