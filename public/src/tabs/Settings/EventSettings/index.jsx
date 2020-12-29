import React, { useEffect, useState, useContext } from "react";

import { Paper, Card } from "../../../components/Custom";

import { useTranslation } from "react-i18next";
import api from "../../../actions/api";
import { formatRoute } from "../../../actions/goTo";
import { CARD_TYPE_ENUM, SEVERITY_ENUM } from "../../../../../common/enums";
import moment from "moment";
import styles from "./EventSettings.module.css";
import { Store, ACTION_ENUM } from "../../../Store";
import { useRouter } from "next/router";

export default function EventSettings() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [infos, setInfos] = useState({});

  const getInfos = async () => {
    const { data } = await api(
      formatRoute("/api/entity/event", null, {
        eventId,
      })
    );
    setInfos(data);
  };

  useEffect(() => {
    getInfos();
  }, [eventId]);

  const fields = [
    {
      helperText: t("maximum_spots"),
      type: "number",
      initialValue: infos.maximum_spots || 0,
    },
    {
      helperText: t("event_start"),
      type: "date",
      initialValue: moment(infos.start_date).format("YYYY-MM-DD"),
    },
    {
      helperText: t("event_end"),
      type: "date",
      initialValue: moment(infos.end_date).format("YYYY-MM-DD"),
    },
  ];

  const onSave = async (values) => {
    const [
      { value: maximumSpots },
      { value: eventStart },
      { value: eventEnd },
    ] = values;
    if (maximumSpots < 0) {
      values[0].setError(true);
      return;
    }
    await api(`/api/entity/updateEvent`, {
      method: "PUT",
      body: JSON.stringify({
        eventId,
        maximumSpots,
        eventStart,
        eventEnd,
      }),
    });
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t("informations_saved"),
      severity: SEVERITY_ENUM.SUCCESS,
    });
    getInfos();
  };

  return (
    <Paper title={t("event_settings")} className={styles.paper}>
      <Card items={{ fields, onSave }} type={CARD_TYPE_ENUM.EVENT_SETTINGS} />
    </Paper>
  );
}
