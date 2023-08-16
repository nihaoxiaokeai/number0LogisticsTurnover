import * as React from "react";
import ContentView from "./ContentView";

import "./index.scss";

interface IProps {
  columns: object[] | any;
  dataList: object[] | any;
  scrollX?: number | any;
  scrollY?: number | any;
}

const TableView = React.memo(
  React.forwardRef((props: IProps, ref) => {
    const { columns, dataList, scrollY, scrollX } = props;
    return (
      <div className="lz-table-view">
        <div
          className="vertical-scroll"
          style={{ maxHeight: scrollY ? scrollY : "9999999" }}
        >
          <ContentView
            columns={columns}
            dataList={dataList}
            scrollX={scrollX}
          />
        </div>
      </div>
    );
  })
);

export default TableView;
