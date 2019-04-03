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
  //return prerender.buildApiUrl(req);

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
  debugger
  return [...document.querySelectorAll('#react-root div._2z6nI a')].map(a => {
    const img = a.querySelector("img")
    return {href: a.href, src: img.src, srcset: img.srcset}
  });
}

exports.handler = async(event, context, callback)=> {
  callback(null, {
    statusCode: 200,
    body: await insta()
  });
}

//exports.handler(null, null, (_,res)=>console.log(res.body));

