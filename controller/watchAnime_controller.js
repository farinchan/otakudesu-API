const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");
const linkStream = require("../Helpers/get_link_stream")

module.exports = async (req, res, dbResult) => {
  const logPush = require("../Helpers/log_push")
  logPush(dbResult)
  const id = req.params.id;
  const fullUrl = `${helpers.url}/${id}`;

  try {
    let response = await Axios.get(fullUrl)
    const $ = cheerio.load(response.data);
    const streamElement = $("#lightsVideo").find("#embed_holder");
    const obj = {
      apikey_info: {
        apikey: dbResult.apikey,
        name: dbResult.nama,
        email: dbResult.email,
        msg_from_admin: dbResult.msg_admin
      },
    };
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;
    obj.id = fullUrl.replace(helpers.url, "");
    const streamLink = streamElement.find("#pembed > div.responsive-embed-stream > iframe").attr("src");
    const streamLink2 = streamLink.replace("https://desustream.me/moedesu/", "https://desustream.me/moedesu/hd/")
    console.log(streamLink2);
    obj.link_stream = [
      {
        quality: 480,
        link: await linkStream.get(streamLink)
      },
      {
        quality: 720,
        link: await linkStream.get(streamLink2)
      }
    ]
    if ($('#venkonten > div.venser > div.venutama > div.download > ul > li:nth-child(1)').text() === '') {
      console.log('ul is empty');
      low_quality = _notFoundQualityHandler(response.data, 0)
      medium_quality = _notFoundQualityHandler(response.data, 1)
      high_quality = _notFoundQualityHandler(response.data, 2)
    } else {
      console.log('ul is not empty');
      low_quality = _epsQualityFunction(0, response.data);
      medium_quality = _epsQualityFunction(1, response.data);
      high_quality = _epsQualityFunction(2, response.data);
    }
    obj.link_donwload = { low_quality, medium_quality, high_quality };
    res.send(obj);


  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};

function _epsQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download");
  const download_links = [];
  let response;

  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this).find("li").eq(num).find("a").each(function () {
      const _list = {
        host: $(this).text(),
        link: $(this).attr("href"),
      };
      download_links.push(_list);
      response = { quality, size, download_links };

    });
  });
  return response;
}

function _notFoundQualityHandler(res, num) {
  const $ = cheerio.load(res);
  const download_links = [];
  const element = $('.download')
  let response;

  element.filter(function () {
    if ($(this).find('.anime-box > .anime-title').eq(0).text() === '') {
      $(this).find('.yondarkness-box').filter(function () {
        const quality = $(this).find('.yondarkness-title').eq(num).text().split('[')[1].split(']')[0];
        const size = $(this).find('.yondarkness-title').eq(num).text().split(']')[1].split('[')[1];
        $(this).find('.yondarkness-item').eq(num).find('a').each((idx, el) => {
          const _list = {
            host: $(el).text(),
            link: $(el).attr("href"),
          };
          download_links.push(_list);
          response = { quality, size, download_links };
        })
      })
    } else {
      $(this).find('.anime-box').filter(function () {
        const quality = $(this).find('.anime-title').eq(num).text().split('[')[1].split(']')[0];
        const size = $(this).find('.anime-title').eq(num).text().split(']')[1].split('[')[1];
        $(this).find('.anime-item').eq(num).find('a').each((idx, el) => {
          const _list = {
            host: $(el).text(),
            link: $(el).attr("href"),
          };
          download_links.push(_list);
          response = { quality, size, download_links };
        })
      })
    }
  })
  return response;

}