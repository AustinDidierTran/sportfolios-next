import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../Store';
import {
  COMPONENT_TYPE_ENUM,
  SEVERITY_ENUM,
  ENTITIES_ROLE_ENUM,
  REQUEST_STATUS_ENUM,
  SUBMISSION_ENUM,
} from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import CustomButton from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { useFormik } from 'formik';
import styles from './GameDetailed.module.css';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CustomIconButton from '../../../components/Custom/IconButton';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import Divider from '@material-ui/core/Divider';
import Posts from '../../../components/Custom/Posts';
import dynamic from 'next/dynamic';
import { Entity, GameInfo, SubmissionerInfos } from '../../../../../typescript/types';
import { getGameInfo, getHasSpirit, getPossibleSubmissionerInfos } from '../../../actions/service/entity/get';
import MultipleTeamGame from '../../../components/Custom/Card/MultipleTeamGame';
import { goTo, ROUTES } from '../../../actions/goTo';

const EnterScore = dynamic(
  () => import('../../EditSchedule/AllEditGames/EditGames/ScoreSuggestion/EditGame/EnterScore')
);
const EditGameDialog = dynamic(
  () => import('../../EditSchedule/AllEditGames/EditGames/ScoreSuggestion/EditGame/EditGameDialog')
);
const SubmitScoreDialog = dynamic(() => import('../../../components/Custom/FormDialog/SubmitScoreSpiritForm'));
const RosterDisplay = dynamic(() => import('../../../components/Custom/RosterDisplay'));

interface IProps {
  gameId: string;
  basicInfos: Entity;
}

