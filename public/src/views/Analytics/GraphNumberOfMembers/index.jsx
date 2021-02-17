import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { XAxis, YAxis, VerticalGridLines, HorizontalGridLines, XYPlot, VerticalBarSeries } from 'react-vis';
import { Typography } from '@material-ui/core';
import styles from './GraphNumberOfMembers.module.css';

const oldMembers = [
  { x: 1, y: 200 },
  { x: 2, y: 301 },
  { x: 3, y: 326 },
  { x: 4, y: 339 },
  { x: 5, y: 351 },
  { x: 6, y: 365 },
  { x: 7, y: 397 },
  { x: 8, y: 402 },
  { x: 9, y: 412 },
  { x: 10, y: 434 },
  { x: 11, y: 445 },
  { x: 12, y: 475 },
];
const newMembers = [
  { x: 1, y: 101 },
  { x: 2, y: 25 },
  { x: 3, y: 13 },
  { x: 4, y: 12 },
  { x: 5, y: 14 },
  { x: 6, y: 32 },
  { x: 7, y: 5 },
  { x: 8, y: 10 },
  { x: 9, y: 22 },
  { x: 10, y: 24 },
  { x: 11, y: 11 },
  { x: 12, y: 30 },
];

export default function GraphNumberOfMembers() {
  const { t } = useTranslation();
  const router = useRouter();
  const [value, setValue] = useState({ x: 12, y: 1 });

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec'];
  const fullMonths = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july_long',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const onMouseOver = (value) => {
    setValue(value);
  };
  const totalMember = useMemo(() => `${oldMembers[value.x - 1].y + newMembers[value.x - 1].y} `, [value]);
  const newMember = useMemo(() => `${newMembers[value.x - 1].y} `, [value]);
  const month = useMemo(() => fullMonths[value.x - 1], [value]);

  return (
    <div>
      <Typography style={{ marginBottom: '8px', marginTop: '16px' }} variant="h5">
        {t('members_in', { year: '2020' })}
      </Typography>
      <div className={styles.legend}>
        <Typography style={{ margin: '8px' }} color="textSecondary" variant="h6">
          {t(`Months.${month}`)}
        </Typography>
        <Typography variant="h7">{`${t('new_members')}: ${newMember}`}</Typography>
        <Typography variant="h7">{`${t('total_members')}: ${totalMember}`}</Typography>
      </div>
      <XYPlot margin={{ left: 100, right: 50, bottom: 50 }} width={700} height={500} stackBy="y" style={{}}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          tickFormat={(value) => {
            return t(`Months.${months[value - 1]}`);
          }}
          style={{
            line: { stroke: '#ADDDE1' },
            ticks: { stroke: '#ADDDE1' },
            text: { stroke: 'none', fill: '#6b6b76', fontWeight: 600 },
          }}
        />
        <YAxis
          style={{
            line: { stroke: '#ADDDE1' },
            ticks: { stroke: '#ADDDE1' },
            text: { stroke: 'none', fill: '#6b6b76', fontWeight: 600 },
          }}
        />
        <VerticalBarSeries color="#008a6c" barWidth={0.75} onValueMouseOver={onMouseOver} data={oldMembers} />
        <VerticalBarSeries color="#18B393" barWidth={0.75} onValueMouseOver={onMouseOver} data={newMembers} />
      </XYPlot>
    </div>
  );
}
