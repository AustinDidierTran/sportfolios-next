import React, { useState } from 'react';

import CustomButton from '../Button';
import CustomPaper from '../Paper';
import IgContainer from '../IgContainer';
import LoadingSpinner from '../LoadingSpinner';
import Typography from '@material-ui/core/Typography';

import styles from './MessageAndButtons.module.css';
import { LOGO_ENUM } from '../../../../common/enums';

export default function MessageAndButtons(props) {
  const { buttons, message, withoutIgContainer } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (button) => {
    setIsLoading(true);
    button.onClick();
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (withoutIgContainer) {
    return (
      <CustomPaper style={{ textAlign: 'center', height: '100%' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO_256X256} />
        </div>
        <Typography style={{ paddingBottom: '16px' }}>{message}</Typography>
        <div className={styles.buttons}>
          {buttons.map((button, index) => (
            <CustomButton
              href={button.href || ''}
              size="small"
              variant="contained"
              endIcon={button.endIcon}
              style={{
                marginBottom: '16px',
              }}
              onClick={() => {
                handleClick(button);
              }}
              color={button.color}
              className={styles.button}
              key={index}
            >
              {button.name}
            </CustomButton>
          ))}
        </div>
      </CustomPaper>
    );
  }

  return (
    <IgContainer>
      <CustomPaper style={{ textAlign: 'center', height: '100%' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO_256X256} />
        </div>
        <Typography className={styles.content}>{message}</Typography>
        <div className={styles.content}>{props.children}</div>
        <div className={styles.buttons}>
          {buttons.map((button, index) => (
            <CustomButton
              href={button.href || ''}
              size="small"
              variant="contained"
              endIcon={button.endIcon}
              style={{
                marginBottom: '16px',
              }}
              onClick={() => {
                handleClick(button);
              }}
              color={button.color}
              className={styles.button}
              key={index}
            >
              {button.name}
            </CustomButton>
          ))}
        </div>
      </CustomPaper>
    </IgContainer>
  );
}
