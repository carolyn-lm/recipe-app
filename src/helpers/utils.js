export const truncateText = (text, numWords = 20) => {
    const words = text.split(" ");
    if (words.length > 20) {
        return words.slice(0, numWords).join(" ") + "...";
    } else {
        return text;
    }
}