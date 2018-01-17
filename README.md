# DESCRIPTION
- Vue-cli demo project
- use youtube-dl to parse online video play url

## Demo
- https://urlp.heroku.com/

## Build Setup

``` bash
# install dependencies
npm install

# Development mode
## start dev server
npm run dev
npm run py

# Production mode
## build
npm run build
## start server
set PORT=80 && npm start
```
### youtube signature API demo
- http://urlp.herokuapp.com/yts?s=6D6D5247217C2EB22945406888C21FD775B3209065.28F3AA41915594D913C730C6309B9A03C23BCDFDFD&js=/yts/jsbin/player-vflu-7yX5/en_US/base.js
- 参数s: 签名字符
- 参数js: 视频的js签名算法(视频网页中可找到)
- Response：解析后的字符

### Reference
https://github.com/rg3/youtube-dl

