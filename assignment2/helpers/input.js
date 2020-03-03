const Readline = require("readline");

module.exports = (() => {
    function question(text) {
        const rl = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => {
            rl.question(text, answer => {
                rl.close();
                resolve(answer)
            });
        });
    }

    return Object.freeze({
        question,
    });
})()