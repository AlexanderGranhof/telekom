const Readline = require("readline");

module.exports = function() {
    const rl = Readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function question(text) {
        return new Promise(resolve => {
            rl.question(text, resolve);
        });
    }

    return Object.freeze({
        question,
        close: rl.close.bind(rl)
    });
}