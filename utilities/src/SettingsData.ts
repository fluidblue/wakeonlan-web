import { IPNetwork } from "./IPFunctions";

const WAKEONLAN_DEFAULT_PORT: number = 9;

export interface SettingsData {
	autoDetectNetworks: boolean;
	ipNetworks: IPNetwork[];
	wolPort: number;
}

export const settingsDataDefault: SettingsData = {
	autoDetectNetworks: true,
	ipNetworks: [],
	wolPort: WAKEONLAN_DEFAULT_PORT
};
