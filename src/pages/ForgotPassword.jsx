import { Card, Space, Button, Form, Input, Alert } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  // State to handle error messages
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()

  // Function to handle form submission
  const onFinish = async (values) => {
    // Extract email from form values
    const forgotPassInfo = {
      email: values.email,
    };

    // Log the email for debugging
    console.log(forgotPassInfo);

    try {
      // Send a request to the server to initiate the password reset process
      const forgotPassData = await axios.post(
        "http://localhost:7000/api/v1/auth/forgotpassword",
        forgotPassInfo
      );

      // Log the response data for debugging
      console.log(forgotPassData);

      // Display success message to the user
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Email sent. Check your mail!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate('/gmail')

      // Reset error message
      setErrorMessage(null);
    } catch (error) {
      // Log the error for debugging
      console.error("Error during forgot password process", error);

      // Set an error message for the user
      setErrorMessage("Please submit a valid email");
    }
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="text-center my-[5%] py-10">
      <Space direction="vertical" size={16}>
        <Card
          title="Forgot Password"
          style={{
            width: 400,
          }}
        >
          {/* Form start */}
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
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="secondary"
                className="bg-orange-400"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          {/* Form end */}

          {/* Display error message if exists */}
          {errorMessage && <Alert message={errorMessage} type="error" />}
        </Card>
      </Space>
    </div>
  );
};

export default ForgotPassword;
