const request = require('request').defaults({jar: true})
//const {JSDOM} = require('jsdom')
const url = 'https://www.instagram.com/graphql/query/?query_hash=f2405b236d85e8296cf30347c9f08c2a&variables={"id"%3A"40602839"%2C"first"%3A12%2C"after"%3A"QVFEU1BBcTRwTWc3azI4dlRyeWNqbEliV0duRGtrTTdrdU13ejBRcmExcmZrMVZnQTRKbnJSY3FaY1FEaEFUZ0Q5T0xtdTVNeVpPVnF6aDAtRGpQcTV6dg%3D%3D"}'

function requestA(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        console.error(error, res)
        reject(error);
      }
    });
  });
}

async function instaHtml(){
  await requestA("https://www.instagram.com")
  const body = await requestA(url)
  return body
  const json = JSON.parse(body)
  console.log(json.data)
  return json.data.user.edge_owner_to_timeline_media.edges.map(e=>e.node)
  const dom = new JSDOM(body)
  , nodes = dom.window.document.querySelectorAll("#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(-n+3)")
  , html = Array.from(nodes).map(d=>d.outerHTML).join('')
  return html
}

exports.handler = async(event, context, callback)=> {
  callback(null, {
    statusCode: 200,
    body: await instaHtml()
  });
}

