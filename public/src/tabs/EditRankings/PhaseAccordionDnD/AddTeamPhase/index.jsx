import React, { useContext } from 'react';
import Select from '../../../../components/Custom/Select';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useRouter } from 'next/router';

export default function AddTeamPhase(props) {
  const { phaseId, update, initialPosition, allOptions } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const changeTeam = async (position) => {
    const select = allOptions.find((o) => o.value === position);
    const { status } = await api('/api/entity/updateTeamPhase', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        id: position,
        initialPosition,
        phaseId,
        originPhase: select.phaseId,
        originPosition: select.index,
      }),
    });

    if (status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
    update();
  };

  return <Select options={allOptions} value="selected" onChange={changeTeam} />;
}
