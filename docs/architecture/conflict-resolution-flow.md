# Conflict Resolution Flow

This diagram shows how local token edits and provider token changes are compared, how conflicts are detected, and how unresolved conflicts block sync until the user resolves them.

```mermaid
flowchart TD
  subgraph Local["Figma Plugin"]
    LocalChanges["Local Changes"]
    LocalAdded["Added Tokens"]
    LocalModified["Modified Tokens"]
    LocalDeleted["Deleted Tokens"]
  end

  subgraph Provider["Git Provider"]
    ProviderChanges["Provider Changes"]
    ProviderModified["Modified Tokens"]
    ProviderDeleted["Deleted Tokens"]
  end

  LocalChanges --> LocalAdded
  LocalChanges --> LocalModified
  LocalChanges --> LocalDeleted

  ProviderChanges --> ProviderModified
  ProviderChanges --> ProviderDeleted

  LocalAdded --> CompareTokens["Compare Tokens"]
  LocalModified --> CompareTokens
  LocalDeleted --> CompareTokens
  ProviderModified --> CompareTokens
  ProviderDeleted --> CompareTokens

  CompareTokens --> DetectConflicts["Detect Conflicts"]
  DetectConflicts --> ConflictFound{"Conflict Found?"}

  ConflictFound -- No --> AllowSync["Allow Sync"]
  ConflictFound -- Yes --> MarkConflict["Mark Potential Conflict"]
  MarkConflict --> BlockSync["Block Sync"]
  BlockSync --> ShowConflictDetails["Show Conflict Details"]
  ShowConflictDetails --> UserResolves["User Resolves Conflict"]
  UserResolves --> Revalidate["Revalidate Tokens"]
  Revalidate --> CompareTokens
```
