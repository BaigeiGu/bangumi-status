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

function update() {
    fetch(`https://api.bilibili.com/pgc/web/season/stat?season_id=${config.bangumi_id}`)
        .then((response) => {
            response.json().then((data) => {
                var re = data['result']
                var res = {
                    coin: re['coins'],
                    danmakus: re['danmakus'],
                    follow: re['follow'],
                    likes: re['likes'],
                    series_follow: re['series_follow'],
                    shares: re['shares'],
                    views: re['views'],
                }
                KV.put(Date.now(), JSON.stringify(res))
            })
        })
}


async function handleRequest(request) {
    const requestURL = new URL(request.url);
    const path = requestURL.pathname.split("/");
    const params = requestURL.search;

    // console.log(path)

    switch (path[1]) {
        case 'update':
            update()
            return fetch(`https://api.bilibili.com/pgc/web/season/stat?season_id=${config.bangumi_id}`)
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
