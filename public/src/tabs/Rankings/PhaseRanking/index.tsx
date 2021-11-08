import React, { useEffect, useState, useContext } from 'react';
import { PHASE_STATUS_ENUM } from '../../../../common/enums';
import Ranking from '../Ranking';
import { updateRanking } from '../RankingFunctions';
import { useTranslation } from 'react-i18next';
import { Store } from '../../../Store';
import { getPhases as getPhasesApi, getPhasesGameAndTeams } from '../../../actions/service/entity/get';
import { Phase, PhaseGames, Ranking as IRanking } from '../../../../../typescript/types';
import { IPhase } from '../../../../../typescript/event';
import NotStartedRanking from '../NotStartedRanking';

interface IProps {
  phase: IPhase;
}

const PhaseRankings: React.FunctionComponent<IProps> = (props) => {
  const { phase } = props;

  if (!phase.rankings.length) {
    return null;
  }

  if (phase.status === PHASE_STATUS_ENUM.NOT_STARTED) {
    return <NotStartedRanking phase={phase} />;
  }

  return <p>Salut</p>;

  return (
    <div>
      
        <Ranking
          key={phase.id}
          ranking={phase.ranking}
          title={phase.title}
          subtitle={phase.subtitle}
          allTeamsEqual={phase.allTeamsEqual}
          withStats
        />
      ) : (
        <Ranking
          key={phase.id}
          ranking={phase.ranking}
          title={phase.title}
          subtitle={phase.subtitle}
          withStats={false}
        />
      )}
    </div>
  );
};
export default PhaseRankings;
