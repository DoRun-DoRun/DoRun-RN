export enum SignType {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GUEST = 'GUEST',
}

export enum UserStatusType {
  SLEEPING = '자는중',
  WALKING = '걷는중',
  RUNNING = '뛰는중',
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

export const profileImage = [
  require('../assets/image/profile/dudu.png'),
  require('../assets/image/profile/nuts.png'),
  require('../assets/image/profile/pachi.png'),
  require('../assets/image/profile/peats.png'),
];

export const avatarImage = [
  require('../assets/image/character/dudu01.png'),
  require('../assets/image/character/nuts01.png'),
  require('../assets/image/character/pachi01.png'),
  require('../assets/image/character/peats01.png'),
  require('../assets/image/character/seed.png'),
  require('../assets/image/character/seeds.png'),
];

export const struggleLottie = [
  require('../assets/lottie/dudu_struggle.json'),
  require('../assets/lottie/nuts_struggle.json'),
  require('../assets/lottie/pachi_struggle.json'),
  require('../assets/lottie/peats_struggle.json'),
];

export const BackgroundImage = [
  {url: require('../assets/image/background/BG_header.png'), height: 176},
  {url: require('../assets/image/background/BG_body1.png'), height: 137},
  {url: require('../assets/image/background/BG_body2.png'), height: 137},
  {url: require('../assets/image/background/BG_body3.png'), height: 137},
  {url: require('../assets/image/background/BG_body4.png'), height: 137},
  {url: require('../assets/image/background/BG_body5.png'), height: 137},
];

export const Dudus = [
  require('../assets/lottie/dudu_walk.gif'),
  require('../assets/lottie/nuts_walk.gif'),
  require('../assets/lottie/pachi_walk.gif'),
  require('../assets/lottie/peats_walk.gif'),
];

export const groupImage = [
  require('../assets/image/group/group_default_1.png'),
  require('../assets/image/group/group_default_2.png'),
  require('../assets/image/group/group_default_3.png'),
];

export const usedItemImage = {
  hammer: [
    require('../assets/lottie/dudu_hammer.gif'),
    require('../assets/lottie/nuts_hammer.gif'),
    require('../assets/lottie/peats_hammer.gif'),
    require('../assets/lottie/pachi_hammer.gif'),
  ],
  bomb: [
    require('../assets/lottie/dudu_bomb.json'),
    require('../assets/lottie/nuts_bomb.json'),
    require('../assets/lottie/peats_boom.json'),
    require('../assets/lottie/pachi_boom.json'),
  ],
};

export const defaultData = {
  Avatar: [
    {
      AVATAR_TYPE: 'CHARACTER',
      NAME: 'DUDU',
      URL: require('../assets/image/character/dudu05.png'),
    },
    {
      AVATAR_TYPE: 'CHARACTER',
      NAME: 'NUTS',
      URL: require('../assets/image/character/nuts08.png'),
    },
    {
      AVATAR_TYPE: 'CHARACTER',
      NAME: 'PACHI',
      URL: require('../assets/image/character/pachi07.png'),
    },
    {
      AVATAR_TYPE: 'CHARACTER',
      NAME: 'PEATS',
      URL: require('../assets/image/character/peats06.png'),
    },
    {
      AVATAR_TYPE: 'PET',
      NAME: 'SEED',
      URL: require('../assets/image/character/seed01.png'),
    },
    {
      AVATAR_TYPE: 'PET',
      NAME: 'SEEDS',
      URL: require('../assets/image/character/seeds01.png'),
    },
  ],
  Item: [
    {
      NAME: 'BOMB',
      URL: require('../assets/image/item/bomb.png'),
    },
    {
      NAME: 'HAMMER',
      URL: require('../assets/image/item/hammer.png'),
    },
  ],
};
