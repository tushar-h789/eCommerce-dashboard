import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "antd";

const Admin = () => {
  // State to store the fetched user list
  const [userList, setUserList] = useState([]);
  // State to store filter options for the "Name" column
  const [userNameFilterOptions, setUserNameFilterOptions] = useState([]);

  // Table columns configuration
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
      filterMode: "tree",
      filterSearch: true,
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
  ];

  // Table onChange handler
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  useEffect(() => {
    // Fetch user list and build filter options for the "Name" column
    async function fetchUserList() {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/auth/userlist");
        setUserList(response.data);

        const filterOptions = response.data.map((user) => ({
          text: user.name,
          value: user.name,
        }));
        setUserNameFilterOptions(filterOptions);
      } catch (error) {
        console.error("Error fetching user list", error);
      }
    }

    // Call the fetchUserList function when the component mounts
    fetchUserList();
  }, []);

  // Filter users with role "Admin"
  const filteredAdmins = userList.filter((user) => user.role === "Admin");

  return (
    <div>
      <div className="flex justify-evenly">
        <h2 className="text-3xl font-bold my-2">
          Total Admins: {filteredAdmins.length}
        </h2>
        <h2 className="text-3xl font-bold my-2">
          Total Users: {userList.length}
        </h2>
      </div>
      
      <Table columns={columns} dataSource={filteredAdmins} onChange={onChange} />
    </div>
  );
};

export default Admin;
