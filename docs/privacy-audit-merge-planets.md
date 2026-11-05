# Privacy evidence — Merge Planets with Google Play Games

> Historical PGS-only audit. For the current rewarded-ad/Yandex integration, use the [5 November 2026 source/APK audit](advertising-privacy-audit-2026-11-05.md) and [current Data Safety guide](google-play-data-safety.md). Older no-ad/offline statements below are historical, not the current SDK inventory.

Audit date: **3 November 2026**. The findings below describe the current working tree and supersede the earlier offline conclusions for the online release. Earlier source-audit notes are preserved below as historical evidence.

## Current evidence and limits

- Source: the local Unity repository `MergeDrop`, current branch `main`; Unity 6000.3.27f2, source app version 0.1.1 / Android version code 2, package `com.feainne.mergeplanets`. No game source/configuration is changed by this privacy task.
- `Resources/PlayGamesConfiguration.asset`: both EnableGooglePlayGames and IncludeGooglePlayGamesInBuild true. Android scripting define MERGE_PLANETS_GPGS is set.
- Embedded official Google Unity runtime 2.2.1, with documented acknowledgement/optional-Nearby patches. `Editor/PlayGamesBuildConfiguration.cs` pins `com.google.android.gms:play-services-games-v2:22.0.0` in generated Gradle. Native smoke releaseRuntimeClasspath resolves Play Services base 18.5.0, basement 18.9.0, tasks 18.2.0 and ordinary AndroidX/Kotlin dependencies. No Firebase, Nearby, ads or billing dependency was found in that runtime report. This is not evidence that a future final AAB has the identical graph.
- Tracked Android manifest permits INTERNET and ACCESS_NETWORK_STATE and declares the game APP_ID, native bridge activity, and suppression of automatic profile-creation prompts. It does not suppress authentication or all native SDK activity.
- Existing `Library/PGS-NativeSmoke` merged manifest contains PlayGamesInitProvider. Its isolated APK has INTERNET; the offline smoke artifact has neither Internet nor Google provider. These are isolated validation artifacts, **not the final Unity game AAB**.
- UnityConnectSettings: Unity Analytics/startup, Engine Diagnostics, Cloud Diagnostics, Performance Reporting and Ads disabled. No Unity Cloud project is linked. Their disabled state does not disable Google metrics.

## Application-level data flow

| Evidence | Confirmed behavior |
| --- | --- |
| `Scripts/PlayGames/GoogleProvider/GooglePlayGamesProvider.cs` | Automatic Authenticate; manual ManuallyAuthenticate; GetUserId/GetUserDisplayName; ReportScore; UnlockAchievement; native leaderboard/achievement UI; network-only snapshot open/read/commit/manual conflict handling. No request for email/server auth scopes/friends from our code. |
| Vendored `AndroidClient.SignInOnResult` and `AndroidJavaConverter.ToPlayer` | getCurrentPlayer populates display name, Player ID, icon-image/ avatar URL in plugin memory. No custom image upload or photo-library access by game code found. |
| Patched AndroidClient score/unlock methods | submitScoreImmediate/unlockImmediate Tasks supply acknowledgements; not an assertion of a tested production server write. |
| `PlayGamesSyncService` | Automatically authenticates, uploads persisted completed-score outbox/earned First Fusion and synchronizes cloud data after successful login. Three-attempt failure limits. Inspector gate protects our calls. No universal user-facing SDK-off control. CancelConflict postpones conflicts, not all transmission. |
| `MergeController.PlanetMerged`, `PlayGamesSceneBridge.SessionChanged` | First Fusion from a real successful merge; completed score recorded at GameOver. |
| `PlayGamesSceneBridge.Capture`, `Core/PlayGamesProgress.cs` | Cloud envelope: version, best score, First Fusion, run snapshot JSON, revision/parent and progress/history flags. No sound/vibration/language preference, player name, email or hardware/ad identifier in this payload. Google still associates it with its authenticated player. |
| `Persistence/GameRunSaveData.cs` | Local-format snapshot holds current/starting-best scores, planet levels/poses/velocities/sleep state, preview/queue/cooldown and danger timers. The same run JSON is embedded in cloud data. |
| `PlayGamesProgressStore`, `GameRunSaveStore`, `GameSettingsService`, `HUDController` | Local JSON/checkpoint/recovery files, ownerPlayerId, score outbox entries, receipts, achievement and PlayerPrefs best score/preferences. Record GUIDs are save/event revisions, not proof of persistent device identification. No fixed retention TTL. |
| `PlayGamesPanel` and provider interfaces | No current DeleteCloudData button or universal opt-out/sign-out flow; no studio account-registration/backend. SDK has deletion APIs upstream, but installed API availability is not an implemented user-facing erasure feature. |
| `ExternalLinksConfig`, `ExternalUrlService` | Fixed HTTPS policy URL opens external browser without player parameters. Translation feedback unconfigured. Email is voluntary, external to game. |

