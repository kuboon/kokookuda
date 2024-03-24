window.twttr = {_e: [
  (t)=>{
    t.events.bind(
      'rendered',
      function (event) {
        event.target.style.width = `${event.target.parentElement.clientWidth}px`
      }
    );
  }
]}

function updateInsta(){
  const headers = {'max-age': 600}
  fetch('.netlify/functions/insta2', {headers})
  .then(res=>{
    if(res.ok)return res.text();
    throw res
  })
  .catch(()=>{
    return fetch('.netlify/functions/insta', {headers}).then(res=>res.text())
  })
  .then(res=>{
    const elems = document.querySelectorAll("#insta a")
    JSON.parse(res).forEach((e,i)=>{
      const a = elems[i], img = a.childNodes[0]
      a.href = `https://www.instagram.com/p/${e.href}`
      img.src = e.src
      img.srcset = e.srcset
    })
    document.getElementById('insta').style.display = 'block'
  })
}
function fbAsyncInit(){
  FB.init({
    appId            : '2601034189912187',
    status           : true,
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v2.7'
  });
  FB.api(
    '/kokookuda.page', 'GET',
    {
      "access_token": "EAAk9oHbwOHsBAInev7BKAzIjA3xWHdiiwLdcxTjzu6YKQlHhtQqx2xparoITFmn2ByRHkstw999wADNZBEdhR9oWn5yDf1Yvamxfq4iOAIZCIV8ZBYrQryVOsNkEixr1ZCyhB20DotjGv0XNC059sz6dSEC4gGbaS7GqPKLU8YHqNr0pGyZBY",
      "fields":"posts.limit(10){created_time,permalink_url,story,message,child_attachments}"
    },
    function(response) {
      const data = response.posts.data
      , el = document.getElementById('fb-page')
      , tmpl = el.querySelector('template').content.childNodes[0]
      response.posts.data.forEach(p=>{
        const node = tmpl.cloneNode(true) //deep
        if(p.child_attachments){
          node.querySelector('a.photo').href = p.permalink_url
          node.querySelector("img").src = p.child_attachments[0].picture
        }else{
          node.querySelector('a.photo').remove()
        }
        if(p.message){
          node.querySelector('.card-text').textContent = p.message
        }else{
          node.querySelector('.card-body').remove()
        }
        const d = new Date(p.created_time.replace("+0000", "Z"))
        , aTag = node.querySelector('.card-header a')
        aTag.href = p.permalink_url
        aTag.text = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        el.appendChild(node)
      })
    }
  );
};
