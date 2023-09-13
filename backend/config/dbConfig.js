if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const { Client } = require('pg')

const connectionString = process.env.DB_URL
const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false // Set to `true` if the SSL/TLS certificate should be verified
    }
})

client.connect((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log("Connected")
})

module.exports = {
    query : (text , params , callback) => {
        return client.query(text , params , callback)
    }
}