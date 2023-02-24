const fs = require('fs')
const filePath = 'helpers/server.js'
const copy = 'public/server.js'
fs.copyFile(filePath, copy, (error) => {
  if (error) {
    throw error
  } else {
    console.log('File has been moved to another folder.')
  }
})