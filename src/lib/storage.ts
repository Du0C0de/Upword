import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Quote } from "../types";

export type KnownKeys = {
    "LAST-QUOTE": Quote;
    FAVORITES: Quote[];
};

export const usePersistantState = <K extends keyof KnownKeys>(
    key: K,
    options: {
        initialState?: KnownKeys[K];
        readInitialStateFromStorage?: boolean;
    }
): [KnownKeys[K], (newValue: KnownKeys[K]) => void] => {
    const { initialState, readInitialStateFromStorage } = options;
    const [value, setValue] = useState<KnownKeys[K]>(
        initialState ?? (defaultFor(key) as KnownKeys[K])
    );

    useEffect(() => {
        if (!readInitialStateFromStorage) return;

        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(key);
                if (raw !== null) {
                    const parsed = JSON.parse(raw);
                    setValue(parsed);
                }
            } catch (e) {
                console.error(`Error reading ${key} from storage:`, e);
            }
        };

        load();
    }, [key, readInitialStateFromStorage]);

    useEffect(() => {
        if (value != null) {
            AsyncStorage.setItem(key, JSON.stringify(value)).catch((e) =>
                console.error(`Error writing ${key} to storage:`, e)
            );
        }
    }, [key, value]);

    return [value, setValue];
};

function defaultFor(key: keyof KnownKeys): unknown {
    if (key === "FAVORITES") return [];
    return null;
}
