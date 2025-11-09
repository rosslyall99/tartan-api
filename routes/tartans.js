module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // GET /tartans
    router.get('/', (req, res) => {
        const { name } = req.query;
        const query = name
            ? `SELECT * FROM tartans WHERE name LIKE ?`
            : `SELECT * FROM tartans`;
        const params = name ? [`%${name}%`] : [];

        db.query(query, params, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // GET /tartans/:id
    router.get('/:id', (req, res) => {
        db.query(
            `SELECT * FROM tartans WHERE id = ?`,
            [req.params.id],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length === 0) return res.status(404).json({ error: 'Not found' });
                res.json(results[0]);
            }
        );
    });

    // ✅ POST /tartans — must be inside this function
    router.post('/', (req, res) => {
        const { name, mill, cloth, weight, kilt_url, outfit_url, image_url } = req.body;

        if (!name || !mill || !cloth || !weight) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        db.query(
            'INSERT INTO tartans (name, mill, cloth, weight, kilt_url, outfit_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, mill, cloth, weight, kilt_url, outfit_url, image_url],
            (err, result) => {
                if (err) {
                    console.error('Error adding tartan:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json({ message: 'Tartan added successfully', id: result.insertId });
            }
        );
    });

    return router;
};