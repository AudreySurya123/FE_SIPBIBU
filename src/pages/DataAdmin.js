import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { Table } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Admin = () => {
    const [id, setId] = useState("");
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();

    const [dataAdmin, setDataAdmin] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/data-admin/");
            setDataAdmin(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const putData = await axios.put(
                `http://localhost:8080/update/data-admin/${id}`,
                {
                    nama: nama,
                    email: email,
                    password: password,
                }
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: putData.data.messages,
            });
            handleCloseUpdate();
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Data Gagal diubah",
            });
        }
    };


    const handleCreate = async (e) => {
        e.preventDefault();

        const adminExist = dataAdmin.find(admin => admin.email === email);
        if (adminExist) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Data dengan email tersebut sudah terdaftar.",
            });
            return; // Keluar dari fungsi handleCreate jika data admin sudah terdaftar
        }

        if (nama === "" || email === "" || password === "") {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Data Gagal ditambahkan, field tidak boleh ada yang kosong",
            });
        } else {
            try {
                const headers = {
                    "Content-Type": "multipart/form-data",
                };

                await axios.post(
                    'http://localhost:8080/data-admin/',
                    {
                        nama: nama,
                        email: email,
                        password: password,
                    },
                    {
                        headers: headers,
                    }
                );

                // Gunakan fungsi navigate dari useNavigate untuk navigasi
                navigate("/admin/data-admin");

                // Tambahkan Swal.fire untuk memberi notifikasi bahwa data berhasil ditambahkan
                Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "Data berhasil ditambahkan",
                });

                // Setelah data tersimpan, auto-close modal create
                handleCloseCreate();

                // Fetch data setelah menutup modal (opsional, tergantung pada kebutuhan)
                fetchData();
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Terjadi kesalahan saat menambahkan data",
                });
            }
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            const deleteData = await axios.delete(
                `http://localhost:8080/delete/data-admin/${id}`
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: deleteData.data.messages,
            });
            handleCloseDelete();
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Data Gagal dihapus",
            });
        }
    };

    const handleShowUpdate = (data) => {
        setId(data.id);
        setNama(data.nama);
        setEmail(data.email);
        setPassword(data.password);
        setShowUpdateModal(true);
    };

    const handleCloseUpdate = () => {
        setId("");
        setNama("");
        setEmail("");
        setPassword("");
        setShowUpdateModal(false);
    };

    const handleShowCreate = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreate = () => {
        setNama("");
        setEmail("");
        setPassword("");
        setShowCreateModal(false);
    };

    const handleShowDelete = (data) => {
        setId(data.id);
        setNama(data.nama);
        setEmail(data.email);
        setPassword(data.password);
        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setId("");
        setNama("");
        setEmail("");
        setPassword("");
        setShowDeleteModal(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nama',
            dataIndex: 'nama',
            key: 'nama',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: "Aksi",
            key: "action",
            render: (text, record) => (
                <span>
                    <Button
                        className="btn btn-warning text-black me-2"
                        onClick={() => handleShowUpdate(record)}
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        className="btn btn-danger text-white"
                        onClick={() => handleShowDelete(record)}
                    >
                        <DeleteOutlined />
                    </Button>
                </span>
            ),
        },
    ];

    const [showPasswordCreate, setShowPasswordCreate] = useState(false);
    const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);


    return (
        <div>
            <h2 className="page-header">Data Admin</h2>
            <Button
                className="btn btn-primary text-white mb-3"
                onClick={handleShowCreate}
            >
                Tambah Data
            </Button>

            {/* Modal CREATE */}
            <Modal show={showCreateModal} onHide={handleCloseCreate} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Form Tambah Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-3" controlId="formNamaCreate">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNama(e.target.value)}
                                value={nama}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmailCreate">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPasswordCreate">
                            <Form.Label>Password</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    type={showPasswordCreate ? "text" : "password"}
                                    autoFocus
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPasswordCreate(!showPasswordCreate)}
                                >
                                    {showPasswordCreate ? "Hide" : "Show"}
                                </Button>
                            </div>
                        </Form.Group>
                        <Button
                            type="submit"
                            color="primary"
                            className="px-4"
                            style={{ float: "right" }}
                        >
                            Tambah
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCloseCreate}
                            style={{ float: "right", marginRight: "8px" }}
                        >
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal EDIT */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdate} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Form Update Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3" controlId="formNama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNama(e.target.value)}
                                value={nama}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    type={showPasswordUpdate ? "text" : "password"}
                                    autoFocus
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
                                >
                                    {showPasswordUpdate ? "Hide" : "Show"}
                                </Button>
                            </div>
                        </Form.Group>

                        <Button type="submit" color="primary" style={{ float: "right" }}>
                            Update
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCloseUpdate}
                            style={{ float: "right", marginRight: "8px" }}
                        >
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal DELETE */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Apakah Anda yakin menghapus data ini?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Detail Data</h5>
                                <div className="row">
                                    <p className="col-4 card-text">Nama</p>
                                    <p className="col-6 card-text">: {nama}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Email</p>
                                    <p className="col-6 card-text">: {email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        color="primary"
                        className="px-4"
                        onClick={handleDelete}
                    >
                        Hapus Data
                    </Button>
                    <Button variant="danger" onClick={handleCloseDelete}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="card">
                <div className="card__body">
                    <Table dataSource={dataAdmin} columns={columns} />
                </div>
            </div>
        </div>
    );
}

export default Admin;