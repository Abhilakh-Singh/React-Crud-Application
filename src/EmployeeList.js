import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Box, TextField, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export default function EmployeeList() {
  const [name, nameChange] = useState("");
  const [designation, designationChange] = useState("");
  const [address, addressChange] = useState("");
  const [mobile, mobileChange] = useState("");


  const [empData, empDataChange] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  
    const postEmployee=(e) => {
      e.preventDefault();
      const empData = {name,designation,address,mobile}
      fetch("http://localhost:3000/users",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(empData)
      }).then((res)=>{
        refreshEmployeeList();
        handleClose();
      })
    }

    
  const updateEmployee=(selectedId)=>{
    const empData = {name,designation,address,mobile}
    
      fetch(`http://localhost:3000/users/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empData),
      })
        .then(() => {
          refreshEmployeeList();
          handleClose();
        })
        .catch((err) => console.log(err.message));
      }
   
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
        updateEmployee(selectedId);
    } else {
        postEmployee(e);
    }
};

  useEffect(() => {
    fetch("http://localhost:3000/users").then((res) => {
      return res.json();
    }).then((resp) => {
      empDataChange(resp);
    }).catch((err) => {
      console.log(err.message)
    })
  }, []);


  const handleClickOpen = () => {
    setEditMode(false); 
    setSelectedId(null);
    setOpen(true);
  };



  const handleEditClick = (id) => {
    const selectedEmployee = empData.find((emp) => emp.id === id);
    if (selectedEmployee) {
      nameChange(selectedEmployee.name);
      designationChange(selectedEmployee.designation);
      addressChange(selectedEmployee.address);
      mobileChange(selectedEmployee.mobile);
      setSelectedId(id);
      setEditMode(true);
      setOpen(true);
    }
  };


  const removeEmployee = (selectedId) =>{
    if(window.confirm ("Do you want delete?")){
      fetch(`http://localhost:3000/users/${selectedId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empData),
      })
        .then(() => {
          refreshEmployeeList();
          handleClose();
        })
        .catch((err) => console.log(err.message));
    }
  }

  const refreshEmployeeList = () => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((resp) => empDataChange(resp))
      .catch((err) => console.log(err.message));
  };
  

  const handleClose = () => {
    setOpen(false);
    clearForm();
  };

  const clearForm = ()=>{
    nameChange("");
    designationChange("");
    addressChange("");
    mobileChange("");
  }
  
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add Employee
        </DialogTitle>
        <DialogContent>
          <form className="flex justify-center m-4" >
            <Grid container spacing={2} justifyContent="center">

              <Grid item xs={12} sm={6}>
                <TextField fullWidth value={name} onChange={e=>nameChange((e.target.value))} label="Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth value={designation}  onChange={e=>designationChange((e.target.value))} label="Designation" variant="outlined" />
              </Grid>


              <Grid item xs={12} sm={6}>
                <TextField fullWidth value={address} label="Address"  onChange={e=>addressChange((e.target.value))} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth value={mobile}  onChange={e=>mobileChange((e.target.value))} label="Mobile" variant="outlined" />
              </Grid>
            </Grid>
          </form>

        </DialogContent >
        <DialogActions  className="!flex !justify-evenly mb-4">
        <Button variant="contained" onClick={handleSubmit}>{editMode ? "Update" : "Save"}</Button>
        <Button variant="contained" onClick={handleClose} color="warning"> Cancel</Button>
        </DialogActions>
      </BootstrapDialog>


      <Box className="p-4">
        <Box className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Employee List</h2>
          <Button variant="contained" color="primary" className="ml-auto" onClick={handleClickOpen}>
            Create Employee
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell  align='center' className="bg-blue-500 !text-white ">Id</TableCell>
                <TableCell  align='center' className="bg-blue-500 !text-white ">Name</TableCell>
                <TableCell  align='center' className="bg-blue-500 !text-white ">Designation</TableCell>
                <TableCell  align='center' className="bg-blue-500 !text-white ">Address</TableCell>
                <TableCell  align='center' className="bg-blue-500 !text-white ">Mobile</TableCell>
                <TableCell  align='center' className="bg-blue-500 !text-white ">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empData && empData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align='center'>{row.id}</TableCell>
                  <TableCell align='center'>{row.name}</TableCell>
                  <TableCell align='center'>{row.designation}</TableCell>
                  <TableCell align='center'>{row.address}</TableCell>
                  <TableCell align='center'>{row.mobile}</TableCell>
                  <TableCell align='center'>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                      <Button onClick={() => handleEditClick(row.id)}>Edit</Button>
                      <Button color="warning" onClick={()=> removeEmployee(row.id)}>Delete</Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
}
