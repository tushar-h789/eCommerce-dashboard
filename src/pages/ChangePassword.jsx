import { Card, Space, Button, Form, Input, Alert } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { email } = useParams();
  const token = email;

  // State to handle timeout message
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    // Check if the token is empty and show timeout message
    if (!token) {
      setShowTimeoutMessage(true);

      // Automatically hide the message after a timeout
      const timeoutId = setTimeout(() => {
        setShowTimeoutMessage(false);
      }, 5000);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  const onFinish = async (values) => {
    if (!token) {
      // Token is empty, show timeout message
      setShowTimeoutMessage(true);
      return;
    }

    const newPassInfo = {
      token: token,
      password: values.password,
    };

    try {
      const forgotPassData = await axios.post(
        "http://localhost:7000/api/v1/auth/changepassword",
        newPassInfo
      );

      if (forgotPassData.status === 200) {
        // Password update successful
        Swal.fire({
          icon: "success",
          title: "Password updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        setErrorMessage(null);
        // Redirect to a different page or provide feedback
        navigate('/');
      } else if (forgotPassData.status === 400 ) {
        // Handle case where email and token do not match
        setErrorMessage("Email and token do not match");
      } else {
        // Handle other cases if needed
        setErrorMessage("Error updating password");
      }
    } catch (error) {
      // Handle any errors during the update process
      console.error("Error updating password", error);
      setErrorMessage("Error updating password. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="text-center my-[5%]  py-10">
      <Space direction="vertical" size={16}>
        <Card
          title="Change Password"
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
              label="New Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
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
              <Button type="secondary" className="bg-orange-400" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          {/* Form end */}

          {showTimeoutMessage && <Alert message="Token is empty. Please try again." type="error" />}
          {errorMessage && <Alert message={errorMessage} type="error" />}
        </Card>
      </Space>
    </div>
  );
};

export default ChangePassword;
