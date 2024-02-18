const config = {
  bangumi_id: 39947
}

async function getKeys(cursor = undefined) {
  const keys = await KV.list({ cursor: cursor })
  return new Response(JSON.stringify(keys));
}

async function getValues(cursor = undefined) {
  const keys = await KV.list({ cursor: cursor })
  var r = {}
  for (let index = 0; index < keys.keys.length; index++) {
    const element = keys.keys[index]['name'];
    r[element] = JSON.parse(await KV.get(element))

  }
  r['cursor'] = keys.cursor
  return new Response(JSON.stringify(r));
}

async function update() {
  const response = await fetch(`https://api.bilibili.com/pgc/web/season/stat?season_id=${config.bangumi_id}`)
  const r = await response.json()

  var result = r['result']
  
  var res = {
    coin: result['coins'],
    danmakus: result['danmakus'],
    follow: result['follow'],
    likes: result['likes'],
    series_follow: result['series_follow'],
    shares: result['shares'],
    views: result['views'],
    timestamp : Date.now()
  }
  console.log(res)
  await KV.put(Date.now(), JSON.stringify(res))
  
  return new Response(JSON.stringify(res))
}

async function handleRequest(request) {
  const requestURL = new URL(request.url);
  const path = requestURL.pathname.split("/");
  const params = requestURL.search;

  switch (path[1]) {
    case 'update':
      return await update()
      break
    case 'get':
      if (path[2] == 'values') {
        return getValues(params['cursor'])
      }
      else {
        return getKeys(params['cursor'])
      }
      break
    default:
      return getKeys()
  }

}

addEventListener('scheduled', update)
addEventListener('fetch', (event) => {
  event.respondWith(
    handleRequest(event.request)
      .catch(
        (err) => new Response(err.stack, { status: 500 })
      )
  );
});
