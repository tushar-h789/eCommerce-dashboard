import { Card, Space, Button, Form, Input, Alert } from "antd";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Registration = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const userInfo = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      // console.log(userInfo);

      const response = await axios.post("http://localhost:7000/api/v1/auth/registration", userInfo);
      // console.log(response);

      // Check if the response contains an error message
      if (response.status === 400 && response.data === "Email Already Exists") {
        setErrorMessage("Email already exists. Please use a different email.");
      } else {
        // Reset the error message if the registration is successful
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        setErrorMessage(null);
        // Redirect to a different page or provide feedback
        navigate(`/otp/${response.data.email}`);
      }
    } catch (error) {
      console.error("Error creating user or sending email", error);

      if (error.response && error.response.status === 400) {
        setErrorMessage("Please enter one uppercase letter, one lowercase letter, and one number or special character.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="text-center my-[4%] py-10">
      <Space direction="vertical" size={16}>
        <Card
          title="Registration"
          style={{
            width: 400,
          }}
        >
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
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

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
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="secondary" className="bg-orange-400" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>

          {errorMessage && <Alert message={errorMessage} type="error" />}

          <div className="my-4">
            <p>
              Already have an account? Please{" "}
              <span className="text-blue-500 font-bold">
                <Link to="/">Login</Link>
              </span>
            </p>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default Registration;
