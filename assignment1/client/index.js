const protocol = (process.argv[2] || "").toLowerCase();

process.on("SIGINT", () => {
    process.exit();
})

switch (protocol) {
    case "udp":
        return require("./lib/clientUDP")

    case "tcp":
        return require("./lib/clientTCP")

    default:
        throw new Error("expected 'udp' or 'tcp' as first argument")
}