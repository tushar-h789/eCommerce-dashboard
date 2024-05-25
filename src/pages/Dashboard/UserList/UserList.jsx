import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Space, Alert, Table } from "antd";
import { useSelector } from "react-redux";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [userNameFilterOptions, setUserNameFilterOptions] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [loadingMerchantUserId, setLoadingMerchantUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); 

  const userData = useSelector((state) => state.activeUser.value);

   // Function to show error message and clear after 3 seconds
   const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  // Function to handle role change for Merchant
  const handleMerchantRoleChange = async (user) => {
    // Check if isAdmin is already true for the user
    if (user.isAdmin) {
      showError("Cannot change to Merchant role because user is Admin");
      return;
    }

    setLoadingMerchantUserId(user.key);

    try {
      const roleChangeData = {
        isMerchant: !user.isMerchant,
        id: user.key,
      };

      const response = await axios.post(
        "http://localhost:7000/api/v1/auth/statuschange",
        roleChangeData
      );

      // Update the user list state with the new isMerchant status
      setUserList((prevList) =>
        prevList.map((item) =>
          item.key === user.key ? { ...item, isMerchant: response.data.isMerchant } : item
        )
      );
    } catch (error) {
      console.error("Error changing user role", error);
    } finally {
      setLoadingMerchantUserId(null);
    }
  };

  // Function to handle role change for Admin
  const handleAdminRoleChange = async (user) => {
    // Check if isMerchant is already true for the user
    if (user.isMerchant) {
      showError("Cannot change to Admin role because user is Merchant");
      return;
    }

    setLoadingUserId(user.key);

    try {
      const roleChangeData = {
        isAdmin: !user.isAdmin,
        id: user.key,
      };

      const response = await axios.post(
        "http://localhost:7000/api/v1/auth/statuschange",
        roleChangeData
      );

      // Update the user list state with the new isAdmin status
      setUserList((prevList) =>
        prevList.map((item) =>
          item.key === user.key ? { ...item, isAdmin: response.data.isAdmin } : item
        )
      );
    } catch (error) {
      console.error("Error changing user role", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      filters: userNameFilterOptions,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <Space size="middle">
          {userData.role === "Admin" && (
            <div className="w-[200px] flex gap-10 justify-center">
              <Button
                type="primary"
                ghost
                onClick={() => handleMerchantRoleChange(record)}
                loading={loadingMerchantUserId === record.key}
              >
                {record.isMerchant ? "Remove" : "Make Merchant"}
              </Button>

              <Button
                type="primary"
                ghost
                onClick={() => handleAdminRoleChange(record)}
                loading={loadingUserId === record.key}
              >
                {record.isAdmin ? "Remove" : "Make Admin"}
              </Button>
            </div>
          )}
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  useEffect(() => {
    async function fetchUserList() {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/auth/userlist");
        const users = response.data.map((user) => ({
          ...user,
          key: user._id,
        }));
        setUserList(users);

        const filterOptions = users.map((user) => ({
          text: user.name,
          value: user.name,
        }));
        setUserNameFilterOptions(filterOptions);
      } catch (error) {
        console.error("Error fetching user list", error);
      }
    }

    fetchUserList();
  }, []);

  const filteredUser = userList.filter((user) => user.role === "User");

  return (
    <div>
      
      <div className="flex justify-evenly">
        <h2 className="text-3xl font-bold my-2">
          Total Users: {filteredUser.length}
        </h2>
        <h2 className="text-3xl font-bold my-2">
          Total Users: {userList.length}
        </h2>
      </div>

      <Table columns={columns} dataSource={filteredUser} onChange={onChange} />
      <Space direction="vertical" style={{ width: '100%' }}>

{
  errorMessage &&
    <Alert message={errorMessage} type="error" showIcon />
}

  </Space>
    </div>
  );
};

export default UserList;
