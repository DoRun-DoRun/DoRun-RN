// reduxHooks.ts
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/Store';

/*  ❖  useAppDispatch → thunk(Action) 도 타입 안전하게 전달  */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/*  ❖  useAppSelector → state 선택 시 자동 완성  */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
