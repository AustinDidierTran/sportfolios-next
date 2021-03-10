import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  XYPlot,
  VerticalBarSeries,
  makeWidthFlexible,
} from 'react-vis';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import styles from './GraphNumberOfMembers.module.css';
export default function GraphNumberOfMembers(props) {
  const { graphData, title, totalTitle, newTitle } = props;
  const { shortLabel, longLabel, total: totalStats, new: newStats } = graphData;

  const { t } = useTranslation();
  const [value, setValue] = useState({ x: totalStats.length, y: 1 });

  const onMouseOver = (value) => {
    setValue(value);
  };
  const FlexibleXYPlot = makeWidthFlexible(XYPlot);

  const totalStatsInfo = useMemo(() => totalStats[value.x - 1].y, [value]);
  const newStatsInfo = useMemo(() => newStats[value.x - 1].y, [value]);
  const longLabelInfo = useMemo(() => longLabel[value.x - 1], [value]);

  return (
    <div className={styles.root}>
      <Typography className={styles.title} variant="h5">
        {title}
      </Typography>
      <div className={styles.legend}>
        <Typography className={styles.subTitle} color="textSecondary" variant="h6">
          {longLabelInfo}
        </Typography>
        <div className={styles.text}>
          <IconButton className={styles.iconButtonMain} size="medium"></IconButton>
          <Typography>{`${t(newTitle)}: ${newStatsInfo}`}</Typography>
        </div>
        <div className={styles.text}>
          <IconButton className={styles.iconButtonDark}></IconButton>
          <Typography>{`${t(totalTitle)}: ${totalStatsInfo}`}</Typography>
        </div>
      </div>
      <FlexibleXYPlot margin={{ bottom: 75 }} height={500} stackBy="y">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickValues={totalStats.map((o, i) => i + 1)}
          tickFormat={(value) => shortLabel[value - 1]}
          tickLabelAngle={45}
          tickPadding={44}
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
        <VerticalBarSeries color="#008a6c" barWidth={0.75} onValueMouseOver={onMouseOver} data={totalStats} />
        <VerticalBarSeries color="#18B393" barWidth={0.75} onValueMouseOver={onMouseOver} data={newStats} />
      </FlexibleXYPlot>
    </div>
  );
}
