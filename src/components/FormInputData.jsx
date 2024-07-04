import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const FormInputData = () => {
    const [form, setForm] = useState({
        Type: '',
        JIRA: '',
        Email: '',
        Department: '',
        model: '',
        SerialNumber: '',
        StartingDateAndReturn: '',
        Status: ''
    });
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Inventory"));
            const newData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(newData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };
    /// Add ///
    const handleAddData = async (formData) => {
        try {

            const docRef = await addDoc(collection(db, 'Inventory'), formData);
            Swal.fire('Success', 'Data added successfully', 'success');
            setData(prevData => [{ id: docRef.id, ...formData }, ...prevData]);
            setEditId(null);
            clearForm();
        } catch (err) {
            Swal.fire('Error', 'Something went wrong', 'error');
            console.error(err);
        }
    };

    const handleAddDataPopup = () => {
        Swal.fire({
            title: 'เพิ่มข้อมูล',
            html: `
                <select style="width:260px" id="Type" class="swal2-input" value="">
                    <option value="" disabled selected>-- Select Type --</option>
                    <option value="พนักงานใหม่">พนักงานใหม่</option>
                    <option value="คืนเครื่อง">คืนเครื่อง</option>
                    <option value="ยืมเครื่อง">ยืมเครื่อง</option>
                </select>
                <input type="text" id="JIRA" class="swal2-input" placeholder="JIRA" value="">
                <input type="email" id="Email" class="swal2-input" placeholder="Email" value="">
                <input type="text" id="Department" class="swal2-input" placeholder="Department" value="">
                <select style="width:260px" id="model" class="swal2-input" value="">
                    <option value="" disabled selected>-- Select Model --</option>
                    <option value="HP Probook 440 G9">HP Probook 440 G9</option>
                    <option value="HP Zbook Power G9">HP Zbook Power G9</option>
                    <option value="HP Probook 440 G10">HP Probook 440 G10</option>
                    <option value="HP Probook 430 G5">HP Probook 430 G5</option>
                    <option value="Lenovo L490">Lenovo L490</option>
                    <option value="Lenovo L14">Lenovo L14</option>
                    <option value="Lenovo x390">Lenovo x390</option>
                    <option value="Lenovo P53">Lenovo P53</option>
                    <option value="Acer TravelMate P2">Acer TravelMate P2</option>
                    <option value="Surface">Surface</option>
                </select>
                <input type="text" id="SerialNumber" class="swal2-input" placeholder="SerialNumber" value="">
                <input style="width:260px" type="date" id="StartingDateAndReturn" class="swal2-input" value="">
                <select style="width:260px" id="Status" class="swal2-input" value="">
                    <option value="" disabled selected>-- Select Status --</option>
                    <option value="WORK IN PROGRESS">WORK IN PROGRESS</option>
                    <option value="PENDING">PENDING</option>
                    <option value="Completed">Completed</option>
                    <option value="ติดตาม">ติดตาม</option>
                    <option value="คืนแล้ว">คืนแล้ว</option>
                    <option value="ไม่คืน">ไม่คืน</option>
                    <option value="เก็บไว้">เก็บไว้</option>
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const formData = {
                    Type: document.getElementById('Type').value,
                    JIRA: document.getElementById('JIRA').value,
                    Email: document.getElementById('Email').value,
                    Department: document.getElementById('Department').value,
                    model: document.getElementById('model').value,
                    SerialNumber: document.getElementById('SerialNumber').value,
                    StartingDateAndReturn: document.getElementById('StartingDateAndReturn').value,
                    Status: document.getElementById('Status').value,
                };
                handleAddData(formData);
            }
        });
    };


    ///////////////////////////////////// Edit //////////////////////////////////////
    const handleEditData = async (editId, formData) => {
        if (editId) {
            try {

                await updateDoc(doc(db, 'Inventory', editId), formData);
                Swal.fire('Success', 'Data updated successfully', 'success');
                setData(prevData => prevData.map(item => (item.id === editId ? { id: editId, ...formData } : item)));

                setEditId(null);
                clearForm();

            } catch (err) {
                Swal.fire('Error', 'Something went wrong', 'error');
                console.error(err);
            }
        } else {
            Swal.fire('Error', 'Something went wrong', 'error');
            console.error(err);
        }
        //window.location.reload();
    };


    const handleEditDataPopup = async (item) => {
        Swal.fire({
            title: 'แก้ไขข้อมูล',
            html: `
                <select style="width:260px" id="Type" class="swal2-input" value="${item.Type}">
                    <option value="" disabled selected>-- Select Type --</option>
                    <option value="พนักงานใหม่">พนักงานใหม่</option>
                    <option value="คืนเครื่อง">คืนเครื่อง</option>
                    <option value="ยืมเครื่อง">ยืมเครื่อง</option>
                </select>
                <input type="text" id="JIRA" class="swal2-input" placeholder="JIRA" value="${item.JIRA}">
                <input type="email" id="Email" class="swal2-input" placeholder="Email" value="${item.Email}">
                <input type="text" id="Department" class="swal2-input" placeholder="Department" value="${item.Department}">
                <select style="width:260px" id="model" class="swal2-input" value="${item.model}">
                    <option value="" disabled selected>-- Select Model --</option>
                    <option value="HP Probook 440 G9">HP Probook 440 G9</option>
                    <option value="HP Zbook Power G9">HP Zbook Power G9</option>
                    <option value="HP Probook 440 G10">HP Probook 440 G10</option>
                    <option value="HP Probook 430 G5">HP Probook 430 G5</option>
                    <option value="Lenovo L490">Lenovo L490</option>
                    <option value="Lenovo L14">Lenovo L14</option>
                    <option value="Lenovo x390">Lenovo x390</option>
                    <option value="Lenovo P53">Lenovo P53</option>
                    <option value="Acer TravelMate P2">Acer TravelMate P2</option>
                    <option value="Surface">Surface</option>
                </select>
                <input type="text" id="SerialNumber" class="swal2-input" placeholder="SerialNumber" value="${item.SerialNumber}">
                <input style="width:260px" type="date" id="StartingDateAndReturn" class="swal2-input" value="${item.StartingDateAndReturn}">
                <select style="width:260px" id="Status" class="swal2-input" value="${item.Status}">
                    <option value="" disabled selected>-- Select Status --</option>
                    <option value="WORK IN PROGRESS">WORK IN PROGRESS</option>
                    <option value="PENDING">PENDING</option>
                    <option value="Completed">Completed</option>
                    <option value="ติดตาม">ติดตาม</option>
                    <option value="คืนแล้ว">คืนแล้ว</option>
                    <option value="ไม่คืน">ไม่คืน</option>
                    <option value="เก็บไว้">เก็บไว้</option>
                </select>
            `,
            focusConfirm: false,
            didOpen: () => {
                // Dynamically set the selected option for each select element
                document.getElementById('Type').value = item.Type;
                document.getElementById('model').value = item.model;
                document.getElementById('Status').value = item.Status;
            },
            preConfirm: () => {
                const formData = {
                    Type: document.getElementById('Type').value,
                    JIRA: document.getElementById('JIRA').value,
                    Email: document.getElementById('Email').value,
                    Department: document.getElementById('Department').value,
                    model: document.getElementById('model').value,
                    SerialNumber: document.getElementById('SerialNumber').value,
                    StartingDateAndReturn: document.getElementById('StartingDateAndReturn').value,
                    Status: document.getElementById('Status').value,
                };
                handleEditData(item.id, formData);

            }
        });
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setForm({
            Type: item.Type,
            JIRA: item.JIRA,
            Email: item.Email,
            Department: item.Department,
            model: item.model,
            SerialNumber: item.SerialNumber,
            StartingDateAndReturn: item.StartingDateAndReturn,
            Status: item.Status
        });
        handleEditDataPopup(item);
    };


    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(db, 'Inventory', id));
                    setData(prevData => prevData.filter(item => item.id !== id));
                    Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                } catch (err) {
                    Swal.fire('Error', 'Something went wrong', 'error');
                    console.error(err);
                }
            }
        });
    };



    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "InventoryData");
        XLSX.writeFile(wb, "InventoryData.xlsx");
    };

    const clearForm = () => {
        setForm({
            Type: '',
            JIRA: '',
            Email: '',
            Department: '',
            model: '',
            SerialNumber: '',
            StartingDateAndReturn: '',
            Status: ''
        });
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            val.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="container mt-5">
            <h1>
            <button type="button" className="btn btn-primary me-2" onClick="#">Home</button>
            </h1>
            <h2 className="text-center mb-4">Inventory Management</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
            />
            <div className="d-flex mb-3">
                <button type="button" className="btn btn-primary me-2" onClick={handleAddDataPopup}>เพิ่มข้อมูล</button>
                <button type="button" className="btn btn-primary me-2" onClick={exportToExcel}>Export to Excel</button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Type</th>
                        <th scope="col">JIRA</th>
                        <th scope="col">Email</th>
                        <th scope="col">Department</th>
                        <th scope="col">Model</th>
                        <th scope="col">Serial Number</th>
                        <th scope="col">วันที่เริ่มงาน/คืนเครื่อง</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.Type}</td>
                            <td>{item.JIRA}</td>
                            <td>{item.Email}</td>
                            <td>{item.Department}</td>
                            <td>{item.model}</td>
                            <td>{item.SerialNumber}</td>
                            <td>{item.StartingDateAndReturn}</td>
                            <td>{item.Status}</td>
                            <td>
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FormInputData;
