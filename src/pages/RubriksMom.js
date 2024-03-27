import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { Table } from "antd";
import Swal from "sweetalert2";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Artikel = () => {
    const [id, setId] = useState("");
    const [kategori, setKategori] = useState("");
    const [judul, setJudul] = useState("");
    const [isi, setIsi] = useState("");
    const [cover, setCover] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dataArtikel, setDataArtikel] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/artikel");
            setDataArtikel(response.data.data_artikel);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('kategori', kategori);
            formData.append('judul', judul);
            formData.append('isi', isi);
            formData.append('cover', cover);

            const putData = await axios.post(
                `http://localhost:8080/update/artikel/${id}`,
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

        if (kategori === "" || judul === "" || isi === "" || !cover) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Data Gagal ditambahkan, field tidak boleh ada yang kosong",
            });
        } else {
            try {
                const formData = new FormData();
                formData.append('kategori', kategori);
                formData.append('judul', judul);
                formData.append('isi', isi);
                formData.append('cover', cover);

                await axios.post(
                    'http://localhost:8080/artikel',
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
                `http://localhost:8080/delete/artikel/${id}`
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
        setKategori(data.kategori);
        setJudul(data.judul);
        setIsi(data.isi);
        setShowUpdateModal(true);
    };

    const handleCloseUpdate = () => {
        setId("");
        setKategori("");
        setJudul("");
        setIsi("");
        setShowUpdateModal(false);
    };

    const handleShowCreate = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreate = () => {
        setKategori("");
        setJudul("");
        setIsi("");
        setCover(null);
        setShowCreateModal(false);
    };

    const handleShowDelete = (data) => {
        setId(data.id);
        setKategori(data.kategori);
        setJudul(data.judul);
        setIsi(data.isi);

        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setId("");
        setKategori("");
        setJudul("");
        setIsi("");
        setShowDeleteModal(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Mengurutkan dataPsikolog dari yang terkecil ke terbesar berdasarkan ID
    const sortedDataArtikel = [...dataArtikel].sort((a, b) => a.id - b.id);

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'ascend', // Menambah properti defaultSortOrder untuk mengurutkan dari terkecil ke terbesar
        },
        {
            title: 'Kategori',
            dataIndex: 'kategori',
            key: 'kategori',
        },
        {
            title: 'Judul',
            dataIndex: 'judul',
            key: 'judul',
        },
        {
            title: 'Isi',
            dataIndex: 'isi',
            key: 'isi',
        },
        {
            title: 'Cover',
            dataIndex: 'cover',
            key: 'cover',
            render: (cover) => (
                <img
                    src={'http://localhost:8080/uploads/' + cover}
                    alt="Cover"
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
    ]; const handleCoverChange = (e) => {
        setCover(e.target.files[0]);
    };

    return (
        <div>
            <h2 className="page-header">Artikel</h2>
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
                        <Form.Group className="mb-3" controlId="formKategoriCreate">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setKategori(e.target.value)}
                                value={kategori}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formJudulCreate">
                            <Form.Label>Judul</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setJudul(e.target.value)}
                                value={judul}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formIsiCreate">
                            <Form.Label>Isi</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setIsi(e.target.value)}
                                value={isi}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCoverCreate" className="mb-3">
                            <Form.Label>Cover</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
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
                        <Form.Group className="mb-3" controlId="formKategoriUpdate">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setKategori(e.target.value)}
                                value={kategori}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formJudulUpdate">
                            <Form.Label>Judul</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setJudul(e.target.value)}
                                value={judul}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formIsiUpdate">
                            <Form.Label>Isi</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => setIsi(e.target.value)}
                                value={isi}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCoverUpdate" className="mb-3">
                            <Form.Label>Cover</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
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
                                    <p className="col-4 card-text">Kategori</p>
                                    <p className="col-6 card-text">: {kategori}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Judul</p>
                                    <p className="col-6 card-text">: {judul}</p>
                                </div>
                                <div className="row">
                                    <p className="col-4 card-text">Isi</p>
                                    <p className="col-6 card-text">: {isi}</p>
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


            {dataArtikel.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={sortedDataArtikel}
                    pagination={{ pageSize: 5 }}
                    className="table"
                />
            ) : (
                <p>Tidak ada data artikel yang tersedia.</p>
            )}
        </div>
    );
};

export default Artikel;
