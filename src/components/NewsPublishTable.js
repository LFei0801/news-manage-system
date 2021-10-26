import React from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";

export default function NewsPublishTable({
  dataSource,
  type,
  handlePublish,
  handleSunset,
  handleDelete,
}) {
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
      title: "操作",
      render: (item) => (
        <>
          <Button
            type="primary"
            className={type === 2 ? "" : "hidden"}
            onClick={() => handlePublish(item.id)}
          >
            发布
          </Button>
          <Button
            danger
            className={type === 3 ? "" : "hidden"}
            onClick={() => handleSunset(item.id)}
          >
            下线
          </Button>
          <Button
            type="danger"
            className={type === 4 ? "" : "hidden"}
            onClick={() => handleDelete(item.id)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(item) => item.id}
      pagination={{
        pageSize: 6,
      }}
    />
  );
}
