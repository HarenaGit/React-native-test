
const formatter = (amount) => {
    const periodFormatted = String(amount)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return periodFormatted;
}

export default formatter;