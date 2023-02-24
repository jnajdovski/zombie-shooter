const fs = require('fs')
fs.readFile('public/index.html', 'utf8', (un , text) => {
   fs.writeFile('public/index.html', text.replace('%27.%27/', ''), () => {})
})