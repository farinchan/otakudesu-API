const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

module.exports = async (req, res) => {
    const id = req.params.id;
    const fullUrl = helpers.url + `/anime/${id}`;
    try {
        const response = await Axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const detailElement = $(".venser").find(".fotoanime");
        let object = {};
        let episode_list = [];
        object.thumb = detailElement.find("img").attr("src");
        object.anime_id = req.params.id;
        let genre_name, genre_id, genre_link;
        let genreList = [];

        object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
            .find("p")
            .text();

        detailElement.find(".infozin").filter(function () {
            object.title = $(this)
                .find("p")
                .children()
                .eq(0)
                .text()
                .replace("Judul: ", "");
            object.japanase = $(this)
                .find("p")
                .children()
                .eq(1)
                .text()
                .replace("Japanese: ", "");
            object.score = parseFloat(
                $(this).find("p").children().eq(2).text().replace("Skor: ", "")
            );
            object.producer = $(this)
                .find("p")
                .children()
                .eq(3)
                .text()
                .replace("Produser:  ", "");
            object.type = $(this)
                .find("p")
                .children()
                .eq(4)
                .text()
                .replace("Tipe: ", "");
            object.status = $(this)
                .find("p")
                .children()
                .eq(5)
                .text()
                .replace("Status: ", "");
            object.total_episode = parseInt(
                $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
            );
            object.duration = $(this)
                .find("p")
                .children()
                .eq(7)
                .text()
                .replace("Durasi: ", "");
            object.release_date = $(this)
                .find("p")
                .children()
                .eq(8)
                .text()
                .replace("Tanggal Rilis: ", "");
            object.studio = $(this)
                .find("p")
                .children()
                .eq(9)
                .text()
                .replace("Studio: ", "");
            $(this)
                .find("p")
                .children()
                .eq(10)
                .find("span > a")
                .each(function () {
                    genre_name = $(this).text();
                    genre_id = $(this)
                        .attr("href")
                        .substring(`${helpers.url}/genres/`.length);
                    genre_link = $(this).attr("href");
                    genreList.push({ genre_name, genre_id, genre_link });
                    object.genre_list = genreList;
                });
        });

        $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
            (i, element) => {
                const dataList = {
                    title: $(element).find("span > a").text(),
                    id: $(element)
                        .find("span > a")
                        .attr("href")
                        .substring(`${helpers.url}/`.length),
                    link: $(element).find("span > a").attr("href"),
                    uploaded_on: $(element).find(".zeebr").text(),
                };
                episode_list.push(dataList);
            }
        );
        object.episode_list =
            episode_list.length === 0
                ? [
                    {
                        title: "-",
                        id: "-",
                        link: "-",
                        uploaded_on: "-",
                    },
                ]
                : episode_list;
        const batch_link = {
            id:
                $("div.venser > div:nth-child(6) > ul").text().length !== 0
                    ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
                        .attr("href")
                        .substring(`${helpers.url}/batch/`.length)
                    : "-",
            link:
                $("div.venser > div:nth-child(6) > ul").text().length !== 0
                    ? $(
                        "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
                    ).attr("href")
                    : "-",
        };
       
        object.batch_link = batch_link;
        res.json(object);
    } catch (err) {
        console.log(err);
        errors.requestFailed(req, res, err);
    }
};