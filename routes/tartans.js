module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // GET /tartans (optionally filtered by name)
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

    return router;
};
