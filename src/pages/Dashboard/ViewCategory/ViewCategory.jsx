// External library imports
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Space, Table, Modal, Form, Input, Alert } from "antd";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

// Main component definition
const ViewCategory = () => {
  // State declarations
  const [categories, setCategories] = useState([]);
  const [shouldReloadData, setShouldReloadData] = useState(false);
  const [loadingCategoryId, setLoadingCategoryId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [form] = Form.useForm(); // Form hooks
  const [errorMessage, setErrorMessage] = useState(null);

  // Accessing user data from Redux store
  const userData = useSelector((state) => state.activeUser.value);

  // Function to handle category deletion
  const handleDelete = async (categoryId) => {
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
          setLoadingCategoryId(categoryId);

          // Make API request to delete category
          const response = await axios.delete(
            "http://localhost:7000/api/v1/products/deletecategory",
            { data: { categoryId: categoryId } }
          );
          console.log(response);

          // Display success message using Swal
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " Category Deleted!",
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
      console.error("Error handling category deletion:", error);
    }
  };

  // Edit section...

  // Function to handle form submission on successful edit
  const onFinish = async (values) => {
    console.log("Success:", values);
    const editCategoryData = {
      name: values.categoryName,
      id: editId,
    };

    // Make API request to edit category
    const response = await axios.post(
      "http://localhost:7000/api/v1/products/editcategory",
      editCategoryData
    );
    console.log(response);

    // Handle response based on status
    if (
      response.status === 200 &&
      response.data === "Category Already Exists"
    ) {
      setErrorMessage(
        "Category Already Exists. Please use a different category."
      );
    } else {
      // Display success message using Swal
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: " Category Updated!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Trigger data reload and reset loading state
      setShouldReloadData(!shouldReloadData);
      setLoadingCategoryId("");
      setIsModalOpen(false); // Close the modal after successful edit
    }
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Function to show the edit modal and set initial form values
  const showModal = (editId) => {
    setIsModalOpen(true);
    setEditId(editId);

    // Find the category data based on the editId
    const categoryToEdit = categories.find(
      (category) => category.key === editId
    );

    // Set initial values for the form fields
    form.setFieldsValue({
      categoryName: categoryToEdit.name,
    });
  };

  // Functions to handle modal state
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Modal section end

  // Fetch all categories from the API on component mount and when data needs to be reloaded
  useEffect(() => {
    async function fetchAllCategories() {
      try {
        // Make API request to get all categories
        const response = await axios.get(
          "http://localhost:7000/api/v1/products/allcategory"
        );

        // Transform the received data into the desired format
        const transformedData = response.data.data.map((item) => ({
          key: item._id,
          name: item.name,
          status: item.isActive ? "Approved" : "Pending",
        }));

        // Set the transformed data to the state
        setCategories(transformedData);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching categories:", error);
      }
    }

    // Fetch categories when the component mounts and whenever data should be reloaded
    fetchAllCategories();
  }, [shouldReloadData]);

  // Function to handle category approval
  const handleApprove = async (approve) => {
    setLoadingCategoryId(approve.key);

    // Create request payload for category approval
    const editCategoryData = {
      isActive: approve.status === "Approved" ? false : true,
      id: approve.key,
    };

    // Make API request to approve category
    const response = await axios.post(
      "http://localhost:7000/api/v1/products/approvecategory",
      editCategoryData
    );

    // Handle response based on status
    if (response.status === 200 && response.data === "status changed!") {
      setErrorMessage("This category is approved !");
    } else {
      // Display success message using Swal
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: " Category Approved!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Trigger data reload and reset loading state
      setShouldReloadData(!shouldReloadData);
      setLoadingCategoryId("");
      setIsModalOpen(false); // Close the modal after successful edit
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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
          {userData.role === "Merchant" && (
            <Button onClick={() => showModal(record.key)}>Edit</Button>
          )}
          <Button
            type="primary"
            danger
            ghost
            onClick={() => handleDelete(record.key)}
            loading={loadingCategoryId === record.key}
          >
            Delete
          </Button>
          {userData.role === "Admin" && (
            <Button
              type="primary"
              ghost
              onClick={() => handleApprove(record)}
              loading={loadingCategoryId === record.key}
            >
              {record.status === "Approved" ? "Hold" : "Approve"}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Return JSX for rendering
  return (
    <>
      <div className="flex justify-evenly">
        <h2 className="text-2xl font-semibold my-2">View Category</h2>
        <h2 className="text-2xl font-semibold my-2">
          Total Category: {categories.length}
        </h2>
      </div>
      <Table columns={columns} dataSource={categories} />

      {/* Edit modal start */}
      <Modal
        title="Edit Category"
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
          {/* Form input for category name */}
          <Form.Item
            label="Edit Category Name"
            name="categoryName"
            rules={[
              {
                required: true,
                message: "Please input your Category!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {errorMessage && <Alert message={errorMessage} type="error" />}

          {/* Form submission button */}
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
      {/* Edit modal end */}
    </>
  );
};

export default ViewCategory;
