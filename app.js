const express = require('express')
const fs = require('fs/promises')
const path = require('path')

const app = express()

app.use(express.json());

const PORT = 3000
const DATA_FILE = path.join(__dirname, 'measurements.json')

app.get("/", (req, res, next) => {
    // res.send('HOMEPAGE')
    res.json({
        content: "This is the homepage"
    })

})

app.post("/add-measurements", async (req, res, next) => {
    try {
        const { weight, height } = req.body ?? {};

        if (typeof weight !== 'number' || typeof height !== 'number') {
            return res.status(400).json({
                content: "weight and height must be numbers"
            })
        }

        const entry = { weight, height, date: new Date().toISOString() }

        let entries = []
        try {
            entries = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
        } catch (err) {
            if (err.code !== 'ENOENT') throw err
        }

        entries.push(entry)
        await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2))

        res.status(201).json({
            content: "measurements stored",
            measurement: entry
        })
    } catch (err) {
        next(err)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`)
})