const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");

const Student = require("./models/student.model");
const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/StudentInformationSystem")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

let students = [];


app.get("/fetchstudents", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});


app.post("/addstudentmongo", async (req, res) => {
    const newStudent = req.body;

    try {
        const student = new Student(newStudent);
        await student.save();
        res.status(201).json(student);
        console.log("Added Student:", student);
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Error adding student" });
    }
});


app.put("/updatestudent/:id", (req, res) => {
    const { id } = req.params;
    const updatedStudent = req.body;

    let studentIndex = students.findIndex(student => student.idNumber === id);

    if (studentIndex !== -1) {
        students[studentIndex] = { ...students[studentIndex], ...updatedStudent };
        res.json({ message: "Student updated successfully", updatedStudent: students[studentIndex] });
        console.log("Updated Student:", students[studentIndex]);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});


app.get("/", (req, res) => {
    res.send("Lyle koa cutie!");
});


const port = 1337;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.delete("/deletestudent/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = students.length;
    
    students = students.filter(student => student.idNumber !== id);

    if (students.length < initialLength) {
        res.json({ message: "Student deleted successfully" });
        console.log("Deleted Student ID:", id);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

const USERS_FILE = "user.json";


const loadUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return []; 
    }
};


const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
};


let users = loadUsers();


app.get("/fetchusers", (req, res) => {
    res.json(users);
});


app.post("/addusers", (req, res) => {
    const newUser = req.body;

    if (users.some(user => user.userId === newUser.userId)) {
        return res.status(400).json({ message: "User with this ID already exists" });
    }

    users.push(newUser);
    saveUsers(users); 
    res.status(201).json({ message: "User added successfully" });
    console.log("Added User:", newUser);
});






app.put("/updateuser/:id", (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    console.log("Received Update Request for ID:", id);
    console.log("Received Data:", updatedUser);

   
    let userIndex = users.findIndex(user => String(user.userId) === String(id));

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        saveUsers(users); 
        console.log("Updated User:", users[userIndex]);
        res.json({ message: "User updated successfully", user: users[userIndex] });
    } else {
        console.log("User Not Found");
        res.status(404).json({ message: "User not found" });
    }
});


app.delete("/deleteuser/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = users.length;
    
    users = users.filter(user => user.userId !== id);

    if (users.length < initialLength) {
        saveUsers(users); 
        res.json({ message: "User deleted successfully" });
        console.log("Deleted User ID:", id);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});
