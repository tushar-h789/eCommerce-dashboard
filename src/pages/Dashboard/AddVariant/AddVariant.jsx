// Importing necessary dependencies
import { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

// Component for adding a new product variant
const AddVariant = () => {
  // State variables for managing form inputs and data
  let [image, setImage] = useState({}); // For storing selected image file
  let [imagePrev, setImagePrev] = useState(""); // For displaying a preview of the selected image
  let [prolist, setProlist] = useState([]); // For storing list of products
  let [productId, setProductId] = useState(""); // For storing selected product ID

  // Function to handle form submission
  const onFinish = async (values) => {
    // Sending POST request to add a new variant
    let data = await axios
      .post(
        "http://localhost:7000/api/v1/products/variant",
        {
          name: values.name,
          avatar: image,
          productId: productId,
          regularprice: values.regularprice,
          salesprice: values.salesprice,
          quantity: values.quantity,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        // Showing success message upon successful addition
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your product added",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    console.log(data);
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Fetching list of products from the server upon component mount
  useEffect(() => {
    console.log("running");
    async function getData() {
      let data = await axios.get(
        "http://localhost:7000/api/v1/products/viewproducts"
      );
      console.log(data.data);
      let arr = [];
      data.data.map((item) => {
        arr.push({
          label: item.name,
          value: item._id,
        });
      });
      setProlist(arr);
    }
    getData();
  }, []);

  // Function to handle image file change
  let handleChange = (e) => {
    setImage(e.target.files[0]);
    setImagePrev(URL.createObjectURL(e.target.files[0]));
  };

  // Function to handle product selection change
  let handleChange2 = (e) => {
    setProductId(e);
    console.log(e);
  };

  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 1000,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        enctype="multipart/form-data"
      >
        <div className="mx-auto w-full text-center my-4">
          <p className="font-semibold my-1">
            <strong>*</strong> Select Variant:
          </p>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            options={prolist}
            onChange={handleChange2}
          />
        </div>

        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your product name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Regular Price"
          name="regularprice"
          rules={[
            {
              required: true,
              message: "Please input your regular Price!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Sales Price"
          name="salesprice"
          rules={[
            {
              required: true,
              message: "Please input your sales Price!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Please input your quantity!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="mx-auto w-full pl-28 my-4 ">
          <div className="flex gap-6 justify-center items-center">
            <p className="font-semibold">File name:</p>
            <input onChange={handleChange} type="file" name="" id="" />
            <img src={imagePrev} alt="" className="w-[100px] h-[100px]" />
          </div>
        </div>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            className="bg-orange-500 font-semibold"
            htmlType="submit"
          >
            Add Variant
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddVariant;
