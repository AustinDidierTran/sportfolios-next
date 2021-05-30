import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import styles from '../Graph.module.css';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TwoLinesGraph(props) {
  const { graphData, title, dateGraph, onChangeDate, formatData = (x) => x, height = 500, isMoney } = props;
  const { minDate = '2019-01-01', lines, data } = graphData;

  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(false);
  const [value, setValue] = useState(false);
  const [secondInitialValue, setSecondInitialValue] = useState(false);
  const [secondValue, setSecondValue] = useState(false);
  const percentage = useMemo(() => {
    if (!initialValue || isNaN(initialValue) || !value || isNaN(value)) {
      return 0;
    }
    return (((value - initialValue) / initialValue) * 100).toFixed(2);
  }, [initialValue, value]);
  const secondPercentage = useMemo(() => {
    if (!secondInitialValue || isNaN(secondInitialValue) || !secondValue || isNaN(secondValue)) {
      return 0;
    }
    return (((secondValue - secondInitialValue) / secondInitialValue) * 100).toFixed(2);
  }, [secondInitialValue, secondValue]);

  useEffect(() => {
    if (!data.length) {
      setValue(0);
      setInitialValue(0);
      setSecondValue(0);
      setSecondInitialValue(0);
      return;
    }
    setInitialValue((data[0][lines[0]?.dataKey]).toFixed(2));
    setValue((data[data.length - 1][lines[0]?.dataKey]).toFixed(2));

    setSecondInitialValue((data[0][lines[1]?.dataKey]).toFixed(2));
    setSecondValue((data[data.length - 1][lines[1]?.dataKey]).toFixed(2));
  }, [data]);

  const formatter = (value, name, props) => {
    if (props.dataKey === lines[0]?.dataKey) {
      setValue(value.toFixed(2));
    }
    if (props.dataKey === lines[1]?.dataKey) {
      setSecondValue(value.toFixed(2));
    }
    if (isMoney) {
      return [formatData(value) + '$', name];
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
                {formatData(value)}
                {isMoney ? '$' : ''} {value > 1 ? t(lines[0]?.name) : t(lines[0]?.nameSingular)}
              </div>
              <div style={{ color: value - initialValue >= 0 ? 'green' : 'red', fontSize: 18 }}>
                {value - initialValue >= 0 ? '+' : ''}
                {formatData(value - initialValue)}
                {isMoney ? '$' : ''} {value - initialValue > 1 ? t(lines[0]?.name) : t(lines[0]?.nameSingular)} (
                {percentage} %)
              </div>
              <div>
                {formatData(secondValue)}
                {isMoney ? '$' : ''} {secondValue > 1 ? t(lines[1]?.name) : t(lines[1]?.nameSingular)}
              </div>
              <div style={{ color: secondValue - secondInitialValue >= 0 ? 'green' : 'red', fontSize: 18 }}>
                {secondValue - secondInitialValue >= 0 ? '+' : ''}
                {formatData(secondValue - secondInitialValue)}
                {isMoney ? '$' : ''}{' '}
                {secondValue - secondInitialValue > 1 ? t(lines[1]?.name) : t(lines[1]?.nameSingular)} (
                {secondPercentage} %)
              </div>
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
                setValue((data[data.length - 1][lines[0]?.dataKey]).toFixed(2));
                setSecondValue((data[data.length - 1][lines[1]?.dataKey]).toFixed(2));
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
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
