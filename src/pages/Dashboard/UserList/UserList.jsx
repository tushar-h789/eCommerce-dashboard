import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "antd";

const UserList = () => {
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
    async function fetchUserList() {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/auth/userlist");
        setUserList(response.data);

        // Build filter options for the "Name" column
        const filterOptions = response.data.map((user) => ({
          text: user.name,
          value: user.name,
        }));
        setUserNameFilterOptions(filterOptions);
      } catch (error) {
        console.error("Error fetching user list", error);
      }
    }

    // Fetch user list when the component mounts
    fetchUserList();
  }, []);

  // Filter users with role "User"
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
    </div>
  );
};

export default UserList;
