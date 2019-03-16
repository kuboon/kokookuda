async function instaHtml(){
  return "<p>sample html</p>"
}

exports.handler = async(event, context, callback)=> {
  callback(null, {
    statusCode: 200,
    body: await instaHtml()
  });
}

