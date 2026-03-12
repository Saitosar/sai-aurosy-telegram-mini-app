# Platform Reference

The SAI AUROSY Telegram Mini App is a **client** of the SAI AUROSY multi-robot workforce platform. All business logic, scenario engine, robot control, and data persistence live on the platform. The Mini App does not create scenarios, robots, or store items internally—it only consumes platform APIs.

## Platform Project Locations

| Environment | Location | Notes |
|-------------|----------|-------|
| **Production** | [https://github.com/Saitosar/SAI-AUROSY](https://github.com/Saitosar/SAI-AUROSY) | Main repository |
| **Local development** | `/Users/sarkhan/SAI-AUROSY` | Local clone for integration testing |

## Integration Principles

1. **Platform API prefix** — All platform paths use `/api/v1` prefix (e.g. `/api/v1/auth/login`, `/api/v1/robots`).
2. **Platform is source of truth** — Scripts (scenarios), robots, executions come from the platform API. Store in V1 is backend mock only.
3. **No local creation** — The Mini App never creates scenarios, robots, or store items. "Create Script" (when implemented) must call platform API.
4. **Mock is fallback only** — When `PLATFORM_API_URL` is unset, the backend uses in-memory mock data for local demo. Prefer connecting to the real platform for development and testing.
5. **API contract** — Platform exposes `/api/v1/scenarios`, `/api/v1/robots`, `/api/v1/tasks` (for scenario run). Store API is not implemented; V1 uses backend mock. See [Integration with SAI Platform](integration-with-sai-platform.md).
