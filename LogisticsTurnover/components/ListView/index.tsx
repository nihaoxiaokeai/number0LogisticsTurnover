import * as React from "react";
import "./index.scss";

interface IPorps {}

interface IState {
  required: [];
  visibleData: any | [];
}

const data = [];
function getDataList() {
  for (let index = 0; index < 10000; index++) {
    const info = { value: index };
    data.push(info);
  }
}

class ListView extends React.PureComponent<IPorps, IState> {
  constructor(props: IPorps) {
    super(props);
    getDataList();
    this.state = {
      required: [],
      visibleData: [],
    };
  }
  itemHeight: number = 30;

  handleScroll = () => {
    const listView = document.getElementById("list-view");
    const scrollTop = listView.scrollTop;
    this.updateVisibleData(scrollTop);
  };

  updateVisibleData = (scrollTop: number) => {
    const listView = document.getElementById("list-view");
    const contentE = document.getElementById("content");
    const visibleCount = Math.ceil(listView.clientHeight / this.itemHeight);
    const start = Math.floor(scrollTop / this.itemHeight);
    const end = start + visibleCount;
    contentE.style.webkitTransform = `translate3d(0, ${
      start * this.itemHeight
    }px, 0)`;
    const visibleData = data.slice(start, end);
    this.setState({ visibleData: visibleData });
  };

  componentDidMount() {
    this.updateVisibleData(0);
  }

  //
  render() {
    const { required = [], visibleData = [] } = this.state;
    return (
      <div id="list-view" className="list-view" onScroll={this.handleScroll}>
        {/* 撑开高度 */}
        <div
          className="list-view-phantom"
          style={{ height: data.length * 30 }}
        ></div>
        {/* 列表 */}
        <div id="content" className="list-view-content">
          {visibleData.map((item: any, index: number) => (
            <div className="list-view-item" style={{ height: 30 }} key={index}>
              {item.value}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ListView;
