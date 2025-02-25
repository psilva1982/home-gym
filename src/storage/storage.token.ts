import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig";

type StorageAuthTokenProps = {
  token: string;
  refreshToken: string;
};

export async function storageTokenSave({
  token,
  refreshToken,
}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token: token, refreshToken: refreshToken })
  );
}

export async function storageTokenGet() {
  const storage = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);
  const { token, refreshToken }: StorageAuthTokenProps = storage
    ? JSON.parse(storage)
    : {};
  return { token, refreshToken };
}

export async function storageTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}
