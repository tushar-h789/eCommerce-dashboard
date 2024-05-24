import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Space, Table, Modal, Form, Input, Alert } from "antd";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const ViewStore = () => {
  const [store, setStore] = useState([]);
  const [shouldReloadData, setShouldReloadData] = useState(false);
  const [loadingCategoryId, setLoadingCategoryId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [form] = Form.useForm(); // Form hooks
  const [errorMessage, setErrorMessage] = useState(null); // State to manage error messages
  const userData = useSelector((state) => state.activeUser.value);

  // Function to handle store deletion
  const handleDelete = async (storeId) => {
    try {
      // Display confirmation modal before deletion
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Set loading state during deletion
          setLoadingCategoryId(storeId);

          // Make API request to delete store
          const response = await axios.delete(
            "http://localhost:7000/api/v1/products/deletestore",
            { data: { storeId: storeId } }
          );
          console.log(response);

          // Display success message using Swal
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Store Deleted!",
            showConfirmButton: false,
            timer: 1500,
          });

          // Trigger data reload and reset loading state
          setShouldReloadData(!shouldReloadData);
          setLoadingCategoryId("");
        }
      });
    } catch (error) {
      // Log and handle errors
      console.error("Error handling store deletion:", error);
    }
  };

  // Function to handle form submission for editing a store
  const onFinish = async (values) => {
    console.log("Success:", values);
    const editStoreData = {
      storeName: values.storeName,
      id: editId,
    };
    console.log(editStoreData);

    // Make API request to edit store
    const response = await axios.post(
      "http://localhost:7000/api/v1/products/editstore",
      editStoreData
    );
    console.log(response);

    // Handle response based on status
    if (response.status === 200 && response.data === "Store Already Exists") {
      setErrorMessage("Store Already Exists. Please use a different Store.");
    } else {
      // Display success message using Swal
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Store Updated!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Trigger data reload and reset loading state
      setShouldReloadData(!shouldReloadData);
      setLoadingCategoryId("");
      setIsModalOpen(false); // Close the modal after successful edit
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showModal = (editId) => {
    setIsModalOpen(true);
    setEditId(editId);

    // Find the store data based on the editId
    const storeToEdit = store.find((store) => store.key === editId);
    console.log(storeToEdit);

    // Set initial values for the form fields
    form.setFieldsValue({
      storeName: storeToEdit.storeName,
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Modal section end

  // Fetch all stores from the API for display
  useEffect(() => {
    async function fetchAllStores() {
      try {
        // Make API request to get all stores
        const response = await axios.get(
          "http://localhost:7000/api/v1/products/viewstore"
        );

        console.log(response.data);

        // Transform the received data into the desired format
        const viewStoreData = response.data.map((item) => ({
          key: item._id,
          storeName: item.storeName,
          tradeNumber: item.tradeNumber,
          status: item.isActive ? "Approved" : "Pending",
          owners: item.ownerId.map((owner) => ({
            id: owner._id,
            name: owner.name,
            email: owner.email,
          })),
        }));

        // Set the transformed data to the state
        setStore(viewStoreData);
        console.log(viewStoreData);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching stores:", error);
      }
    }

    // Fetch stores when the component mounts and whenever data should be reloaded
    fetchAllStores();
  }, [shouldReloadData]);

  // Table columns configuration
  const columns = [
    {
      title: "Store Name",
      dataIndex: "storeName",
      key: "storeName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Trade Number",
      dataIndex: "tradeNumber",
      key: "tradeNumber",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Owners",
      dataIndex: "owners",
      key: "owners",
      render: (owners) => (
        <div>
          {owners.map((owner) => (
            <div key={owner.id}>
              <p>Name: {owner.name}</p>
              <p>Email: {owner.email}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* Render Edit button for Merchant role */}
          {userData.role === "Merchant" && (
            <Button onClick={() => showModal(record.key)}>Edit</Button>
          )}
          {/* Render Delete button for all roles */}
          <Button
            type="primary"
            danger
            ghost
            onClick={() => handleDelete(record.key)}
            loading={loadingCategoryId === record.key}
          >
            Delete
          </Button>
          {/* Render Approve/Hold button for Admin role */}
          {userData.role === "Admin" && (
            <Button
              type="primary"
              ghost
              // onClick={() => handleApprove(record)}
              loading={loadingCategoryId === record.key}
            >
              {record.status === "Approved" ? "Hold" : "Approve"}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <>
        {/* Display section header */}
        <div className="flex justify-evenly">
          <h2 className="text-2xl font-semibold my-2">View Store</h2>
          <h2 className="text-2xl font-semibold my-2">
            Total Store: {store.length}
          </h2>
        </div>
        {/* Render the table with columns and store data */}
        <Table columns={columns} dataSource={store} />

        {/* Render Edit modal */}
        <Modal
          title="Edit Store"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Edit Store Name"
              name="storeName"
              rules={[
                {
                  required: true,
                  message: "Please input your Store Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            {errorMessage && <Alert message={errorMessage} type="error" />}

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                block
                htmlType="submit"
                className="my-2 bg-blue-500 text-white font-semibold"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* Render Edit modal end */}
      </>
    </div>
  );
};

export default ViewStore;
