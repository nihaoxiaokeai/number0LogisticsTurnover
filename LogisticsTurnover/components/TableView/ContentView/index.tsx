import * as React from "react";
import HeaderView from "../HeaderView";

import "./index.scss";

interface IProps {
  columns: object[] | any;
  dataList: object[] | any;
  scrollX?: number | any;
}

class ContentView extends React.PureComponent<IProps> {
  render() {
    const { columns = [], dataList = [], scrollX } = this.props;
    return (
      <div
        className="horizontal-scroll"
        style={{ maxWidth: scrollX ? scrollX : window.screen.width }}
      >
        <HeaderView columns={columns} />
        {/* cell */}
        {dataList.map((item: any, index: number) => {
          const { type } = item;
          return (
            <div className="cell-content" key={index}>
              {columns.map((subItem: any, subIndex: any) => {
                const { width } = subItem;
                const spanWidth = width ? width : "100px";
                return (
                  <div
                    className="cell-text"
                    key={subIndex}
                    style={{
                      width: spanWidth,
                      minWidth: width ? width : "100px",
                      borderTop:
                        type === "total" ? "1px solid #f2f2f2" : "none",
                    }}
                  >
                    <span
                      className={
                        type === "yellow" && subIndex === 0
                          ? "span-flag"
                          : "span-text"
                      }
                      key={subIndex}
                      style={{
                        fontWeight:
                          type === "total" ||
                          (type === "yellow" && subIndex > 0)
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {item[subItem.key]}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default ContentView;
