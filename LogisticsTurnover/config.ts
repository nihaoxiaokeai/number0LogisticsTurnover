function getLogisticsInfoWithTab(rs: any) {
  if (!rs) {
    return [];
  }

  // 列表内容
  const list = rs.turnoverResDTOS || [];
  const dataList = [];
  list.map((item: any, index: number) => {
    const itemList = getLogisticsInfoWithStore(item);
    dataList.push(itemList[0]);
  });

  return dataList;
}

function getLogisticsInfoWithStore(rs: any) {
  if (!rs) {
    return [];
  }

  // columns
  const storeInfo = rs.fOutOrderStoreResDTO || {};
  const maxWithd = Math.min(window.screen.width, 640);
  const columns = [
    {
      title: storeInfo.storeName,
      width: maxWithd * 0.3,
      key: "name",
      flag: true,
    },
    { title: "本期", width: maxWithd * 0.3, key: "data1" },
    { title: "环比", width: maxWithd * 0.2, key: "data2" },
    { title: "同比", width: maxWithd * 0.2, key: "data3" },
  ];

  // 列表内容
  const list = rs.turnoverDtlResDTOS || [];
  const dataList = [];
  list.map((item: any) => {
    const { rspCode, turnoverSendMsgs = [], rspName } = item;
    if (rspCode === "1" || rspCode === "20") {
      // 库存管理部项、采购部
      turnoverSendMsgs.map((subItem: any) => {
        const { deptType } = subItem;
        const info = {
          ...subItem,
          type: deptType === "ALL" ? "yellow" : "normal",
          name: deptType === "ALL" ? rspName : deptType,
        };
        dataList.push(info);
      });
    } else {
      // 其它项
      turnoverSendMsgs.map((info: any) => {
        Object.assign(info, { type: "normal", name: info.deptType });
        dataList.push(info);
      });
    }
  });

  // 总计
  const totalMsg = rs.totalMsg;
  if (totalMsg) {
    dataList.push({ ...totalMsg, type: "total", name: "合计" });
  }

  return [{ columns, itemList: dataList }];
}

function getDataKeyWithStoreCode(code: string) {
  switch (code) {
    case "00168":
      return "dg";
      break;
    case "00600":
      return "xm";
      break;
    case "00300":
      return "nc";
      break;
    case "01500":
      return "cs";
      break;
    case "00188":
      return "sz";
      break;
    case "00189":
      return "hg";
      break;
    case "00689":
      return "dn";
      break;

    default:
      return "all";
      break;
  }
}

export {
  getLogisticsInfoWithTab,
  getLogisticsInfoWithStore,
  getDataKeyWithStoreCode,
};
