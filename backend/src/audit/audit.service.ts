import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  logCommand(robotId: string, command: string, userId?: string): void {
    this.logger.log(
      JSON.stringify({
        action: "command",
        robotId,
        command,
        userId: userId ?? "anonymous",
        timestamp: new Date().toISOString(),
      })
    );
  }

  logScenarioRun(
    scenarioId: string,
    robotId: string,
    executionId: string,
    userId?: string
  ): void {
    this.logger.log(
      JSON.stringify({
        action: "scenario_run",
        scenarioId,
        robotId,
        executionId,
        userId: userId ?? "anonymous",
        timestamp: new Date().toISOString(),
      })
    );
  }

  logScenarioStop(
    scenarioId: string,
    executionId: string,
    userId?: string
  ): void {
    this.logger.log(
      JSON.stringify({
        action: "scenario_stop",
        scenarioId,
        executionId,
        userId: userId ?? "anonymous",
        timestamp: new Date().toISOString(),
      })
    );
  }
}
