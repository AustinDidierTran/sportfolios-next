import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { formatDate } from '../../utils/stringFormats';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Icon from '../../components/Custom/Icon';
import Button from '../../components/Custom/Button';
import { Store, ACTION_ENUM } from '../../Store';
import { STATUS_ENUM, SEVERITY_ENUM, TABS_ENUM, PHASE_STATUS_ENUM } from '../../../common/enums';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import styles from './ScheduleInteractiveTool.module.css';
import GameCard from './GameCard';
import SuggestedGames from './SuggestedGames';
import { suggestGames } from './suggestedGamesFunction';

import { v4 as uuidv4 } from 'uuid';
import RGL from 'react-grid-layout';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';

import Hotkeys from 'react-hot-keys';

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
    bottom: theme.spacing(3),
    right: theme.spacing(90),
    zIndex: 100,
  },
}));

export default function ScheduleInteractiveTool() {
  const router = useRouter();
  const { id: eventId } = router.query;
  const classes = useStyles();
  const { t } = useTranslation();

  const { dispatch } = useContext(Store);

  const [phases, setPhases] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [games, setGames] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [fields, setFields] = useState([]);

  const [suggestedGames, setSuggestedGames] = useState([]);

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
      setGames(this.newState);
    }

    undo() {
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

      setSuggestedGames(
        suggestGames(
          rankings,
          phases.sort((a, b) => a.phase_order - b.phase_order).filter((p) => p.status !== PHASE_STATUS_ENUM.DONE),
          this.previousState
        )
      );
      setGames(this.previousState);
    }
    redo() {
      // remove old "+" button
      setButtonsAdd(buttonsAdd.filter((btn) => btn.i !== `+${this.game.x}:${this.game.y}`));

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

      setSuggestedGames(
        suggestGames(
          rankings,
          phases.sort((a, b) => a.phase_order - b.phase_order).filter((p) => p.status !== PHASE_STATUS_ENUM.DONE),
          this.newState
        )
      );
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

  let index = 0;

  const setNewIndex = (newIndex) => {
    index = newIndex;
  };

  const getData = async () => {
    setIsLoading(true);
    if (!eventId) {
      return;
    }
    const { data } = await api(formatRoute('/api/entity/interactiveTool', null, { eventId }));

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

    const games = data.games.map((g) => ({
      field_id: g.field_id,
      timeslot_id: g.timeslot_id,
      phase_id: g.phase_id,
      phaseName: g.phaseName,
      rankings: g.positions,
      id: g.id,
      x: data.fields.findIndex((f) => f.id === g.field_id),
      y: data.timeSlots.findIndex((ts) => ts.id === g.timeslot_id),
    }));

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
        ranking: p.ranking,
        order: p.phase_order,
        status: p.status,
      }))
    );

    const allRankings = data.phases.reduce((prev, curr) => {
      const withName = curr.ranking.map((r) => ({
        ...r,
        value: r.ranking_id,
        display: r.roster_id
          ? `${r.initial_position} - ${curr.name} (${r.name})`
          : `${r.initial_position} - ${curr.name}`,
        name: r.roster_id ? `${r.initial_position} - ${curr.name} (${r.name})` : `${r.initial_position} - ${curr.name}`,
        teamName: r.name ? r.name : '',
      }));
      return prev.concat(withName);
    }, []);

    setRankings(allRankings);

    setSuggestedGames(
      suggestGames(
        allRankings,
        data.phases.sort((a, b) => a.phase_order - b.phase_order).filter((p) => p.status !== PHASE_STATUS_ENUM.DONE),
        games
      )
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
    const gamesToAdd = undoLog.filter((command) => command.type === 'gameCommand').map((c) => c.game);
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

    const gamesToUpdate = gamesMoved.reduce((prev, game) => {
      const index = prev.findIndex((p) => p.id === game.id);

      if (index !== -1) {
        prev[index] = {
          id: game.id,
          timeslot_id: timeslots[game.y].id,
          field_id: fields[game.x].id,
          x: game.x,
          y: game.y,
        };
        return prev;
      }

      return [
        ...prev,
        {
          id: game.id,
          timeslot_id: timeslots[game.y].id,
          field_id: fields[game.x].id,
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
    setIsSuggestedGames(!isSuggestedGames);

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
    const field_id = fields[x].id;
    const timeslot_id = timeslots[y].id;

    if (!suggestion) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_game_suggestions'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 3000,
      });
      return;
    }
    createCard({
      field_id,
      timeslot_id,
      rankings: suggestion.rankings,
      phase_id: suggestion.phaseId,
    });
  };

  const createCard = (game) => {
    const gridX = fields.findIndex((f) => f.id === game.field_id);
    const gridY = timeslots.findIndex((ts) => ts.id === game.timeslot_id);

    const newGame = {
      ...game,
      rankings: game.rankings,
      id: uuidv4(),
      x: gridX,
      y: gridY,
    };

    setSuggestedGames(
      suggestGames(
        rankings,
        phases.sort((a, b) => a.phase_order - b.phase_order).filter((p) => p.status !== PHASE_STATUS_ENUM.DONE),
        games.concat([newGame])
      )
    );

    // remove old "+" button
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
    command.undo();
    undoLog.pop();
    setRedoLog(redoLog.concat(command));
  }

  function redoCommand() {
    const command = redoLog[redoLog.length - 1];
    command.redo();
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
        phase={phases.find((p) => g.phase_id === p.value)}
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
          <SuggestedGames suggestions={suggestedGames} setNewIndex={setNewIndex}></SuggestedGames>
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
