const mongoose = require('mongoose');

const PageFieldsSchema = new mongoose.Schema({
    Page: {
        type: String,
        required: true,
    },
    PageFields: [
        {
            Headers: {
                type: String,
                required: true,
            },
            Type: {
                type: String,
                required: true,
            },
        },
    ],
});

const PageFields = mongoose.model('PageFields', PageFieldsSchema);

module.exports = PageFields;
