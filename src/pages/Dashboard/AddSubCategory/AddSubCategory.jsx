import { Alert, Button, Form, Input, Select, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AddSubCategory = () => {
  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setCategoryId(value);
  };

  // Function to handle category creation
  const onFinish = async (values) => {
    console.log("Success:", values.subCategoryName);
    const categoryData = {
      name: values.subCategoryName,
      categoryId: categoryId,
    };

    try {
      // Send a request to create a new category
      const response = await axios.post(
        "http://localhost:7000/api/v1/products/createsubcategory",
        categoryData
      );

      console.log(response);

      // Check if the response status is 200
      if (
        response.status === 200 &&
        response.data === "Sub Category Already Exists"
      ) {
        setErrorMessage(
          "Sub Category Already Exists. Please use a different sub category."
        );
      } else {
        // Reset the error message if the category creation is successful
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${values.subCategoryName} is created sub category!`,
          showConfirmButton: false,
          timer: 1500,
        });
        setErrorMessage(null);
      }
    } catch (error) {
      console.error("Error creating sub category or sending request", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // fetching data to category
  useEffect(() => {
    // Function to fetch all categories from the API
    async function fetchAllCategories() {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/v1/products/allcategory"
        );

        // Transform the received data into the desired format
        const transformedData = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
          //   status: item.isActive ? "Approved" : "Pending",
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
  }, []);

  return (
    <Form
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
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* Form input for category name */}
      <Form.Item
        label="Add Sub Category Name"
        name="subCategoryName"
        rules={[
          {
            required: true,
            message: "Please input your Sub Category!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Display error message if there is an error */}
      {errorMessage && <Alert message={errorMessage} type="error" />}

      {/* Form submission button */}
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        {/* select option start */}
        <Space wrap>
          <h2>Add Category</h2>
          <Select
            defaultValue="Select Category"
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={categories}
          />
        </Space>
        {/* select option end */}

        <Button
          type="primary"
          block
          htmlType="submit"
          className="my-6 bg-blue-500 "
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddSubCategory;
