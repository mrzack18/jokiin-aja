const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files (html, css, js)

// CSV Writer Setup
const csvWriter = createCsvWriter({
    path: 'orders.csv',
    header: [
        { id: 'timestamp', title: 'TIMESTAMP' },
        { id: 'name', title: 'NAMA' },
        { id: 'phone', title: 'NO_HP' },
        { id: 'taskType', title: 'JENIS_TUGAS' },
        { id: 'notes', title: 'CATATAN' }
    ],
    append: true
});

// Endpoint to save order
app.post('/api/order', async (req, res) => {
    const { name, phone, taskType, notes } = req.body;
    const timestamp = new Date().toLocaleString('id-ID');

    const record = [
        {
            timestamp,
            name,
            phone,
            taskType,
            notes
        }
    ];

    try {
        await csvWriter.writeRecords(record);
        console.log(`[Order Saved] ${name} - ${taskType}`);
        res.status(200).json({ message: 'Order saved successfully' });
    } catch (error) {
        console.error('Error saving to CSV:', error);
        res.status(500).json({ message: 'Failed to save order' });
    }
});

// Initialize CSV if not exists (add headers)
const csvPath = 'orders.csv';
// Note: csv-writer handles header creation on first write if config is right, 
// but to be safe effectively we usually check. 
// However, createObjectCsvWriter writes headers if file doesn't exist automatically.

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Please use http://localhost:${PORT} to access the website.`);
});
