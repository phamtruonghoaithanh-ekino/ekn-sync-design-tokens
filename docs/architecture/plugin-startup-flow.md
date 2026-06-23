# Plugin Startup Flow

This diagram shows how the plugin initializes provider-backed token data, compares provider state with local changes, updates the Sync section, and detects conflicts before sync.

```mermaid
flowchart TD
  OpenPlugin["Open Plugin"] --> LoadConfig["Load Provider Configuration"]
  LoadConfig --> HasConfig{"Provider Configured?"}

  HasConfig -- No --> UseLocalState["Use Local Token State"]
  UseLocalState --> UpdateDisconnectedUi["Update Sync Section: Disconnected"]

  HasConfig -- Yes --> TestConfig["Check Provider Connection"]
  TestConfig --> ConnectionValid{"Connection Valid?"}
  ConnectionValid -- No --> ShowConnectionError["Show Connection Error"]
  ShowConnectionError --> UpdateDisconnectedUi

  ConnectionValid -- Yes --> FetchTokens["Fetch Latest tokens.json"]
  FetchTokens --> FetchSucceeded{"Fetch Succeeded?"}
  FetchSucceeded -- No --> ShowFetchError["Show Fetch Error"]
  ShowFetchError --> UpdateDisconnectedUi

  FetchSucceeded -- Yes --> HasLocalChanges{"Local Changes Exist?"}
  HasLocalChanges -- No --> ReplaceLocalTokens["Update Plugin Tokens from Provider"]
  ReplaceLocalTokens --> UpdateSyncedUi["Update Sync Section: Synced"]

  HasLocalChanges -- Yes --> CompareTokens["Compare with Local Changes"]
  CompareTokens --> UpdateSyncSection["Update Sync Section with Diff"]
  UpdateSyncSection --> DetectConflicts["Detect Conflicts"]
  DetectConflicts --> ConflictFound{"Conflict Found?"}
  ConflictFound -- No --> CheckValidationState["Check Token and Theme Validation State"]
  CheckValidationState --> ValidationClean{"No Validation Errors?"}
  ValidationClean -- No --> BlockValidation["Keep Sync Disabled"]
  ValidationClean -- Yes --> EnableSync["Enable Sync"]
  ConflictFound -- Yes --> BlockSync["Block Sync and Warn User"]
```
