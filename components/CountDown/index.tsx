import './style.scss';
import React, { useLayoutEffect, useMemo } from 'react';
import { dashboard, bitable, DashboardState, IConfig } from "@lark-base-open/js-sdk";
import { Button, DatePicker, ConfigProvider, Checkbox, Row, Col, Input, Switch } from '@douyinfe/semi-ui';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTime } from './utils';
import { useConfig } from '../../hooks';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next/typescript/t';
import YearProgressWidget from '../Progress';

/** 符合convertTimestamp的日期格式 */

interface ICountDownConfig {
  color: string;
  /** 毫秒级时间戳 */
  target: number;
  units: string[];
  othersConfig: string[],
  title: string,
  showTitle: boolean,
}

const defaultOthersConfig = ['showTitle']


const getAvailableUnits: (t: TFunction<"translation", undefined>) => { [p: string]: { title: string, unit: number, order: number } } = (t) => {
  return {
    sec: {
      title: t('second'),
      unit: 1,
      order: 1,
    },
    min: {
      title: t('minute'),
      unit: 60,
      order: 2,
    },
    hour: {
      title: t('hour'),
      unit: 60 * 60,
      order: 3,
    },
    day: {
      title: t('day'),
      unit: 60 * 60 * 24,
      order: 4,
    },
    week: {
      title: t('week'),
      unit: 60 * 60 * 24 * 7,
      order: 5,
    },
    month: {
      title: t('month'),
      unit: 60 * 60 * 24 * 30,
      order: 6,
    },
  }

}

const defaultUnits = ['sec', 'min', 'hour', 'day']

/** 倒计时 */
export default function CountDown(props: { bgColor: string }) {

  const { t, i18n } = useTranslation();

  // create时的默认配置
  const [config, setConfig] = useState<ICountDownConfig>({
    target: new Date().getTime(),
    color: 'var(--ccm-chart-N700)',
    units: defaultUnits,
    title: t('target.remain'),
    showTitle: false,
    othersConfig: defaultOthersConfig
  })

  const availableUnits = useMemo(() => getAvailableUnits(t), [i18n.language]);

  const isCreate = dashboard.state === DashboardState.Create

  useEffect(() => {
    if (isCreate) {
      setConfig({
        target: new Date().getTime(),
        color: 'var(--ccm-chart-N700)',
        units: defaultUnits,
        title: t('target.remain'),
        showTitle: false,
        othersConfig: defaultOthersConfig
      })
    }
  }, [i18n.language, isCreate])

  /** 是否配置/创建模式下 */
  const isConfig = dashboard.state === DashboardState.Config || isCreate;

  const timer = useRef<any>()

  /** 配置用户配置 */
  const updateConfig = (res: IConfig) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    const { customConfig } = res;
    if (customConfig) {
      setConfig(customConfig as any);
      timer.current = setTimeout(() => {
        //自动化发送截图。 预留3s给浏览器进行渲染，3s后告知服务端可以进行截图了（对域名进行了拦截，此功能仅上架部署后可用）。
        dashboard.setRendered();
      }, 3000);
    }

  }

  useConfig(updateConfig)

  return (
      <>
      <YearProgressWidget />
      {
        isConfig && <ConfigPanel t={t} config={config} setConfig={setConfig} availableUnits={availableUnits} />
      }
      </>
  )
}


interface ICountdownView {
  config: ICountDownConfig,
  isConfig: boolean,
  t: TFunction<"translation", undefined>,
  availableUnits: ReturnType<typeof getAvailableUnits>
}
/** 格式化显示时间 */
function convertTimestamp(timestamp: number) {
  return dayjs(timestamp / 1000).format('YYYY-MM-DD HH:mm:ss')
}


function ConfigPanel(props: {
  config: ICountDownConfig,
  setConfig: React.Dispatch<React.SetStateAction<ICountDownConfig>>,
  availableUnits: ReturnType<typeof getAvailableUnits>,
  t: TFunction<"translation", undefined>,
}) {
  const { config, setConfig, availableUnits, t } = props;

  /**保存配置 */
  const onSaveConfig = () => {
    dashboard.saveConfig({
      customConfig: config,
      dataConditions: [],
    } as any)
  }

  return (
    <div className='config-panel'>
      <Button
        className='btn'
        theme='solid'
        onClick={onSaveConfig}
      >
        {t('confirm')}
      </Button>
    </div>
  )
}