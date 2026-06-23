# High-level System Architecture

This diagram shows how the Figma Plugin acts as the token management source, while the repository and CI/CD pipeline store, review, build, and distribute generated token outputs.

```mermaid
flowchart LR
  subgraph Design["Design Workspace"]
    FigmaPlugin["Figma Plugin"]
    LocalState["Local Token State"]
    SyncPreview["Sync Preview"]
  end

  subgraph Provider["Git Provider (GitHub/GitLab)"]
    ProviderApi["Provider API"]
    MergeRequest["Merge Request"]
    Repository["Repository"]
  end

  subgraph RepoFiles["Repository Files"]
    TokensJson["tokens.json"]
    StyleConfig["style-dictionary.config.js"]
    BuildOutput["build/variables.css"]
  end

  subgraph Delivery["Delivery Pipeline"]
    CICD["CI/CD Pipeline"]
    StyleDictionary["Style Dictionary"]
    Artifacts["Build Artifacts"]
  end

  subgraph Consumers["Development Applications"]
    AppA["Web Application"]
    AppB["Design System"]
    AppC["Product UI"]
  end

  FigmaPlugin --> LocalState
  LocalState --> SyncPreview
  SyncPreview --> ProviderApi
  ProviderApi --> MergeRequest
  MergeRequest --> Repository
  Repository --> TokensJson
  Repository --> StyleConfig
  TokensJson --> CICD
  StyleConfig --> CICD
  CICD --> StyleDictionary
  StyleDictionary --> BuildOutput
  BuildOutput --> Artifacts
  Artifacts --> AppA
  Artifacts --> AppB
  Artifacts --> AppC
```
