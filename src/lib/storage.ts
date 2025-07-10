import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quote } from "./quotes";

export type KnownKeys = {
    "LAST-QUOTE": Quote;
};

export const writeToStorage = async <K extends keyof KnownKeys>(
    key: K,
    value: KnownKeys[K]
) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const readFromStorage = async <
    K extends keyof KnownKeys,
    OUT_TYPE extends KnownKeys[K] | null
>(
    key: K,
    conversionFactory: (object: { [key: string]: unknown }) => OUT_TYPE
) => {
    const value = await AsyncStorage.getItem(key);

    console.log(`ASYNC RETREIVE GOT: "${JSON.stringify(value)}"`);

    if (value === null) throw new Error(`Failed to receive "${key}"`);

    const parsedJSON = JSON.parse(value);
    console.log(`PARSED JSON: "${JSON.stringify(value)}"`);

    return conversionFactory(parsedJSON);
};
