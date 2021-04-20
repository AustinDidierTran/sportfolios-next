import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Typography from '@material-ui/core/Typography';
import styles from './Graph.module.css';
import 'react-vis/dist/style.css';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
export default function GraphLinear(props) {
  const { graphData, title, dateGraph, onChangeDate, formatData = (x) => (x), height = 500 } = props;
  const { minDate = '2000-01-01', lines, data } = graphData;

  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(false);
  const [value, setValue] = useState(false);
  const percentage = useMemo(() => {
    if (!initialValue || isNaN(initialValue) || !value || isNaN(value)) {
      return 0;
    }
    return (value - initialValue) / initialValue;
  }, [initialValue, value])

  useEffect(() => {
    if (!data.length) {
      return;
    }
    setInitialValue(data[0][lines[0]?.dataKey]);
    setValue(data[data.length - 1][lines[0]?.dataKey]);
  }, [data]);

  const formatter = (value, name, props) => {
    if (props.dataKey === lines[0]?.dataKey) {
      setValue(value);
    }
    return [formatData(value), name];
  }
  return (
    <div className={styles.root}>
      <div className={styles.displayFlex}>
        <Typography className={styles.title} variant="h5">
          <div style={{ fontSize: 18 }}>
            {title}
          </div>
          <div>
            {formatData(value)} {t(lines[0]?.name)}
          </div>
          {percentage !== 0 && (
            <div style={{ color: percentage > 0 ? 'green' : 'red', fontSize: 18 }}>
              {percentage > 0 ? '+' : ''}{formatData(value - initialValue)} {t(lines[0]?.name)} ({percentage * 100} %)
            </div>
          )}
        </Typography>
        <TextField
          className={styles.textDate}
          type="date"
          defaultValue={dateGraph}
          onChange={onChangeDate}
          InputProps={{ inputProps: { max: moment(new Date()).format('yyyy-MM-DD'), min: moment(minDate).format('yyyy-MM-DD') } }}
        />
      </div>

      <div
        style={{ height: `${height}px` }}
      >
        <ResponsiveContainer width="100%" height="100%" >
          <LineChart
            data={data}

            onMouseLeave={() => {
              if (!data.length) {
                return;
              }
              setValue(data[data.length - 1][lines[0]?.dataKey]);
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width={28} />
            <Tooltip formatter={formatter} />
            <Legend />
            {lines.map((l) => (
              <Line key={l.dataKey} name={t(l.name)} dataKey={l.dataKey} strokeWidth={l.strokeWidth} stroke={l.stroke} dot={l.dot} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
