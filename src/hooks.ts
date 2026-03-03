import React from "react";
import { useLayoutEffect, useState } from "react";

// 尝试导入飞书SDK，如果失败则使用空对象
let dashboard: any = {};
let DashboardState: any = {};

try {
  const sdk = require("@lark-base-open/js-sdk");
  dashboard = sdk.dashboard || {};
  DashboardState = sdk.DashboardState || {};
} catch (e) {
  console.log('飞书SDK未加载，使用默认值');
  // 模拟飞书环境状态
  dashboard = {
    getTheme: () => Promise.resolve({ chartBgColor: '#ffffff', theme: 'light' }),
    onThemeChange: () => () => {}
  };
  DashboardState = {
    Create: 'create'
  };
}

function updateTheme(theme: string) {
  document.body.setAttribute('theme-mode', theme);
}

/** 跟随主题色变化 */
export function useTheme() {
  const [bgColor, setBgColor] = useState('#ffffff');
  useLayoutEffect(() => {
    dashboard.getTheme().then((res) => {
      setBgColor(res.chartBgColor);
      updateTheme(res.theme.toLocaleLowerCase());
    })

    dashboard.onThemeChange((res) => {
      setBgColor(res.data.chartBgColor);
      updateTheme(res.data.theme.toLocaleLowerCase());
    })
  }, [])
  return {
    bgColor,
  }
}

/** 初始化、更新config */
export function useConfig(updateConfig: (data: any) => void) {

  const isCreate = dashboard.state === DashboardState.Create
  React.useEffect(() => {
    if (isCreate) {
      return
    }
    // 初始化获取配置
    dashboard.getConfig().then(updateConfig);
  }, []);


  React.useEffect(() => {
    const offConfigChange = dashboard.onConfigChange((r) => {
      // 监听配置变化，协同修改配置
      updateConfig(r.data);
    });
    return () => {
      offConfigChange();
    }
  }, []);
}