import { obj2buffer, hostsRegexp } from '@pingservice/helpers'
import { PORT as SERVICEPORT, HOST as SERVICEHOST } from '@pingservice/config'
import Koa from 'koa'
import websockify from 'koa-websocket'
import net from 'net'
import compress from 'koa-compress'
import path from 'path'

import logger from 'koa-logger'
import { createReadStream, stat, readFileSync } from 'fs'
import { promisify } from 'util'
const pstat = promisify(stat)
const dist = path.resolve('./dist')
const PORT = process.env.PORT || 3000
const allowedStaticRegexp = /\.(js|map)$/i

const client = new net.Socket()

client.connect(
  SERVICEPORT,
  SERVICEHOST,
  () => {
    console.log('Connected to SERVICE')

    const app = websockify(new Koa())
    app.use(compress())
    app.use(logger())

    app.ws.use((ctx, next) => {
      // @ts-ignore
      ctx.websocket.on('message', message => {
        try {
          const m = JSON.parse(message)
          console.log(m)
          if (m.type === 'load') {
            client.write(
              obj2buffer({
                type: m.type,
              })
            )
          } else if (m.type === 'add') {
            client.write(
              obj2buffer({
                type: m.type,
                host: m.host,
                once: m.once,
              })
            )
          } else if (m.type === 'more') {
            client.write(
              obj2buffer({
                type: m.type,
                last: m.last,
              })
            )
          } else if (m.type === 'purge') {
            client.write(
              obj2buffer({
                type: m.type,
              })
            )
          }
        } catch (e) {
          console.log('err')
          console.log(message)
        }
      })

      client.on('data', data => {
        console.log('(1)client Received: ' + data)
        try {
          const m = JSON.parse(data)
          if (m.type === 'ping') {
            ctx.websocket.send(
              JSON.stringify({
                type: 'PINGS.NEW',
                payload: m,
              })
            )
          } else if (m.type === 'more') {
            for (const p of m.pings) {
              ctx.websocket.send(
                JSON.stringify({
                  type: 'PINGS.NEW',
                  payload: p,
                })
              )
            }
          } else if (m.type === 'added') {
            ctx.websocket.send(
              JSON.stringify({
                type: 'HOST.ADDED',
                payload: m.host,
              })
            )
          } else if (m.type === 'removed') {
            ctx.websocket.send(
              JSON.stringify({
                type: 'HOST.REMOVED',
                payload: m.host,
              })
            )
          } else if (m.type === 'load') {
            ctx.websocket.send(
              JSON.stringify({
                type: 'LOAD',
                payload: { hosts: m.hosts, pings: m.pings },
              })
            )
          } else if (m.type === 'purged') {
            ctx.websocket.send(
              JSON.stringify({
                type: 'HOST.PURGED',
              })
            )
          }
        } catch (e) {
          console.log('err', e)
        }
      })

      return next(ctx)
    })

    app.use(async ctx => {
      if (ctx.url === '/favicon.ico') {
        ctx.body = createReadStream('./src/client/favicon.ico')
      } else if (!allowedStaticRegexp.test(ctx.url)) {
        ctx.status = 200
        ctx.type = 'html'
        ctx.body = createReadStream(path.join('dist', 'index.html'))
      } else {
        const filePath = path.join(dist, ctx.url)
        try {
          await pstat(filePath)
          ctx.body = createReadStream(filePath)
        } catch (err) {
          ctx.status = 404
        }
      }
    })
    app.listen(PORT, () => console.log(`Koa app listening on ${PORT}`))
  }
)

client.on('close', () => {
  console.log('(1)Connection closed')
})
