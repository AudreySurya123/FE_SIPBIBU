import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { Table } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Ibu = () => {
    const [id, setId] = useState("");
    const [nama, setNama] = useState("");
    const [no_telp, setNoTelp] = useState("");
    const [alamat, setAlamat] = useState("");
    const [usia, setUsia] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();

    const [dataIbu, setDataIbu] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/data-ibu/");
            setDataIbu(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const putData = await axios.put(
                `http://localhost:8080/update/data-ibu/${id}`,
                {
                    nama: nama,
                    no_telp: no_telp,
                    alamat: alamat,
                    usia: usia,
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

        const ibuExist = dataIbu.find(ibu => ibu.email === email);
        if (ibuExist) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Data dengan email tersebut sudah terdaftar.",
            });
            return; // Keluar dari fungsi handleCreate jika data ibu sudah terdaftar
        }

        if (nama === "" || no_telp === "" || alamat === "" || usia === "" || email === "" || password === "") {
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
                    'http://localhost:8080/data-ibu/',
                    {
                        nama: nama,
                        no_telp: no_telp,
                        alamat: alamat,
                        usia: usia,
                        email: email,
                        password: password,
                    },
                    {
                        headers: headers,
                    }
                );

                // Gunakan fungsi navigate dari useNavigate untuk navigasi
                navigate("/admin/data-ibu");

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
                `http://localhost:8080/delete/data-ibu/${id}`
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
        setNoTelp(data.no_telp);
        setAlamat(data.alamat);
        setUsia(data.usia);
        setEmail(data.email);
        setPassword(data.password);
        setShowUpdateModal(true);
    };

    const handleCloseUpdate = () => {
        setId("");
        setNama("");
        setNoTelp("");
        setAlamat("");
        setUsia("");
        setEmail("");
        setPassword("");
        setShowUpdateModal(false);
    };

    const handleShowCreate = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreate = () => {
        setNama("");
        setNoTelp("");
        setAlamat("");
        setUsia("");
        setEmail("");
        setPassword("");
        setShowCreateModal(false);
    };

    const handleShowDelete = (data) => {
        setId(data.id);
        setNama(data.nama);
        setNoTelp(data.no_telp);
        setAlamat(data.alamat);
        setUsia(data.usia);
        setEmail(data.email);
        setPassword(data.password);
        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setId("");
        setNama("");
        setNoTelp("");
        setAlamat("");
        setUsia("");
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
            title: 'No. Telepon',
            dataIndex: 'no_telp',
            key: 'no_telp',
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat',
            key: 'alamat',
        },
        {
            title: 'Usia',
            dataIndex: 'usia',
            key: 'usia',
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
            <h2 className="page-header">Data Ibu</h2>
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

                        <Form.Group className="mb-3" controlId="formNoTelpCreate">
                            <Form.Label>No. Telpon</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNoTelp(e.target.value)}
                                value={no_telp}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAlamatCreate">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setAlamat(e.target.value)}
                                value={alamat}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUsiaCreate">
                            <Form.Label>Usia</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setUsia(e.target.value)}
                                value={usia}
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

                        <Form.Group className="mb-3" controlId="formNoTelp">
                            <Form.Label>No. Telpon</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNoTelp(e.target.value)}
                                value={no_telp}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAlamat">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setAlamat(e.target.value)}
                                value={alamat}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUsia">
                            <Form.Label>Usia</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setUsia(e.target.value)}
                                value={usia}
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
                                    <p className="col-4 card-text">No. Telpon</p>
                                    <p className="col-6 card-text">: {no_telp}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Alamat</p>
                                    <p className="col-6 card-text">: {alamat}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Usia</p>
                                    <p className="col-6 card-text">: {usia}</p>
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
                    <Table dataSource={dataIbu} columns={columns} />
                </div>
            </div>
        </div>
    );
}

export default Ibu;