import { Accordion, AccordionSummary, ListItemText, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, TextField } from '../../../../../../../../../components/Custom';
import styles from './Tickets.module.css';
import TicketOption from '../../../../../../../../../components/Custom/TicketOption';
import * as gameService from '../../../../../../../../../actions/service/game';
import { ITicketOption } from '../../../../../../../../../../../typescript/game';

interface IProps {
  creator: {
    id: string;
  };
  id: string;
  name: string;
  description: string;
  tickets: {
    limit: number;
    options: ITicketOption[];
  };
}

const General: React.FunctionComponent<IProps> = (props) => {
  const {
    creator: { id: creatorId },
    id,
    tickets: { limit: ticketLimit, options },
  } = props;
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
    },
    validate: (values: ITicketOption) => {
      const { name, price } = values;
      const errors: any = {};

      if (name.length > 64) {
        errors.name = t('invalid.invalid_64_length');
      }

      if (price !== 0 && price < 500) {
        errors.price = t('invalid.price_under_500');
      }

      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name, description, price } = values;
      const res = await gameService.addTicketOption(id, name, description, price, creatorId);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded((exp) => !exp)}
        style={{ margin: '1rem 0.5rem 0 0.5rem', borderRadius: '1rem' }}
      >
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" />}>
          <ListItemText primary={t('tickets')} />
        </AccordionSummary>
        <div className={styles.container}>
          {options.map((o, index) => (
            <TicketOption
              key={index}
              ticketOption={{
                name: o.name,
                price: o.price,
                description: o.description,
              }}
              action={
                <Button size="small" color="secondary" endIcon="Delete">
                  {t('delete.delete')}
                </Button>
              }
            />
          ))}
          <Typography variant="h4">{t('game.add_ticket_option')}</Typography>
          <TextField formik={formik} namespace="name" label={t('name')} fullWidth />
          <TextField
            formik={formik}
            namespace="price"
            label={t('price')}
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            namespace="description"
            formik={formik}
            multiline
            rows={1}
            rowsMax={20}
            label={t('description.description')}
            placeholder={t('description.enter_description')}
            fullWidth
          />
          <Button size="small" type="submit" endIcon="SaveIcon">
            {t('save')}
          </Button>
        </div>
      </Accordion>
    </form>
  );
};

export default General;
