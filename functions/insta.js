const {prerender_token} = process.env
const prerender = require('prerender-node').set('prerenderToken', prerender_token);
const {JSDOM} = require('jsdom');

async function fetch(url){
  const req = {
    connection: {encrypted: true},
    headers: {
      'Accept-Encoding': 'gzip',
      host: 'www.instagram.com',
      'user-agent':'googlebot'
    },
    method: "GET",
    url: '/kokookuda/'
  } 
  return new Promise((resolve, reject)=>{
    prerender.getPrerenderedPageResponse(req, (err,res)=>{if(err)reject(err);else resolve(res)})
  })
}
const insta = async () => {
  const res = await fetch('https://www.instagram.com/kokookuda/');
  return getJson(res.body);
};

function getJson(html) {
  const {document} = (new JSDOM(html)).window
  return [...document.querySelectorAll('#react-root div._2z6nI a')].slice(0,9).map(a => {
    const img = a.querySelector("img")
    return {href: a.href.slice(3), src: img.src, srcset: img.srcset}
  });
}

exports.handler = async(event, context)=> {
  console.log('version', 3)
  const json = await insta()
  return {
    statusCode: 200,
    headers: {
      "Cache-Control": "public, max-age=600"
    },
    body: JSON.stringify(json)
  }
}

//exports.handler(null, null, (_,res)=>console.log(res.body));

