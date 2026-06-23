# CI/CD Flow

This diagram shows the repository pipeline that reacts to token changes, runs Style Dictionary, generates `variables.css`, and publishes the build artifact for development applications.

```mermaid
flowchart TD
  TokensChanged["tokens.json Changed"] --> PipelineTriggered["Pipeline Triggered"]
  ConfigChanged["style-dictionary.config.js Changed"] --> PipelineTriggered

  PipelineTriggered --> CheckScope["Check Changed Files"]
  CheckScope --> ShouldBuild{"Token Build Required?"}
  ShouldBuild -- No --> SkipBuild["Skip Token Build"]

  ShouldBuild -- Yes --> InstallDeps["Install Build Dependencies"]
  InstallDeps --> StyleDictionaryBuild["Style Dictionary Build"]
  StyleDictionaryBuild --> BuildSucceeded{"Build Succeeded?"}

  BuildSucceeded -- No --> FailPipeline["Fail Pipeline"]
  BuildSucceeded -- Yes --> GenerateVariables["Generate variables.css"]
  GenerateVariables --> ValidateNaming["Validate Naming Convention"]
  ValidateNaming --> PublishArtifacts["Publish Artifacts"]
  PublishArtifacts --> DevelopmentApps["Development Applications Use CSS Variables"]
```
