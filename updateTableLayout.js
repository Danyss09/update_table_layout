const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.json());

// Database connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'dani0919', 
    database: 'TableUpdateDb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Edit Table Layout endpoint
app.put('/edit-table/:tableId', (req, res) => {
    const tableId = req.params.tableId;
    const { tableName, seats, available } = req.body;

    if (!tableName || !seats || available === undefined) {
        return res.status(400).json({ message: 'Table name, seats, and availability are required' });
    }

    const query = `
        UPDATE Tables 
        SET TableName = ?, Seats = ?, Available = ? 
        WHERE TableID = ?;
    `;
    
    connection.query(query, [tableName, seats, available, tableId], (err, result) => {
        if (err) {
            console.error('Error updating table: ', err);
            return res.status(500).json({ message: 'Error updating table' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json({ message: 'Table updated successfully' });
    });
});

app.listen(3000, () => {
    console.log('Edit Table Layout microservice is running on port 3000');
});
