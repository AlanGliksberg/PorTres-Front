import React, { createContext, ReactNode, useContext, useState } from "react";
import { AddPlayerToMatchModal, PlayerDetailsModal } from "../components";
import ApplicationsModal from "../components/Modals/ApplicationsModal";
import ChangePasswordModal from "../components/Modals/ChangePasswordModal";
import EditProfileModal from "../components/Modals/EditProfileModal";
import LoadResultModal from "../components/Modals/LoadResultModal";
import { removeLiveMatchesCache } from "../services/cache";
import { Match, Player } from "../types";
import { Application } from "../types/application/Application";
import { ModalContext } from "./ModalContext";
import ApplyToMatchModal from "../components/Modals/ApplyToMatchModal";

interface PlayerModalsContextData {
  openPlayerDetail: (player: Player, removeCallback?: () => void) => void;
  closePlayerDetail: () => void;
  closeAllPlayerModals: () => void;
  openAddPlayerToMatch: (m: Match, t: number, c?: (p: Player) => void) => void;
  closeAddPlayerToMatch: () => void;
  openApplicationsModal: (
    match: Match,
    refreshData?: () => Promise<void>
  ) => void;
  closeApplicationsModal: () => void;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;
  openEditProfileModal: (player: Player, onUpdate: () => void) => void;
  closeEditProfileModal: () => void;
  openApplyToMatchModal: (
    match: Match,
    team?: 1 | 2,
    onSuccess?: () => void
  ) => void;
  closeApplyToMatchModal: () => void;
  openLoadResultModal: (
    match: Match | null,
    readOnly: boolean,
    onSave?: () => Promise<void>
  ) => void;
  closeLoadResultModal: () => void;
}

export const PlayerModalsContext = createContext<PlayerModalsContextData>({
  openPlayerDetail: (p: Player) => {},
  closePlayerDetail: () => {},
  closeAllPlayerModals: () => {},
  openAddPlayerToMatch: (m: Match, t: number, c?: (p: Player) => void) => {},
  closeAddPlayerToMatch: () => {},
  openApplicationsModal: (
    match: Match,
    refreshData?: () => Promise<void>
  ) => {},
  closeApplicationsModal: () => {},
  openChangePasswordModal: () => {},
  closeChangePasswordModal: () => {},
  openEditProfileModal: (player: Player, onUpdate: () => void) => {},
  closeEditProfileModal: () => {},
  openApplyToMatchModal: (
    match: Match,
    team?: 1 | 2,
    onSuccess?: () => void
  ) => {},
  closeApplyToMatchModal: () => {},
  openLoadResultModal: (
    match: Match | null,
    readOnly: boolean,
    onSave?: () => Promise<void>
  ) => {},
  closeLoadResultModal: () => {},
});

