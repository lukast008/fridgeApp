export enum ConnectionState {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
}

export default class ConnectionStatusDto {
  state: ConnectionState;
  lastSyncDate: Date;

  constructor(state?: ConnectionState) {
    this.state = state ? state : ConnectionState.Disconnected;
    this.lastSyncDate = new Date();
  }
};
