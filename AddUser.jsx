import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css';
import './AddUser.css';
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function AddUser() {
    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editUser, setEditUser] = useState({});

    const addIdRef = useRef();
    const addFirstRef = useRef();
    const addLastRef = useRef();
    const addMiddleRef = useRef();
    const addUsernameRef = useRef();
    const addPasswordRef = useRef();
    const addUserTypeRef = useRef();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:1337/fetchusers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users!');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setEditUser({ ...user });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
        setEditUser({});
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;

        try {
            await axios.put(`http://localhost:1337/updateuser/${selectedUser.userId}`, editUser);
            await fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Error updating user!');
        }
    };

    const handleAddUser = async () => {
        const newUser = {
            userId: addIdRef.current.value.trim(),
            firstName: addFirstRef.current.value.trim(),
            lastName: addLastRef.current.value.trim(),
            middleName: addMiddleRef.current.value.trim(),
            username: addUsernameRef.current.value.trim(),
            password: addPasswordRef.current.value.trim(),
            userType: addUserTypeRef.current.value.trim(),
        };

        if (!newUser.userId || !newUser.username) {
            alert("ID and Username are required.");
            return;
        }

        try {
            await axios.post('http://localhost:1337/addusers', newUser);
            await fetchUsers();
            setOpenAddModal(false);
        } catch (error) {
            console.error('Error adding user:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Error adding user!');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:1337/deleteuser/${userId}`);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Error deleting user!');
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="Buttons">
                <Typography variant="h2">MANAGE USERS</Typography>
                <hr />
                <Button onClick={() => setOpenAddModal(true)} variant="contained" color="primary" id="addnew">
                    <AddCircleIcon /> Add User
                </Button>
                {loading && <Typography>Loading users...</Typography>}

                <div className="view">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <Card key={index}>
                                <CardContent>
                                    <h3>User ID: {user.userId}</h3>
                                    <p>Last Name: {user.lastName}</p>
                                    <p>First Name: {user.firstName}</p>
                                    <p>Middle Name: {user.middleName}</p>
                                    <p>Username: {user.username}</p>
                                    <p>Password: {user.password}</p>
                                    <p>User Type: {user.userType}</p>

                                    <Button onClick={() => handleOpenModal(user)} color="primary">Edit</Button>
                                    <Button onClick={() => handleDeleteUser(user.userId)} color="error">Delete</Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No users available</Typography>
                    )}
                </div>
            </div>

            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField inputRef={addIdRef} label="ID Number" variant="outlined" fullWidth margin="normal" required/>
                    <TextField inputRef={addFirstRef} label="First Name" variant="outlined" fullWidth margin="normal" required/>
                    <TextField inputRef={addLastRef} label="Last Name" variant="outlined" fullWidth margin="normal" required/>
                    <TextField inputRef={addMiddleRef} label="Middle Name" variant="outlined" fullWidth margin="normal" required/>
                    <TextField inputRef={addUsernameRef} label="Username" variant="outlined" fullWidth margin="normal" required/>
                    <TextField inputRef={addPasswordRef} label="Password" variant="outlined" fullWidth margin="normal" type="password" required/>
                    <TextField inputRef={addUserTypeRef} label="User Type" variant="outlined" fullWidth margin="normal" required/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddModal(false)} color="primary">Cancel</Button>
                    <Button onClick={handleAddUser} color="primary">Add User</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <TextField label="First Name" variant="outlined" fullWidth margin="normal" value={editUser.firstName || ''} onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })} />
                            <TextField label="Last Name" variant="outlined" fullWidth margin="normal" value={editUser.lastName || ''} onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })} />
                            <TextField label="Middle Name" variant="outlined" fullWidth margin="normal" value={editUser.middleName || ''} onChange={(e) => setEditUser({ ...editUser, middleName: e.target.value })} />
                            <TextField label="Username" variant="outlined" fullWidth margin="normal" value={editUser.username || ''} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
                            <TextField label="Password" variant="outlined" fullWidth margin="normal" value={editUser.password || ''} onChange={(e) => setEditUser({ ...editUser, password: e.target.value })} />
                            <TextField label="User Type" variant="outlined" fullWidth margin="normal" value={editUser.userType || ''} onChange={(e) => setEditUser({ ...editUser, userType: e.target.value })} />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Cancel</Button>
                    <Button onClick={handleUpdateUser} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddUser;