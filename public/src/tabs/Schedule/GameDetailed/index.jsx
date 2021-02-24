import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Store } from '../../../Store';
import api from '../../../actions/api';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import CustomButton from '../../../components/Custom/Button';
import SubmitScoreDialog from '../../../components/Custom/FormDialog/SubmitScoreSpiritForm';
import FormDialog from '../../../components/Custom/FormDialog';
import { useFormik } from 'formik';

export default function GameDetailed(props) {
  const { gameId } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);

  const [game, setGame] = useState({});
  const [selectedSubmissionerInfos, setSelectedSubmissionerInfos] = useState({});
  const [possibleSubmissionersInfos, setpossibleSubmissionersInfos] = useState([]);
  const [submitScore, setSubmitScore] = useState(false);

  useEffect(async () => {
    const { status, data } = await api(
      formatRoute('/api/entity/game', null, {
        gameId: gameId,
      }),
      { method: 'GET' }
    );
    if (!data) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    setGame(data);

    const { status: statusSubmit, data: dataSubmit } = await api(
      formatRoute('/api/entity/getPossibleSubmissionerInfos', null, {
        gameId: data.id,
        teamsIds: JSON.stringify(
          data.teams.map((t) => ({
            rosterId: t.roster_id,
            name: t.name,
          }))
        ),
      }),
      { method: 'GET' }
    );

    if (statusSubmit === STATUS_ENUM.FORBIDDEN) {
      return;
    } else if (dataSubmit) {
      setpossibleSubmissionersInfos(dataSubmit);
      // Only one choice of team and person to submit
      if (dataSubmit.length === 1 && dataSubmit[0].myAdminPersons.length === 1) {
        setSelectedSubmissionerInfos({
          myTeam: dataSubmit[0].myTeam,
          enemyTeam: dataSubmit[0].enemyTeam,
          person: dataSubmit[0].myAdminPersons[0],
        });
      }
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('invalid.invalid_roster_role_to_submit_score'),
        severity: SEVERITY_ENUM.INFO,
      });
    }
  }, [gameId]);

  const openSubmitScore = async () => {
    if (possibleSubmissionersInfos.length === 1 && possibleSubmissionersInfos[0].myAdminPersons.length === 1) {
      setSubmitScore(true);
    } else {
      setChooseSubmitter(true);
    }
  };

  const closeSubmitScore = () => {
    setSubmitScore(false);
  };

  const [chooseSubmitter, setChooseSubmitter] = useState(false);
  const [possibleTeams, setPossibleTeams] = useState([]);
  const [possibleSubmissioners, setPossibleSubmissioners] = useState([]);

  useEffect(() => {
    if (possibleSubmissionersInfos.length) {
      setPossibleTeams(
        possibleSubmissionersInfos.map((s) => ({
          rosterId: s.myTeam.rosterId,
          name: s.myTeam.name,
        }))
      );

      setPossibleSubmissioners(
        possibleSubmissionersInfos.map((s) => ({
          persons: s.myAdminPersons,
        }))
      );
    }
  }, [possibleSubmissionersInfos]);

  useEffect(() => {
    if (possibleTeams.length) {
      formik.setFieldValue('team', possibleTeams[0].rosterId);
    }
  }, [possibleTeams]);

  useEffect(() => {
    if (possibleSubmissioners.length === 1 && possibleSubmissioners[0].length === 1) {
      formik.setFieldValue('person', possibleSubmissioners[0][0]);
    }
  }, [possibleSubmissioners]);

  const formik = useFormik({
    initialValues: {
      team: '',
      person: '',
    },
    onSubmit: async (values) => {
      const { team, person } = values;

      const choice = possibleSubmissionersInfos.find((s) => s.myTeam.rosterId === team);
      setSelectedSubmissionerInfos({
        myTeam: choice.myTeam,
        enemyTeam: choice.enemyTeam,
        person: choice.myAdminPersons.find((p) => p.entityId === person),
      });

      setSubmitScore(true);
      handleChooseSubmitterClose();
    },
  });

  const handleChooseSubmitterClose = () => {
    setChooseSubmitter(false);
    formik.resetForm();
  };

  const optionsTeam = useMemo(
    () =>
      possibleTeams.map((t) => {
        return {
          value: t.rosterId,
          display: t.name,
        };
      }),
    [possibleTeams]
  );

  const optionsPerson = useMemo(() => {
    if (formik.values.team) {
      const options = possibleSubmissionersInfos
        .find((p) => p.myTeam.rosterId === formik.values.team)
        .myAdminPersons.map((p) => {
          return {
            value: p.entityId,
            display: p.completeName,
          };
        });
      if (options.some((o) => o.value === userInfo.primaryPerson.entity_id)) {
        formik.setFieldValue('person', userInfo.primaryPerson.entity_id);
      } else {
        formik.setFieldValue('person', options[0].value);
      }
      return options;
    } else {
      [];
    }
  }, [formik.values.team]);

  const disableTeamSelect = useMemo(() => optionsTeam?.length === 1, [optionsTeam]);
  const disablePersonSelect = useMemo(() => optionsPerson?.length === 1, [optionsPerson]);

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'team',
      label: t('submit_for_team'),
      options: optionsTeam,
      showTextIfOnlyOneOption: disableTeamSelect,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'person',
      label: t('submit_as'),
      options: optionsPerson,
      showTextIfOnlyOneOption: disablePersonSelect,
    },
  ];

  const buttons = [
    {
      onClick: () => setChooseSubmitter(false),
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('choose.choose'),
      color: 'primary',
    },
  ];

  return (
    <>
      {possibleSubmissioners.length > 0 && <CustomButton onClick={openSubmitScore}>{t('submit_score')}</CustomButton>}
      <SubmitScoreDialog
        open={submitScore}
        onClose={closeSubmitScore}
        gameId={game.id}
        submissionerInfos={selectedSubmissionerInfos}
      />
      <FormDialog
        open={chooseSubmitter}
        onClose={handleChooseSubmitterClose}
        title={t('choose.choose_submitter')}
        fields={fields}
        formik={formik}
        buttons={buttons}
      />
    </>
  );
}
