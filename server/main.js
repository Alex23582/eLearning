const crypto = require('crypto')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { getUserFromUsername, getSession, getUserFromSession, getCourses, getCouseByShortname, getHomework, getHomeworkList, checkIfHomeworkBelongsToUser, submitHomework } = require('./db')
const { formatTimeDate, formatTime, getHWFiles } = require('./utils')
const app = express()
app.use(express.json({ limit: "100mb" }))
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser())
const port = 4000

app.post('/login', async (req, res) => {
  const userdata = await getUserFromUsername(req.body.username)
  if (!userdata) {
    res.send({ error: "Falsche Zugangsdaten" })
  }
  const hash = crypto.createHash('sha256').update(req.body.password + userdata.salt).digest('hex');
  if (hash == userdata.password) {
    res.send({ session: await getSession(userdata.id) })
  } else {
    res.send({ error: "Falsche Zugangsdaten" })
  }
})

app.get('/courses', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  res.send(await getCourses())
})

app.get('/getCourseInfo/:course', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  const course = await getCouseByShortname(req.params.course)
  res.send({ name: course.fullname })
})

app.get('/getHomeworkList/:course', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  let results = await getHomeworkList(user.id, req.params.course)
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    result.createdT = formatTime(result.created)
    result.created = formatTimeDate(result.created)
    result.expiryT = formatTime(result.expiry)
    result.expiry = formatTimeDate(result.expiry)
  }
  res.send({ homeworks: results })
})

app.post('/getHomework', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  const info = await getHomework(req.body.hwid, req.body.courseid, user.id)
  info.createdT = formatTime(info.created)
  info.created = formatTimeDate(info.created)
  info.expiryT = formatTime(info.expiry)
  info.expiry = formatTimeDate(info.expiry)
  info.files = await getHWFiles(info.uuid, 0)
  info.sentfiles = await getHWFiles(info.uuid, 1)
  res.send(info)
})

app.post('/submitHomework', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  if (await checkIfHomeworkBelongsToUser(req.body.hwid, user.id)) {
    await submitHomework(req.body.hwid, req.body.submittext)
    res.send({error: null})
  } else {
    res.send("Fehler. Du hast kein Zugriff auf diese Datei!")
  }
})

app.get('/file/:hwid/:type/:filename', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  if (await checkIfHomeworkBelongsToUser(req.params.hwid, user.id)) {
    fs.createReadStream(`${__dirname}/files/homework/${req.params.hwid}/${req.params.type == 0 ? "giver" : "taker"}/${decodeURIComponent(req.params.filename)}`).pipe(res)
  } else {
    res.send("Fehler. Du hast kein Zugriff auf diese Datei!")
  }
})

app.post('/uploadFile/:hwid', async (req, res) => {
  const user = await getUserFromSession(req.cookies.session)
  if (!user) {
    res.send({ error: "Nicht eingeloggt!" })
    return
  }
  if (await checkIfHomeworkBelongsToUser(req.params.hwid, user.id)) {
    for (let i = 0; i < req.body.files.length; i++) {
      const file = req.body.files[i]
      fs.writeFileSync(`${__dirname}/files/homework/${req.params.hwid}/taker/${file.name}`, Buffer.from(file.data.split(",")[1], "base64"))
    }
    res.send(await getHWFiles(req.params.hwid, 1))
  } else {
    res.send({ error: "Fehler. Du hast kein Zugriff auf diese Aufgabe!" })
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})