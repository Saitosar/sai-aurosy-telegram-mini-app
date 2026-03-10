# Platform Reference

The SAI AUROSY Telegram Mini App is a **client** of the SAI AUROSY multi-robot workforce platform. All business logic, scenario engine, robot control, and data persistence live on the platform. The Mini App does not create scenarios, robots, or store items internally—it only consumes platform APIs.

## Platform Project Locations

| Environment | Location | Notes |
|-------------|----------|-------|
| **Production** | [https://github.com/Saitosar/SAI-AUROSY](https://github.com/Saitosar/SAI-AUROSY) | Main repository |
| **Local development** | `/Users/sarkhan/SAI-AUROSY` | Local clone for integration testing |

## Integration Principles

1. **Platform is source of truth** — Scripts (scenarios), robots, store items, executions come from the platform API.
2. **No local creation** — The Mini App never creates scenarios, robots, or store items. "Create Script" (when implemented) must call platform API.
3. **Mock is fallback only** — When `PLATFORM_API_URL` is unset, the backend uses in-memory mock data for local demo. Prefer connecting to the real platform for development and testing.
4. **API contract** — Platform exposes `/api/v1/scenarios`, `/api/v1/robots`, etc. See [Integration with SAI Platform](integration-with-sai-platform.md).
