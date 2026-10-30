# Merge Planets — privacy implementation evidence

Updated **31 October 2026** for the offline closed-testing configuration. Unity source commit: `b2efc71a59c033667266a0d82d8fcdf9da819307`. Public contact: **bloedefeainne.games@outlook.com**.

## Current result

- The Unity source project is accessible in `MobileGames/MergeDrop`.
- Android identity is now **com.feainne.mergeplanets**, company **Bloede Feainne Games**, product **Merge Planets: Make a Galaxy!**, version **0.1 / code 1**.
- The policy text is finalized for this configuration; placeholders and draft notices have been removed. It is indexed normally and included in the sitemap.
- No new AAB has been built. Unity reports **“No valid Unity Editor license found”** before project compilation. No upload keystore/alias is configured. These are the concrete release-build blockers.
- The old APK and old package identifier are historical artifacts, not evidence of the updated release. They must not be uploaded as the new closed test.

This report replaces the earlier source-only draft assessment. It does not claim that a device run or traffic interception occurred.

## Packages and game processing

Unity **6000.3.14f1**. Package inventory remains unchanged: 54 direct entries and 71 resolved entries, including built-in engine modules. Key runtime packages are Localization **1.5.9**, Addressables **2.9.1**, Input System **1.19.0**, URP **17.3.0**, and RTLTMPro pinned at Git tag **v4.0.0** (its cached package metadata reports **3.4.2**). Multiplayer Center is present as tooling/common definitions; no multiplayer backend or accounts are implemented.

No Firebase, AdMob, billing, authentication, cloud-save, or custom telemetry integration was found or added. Built-in Analytics/UnityWebRequest modules being installed is not evidence that collection is enabled.

| Data or behavior | Source evidence | Handling |
| --- | --- | --- |
| Best score | `HUDController.cs`, key `MergeDrop.BestScore` | Local PlayerPrefs. |
| Sound and vibration choices | `GameSettingsService.cs` | Local PlayerPrefs. |
| Language selection | `GameSettingsService.cs`, `ExplicitLocaleSelector.cs` | Local PlayerPrefs; initial language uses current interface culture. |
| Current score | `GameSessionController.cs` | In-memory gameplay; no server upload. |
| Assets/localization | Addressables local profile/group schemas; remote catalog off and remote load path undefined | Local game content. |
| Performance logs | `GamePerformanceController.cs`, conditional on Development build/Editor | Local logging, no custom uploader; release build is non-Development. |
| Translation feedback | `ExternalUrlService.cs`, `ExternalLinksConfig.asset` | Destination/field IDs empty; no form opens. Release validator rejects enabling the destination without a policy review. |
| Privacy link | `PauseMenuController.cs`, `ExternalUrlService.cs`, Main scene | Pause → Privacy Policy opens the exact HTTPS URL in an external browser, without player parameters. |

Android backup/transfer can include preferences according to platform and account settings. The app does not operate cloud synchronization or access an external backup account. This is disclosed rather than promising that uninstalling removes every possible copy.

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
