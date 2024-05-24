import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "antd";

const Merchant = () => {
  // State to store the fetched merchant list
  const [merchantList, setMerchantList] = useState([]);
  // State to store filter options for the "Name" column
  const [merchantNameFilterOptions, setMerchantNameFilterOptions] = useState([]);

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      filters: merchantNameFilterOptions,
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
    async function fetchMerchantList() {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/auth/userlist");
        setMerchantList(response.data);

        // Build filter options for the "Name" column
        const filterOptions = response.data.map((merchant) => ({
          text: merchant.name,
          value: merchant.name,
        }));
        setMerchantNameFilterOptions(filterOptions);
      } catch (error) {
        console.error("Error fetching merchant list", error);
      }
    }

    // Fetch merchant list when the component mounts
    fetchMerchantList();
  }, []);

  // Filter users with role "Merchant"
  const filteredMerchant = merchantList.filter((merchant) => merchant.role === "Merchant");

  return (
    <div>
      <div className="flex justify-evenly">
        <h2 className="text-3xl font-bold my-2">
          Total Merchants: {filteredMerchant.length}
        </h2>
        <h2 className="text-3xl font-bold my-2">
          Total Users: {merchantList.length}
        </h2>
      </div>

      <Table columns={columns} dataSource={filteredMerchant} onChange={onChange} />
    </div>
  );
};

export default Merchant;
