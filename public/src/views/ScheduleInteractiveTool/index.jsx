import React, { useEffect, useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { LoadingSpinner, Icon, AlertDialog, Button } from '../../components/Custom';
import { Store, ACTION_ENUM } from '../../Store';
import { STATUS_ENUM, SEVERITY_ENUM, TABS_ENUM } from '../../../common/enums';
import { Fab, makeStyles, Tooltip, Typography } from '@material-ui/core';
import styles from './ScheduleInteractiveTool.module.css';
import GameCard from './GameCard';
import AddGame from './AddGame';
import AddField from '../../tabs/EditSchedule/CreateSchedule/AddField';
import AddTimeSlot from '../../tabs/EditSchedule/CreateSchedule/AddTimeSlot';

import RGL from 'react-grid-layout';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';

const ReactGridLayout = RGL;

const useStyles = makeStyles((theme) => ({
  fabBack: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabAdd: {
    position: 'absolute',
    bottom: theme.spacing(5) + 56,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
    backgroundColor: '#1c1cff',
    '&:hover': {
      background: '#0000b5',
    },
  },
  fabCancel: {
    position: 'absolute',
    bottom: theme.spacing(7) + 112,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabSave: {
    position: 'absolute',
    bottom: theme.spacing(9) + 168,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'white',
  },
  fabRedo: {
    position: 'absolute',
    bottom: theme.spacing(11) + 224,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'blue',
  },
  fabUndo: {
    position: 'absolute',
    bottom: theme.spacing(13) + 280,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'blue',
  },
  clear: {
    position: 'absolute',
    bottom: theme.spacing(15) + 336,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'orange',
  },
}));

var undoLog = [];
var redoLog = [];

export default function ScheduleInteractiveTool() {
  const router = useRouter();
  const { id: eventId } = router.query;
  const classes = useStyles();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [phases, setPhases] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [fields, setFields] = useState([]);

  const [madeChanges, setMadeChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingGames, setIsAddingGames] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [buttonsAdd, setButtonsAdd] = useState([]);
  const [layout, setLayout] = useState([]);
  const [initialLayout, setInitialLayout] = useState([]);
  const [layoutTimes, setLayoutTimes] = useState([]);
  const [layoutFields, setLayoutFields] = useState([]);

  const [alertDialog, setAlertDialog] = useState(false);
  const [addGameDialog, setAddGameDialog] = useState(false);
  const [addGameField, setAddGameField] = useState({});
  const [addGameTimeslot, setAddGameTimeslot] = useState({});
  const [addFieldDialog, setAddFieldDialog] = useState(false);
  const [addTimeslotDialog, setAddTimeslotDialog] = useState(false);

  class addTimeSlotCommand {
    date;
    newState = [];
    previousState = [];
    timeSlot;
    type = 'timeSlotCommand';

    constructor(pState, timeSlot, realDate) {
      this.date = realDate;
      this.previousState = pState;
      this.timeSlot = timeSlot;
      this.newState = this.previousState.concat([timeSlot]);
    }

    execute() {
      console.log(this.timeSlot.id);
      setTimeslots(this.newState);
    }

    async undo() {
      console.log('dgfdfg');
      await api(
        formatRoute('/api/entity/timeSlot', null, {
          timeSlotId: this.timeSlot.id,
        }),
        {
          method: 'DELETE',
        }
      );
      setTimeslots(this.previousState);
    }

    async redo() {
      await api('/api/entity/timeSlots', {
        method: 'POST',
        body: JSON.stringify({
          date: this.date,
          eventId,
        }),
      });
      setTimeslots(this.newState);
    }
  }

  const getData = async () => {
    setIsLoading(true);
    if (!eventId) {
      return;
    }
    const { data } = await api(formatRoute('/api/entity/interactiveTool', null, { eventId }));

    setPhases(
      data.phases.map((p) => ({
        value: p.id,
        display: p.name,
      }))
    );
    setTeams(
      data.teams.map((t) => ({
        value: t.roster_id,
        display: t.name,
      }))
    );
    setFields(data.fields);
    setTimeslots(data.timeSlots);
    setGames(
      data.games.map((g) => ({
        ...g,
        x: data.fields.findIndex((f) => f.id === g.field_id),
        y: data.timeSlots.findIndex((ts) => ts.id === g.timeslot_id),
      }))
    );
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [eventId]);

  useEffect(() => {
    const timeArr = timeslots.reduce(
      (prev, time, index) => [
        ...prev,
        {
          i: time.id,
          x: 0,
          y: index,
          w: 1,
          h: 1,
          static: true,
        },
      ],
      []
    );

    const fieldArr = fields.reduce(
      (prev, field, index) => [
        ...prev,
        {
          i: field.id,
          x: index,
          y: 0,
          w: 1,
          h: 1,
          static: true,
        },
      ],
      []
    );

    const gameArr = games.reduce(
      (prev, game) => [
        ...prev,
        {
          i: game.id,
          x: game.x,
          y: game.y,
          w: 1,
          h: 1,
          isBounded: true,
        },
      ],
      []
    );

    setLayoutFields(fieldArr);
    setLayoutTimes(timeArr);
    setInitialLayout(gameArr);
    setLayout(gameArr);
  }, [fields, timeslots, games]);

  const onDragStop = (layout, oldItem, newItem) => {
    setGames((games) => {
      const oldGameIndex = games.findIndex((g) => g.x === oldItem.x && g.y === oldItem.y);

      games[oldGameIndex] = {
        ...games[oldGameIndex],
        x: newItem.x,
        y: newItem.y,
      };

      return games;
    });

    setLayout(layout);
    setMadeChanges(true);
  };

  const handleCancel = async () => {
    // fix tooltips
    setGames(
      games.map((g) => ({
        ...g,
        x: fields.findIndex((f) => f.id === g.field_id),
        y: timeslots.findIndex((ts) => ts.id === g.timeslot_id),
      }))
    );

    setButtonsAdd([]);
    setIsAddingGames(false);

    setLayout(initialLayout);
    setMadeChanges(false);
  };

  const handleSave = async () => {
    const gameIds = games.map((g) => g.id);
    const onlyGames = layout.filter((g) => gameIds.includes(g.i));
    const changedGames = onlyGames.filter(
      ({ x: x1, y: y1, i: i1 }) => !initialLayout.some(({ x: x2, y: y2, i: i2 }) => x1 === x2 && y1 === y2 && i1 === i2)
    );

    const gamesToUpdate = changedGames.reduce(
      (prev, game) => [
        ...prev,
        {
          gameId: game.i,
          timeSlotId: timeslots[game.y].id,
          fieldId: fields[game.x].id,
        },
      ],
      []
    );

    const res = await api(`/api/entity/updateGamesInteractiveTool`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        games: gamesToUpdate,
      }),
    });

    if (res.status === STATUS_ENUM.ERROR || res.status === STATUS_ENUM.UNAUTHORIZED) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }

    await getData();

    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('changes_saved'),
      severity: SEVERITY_ENUM.SUCCESS,
    });

    setMadeChanges(false);
  };

  const goBackToEvent = () => {
    goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.EDIT_SCHEDULE });
  };
  const handleBack = () => {
    madeChanges ? setAlertDialog(true) : goBackToEvent();
  };
  const handleDialogSubmit = () => {
    goBackToEvent();
  };
  const handleDialogCancel = () => {
    setAlertDialog(false);
  };

  const handleMoveMode = () => {
    setIsAddingGames(false);
    setButtonsAdd([]);
    setLayout(layout.filter((item) => item.i[0] !== '+'));
  };

  const handleAddMode = () => {
    setIsAddingGames(true);
    const buttonsToAdd = [];
    for (let x = 0; x < fields.length; x++) {
      for (let y = 0; y < timeslots.length; y++) {
        if (!layout.find((item) => item.x === x && item.y === y)) {
          buttonsToAdd.push({
            i: `+${x}:${y}`,
            x: x,
            y: y,
            w: 1,
            h: 1,
            static: true,
          });
        }
      }
    }

    setButtonsAdd(buttonsToAdd);
    setLayout(layout.concat(buttonsToAdd));
  };

  const handleAddGameAt = (x, y) => {
    setAddGameField({
      id: fields[x].id,
      name: fields[x].field,
    });
    setAddGameTimeslot({
      id: timeslots[y].id,
      date: timeslots[y].date,
    });
    setAddGameDialog(true);
  };

  const createCard = (game) => {
    const gridX = fields.findIndex((f) => f.id === game.field_id);
    const gridY = timeslots.findIndex((ts) => ts.id === game.timeslot_id);

    // add game
    setGames(
      games.concat([
        {
          ...game,
          x: gridX,
          y: gridY,
        },
      ])
    );

    // remove old "+" button
    setButtonsAdd(buttonsAdd.filter((btn) => btn.i !== `+${gridX}:${gridY}`));

    // set new layout
    setLayout(
      layout
        .filter((item) => item.i !== `+${gridX}:${gridY}`)
        .concat([
          {
            i: game.id,
            x: gridX,
            y: gridY,
            w: 1,
            h: 1,
            isBounded: true,
          },
        ])
    );
  };

  const handleAddField = () => {
    setAddFieldDialog(true);
  };

  const handleAddTimeslot = () => {
    setAddTimeslotDialog(true);
  };

  const addTimeslotToGrid = (timeSlot, realDate, eventId) => {
    const command = new addTimeSlotCommand(timeslots, timeSlot, realDate);
    // console.log('command created')
    executeCommand(command);
    // setTimeslots(timeslots.concat([timeslot]));
  };

  const addFieldToGrid = (field) => {
    setFields(fields.concat([field]));
  };

  //===========================================================================

  function executeCommand(command) {
    command.execute();
    undoLog.push(command);
    setCanUndo(true);
  }

  function undoCommand() {
    const command = undoLog[undoLog.length - 1];
    command.undo();
    undoLog.pop();
    if (!undoLog.length) {
      setCanUndo(false);
    }
    redoLog.push(command);
    setCanRedo(true);
  }

  function redoCommand() {
    const command = redoLog[redoLog.length - 1];
    command.redo();
    redoLog.pop();
    if (!redoLog.length) {
      setCanRedo(false);
    }
    undoLog.push(command);
    setCanUndo(true);
  }

  function clearHistory() {
    undoLog.length = 0;
    redoLog.length = 0;
    setCanUndo(false);
    setCanRedo(false);
    console.log('logs cleared');
  }

  //=========================================================================

  const AddGames = buttonsAdd.map((b) => (
    <div className={styles.divAddGame} key={b.i} onClick={() => handleAddGameAt(b.x, b.y)}>
      <Icon icon="Add" color="#18b393" />
    </div>
  ));

  const Fields = fields.map((f) => (
    <div className={styles.divField} key={f.id}>
      <Typography className={styles.label}>{f.field}</Typography>
    </div>
  ));

  const Times = timeslots.map((t) => (
    <div className={styles.divTime} key={t.id}>
      <Typography className={styles.label}>{formatDate(moment(t.date), 'DD MMM HH:mm')}</Typography>
    </div>
  ));

  const Games = games.map((g) => (
    <div className={styles.itemDiv} key={g.id}>
      <GameCard team1={g.teams[0].name} team2={g.teams[1].name} fields={fields} timeSlots={timeslots} x={g.x} y={g.y} />
    </div>
  ));

  const ref = useRef(null);
  const refFields = useRef(null);
  const refTimeslots = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const gridScroll = () => {
    setScrollX(ref.current.scrollLeft);
    setScrollY(ref.current.scrollTop);
  };

  useEffect(() => {
    refFields.current.scrollTo(scrollX, 0);
  }, [scrollX]);

  useEffect(() => {
    refTimeslots.current.scrollTo(0, scrollY);
  }, [scrollY]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className={styles.mainDiv}>
        <div className={styles.divButtons}>
          <Button
            onClick={handleAddField}
            color="primary"
            variant="contained"
            className={styles.button}
            type="submit"
            endIcon="Add"
            disabled={isAddingGames}
          >
            {t('field')}
          </Button>
          <Button
            onClick={handleAddTimeslot}
            color="primary"
            variant="contained"
            className={styles.button}
            type="submit"
            endIcon="Add"
            disabled={isAddingGames}
          >
            {t('time_slot')}
          </Button>
        </div>
        <div className={styles.displayFields} ref={refFields}>
          <div style={{ width: `${fields?.length * 192 + 20}px` }}>
            <ReactGridLayout
              className={styles.gridLayoutFields}
              width={fields?.length * 192}
              cols={fields?.length}
              rowHeight={84}
              maxRows={1}
              margin={[20, 0]}
              layout={layoutFields}
            >
              {Fields}
            </ReactGridLayout>
          </div>
        </div>
        <div className={styles.displayTimeslots} ref={refTimeslots}>
          <div style={{ height: `${timeslots?.length * 84 + 40}px` }}>
            <ReactGridLayout
              className={styles.gridLayoutTimes}
              width={192}
              cols={fields?.length}
              rowHeight={64}
              maxRows={timeslots?.length}
              margin={[0, 20]}
              layout={layoutTimes}
            >
              {Times}
            </ReactGridLayout>
          </div>
        </div>
        <div className={styles.displayGrid} onScroll={gridScroll} ref={ref}>
          <div
            style={{
              width: `${fields?.length * 192}px`,
              height: `${timeslots?.length * 84}px`,
            }}
          >
            <ReactGridLayout
              className={styles.gridLayout}
              width={fields?.length * 192}
              cols={fields?.length}
              rowHeight={64}
              maxRows={timeslots?.length}
              compactType={null}
              margin={[20, 20]}
              onDragStop={onDragStop}
              layout={layout}
              useCSSTransforms
              preventCollision
              isResizable={false}
            >
              {Games}
              {AddGames}
            </ReactGridLayout>
          </div>
        </div>
      </div>

      <Tooltip title={t('back')}>
        <Fab color="primary" onClick={handleBack} className={classes.fabBack}>
          <Icon icon="ArrowBack" />
        </Fab>
      </Tooltip>
      {isAddingGames ? (
        <Tooltip title={t('move_mode')}>
          <Fab onClick={handleMoveMode} className={classes.fabAdd}>
            <Icon icon="OpenWith" />
          </Fab>
        </Tooltip>
      ) : (
        <Tooltip title={t('add_mode')}>
          <Fab onClick={handleAddMode} className={classes.fabAdd}>
            <Icon icon="Add" />
          </Fab>
        </Tooltip>
      )}
      <Tooltip title={madeChanges ? t('cancel') : ''}>
        <Fab color="secondary" onClick={handleCancel} className={classes.fabCancel} disabled={!madeChanges}>
          <Icon icon="Cancel" />
        </Fab>
      </Tooltip>
      <Tooltip title={madeChanges ? t('save') : ''}>
        <Fab color="primary" onClick={handleSave} className={classes.fabSave} disabled={!madeChanges}>
          <Icon icon="SaveIcon" />
        </Fab>
      </Tooltip>

      {/*------------------------------------------------------------------        */}
      <Tooltip title="clear">
        <Fab onClick={clearHistory} className={classes.clear}>
          <Icon icon="Reorder" />
        </Fab>
      </Tooltip>

      <Tooltip title={canUndo ? t('undo') : ''}>
        <Fab onClick={undoCommand} className={classes.fabUndo} disabled={!canUndo}>
          <Icon icon="Undo" />
        </Fab>
      </Tooltip>
      <Tooltip title={canRedo ? t('redo') : ''}>
        <Fab onClick={redoCommand} className={classes.fabRedo} disabled={!canRedo}>
          <Icon icon="Redo" />
        </Fab>
      </Tooltip>
      {/*------------------------------------------------------------------        */}

      <AlertDialog
        open={alertDialog}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
        description={t('quit_interactive_tool_confirmation')}
        title={t('quit_interactive_tool')}
      />
      <AddGame
        eventId={eventId}
        isOpen={addGameDialog}
        onClose={() => setAddGameDialog(false)}
        createCard={createCard}
        field={addGameField}
        timeslot={addGameTimeslot}
        phases={phases}
        teams={teams}
      />
      <AddField isOpen={addFieldDialog} onClose={() => setAddFieldDialog(false)} addFieldToGrid={addFieldToGrid} />
      <AddTimeSlot
        isOpen={addTimeslotDialog}
        onClose={() => setAddTimeslotDialog(false)}
        addTimeslotToGrid={addTimeslotToGrid}
      />
    </div>
  );
}
