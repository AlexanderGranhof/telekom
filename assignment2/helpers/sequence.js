const sequenceNumber = n => { 
    const stringNum = n.toString();
    const fullPrefix = "00000";
    const slicedPrefix = fullPrefix.slice(0, fullPrefix.length - stringNum.length);

    return slicedPrefix + stringNum
}

module.exports.sequenceNumber = sequenceNumber;