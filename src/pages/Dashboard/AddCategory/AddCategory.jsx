import { Alert, Button, Form, Input } from "antd";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const AddCategory = () => {
  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState(null);

  // Redux hook to get user data from the store
  const data = useSelector((state) => state.activeUser.value);

  // Function to handle category creation
  const onFinish = async (values) => {
    console.log("Success:", values.categoryName, data.id);
    const categoryData = {
      name: values.categoryName,
      ownerId: data.id,
    };

    try {
      // Send a request to create a new category
      const response = await axios.post(
        "http://localhost:7000/api/v1/products/createcategory",
        categoryData,
        {
          headers: {
            Authorization: "tusharsecureapi",
          },
        }
      );

      console.log(response.data.error);

      // Check if the response indicates invalid authorization
      if (response.data.error === "Need valid permission") {
        setErrorMessage("Invalid authorization");
      } else {
        // Check if the response status is 200
        if (response.status === 200) {
          if (response.data === "Category Already Exists") {
            // Set error message if category already exists
            setErrorMessage(
              "Category Already Exists. Please use a different category."
            );
          } else {
            // Reset the error message if the category creation is successful
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${values.categoryName} is created category!`,
              showConfirmButton: false,
              timer: 1500,
            });
            setErrorMessage(null);
          }
        } else {
          // Show error message if response status is not 200
          setErrorMessage("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error creating category or sending request", error);
      // Show error message for any other error
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* Form input for category name */}
      <Form.Item
        label="Add Category Name"
        name="categoryName"
        rules={[{ required: true, message: "Please input your Category!" }]}
      >
        <Input />
      </Form.Item>

      {/* Display error message if there is an error */}
      {errorMessage && <Alert message={errorMessage} type="error" />}

      {/* Form submission button */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          block
          htmlType="submit"
          className="my-2 bg-blue-500"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCategory;
