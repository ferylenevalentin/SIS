const mongoose = require("mongoose");

const Student = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        firstName: {type: String, require: true},
        lastName: {type: String, require: true},
        middleName: {type: String},
        course: {type: String, require: true},
        year: {type: String, require: true},
    },
    {collection: "student-data"}
);
module.exports = mongoose.model("Student", Student );