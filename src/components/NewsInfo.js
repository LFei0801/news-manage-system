import React from "react";
import { Descriptions } from "antd";

export default function NewsInfo({ news, categoryList }) {
  return (
    <Descriptions
      title="新闻信息"
      bordered
      layout="vertical"
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    >
      <Descriptions.Item label="新闻标题">{news.title}</Descriptions.Item>
      <Descriptions.Item label="新闻分类">{news.categoryId}</Descriptions.Item>
      <Descriptions.Item
        label="新闻内容"
        contentStyle={{ overflow: "hidden", height: "100%" }}
      >
        <div dangerouslySetInnerHTML={{ __html: news.content }} />
      </Descriptions.Item>
    </Descriptions>
  );
}
