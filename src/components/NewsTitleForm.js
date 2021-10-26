import React, { forwardRef } from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 20,
  },
};

function NewsTitleForm({ categoryList }, ref) {
  return (
    <Form {...layout} name="control-hooks" ref={ref}>
      <Form.Item
        name="title"
        label="新闻标题"
        rules={[
          {
            required: true,
            message: "请输入新闻标题",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="新闻分类"
        rules={[
          {
            required: true,
            message: "请选择新闻分类",
          },
        ]}
      >
        <Select placeholder="请选择新闻分类" onChange={(f) => f}>
          {categoryList.map((item) => (
            <Option key={`category-${item.id}`} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}

export default forwardRef(NewsTitleForm);
