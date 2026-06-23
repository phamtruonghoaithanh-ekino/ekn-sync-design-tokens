# Sync Flow

This diagram describes the provider sync path, including validation state checks, theme reference checks, connection testing, pending Merge Request reuse, branch creation, rebase, commit, and Merge Request update.

```mermaid
flowchart TD
  StartSync["User Clicks Sync"] --> CheckValidationState["Check Current Validation State"]
  CheckValidationState --> ValidationOk{"No Token or Theme Errors?"}
  ValidationOk -- No --> StopValidation["Stop Sync and Show Errors"]

  ValidationOk -- Yes --> TestConnection["Test Connection"]
  TestConnection --> ConnectionOk{"Connection Valid?"}
  ConnectionOk -- No --> StopConnection["Stop Sync and Show Connection Error"]

  ConnectionOk -- Yes --> CheckChanges["Check tokens.json Changes"]
  CheckChanges --> HasChanges{"Changes Exist?"}
  HasChanges -- No --> StopNoChanges["Stop Sync: Nothing to Commit"]

  HasChanges -- Yes --> CheckConflicts["Check Target Branch Conflicts"]
  CheckConflicts --> ConflictsFound{"Blocking Conflict?"}
  ConflictsFound -- Yes --> StopConflict["Stop Sync and Show Conflict"]

  ConflictsFound -- No --> CheckPendingMr["Check Pending Merge Request"]
  CheckPendingMr --> PendingMr{"Open MR Exists?"}

  PendingMr -- No --> CreateBranch["Create Branch"]
  CreateBranch --> CommitChanges["Commit Changes"]
  CommitChanges --> CreateMr["Create Merge Request"]

  PendingMr -- Yes --> RebaseBranch["Rebase Existing Branch"]
  RebaseBranch --> RebaseOk{"Rebase Successful?"}
  RebaseOk -- No --> StopRebase["Stop Sync and Show Rebase Conflict"]
  RebaseOk -- Yes --> CommitMoreChanges["Commit Changes to Existing Branch"]
  CommitMoreChanges --> UpdateMr["Update Merge Request"]

  CreateMr --> SyncComplete["Sync Complete"]
  UpdateMr --> SyncComplete
```
