const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        // SQL => SELECT * FROM messages;
        // knex
        const messages = await db.select("*").from("messages")

        res.json(messages)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        // SQL => SELECT * FROM messages WHERE id = ?
        // knex
        const messages = await db
            .select("*")
            .from("messages")
            .where("id", req.params.id)
            .limit(1)
        
        // select always sends back an array even if there is only one result
        res.json(messages[0]);

    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        // SQL => INSERT INTO messages (title, contents) VALUES (?, ?);
        // knex
        const [id] = await db
            .insert({
                // database will automatically generate the ID
                title: req.body.title,
                contents: req.body.contents
            })
            .into("messages")

        const message = await db("messages")
            // calling db("messages") replaces the 2 following lines of code
            //.select("*")
            //.from("messages")
            .where("id", id)
            .first()
            // .first() is a knes command that is the same as .limit(1)
        
        // database returns the row id of the newly created resource
        res.status(201).json(message)
    } catch (err) {
        next(err)
    }
})

router.put("/:id", (req, res, next) => {
    // SQL => UPDATE messages SET title =? AND contents =? WHERE id =?
    // knex 
    await db("messages")
        .update({/* new data */})
        .where("id", req.params.id)

    // use req.params.id to make select statement to send back updated object
})

router.delete("/:id", (req, res, next) => {
    // SQL => DELETE FROM messages WHERE id =?
    //knex
    await db("messages")
        .where("id", req.params.id)
        .del()

    // send a 204 back or 200 with a message
})

module.exports = router