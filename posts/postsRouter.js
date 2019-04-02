const express = require('express');

const db = require('../data/db.js');

const router = express.Router();

router.post('/', async (req, res) => {

    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        return;
    }
    try {
        const post = await db.insert(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    }
});

router.get('/', async (req, res) => {

    try {
        const posts = await db.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

router.get('/:id', async (req, res) => {

    try {
        const post = await db.findById(req.params.id);
        if (post.length) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        res.status(500).json({ error: "The post information could not be retrieved." });
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const post = await db.findById(req.params.id);
        if (post.length) {
            await db.remove(req.params.id);
            res.status(200).json({ message: `Post with ID: ${req.params.id} deleted.` });
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        res.status(500).json({ error: "The post could not be removed" });
    }
});

router.put('/:id', async (req, res) => {

    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        return;
    }
    try {
        const post = await db.findById(req.params.id);
        if (post.length) {
            await db.update(req.params.id, req.body);
            const updatedpost = {...post[0], ...req.body}; 
            res.status(200).json(updatedpost);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        res.status(500).json({ error: "The post information could not be modified." });
    }
});

module.exports = router;