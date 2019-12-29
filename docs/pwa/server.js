const express = require('express')
const path = require('path')

const PORT = 8000
const app = express()

app.use(express.static(path.resolve(__dirname, './www')))

app.listen(PORT, () => {
  console.log(`test server listning on port ${PORT}`)
})
