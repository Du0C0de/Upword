import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quote } from "./quotes";
import { useEffect, useState } from "react";

export type KnownKeys = {
    "LAST-QUOTE": Quote;
};

export const usePersistantState = <K extends keyof KnownKeys>(
    key: K,
    behavior: {
        initialState?: KnownKeys[K];
        readInitialStateFromStorage?: boolean;
    }
) => {
    const [value, setValue] = useState<KnownKeys[K] | null>(behavior.initialState ?? null);

    useEffect(() => {
        behavior.readInitialStateFromStorage &&
            readFromStorage(key, (val) => val as KnownKeys[K]).then((val) => {
                setValue(val);
            });
    }, [key, behavior.readInitialStateFromStorage]);

    useEffect(() => {
        if (value === null) return;
        if (typeof value !== "object")
            throw new TypeError(
                `"${value}", typeof: "${typeof value}" is not a JSON serializeable string`
            );

        writeToStorage(key, value);
    }, [value]);

    return [value, setValue] as const;
};

export const writeToStorage = async <K extends keyof KnownKeys>(
    key: K,
    value: KnownKeys[K]
) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const readFromStorage = async <
    K extends keyof KnownKeys,
    OUT_TYPE extends KnownKeys[K]
>(
    key: K,
    conversionFactory?: (object: { [key: string]: unknown }) => OUT_TYPE
) => {
    const value = await AsyncStorage.getItem(key);

    if (value === null) throw new Error(`Failed to receive "${key}"`);

    const parsed = JSON.parse(value);

    if (conversionFactory != null) return conversionFactory(parsed);
    else return parsed;
};
