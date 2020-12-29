import React, { useEffect, useState } from "react";

import { Select } from "../../../../../components/Custom";
import styles from "./PhaseSelect.module.css";
import { useTranslation } from "react-i18next";
import api from "../../../../../actions/api";
import { formatRoute } from "../../../../../actions/goTo";
import { SELECT_ENUM } from "../../../../../../../common/enums";
import { useRouter } from "next/router";

export default function PhaseSelect(props) {
  const { onChange, phaseId } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  const [phases, setPhases] = useState([]);

  useEffect(() => {
    getPhases();
  }, []);

  const getPhases = async () => {
    const { data } = await api(
      formatRoute("/api/entity/phases", null, { eventId })
    );
    const res = data.map((d) => ({
      value: d.id,
      display: d.name,
    }));

    setPhases([{ value: SELECT_ENUM.ALL, display: t("all_phases") }, ...res]);
  };

  const handleChange = (phaseId) => {
    const phase = phases.find((phase) => {
      return phase.value === phaseId;
    });
    onChange(phase);
  };

  return (
    <div className={styles.select}>
      <Select
        options={phases}
        namespace="phase"
        autoFocus
        margin="dense"
        label={t("phase")}
        fullWidth
        onChange={handleChange}
        value={phaseId}
      />
    </div>
  );
}
