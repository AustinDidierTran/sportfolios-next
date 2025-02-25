import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Icon from '../../components/Custom/Icon';
import Button from '../../components/Custom/Button';
import { Store, ACTION_ENUM } from '../../Store';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM, TABS_ENUM } from '../../../common/enums';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import styles from './ScheduleInteractiveTool.module.css';
import { v4 as uuidv4 } from 'uuid';
import RGL from 'react-grid-layout';
import { formatRoute } from '../../utils/stringFormats';
import Hotkeys from 'react-hot-keys';
import dynamic from 'next/dynamic';
import { COLORS } from '../../utils/colors';

const Timeslot = dynamic(() => import('./Timeslot'));
const Field = dynamic(() => import('./Field'));
const GameCard = dynamic(() => import('./GameCard'));
const SuggestedGames = dynamic(() => import('./SuggestedGames'));
const AddFieldInteractiveTool = dynamic(() => import('./AddFieldInteractiveTool'));
const AddTimeSlotInteractiveTool = dynamic(() => import('./AddTimeSlotInteractiveTool'));
const AddGame = dynamic(() => import('./AddGame'));
const AlertDialog = dynamic(() => import('../../components/Custom/Dialog/AlertDialog'));

const ReactGridLayout = RGL;

const useStyles = makeStyles((theme) => ({
  fabBack: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(4),
    zIndex: 100,
    color: COLORS.white,
  },
  fabAdd: {
    position: 'absolute',
    bottom: theme.spacing(5) + 56,
    right: theme.spacing(4),
    zIndex: 100,
    color: COLORS.white,
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
    color: COLORS.white,
  },
  fabSave: {
    position: 'absolute',
    bottom: theme.spacing(9) + 168,
    right: theme.spacing(4),
    zIndex: 100,
    color: COLORS.white,
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
  fabSuggested: {
    position: 'absolute',
    bottom: theme.spacing(15) + 336,
    right: theme.spacing(4),
    zIndex: 100,
    color: 'green',
  },
  button: {
    margin: 6,
  },
  suggestedGameBox: {
    position: 'absolute',
    top: '74px',
    right: 0,
    zIndex: 100,
  },
}));

