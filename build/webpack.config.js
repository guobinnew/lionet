
const path = require('path')
const fs = require('fs')

const distPath = path.join(__dirname, '../dist')
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath)
}

module.exports = {
  //target: 'node',
  mode: 'development',
  entry: path.join(__dirname, '../dist/js/index.js'),
  output: {
    path: distPath,
    filename: 'lionet.js'
  },
  devtool: 'none'
}