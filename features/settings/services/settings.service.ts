import { storeSettings, type StoreSettings } from "@/data/settings";
import { sleep } from "@/lib/utils";

export interface SettingsService {
  get(): Promise<StoreSettings>;
  update(patch: Partial<StoreSettings>): Promise<StoreSettings>;
}

let settingsStore: StoreSettings = { ...storeSettings };

export const mockSettingsService: SettingsService = {
  async get() {
    await sleep(200);
    return settingsStore;
  },
  async update(patch) {
    await sleep(400);
    settingsStore = { ...settingsStore, ...patch };
    return settingsStore;
  },
};

export const settingsService: SettingsService = mockSettingsService;
export type { StoreSettings };
