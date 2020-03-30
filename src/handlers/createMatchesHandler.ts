export enum MatchType {
  T20 = 't20',
  ODI = 'ODI',
}

interface MatchEvent {
  teamA: string;
  teamB: string;
  matchType: MatchType;
  numMatches: number;
}

interface MatchScore {
  runs: number;
  overs: number;
  wickets: number;
}

interface MatchResult {
  matchType: MatchType;
  teamA: MatchScore;
  teamB: MatchScore;
}

export const handler = async (event: MatchEvent): Promise<MatchResult[]> => {
  const { teamA, teamB, matchType, numMatches } = event;
  console.log(`A series of ${numMatches} ${matchType} matches is created between ${teamA} & ${teamB}.`);

  const results = [];
  for (let i = 0; i < numMatches; i++) {
    const teamAScore = generateScore();
    const teamAOvers = generateOvers(matchType);
    const teamAWickets = generateWickets();

    const teamBScore = generateScore();
    const teamBOvers = generateOvers(matchType);
    const teamBWickets = generateWickets();
    results.push({
      matchType,
      teamA: {
        runs: teamAScore,
        overs: teamAOvers,
        wickets: teamAWickets,
      },
      teamB: {
        runs: teamBScore,
        overs: teamBOvers,
        wickets: teamBWickets,
      },
    });
  }

  return results;
}

const generateScore = (): number => generateRandom(50, 250); // Generates the number between 50 & 250 both inclusive.


const generateWickets = (): number => generateRandom(0, 10); // Generates the number between 0 & 10 both inclusive.

const generateRandom = (min: number, max: number, floor = true): number => {
  return floor ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min + 1) + min;
};

const generateOvers = (matchType: MatchType): number => {
  switch (matchType) {
    case MatchType.ODI:
      return generateRandom(30, 50, false); // Generates the number between 30 and 50 both inclusive.
    case MatchType.T20:
      return generateRandom(10, 20, false); // Generates the number between 10 and 20 both inclusive.
    default:
      throw new Error('Unsupported match type.');
  }
};
