import React from 'react';
import { Progress, Typography } from 'antd';

const { Text, Title } = Typography;

// 计算当前是本月第几周
const getCurrentWeekOfMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const week = Math.ceil((date + firstDayOfMonth) / 7);
  return { month: month + 1, week, year, day: date };
};

// 计算年进度
const getYearProgress = () => {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();
  return ((now - start) / (end - start)) * 100;
};

const SalesReportHeader: React.FC = () => {
  const { month, week, year, day } = getCurrentWeekOfMonth();
  const percent = getYearProgress();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      margin: 0,
      padding: '14px 18px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#fff',
    }}>
      {/* 第一行：日期 + 右侧红色标语 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 14,
      }}>
        <Text>{year}/{month}/{day}</Text>
        <Text style={{ color: '#ff4d4f', fontStyle: 'italic' }}>
          密切关注目标并取得更好的结果！
        </Text>
      </div>

      {/* 第二行：大标题 */}
      <Title
        level={4}
        style={{
          margin: '8px 0 12px 0',
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {month}月第{week}周销售周报
      </Title>

      {/* 第三行：时间进度 + 进度条 */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
        marginTop: 'auto',
      }}>
        <Text style={{ fontSize: 14, color: '#666' }}>时间进度</Text>
        <div style={{ width: 130 }}>
          <Progress
            percent={Math.min(parseFloat(percent.toFixed(1)), 100)}
            strokeColor="#165DFF"
            size="small"
            showInfo={false}
          />
        </div>
        <Text style={{ fontSize: 14, fontWeight: 500 }}>
          {percent.toFixed(1)}%
        </Text>
      </div>
    </div>
  );
};

export default SalesReportHeader;