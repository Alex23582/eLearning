const crypto = require('crypto')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, shortname VARCHAR(16), fullname VARCHAR(32), desc VARCHAR(256), UNIQUE(id))");
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username VARCHAR(32), password VARCHAR(64), salt VARCHAR(32), email VARCHAR(64), session VARCHAR(64), type INTEGER, UNIQUE(id)) ")
    db.run("CREATE TABLE IF NOT EXISTS homework (id INTEGER PRIMARY KEY, uuid TEXT, courseid INTEGER, giver INTEGER, taker INTEGER, title VARCHAR(64), description TEXT, created INTEGER, expiry INTEGER, finished BOOLEAN, finishtime INTEGER, submittext TEXT, UNIQUE(id))")
});

function getUserFromUsername(username) {
    return new Promise((resolve) => {
        db.all("SELECT * FROM users WHERE username = ?", [username.toLowerCase()], (err, rows) => {
            if (err) {
                console.error(err)
            }
            if (rows.length == 0) {
                resolve(null)
                return;
            }
            resolve(rows[0])
        })
    })
}

function getUserFromSession(session) {
    return new Promise((resolve) => {
        db.all("SELECT * FROM users WHERE session = ?", [session], (err, rows) => {
            if (err) {
                console.error(err)
            }
            if (rows.length == 0) {
                resolve(null)
                return;
            }
            resolve(rows[0])
        })
    })
}

async function getSession(userid) {
    const session = crypto.randomBytes(32).toString("hex")
    await new Promise((resolve) => {
        db.run("UPDATE users SET session = ? WHERE id = ?", [session, userid], (err) => {
            if (err) {
                console.error(err)
            }
            resolve()
        })
    })
    return session
}

async function getCourses() {
    return new Promise((resolve) => {
        db.all("SELECT * FROM courses", (err, rows) => {
            if (err) {
                console.error(err)
            }
            resolve(rows.map((row) => {
                {
                    return {
                        id: row.shortname,
                        name: row.fullname,
                        description: row.desc
                    }
                }
            }))
        })
    })
}

async function getCouseByShortname(shortname) {
    return new Promise((resolve) => {
        db.all("SELECT * FROM courses WHERE shortname = ?", [shortname], (err, rows) => {
            if (err) {
                console.error(err)
            }
            resolve(rows[0])
        })
    })
}

async function submitHomework(hwid, text){
    return new Promise((resolve) => {
        db.run("UPDATE homework SET finished = TRUE, finishtime = ?, submittext = ? WHERE uuid = ?", [Math.round(Date.now()/1000), text, hwid], (err) => {
            if (err) {
                console.error(err)
            }
            resolve()
        })
    })
}

async function getHomework(hwid, courseid, taker) {
    return new Promise((resolve) => {
        db.all("SELECT homework.uuid, homework.title, homework.created, homework.submittext, homework.expiry, homework.description, courses.shortname, users.username as teacher FROM homework LEFT JOIN courses ON courses.id = homework.courseid LEFT JOIN users ON homework.giver = users.id WHERE shortname = ? AND taker = ? AND homework.uuid = ?", [courseid, taker, hwid], (err, rows) => {
            if (err) {
                console.error(err)
            }
            if (rows.length == 0) {
                resolve(null)
                return;
            }
            resolve(rows[0])
        })
    })
}


async function checkIfHomeworkBelongsToUser(hwid, userid){
    return new Promise((resolve) => {
        db.all("SELECT * FROM homework WHERE (taker = ? OR giver = ?) AND uuid = ?", [userid, userid, hwid], (err, rows) => {
            resolve(rows.length > 0)
        })
    })
}


async function getHomeworkList(userid, courseid) {
    return new Promise((resolve) => {
        db.all("SELECT homework.* FROM homework LEFT JOIN courses ON courses.id = homework.courseid WHERE courses.shortname = ? AND taker = ?", [courseid, userid], (err, rows) => {
            if (err) {
                console.error(err)
            }
            resolve(rows)
        })
    })
}

module.exports = { submitHomework, checkIfHomeworkBelongsToUser, getUserFromUsername, getSession, getUserFromSession, getCourses, getCouseByShortname, getHomework, getHomeworkList }