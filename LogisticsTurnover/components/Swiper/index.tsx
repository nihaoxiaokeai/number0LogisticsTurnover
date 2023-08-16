import * as React from "react";

import "./index.scss";

interface IProps {}

// 记录当前页面位置
let currentPosition: number = 0;
// 记录当前点的位置
let currentPoint: number = -1;
// 当前页码
let pageNow: number = 0;
// 页码数
let points: any = [{}, {}, {}, {}, {}];
// 防止与ios滑动冲突
let isBorder: boolean = false;

class SwiperPage extends React.PureComponent {
  constructor(props: IProps) {
    super(props);
  }

  // 页面平移
  onTransform = (translate: any) => {
    let newTranslate = translate;
    const viewport = document.getElementById("viewport");
    if (viewport) {
      viewport.style.webkitTransform =
        "translate3d(" + newTranslate + "px, 0, 0)";
      currentPosition = newTranslate;
    }
  };

  // 设置当前页码
  onCurrentPage = () => {
    if (currentPoint !== -1) {
      //   points[currentPoint].className = "";
    }

    currentPoint = pageNow - 1;
    // points[currentPoint].className = "now";
  };

  // 触摸事件
  onTouchEvent = () => {
    const viewport = document.getElementById("viewport");
    let pageWidth = window.innerWidth; // 页面宽度
    let maxWidth = -pageWidth * (points.length - 1); // 页面滑动最后一页的位置
    let startX: any;
    let startY: any;
    let deltaY: number = 0;
    let initialPos = 0; // 手指按下的屏幕位置
    let moveLength = 0; // 手指当前滑动的距离
    let direction: String = "left"; // 滑动的方向
    let isMove = false; // 是否发生左右滑动
    let startT = 0; // 记录手指按下去的时间
    let isTouchEnd = true; // 标记当前滑动是否结束(手指已离开屏幕)
    if (viewport) {
      // 开始
      viewport.addEventListener(
        "touchstart",
        function (e: any) {
          e.preventDefault();
          // 单手指触摸或者多手指同时触摸，禁止第二个手指延迟操作事件
          if (e.touches.length === 1 || isTouchEnd) {
            const touch = e.touches[0];
            startX = touch.pageX;
            isBorder = startX <= 20;
            startY = touch.pageY;
            initialPos = currentPosition; // 本次滑动前的初始位置
            viewport.style.webkitTransition = ""; // 取消动画效果
            startT = +new Date(); // 记录手指按下的开始时间
            isMove = false; // 是否产生滑动
            isTouchEnd = false; // 当前滑动开始
          }
        }.bind(this),
        false
      );

      // 移动
      viewport.addEventListener(
        "touchmove",
        function (e: any) {
          e.preventDefault();

          // 如果当前滑动已结束，不管其他手指是否在屏幕上都禁止该事件
          if (isTouchEnd || isBorder) return;

          const touch = e.touches[0];
          let deltaX = touch.pageX - startX;
          deltaY = touch.pageY - startY;
          if (deltaY <= 50 && deltaY > 0) {
            // 左右滑动
            let translate = initialPos + deltaX; // 当前需要移动到的位置
            // 如果translate>0 或 < maxWidth,则表示页面超出边界
            if (translate > 0) {
              translate = 0;
            }
            if (translate < maxWidth) {
              translate = maxWidth;
            }
            if (translate - initialPos < 0 && initialPos === 0) {
              translate === 0;
            }
            deltaX = translate - initialPos;

            this.onTransform(translate);
            isMove = true;
            moveLength = deltaX;
            direction = deltaX > 0 ? "right" : "left"; // 判断手指滑动的方向
          }
        }.bind(this),
        false
      );

      // 结束
      viewport.addEventListener(
        "touchend",
        function (e: any) {
          e.preventDefault();
          let translate = 0;
          // 计算手指在屏幕上停留的时间
          const deltaT = +new Date() - startT;

          // 发生了滑动，并且当前滑动事件未结束
          if (isMove && !isTouchEnd && !isBorder) {
            isTouchEnd = true; // 标记当前完整的滑动事件已经结束
            // 使用动画过渡让页面滑动到最终的位置
            viewport.style.webkitTransition = "0.3s ease -webkit-transform";
            if (deltaT < 300) {
              // 如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
              if (currentPosition === 0 && translate === 0) {
                return;
              }
              translate =
                direction === "left"
                  ? currentPosition - (pageWidth + moveLength)
                  : currentPosition + pageWidth - moveLength;
              // 如果最终位置超过边界位置，则停留在边界位置
              // 左边界
              translate = translate > 0 ? 0 : translate;
              // 右边界
              translate = translate < maxWidth ? maxWidth : translate;
            } else {
              // 如果滑动距离小于屏幕的50%，则退回到上一页
              if (Math.abs(moveLength) / pageWidth < 0.5) {
                translate = currentPosition - moveLength;
              } else {
                // 如果滑动距离大于屏幕的50%，则滑动到下一页
                translate =
                  direction === "left"
                    ? currentPosition - (pageWidth + moveLength)
                    : currentPosition + pageWidth - moveLength;
                translate = translate > 0 ? 0 : translate;
                translate = translate < maxWidth ? maxWidth : translate;
              }
            }

            // 执行滑动，让页面完整的显示到屏幕上
            this.onTransform(translate);
          }
        }.bind(this),
        false
      );
    }
  };

  // 加载完成
  componentDidMount() {
    // points = document.querySelectorAll(".pagenumber div");
    this.onTouchEvent();
    this.onCurrentPage();
  }

  // 渲染
  render() {
    return (
      <div className="container">
        <div id="viewport" className="logistics-turnover-root">
          <div className="page-view" style={{ background: "#3b76c0" }}>
            <h3>页面-1</h3>
          </div>
          <div className="page-view" style={{ background: "#58c03b" }}>
            <h3>页面-2</h3>
          </div>
          <div className="page-view" style={{ background: "#c03b25" }}>
            <h3>页面-3</h3>
          </div>
          <div className="page-view" style={{ background: "#e0a718" }}>
            <h3>页面-4</h3>
          </div>
          <div className="page-view" style={{ background: "#c03eac" }}>
            <h3>页面-5</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default SwiperPage;
