export type EventHandler = () => void;
export type EventIdHandler = (arg1: number) => void;
export type EventValueHandler = (arg1: React.ChangeEvent<HTMLInputElement>) => void;

export type ColorScheme = 'Black'|'Blue'|'White'|'Yellow';

//export type KeyValue<T, U> = {
//  key: T,
//  value: U,
//};
