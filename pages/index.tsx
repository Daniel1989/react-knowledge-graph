/*
 * @Author: tohsaka888
 * @Date: 2022-10-08 08:25:48
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-10-09 15:05:15
 * @Description: 请填写简介
 */
import { KnowledgeGraph } from "../KnowledgeGraph";
import { baseUrl } from "../config/baseUrl";
import type { NextPage } from "next";
import { Key, useState } from "react";
import { Button, message } from "antd";

const Home: NextPage = () => {
  const [width, setWidth] = useState<number>(1);

  const getNode = async (id: Key, direction: "inside" | "outside") => {
    const res = await fetch(`${baseUrl}/api/${direction}/${id}`);
    const data = await res.json();
    return data;
  };

  const getEdge = async (id: string) => {
    const res = await fetch(`${baseUrl}/api/edge/${id}`);
    const data = await res.json();
    return data;
  };

  const explore = async (id: string) => {
    const inside = await getNode(id, "inside");
    const outside = await getNode(id, "outside");
    const edges = await getEdge(id);

    return {
      edges,
      inside,
      outside,
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        border: "1px solid #cecece",
        overflow: "hidden",
      }}
    >
      <Button onClick={() => setWidth(width + 1)}>click</Button>
      <KnowledgeGraph
        explore={explore}
        basicDistence={width}
        position={{ x: 100, y: 100 }}
        node={{
          id: "node-0",
          type: "根节点",
          hasMore: true,
          direction: "root",
          name: "根节点",
        }}
        onExploreEnd={() => {
          message.info("已经到尾节点了!");
        }}
        edgeConfig={{
          hoveredColor: "#e27272",
          stroke: "#DEDEDE",
          strokeWidth: 1,
        }}
        typeConfig={{
          根节点: {
            radius: 20,
            fill: "#747ba6",
            hoverStyle: {
              fill: "#3949a3",
            },
          },
          model: {
            radius: 15,
            fill: "#b4e5a2",
            typeSize: 8,
            nameSize: 8,
            hoverStyle: {
              fill: "#6be73e",
            },
          },
          data: {
            radius: 15,
            fill: "#ea52ea",
            typeSize: 8,
            nameSize: 8,
            hoverStyle: {
              fill: "#e5a2e5",
            },
          },
          test: {
            radius: 13,
            fill: "#89c4fb",
            typeSize: 8,
            nameSize: 8,
            hoverStyle: {
              fill: "#2f8fe8",
            },
          },
        }}
      />
    </div>
  );
};

export default Home;
