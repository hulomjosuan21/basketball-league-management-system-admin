// import { MatchModel } from "./match-model";
// import { MatchCategory, MatchSlotType, MatchStatus, TeamScheduleConfig } from "./match-types";

// export class MatchSchedulerService {
//   static generateRoundRobinMatches(teams: TeamScheduleConfig[], options: ScheduleOptions): MatchCreateType[] {
//     const matches: MatchCreateType[] = [];
//     const totalRounds = teams.length % 2 === 0 ? teams.length - 1 : teams.length;
//     const teamList = [...teams];

//     const n = teamList.length;
//     const half = Math.floor(n / 2);
//     let currentDate = new Date(options.startDate);

//     for (let round = 0; round < totalRounds; round++) {
//       for (let i = 0; i < half; i++) {
//         const home = teamList[i];
//         const away = teamList[n - 1 - i];

//         matches.push({
//           home_team_id: home.league_team_id,
//           away_team_id: away.league_team_id,
//           scheduled_date: new Date(currentDate),
//           duration_minutes: options.durationMinutes || 40,
//           referees: options.referees,
//           court: options.court,
//           category: options.category || MatchCategory.REGULAR_SEASON,
//           division_id: options.division_id || null,
//           league_id: options.league_id,
//           round_number: round + 1,
//           bracket_side: null,
//           bracket_position: null,
//           match_notes: null,
//         });

//         currentDate = new Date(currentDate.getTime() + (options.intervalMinutes || 60) * 60000);
//       }

//       const fixed = teamList[0];
//       const rotating = teamList.slice(1);
//       rotating.unshift(rotating.pop()!);
//       teamList.splice(1, n - 1, ...rotating);
//     }

//     return matches;
//   }

//   static startMatch(match: MatchModel): MatchModel {
//     return match.copyWith({ status: MatchStatus.IN_PROGRESS });
//   }

//   static completeMatch(match: MatchModel, homeScore: number, awayScore: number): MatchModel {
//     const winner = homeScore > awayScore ? match.data.home_team_id : (awayScore > homeScore ? match.data.away_team_id : null);
//     const loser = winner === match.data.home_team_id ? match.data.away_team_id : match.data.home_team_id;

//     return match.copyWith({
//       home_team_score: homeScore,
//       away_team_score: awayScore,
//       winner_team_id: winner,
//       loser_team_id: loser,
//       status: MatchStatus.COMPLETED,
//     });
//   }

//   static setNextMatch(match: MatchModel, nextMatchId: string, slot: MatchSlotType): MatchModel {
//     return match.copyWith({ next_match_id: nextMatchId, next_match_slot: slot });
//   }

//   static setLoserNextMatch(match: MatchModel, loserNextMatchId: string, slot: MatchSlotType): MatchModel {
//     return match.copyWith({ loser_next_match_id: loserNextMatchId, loser_next_match_slot: slot });
//   }
// }
