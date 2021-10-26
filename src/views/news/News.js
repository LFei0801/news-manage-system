import React, { useEffect, useState } from "react";
import { PageHeader, Card, Col, Row, List } from "antd";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

export default function News() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const getNewsList = async () => {
      try {
        const { data } = await axios.get(
          "/news?publishState=2&_expand=category"
        );
        setNewsList(() =>
          Object.entries(_.groupBy(data, (item) => item.category.title))
        );
      } catch (error) {
        console.log(error);
      }
    };
    getNewsList();
  }, []);

  const renderNewsCard = (news) =>
    news.map((item) => (
      <Col span={8} key={`card-col-${item[0]}`}>
        <Card title={item[0]} bordered={true} hoverable>
          <List
            dataSource={item[1]}
            renderItem={(data) => (
              <List.Item>
                <Link to={`/news/datail/${data.id}`}>{data.title}</Link>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    ));
  return (
    <>
      <PageHeader className="site-page-header" title="新闻列表" />,
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          {renderNewsCard(newsList)}
        </Row>
      </div>
      ,
    </>
  );
}