export default function ScheduleInteractiveTool() {
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const classes = useStyles();
  const { t } = useTranslation();

  const [phases, setPhases] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [games, setGames] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [fields, setFields] = useState([]);

  const [suggestedGames, setSuggestedGames] = useState([]);
  const [index, setIndex] = useState(0);

  const [initialFields, setInitialFields] = useState([]);
  const [initialGames, setInitialGames] = useState([]);
  const [initialTimeslots, setInitialTimeslots] = useState([]);

  const [undoLog, setUndoLog] = useState([]);
  const [redoLog, setRedoLog] = useState([]);

  const [madeChanges, setMadeChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingGames, setIsAddingGames] = useState(false);
  const [isSuggestedGames, setIsSuggestedGames] = useState(false);

  const [buttonsAdd, setButtonsAdd] = useState([]);

  const [layout, setLayout] = useState([]);
  const [initialLayout, setInitialLayout] = useState([]);
  const [layoutTimes, setLayoutTimes] = useState([]);
  const [layoutFields, setLayoutFields] = useState([]);

  const [alertDialog, setAlertDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [addGameDialog, setAddGameDialog] = useState(false);
  const [addGameField, setAddGameField] = useState({});
  const [addGameTimeslot, setAddGameTimeslot] = useState({});
  const [addFieldDialog, setAddFieldDialog] = useState(false);
  const [addTimeslotDialog, setAddTimeslotDialog] = useState(false);

  const onKeyDown = (keyName, e) => {
    e.preventDefault();
    if ((keyName === 'ctrl+z' || keyName === 'command+z') && undoLog.length !== 0) {
      undoCommand();
    }
    if ((keyName === 'ctrl+y' || keyName === 'command+shift+z') && redoLog.length !== 0) {
      redoCommand();
    }
  };

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
      //minWidth fix
      if (fields.length === 1 && fields[0].id === '-1') {
        setFields([]);
        setLayoutFields([]);
        this.newState = this.newState.filter((f) => f.id !== '-1');
      }
      setFields(this.newState);
    }

    undo() {
      setFields(this.previousState);
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
      setGames(this.newState.filter((game) => game.fieldId && game.timeslotId));
    }

    undo(isAddingGames, isSuggestedGames) {
      if (isAddingGames || isSuggestedGames) {
        setButtonsAdd(
          buttonsAdd
            .filter((btn) => btn.i !== `+${this.game.x}:${this.game.y}`)
            .concat([
              {
                i: `+${this.game.x}:${this.game.y}`,
                x: this.game.x,
                y: this.game.y,
                w: 1,
                h: 1,
                static: true,
              },
            ])
        );
      }

      setLayout((layout) => {
        const newLayout = layout
          .filter((item) => item.x !== this.game.x && item.y !== this.game.y)
          .concat([
            {
              i: `+${this.game.x}:${this.game.y}`,
              x: this.game.x,
              y: this.game.y,
              w: 1,
              h: 1,
              static: true,
            },
          ]);
        return newLayout;
      });

      if (this.game.isSuggestedGame) {
        const newSuggestedGames = suggestedGames;
        newSuggestedGames.splice(this.game.index, 0, this.game.suggestion);
        setSuggestedGames(newSuggestedGames);
      }

      setGames(this.previousState);
    }
    redo(isAddingGames, isSuggestedGames) {
      if (isAddingGames || isSuggestedGames) {
        setButtonsAdd(buttonsAdd.filter((btn) => btn.i !== `+${this.game.x}:${this.game.y}`));
      }

      setLayout((layout) => {
        const newLayout = layout
          .filter((item) => item.i !== `+${this.game.x}:${this.game.y}`)
          .concat([
            {
              i: this.game.id,
              x: this.game.x,
              y: this.game.y,
              w: 1,
              h: 1,
              isBounded: true,
            },
          ]);
        return newLayout;
      });

      if (this.game.isSuggestedGame) {
        const newSuggestedGames = suggestedGames;
        newSuggestedGames.splice(this.game.index, 1);
        setSuggestedGames(newSuggestedGames);
      }
      this.execute();
    }
  }

  class moveGameCommand {
    game;
    oldCoord;
    newCoord;
    type = 'moveCommand';

    constructor(oldCoord, newCoord, movedGame) {
      this.game = movedGame;
      this.oldCoord = oldCoord;
      this.newCoord = newCoord;
    }

    execute() {
      setGames((games) => {
        const index = games.findIndex((g) => g.x === this.oldCoord.x && g.y === this.oldCoord.y);
        games[index] = {
          ...games[index],
          x: this.newCoord.x,
          y: this.newCoord.y,
        };
        return games;
      });

      this.game.x = this.newCoord.x;
      this.game.y = this.newCoord.y;

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
      setLayout(gameArr);
    }

    undo() {
      setGames((games) => {
        const index = games.findIndex((g) => g.x === this.newCoord.x && g.y === this.newCoord.y);
        games[index] = {
          ...games[index],
          x: this.oldCoord.x,
          y: this.oldCoord.y,
        };
        return games;
      });

      this.game.x = this.oldCoord.x;
      this.game.y = this.oldCoord.y;

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
      setLayout(gameArr);
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
      setTimeslots(this.newState);
    }

    undo() {
      setTimeslots(this.previousState);
    }

    redo() {
      this.execute();
    }
  }

  const canUndo = useMemo(() => undoLog.length > 0, [undoLog.length]);
  const canRedo = useMemo(() => redoLog.length > 0, [redoLog.length]);

  const setNewIndex = (newIndex) => {
    setIndex(newIndex);
  };

  const getData = async () => {
    setIsLoading(true);
    if (!eventId) {
      return;
    }
    const { data } = await api(formatRoute('/api/entity/interactiveTool', null, { eventId }), { method: 'GET' });

    const timeslots = data.timeSlots.map((t) => ({
      id: t.id,
      date: new Date(t.date).getTime(),
    }));

    setTimeslots(timeslots);
    setInitialTimeslots(timeslots);

    const fieldsData = data.fields.map((f) => ({
      id: f.id,
      field: f.field,
    }));

    //minWidth fix
    if (fieldsData.length === 0) {
      const placeHolderField = {
        i: '-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        static: true,
      };

      setFields([
        {
          id: '-1',
          field: ' ',
        },
      ]);
      setLayoutFields([placeHolderField]);
    } else {
      setFields(fieldsData);
      setInitialFields(fieldsData);
    }
    const allGames = data.games.map((g) => ({
      fieldId: g.fieldId,
      timeslotId: g.timeslotId,
      phaseId: g.phaseId,
      phaseName: g.phaseName,
      rankings: g.positions,
      id: g.id,
      x: data.fields.findIndex((f) => f.id === g.fieldId),
      y: data.timeSlots.findIndex((ts) => ts.id === g.timeslotId),
    }));

    const games = allGames.filter((game) => game.fieldId && game.timeslotId);
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

    setInitialLayout(gameArr);
    setInitialGames(games);
    setGames(games);

    setPhases(
      data.phases.map((p) => ({
        value: p.id,
        id: p.id,
        display: p.name,
        name: p.name,
        ranking: p.ranking,
        order: p.phaseOrder,
        status: p.status,
      }))
    );

    const allRankings = data.phases.reduce((prev, curr) => {
      const withName = curr.ranking.map((r) => ({
        ...r,
        value: r.rankingId,
        display: r.rosterId ? `${r.initialPosition}. ${curr.name} (${r.name})` : `${r.initialPosition}. ${curr.name}`,
        name: r.rosterId ? `${r.initialPosition}. ${curr.name} (${r.name})` : `${r.initialPosition}. ${curr.name}`,
        teamName: r.name ? r.name : '',
      }));
      return prev.concat(withName);
    }, []);

    setRankings(allRankings);
    setSuggestedGames(allGames.filter((game) => !game.fieldId || !game.timeslotId));
    setIsLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      getData();
    }
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
    setLayout(gameArr);
  }, [fields, timeslots, games]);

  const onDragStop = (layout, oldItem, newItem) => {
    if (oldItem.x !== newItem.x || oldItem.y !== newItem.y) {
      const oldCoord = {
        x: oldItem.x,
        y: oldItem.y,
      };
      const newCoord = {
        x: newItem.x,
        y: newItem.y,
      };
      const oldGameIndex = games.findIndex((g) => g.x === oldItem.x && g.y === oldItem.y);
      const oldGame = games[oldGameIndex];
      const command = new moveGameCommand(oldCoord, newCoord, oldGame);

      executeCommand(command);
    }
  };

  const handleCancel = () => {
    setCancelDialog(true);
  };

  const handleSave = async () => {
    const allGamesToAdd = undoLog.filter((command) => command.type === 'gameCommand').map((c) => c.game);
    const gamesToAdd = allGamesToAdd.filter((game) => !game.isSuggestedGame);
    const suggestedGames = allGamesToAdd.filter((game) => game.isSuggestedGame);
    const fieldsToAdd = undoLog
      .filter((command) => command.type === 'fieldCommand' && command.field.id !== '-1')
      .map((c) => c.field);
    const timeSlotToAdd = undoLog.filter((command) => command.type === 'timeSlotCommand').map((c) => c.date);
    const gamesMoved = undoLog.filter((command) => command.type === 'moveCommand').map((c) => c.game);

    const { status } = await api(`/api/entity/addAllInteractiveTool`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        gamesArray: gamesToAdd,
        fieldsArray: fieldsToAdd,
        timeslotsArray: timeSlotToAdd,
      }),
    });

    suggestedGames.forEach((game) => {
      if (!gamesMoved.includes((g) => g.id === game.id)) {
        gamesMoved.push(game);
      }
    });

    const gamesToUpdate = gamesMoved.reduce((prev, game) => {
      const index = prev.findIndex((p) => p.id === game.id);

      if (index !== -1) {
        prev[index] = {
          id: game.id,
          timeslotId: timeslots[game.y].id,
          fieldId: fields[game.x].id,
          x: game.x,
          y: game.y,
        };
        return prev;
      }

      return [
        ...prev,
        {
          id: game.id,
          timeslotId: timeslots[game.y].id,
          fieldId: fields[game.x].id,
          x: game.x,
          y: game.y,
        },
      ];
    }, []);

    const res = await api(`/api/entity/updateGamesInteractiveTool`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        games: gamesToUpdate,
      }),
    });

    if (
      status === REQUEST_STATUS_ENUM.ERROR ||
      status === REQUEST_STATUS_ENUM.UNAUTHORIZED ||
      res.status === REQUEST_STATUS_ENUM.ERROR ||
      res.status === REQUEST_STATUS_ENUM.UNAUTHORIZED
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

    setIsAddingGames(false);
    setIsSuggestedGames(false);
    setMadeChanges(false);

    setButtonsAdd([]);
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

  const cancelDialogSubmit = () => {
    const initGames = initialGames.map((g) => {
      const layoutGame = initialLayout.find((l) => l.i === g.id);
      return {
        ...g,
        x: layoutGame.x,
        y: layoutGame.y,
      };
    });
    setLayout(initialLayout);

    setTimeslots(initialTimeslots);
    setGames(initGames);
    if (initialFields.length > 0) {
      setFields(initialFields);
    } else {
      setFields([
        {
          id: '-1',
          field: ' ',
        },
      ]);
    }

    setIsAddingGames(false);
    setIsSuggestedGames(false);
    setMadeChanges(false);

    setButtonsAdd([]);
    setUndoLog([]);
    setRedoLog([]);

    setCancelDialog(false);
  };

  const cancelDialogCancel = () => {
    setCancelDialog(false);
  };

  const handleDialogCancel = () => {
    setAlertDialog(false);
  };

  const handleMoveMode = () => {
    setIsAddingGames(false);
    setIsSuggestedGames(false);
    setButtonsAdd([]);
    setLayout(layout.filter((item) => item.i[0] !== '+'));
  };

  const handleAddMode = () => {
    setIsAddingGames(true);
    const keepButtons = isSuggestedGames;
    setIsSuggestedGames(false);
    const buttonsToAdd = [];

    if (!keepButtons) {
      //minWidth fix
      if (fields.length === 1 && fields[0].id === '-1') {
        setButtonsAdd([]);
        setLayout(layout.concat(buttonsToAdd));
      } else {
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
      }
    }
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

  const handleSuggestedGamesMode = () => {
    const keepButtons = isAddingGames;
    const suggestMode = !isSuggestedGames;
    setIsAddingGames(false);
    setIsSuggestedGames(suggestMode);

    if (suggestMode) {
      if (!keepButtons) {
        const buttonsToAdd = [];
        //minWidth fix
        if (fields.length === 1 && fields[0].id === '-1') {
          setButtonsAdd([]);
          setLayout(layout.concat(buttonsToAdd));
        } else {
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
        }
      }
    } else {
      setButtonsAdd([]);
      setLayout(layout.filter((item) => item.i[0] !== '+'));
    }
  };

  const handleAddSuggestedGame = (x, y) => {
    const suggestion = suggestedGames[index];
    const fieldId = fields[x].id;
    const timeslotId = timeslots[y].id;

    if (!suggestion) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_game_suggestions'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 3000,
      });
      return;
    }
    if (index === suggestedGames.length - 1) {
      setNewIndex(0);
    }
    const newSuggestedGames = suggestedGames;
    newSuggestedGames.splice(index, 1);
    setSuggestedGames(newSuggestedGames);

    createCard({
      fieldId,
      timeslotId,
      rankings: suggestion.rankings,
      phaseId: suggestion.phaseId,
      id: suggestion.id,
      suggestion,
      index,
      isSuggestedGame: true,
    });
  };

  const createCard = (game) => {
    const gridX = fields.findIndex((f) => f.id === game.fieldId);
    const gridY = timeslots.findIndex((ts) => ts.id === game.timeslotId);

    const newGame = {
      ...game,
      id: game.isSuggestedGame ? game.id : uuidv4(),
      x: gridX,
      y: gridY,
    };

    setButtonsAdd(buttonsAdd.filter((btn) => btn.i !== `+${gridX}:${gridY}`));

    setLayout((layout) => {
      const newLayout = layout
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
        ]);
      return newLayout;
    });

    const command = new addGameCommand(games, newGame);
    executeCommand(command);
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
    setUndoLog(undoLog.concat(command));
  }

  function undoCommand() {
    const command = undoLog[undoLog.length - 1];
    command.undo(isSuggestedGames, isAddingGames);
    undoLog.pop();
    setRedoLog(redoLog.concat(command));
  }

  function redoCommand() {
    const command = redoLog[redoLog.length - 1];
    command.redo(isSuggestedGames, isAddingGames);
    redoLog.pop();
    setUndoLog(undoLog.concat(command));
  }

  const AddGames = buttonsAdd.map((b) => (
    <div
      className={styles.divAddGame}
      key={b.i}
      data-grid={{
        i: b.i,
        x: b.x,
        y: b.y,
        w: 1,
        h: 1,
        static: true,
      }}
      onClick={() => (isSuggestedGames ? handleAddSuggestedGame(b.x, b.y) : handleAddGameAt(b.x, b.y))}
    >
      <Icon icon="Add" color={COLORS.turquoise} />
    </div>
  ));

  const Fields = fields.map((f) => (
    <div key={f.id}>
      <Field update={getData} field={f} games={games} />
    </div>
  ));

  const Times = timeslots.map((t) => (
    <div key={t.id}>
      <Timeslot update={getData} timeslot={t} games={games} />
    </div>
  ));

  const Games = games.map((g) => (
    <div
      className={styles.itemDiv}
      key={g.id}
      data-grid={{
        i: g.id,
        x: g.x,
        y: g.y,
        w: 1,
        h: 1,
        isBounded: true,
      }}
    >
      <GameCard
        ranking1={g.rankings[0]}
        ranking2={g.rankings[1]}
        fields={fields}
        timeSlots={timeslots}
        x={g.x}
        y={g.y}
        phase={phases.find((p) => g.phaseId === p.value)}
      />
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
            disabled={isAddingGames || isSuggestedGames}
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
            disabled={isAddingGames || isSuggestedGames}
          >
            {t('time_slot')}
          </Button>
        </div>
        <div className={styles.displayFields} ref={refFields}>
          <div style={{ width: `${fields?.length * 192 + 200}px`, paddingRight: '200px' }}>
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
          <div style={{ height: `${timeslots?.length * 84 + 200}px`, paddingBottom: '100px' }}>
            <ReactGridLayout
              className={styles.gridLayoutTimes}
              maxCols={1}
              rowHeight={64}
              width={2300}
              maxRows={timeslots?.length}
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
              width: `${fields?.length * 192 + 200}px`,
              height: `${timeslots?.length * 84 + 200}px`,
              paddingBottom: '100px',
              paddingRight: '200px',
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
        <Tooltip title={t('add.add_mode')}>
          <Fab onClick={handleAddMode} className={classes.fabAdd}>
            <Icon icon="Add" />
          </Fab>
        </Tooltip>
      )}

      <Tooltip title={t('suggest_game_mode')}>
        <Fab onClick={handleSuggestedGamesMode} className={classes.fabSuggested}>
          <Icon icon="FlashOn" />
        </Fab>
      </Tooltip>

      <Tooltip title={madeChanges ? t('cancel_all') : ''}>
        <Fab color="secondary" onClick={handleCancel} className={classes.fabCancel} disabled={!madeChanges}>
          <Icon icon="Cancel" />
        </Fab>
      </Tooltip>

      <Tooltip title={madeChanges ? t('save') : ''}>
        <Fab color="primary" onClick={handleSave} className={classes.fabSave} disabled={!madeChanges}>
          <Icon icon="SaveIcon" />
        </Fab>
      </Tooltip>

      <Hotkeys keyName="ctrl+z, ctrl+y, command+z, command+shift+z" onKeyDown={onKeyDown.bind(this)}>
        <Tooltip title={canUndo ? t('undo') + ': CTRL+Z' : ''}>
          <Fab onClick={undoCommand} className={classes.fabUndo} disabled={!canUndo}>
            <Icon icon="Undo" />
          </Fab>
        </Tooltip>
        <Tooltip title={canRedo ? t('redo') + ': CTRL+Y' : ''}>
          <Fab onClick={redoCommand} className={classes.fabRedo} disabled={!canRedo}>
            <Icon icon="Redo" />
          </Fab>
        </Tooltip>
      </Hotkeys>

      {isSuggestedGames && (
        <div className={classes.suggestedGameBox}>
          <SuggestedGames suggestions={suggestedGames} index={index} setNewIndex={setNewIndex} />
        </div>
      )}
      <AlertDialog
        open={alertDialog}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
        description={t('quit_interactive_tool_confirmation')}
        title={t('quit_interactive_tool')}
      />
      <AlertDialog
        open={cancelDialog}
        onSubmit={cancelDialogSubmit}
        onCancel={cancelDialogCancel}
        description={t('cancel_changes')}
        title={t('cancel_all')}
      />
      <AddGame
        eventId={eventId}
        isOpen={addGameDialog}
        onClose={() => setAddGameDialog(false)}
        createCard={createCard}
        field={addGameField}
        timeslot={addGameTimeslot}
        phases={phases.sort((a, b) => a.order - b.order)}
        rankings={rankings}
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
