import { Alert, Button, Form, Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const AddStore = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const userInfo = useSelector(state => state.activeUser.value)

    const onFinish =async (values) => {
        const storeInfo={
          storeName: values.storeName,
          tradeNumber: values.tradeNumber,
          nidNumber: values.nidNumber,
          ownerId: userInfo.id
        }
        const data = await axios.post('http://localhost:7000/api/v1/products/createstore', storeInfo)
        console.log(data);

        if (
          data.status === 200 &&
          data.data === "Store Name or Trade Number Already Exists"
        ) {
          setErrorMessage(
            "Store Already Exists. Please use a different store."
          );
        }else{
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${values.storeName} created successfully!`,
            showConfirmButton: false,
            timer: 1500
          });
        }

        
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

  return (
    <div>
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
      label="Store Name"
      name="storeName"
      rules={[
        {
          required: true,
          message: 'Please input your Store Name!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Trade Number"
      name="tradeNumber"
      rules={[
        {
          required: true,
          message: 'Please input your Trade Number!',
        },
      ]}
    >
      <Input placeholder='TRAD/DNCC/123456/2024' className='placeholder:font-bold placeholder:text-lg'/>
    </Form.Item>

    <Form.Item
      label="NID Number"
      name="nidNumber"
      rules={[
        {
          required: true,
          message: 'Please input your NID number!',
        },
      ]}
   >
      <Input placeholder='1234567890000' className='placeholder:font-bold placeholder:text-lg'/>
    </Form.Item>
    {errorMessage && <Alert className='my-4' message={errorMessage} type="error" />}


    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" ghost className='font-bold' htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
    </div>
  )
}

export default AddStore