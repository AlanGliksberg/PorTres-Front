import { MatchResult, Match, Player } from "../types";
import { GENDER_CODE } from "../types/player/Gender";
import { parseDateToString } from "./common";

export const parseSets = (match: Match | null): MatchResult | null => {
  if (!match || match.sets.length === 0) return null;

  const set1 = match.sets.find((s) => s.setNumber === 1);
  const set2 = match.sets.find((s) => s.setNumber === 2);
  const set3 = match.sets.find((s) => s.setNumber === 3);
  return {
    team1Set1: set1?.team1Score?.toString(),
    team2Set1: set1?.team2Score?.toString(),
    team1Set2: set2?.team1Score?.toString(),
    team2Set2: set2?.team2Score?.toString(),
    team1Set3: set3?.team1Score?.toString(),
    team2Set3: set3?.team2Score?.toString(),
  };
};

export const matchResultIsValid = (result: MatchResult) => {
  // TODO - validar mejor el resultado
  if (!result.team1Set1 || !result.team2Set1) {
    return false;
  }
  return true;
};

export const matchIsFriendly = (
  match: Match | null,
  team1?: Player[],
  team2?: Player[]
) => {
  return match
    ? !match?.teams.every((t) => t.players.some((p) => p.userId))
    : (team1 && team1.every((p) => !p.userId)) ||
        (team2 && team2!.every((p) => !p.userId));
};

const TEAM_NUMBERS: (1 | 2)[] = [1, 2];
const MAX_PLAYERS_PER_TEAM = 2;
const CONFIRMED_PLAYER_EMOJI = "✅";
const MISSING_PLAYER_EMOJI = "🆓";
const TEAM_HEADER_EMOJI = "🤝";
const APP_DOWNLOAD_LINK = "https://tinyurl.com/portres-download";
const APP_DOWNLOAD_LINE = `📲 *Descargá la app:* ${APP_DOWNLOAD_LINK}`;

const buildTeamsSection = (match: Match): string[] => {
  const lines: string[] = [];

  if (!match.teams || match.teams.length === 0) return lines;

  TEAM_NUMBERS.forEach((teamNumber, index) => {
    const team = match.teams.find((t) => t.teamNumber === teamNumber);
    const players = team?.players ?? [];

    lines.push(`${TEAM_HEADER_EMOJI} Equipo ${teamNumber}`);

    const slots = Math.max(players.length, MAX_PLAYERS_PER_TEAM);
    for (let i = 0; i < slots; i++) {
      const player = players[i];
      if (player) {
        const firstName = player.firstName || "Jugador";
        lines.push(`${CONFIRMED_PLAYER_EMOJI} ${firstName}`);
      } else {
        lines.push(`${MISSING_PLAYER_EMOJI} Libre`);
      }
    }

    if (index === 0) {
      lines.push("");
    }
  });

  return lines;
};

export const buildMatchShareMessage = (match: Match) => {
  const missingPlayers = Math.max(0, 4 - match.players.length);
  const playerText =
    missingPlayers === 1
      ? match.gender.code === GENDER_CODE.DAMA
        ? "jugadora"
        : "jugador"
      : match.gender.code === GENDER_CODE.DAMA
      ? "jugadoras"
      : "jugadores";

  const details: string[] = [
    `🎾 Te invito a mi partido de PorTres`,
    `${
      missingPlayers > 1 ? "Faltan" : "Falta"
    } ${missingPlayers} ${playerText}`,
    "",
    `📅 *${parseDateToString(match.date)} - ${match.time} hs*`,
  ];

  if (match.duration) {
    details.push(`⌚ Duración: ${match.duration} min`);
  }

  details.push(
    `📍 *${match.location}*${match.description ? ` - ${match.description}` : ""}`
  );

  details.push("");

  if (match.category?.description) {
    details.push(`📊 *Categoría: ${match.category.description}*`);
  }

  const confirmedPlayerEmoji = "✅";
  const missingPlayerEmoji = "🆓";
  const listedPlayers = match.players.slice(0, 4).map((player) => {
    const firstName = player.firstName || "Jugador";
    return `${confirmedPlayerEmoji} ${firstName}`;
  });

  const missingSlots = Math.max(0, 4 - listedPlayers.length);
  const missingPlayerLabelBase = "Libre";

  for (let i = 0; i < missingSlots; i++) {
    listedPlayers.push(`${missingPlayerEmoji} ${missingPlayerLabelBase}`);
  }

  if (listedPlayers.length) {
    details.push("");
    details.push(...listedPlayers);
  }

  return `${details.join("\n")}\n\n¿Te sumás? Escribime por privado.\n\n${APP_DOWNLOAD_LINE}`;
};

export const buildCompletedMatchShareMessage = (match: Match) => {
  const details: string[] = [
    `🎾 ¡Partido confirmado!`,
    "",
    `📅 *${parseDateToString(match.date)} - ${match.time} hs*`,
  ];

  if (match.duration) {
    details.push(`⌚ Duración: ${match.duration} min`);
  }

  details.push(
    `📍 *${match.location}*${match.description ? ` - ${match.description}` : ""}`
  );

  details.push("");

  if (match.category?.description) {
    details.push(`📊 *Categoría: ${match.category.description}*`);
  }

  const teamsSection = buildTeamsSection(match);
  if (teamsSection.length) {
    details.push("");
    details.push(...teamsSection);
  }

  return `${details.join("\n")}\n\n¡Buena suerte!\n\n${APP_DOWNLOAD_LINE}`;
};
