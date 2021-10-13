import React from 'react';
import { useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Stepper.module.css';
import { useTranslation } from 'react-i18next';
import ContainerBottomFixed from '../ContainerBottomFixed';
import { COLORS } from '../../../utils/colors';
import RosterUpdateDialog from '../Dialog/RosterUpdateDialog';

export default function CustomStepperWithHooks(props) {
  const { activeStep, completed, Back, handleBack, handleNext, Next, handleReset, finish, steps, rosterUpdate } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const closeRosterUpdate = () => {
    setOpen(false);
    finish();
  };
  const onFinish = () => {
    setOpen(true);
  };

  const acceptRosterUpdate = () => {
    setOpen(false);
    rosterUpdate();
  };
  return (
    <div className={styles.main}>
      <Stepper activeStep={activeStep} className={styles.stepper} alternativeLabel>
        {steps.map((step) => {
          const { label } = step;
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps} className={styles.step}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className={styles.display}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={styles.instructions}>{t('all_steps_completed')}</Typography>
            <Button onClick={handleReset} className={styles.button}>
              {t('reset')}
            </Button>
          </div>
        ) : (
          <div>
            <div className={styles.content}>{steps[activeStep].content}</div>
            <ContainerBottomFixed>
              <div className={styles.buttons}>
                <div className={styles.button}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => {
                      Back(activeStep);
                      handleBack();
                    }}
                    variant="contained"
                    color="primary"
                    style={{ color: COLORS.white }}
                  >
                    {t('back')}
                  </Button>
                </div>
                {finish && activeStep === steps.length - 1 ? (
                  <div>
                    <div className={styles.button}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onFinish}
                        disabled={!completed.has(activeStep)}
                        style={{ color: COLORS.white }}
                      >
                        {t('finish')}
                      </Button>
                    </div>
                    <RosterUpdateDialog open={open} onClose={closeRosterUpdate} onAccept={acceptRosterUpdate} />
                  </div>
                ) : (
                  <div className={styles.button}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        Next(activeStep);
                        handleNext();
                      }}
                      disabled={!completed.has(activeStep)}
                      style={{ color: COLORS.white }}
                    >
                      {activeStep === steps.length - 1 ? t('finish') : t('next')}
                    </Button>
                  </div>
                )}
              </div>
            </ContainerBottomFixed>
          </div>
        )}
      </div>
    </div>
  );
}
