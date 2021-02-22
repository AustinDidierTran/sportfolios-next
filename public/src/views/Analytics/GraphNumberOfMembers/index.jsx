import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { XAxis, YAxis, VerticalGridLines, HorizontalGridLines, XYPlot, VerticalBarSeries } from 'react-vis';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import data from './MockData.json';
import styles from './GraphNumberOfMembers.module.css';
import { MONTH_NAMES, MONTH_NAMES_SHORT } from '../../../../common/enums';
export default function GraphNumberOfMembers() {
  const { t } = useTranslation();
  const [value, setValue] = useState({ x: 12, y: 1 });
  const { oldMembers, newMembers } = data;

  const onMouseOver = (value) => {
    setValue(value);
  };

  const totalMember = useMemo(() => `${oldMembers[value.x - 1].y + newMembers[value.x - 1].y} `, [value]);
  const newMember = useMemo(() => `${newMembers[value.x - 1].y} `, [value]);
  const month = useMemo(() => MONTH_NAMES[value.x - 1], [value]);

  return (
    <div>
      <Typography className={styles.title} variant="h5">
        {t('member.members_in', { time: '2020' })}
      </Typography>
      <div className={styles.legend}>
        <Typography className={styles.subTitle} color="textSecondary" variant="h6">
          {t(`months.${month}`)}
        </Typography>
        <div className={styles.text}>
          <IconButton className={styles.iconButtonMain} size="medium"></IconButton>
          <Typography variant="h7">{`${t('new_members')}: ${newMember}`}</Typography>
        </div>
        <div className={styles.text}>
          <IconButton className={styles.iconButtonDark}></IconButton>
          <Typography variant="h7">{`${t('total_members')}: ${totalMember}`}</Typography>
        </div>
      </div>
      <XYPlot margin={{ left: 100, right: 50, bottom: 50 }} width={700} height={500} stackBy="y">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          tickFormat={(value) => t(`months.${MONTH_NAMES_SHORT[value - 1]}`)}
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
