import { Application } from "../application/Application";
import { Match } from "../match/Match";

export type ModalParams = {
  title: string;
  message: string;
  secondParagraph?: string;
  primaryLabel?: string;
  primaryAction?: () => void;
  secondaryLabel?: string;
  secondaryAction?: () => void;
  hideClose?: boolean;
  hideSecondary?: boolean;
};

export interface ModalContextData {
  openModal: (params: ModalParams) => void;
  closeModal: () => void;
  openErrorModal: (t: string, m: string) => void;
  closeErrorModal: () => void;
}

export interface ModalProps {
  params: ModalParams | null;
  isOpen: boolean;
  withClose?: boolean;
  closeModal: () => void;
}

export interface ApplicationsModalProps {
  match: Match | null;
  isOpen: boolean;
  closeModal: () => void;
  refreshApplications: (
    applications: Application[],
    type: "accepted" | "rejected"
  ) => void;
}
