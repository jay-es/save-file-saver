// @ts-check
const dateformat = require('dateformat')
const debounce = require('debounce')
const { exec } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

const {
  WATCH_DIR,
  DEST_DIR,
  DEBOUNCE_INTERVAL,
  MAX_DIR_COUNT
} = require('./config')

/**
 * @param {string} event
 * @param {string} filename
 */
const watchCallback = (event, filename) => {
  const dateStr = dateformat(new Date(), 'yyyy年mm月dd日HH時MM分ss秒')
  const newDir = path.resolve(DEST_DIR, dateStr)

  fs.copySync(WATCH_DIR, newDir)
  console.info(dateStr)
  delExtraDirs()
}

const delExtraDirs = () => {
  const files = fs.readdirSync(DEST_DIR, { withFileTypes: true })
  const dirNames = files.filter(v => v.isDirectory()).map(v => v.name)

  dirNames.slice(0, -MAX_DIR_COUNT).forEach(dirName => {
    fs.remove(path.resolve(DEST_DIR, dirName))
  })
}

console.log('start')
fs.watch(WATCH_DIR, debounce(watchCallback, DEBOUNCE_INTERVAL))

// ディレクトリがなければ作成
fs.mkdirpSync(DEST_DIR)

// エクスプローラー起動
exec(`start "" "${WATCH_DIR}"`)
exec(`start "" "${DEST_DIR}"`)
