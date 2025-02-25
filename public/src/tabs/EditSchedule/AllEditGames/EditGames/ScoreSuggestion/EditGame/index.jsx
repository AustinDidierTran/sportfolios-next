import React, { useContext, useEffect, useState } from 'react';

import AlertDialog from '../../../../../../components/Custom/Dialog/AlertDialog';
import Card from '../../../../../../components/Custom/Card';
import { useTranslation } from 'react-i18next';
import { CARD_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../../../common/enums';
import EditGameDialog from './EditGameDialog';
import EnterScore from './EnterScore';
import { ACTION_ENUM, Store } from '../../../../../../Store';
import { ERROR_ENUM } from '../../../../../../../common/errors';
import { deleteGame } from '../../../../../../actions/service/entity/delete';

export default function EditGame(props) {
  const { game, update, withoutEdit } = props;
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const [gameDialog, setGameDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const closeGameDialog = () => {
    setGameDialog(false);
  };

  const closeDelete = () => {
    setDeleteDialogIsOpen(false);
  };

  const gameClick = () => {
    if (game.positions[0].rosterId && game.positions[1].rosterId) {
      setGameDialog(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_edit_game_score'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const onEdit = () => {
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
  };

  const onDelete = () => {
    setDeleteDialogIsOpen(true);
  };

  const onDeleteConfirmed = async () => {
    const { status, data } = await deleteGame(game.eventId, game.id);
    if (data && data.reason) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t(data.reason),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setDeleteDialogIsOpen(false);
      update();
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('game_deleted'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 4000,
      });
    } else {
      setDeleteDialogIsOpen(false);
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  //Scroll to given section specified with # in the url
  const scroll = () => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      const anchor = document.getElementById(hash);
      setTimeout(() => {
        anchor?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 500);
    }
  };
  useEffect(scroll, []);

  return (
    <div id={game.id}>
      {withoutEdit ? (
        <Card
          items={{
            ...game,
            onClick: gameClick,
            onDelete: onDelete,
          }}
          type={CARD_TYPE_ENUM.TWO_TEAM_GAME_EDITABLE}
        />
      ) : (
        <Card
          items={{
            ...game,
            onClick: gameClick,
            onEdit: onEdit,
            onDelete: onDelete,
          }}
          type={CARD_TYPE_ENUM.TWO_TEAM_GAME_EDITABLE}
        />
      )}

      <EnterScore open={gameDialog} onClose={closeGameDialog} update={update} game={game} />
      <EditGameDialog open={edit} onClose={closeEdit} game={game} update={update} />
      <AlertDialog
        open={deleteDialogIsOpen}
        onCancel={closeDelete}
        onSubmit={onDeleteConfirmed}
        title={t('delete.delete_game_confirmation')}
      />
    </div>
  );
}
