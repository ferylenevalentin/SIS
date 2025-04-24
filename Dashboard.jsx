import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css';
import { TextField, Button } from '@mui/material';

function Dashboard() {
    const [car, setCar] = useState({
        brand: "Ford",
        model: "Mustang",
        year: "1964",
        color: "red",
    });
    const brandRef = useRef();
    const modelRef = useRef();
    const yearRef = useRef();
    const colorRef = useRef();

    function handleClick() {
        setCar({
            brand: brandRef.current.value,
            model: modelRef.current.value,
            year: yearRef.current.value,
            color: colorRef.current.value,
        })

        brandRef.current.value= "";
        modelRef.current.value= "";
        yearRef.current.value= "";
        colorRef.current.value= "";
    }

    return (
        <div>
            <div className='sidebar-container'>
                <Sidebar />
            </div>
            <div className="content">
                <h1>Welcome to Saint Mary's University</h1>

                <div className="car-info">
                    <h2>My car is {car.brand}</h2>
                    <p>It is a {car.color} {car.model} from {car.year}.</p>
                </div>

                
                <div className="form-container">
                    <TextField inputRef={brandRef} label="Brand" fullWidth />
                    <br />
                    <TextField inputRef={modelRef} label="Model" fullWidth />
                    <br />
                    <TextField inputRef={yearRef} label="Year" fullWidth />
                    <br />
                    <TextField inputRef={colorRef} label="Color" fullWidth />
                    <br />
                    <br />
                    <Button onClick={handleClick} variant="contained">Change Car</Button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
