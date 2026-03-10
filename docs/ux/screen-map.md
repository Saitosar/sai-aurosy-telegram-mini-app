# Screen Map

## Screen Inventory

### V1 Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Dashboard | `/` | Entry point; quick links to main areas |
| Robots | `/robots` | List and manage connected robots |
| Store | `/store` | Browse and acquire robots |
| Control Panel | `/control/:robotId` | View robot data and send commands |
| Scripts | `/scripts` | Browse scripts by type (Behavioral, Speech, Hybrid) |
| Mall Guide | `/scripts/mall-guide` | Run Mall Guide script |

### V2 Screens (Planned)

| Screen | Route | Purpose |
|--------|-------|---------|
| Marketplace | `/marketplace` | Browse and acquire scenarios |
| Simulation | `/simulation/:scenarioId` | Simulate scenario and preview execution |

## Screen Navigation Flow

```mermaid
flowchart TB
    subgraph Entry [Entry]
        TelegramBot[Telegram Bot]
    end

    subgraph MainTabs [Main Tabs]
        Dashboard[Dashboard /]
        Robots[Robots /robots]
        Store[Store /store]
        Scripts[Scripts /scripts]
    end

    subgraph Detail [Detail]
        ControlPanel[Control Panel /control/:robotId]
        MallGuide[Mall Guide /scripts/mall-guide]
    end

    TelegramBot -->|"Opens Mini App"| Dashboard
    Dashboard --> Robots
    Dashboard --> Store
    Dashboard --> Scripts
    Robots -->|"Select robot"| ControlPanel
    Robots --> Scripts
    Store -->|"After acquire"| Robots
    Scripts -->|"Open Mall Guide"| MallGuide
    MallGuide -->|"Select robot"| ControlPanel
    ControlPanel -->|"Back"| Robots
    ControlPanel --> Scripts
    ControlPanel --> MallGuide
```

## Navigation Matrix

| From | Reachable Screens |
|------|-------------------|
| **Dashboard** | Robots, Store, Scripts |
| **Robots** | Dashboard, Store, Scripts (via tabs), Control Panel (select robot), Scripts (run script) |
| **Store** | Dashboard, Robots, Scripts (via tabs), Robots (after acquire) |
| **Scripts** | Dashboard, Robots, Store (via tabs), Mall Guide (open script) |
| **Mall Guide** | Scripts (back), Control Panel (select robot) |
| **Control Panel** | Robots, Scripts (via tabs or scenario shortcut), Mall Guide |

## Tab Bar / Menu (V1)

Primary navigation (tab bar or bottom menu):

- **Dashboard** — Home
- **Robots** — My robots
- **Store** — Robot Store
- **Scripts** — Browse and run scripts

Control Panel is reached by selecting a robot from the Robots screen or from Mall Guide. Mall Guide is reached from Scripts. Both are detail screens, not tabs.

## Entry Points

| Entry | Target Screen | Notes |
|-------|---------------|------|
| **Telegram bot menu** | Dashboard | User taps menu or button; opens Mini App |
| **Bot commands** | Dashboard or specific screen | Inline buttons may open app (TBD) |
| **Deep link** | Specific screen (e.g., `/robots`, `/store`) | TBD; direct link to screen |

## Back Navigation

### Telegram Back Button Behavior

| Screen Type | Back Button | Action |
|-------------|-------------|--------|
| **Dashboard** | Hidden | Root screen; no back |
| **Robots, Store, Scripts** | Hidden | Tab screens; switch via tabs |
| **Control Panel** | Visible | Back to Robots or Mall Guide (previous screen) |
| **Store item detail** | Visible | Back to Store catalog |
| **Modal / overlay** | Visible or in-app | Close modal |

### Navigation Rules

- Use `window.Telegram.WebApp.BackButton` when inside a detail screen (e.g., Control Panel)
- Show Back Button when navigation stack depth > 1
- Hide Back Button when at root or tab level
- From Control Panel: back goes to Robots or Scripts/Mall Guide depending on entry path

## Screen Transitions (Simplified)

```mermaid
flowchart LR
    subgraph Main [Main Screens]
        Dashboard
        Robots
        Store
        Scripts
    end
    subgraph Detail [Detail]
        Control
        MallGuide
    end
    Dashboard --> Robots
    Dashboard --> Store
    Dashboard --> Scripts
    Robots --> Control
    Robots --> Scripts
    Scripts --> MallGuide
    MallGuide --> Control
    Control --> Robots
    Control --> MallGuide
    Store --> Robots
```