export const PlayerModalsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openModal } = useContext(ModalContext);

  // ==================== Player Details Modal ====================
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [removePlayerCallback, setRemovePlayerCallback] =
    useState<() => void>();
  const openPlayerDetail = (
    selectedPlayer: Player,
    removeCallback?: () => void
  ) => {
    setSelectedPlayer(selectedPlayer);
    setRemovePlayerCallback(() => removeCallback);
  };
  const closePlayerDetail = () => {
    setSelectedPlayer(null);
    setRemovePlayerCallback(undefined);
  };

  const closeAllPlayerModals = () => {
    closePlayerDetail();
    closeAddPlayerToMatch();
    closeApplicationsModal();
    closeChangePasswordModal();
    closeEditProfileModal();
    closeApplyToMatchModal();
    closeLoadResultModal();
  };

  // ==================== Add Player To Match Modal ====================
  const [openAddPlayerModal, setOpenAddPlayerModal] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [callbackFn, setCallbackFn] = useState<
    ((p: Player) => void) | undefined
  >();
  const openAddPlayerToMatch = (
    match: Match,
    team: number,
    callback?: (p: Player) => void
  ) => {
    setSelectedMatch(match);
    setSelectedTeam(team);
    setCallbackFn(() => callback);
    setOpenAddPlayerModal(true);
  };
  const closeAddPlayerToMatch = () => {
    setCallbackFn(undefined);
    setSelectedMatch(null);
    setSelectedTeam(null);
    setOpenAddPlayerModal(false);
  };

  // ==================== Applications Modal ====================
  const [applicationsMatch, setApplicationsMatch] = useState<Match | null>(
    null
  );
  const [refreshData, setRefreshData] = useState<
    (() => Promise<void>) | undefined
  >();
  const openApplicationsModal = (
    match: Match,
    refreshData?: () => Promise<void>
  ) => {
    setApplicationsMatch(match);
    setRefreshData(() => refreshData);
  };
  const closeApplicationsModal = () => setApplicationsMatch(null);
  const refreshApplications = async (
    applications: Application[],
    type: "accepted" | "rejected"
  ) => {
    const players = applicationsMatch?.players || [];
    if (type === "accepted") {
      const acceptedApplication = applicationsMatch?.applications.find(
        (a) => !applications.some((app) => app.id === a.id)
      );
      players?.push({ id: acceptedApplication?.playerId } as Player);
    }
    setApplicationsMatch((prev) =>
      prev
        ? {
            ...prev,
            players: players,
            applications,
          }
        : null
    );
    // Si se aceptó al último jugador, cierro el modal
    if (type === "accepted" && applicationsMatch?.players?.length === 4) {
      openModal({
        title: "¡Partido confirmado!",
        message:
          "Ya juntaste a todos los jugadores, ahora solo queda disfrutar del partido.",
        secondParagraph: "¡Buena suerte!",
      });
      closeApplicationsModal();
    }
    refreshData && (await refreshData());
    removeLiveMatchesCache();
  };

  // ==================== Change Password Modal ====================
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  // ==================== Edit Profile Modal ====================
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfilePlayer, setEditProfilePlayer] = useState<Player | null>(
    null
  );
  const [editProfileCallback, setEditProfileCallback] = useState<
    (() => void) | null
  >(null);
  const openEditProfileModal = (player: Player, onUpdate: () => void) => {
    setEditProfilePlayer(player);
    setEditProfileCallback(() => onUpdate);
    setShowEditProfileModal(true);
  };

  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
    setEditProfilePlayer(null);
    setEditProfileCallback(null);
  };

  // ==================== Apply To Match Modal ====================
  const [showApplyToMatchModal, setShowApplyToMatchModal] = useState(false);
  const [matchToApply, setMatchToApply] = useState<Match | null>(null);
  const [teamToApply, setTeamToApply] = useState<1 | 2 | undefined>(undefined);
  const [applySuccessCallback, setApplySuccessCallback] = useState<
    (() => void) | null
  >(null);

  const openApplyToMatchModal = (
    match: Match,
    team?: 1 | 2,
    onSuccess?: () => void
  ) => {
    setMatchToApply(match);
    setTeamToApply(team);
    setApplySuccessCallback(() => onSuccess);
    setShowApplyToMatchModal(true);
  };

  const closeApplyToMatchModal = () => {
    setShowApplyToMatchModal(false);
    setMatchToApply(null);
    setTeamToApply(undefined);
    setApplySuccessCallback(null);
  };

  // ==================== Load Result Modal ====================
  const [showLoadResultModal, setShowLoadResultModal] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [matchForResult, setMatchForResult] = useState<Match | null>(null);
  const [saveResultCallback, setSaveResultCallback] = useState<
    (() => void) | undefined
  >();
  const [key, setKey] = useState(0);

  const openLoadResultModal = (
    match: Match | null,
    readOnly = false,
    onSave?: () => Promise<void>
  ) => {
    setMatchForResult(match);
    setSaveResultCallback(() => onSave);
    setReadOnly(readOnly);
    setShowLoadResultModal(true);
  };

  const closeLoadResultModal = () => {
    setShowLoadResultModal(false);
    setMatchForResult(null);
    setSaveResultCallback(undefined);
    setReadOnly(false);
    setKey((prev) => prev + 1);
  };

  return (
    <PlayerModalsContext.Provider
      value={{
        openPlayerDetail,
        closePlayerDetail,
        closeAllPlayerModals,
        openAddPlayerToMatch,
        closeAddPlayerToMatch,
        openApplicationsModal,
        closeApplicationsModal,
        openChangePasswordModal,
        closeChangePasswordModal,
        openEditProfileModal,
        closeEditProfileModal,
        openApplyToMatchModal,
        closeApplyToMatchModal,
        openLoadResultModal,
        closeLoadResultModal,
      }}
    >
      {children}
      {/* ==================== Modal Components ==================== */}
      <PlayerDetailsModal
        player={selectedPlayer}
        closePlayerDetail={closePlayerDetail}
        removeCallback={removePlayerCallback}
      />
      <AddPlayerToMatchModal
        isOpen={openAddPlayerModal}
        closeModal={closeAddPlayerToMatch}
        match={selectedMatch}
        team={selectedTeam}
        onPlayerAdd={callbackFn}
      />
      <ApplicationsModal
        closeModal={closeApplicationsModal}
        isOpen={!!applicationsMatch}
        match={applicationsMatch}
        refreshApplications={refreshApplications}
      />
      <ChangePasswordModal
        isVisible={showChangePasswordModal}
        onClose={closeChangePasswordModal}
      />
      <EditProfileModal
        isVisible={showEditProfileModal}
        onClose={closeEditProfileModal}
        player={editProfilePlayer}
        onUpdate={editProfileCallback || (() => {})}
      />
      <ApplyToMatchModal
        isVisible={showApplyToMatchModal}
        onClose={closeApplyToMatchModal}
        match={matchToApply}
        team={teamToApply}
        onSuccess={applySuccessCallback || undefined}
      />
      <LoadResultModal
        key={key}
        isVisible={showLoadResultModal}
        onClose={closeLoadResultModal}
        match={matchForResult}
        onSaveResult={saveResultCallback}
        readOnly={readOnly}
      />
    </PlayerModalsContext.Provider>
  );
};
