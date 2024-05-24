import { Card, Space, Button, Form, Input, Alert } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";


const Otp = () => {
    const {email} =  useParams()
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()

    const onFinish = async (values) => {

        const otpInfo = {
            email: email,
          otp: values.otp,
        };
        console.log(otpInfo);
    
        try {
          const response = await axios.post("http://localhost:7000/api/v1/auth/otpverify", otpInfo);

          console.log(response);
    
          // Check if the response contains an error message
          if (response.status === 400 && response.data === "OTP does not match") {
            setErrorMessage("Email already exists. Please use a different email.");
          } else {
            // Reset the error message if the registration is successful
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "OTP verify successful!",
              showConfirmButton: false,
              timer: 1500,
            });
            setErrorMessage(null);
            // Redirect to a different page or provide feedback
            navigate('/');
          }
        } catch (error) {
          console.error("Error creating user or sending email", error);
          setErrorMessage("OTP dose not valid. Please submit valid otp");
        }
      };
      const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
      };

  return (
    <div className="text-center my-[5%]  py-10">
    <Space direction="vertical" size={16}>
      <Card
        title="Check your email and submit your otp"
        style={{
          width: 400,
        }}
      >

          {/* from start */}
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
          label="OTP"
          name="otp"
          rules={[
            {
              required: true,
              message: "Please input your otp!",
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
      {/* from end */}
      {errorMessage && <Alert message={errorMessage} type="error" />}
      </Card>
      
    </Space>
    
  </div>
  )
}

export default Otp