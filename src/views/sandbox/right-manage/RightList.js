import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b style={{ cursor: "pointer" }}>{id}</b>,
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => <Tag color="orange">{key}</Tag>,
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          {/* 切换配置项状态 */}
          <Popover
            style={{ textAlign: "center" }}
            content={
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={item.pagepermisson === 1}
                onChange={() => switchMethod(item)}
              />
            }
            trigger={item.pagepermisson === undefined ? "" : "click"}
            title="页面配置项"
          >
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              style={{ marginRight: 10 }}
              disabled={item.pagepermisson === undefined}
            />
          </Popover>
          {/* 删除按钮 */}
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => showConfirm(item)}
          />
        </div>
      ),
    },
  ];

  const showConfirm = (item) =>
    confirm({
      title: "你确定要删该项吗？",
      content: "删除后无法恢复！如果只是想关闭该项权限，建议使用编辑功能",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });

  const deleteMethod = (item) => {
    switch (item.grade) {
      case 1: {
        // //更新前端页面
        setDataSource((prevData) =>
          prevData.filter((data) => data.id !== item.id)
        );
        // 更新后端数据
        axios.delete(`/rights/${item.id}`);
        break;
      }
      case 2: {
        // 更新前端页面
        setDataSource((prevData) =>
          prevData.map((data) => {
            const list = dataSource.filter((data) => data.id === item.rightId);
            list[0].children = list[0].children.filter(
              (data) => data.id !== item.id
            );
            return data;
          })
        );
        // 更新后端数据
        axios.delete(`/children/${item.id}`);
        break;
      }
      default: {
        return;
      }
    }
  };

  const switchMethod = (item) => {
    // 更新前端页面
    setDataSource((prevData) =>
      prevData.map((data) => {
        if (data.id === item.id) {
          data.pagepermisson = data.pagepermisson === 1 ? 0 : 1;
        }
        return data;
      })
    );
    // 更新后端数据
    switch (item.grade) {
      case 1: {
        axios.patch(`/rights/${item.id}`, {
          pagepermisson: item.pagepermisson,
        });
        break;
      }
      case 2: {
        axios.patch(`/children/${item.id}`, {
          pagepermisson: item.pagepermisson,
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  // 初始化数据
  useEffect(() => {
    const getRights = async () => {
      try {
        const response = await axios.get("/rights?_embed=children");
        response.data.forEach((item) => {
          if (item.children.length === 0) {
            item.children = "";
          }
        });
        setDataSource(() => response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRights();
  }, []);

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 4 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
