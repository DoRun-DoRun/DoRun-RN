export enum SignType {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GUEST = 'GUEST',
}

export enum ChallengeStatusType {
  PENDING = 'PENDING',
  PROGRESS = 'PROGRESS',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export enum InviteAcceptType {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  DELETED = 'DELETED',
  BLOCKED = 'BLOCKED',
}
export enum ItemType {
  BOOM = 'BOOM',
  HAMMER = 'HAMMER',
}

export enum AvatarType {
  CHARACTER = 'CHARACTER',
  PET = 'PET',
}

export interface AvatarName {
  1: 'DUDU';
  2: 'NUTS';
  3: 'PACHI';
  4: 'PEATS';
  5: 'SEED';
  6: 'SEEDS';
}

export interface Avatar {
  IS_EQUIP: boolean;
  AVATAR_NO: number;
  AVATAR_NM: string;
  AVATAR_USER_NM: string;
  AVATAR_TYPE: AvatarType;
  IS_OWNED: boolean;
}
