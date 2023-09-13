if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express")

const cors = require("cors")
const bodyParser = require('body-parser')

const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const otpgen = require('otp-generators')
const Mailjet = require('node-mailjet')

const db = require('./config/dbConfig')

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    })
}

const logger = require('morgan')
const fs = require('fs')

const mailjet = new Mailjet.apiConnect(process.env.MJ_PUBLIC, process.env.MJ_SECRET)

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(logger('common' , {
    stream: fs.createWriteStream('./Access.logs' , {flags: 'a'})
}))
app.use(logger('dev'))

app.post('/signup', async (req, res) => {
    try {
        if (!req.body.abhaid || !req.body.email) {
            throw new Error('All fields must be filled')
        }

        if (!validator.isEmail(req.body.email)) {
            throw new Error('Enter a valid email')
        }

        if (req.body.abhaid <= 10000000000000 || req.body.abhaid >= 99999999999999) {
            throw new Error('Abha ID should be of 14 digits')
        }

        const query = 'SELECT * FROM USERS WHERE abha_id = $1'
        const { rows } = await db.query(query, [req.body.abhaid])

        const genotp = otpgen.generate(6, { alphabets: false, upperCase: false, specialChar: false })
        const salt = await bcrypt.genSalt(12)
        const hashotp = await bcrypt.hash(genotp, salt)

        if (rows.length !== 0) {
            if (!rows[0].accept) {
                const values2 = [hashotp, req.body.abhaid]
                db.query('UPDATE USERS SET otp=$1 WHERE abha_id=$2', values2, (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: `Error in updation: ${error}` })
                    }

                    const request = mailjet
                        .post('send', { version: 'v3.1' })
                        .request({
                            Messages: [{
                                From: {
                                    Email: "bahetisid06@gmail.com",
                                    Name: "QuantumEyes"
                                },
                                To: [{
                                    Email: req.body.email,
                                    Name: req.body.abhaid.toString()
                                }],
                                Subject: "Welcome to QuantumEyes",
                                HTMLPart: `
                                <body>
                                <center style="background-color: #0f0820; padding-top: 120px; font-family: Roboto, sans-serif; height: 250px">
                                <font color="#ffffff">
                                <h1> Thank you for Signing Up! </h1>
                                <h2>Your OTP is <font color="#a3b1eb">${genotp}</font></h2>
                                </font>
                                </center>
                                </body>
                                `,
                                TextPart: `Your otp is : ${genotp}`
                            }]
                        })

                    return res.json({ success: true })
                })
            } else {
                throw new Error('ABHA ID already in use')
            }
        } else {
            const values = [hashotp, req.body.abhaid, req.body.email]
            db.query('INSERT INTO USERS(email, abha_id, otp) VALUES ($3, $2, $1)', values, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: `Error in insertion: ${error}` })
                }

                const request = mailjet
                    .post('send', { version: 'v3.1' })
                    .request({
                        Messages: [{
                            From: {
                                Email: "bahetisid06@gmail.com",
                                Name: "QuantumEyes"
                            },
                            To: [{
                                Email: req.body.email,
                                Name: req.body.abhaid.toString()
                            }],
                            Subject: "Welcome to QuantumEyes",
                            HTMLPart: `
                            <body>
                            <center style="background-color: #0f0820; padding-top: 120px; font-family: Roboto, sans-serif; height: 250px">
                            <font color="#ffffff">
                            <h1> Thank you for Signing Up! </h1>
                            <h2>Your OTP is <font color="#a3b1eb">${genotp}</font></h2>
                            </font>
                            </center>
                            </body>
                            `,
                            TextPart: `Your otp is : ${genotp}`
                        }]
                    })

                return res.json({ success: true })
            })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})


app.post('/signup2', async (req, res) => {

    try {

        if (!req.body.password) {
            throw new Error('Kindly fill in the password')
        }

        if (!validator.isStrongPassword(req.body.password, { minLength: 8, minUppercase: 0, minSymbols: 0 })) {
            throw new Error('Password must be of minimum 8 characters')
        }

        const salt = await bcrypt.genSalt(12)
        const hashpass = await bcrypt.hash(req.body.password, salt)

        const values = [hashpass, req.body.abhaid]
        db.query('UPDATE USERS SET password=$1 WHERE abha_id=$2', values, (error, results) => {
            if (error) {
                return res.status(500).json({ error: `Error in updation: ${error}` })
            }
            const token = createToken(req.body.abhaid)
            return res.json({ success: true, authToken: token })
        })

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

app.post('/verifyotp', async (req, res) => {

    try {

        if (!req.body.otp) {
            throw Error('OTP cannot be blank')
        }

        const values = [req.body.abhaid]
        const query = 'SELECT * FROM USERS WHERE abha_id = $1'
        const { rows } = await db.query(query, values)

        const dbotp = rows[0].otp
        const match = await bcrypt.compare(req.body.otp, dbotp)

        if (!match) {
            return res.status(400).json({ error: 'OTP incorrect' })
        }
        else {
            const values = [true, req.body.abhaid, '']
            db.query('UPDATE USERS SET otp=$3 , accept=$1 WHERE abha_id=$2', values, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: `Error in updation: ${error}` })
                }

                return res.json({ success: true })
            })
        }

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

app.post('/login', async (req, res) => {

    try {

        if (!req.body.abhaid || !req.body.password) {
            throw Error('All fields must be filled')
        }

        if (req.body.abhaid <= 10000000000000 || req.body.abhaid >= 99999999999999) {
            throw Error('Abha ID should be of 14 digits')
        }

        const values = [req.body.abhaid]

        const query = 'SELECT * FROM USERS WHERE abha_id = $1'

        const { rows } = await db.query(query, values)

        if (rows.length === 0) {
            return res.status(400).json({ error: 'User not found' })
        }

        if (!rows[0].accept) {
            return res.status(400).json({ error: 'Kindly verify your email' })
        }

        const dbhasp = rows[0].password

        const match = await bcrypt.compare(req.body.password, dbhasp)

        if (!match) {
            return res.status(400).json({ error: 'Password incorrect' })
        } else {
            const token = createToken(req.body.abhaid)
            return res.json({ success: true, authToken: token })
        }

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

app.post('/savehistory', async (req, res) => {

    try {

        const values = [req.body.url, req.body.abhaid, req.body.date, req.body.diag]

        if (!req.body.url) {
            throw Error("Kindly upload an image")
        }

        db.query('INSERT INTO HISTORY(url, abha_id, date , diag) VALUES ($1, $2, $3, $4)', values, (error, results) => {
            if (error) {
                return res.status(500).json({ error: `Error in insertion: ${error}` })
            }

            return res.json({ success: true })
        })

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

})

app.post('/getdata', async (req, res) => {

    try {

        const values = [req.body.abhaid]

        const query = 'SELECT * FROM HISTORY WHERE abha_id = $1 order by TO_DATE(date , \'DD-MM-YYYY\') desc'
        const { rows } = await db.query(query, values)

        res.json({ success: true, data: rows })

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})