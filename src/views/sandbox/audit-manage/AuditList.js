import React, { useEffect, useState } from "react";
import { Button, notification, Table, Tag } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AUDIT_LIST, COLOR_LIST } from "../../../config/utils";
import axios from "axios";

export default function AuditList({ history }) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
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
            className={item.auditState === 1 ? "" : "hidden"}
            onClick={() => handleRevert(item)}
          >
            撤销
          </Button>
          <Button
            type="primary"
            className={item.auditState === 2 ? "" : "hidden"}
            onClick={() => hadnlePublish(item)}
          >
            发布
          </Button>
          <Button
            type="primary"
            className={item.auditState === 3 ? "" : "hidden"}
            onClick={() => history.push(`/news-manage/update/${item.id}`)}
          >
            更新
          </Button>
        </>
      ),
    },
  ];

  // 初始化表格数据
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
        );
        setDataSource(() => res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [username]);

  // 撤销新闻
  const handleRevert = (item) => {
    setDataSource((prevData) => prevData.filter((data) => data.id !== item.id));
    axios.patch(`/news/${item.id}`, {
      auditState: 0,
    });
  };

  // 发布新闻
  const hadnlePublish = ({ id }) => {
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then(() => {
        history.push("/publish-manage/published");
        notification.open({
          message: "通知",
          description: `你可以在[发布新闻/已发布]中查看你发布的新闻`,
          placement: "buttomRight",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
      });
  };

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 8,
        }}
      />
    </>
  );
}
