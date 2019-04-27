// @ts-check
const dateformat = require('dateformat')
const debounce = require('debounce')
const fs = require('fs-extra')
const path = require('path')

const {
  WATCH_PATH,
  DEST_PATH,
  DEBOUNCE_INTERVAL,
  MAX_DIR_COUNT
} = require('./config')

/**
 * @param {string} event
 * @param {string} filename
 */
const watchCallback = (event, filename) => {
  const dateStr = dateformat(new Date(), 'yyyy-mm-dd_HH-MM-ss')
  const newDir = path.resolve(DEST_PATH, dateStr)

  fs.copySync(WATCH_PATH, newDir)
  console.info(dateStr)
  delExtraDirs()
}

const delExtraDirs = () => {
  const files = fs.readdirSync(DEST_PATH, { withFileTypes: true })
  const dirNames = files.filter(v => v.isDirectory()).map(v => v.name)

  dirNames.slice(0, -MAX_DIR_COUNT).forEach(dirName => {
    fs.remove(path.resolve(DEST_PATH, dirName))
  })
}

fs.watch(WATCH_PATH, debounce(watchCallback, DEBOUNCE_INTERVAL))
