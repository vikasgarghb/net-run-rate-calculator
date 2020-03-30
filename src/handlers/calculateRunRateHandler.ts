enum MatchType {
  T20,
  ODI
}

interface MatchScore {
  runs: number;
  overs: number;
  wickets: number;
  matchType: MatchType;
}

interface MatchResult {
  matchType: MatchType;
  teamA: MatchScore;
  teamB: MatchScore;
}

interface RunRate {
  teamA: number;
  teamB: number;
}

export const handler = async (event: MatchResult[]): Promise<RunRate> => {
  const teamAScores = event.map(result => result.teamA.runs).reduce((acc: number, cur: number) => acc + cur);
  const teamAOvers = event.map(result => {
    if (result.teamA.wickets === 10) {
      return result.matchType === MatchType.T20 ? 20 : 50;
    }
    return result.teamA.overs;
  }).reduce((acc: number, cur: number) => acc + cur);

  const teamBScores = event.map(result => result.teamB.runs).reduce((acc: number, cur: number) => acc + cur);
  const teamBOvers = event.map(result => {
    if (result.teamB.wickets === 10) {
      return result.matchType === MatchType.T20 ? 20 : 50;
    }
    return result.teamB.overs;
  }).reduce((acc: number, cur: number) => acc + cur);

  return {
    teamA: (teamAScores / teamAOvers) - (teamBScores / teamBOvers),
    teamB: (teamBScores / teamBOvers) - (teamAScores / teamAOvers),
  }
};
