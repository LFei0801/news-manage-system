import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import { COLOR_LIST, PUBLISH_LIST, AUDIT_LIST } from "../../../config/utils";
import moment from "moment";
import axios from "axios";

export default function NewsPreView({ match }) {
  const [newsInfo, setNewsInfo] = useState(null);

  useEffect(() => {
    const getPreviewData = async () => {
      try {
        const res = await axios.get(
          `/news/${match.params.id}?_expand=category&_expand=role`
        );
        setNewsInfo(() => res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPreviewData();
  }, [match.params.id]);

  return (
    <>
      {newsInfo && (
        <div>
          {/* 标题 */}
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime
                  ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: COLOR_LIST[newsInfo.auditState] }}>
                  {AUDIT_LIST[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: COLOR_LIST[newsInfo.publishState] }}>
                  {PUBLISH_LIST[newsInfo.publishState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {newsInfo.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          {/* 内容 */}
          <div
            className="news-content"
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{ borderTop: "solid 1px #ddd", margin: "0 24px" }}
          />
        </div>
      )}
    </>
  );
}
