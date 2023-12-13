const app = require('./app');
const express = require('express');


require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`recipes running on port ${PORT}`);
});


