import { Card, Space, Button, Form, Input, Alert } from "antd";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [userError, setUserError] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    const userInfo = {
      email: values.email,
      password: values.password,
    };

    try {
      const loginInfo = await axios.post(
        "http://localhost:7000/api/v1/auth/login",
        userInfo
      );
      console.log(loginInfo.data);

      if (loginInfo.data.role === "User" || loginInfo.status === 403) {
        // console.log("do not allow ");
        setUserError("User not allowed");
      } else {
        // Check if the loginInfo contains an error message
        if (loginInfo.status === 401 || loginInfo.status === 500) {
          setErrorMessage("Invalid email or password");
        } else {
          // Reset the error message if the login is successful
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Login successful!",
            showConfirmButton: false,
            timer: 1500,
          });
          setErrorMessage(null);

          // set user information local storage
          localStorage.setItem('user', JSON.stringify(loginInfo.data))
          // Redirect to a different page or provide feedback
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Error during login:", error);

      // Check if the error is due to incorrect password
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="text-center my-[5%] py-10">
      <Space direction="vertical" size={16}>
        <Card
          title="Login"
          style={{
            width: 400,
          }}
        >
          {/* form start */}
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
              <Button
                type="secondary"
                className="bg-orange-400"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          {/* form end */}
          {errorMessage && <Alert message={errorMessage} type="error" />}
          {userError && <Alert message={userError} type="error" />}

          <div className="my-4">
            <p>
              Do not have an account? Please{" "}
              <span className="text-blue-500 font-bold">
                <Link to="/registration">Register</Link>
              </span>
            </p>
            <p className="my-2">
              <span className="text-blue-500 font-bold">
                <Link to="/forgotpassword">Forgot Password</Link>
              </span>
            </p>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default Login;
