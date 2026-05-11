import React, { useState, useEffect, useContext } from 'react';
import { Table, Typography, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, notification, Image, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from '../util/axios.customize';
import { createProductApi, updateProductApi, deleteProductApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';

const { Title } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const { auth } = useContext(AuthContext);

  const loadProducts = async () => {
    if (auth.isAuthenticated) {
      const res = await axios.get("/api/products");
      if (res && !res.message) setProducts(res);
    }
  };

  useEffect(() => { loadProducts(); }, [auth.isAuthenticated]);

  const handleSubmit = async (values) => {
    // TẠO FORMDATA ĐỂ GỬI FILE
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('description', values.description || "");

    if (values.image && values.image.fileList && values.image.fileList[0]) {
        formData.append('image', values.image.fileList[0].originFileObj);
    }

    let res;
    if (editingProduct) {
      res = await updateProductApi(editingProduct._id, formData);
    } else {
      res = await createProductApi(formData);
    }

    if (res && !res.message) {
      notification.success({ message: editingProduct ? 'Cập nhật thành công' : 'Thêm mới thành công' });
      setIsModalOpen(false);
      form.resetFields();
      loadProducts();
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text) => (
        <Image
          src={`http://localhost:8080/${text}`} 
          fallback="https://via.placeholder.com/100?text=No+Image"
          width={80}
        />
      ),
    },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (v) => `${v?.toLocaleString()}đ` },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingProduct(record);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }} />
          <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    const res = await deleteProductApi(id);
    if (res && !res.message) {
      notification.success({ message: 'Đã xóa' });
      loadProducts();
    }
  };

  if (!auth.isAuthenticated) return <div style={{ padding: 50 }}>Hãy đăng nhập!</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={2}>Sản phẩm của tôi</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingProduct(null);
          form.resetFields();
          setIsModalOpen(true);
        }}>Thêm mới</Button>
      </div>

      <Table dataSource={products} columns={columns} rowKey="_id" bordered />

      <Modal 
        title={editingProduct ? "Sửa" : "Thêm mới"} 
        open={isModalOpen} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          
          {/* TRƯỜNG UPLOAD FILE THAY CHO LINK URL */}
          <Form.Item name="image" label="Ảnh sản phẩm">
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Chọn từ thiết bị</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item name="description" label="Mô tả"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HomePage;