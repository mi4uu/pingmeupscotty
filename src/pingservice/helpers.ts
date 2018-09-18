export const obj2buffer = obj => Buffer.from(JSON.stringify(obj) + '\n')
export const hostsRegexp = /^(?=.{1,253}\.?$)(?:(?!-|[^.]+_)[A-Za-z0-9-_]{1,63}(?<!-)(?:\.|$)){2,}$/
