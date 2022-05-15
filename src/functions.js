const parseNumber = (value, def = 0) => {
    if (
        value &&
        value.toString &&
        (parseInt(value.toString()) == value.toString() ||
            parseFloat(value.toString()) == value.toString())
    ) {
        return parseFloat(value.toString());
    }
    return def;
};

module.exports = {
    parseNumber,
}
