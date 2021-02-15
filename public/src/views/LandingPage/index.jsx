import React, { useContext } from 'react';

import styles from './LandingPage.module.css';
import { CARD_TYPE_ENUM, LOGO_ENUM, PHOTO_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../common/enums';
import Divider from '@material-ui/core/Divider';
import MobileContainer from '../../components/Custom/MobileContainer';
import Button from '../../components/Custom/Button';
import TextField from '../../components/Custom/TextField';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ROUTES, goTo } from '../../actions/goTo';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ERROR_ENUM } from '../../../common/errors';
import { Card } from '../../components/Custom';
import api from '../../actions/api';
import { ACTION_ENUM, Store } from '../../Store';

export default function LandingPage() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    email: yup.string().email().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    message: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { name, email, message } = values;
      const res = await api('/api/notifications/sendMessageToSportfoliosAdmin', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('message_sent'),
          severity: SEVERITY_ENUM.SUCCESS,
        });
        formik.setFieldValue('message', '');
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(ERROR_ENUM.ERROR_OCCURED),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  });

  const team = [
    { name: 'Austin-Didier \n Tran', role: 'Fondateur et Directeur Général', src: PHOTO_ENUM.AUSTIN },
    { name: 'Julien \n Bernat', role: 'Vice-président des technologies', src: PHOTO_ENUM.JULIEN },
    { name: 'Achille \n Lanctôt Saumure', role: 'Développeur Web', src: PHOTO_ENUM.ACHILLE },
    { name: 'Médéric \n Rochon', role: 'Développeur Web', src: PHOTO_ENUM.MEDERIC },
    { name: 'Émilie \n Oliver', role: 'Responsable des communications', src: PHOTO_ENUM.EMILIE },
    { name: 'Andréanne \n  Breton', role: 'Responsable des communications', src: PHOTO_ENUM.ANDREANNE },
  ];

  return (
    <>
      <div className={styles.whiteContainer}>
        <MobileContainer>
          <div className={styles.block}>
            <div className={styles.logo}>
              <img src={LOGO_ENUM.LOGO_1024X1024} height="200px" width="200px" />
            </div>
            <Divider variant="middle" className={styles.dividerRoot} />
            <div>
              <Typography className={styles.text} variant="h4">
                Modernisez votre gestion.
              </Typography>
              <Typography className={styles.text} variant="h4">
                Augmentez votre efficacité.
              </Typography>
              <Typography className={styles.text} variant="h4">
                Gagnez du temps.
              </Typography>
            </div>
            <Divider variant="middle" className={styles.dividerRoot} />
            <div>
              <Typography className={styles.text} variant="h4">
                Avec nous :
              </Typography>
              <Typography className={styles.text} variant="h4">
                Les athlètes jouent;
              </Typography>
              <Typography className={styles.text} variant="h4">
                Les entraineurs entrainent;
              </Typography>
              <Typography className={styles.text} variant="h4">
                Les organisateurs organisent;
              </Typography>
              <Typography className={styles.text} variant="h4">
                C'est tout.
              </Typography>
            </div>
            <Button
              onClick={() => {
                goTo(ROUTES.login);
              }}
              className={styles.button}
            >
              Accéder à la plateforme
            </Button>
          </div>
        </MobileContainer>
      </div>
      <div className={styles.greenContainer}>
        <MobileContainer>
          <div className={styles.block}>
            <div>
              <Typography className={styles.text} variant="h2">
                C'est quoi,
              </Typography>
              <Typography className={styles.text} variant="h2">
                Sportfolios?
              </Typography>
            </div>
            <div>
              <Typography className={styles.text} variant="h5">
                Une plateforme
                <strong> simple </strong>
                et
                <strong> intuitive </strong>
                qui regroupe toutes les étapes nécessaires à votre planification sportive.
              </Typography>
            </div>
            <div className={styles.checkboxContainer}>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Gestion des horaires"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Gestion des inscriptions"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Paiements sécurisés"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Entrée de résultats"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Messagerie interne &
                système de notifications aux
                membres"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
            </div>
            <div>
              <Typography style={{ margin: '8px' }} className={styles.text} variant="h5">
                Utilisez votre temps pour ce qui compte réellement. On s'occupe du reste.
              </Typography>
            </div>
            <Button
              onClick={() => {
                goTo(ROUTES.login);
              }}
              className={styles.button}
            >
              Commencer gratuitement
            </Button>
          </div>
        </MobileContainer>
      </div>
      <div className={styles.whiteContainer}>
        <MobileContainer>
          <div className={styles.block}>
            <div>
              <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
                Notre Équipe
              </Typography>
              <div className={styles.team}>
                {team.map((t) => (
                  <Card
                    key={t.name}
                    type={CARD_TYPE_ENUM.OUR_TEAM_MEMBER}
                    items={{
                      name: t.name,
                      role: t.role,
                      src: t.src,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </MobileContainer>
      </div>
      <div className={styles.greenContainer}>
        <MobileContainer>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.block}>
              <Typography className={styles.text} style={{ marginTop: '32px' }} variant="h2">
                Contactez-nous!
              </Typography>
              <div className={styles.logo}>
                <img src={LOGO_ENUM.WHITE_LOGO_1024X1024} height="200px" width="200px" />
              </div>
              <Typography className={styles.text} variant="h5">
                Nom
              </Typography>
              <TextField
                inputProps={{ style: { textAlign: 'center', paddingTop: '10px' } }}
                namespace="name"
                formik={formik}
                variant="filled"
                className={styles.textField}
              />
              <Typography className={styles.text} variant="h5">
                Adesse courriel
              </Typography>
              <TextField
                inputProps={{ style: { textAlign: 'center', paddingTop: '10px' } }}
                namespace="email"
                formik={formik}
                variant="filled"
                className={styles.textField}
              />
              <Typography className={styles.text} variant="h5">
                Message
              </Typography>
              <TextField
                namespace="message"
                formik={formik}
                variant="filled"
                className={styles.textField}
                multiline
                rows={7}
                rowsMax={7}
              />
              <Button type="submit" style={{ marginTop: '16px', marginBottom: '16px' }} className={styles.button}>
                Envoyer
              </Button>
            </div>
          </form>
        </MobileContainer>
      </div>
    </>
  );
}
