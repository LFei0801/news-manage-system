import React from "react";
import NewsPublishTable from "../../../components/NewsPublishTable";
import usePublish from "../../../hooks/usePublish";

export default function Unpublish() {
  const { dataSource, handlePublish } = usePublish(1);

  return (
    <NewsPublishTable
      dataSource={dataSource}
      type={2}
      handlePublish={handlePublish}
    />
  );
}
