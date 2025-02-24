/*
 * @Author: tohsaka888
 * @Date: 2022-09-30 09:28:11
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-10-09 14:32:01
 * @Description: 全局配置
 */

import React, { useContext, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import Canvas from "./Canvas";
import { ConfigContext } from "./Controller/ConfigController";
import ConfigController from "./Controller/ConfigController";
import RightMenuController from "./Controller/RightMenuController";
import Helper from "./Helper";
import { store } from "./store";
import { ConfigProps } from "./typings/Config";
import GraphBoundsController from "./Controller/GraphBoundsController";
import FilterBar from "./FilterBar";
import { DrawerProvider } from './Controller/DrawerController';
import { AddNodeDrawer } from './components/AddNodeModal';

function GraphContainer({ children }: { children: React.ReactNode }) {
  const { config } = useContext(ConfigContext)!;
  return (
    <div
      id={"knowledge-graph-container"}
      style={{
        position: "relative",
        width: config.width,
        height: config.height,
        overflow: "hidden",
        ...config.style,
      }}
      className={config.className}
    >
      {children}
    </div>
  );
}

function Graph(graphConfig: ConfigProps) {
  return (
    <DrawerProvider>
      <ConfigController graphConfig={graphConfig}>
        <Provider store={store}>
          <div style={{ display: "flex" }}>
            <RightMenuController>
              <GraphBoundsController>
                <GraphContainer>
                  <Helper />
                  <FilterBar />
                  <Canvas />
                </GraphContainer>
              </GraphBoundsController>
            </RightMenuController>
            <AddNodeDrawer />
          </div>
        </Provider>
      </ConfigController>
    </DrawerProvider>
  );
}

export default Graph;
