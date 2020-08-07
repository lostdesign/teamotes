const fs = require('fs')
const path = require('path')

const { dependencies, author, name, version, description } = require('./package.json')

const config = JSON.stringify({ dependencies, author, name, version, description }, null, 2)

fs.writeFileSync(path.join(__dirname, 'dist', 'package.json'), config)

console.log('Rewrote distribution package.json.')
