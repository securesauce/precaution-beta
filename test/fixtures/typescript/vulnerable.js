const fs = require('fs-extra')
var stdin = process.openStdin()

function bildngSQLQuery () {
  const userId = 1
  const query = `SELECT * FROM users WHERE id = ${userId}`
  return query
}

function getTemplateGreeting (name) {
  let classicString = `Hello ${name}`
  return eval('`' + classicString + '`') // eslint-disable-line
}

function openFile () {
  console.log('Give me a file path to open: ')
  stdin.addListener('data', function (filePath) {
    fs.open(filePath)
  })
}

let query = bildngSQLQuery()
let templateGreeting = getTemplateGreeting('Martin')

console.log('The query is: ', query)
console.log('The greeting is: ', templateGreeting)

openFile()