const GameDetailed: React.FunctionComponent<IProps> = (props) => {
  const { gameId, basicInfos } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId, userInfo },
  } = useContext(Store);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [game, setGame] = useState<GameInfo>();
  const [selectedSubmissionerInfos, setSelectedSubmissionerInfos] = useState<SubmissionerInfos>();
  const [possibleSubmissionersInfos, setpossibleSubmissionersInfos] = useState<SubmissionerInfos[]>([]);
  const [submitScore, setSubmitScore] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [gameDialog, setGameDialog] = useState<boolean>(false);
  const [hasSpirit, setHasSpirit] = useState<boolean>(false);
  const [submitType, setSubmitType] = useState<SUBMISSION_ENUM>();

  const getGame = async (): Promise<void> => {
    const data = await getGameInfo(gameId);

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

    if (data.role === ENTITIES_ROLE_ENUM.ADMIN || data.role === ENTITIES_ROLE_ENUM.EDITOR) {
      setIsAdmin(true);
    }

    setGame(data);
  };

  const getSubmissioner = async (): Promise<void> => {
    const res = await getPossibleSubmissionerInfos(game);
    if (res.status === REQUEST_STATUS_ENUM.FORBIDDEN) {
      setIsLoading(false);
      return;
    } else if (res.data) {
      setpossibleSubmissionersInfos(res.data);
      // Only one choice of team and person to submit
      if (res.data.length === 1 && res.data[0].myAdminPersons.length === 1) {
        setSelectedSubmissionerInfos({
          myTeam: res.data[0].myTeam,
          enemyTeam: res.data[0].enemyTeam,
          person: res.data[0].myAdminPersons[0],
        });
      }
    }
  };

  useEffect((): void => {
    if (gameId) {
      getGame();
      getHasSpirit(entityId).then(setHasSpirit);
    }
  }, [gameId]);

  useEffect((): void => {
    if (!game || !game.positions) {
      return;
    }
    getSubmissioner();
    setIsLoading(false);
  }, [game]);

  useEffect((): void => {
    setIsAdmin(basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR);
  }, [basicInfos]);

  const openSubmitScore = async (): Promise<void> => {
    if (possibleSubmissionersInfos.length === 1 && possibleSubmissionersInfos[0].myAdminPersons.length === 1) {
      setSubmitScore(true);
    } else {
      setChooseSubmitter(true);
    }
    setSubmitType(SUBMISSION_ENUM.SCORE);
  };

  const openSpiritScore = async (): Promise<void> => {
    if (possibleSubmissionersInfos.length === 1 && possibleSubmissionersInfos[0].myAdminPersons.length === 1) {
      setSubmitScore(true);
    } else {
      setChooseSubmitter(true);
    }
    setSubmitType(SUBMISSION_ENUM.SPIRIT);
  };

  const closeSubmitScore = (): void => {
    setSubmitScore(false);
  };

  const [chooseSubmitter, setChooseSubmitter] = useState<boolean>(false);
  const [possibleTeams, setPossibleTeams] = useState([]);
  const [possibleSubmissioners, setPossibleSubmissioners] = useState([]);

  useEffect((): void => {
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

  useEffect((): void => {
    if (possibleTeams.length) {
      formik.setFieldValue('team', possibleTeams[0].rosterId);
    }
  }, [possibleTeams]);

  useEffect((): void => {
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

  const handleChooseSubmitterClose = (): void => {
    setChooseSubmitter(false);
    formik.resetForm();
  };

  const optionsTeam = useMemo(
    (): { value: string; display: string }[] =>
      possibleTeams.map((t) => ({
        value: t.rosterId,
        display: t.name,
      })),
    [possibleTeams]
  );

  const optionsPerson = useMemo((): { value: string; display: string }[] => {
    if (formik.values.team) {
      const options = possibleSubmissionersInfos
        .find((p) => p.myTeam.rosterId === formik.values.team)
        .myAdminPersons.map((p) => {
          return {
            value: p.entityId,
            display: p.completeName,
          };
        });
      if (options.some((o) => o.value === userInfo.primaryPerson.personId)) {
        formik.setFieldValue('person', userInfo.primaryPerson.personId);
      } else {
        formik.setFieldValue('person', options[0].value);
      }
      return options;
    } else {
      [];
    }
  }, [formik.values.team]);

  const disableTeamSelect = useMemo((): boolean => optionsTeam?.length === 1, [optionsTeam]);
  const disablePersonSelect = useMemo((): boolean => optionsPerson?.length === 1, [optionsPerson]);

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

  const update = (): void => {
    getGame();
  };

  const handleClick = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const goBack = (): void => {
    history.back();
  };

  const gameClick = (): void => {
    setGameDialog(true);
  };

  const closeGameDialog = (): void => {
    setGameDialog(false);
  };

  const editClick = (): void => {
    setEdit(true);
  };

  const closeEdit = (): void => {
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
            <h2>{game.description || t('game')}</h2>
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
          <MultipleTeamGame
            game={{
              field: game.field,
              startTime: game.startTime,
              phaseName: game.phaseName,
              positions: game.positions,
              id: game.id,
            }}
            onClick={(id) => {
              goTo(ROUTES.entity, { id });
            }}
            withoutCard
            teamsAreClickable
          />
          <div className={styles.scoreButton}>
            {possibleSubmissioners.length > 0 && !game.scoreSubmited && (
              <div style={{ display: 'inline-grid' }}>
                <CustomButton style={{ margin: '4px' }} onClick={openSubmitScore}>
                  {t('submit_score')}
                </CustomButton>
                {hasSpirit ? (
                  <CustomButton style={{ margin: '4px' }} onClick={openSpiritScore}>
                    {t('submit_spirit')}
                  </CustomButton>
                ) : null}
              </div>
            )}
            {possibleSubmissioners.length > 0 && game.scoreSubmited && <div>{t('score.score_confirmed')}</div>}
          </div>
        </div>
        <Divider variant="middle" />
        <RosterDisplay teams={game.positions} update={getGame} />
        <Divider variant="middle" />
        <Posts
          userInfo={userInfo}
          allowPostImage
          allowNewPost
          entityIdCreatePost={userInfo?.primaryPerson?.personId || -1}
          allowComment
          allowLike
          locationId={game.id}
          elevation={0}
          placeholder={t('write_a_comment')}
        />
        <SubmitScoreDialog
          type={submitType}
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
            <MenuItem onClick={gameClick}>{t('edit.edit_score')}</MenuItem>
            <MenuItem onClick={editClick}>{t('edit.edit_game')}</MenuItem>
          </Menu>
        )}
      </div>
    </div>
  );
};
export default GameDetailed;
