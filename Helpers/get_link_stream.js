const { default: Axios } = require("axios");
const cheerio = require("cheerio");

const get = async (url) => {
    try {
        const response = await Axios.get(url);
        const $ = cheerio.load(response.data);
        const streamElement = $("div").find("#mediaplayer").attr("src");
        return streamElement;
    } catch (error) {
        return "-";
    }
};

module.exports = { get } 