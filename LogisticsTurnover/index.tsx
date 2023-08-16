import * as React from "react";
import { Toast } from "antd-mobile";
import MenuView, { MenuType } from "./components/MenuView";
import TableView from "./components/TableView";
import EmptyView, { EmptyType } from "@components/EmptyView";
import * as api from "../../services/logisticsTurnover";
import * as qs from "query-string";
import {
  getLogisticsInfoWithTab,
  getLogisticsInfoWithStore,
  getDataKeyWithStoreCode,
} from "./config";
import SwipeableViews from "react-swipeable-views";
import "./index.scss";

interface IProps {}
interface IState {
  resetSelect: boolean;
  tabError: boolean;
  tabBarList: object[] | any;
  selectTabInfo: object | any;
  dataList: object[] | any;
  selectIndex: number;
  dataInfo: object | any;
}

const maxWidth = Math.min(window.screen.width, 640);

const storeList = [
  { title: "全部", code: "" },
  { title: "东莞仓", code: "00168" },
  { title: "厦门仓", code: "00600" },
  { title: "南昌仓", code: "00300" },
  { title: "长沙仓", code: "01500" },
  { title: "深圳生鲜仓", code: "00188" },
  { title: "横岗仓", code: "00189" },
  { title: "东南便利店仓", code: "00689" },
];

class LogisticsTurnover extends React.PureComponent<IProps, IState> {
  msgid: string;
  constructor(props: IProps) {
    super(props);
    const params = qs.parse(window.location.search);
    const { msgid } = params;
    this.msgid = msgid;
    this.state = {
      resetSelect: false,
      tabError: false,
      tabBarList: [],
      selectTabInfo: {},
      dataList: [],
      selectIndex: 0,
      dataInfo: {},
    };
  }

  // 获取tablist
  getTabList = (params: any) => {
    Toast.loading("加载中....");
    api
      .geTurnoverTabListInfo(params)
      .then((rs: any) => {
        Toast.hide();
        this.setState({
          tabError: false,
          tabBarList: rs,
          selectTabInfo: rs[0],
        });
        const payload = { ...params, msgType: rs[0].sort };
        this.getListInfoByTab(payload);
        this.getListInfoBySelectInfo(
          {
            msgid: this.msgid,
            msgType: rs[0].sort,
            storeCode: storeList[1].code,
          },
          false
        );
      })
      .catch(() => {
        Toast.hide();
        this.setState({ tabError: true });
      });
  };

  // 获取指定类型数据
  getListInfoByTab = (params: any) => {
    Toast.loading("加载中....");
    api
      .getTurnoverMainDataByTabs(params)
      .then((rs: any) => {
        Toast.hide();
        const list = getLogisticsInfoWithTab(rs);
        const dataInfo = { ...this.state.dataInfo };
        Object.assign(dataInfo, { all: list });
        this.setState({ dataInfo });
      })
      .catch(() => {
        Toast.hide();
      });
  };

  // 获取指定类型、仓库数据
  getListInfoBySelectInfo = (params: any, showToast = true) => {
    showToast && Toast.loading("加载中....");
    const { storeCode } = params;
    api
      .getTurnOverReportByStore(params)
      .then((rs: any) => {
        Toast.hide();
        const list = getLogisticsInfoWithStore(rs);
        const key = getDataKeyWithStoreCode(storeCode);
        const dataInfo = { ...this.state.dataInfo };
        Object.assign(dataInfo, { [key]: list });
        this.setState({ dataInfo });
      })
      .catch(() => {
        Toast.hide();
      });
  };

  // 点击tab
  onMenuChange = (item: any) => {
    this.resetScrollTop();
    this.setState({ resetSelect: true, selectTabInfo: item, selectIndex: 0 });
    this.getListInfoByTab({ msgid: this.msgid, msgType: item.sort });
  };

  // 点击仓库
  onStoreChange = (item: any, index: number) => {
    this.resetScrollTop();
    this.setState({ resetSelect: false, selectIndex: index });
    if (item.code === "") {
      // 全部
      this.getListInfoByTab({
        msgid: this.msgid,
        msgType: this.state.selectTabInfo.sort,
      });
    } else {
      // 非全部
      this.getListInfoBySelectInfo({
        msgid: this.msgid,
        msgType: this.state.selectTabInfo.sort,
        storeCode: item.code,
      });

      if (index !== storeList.length - 1) {
        // 下一页显示数据
        this.getListInfoBySelectInfo(
          {
            msgid: this.msgid,
            msgType: this.state.selectTabInfo.sort,
            storeCode: storeList[index + 1].code,
          },
          false
        );
      }
    }
  };

