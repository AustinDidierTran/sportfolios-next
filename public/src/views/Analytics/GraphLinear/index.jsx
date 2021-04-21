import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import styles from './Graph.module.css';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import loadable from '@loadable/component';

const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = loadable(() =>
  import('recharts')
);

export default function GraphLinear(props) {
  const { graphData, title, dateGraph, onChangeDate, formatData = (x) => x, height = 500 } = props;
  const { minDate = '2019-01-01', lines, data } = graphData;

  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(false);
  const [value, setValue] = useState(false);
  const percentage = useMemo(() => {
    if (!initialValue || isNaN(initialValue) || !value || isNaN(value)) {
      return 0;
    }
    return (((value - initialValue) / initialValue) * 100).toFixed(2);
  }, [initialValue, value]);

  useEffect(() => {
    if (!data.length) {
      setValue(0);
      setInitialValue(0);
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
  };
  return (
    <div className={styles.root}>
      <div className={styles.displayFlex}>
        <Typography className={styles.title} variant="h5">
          <div style={{ fontSize: 18 }}>{title}</div>
          {data.length > 0 && (
            <div style={{ minHeight: 53.75 }}>
              <div>
                {formatData(value)} {value > 1 ? t(lines[0]?.name) : t(lines[0]?.nameSingular)}
              </div>
              {value - initialValue !== 0 && (
                <div style={{ color: value - initialValue > 0 ? 'green' : 'red', fontSize: 18 }}>
                  {value - initialValue > 0 ? '+' : ''}
                  {formatData(value - initialValue)}{' '}
                  {value - initialValue > 1 ? t(lines[0]?.name) : t(lines[0]?.nameSingular)} ({percentage} %)
                </div>
              )}
            </div>
          )}
        </Typography>
        <TextField
          className={styles.textDate}
          type="date"
          defaultValue={dateGraph}
          onChange={onChangeDate}
          InputProps={{
            inputProps: { max: moment(new Date()).format('yyyy-MM-DD'), min: moment(minDate).format('yyyy-MM-DD') },
          }}
        />
      </div>
      {data.length > 0 && (
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
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
                <Line
                  key={l.dataKey}
                  name={t(l.name)}
                  dataKey={l.dataKey}
                  strokeWidth={l.strokeWidth}
                  stroke={l.stroke}
                  dot={l.dot}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {!data.length && <div>{t('choose.choose_later_date')}</div>}
    </div>
  );
}
