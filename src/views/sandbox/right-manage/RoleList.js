import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Tree } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";

export default function RoleList() {
  const [dataSource, setDatasource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [treeData, setTreeData] = useState([]);

  // 初始化权限列表
  useEffect(() => {
    const getRightList = async () => {
      try {
        const res = await axios.get("/rights?_embed=children");
        setTreeData(() => res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRightList();
  }, []);

  // 初始化角色列表
  useEffect(() => {
    const getRoleList = async () => {
      try {
        const res = await axios.get("/roles");
        setDatasource(() => res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRoleList();
  }, []);

  // 表格列配置
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: id => <b>{id}</b>,
    },
    {
      title: "角色管理员",
      dataIndex: "roleName",
      render: roleName => <Tag color="green">{roleName}</Tag>,
    },
    {
      title: "操作",
      render: item => (
        <div>
          {/* 编辑按钮 */}
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            style={{ marginRight: 10 }}
            onClick={() => {
              setIsModalVisible(true);
              setCurrentRights(item.rights);
              setCurrentId(() => item.id);
            }}
          />
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

  // 展示确认框
  const showConfirm = item =>
    Modal.confirm({
      title: "你确定要删该项吗？",
      content: "删除后无法恢复！请谨慎使用",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });

  // 删除表格的行
  const deleteMethod = ({ id }) => {
    setDatasource(prevData => prevData.filter(data => data.id !== id));
    axios.delete(`/roles/${id}`);
  };

  const handleOk = () => {
    // 更新前端页面
    setDatasource(prevData =>
      prevData.map(data => (data.id === currentId ? { ...data, rights: currentRights } : data))
    );
    setIsModalVisible(false);
    // 更新后端数据
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
  };
  const handleCancel = () => setIsModalVisible(false);

  return (
    <>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          treeData={treeData}
          checkedKeys={currentRights}
          onCheck={checkedRights => setCurrentRights(() => checkedRights.checked)}
          checkStrictly={true}
        />
      </Modal>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />
    </>
  );
}