  // 还原
  resetScrollTop = () => {
    const all = document.getElementById("turnover-all");
    const dg = document.getElementById("turnover-dg");
    const xm = document.getElementById("turnover-xm");
    const cs = document.getElementById("turnover-cs");
    const nc = document.getElementById("turnover-nc");
    const sz = document.getElementById("turnover-sz");
    const hg = document.getElementById("turnover-hg");
    const dn = document.getElementById("turnover-dn");
    if (all) all.scrollTop = 0;
    if (dg) dg.scrollTop = 0;
    if (xm) xm.scrollTop = 0;
    if (cs) cs.scrollTop = 0;
    if (nc) nc.scrollTop = 0;
    if (sz) sz.scrollTop = 0;
    if (hg) hg.scrollTop = 0;
    if (dn) dn.scrollTop = 0;
  };

  // 页面切换
  onChangeIndex = (index: number, indexLatest: number) => {
    this.resetScrollTop();
    this.setState({ selectIndex: index });
    const storeInfo = storeList[index];
    if (storeInfo.code === "") {
      // 全部
      this.getListInfoByTab({
        msgid: this.msgid,
        msgType: this.state.selectTabInfo.sort,
      });
    } else {
      // 非全部

      // 当前显示页
      this.getListInfoBySelectInfo({
        msgid: this.msgid,
        msgType: this.state.selectTabInfo.sort,
        storeCode: storeInfo.code,
      });

      if (index !== storeList.length - 1) {
        // 下一页显示数据
        this.getListInfoBySelectInfo(
          {
            msgid: this.msgid,
            msgType: this.state.selectTabInfo.sort,
            storeCode: storeList[index + 1].code,
          },
          false
        );
      }
    }
  };

  // 加载完成
  componentDidMount() {
    document.title = "物流周转报表";
    // 获取tablist
    this.getTabList({ msgid: this.msgid });
  }

  // 渲染
  render() {
    const {
      tabBarList = [],
      dataList = [],
      tabError,
      selectIndex = 0,
      resetSelect = false,
      dataInfo: {
        all = [],
        dg = [],
        xm = [],
        nc = [],
        cs = [],
        sz = [],
        hg = [],
        dn = [],
      },
    } = this.state;
    return (
      <>
        {tabError ? (
          <EmptyView
            emptyType={EmptyType.emptyTypeNone}
            tipImage={require("assets/images/icon_nodata.png")}
          />
        ) : (
          <div
            className="logistics-turnover-container"
            style={{ width: maxWidth === 640 ? 640 : "100vw" }}
          >
            {tabBarList && tabBarList.length && (
              <div className="menu-container">
                <MenuView
                  id="menu"
                  labelKey="tabName"
                  menuList={tabBarList}
                  onSelectMenuChange={this.onMenuChange}
                />
                <MenuView
                  id="store"
                  menuList={storeList}
                  menuType={MenuType.menuTypeBroder}
                  resetSelect={resetSelect}
                  selectedIndex={selectIndex}
                  onSelectMenuChange={this.onStoreChange}
                />
              </div>
            )}

            <SwipeableViews
              index={selectIndex}
              onChangeIndex={this.onChangeIndex}
              disableLazyLoading
              enableMouseEvents
              style={{ overflowY: "hidden" }}
            >
              {/* 全部 */}
              <div className="table-container" id="turnover-all">
                {all.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 东莞 */}
              <div className="table-container" id="turnover-dg">
                {dg.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
              {/* 厦门 */}
              <div className="table-container" id="turnover-xm">
                {xm.map((item: any, index: number) => {
                  return (
                    <div style={{ marginBottom: "10px" }} key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
              {/* 南昌 */}
              <div className="table-container" id="turnover-nc">
                {nc.map((item: any, index: number) => {
                  return (
                    <div style={{ marginBottom: "10px" }} key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
              {/* 长沙 */}
              <div className="table-container" id="turnover-cs">
                {cs.map((item: any, index: number) => {
                  return (
                    <div style={{ marginBottom: "10px" }} key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
              {/* 深圳 */}
              <div className="table-container" id="turnover-sz">
                {sz.map((item: any, index: number) => {
                  return (
                    <div style={{ marginBottom: "10px" }} key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
              {/* 横岗 */}
              <div className="table-container" id="turnover-hg">
                {hg.map((item: any, index: number) => {
                  return (
                    <div style={{ marginBottom: "10px" }} key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
              {/* 东南 */}
              <div className="table-container" id="turnover-dn">
                {dn.map((item: any, index: number) => {
                  return (
                    <div style={{ marginBottom: "10px" }} key={index}>
                      <TableView
                        columns={item.columns}
                        dataList={item.itemList}
                      />
                    </div>
                  );
                })}
              </div>
            </SwipeableViews>
          </div>
        )}
      </>
    );
  }
}

export default LogisticsTurnover;
