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
  })
}
function fbAsyncInit(){
  FB.init({
    appId            : '2601034189912187',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v3.2'
  });
  FB.api(
    '/kokookuda.page', 'GET',
    {
      "access_token": "EAAk9oHbwOHsBAHEOD4TKMyjQyfrJddOVUvdXOPDQi2CvnkzfiUquiZBejPJhLZB3DK8CJsi3VIULzyZCyAGXXUKGeYwh1ZC2W7uXK8b6ckCm3dWzEZAiIjenODt5qK9iyUZBkXW5caYGpopKwM8FIkIkAfb2vyZCgZBjO60ADt3iWzAZCdRgddfywuqolaNZBp8XoZD",
      "fields":"posts.limit(10){created_time,permalink_url,full_picture,link,picture,story,message}"
    },
    function(response) {
      const data = response.posts.data
      , el = document.getElementById('fb-page')
      , tmpl = el.querySelector('template').content.childNodes[0]
      response.posts.data.forEach(p=>{
        const node = tmpl.cloneNode(true) //deep
        if(p.picture){
          node.querySelector('a.photo').href = p.link
          node.querySelector("img").src = p.full_picture
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
