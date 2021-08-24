import { NativeModules } from 'react-native';
import type { IadvizeType } from './types';

const { Iadvize } = NativeModules;

export default Iadvize as IadvizeType;
export * from './enums';
export * from './types';
