# Problem Statement

## Problems the App Solves

### 1. Quick Mobile Access Without Dedicated Apps

Operators and store managers need fast access to robot status and control from their phones. Installing and maintaining a dedicated mobile app adds friction and may not align with how users already work. A solution that works within an existing, frequently used context reduces adoption barriers.

### 2. Management from Familiar Messaging Context

Many users already spend significant time in Telegram for work and communication. Managing robots from the same environment—without switching apps—improves convenience and reduces cognitive load. Operators want to check robot status or send a quick command without leaving their messaging flow.

### 3. Lightweight Onboarding for Store Managers

Store managers who deploy robots (e.g., Mall Guide) need a simple way to get started. They may not be technical users and should not need to learn complex dashboards or install multiple tools. A lightweight, focused interface lowers the barrier to adopting robot operations.

### 4. Discovery and Distribution for Scenario Developers (V2)

Scenario developers need a way to reach users and distribute their work. Without a dedicated channel, discovery is fragmented and adoption is limited. A marketplace within the app provides a single place for users to find and acquire scenarios.

## Constraints

- **No duplication of platform logic** — The app must not reimplement business rules, validation, or control algorithms that belong in the SAI AUROSY platform.
- **No direct robot connectivity** — The app must not establish direct connections to robots. All robot communication flows through the platform.
- **Platform as source of truth** — User data, robot state, store inventory, and scenario definitions are owned and served by the platform. The app is a consumer of this data.
