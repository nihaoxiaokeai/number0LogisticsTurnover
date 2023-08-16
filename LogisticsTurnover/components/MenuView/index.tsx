import * as React from "react";
import "./index.scss";

export enum MenuType {
  menuTypeNone = 0,
  menuTypeBroder = 1,
}

interface IProps {
  id: string;
  menuType?: MenuType;
  menuList: object[] | any;
  resetSelect?: boolean;
  valueKey?: string;
  labelKey?: string;
  selectedIndex?: number;
  onSelectMenuChange?: (item: any, index?: number) => void;
}

const { useState, useCallback } = React;

const MenuView = React.memo(
  React.forwardRef((props: IProps) => {
    //   props
    const {
      menuList = [],
      onSelectMenuChange,
      resetSelect,
      id = "menu-content",
      menuType = MenuType.menuTypeNone,
      labelKey = "title",
      selectedIndex = -1,
    } = props;

    //   state
    const [selectIndex, setSelectIndex] = useState(0);

    React.useEffect(() => {
      scrollToPostion();
      resetSelect && setSelectIndex(0);
    }, [resetSelect, selectIndex]);

    React.useEffect(() => {
      selectedIndex !== -1 && setSelectIndex(selectedIndex);
    }, [selectedIndex]);

    //   滑动事件
    const scrollToPostion = () => {
      let menuContent = document.getElementById(id);
      if (menuContent) {
        let offsetX = 0;
        for (let index = 0; index < selectIndex; index++) {
          const element = document.getElementById(`${id}-${index}`);
          const offsetWidth = element.offsetWidth;
          offsetX += offsetWidth;
        }
        let offsetLeft = 0;
        const offset = offsetX + 10 * selectIndex;
        const fixWidth = menuContent.getBoundingClientRect().width / 2;
        if (selectIndex > 0 && offset > fixWidth) {
          offsetLeft = offset - fixWidth;
        }

        menuContent.scrollLeft = offsetLeft;
        // menuContent.style.webkitTransform = `translate3d(${-offsetLeft}px, 0, 0)`;
      }
    };

    //   点击事件
    const onClickMenu = useCallback(
      (item: any, index: number) => {
        // console.log("----->", item, index, selectIndex);
        if (index !== selectIndex) {
          setSelectIndex(index);
          if (onSelectMenuChange) onSelectMenuChange(item, index);
        }
      },
      [selectIndex]
    );

    return (
      <div className="menu-content" id={id}>
        {menuList.map((item: any, index: number) => {
          const isSelect = index === selectIndex;
          let textColor = "#323232";
          if (menuType === MenuType.menuTypeBroder || isSelect) {
            textColor = "#68a9ff";
          }

          return (
            <div key={index} className="text-content">
              {/* name */}
              <div
                id={`${id}-${index}`}
                className={`${"span-text"} ${
                  menuType === MenuType.menuTypeBroder && isSelect
                    ? "active-border-text"
                    : "normal-border-text"
                }`}
                style={{
                  color: textColor,
                  fontWeight: isSelect ? "bold" : "normal",
                }}
                onClick={() => {
                  onClickMenu(item, index);
                }}
              >
                {item[labelKey]}
              </div>
              {/* 下划线 */}
              {menuType === MenuType.menuTypeNone && (
                <div className={isSelect ? "active" : "normal"} />
              )}
            </div>
          );
        })}
      </div>
    );
  })
);

export default MenuView;
