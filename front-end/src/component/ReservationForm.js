import React, { useState, useEffect , useContext, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined, FilePdfOutlined, FileExcelOutlined  } from '@ant-design/icons';
import moment from 'moment';
import Cookies from 'js-cookie';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import './styles.css'; // Assurez-vous que le chemin est correct pour vos styles
import UserContext from './UserContext';
import Highlighter from 'react-highlight-words';
import logo from './images/logo.png'

const ReservationsForm = () => {
  const { user } = useContext(UserContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  // let searchInput = null;
  const searchInput = useRef(null);


  const [form] = Form.useForm();
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchReservations = async () => {
      let userId = user._id;
      setLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token is not available');
        }
        // const userResponse = await axios.get(`http://localhost:7000/api/user/profile/${userId}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        //   withCredentials: true,
        // });
        
        // const user = userResponse.data;
        
        let reservationsResponse;
        if (user.role === 'admin') {
          reservationsResponse = await axios.get('http://localhost:7000/api/reservation', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        } else {
          reservationsResponse = await axios.get(`http://localhost:7000/api/reservation/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        }

        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        message.error('Failed to fetch reservations!');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token, user._id]);

  const handleDelete = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:7000/api/reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReservations(reservations.filter((r) => r._id !== reservationId));
      message.success('Reservation deleted successfully!');
    } catch (error) {
      message.error('Failed to delete reservation!');
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...reservation,
      checkInDate: moment(reservation.checkInDate),
      checkOutDate: moment(reservation.checkOutDate),
    });
  };

  const handleModalOk = async (values) => {
    const updatedReservation = {
      ...editingReservation,
      ...values,
      checkInDate: values.checkInDate.toISOString(),
      checkOutDate: values.checkOutDate.toISOString(),
    };

    try {
      const response = await axios.put(`http://localhost:7000/api/reservation/${editingReservation._id}`, updatedReservation, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReservations(reservations.map((r) => (r._id === editingReservation._id ? response.data : r)));
      message.success('Reservation updated successfully!');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update reservation!');
    }
  };

  const handleDateChange = () => {
    const values = form.getFieldsValue();
    const checkInDate = values.checkInDate ? moment(values.checkInDate) : null;
    const checkOutDate = values.checkOutDate ? moment(values.checkOutDate) : null;

    if (checkInDate && checkOutDate) {
      const numberOfDays = checkOutDate.diff(checkInDate, 'days');
      const roomPrice = editingReservation?.room?.price || 0;
      const totalAmount = numberOfDays * roomPrice;
      form.setFieldsValue({ totalAmount });
    } else {
      form.setFieldsValue({ totalAmount: 0 });
    }
  };

  const generateInvoice = (reservation) => {
    const invoiceContent = `
    <div style="width: 80%; margin: 0 auto; font-family: Georgia, serif; border: 1px solid #ddd; padding: 20px; background-color: #f9f9f9;">
      <!-- Logo placé en haut à gauche -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <!-- Remplacez l'URL ici par celle de votre logo -->
        <img src= ${logo} alt="Hotel Logo" style="max-width: 100px;" />
        <div style="text-align: right;">
          <h1 style="color: #007BFF; font-size: 36px; text-transform: uppercase; letter-spacing: 2px;">Facture d'Hôtel</h1>
          <p style="font-size: 18px; color: #555;">Merci pour votre réservation</p>
        </div>
      </div>
      <div style="border-top: 3px solid #007BFF; margin-top: 20px; padding-top: 20px;">
        <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Détails de la Réservation</h2>
        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">ID Réservation:</td>
            <td style="padding: 10px; text-align: right; color: #333;">${reservation._id.toUpperCase()}</td>
          </tr>
          <tr style="background-color: #f1f1f1;">
            <td style="padding: 10px; font-weight: bold; color: #555;">ID Chambre:</td>
            <td style="padding: 10px; text-align: right; color: #333;">${reservation.room._id.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Numéro de Chambre:</td>
            <td style="padding: 10px; text-align: right; color: #333;">${reservation.room.number.toUpperCase()}</td>
          </tr>
          <tr style="background-color: #f1f1f1;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Prix de la Chambre:</td>
            <td style="padding: 10px; text-align: right; color: #333;">${reservation.room.price} Dhs / nuit</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Date d'Arrivée:</td>
            <td style="padding: 10px; text-align: right; color: #333;">${moment(reservation.checkInDate).format('YYYY-MM-DD')}</td>
          </tr>
          <tr style="background-color: #f1f1f1;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Date de Départ:</td>
            <td style="padding: 10px; text-align: right; color: #333;">${moment(reservation.checkOutDate).format('YYYY-MM-DD')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Montant Total:</td>
            <td style="padding: 10px; text-align: right; color: #333; font-size: 18px;">${reservation.totalAmount} Dhs</td>
          </tr>
        </table>
      </div>
      <div style="border-top: 3px solid #007BFF; margin-top: 30px; padding-top: 20px;">
        <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Informations de Contact</h2>
        <p style="font-size: 16px; color: #555;">Pour toute question ou modification concernant votre réservation, veuillez nous contacter :</p>
        <p style="font-size: 16px; color: #333;">Téléphone : +212 502020280</p>
        <p style="font-size: 16px; color: #333;">Email : support@RoyaleHotel.com</p>
      </div>
    </div>
  `;
  
  
  

    const options = {
      margin: 10,
      filename: `facture-${reservation._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(invoiceContent).set(options).save();
  };
  const generateExcel = () => {
    const dataToExport = reservations.map(reservation => ({
      ID: reservation._id,
      'ID Chambre': reservation.room._id,
      'Numéro de Chambre': reservation.room.number,
      'Prix de la Chambre': `${reservation.room.price} USD / nuit`,
      'Date d\'Arrivée': reservation.checkInDate,
      'Date de Départ': reservation.checkOutDate,
      'Montant Total': `${reservation.totalAmount} USD`,
    }));
  
    // Créez une feuille de calcul
    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: [
        'ID',
        'ID Chambre',
        'Numéro de Chambre',
        'Prix de la Chambre',
        'Date d\'Arrivée',
        'Date de Départ',
        'Montant Total',
      ],
    });
  
    // Style des cellules de l'en-tête
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14, name: 'Calibri' },
      fill: { fgColor: { rgb: '2F4F4F' } }, // Fond gris foncé élégant
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thick', color: { rgb: '8B4513' } },
        bottom: { style: 'thick', color: { rgb: '8B4513' } },
        left: { style: 'thick', color: { rgb: '8B4513' } },
        right: { style: 'thick', color: { rgb: '8B4513' } },
      },
    };
  
    // Style des cellules du corps
    const bodyStyle = {
      font: { color: { rgb: '000000' }, sz: 12, name: 'Arial' },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: 'D3D3D3' } },
        bottom: { style: 'thin', color: { rgb: 'D3D3D3' } },
        left: { style: 'thin', color: { rgb: 'D3D3D3' } },
        right: { style: 'thin', color: { rgb: 'D3D3D3' } },
      },
      fill: { fgColor: { rgb: 'F0F8FF' } }, // Fond bleu pâle pour un contraste subtil
    };
  
    // Largeur des colonnes ajustée
    ws['!cols'] = [
      { wch: 15 }, // ID
      { wch: 20 }, // ID Chambre
      { wch: 22 }, // Numéro de Chambre
      { wch: 25 }, // Prix de la Chambre
      { wch: 22 }, // Date d'Arrivée
      { wch: 22 }, // Date de Départ
      { wch: 25 }, // Montant Total
    ];
  
    // Appliquez le style à toutes les cellules
    Object.keys(ws).forEach(key => {
      if (key[0] === '!') return; // Ignore les propriétés non pertinentes
  
      const cell = ws[key];
      const rowIndex = parseInt(key.match(/\d+/), 10);
      if (rowIndex === 1) {
        cell.s = headerStyle; // Style pour l'en-tête
      } else {
        cell.s = bodyStyle; // Style pour le corps
      }
    });
  
    // Créez un classeur et ajoutez la feuille
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Réservations');
  
    // Générez un fichier Excel et déclenchez le téléchargement
    XLSX.writeFile(wb, 'reservations.xlsx');
  };
  
  
  
  const handleSearch = async (selectedKeys, confirm, dataIndex) => {
    confirm();
    let querySearch = `${selectedKeys[0]}`;
    console.log('====================================');
    console.log(querySearch);
    console.log('====================================');
    setSearchedColumn(dataIndex);
    let userId = user._id;

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token is not available');
      }

      let reservationsResponse;
      if (user.role === 'admin') {
        reservationsResponse = await axios.get(`http://localhost:7000/api/reservation?idReservation=${querySearch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      } else {
        reservationsResponse = await axios.get(`http://localhost:7000/api/reservation/user/${userId}?idReservation=${querySearch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }

      setReservations(reservationsResponse.data);

    } catch (error) {
      console.error('Error fetching reservations:', error);
      message.error('Failed to fetch reservations!');
    }
  };

  const handleReset = async (clearFilters) => {
    clearFilters();
    setSearchText('');
    const userId = user._id
    let reservationsResponse;
       try {
         if (user.role === 'admin') {
          reservationsResponse = await axios.get('http://localhost:7000/api/reservation', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        } else {
          reservationsResponse = await axios.get(`http://localhost:7000/api/reservation/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        }

        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        message.error('Failed to fetch reservations!');
      }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
       <Input
  ref={searchInput}
  placeholder={`Search ${dataIndex}`}
  value={selectedKeys[0]}
  onChange={e => {
    const value = e.target.value;
    setSelectedKeys(value ? [value] : []);
    setSearchText(value);
  }}
  onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  style={{ width: 188, marginBottom: 8, display: 'block' }}
/>

        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              if (searchInput.current) {
                searchInput.current.select();
              }
            }, 100);
          }
        },
        
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      ...getColumnSearchProps('_id'),
      render: (text) => text.toUpperCase(),
    },
    {
      title: 'Numéro de Chambre',
      dataIndex: ['room', 'number'],
      key: 'room.number',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Prix',
      dataIndex: ['room', 'price'],
      key: 'room.price',
      render: (text) => text ? `${text} Dhs` : 'N/A',
    },
    {
      title: 'Date d\'Arrivée',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A',
    },
    {
      title: 'Date de Départ',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A',
    },
    {
      title: 'Montant Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
<div>
  {user && user.role === 'admin' && (
    <>
      <Button
        icon={<EditOutlined />}
        onClick={() => handleEdit(record)}
        style={{ marginRight: 8 }}
      />
      <Button
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(record._id)}
        style={{ marginRight: 8 }}
      />
    </>
  )}
  <Button
    icon={<FilePdfOutlined />}
    onClick={() => generateInvoice(record)}
  />
</div>

      ),
    },
  ];

  return (
    <div>
      <h2>Gestion des Réservations</h2>
      {user.role === 'admin' && (
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />} 
          onClick={generateExcel} 
          style={{ marginBottom: 16 , width:220, display: 'flex', justifyContent: 'center', marginBottom: 16, marginLeft:1290  }}
        >
          Exporter en Excel
        </Button>
      )}
    <div className="reservations-form">
      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Edit Reservation"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
        >
          <Form.Item
            name="room"
            label="Room ID"
            rules={[{ required: true, message: 'Please input room ID!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="checkInDate"
            label="Check In Date"
            rules={[{ required: true, message: 'Please select check-in date!' }]}
          >
            <DatePicker onChange={handleDateChange} />
          </Form.Item>
          <Form.Item
            name="checkOutDate"
            label="Check Out Date"
            rules={[{ required: true, message: 'Please select check-out date!' }]}
          >
            <DatePicker onChange={handleDateChange} />
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="Total Amount"
            rules={[{ required: true, message: 'Please input total amount!' }]}
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </div>
  );
};

export default ReservationsForm;