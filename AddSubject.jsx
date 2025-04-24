import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css';
import "./AddStudent.css";
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from "axios";
import AddCircleIcon from '@mui/icons-material/AddCircle';

function AddStudent() {
    const [students, setStudents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false); // State for new student modal
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const addIdRef = useRef();
    const addFirstRef = useRef();
    const addLastRef = useRef();
    const addMiddleRef = useRef();
    const addCourseRef = useRef();
    const addYearRef = useRef();

    const idRef = useRef();
    const firstRef = useRef();
    const lastRef = useRef();
    const middleRef = useRef();
    const courseRef = useRef();
    const yearRef = useRef();

    // Fetch students from the server
    async function fetchStudents() {
        try {
            const response = await axios.get("http://localhost:1337/fetchstudents");
            setStudents(response.data);
            console.log("Fetched students:", response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

    // Handle adding a new student
    async function handleClick() {
        const newStudent = {
            idNumber: addIdRef.current.value,
            first: addFirstRef.current.value,
            last: addLastRef.current.value,
            middle: addMiddleRef.current.value,
            course: addCourseRef.current.value,
            year: addYearRef.current.value,
        };

        try {
            // Adding the student
            await axios.post("http://localhost:1337/addstudents", newStudent);
            console.log("Added student:", newStudent);

            // Fetch the updated list of students
            fetchStudents();

            // Clear the form after submitting
            addIdRef.current.value = "";
            addFirstRef.current.value = "";
            addLastRef.current.value = "";
            addMiddleRef.current.value = "";
            addCourseRef.current.value = "";
            addYearRef.current.value = "";

            // Close the modal after adding
            setOpenAddModal(false);
        } catch (error) {
            console.error("Error adding student:", error);
        }
    }

    // Handle opening the modal for editing a student
    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setOpenModal(true);
    };

    // Handle closing the edit student modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedStudent(null);
    };

    // Handle updating an existing student
    const handleUpdateStudent = async () => {
        if (!selectedStudent) return;

        const updatedStudent = {
            idNumber: idRef.current?.value || selectedStudent.idNumber,
            first: firstRef.current?.value || selectedStudent.first,
            last: lastRef.current?.value || selectedStudent.last,
            middle: middleRef.current?.value || selectedStudent.middle,
            course: courseRef.current?.value || selectedStudent.course,
            year: yearRef.current?.value || selectedStudent.year,
        };

        try {
            await axios.put(`http://localhost:1337/updatestudent/${selectedStudent.idNumber}`, updatedStudent);
            console.log("Updated student:", updatedStudent);
            fetchStudents();
            handleCloseModal();
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    // Handle deleting a student
    const handleDeleteStudent = async (idNumber) => {
        try {
            await axios.delete(`http://localhost:1337/deletestudent/${idNumber}`);
            console.log("Deleted student with ID:", idNumber);
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    // Open the modal to add a new student
    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    };

    // Close the modal for adding a new student
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="Buttons">
                <Typography variant="h2">STUDENT MANAGEMENT</Typography>
                <br />
                {/* Button to open the "Add New Student" modal */}
                <Button onClick={handleOpenAddModal} variant="contained" color="primary" id="addnew"> <AddCircleIcon/> Add Student</Button>
                
                {/* Modal for Adding a New Student */}
                <Dialog open={openAddModal} onClose={handleCloseAddModal}>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogContent>
                        <TextField inputRef={addIdRef} label="ID Number" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={addFirstRef} label="First Name" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={addLastRef} label="Last Name" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={addMiddleRef} label="Middle Name" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={addCourseRef} label="Course" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={addYearRef} label="Year" variant="outlined" fullWidth margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddModal} color="primary" >Cancel</Button>
                        <Button onClick={handleClick} color="primary" >Add Student</Button>
                    </DialogActions>
                </Dialog>

                {/* Student List Display (Cards) */}
                <div className="view">
                    {students.map((student, index) => (
                        <Card key={index}>
                            <CardContent>
                                <h3>Student ID: {student.idNumber}</h3>
                                <p>Last Name: {student.last}</p>
                                <p>First Name: {student.first}</p>
                                <p>Middle Name: {student.middle}</p>
                                <p>Course: {student.course}</p>
                                <p>Year: {student.year}</p>
                                <Button onClick={() => handleOpenModal(student)} color="primary">Edit</Button>
                                <Button onClick={() => handleDeleteStudent(student.idNumber)} color="error">Delete</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modal for Editing a Student */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <>
                            <TextField label="ID Number" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.idNumber} inputRef={idRef} />
                            <TextField label="First Name" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.first} inputRef={firstRef} />
                            <TextField label="Last Name" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.last} inputRef={lastRef} />
                            <TextField label="Middle Name" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.middle} inputRef={middleRef} />
                            <TextField label="Course" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.course} inputRef={courseRef} />
                            <TextField label="Year" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.year} inputRef={yearRef} />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Cancel</Button>
                    <Button onClick={handleUpdateStudent} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddStudent;
