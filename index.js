// @ts-check
const dateformat = require('dateformat')
const debounce = require('debounce')
const fs = require('fs-extra')
const path = require('path')

const {
  WATCH_PATH,
  DEST_PATH,
  DEBOUNCE_INTERVAL,
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
}

fs.watch(WATCH_PATH, debounce(watchCallback, DEBOUNCE_INTERVAL))
