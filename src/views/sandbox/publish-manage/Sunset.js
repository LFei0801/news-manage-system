import React from "react";
import NewsPublishTable from "../../../components/NewsPublishTable";
import usePublish from "../../../hooks/usePublish";

export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3);

  return (
    <NewsPublishTable
      dataSource={dataSource}
      type={4}
      handleDelete={handleDelete}
    />
  );
}
