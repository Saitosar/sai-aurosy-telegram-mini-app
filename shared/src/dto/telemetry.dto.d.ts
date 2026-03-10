export interface Telemetry {
    robotId: string;
    timestamp: string;
    status: string;
    position?: {
        x: number;
        y: number;
    };
    battery?: number;
    sensorData?: Record<string, unknown>;
}