## Provider statements vs unverified fields

[Google's PGS disclosure](https://developer.android.com/games/pgs/data-collection) states gamer-identity, automatic analytics/diagnostics, HTTPS transport and Google deletion controls. It explicitly describes the **latest SDK** and does not list a version-specific wire schema for 22.0.0. Therefore particular AAID/Android ID/App Set ID/hardware IDs, separate crash stack traces, and interaction-event fields are **not certified** by that page or our source search. Do not infer location from mere IP routing or treat Player ID as a Device ID.

No app-owned calls for location, advertising ID, deviceUniqueIdentifier, contacts or custom network telemetry were found. This absence cannot certify proprietary GMS internals. It also does not justify inventing a specific identifier collection claim.

## Published website comparison

On 3 November 2026 a direct unauthenticated HTTPS GET of the public policy returned HTTP 200 (15,856 bytes). Web retrieval was not supported by the browsing tool, so direct HTTP was used. Live text was dated 31 October 2026 and still stated no off-device collection/sign-in/cloud saves. The local working copy already had 1 November local-save additions; those correct facts were retained in the replacement. This task changes local files only; live content remains unchanged until an authorized deployment.

## Recommended disclosures and unresolved decisions

Use [the detailed Data safety guide](google-play-data-safety.md), replacing the old No-collection answers. Name, User IDs and gameplay/Other actions are code-confirmed; Diagnostics is provider-documented. Shared/Required are recommended for the current automatic workflow without assuming a processor/user-initiated exception. Device IDs, separate crash logs/interaction metrics need exact native-version disclosure. App-account/OAuth/deletion wording needs alignment with the actual Console question and Google policy scope; no unsupported deletion badge or fixed deadline is asserted.

The revised public-policy source identifies Google processing, local/cloud retention, actual Google/Android deletion routes, re-upload risks, transport vs local encryption, Unity-disabled services, email and hosting. It does not claim review approval, legal certification or complete native telemetry inventory.

## Not performed in this task

The existing `Builds/Android/MergePlanets-closed-test.aab` was also inspected read-only: modified 1 November 2026 at 18:21:49 UTC, 55,569,852 bytes. Its dependency protobufs contain no play-services-games-v2 coordinate and its manifest protobuf has no Internet/network-state/AD_ID/Billing permissions, Games APP_ID or PlayGamesInitProvider strings. This is the old offline artifact, not the integrated update. A new release artifact is still needed.

No game changes, rebuild, device execution, traffic interception, Console submission, new branch, commit, push or publication. Inspection of a **new online AAB**, exact provider disclosure and the specific Console deletion/account classification remain the concrete pre-submission checks. There is no blanket request for a full traffic audit.

---

## Historical offline audit (not the current online declaration)

# Merge Planets — privacy implementation evidence

Updated **1 November 2026** for the local run-save addition. Baseline Unity source commit: `b2efc71a59c033667266a0d82d8fcdf9da819307`. Public contact: **bloedefeainne.games@outlook.com**.

## Local run-save follow-up

The current Unity working tree uses **6000.3.27f2** and adds `Scripts/Persistence/GameRunPersistence.cs`, `GameRunSaveData.cs` and `GameRunSaveStore.cs`. An unfinished run is saved to `Application.persistentDataPath/current-run.json`, with temporary/previous-checkpoint recovery files. The snapshot contains the current score, run-start best score, planet levels/poses/velocities/sleep state, current preview and next planet, remaining spawn delay, and danger-zone timers. It is loaded locally and cleared on restart/game over; best-score/preferences remain separate.

This feature adds file IO, not an upload, account, SDK, permission or device identifier. It uses no game-provided encryption layer. The policy now discloses local unfinished-run storage and possible OS-controlled backup of app data. Save/recovery and restore behavior are covered by the Unity tests. A newly built or device-tested artifact containing this feature is not claimed here.

## Baseline configuration

- The Unity source project is accessible in `MobileGames/MergeDrop`.
- Android identity is now **com.feainne.mergeplanets**, company **Bloede Feainne Games**, product **Merge Planets: Make a Galaxy!**, version **0.1 / code 1**.
- The policy text is finalized for this configuration; placeholders and draft notices have been removed. It is indexed normally and included in the sitemap.
- License and signing configuration were build blockers at the original baseline audit. They are historical observations, not the current editor status. No new APK/AAB containing the local-save change has been built as part of this follow-up.
- The old APK and old package identifier are historical artifacts, not evidence of the updated release. They must not be uploaded as the new closed test.

This report replaces the earlier source-only draft assessment. It does not claim that a device run or traffic interception occurred.

## Packages and game processing

The original baseline used Unity **6000.3.14f1**, 54 direct package entries and 71 resolved entries, including built-in engine modules. Key baseline runtime packages were Localization **1.5.9**, Addressables **2.9.1**, Input System **1.19.0**, URP **17.3.0**, and RTLTMPro pinned at Git tag **v4.0.0** (its cached package metadata reported **3.4.2**). The local-save follow-up adds no package dependency. Multiplayer Center is tooling/common definitions; no multiplayer backend or accounts are implemented.

No Firebase, AdMob, billing, authentication, cloud-save, or custom telemetry integration was found or added. Built-in Analytics/UnityWebRequest modules being installed is not evidence that collection is enabled.

| Data or behavior | Source evidence | Handling |
| --- | --- | --- |
| Best score | `HUDController.cs`, key `MergeDrop.BestScore` | Local PlayerPrefs. |
| Sound and vibration choices | `GameSettingsService.cs` | Local PlayerPrefs. |
| Language selection | `GameSettingsService.cs`, `ExplicitLocaleSelector.cs` | Local PlayerPrefs; initial language uses current interface culture. |
| Unfinished run, current score, board and queue | `Scripts/Persistence/`, `SpawnController.cs`, `GameSessionController.cs`, `LoseConditionController.cs` | Local snapshot/recovery files for resume; no server upload. |
| Assets/localization | Addressables local profile/group schemas; remote catalog off and remote load path undefined | Local game content. |
| Performance logs | `GamePerformanceController.cs`, conditional on Development build/Editor | Local logging, no custom uploader; release build is non-Development. |
| Translation feedback | `ExternalUrlService.cs`, `ExternalLinksConfig.asset` | Destination/field IDs empty; no form opens. Release validator rejects enabling the destination without a policy review. |
| Privacy link | `PauseMenuController.cs`, `ExternalUrlService.cs`, Main scene | Pause → Privacy Policy opens the exact HTTPS URL in an external browser, without player parameters. |

Android backup/transfer can include local app data according to platform and account settings. The app does not operate cloud synchronization or access an external backup account. This is disclosed rather than promising that uninstalling removes every possible copy.

## Explicit telemetry and network configuration

Previously the project was unlinked from Unity Cloud while a separate engine-diagnostics flag was on. Unity's version-specific documentation states diagnostics collection is disabled for unlinked projects. The closed-test change makes the intended behavior explicit:

```text
Engine Diagnostics: disabled
Legacy submitAnalytics flag: 0
Unity Analytics: disabled; initialize on startup: 0
Cloud Diagnostics reporting: disabled
Performance Reporting: disabled
Unity Ads: disabled; initialize on startup: 0
Unity Purchasing: disabled
Unity Cloud: unlinked
Force Internet Permission: disabled
```

`Assets/Plugins/Android/AndroidManifest.xml` uses Unity's own library-manifest template and adds merger directives removing `INTERNET` and `ACCESS_NETWORK_STATE`. `MergePlanetsClosedTestingBuild.OnPostGenerateGradleAndroidProject` preserves those removal directives after Unity generates its Gradle project. Removing Internet permission prevents app-owned network uploads; it does not prevent the external browser from opening the policy using the browser's own permissions.

The build preprocessor validates package/studio identity, diagnostics, disabled services/startup, the policy URL, the unconfigured translation destination, the custom manifest, and absence of the listed service packages. It stops builds if those facts conflict with this release's policy. It does not silently enable or add services.

The conclusion for this configuration is **no off-device collection or sharing by the game**. No evidence remains that specifically calls for a full traffic audit. A normal final-artifact check is still required after a build can be made.

## Privacy link and UI

The scene contains a serialized `PrivacyPolicyButton` under `PauseSheet/MainContent`, bound to the controller's field. The controller adds/removes its listener with the other settings controls. `ExternalUrlService` reads the configured URL, accepts only the exact official HTTPS destination, and adds no query parameters. The displayed label is “Privacy Policy.” The pause sheet is expanded to fit the extra control at its existing portrait layout endpoints.

NUnit test sources cover the exact URL, rejecting unrelated/insecure/parameterized destinations, and presence of the bound scene button. They have compiled, but could not run inside Unity because licensing blocks startup.

## Website policy

The public policy covers on-device saves, disabled Unity services, absence of ads/purchases/accounts, external-browser hosting, Microsoft-hosted voluntary support email, backup/deletion limits, purpose-based support retention, security, children without an invented age threshold, privacy requests, and update dates. Planned AdMob/Remove Ads remain future features.

Support retention is defined by enquiry/follow-up needs and legal obligations, rather than inventing a numerical period. Email deletion requests use the official studio address; no remote gameplay or account-deletion backend is claimed.

The route is static HTML with no authentication or geofencing code. This environment could not verify live hosting access; verify the actual public URL after Pages deployment. A source commit or valid URL string alone is not claimed as a successful live HTTP check.

## Checks and limits

Completed:

- Runtime and Editor C# compilation with Unity's bundled Roslyn compiler against installed engine/package assemblies, including the new build helper and tests.
- Scene ID uniqueness, internal references and parenting, exact button field/label, listener wiring, and pause-layout minimums.
- Package identity, telemetry flags, manifest XML and permission removal instructions.
- Website navigation, anchors, metadata, email addresses, removal of policy placeholders/draft notices, sitemap entry, and unchanged CSS/JavaScript/artwork.

Pending because of concrete environment/release prerequisites:

1. Activate a valid Unity Editor license. The installed Editor exits with code 198 and a missing headless entitlement/license before opening the project for compilation/build.
2. Select the correct upload keystore and alias locally. No signing identity was generated, no passwords were read into reports, and signing files are ignored by Git.
3. Build with `MergePlanetsClosedTestingBuild.BuildClosedTesting`, inspect the actual merged AAB manifest, and perform the normal settings/browser smoke check. No final artifact or test run is represented as already successful.
4. Confirm the public hosted policy URL. Direct HTTP requests and the web-fetch tool were unavailable for this domain in the authoring environment.

These do not justify retaining generic privacy placeholders or demanding a full network audit. The policy describes the established source configuration; closed-test upload remains gated by an actual signed, matching build.

## References

- [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311).
- [Google Play Data safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469).
- [Unity 6.3 diagnostics/build-profile behavior](https://docs.unity.com/en-us/engine/6000.3/manual/building-and-publishing/build-settings/build-profiles-reference).
- [Unity EngineDiagnosticsSettings.enabled API](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityeditor/enginediagnostics/enginediagnosticssettings/enabled).
- [Android backup behavior](https://developer.android.com/identity/data/autobackup).
- [GitHub Pages hosting logs](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- [Microsoft Privacy Statement](https://www.microsoft.com/en-us/privacy/privacystatement).

Use [the exact Data safety answer guide](google-play-data-safety.md) for this configuration.
