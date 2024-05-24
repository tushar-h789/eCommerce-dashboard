import { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
// import CkEditor from "./CkEditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// const { TextArea } = Input;

const AddProduct = () => {
  let [varinatvalue, setVarinatvalue] = useState([]);
  // let [value, setValue] = useState("");
  // let [valuestock, setValueStock] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [image, setImage] = useState({});
  const [imagePrev, setImagePrev] = useState({});
  // const [productType, setProductType] = useState(null);
  let [description, setDescription] = useState("");

  const onFinishMain = async (values) => {
    // console.log(values);
    const productData = {
      name: values.name,
      description: description,
      avatar: image,
      regularprice: values.regularprice,
      salesprice: values.salesprice,
      quantity: values.quantity,
      subcategory: values.subcategory,
    };
    console.log(productData);

    const data = await axios
      .post(
        "http://localhost:7000/api/v1/products/createproducts",
        productData,
        {
          headers: {
            "content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
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

  const onFinish = (values) => {
    let arr = [...varinatvalue];

    arr.push({
      name: values.variantname,
      value: [],
    });
    setVarinatvalue(arr);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // const handleVariantValue = (index) => {
  //   varinatvalue[index].value.push({
  //     name: value,
  //     stock: valuestock,
  //   });
  //   let arr = [...varinatvalue];
  //   // console.log(arr);
  //   setVarinatvalue(arr);
  //   // clear input box values
  //   setValue("");
  //   setValueStock("");
  // };

  // const handleDelete = (index) => {
  //   console.log(index);
  //   const arr = [...varinatvalue];
  //   // console.log(arr);
  //   arr.splice(index, 1);
  //   setVarinatvalue(arr);
  // };

  // const handleValueDelete = (mainId, id) => {
  //   console.log(mainId, id);
  //   const arr = [...varinatvalue];
  //   // console.log(arr[mainId].value);
  //   arr[mainId].value.splice(id, 1);
  //   setValue(arr);
  // };

  useEffect(() => {
    // console.log("running");
    async function getData() {
      const data = await axios.get(
        "http://localhost:7000/api/v1/products/viewstore"
      );
      // console.log(data.data);
      setStoreList(data.data);
      // console.log(data.data);
    }
    getData();
  }, []);

  // subCategory useEffect
  useEffect(() => {
    // console.log("running");
    async function getSubCategoryData() {
      const data = await axios.get(
        "http://localhost:7000/api/v1/products/viewsubcategory"
      );
      // console.log(data.data);
      setSubCategory(data.data.data);
      // console.log(data.data.data);
    }
    getSubCategoryData();
  }, []);

  const handleFile = (e) => {
    setImage(e.target.files[0]);
    setImagePrev(URL.createObjectURL(e.target.files[0]));
  };

  // const handleChange = (e) => {
  //   console.log(e.label);
  //   setProductType(e.label);
  // };

  // const handleProductType = (e) => {
  //   console.log("kire", e.label);
  //   setProductType(e.label);
  // };

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
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinishMain}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        encType="multipart/form-data"
      >
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button ghost type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
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
            <input onChange={handleFile} type="file" name="" id="" />
            <img src={imagePrev} alt="" className="w-[100px] h-[100px]" />
            {/* <Input onChange={handleChange} type="file" />
        <img src={imagePrev} /> */}
          </div>
        </div>

        <Form.Item
          label="Store Name"
          name="brandName"
          rules={[
            {
              required: true,
              message: "Please input your Brand Name!",
            },
          ]}
        >
          <Select>
            {storeList.map((storeData) => (
              // <div key={storeData._id}>
              <Select.Option key={storeData._id} value={storeData._id}>
                {storeData.storeName}
              </Select.Option>
              // </div>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Sub Category Name"
          name="subcategory"
          rules={[
            {
              required: true,
              message: "Please input your Sub Category Name!",
            },
          ]}
        >
          <Select>
            {subCategory.map((subCategoryData) => (
              // <div key={storeData._id}>
              <Select.Option
                key={subCategoryData._id}
                value={subCategoryData._id}
              >
                {subCategoryData.name}
              </Select.Option>
              // </div>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input your description!",
            },
          ]}
        >
          <Input />
        </Form.Item> */}
      </Form>

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
      >
        {/* ck editor */}
        <CKEditor
          editor={ClassicEditor}
          data=""
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            // console.log(data);
            setDescription(data);
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />

        {/* <Form.Item
            label="Variant Name"
            name="variantname"
            style={{
              maxWidth: 600,
            }}
            rules={[
              {
                required: true,
                message: "Please input your variant!",
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
            <Button ghost type="primary" htmlType="submit">
              Add Variant
            </Button>
          </Form.Item> */}
      </Form>
    </>
  );
};

export default AddProduct;
