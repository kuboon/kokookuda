const {JSDOM} = require('jsdom');
const {sessionid} = process.env
const pick = (...props) => o => props.reduce((a, e) => ({ ...a, [e]: o[e] }), {});

const insta = () => {
  return fetch({
    uri: 'https://www.instagram.com/kokookuda/?__a=1',
    headers: {
      'cookie': `sessionid=${sessionid}`
    },
    json: true
  });
};

function getJson(html) {
  const {document} = (new JSDOM(html)).window
  return [...document.querySelectorAll('#react-root div._2z6nI a')].slice(0,9).map(a => {
    const img = a.querySelector("img")
    return {href: a.href, src: img.src, srcset: img.srcset}
  });
}

exports.handler = async (event, context)=>{
  console.log('version', 1)
  const json = await insta()
  , json2 = json.graphql.user.edge_owner_to_timeline_media.edges.slice(0,9).map(m=>{
    return {
      href: m.node.shortcode,
      src: m.node.thumbnail_src,
      srcset: m.node.thumbnail_resources.map(r=>`${r.src} ${r.config_width}w`).join(',')
    }
  })
  , body = JSON.stringify(json2)
  return {
    statusCode: 200,
    headers: {
      "Cache-Control": "public, max-age=600"
    },
    body
  }
}

exports.handler(null, null).then((res)=>console.log(res.body));
