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

    // POST /tartans
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

    // PUT /tartans/:id
    router.put('/:id', (req, res) => {
        const tartanId = req.params.id;
        const fields = req.body;

        const allowedFields = ['name', 'mill', 'cloth', 'weight', 'kilt_url', 'outfit_url', 'image_url'];
        const updates = [];
        const values = [];

        for (const key of allowedFields) {
            if (fields[key] !== undefined) {
                updates.push(`${key} = ?`);
                values.push(fields[key]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        values.push(tartanId);

        db.query(
            `UPDATE tartans SET ${updates.join(', ')} WHERE id = ?`,
            values,
            (err, result) => {
                if (err) {
                    console.error('Error updating tartan:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Tartan not found' });
                }

                res.status(200).json({ message: 'Tartan updated successfully' });
            }
        );
    });

    // DELETE /tartans/:id
    router.delete('/:id', (req, res) => {
        const tartanId = req.params.id;

        db.query('DELETE FROM tartans WHERE id = ?', [tartanId], (err, result) => {
            if (err) {
                console.error('Error deleting tartan:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Tartan not found' });
            }

            res.status(200).json({ message: 'Tartan deleted successfully' });
        });
    });

    return router;
};