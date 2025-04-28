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
    const [openAddModal, setOpenAddModal] = useState(false); 
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

    
    async function fetchStudents() {
        try {
            const response = await axios.get("http://localhost:1337/fetchstudents");
            setStudents(response.data);
            console.log("Fetched students:", response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

   
    async function handleClick() {
        const newStudent = {
            id: addIdRef.current.value,
            firstName: addFirstRef.current.value,
            lastName: addLastRef.current.value,
            middleName: addMiddleRef.current.value,
            course: addCourseRef.current.value,
            year: addYearRef.current.value,
        };

            const idExists = students.some(student => student.id === newStudent.id);
        if (idExists) {
            alert("ID Number already exists. Please use a unique ID.");
            return;
        }


        try {
            
            await axios.post("http://localhost:1337/addstudentmongo", newStudent);
            console.log("Added student:", newStudent);

           
            fetchStudents();

            
            addIdRef.current.value = "";
            addFirstRef.current.value = "";
            addLastRef.current.value = "";
            addMiddleRef.current.value = "";
            addCourseRef.current.value = "";
            addYearRef.current.value = "";

            
            setOpenAddModal(false);
        } catch (error) {
            console.error("Error adding student:", error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message); 
            } else {
                alert("Failed to add student. Please try again.");
            }
        }
    }

    
    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setOpenModal(true);
    };

    
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedStudent(null);
    };

    
    const handleUpdateStudent = async () => {
        if (!selectedStudent) return;

        const updatedStudent = {
            id: idRef.current?.value || selectedStudent.id,
            firstName: firstRef.current?.value || selectedStudent.firstName,
            lastName: lastRef.current?.value || selectedStudent.lastName,
            middleName: middleRef.current?.value || selectedStudent.middleName,
            course: courseRef.current?.value || selectedStudent.course,
            year: yearRef.current?.value || selectedStudent.year,
        };

        try {
            await axios.put(`http://localhost:1337/updatestudent/${selectedStudent.id}`, updatedStudent);
            console.log("Updated student:", updatedStudent);
            fetchStudents(); 
            handleCloseModal(); 
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student. Please try again.");
        }
    };

    
    const handleDeleteStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:1337/deletestudent/${id}`);
            console.log("Deleted student with ID:", id);
            fetchStudents(); // Refresh the student list
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student. Please try again.");
        }
    };

    
    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    };

    
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="Buttons">
                <Typography variant="h2">MANAGE STUDENT</Typography>
                <hr />
                
                <Button onClick={handleOpenAddModal} variant="contained" color="primary" id="addnew"> <AddCircleIcon/> Add Student</Button>
                
                
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
                        <Button onClick={handleCloseAddModal} className='cancel-button'>Cancel</Button>
                        <Button onClick={handleClick} className='add-button' >Add Student</Button>
                    </DialogActions>
                </Dialog>

                
                <div className="view">
                    {students.map((student, index) => (
                        <Card key={index}>
                            <CardContent>
                                <h3>Student ID: {student.id}</h3>
                                <p>Last Name: {student.lastName}</p>
                                <p>First Name: {student.firstName}</p>
                                <p>Middle Name: {student.middleName}</p>
                                <p>Course: {student.course}</p>
                                <p>Year: {student.year}</p>
                                <Button onClick={() => handleOpenModal(student)} color="primary">Edit</Button>
                                <Button onClick={() => handleDeleteStudent(student.id)} color="error">Delete</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <>
                            <TextField 
                            label="ID Number" 
                            variant="outlined" 
                            fullWidth margin="normal" 
                            defaultValue={selectedStudent.id}
                            inputRef={idRef} disabled />
                            <TextField label="First Name" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.firstName} inputRef={firstRef} />
                            <TextField label="Last Name" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.lastName} inputRef={lastRef} />
                            <TextField label="Middle Name" variant="outlined" fullWidth margin="normal" defaultValue={selectedStudent.middleName} inputRef={middleRef} />
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
