import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { Table } from "antd";
import Swal from "sweetalert2";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Psikolog = () => {
    const [id, setId] = useState("");
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [no_telepon, setNoTelp] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kelamin, setKelamin] = useState("");
    const [sertifikat, setSertifikat] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dataPsikolog, setDataPsikolog] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/data-psikolog");
            setDataPsikolog(response.data.data_psikolog);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nama', nama);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('no_telepon', no_telepon);
            formData.append('alamat', alamat);
            formData.append('kelamin', kelamin);
            formData.append('sertifikat', sertifikat);

            const putData = await axios.post(
                `http://localhost:8080/update/data-psikolog/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: putData.data.message,
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

        if (nama === "" || email === "" || password === "" || no_telepon === "" || alamat === "" || kelamin === "" || !sertifikat) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Data Gagal ditambahkan, field tidak boleh ada yang kosong",
            });
        } else {
            try {
                const formData = new FormData();
                formData.append('nama', nama);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('no_telepon', no_telepon);
                formData.append('alamat', alamat);
                formData.append('kelamin', kelamin);
                formData.append('sertifikat', sertifikat);

                await axios.post(
                    'http://localhost:8080/data-psikolog',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "Data berhasil ditambahkan",
                });

                handleCloseCreate();
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
                `http://localhost:8080/delete/data-psikolog/${id}`
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: deleteData.data.message,
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
        setNoTelp(data.no_telepon);
        setAlamat(data.alamat);
        setKelamin(data.kelamin);
        setShowUpdateModal(true);
    };

    const handleCloseUpdate = () => {
        setId("");
        setNama("");
        setEmail("");
        setPassword("");
        setNoTelp("");
        setAlamat("");
        setKelamin("");
        setShowUpdateModal(false);
    };

    const handleShowCreate = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreate = () => {
        setNama("");
        setEmail("");
        setPassword("");
        setNoTelp("");
        setAlamat("");
        setKelamin("");
        setSertifikat(null);
        setShowCreateModal(false);
    };

    const handleShowDelete = (data) => {
        setId(data.id);
        setNama(data.nama);
        setEmail(data.email);
        setPassword(data.password);
        setNoTelp(data.no_telepon);
        setAlamat(data.alamat);
        setKelamin(data.kelamin);

        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setId("");
        setNama("");
        setEmail("");
        setPassword("");
        setNoTelp("");
        setAlamat("");
        setShowDeleteModal(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Mengurutkan dataPsikolog dari yang terkecil ke terbesar berdasarkan ID
    const sortedDataPsikolog = [...dataPsikolog].sort((a, b) => a.id - b.id);

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'ascend', // Menambah properti defaultSortOrder untuk mengurutkan dari terkecil ke terbesar
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
            title: 'No. Telepon',
            dataIndex: 'no_telepon',
            key: 'no_telepon',
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat',
            key: 'alamat',
        },
        {
            title: 'Kelamin',
            dataIndex: 'kelamin',
            key: 'kelamin',
        },
        {
            title: 'Sertifikat',
            dataIndex: 'sertifikat',
            key: 'sertifikat',
            render: (sertifikat) => ( // Render sertifikat as an image
                <img
                    src={'http://localhost:8080/uploads/' + sertifikat}
                    alt="Sertifikat"
                    style={{ width: "100px", height: "auto" }}
                />
            )
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
    ]; const handleSertifikatChange = (e) => {
        setSertifikat(e.target.files[0]);
    };

    return (
        <div>
            <h2 className="page-header">Data Psikolog</h2>
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
                            <Form.Control
                                type="password"
                                autoFocus
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNoTelpCreate">
                            <Form.Label>No. Telepon</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNoTelp(e.target.value)}
                                value={no_telepon}
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

                        <Form.Group className="mb-3" controlId="formKelaminCreate">
                            <Form.Label>Kelamin</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setKelamin(e.target.value)}
                                value={kelamin}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSertifikatCreate" className="mb-3">
                            <Form.Label>Sertifikat</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleSertifikatChange}
                            />
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
                    <Modal.Title>Form Ubah Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3" controlId="formNamaUpdate">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNama(e.target.value)}
                                value={nama}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmailUpdate">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPasswordUpdate">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                autoFocus
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNoTelpUpdate">
                            <Form.Label>No. Telepon</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setNoTelp(e.target.value)}
                                value={no_telepon}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAlamatUpdate">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setAlamat(e.target.value)}
                                value={alamat}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formKelaminUpdate">
                            <Form.Label>Kelamin</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setKelamin(e.target.value)}
                                value={kelamin}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSertifikatUpdate" className="mb-3">
                            <Form.Label>Sertifikat</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleSertifikatChange}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            color="primary"
                            className="px-4"
                            style={{ float: "right" }}
                        >
                            Update
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCloseUpdate}
                            style={{
                                float: "right",
                                marginRight: "8px"
                            }}
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
                                <div className="row">
                                    <p className="col-4 card-text">No. Telpon</p>
                                    <p className="col-6 card-text">: {no_telepon}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Alamat</p>
                                    <p className="col-6 card-text">: {alamat}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Kelamin</p>
                                    <p className="col-6 card-text">: {kelamin}</p>
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


            <Table
                columns={columns}
                dataSource={
                    sortedDataPsikolog}
                pagination={{ pageSize: 5 }}
                className="table"
            />
        </div>
    );
};

export default Psikolog;
