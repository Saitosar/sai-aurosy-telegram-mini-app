export type RobotStatus = "online" | "offline" | "busy" | "error";
export interface Robot {
    id: string;
    name: string;
    model: string;
    status: RobotStatus;
    scenario?: string;
}
export interface RobotDetail extends Robot {
    position?: {
        x: number;
        y: number;
    };
    battery?: number;
}
export interface RobotCommandRequest {
    command: string;
    params?: Record<string, unknown>;
}
