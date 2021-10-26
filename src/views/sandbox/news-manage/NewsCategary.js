import React, { useEffect, useState, useContext, useRef } from "react";
import { Button, Table, Input, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function NewsCategary() {
  const [categoryList, setCategoryList] = useState([]);
  const columns = [
    { title: "ID", dataIndex: "id", render: (id) => <b>{id}</b> },
    {
      title: "新闻分类",
      dataIndex: "title",
      // 可编辑行
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "新闻分类",
        handleSave: handleSave,
      }),
    },
    {
      title: "操作",
      render: () => (
        <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
      ),
    },
  ];

  const handleSave = ({ id, title, value }) => {
    // console.log(record);
    setCategoryList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, title, value } : item
      )
    );
    axios.patch(`/categories/${id}`, {
      title,
      value,
    });
  };

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get("/categories");
      setCategoryList(() => data);
    };
    getData();
  }, []);

  return (
    <Table
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      dataSource={categoryList}
      columns={columns}
      rowKey={(item) => item.id}
    />
  );
}
