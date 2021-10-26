import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal, notification } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import axios from "axios";

export default function NewsDraft({ history }) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
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
      title: "分类",
      dataIndex: "category",
      render: (category) => category.title,
    },
    {
      title: "操作",
      render: (item) => (
        <>
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => history.push(`/news-manage/update/${item.id}`)}
          />
          <Button
            shape="circle"
            icon={<UploadOutlined />}
            style={{ marginLeft: 5, marginRight: 5 }}
            onClick={() => handleCheckNews(item)}
          />
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => showConfirm(item)}
          />
        </>
      ),
    },
  ];

  // 初始化草稿箱列表
  useEffect(() => {
    const getDraftList = async () => {
      const res = await axios.get(
        `/news?author=${username}&auditState=0&_expand=category`
      );
      setDataSource(res.data);
    };
    getDraftList();
  }, [username]);

  // 展示确认框
  const showConfirm = (item) =>
    Modal.confirm({
      title: "你确定要删该项吗？",
      content: "删除后无法恢复！请谨慎使用",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteDraft(item);
      },
      onCancel() {},
    });

  //删除用户
  const deleteDraft = async (item) => {
    // 更新前端页面
    setDataSource((preData) => preData.filter((data) => data.id !== item.id));
    // 更新后端数据
    axios.delete(`/news/${item.id}`);
  };

  // 发布新闻
  const handleCheckNews = (item) => {
    axios
      .patch(`/news/${item.id}`, {
        auditState: 1,
      })
      .then(() => {
        history.push("/audit-manage/list");
        notification.open({
          message: "通知",
          description: `你可以在${"审核列表"}中查看你编写的新闻`,
          placement: "topRight",
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
      />
    </>
  );
}
