// @ts-check
const dateformat = require('dateformat')
const debounce = require('debounce')
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
  const dateStr = dateformat(new Date(), 'yyyy-mm-dd_HH-MM-ss')
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

fs.watch(WATCH_DIR, debounce(watchCallback, DEBOUNCE_INTERVAL))
