import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import { LoadingSpinner, Icon, Button } from '../../components/Custom';
import { Store, ACTION_ENUM } from '../../Store';
import { STATUS_ENUM, SEVERITY_ENUM, TABS_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import styles from './ScheduleInteractiveTool.module.css';
import GameCard from './GameCard';

import { v4 as uuidv4 } from 'uuid';
import RGL from 'react-grid-layout';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';

import loadable from '@loadable/component';

const AddFieldInteractiveTool = loadable(() => import('./AddFieldInteractiveTool'));
const AddTimeSlotInteractiveTool = loadable(() => import('./AddTimeSlotInteractiveTool'));
const AddGame = loadable(() => import('./AddGame'));
const AlertDialog = loadable(() => import('../../components/Custom/Dialog/AlertDialog'));

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
  button: {
    margin: 6,
  },
}));

var globalState = {
  fieldState: [],
  gameState: [],
  timeSlotState: [],
};

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

  const [undoLog, setUndoLog] = useState([]);
  const [redoLog, setRedoLog] = useState([]);

  const [madeChanges, setMadeChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingGames, setIsAddingGames] = useState(false);

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

  class addFieldCommand {
    newState = [];
    previousState = [];
    field;
    type = 'fieldCommand';

    constructor(pState, name) {
      this.previousState = pState;
      this.field = {
        id: uuidv4(),
        field: name,
      };
      this.newState = this.previousState.concat([this.field]);
    }

    execute() {
      globalState.fieldState = this.newState;
      setFields(globalState.fieldState);
    }

    undo() {
      globalState.fieldState = this.previousState;
      setFields(globalState.fieldState);
    }
    redo() {
      this.execute();
    }
  }

  class addGameCommand {
    newState = [];
    previousState = [];
    game;
    type = 'gameCommand';

    constructor(pState, game) {
      this.previousState = pState;
      this.game = game;
      this.newState = this.previousState.concat([game]);
    }

    execute() {
      globalState.gameState = this.newState;
      setGames(globalState.gameState);
    }

    undo() {
      globalState.gameState = this.previousState;
      setGames(globalState.gameState);
    }
    redo() {
      this.execute();
    }
  }

  class addTimeSlotCommand {
    date;
    newState = [];
    previousState = [];
    type = 'timeSlotCommand';

    constructor(pState, realDate) {
      this.date = {
        id: uuidv4(),
        date: realDate,
      };
      this.previousState = pState;
      this.newState = this.previousState.concat([this.date]);
    }

    execute() {
      globalState.timeSlotState = this.newState;
      setTimeslots(globalState.timeSlotState);
    }

    undo() {
      globalState.timeSlotState = this.previousState;
      setTimeslots(globalState.timeSlotState);
    }

    redo() {
      this.execute();
    }
  }

  const canUndo = useMemo(() => undoLog.length > 0, [undoLog.length]);
  const canRedo = useMemo(() => redoLog.length > 0, [redoLog.length]);

  const getData = async () => {
    setIsLoading(true);
    if (!eventId) {
      return;
    }
    const { data } = await api(formatRoute('/api/entity/interactiveTool', null, { eventId }));

    globalState.timeSlotState = data.timeSlots.map((t) => ({
      id: t.id,
      date: new Date(t.date).getTime(),
    }));

    globalState.fieldState = data.fields.map((f) => ({
      id: f.id,
      field: f.field,
    }));

    globalState.gameState = data.games.map((g) => ({
      field_id: g.field_id,
      timeslot_id: g.timeslot_id,
      phase_id: g.phase_id,
      teams: g.teams,
      id: g.id,
      x: data.fields.findIndex((f) => f.id === g.field_id),
      y: data.timeSlots.findIndex((ts) => ts.id === g.timeslot_id),
    }));

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
        name: t.name,
      }))
    );

    setFields(globalState.fieldState);
    setTimeslots(globalState.timeSlotState);
    setGames(globalState.gameState);
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
          minW: 1,
          maxW: 2,
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
    if (oldItem.x !== newItem.x || oldItem.y !== newItem.y) {
      setMadeChanges(true);
    }
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
    const gamesToAdd = undoLog.filter((command) => command.type === 'gameCommand').map((g) => g.game);
    const fieldsToAdd = undoLog.filter((command) => command.type === 'fieldCommand').map((f) => f.field);
    const timeSlotToAdd = undoLog.filter((command) => command.type === 'timeSlotCommand').map((t) => t.date);

    const { status, data } = await api(`/api/entity/addAllInteractiveTool`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        gamesArray: gamesToAdd,
        fieldsArray: fieldsToAdd,
        timeslotsArray: timeSlotToAdd,
      }),
    });

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

    if (
      status === STATUS_ENUM.ERROR ||
      status === STATUS_ENUM.UNAUTHORIZED ||
      res.status === STATUS_ENUM.ERROR ||
      res.status === STATUS_ENUM.UNAUTHORIZED
    ) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 3000,
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

    setUndoLog([]);
    setRedoLog([]);
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
    const { teamsId } = game;

    const teamsNames = teams.filter((t) => t.value === teamsId[0] || t.value === teamsId[1]);
    teamsNames.length === 1 ? teamsNames.push(teamsNames[0]) : '';

    const newGame = {
      ...game,
      teams: teamsNames,
      id: uuidv4(),
      x: gridX,
      y: gridY,
    };

    const command = new addGameCommand(games, newGame);
    executeCommand(command);

    // remove old "+" button
    setButtonsAdd(buttonsAdd.filter((btn) => btn.i !== `+${gridX}:${gridY}`));

    // set new layout
    setLayout(
      layout
        .filter((item) => item.i !== `+${gridX}:${gridY}`)
        .concat([
          {
            i: newGame.id,
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
  const addTimeslotToGrid = (realDate) => {
    const command = new addTimeSlotCommand(timeslots, realDate);
    executeCommand(command);
  };

  const addFieldToGrid = (field) => {
    const command = new addFieldCommand(fields, field);
    executeCommand(command);
  };

  function executeCommand(command) {
    setMadeChanges(true);
    setRedoLog([]);
    command.execute();
    undoLog.push(command);
  }

  function undoCommand() {
    const command = undoLog[undoLog.length - 1];
    command.undo();
    undoLog.pop();
    redoLog.push(command);
  }

  function redoCommand() {
    const command = redoLog[redoLog.length - 1];
    command.redo();
    redoLog.pop();
    undoLog.push(command);
  }

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
            className={classes.button}
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
            className={classes.button}
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
          <div style={{ height: `${timeslots?.length * 84}px` }}>
            <ReactGridLayout
              className={styles.gridLayoutTimes}
              width={500}
              cols={fields?.length}
              rowHeight={64}
              maxRows={2}
              margin={[0, 20]}
              layout={layoutTimes}
              isResizable={false}
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
      <AddFieldInteractiveTool
        isOpen={addFieldDialog}
        onClose={() => setAddFieldDialog(false)}
        addFieldToGrid={addFieldToGrid}
      />
      <AddTimeSlotInteractiveTool
        isOpen={addTimeslotDialog}
        onClose={() => setAddTimeslotDialog(false)}
        addTimeslotToGrid={addTimeslotToGrid}
      />
    </div>
  );
}
