import { exec } from 'child_process'
import net from 'net'
import { PORT, HOST, SCAN_INTERVAL, PERPAGE, INITIAL } from '@pingservice/config'
import { obj2buffer, hostsRegexp } from '@pingservice/helpers'
interface IPings {
  startTime: number
  result: number
  counter: number
  host: string
}

let db = {}
let pings: IPings[] = []
let counter = 0
const server = net.createServer(socket => {
  const pingHosts = () => {
    const startTime = +new Date()
    console.log('pinging hosts:', Object.keys(db))
    for (const host of Object.keys(db)) {
      exec(`ping -n 1  ${host}`, (err, stdout, stderr) => {
        if (err) {
          addResult(host, startTime, -1)
          return
        }
        if (stderr.length > 2) {
          addResult(host, startTime, -1)
        } else {
          addResult(host, startTime, +new Date() - startTime)
        }
      })
    }
  }
  const addResult = (host, startTime, result) => {
    counter += 1
    const r = {
      startTime,
      result,
      counter,
      host,
    }

    pings.push(r)
    socket.write(
      obj2buffer({
        ...r,
        type: 'ping',
      })
    )
    if (db[host].once) {
      delete db[host]
    }
  }
  setInterval(pingHosts, SCAN_INTERVAL)
  socket.on('data', data => {
    console.log('SERVER socket: ', data.toString('utf8'))
    for (const msg of data
      .toString('utf8')
      .split('\n')
      .filter(m => m.length > 0)) {
      try {
        const { type, host, once, last } = JSON.parse(msg)
        if (host && !host.match(hostsRegexp)) {
          throw new Error('Wrong data')
        }
        if (type === 'load') {
          socket.write(
            obj2buffer({
              type: 'load',
              hosts: Object.keys(db),
              pings: pings.slice(1).slice(-1 * INITIAL),
            })
          )
        }
        if (type === 'add' && typeof host === 'string') {
          if (Object.keys(db).indexOf(host) === -1) {
            db[host] = {
              once,
            }
            console.log(`${host} added`)
            if (!once) {
              socket.write(
                obj2buffer({
                  type: 'added',
                  host,
                })
              )
            }
          }
        } else if (type === 'more') {
          socket.write(
            obj2buffer({
              type: 'more',
              pings: pings
                .filter(p => p.counter < last)
                .slice(1)
                .slice(-1 * PERPAGE),
            })
          )
        } else if (type === 'purge') {
          db = {}
          pings = []
          socket.write(
            obj2buffer({
              type: 'purged',
            })
          )
        } else {
          throw new Error('Wrong data')
        }
      } catch (err) {
        console.log('Wrong data ;( ')
      }
    }
  })
})

server.listen(PORT, HOST)
