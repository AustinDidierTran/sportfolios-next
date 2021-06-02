import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../Store';
import api from '../../../actions/api';
import { formatRoute } from '../../../utils/stringFormats';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM, ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import CustomButton from '../../../components/Custom/Button';
import Avatar from '../../../components/Custom/Avatar';
import FormDialog from '../../../components/Custom/FormDialog';
import { useFormik } from 'formik';
import styles from './GameDetailed.module.css';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CustomIconButton from '../../../components/Custom/IconButton';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import Divider from '@material-ui/core/Divider';
import Posts from '../../../components/Custom/Posts';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { goTo, ROUTES } from '../../../actions/goTo';

const EnterScore = dynamic(() =>
  import('../../EditSchedule/AllEditGames/EditGames/ScoreSuggestion/EditGame/EnterScore')
);
const EditGameDialog = dynamic(() =>
  import('../../EditSchedule/AllEditGames/EditGames/ScoreSuggestion/EditGame/EditGameDialog')
);
const SubmitScoreDialog = dynamic(() => import('../../../components/Custom/FormDialog/SubmitScoreSpiritForm'));
const RosterDisplay = dynamic(() => import('../../../components/Custom/RosterDisplay'));

export default function GameDetailed(props) {
  const { gameId, basicInfos } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [game, setGame] = useState({});
  const [selectedSubmissionerInfos, setSelectedSubmissionerInfos] = useState({});
  const [possibleSubmissionersInfos, setpossibleSubmissionersInfos] = useState([]);
  const [submitScore, setSubmitScore] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [gameDialog, setGameDialog] = useState(false);

  const getGame = async () => {
    const { data } = await api(
      formatRoute('/api/entity/gameInfo', null, {
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
      goBack();
      return;
    }
    setGame(data);
  };

  const getSubmissioner = async () => {
    const { status: statusSubmit, data: dataSubmit } = await api(
      formatRoute('/api/entity/getPossibleSubmissionerInfos', null, {
        gameId: game.id,
        teamsIds: JSON.stringify(
          game.positions.map((t) => ({
            rosterId: t.roster_id,
            name: t.name,
          }))
        ),
      }),
      { method: 'GET' }
    );

    if (statusSubmit === STATUS_ENUM.FORBIDDEN) {
      setIsLoading(false);
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
    }
  };

  useEffect(() => {
    getGame();
  }, [gameId]);

  useEffect(() => {
    if (!game || !game.positions) {
      return;
    }
    getSubmissioner();
    setIsLoading(false);
  }, [game]);

  useEffect(() => {
    if (basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR) {
      setIsAdmin(true);
    }
  }, [basicInfos]);

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
      possibleTeams.map((t) => ({
        value: t.rosterId,
        display: t.name,
      })),
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

  const update = () => {
    getGame();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goBack = () => {
    history.back();
  };

  const gameClick = () => {
    setGameDialog(true);
  };

  const closeGameDialog = () => {
    setGameDialog(false);
  };

  const editClick = () => {
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.root}>
        <div className={styles.baseContent}>
          <div className={styles.header}>
            <div>
              <CustomIconButton size="medium" icon="ArrowBack" style={{ color: 'primary' }} onClick={goBack} />
            </div>
            <div className={styles.gameInfo}>
              <div className={styles.gameInfoDate}>{moment(game.start_time).format('ddd Do MMM hh:mm')}</div>
              <div className={styles.phaseName}>{game.phase_name}</div>
              <div>{game.field}</div>
            </div>

            <div className={styles.iconOptions}>
              {isAdmin && (
                <CustomIconButton
                  icon="MoreVertIcon"
                  style={{ color: 'primary' }}
                  onClick={handleClick}
                  size="medium"
                />
              )}
            </div>
          </div>
          <div className={styles.content}>
            {game.positions.map((team, i) => (
              <div key={i}>
                {i % 2 === 0 ? (
                  <div className={styles.teamContent}>
                    <a href="#">
                      <div
                        onClick={() => {
                          goTo(ROUTES.entity, { id: team.id });
                        }}
                      >
                        <Avatar photoUrl={team.photo_url} size="lg"></Avatar>
                        <Typography className={styles.teamName} variant="h5">
                          {team.name}
                        </Typography>
                      </div>
                    </a>
                    <div className={styles.score}>
                      <Typography variant="h5">{team.score}</Typography>
                    </div>
                  </div>
                ) : (
                  <div className={styles.teamContent}>
                    <div className={styles.score}>
                      <Typography variant="h5">{team.score}</Typography>
                    </div>
                    <a href="#">
                      <div
                        clickable="true"
                        onClick={() => {
                          goTo(ROUTES.entity, { id: team.id });
                        }}
                      >
                        <Avatar photoUrl={team.photo_url} size="lg"></Avatar>
                        <Typography className={styles.teamName} variant="h5">
                          {team.name}
                        </Typography>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.scoreButton}>
            {possibleSubmissioners.length > 0 && !game.score_submited && (
              <CustomButton onClick={openSubmitScore}>{t('submit_score')}</CustomButton>
            )}
            {possibleSubmissioners.length > 0 && game.score_submited && <div>{t('score.score_confirmed')}</div>}
          </div>
        </div>
        <Divider variant="middle" />
        <RosterDisplay teams={game.positions} />
        <Divider variant="middle" />
        <Posts
          userInfo={userInfo}
          allowPostImage
          allowNewPost
          entityIdCreatePost={userInfo?.primaryPerson?.entity_id || -1}
          allowComment
          allowLike
          locationId={game.entity_id}
          elevation={0}
          placeholder={t('write_a_comment')}
        />
        <SubmitScoreDialog
          open={submitScore}
          onClose={closeSubmitScore}
          gameId={game.id}
          submissionerInfos={selectedSubmissionerInfos}
          update={update}
        />
        <FormDialog
          open={chooseSubmitter}
          onClose={handleChooseSubmitterClose}
          title={t('choose.choose_submitter')}
          fields={fields}
          formik={formik}
          buttons={buttons}
        />
        <EditGameDialog open={edit} onClose={closeEdit} game={game} update={update} />
        <EnterScore open={gameDialog} onClose={closeGameDialog} game={game} update={update} />
        {isAdmin && (
          <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={gameClick} update={update}>
              {t('edit.edit_score')}
            </MenuItem>
            <MenuItem onClick={editClick} update={update}>
              {t('edit.edit_game')}
            </MenuItem>
          </Menu>
        )}
      </div>
    </div>
  );
}
