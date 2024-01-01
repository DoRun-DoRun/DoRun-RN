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

export const ItemName = ['폭탄', '망치'];

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
    require('../assets/lottie/pachi_hammer.gif'),
    require('../assets/lottie/peats_hammer.gif'),
  ],
  bomb: [
    require('../assets/lottie/dudu_bomb.json'),
    require('../assets/lottie/nuts_bomb.json'),
    require('../assets/lottie/pachi_bomb.json'),
    require('../assets/lottie/peats_bomb.json'),
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

export const completeText = [
  '노력은 재능을 이긴다, 노력한 만큼 결과가 따른다. - 이창호',
  '자신감과 갈망이 결합되면 집중력이 생긴다. - 아놀드 파머',
  '달로 나아가라, 실패해도 별들 사이에 있게 될 것. - 진 시몬즈',
  '성공은 갈망할 때만 가능하다. - 필리포스',
  '미룰 일은 죽어도 되는 일만 하라. - 파블로 피카소',
  '동기 부여는 매일 필요하다. - 지그 지글러',
  '실패는 성공의 디딤돌이다. - 데일 카네기',
  '당신의 인생은 스스로 설계해야 한다. - 짐 론',
  '정말 원한다면 기다리지 마라. - 구르박쉬 차할',
  '위대한 일을 이루려면 위대함을 기대하라. - 마이클 조던',
  '동기 부여로 시작하고 습관으로 계속하라. - 짐 륜',
  '성공하려면 매일 투지를 가져야 한다. - 조지 로리머',
  '성공은 사전에서만 노력보다 앞선다. - 비달 사순',
  '성공과 실패의 길은 거의 같다. - 콜린 R. 데이비스',
  '모든 도전을 받아들여야 성공한다. - 마이크 가프카',
  '성공은 당신의 삶의 목적을 깨닫는 것. - 존 C. 맥스웰',
  '비참해지거나 동기를 부여하라. 선택은 당신의 것. - 웨인 다이어',
  '위대한 것을 이루려면 꿈도 꾸고 믿어야 한다. - 아나톨 프랑스',
  '중요한 일은 혼자서도 계속 노력할 때 이루어진다. - 데일 카네기',
  '동기는 갈망에서 비롯된다. - 제인 스마일리',
  '성공하면 더 성공하고 싶어진다. - 토니 로빈스',
  '운은 용기 있는 사람의 편. - 베르길리우스',
];
