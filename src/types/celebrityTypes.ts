export interface Celebrity {
  id: number;
  first: string;
  last: string;
  dob: string; // date of birth
  gender: string;
  country: string;
  description: string;
  picture: string;
}

export interface GenderOption {
  label: string;
  value: string;
}

export interface Props {
  celebrity: Celebrity;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedCelebrity: Celebrity) => void;
}
