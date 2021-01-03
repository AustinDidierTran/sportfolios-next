import React, { useEffect } from "react";

import styles from "./Checkout.module.css";

import ChoosePaymentMethod from "./ChoosePaymentMethod";
import { formatPageTitle } from "../../utils/stringFormats";
import { Paper, IgContainer } from "../../components/Custom";
import { useTranslation } from "react-i18next";

const Checkout = (props) => {
  const { total } = props;
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t("checkout"));
  }, []);

  return (
    <IgContainer>
      <Paper className={styles.paper}>
        <ChoosePaymentMethod response={total} />
      </Paper>
    </IgContainer>
  );
};

export default Checkout;
