import { MATCH_STATUS } from "@/src/constants/match";
import { PlayerModalsContext } from "@/src/contexts/PlayerModalsContext";
import { Match, Player } from "@/src/types";
import { getPlayerInitials } from "@/src/utils/player";
import React, { useContext } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import CustomText from "../ui/CustomText/CustomText";
import { styles } from "./PlayerAvatar.styles";
import useUser from "@/src/hooks/useUser";

type AvatarSize = "s" | "m" | "l" | "xl";

interface PlayerAvatarProps {
  player: Player | null;
  size?: AvatarSize;
  inverse?: boolean;
  isCreator?: boolean;
  touchable?: boolean;
  match?: Match | undefined;
  team?: 1 | 2 | undefined;
  addPlayerCallback?: (p: Player) => void;
  removeCallback?: (p: Player) => void;
  canDelete?: boolean;
  handleApply?: (team?: 1 | 2) => void;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  size = "s",
  inverse = false,
  isCreator = false,
  touchable = true,
  match,
  team,
  addPlayerCallback,
  removeCallback,
  canDelete = false,
  handleApply,
}) => {
  const { openPlayerDetail, openAddPlayerToMatch } =
    useContext(PlayerModalsContext);
  const { user } = useUser();

  const canRemove =
    isCreator &&
    canDelete &&
    removeCallback &&
    (!match ||
      match.status.code === MATCH_STATUS.PENDING ||
      match.status.code === MATCH_STATUS.COMPLETED);

  const iAmMatchPlayer = match
    ? match.players.some((p) => p.id === user?.playerId)
    : false;

  const textSize =
    size === "s"
      ? "small"
      : size === "m"
      ? "h2"
      : size === "l"
      ? "h1"
      : size === "xl"
      ? "xl"
      : "h1";

  const avatarContent = (
    <View
      style={[
        styles.avatar,
        styles[`size_${size}`],
        inverse ? styles.avatarInverse : null,
      ]}
    >
      {player && player.user?.photoUrl ? (
        <Image
          source={{ uri: player.user.photoUrl }}
          style={[styles[`size_${size}`], styles.border]}
        />
      ) : (
        <CustomText
          bold
          style={[styles.avatarText, inverse ? styles.avatarTextInverse : {}]}
          type={textSize}
        >
          {player ? getPlayerInitials(player.firstName, player.lastName) : "+"}
        </CustomText>
      )}
    </View>
  );

  const avatarAction = player
    ? () =>
        openPlayerDetail(
          player,
          canRemove ? () => removeCallback(player) : undefined
        )
    : isCreator
    ? !match || match?.status.code === MATCH_STATUS.PENDING
      ? () => openAddPlayerToMatch(match!, team!, addPlayerCallback)
      : undefined
    : !iAmMatchPlayer
    ? handleApply
      ? () => handleApply(team)
      : undefined
    : undefined;

  return touchable && avatarAction ? (
    <TouchableOpacity onPress={avatarAction}>{avatarContent}</TouchableOpacity>
  ) : (
    <>{avatarContent}</>
  );
};

export default PlayerAvatar;
