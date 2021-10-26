import React, { useEffect, useState } from "react";
import { Card, Col, Row, Avatar, List, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import useNewsRanking from "../../../hooks/useNewsRanking";
import Bar from "../../../components/Bar";
import Pie from "../../../components/Pie";
import axios from "axios";

export default function Home() {
  const viewList = useNewsRanking("view");
  const starList = useNewsRanking("star");
  const [currentUserNews, setCurrentUserNews] = useState([]);
  const [visible, setVisisble] = useState(false);
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));

  // 请求数据
  useEffect(() => {
    const getCurrentUserNews = async () => {
      try {
        const { data } = await axios.get(
          `/news?author=${username}&publishState=2&_expand=category`
        );
        setCurrentUserNews(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentUserNews();
  }, [username]);

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览文章排行榜" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多文章排行榜" bordered={true}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="pie" onClick={() => setVisisble(true)} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Card.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <strong>{region ? region : "全球"}</strong>
                  <span
                    style={{
                      marginLeft: 5,
                      fontSize: 12,
                    }}
                  >
                    {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      {/* 新闻分类柱状图展示 */}
      <Bar />
      {/* 个人新闻数据展示 */}
      <Drawer
        width={600}
        title="个人新闻数据展示"
        placement="left"
        onClose={() => setVisisble(false)}
        visible={visible}
      >
        <Pie news={currentUserNews} />
      </Drawer>
    </div>
  );
}
