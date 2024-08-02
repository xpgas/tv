import { writeFileSync } from 'fs'
import { setTimeout } from 'timers/promises'

let m3u = ''
m3u += '#EXTM3U\n';

let i = 1
while (true) {
  console.log(i);
  
  const reqUrl = `https://api.live.bilibili.com/xlive/web-interface/v1/second/getListByArea?sort=online&page=${i}&page_size=30&platform=web`
  const response = await fetch(reqUrl, {
    headers: {
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
    }
  })

  if (response.status !== 200 || response.headers.get('content-type') !== 'application/json; charset=utf-8') {
    console.error(response.status, response.headers.get('content-type'), await response.text())
    process.exit(1);
  }

  const apiRes = await response.json()
  const biliRes = apiRes.data

  for (const value of biliRes.list) {
    m3u += `#EXTINF:-1 tvg-logo="${value.face}" group-title="${value.parent_name}", ${value.uname}\n`
    m3u += `https://www.goodiptv.club/bilibili/${value.roomid}\n`
  }

  if (biliRes.has_more !== 1 || i >= 33) {
    break
  }
  i++

  await setTimeout(Math.floor(Math.random() * 200))
}

writeFileSync('bililive.m3u', m3u)
