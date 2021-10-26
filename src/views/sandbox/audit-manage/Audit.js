import React, { useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { AUDIT_LIST, COLOR_LIST } from "../../../config/utils";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Audit() {
  const [dataSouce, setDataSouce] = useState([]);
  const { username, roleId, region } = JSON.parse(
    localStorage.getItem("token")
  );
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => (
        <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => category.title,
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => (
        <Tag color={COLOR_LIST[auditState]}>{AUDIT_LIST[auditState]}</Tag>
      ),
    },
    {
      title: "操作",
      render: (item) => (
        <>
          <Button
            type="primary"
            shape="circle"
            icon={<CheckOutlined />}
            onClick={() => handleClick(item, 2, 1)}
          />

          <Button
            type="danger"
            shape="circle"
            icon={<CloseOutlined />}
            style={{ marginLeft: 10 }}
            onClick={() => handleClick(item, 3, 0)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`/news?auditState=1&_expand=category`);
      setDataSouce(() =>
        roleId === 1
          ? data
          : [
              ...data.filter((item) => item.author === username),
              ...data.filter(
                (item) => item.region === region && item.roleId === 3
              ),
            ]
      );
    };
    getData();
  }, [roleId, region, username]);

  const handleClick = ({ id }, auditState, publishState) => {
    setDataSouce((prevData) => prevData.filter((data) => data.id !== id));
    axios.patch(`news/${id}`, {
      auditState,
      publishState,
    });
  };

  return (
    <>
      <Table
        dataSource={dataSouce}
        columns={columns}
        rowKey={(item) => item.id}
      />
    </>
  );
}
