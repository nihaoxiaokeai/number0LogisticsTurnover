import * as React from "react";
import "./index.scss";

interface IProps {
  columns: object[] | any;
}

class TableHeader extends React.PureComponent<IProps> {
  render() {
    const { columns = [] } = this.props;
    return (
      <div className="header-content">
        {columns.map((item: any, index: number) => {
          const { flag, width } = item;
          const spanWidth = width ? width : "100px";
          return (
            <div
              key={index}
              className="header-text"
              style={{
                width: spanWidth,
                minWidth: width ? width : "100px",
              }}
            >
              <span className={flag ? "span-flag" : "span-text"}>
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TableHeader;
