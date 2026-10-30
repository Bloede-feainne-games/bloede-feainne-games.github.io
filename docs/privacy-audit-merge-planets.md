# Merge Planets privacy audit

Audit date: **31 October 2026**. Developer: **Bloede Feainne Games**. Public contact: **bloedefeainne.games@outlook.com**.

## Result and scope

| Question | Result |
| --- | --- |
| Unity project found and source accessible? | **YES** — the `MobileGames/MergeDrop` working copy. |
| Source, configuration, and existing APK successfully inspected? | **YES** — read-only static audit. |
| Exact intended release and its runtime traffic verified? | **NO**. |
| Policy ready for Google Play submission? | **NO** — the concrete blockers below remain. |

The checkout is at commit `476a763d2d719fb8b4a82ef551c6c1384b261519`. Its remote HEAD and only advertised branch, `main`, matched that revision during the audit. The project was not opened in Unity, rebuilt, installed, or modified. The audit examined game code, direct and resolved packages, settings, scene references, Addressables profiles, cached Android manifests/Gradle configuration, and an existing `MergePlanets.apk` with Android's `aapt2` tool.

All **2,321 files** under Assets, Packages, and ProjectSettings matched the audit's source fingerprint at completion, and the Unity Git working tree remained clean. No Unity project change is included in the website commit.

The reviewed project and existing APK both use a **legacy package identifier**, different from the requested `com.feainne.mergeplanets`. Legacy developer identity strings and a cached developer-network address are deliberately not reproduced in this public report. No APK/AAB for the requested package was found among the identified game artifacts. Existing artifacts are evidence about those builds, not proof of the intended release's behavior.

## Engine, packages, and Player Settings

| Area | Evidence and finding |
| --- | --- |
| Engine | `ProjectSettings/ProjectVersion.txt`: Unity **6000.3.14f1**, revision `d68c3f99a318`. |
| Player identity | `ProjectSettings/ProjectSettings.asset`: legacy Android package and developer branding; version `0.1`, version code `1`. They do not yet match the requested release identity. |
| Android | Minimum API `25`; automatic target selection in source; existing APK targets API `36`; ARM64; IL2CPP. |
| Dependency inventory | `Packages/manifest.json`: 54 direct entries; `Packages/packages-lock.json`: 71 resolved entries, including built-in engine modules. |
| Localization | `com.unity.localization` **1.5.9**. |
| Addressables | Resolved `com.unity.addressables` **2.9.1**. All inspected bundled group schemas reference the local build/load profile IDs. Remote catalog building is off; remote load path is undefined. |
| Right-to-left text | `com.nosuchstudio.rtltmpro`, pinned Git tag **v4.0.0**. Cached package metadata reports **3.4.2**; this metadata discrepancy is recorded rather than silently presenting one as the other. No runtime HTTP calls were found in its inspected C# source. |
| Other packages | Input System **1.19.0**, Universal Render Pipeline **17.3.0**, UGUI **2.0.0**, Visual Scripting **1.9.11**, 2D tooling, Timeline, and editor/test integrations. |
| Multiplayer Center | `com.unity.multiplayer.center` **1.0.1** is present as tooling/common definitions. Its presence does not establish player accounts, a game backend, or multiplayer data transmission; no such integration was found in the custom game code. |
| Built-in capability modules | `com.unity.modules.unityanalytics` **1.0.0**, UnityWebRequest modules, and profiling components are present. Inclusion alone is not evidence that analytics or network requests execute. |
| Ads, billing, Firebase, UGS | No AdMob, Firebase, Unity Ads SDK, Unity IAP, UGS core/authentication/analytics/cloud-save SDK integration or initialization was found in the package graph and custom game code. Legacy built-in Analytics settings are addressed separately below. |
| Plugins | No custom Android manifest, Gradle template, `.aar`, `.jar`, `.so`, `.dll`, Firebase config, or Android resolver dependency XML was found under `Assets`. Generated Gradle dependencies were AndroidX UI/core and Android Games activity/frame-pacing libraries. |

## Verified game-side processing

The 49 custom runtime C# files were searched for persistence, networking, identifiers, accounts, SDK initialization, telemetry, external links, and permissions. Editor/test code was separated from player code to avoid mistaking editor tooling for player telemetry.

| Information or behavior | Source evidence | Local or external? |
| --- | --- | --- |
| Best score | `Assets/_Project/Scripts/UI/HUDController.cs`: `MergeDrop.BestScore`, read/written using `PlayerPrefs`; saved on game result, pause, and quit. | App preference storage; no uploader in this path. |
| Sound preference | `Assets/_Project/Scripts/GameSettingsService.cs`: `MergeDrop.Settings.SoundEnabled`. | Local `PlayerPrefs`. |
| Vibration preference | Same service: `MergeDrop.Settings.VibrationEnabled`. | Local `PlayerPrefs`. |
| Selected language | Same service and `ExplicitLocaleSelector.cs`: `MergeDrop.Settings.ExplicitLocale`; saved locale migration. | Local `PlayerPrefs`. |
| Initial language | `ExplicitLocaleSelector.cs`: reads `CultureInfo.CurrentUICulture.Name` and resolves a supported locale. | On-device processing in the reviewed path. |
| Current score | `GameSessionController.cs`: in-memory score/events. | On device; best score persists separately. No saved full-board state was found. |
| Vibration | `HapticFeedbackService.cs`: `Handheld.Vibrate()` when enabled. | Device action; supports the vibration permission. |
| Performance logging | `GamePerformanceController.cs`: screen resolution, refresh rate, frame rate/timing and quality settings logged under `DEVELOPMENT_BUILD` or `UNITY_EDITOR`. | Local `Debug.Log` in the custom code; no custom log uploader found. Whether engine services upload logs is a separate release check. |
| Accounts, authentication, remote saves | No corresponding integration or backend calls found. | No implemented custom account/cloud-save flow found. |
| Device IDs, IP collection, telemetry | No custom `SystemInfo` identifier collection, HTTP client, socket, UnityWebRequest request, or telemetry uploader found in runtime game code. | A negative source-search result, not a native-engine traffic measurement. |

The saved preferences are local in the game implementation, but that does not rule out operating-system backup. The inspected APK does not specify `allowBackup`, backup exclusions, or data-extraction rules. Android documents backup participation as the default for eligible apps. Actual backup/transfer depends on device and user settings. Neither uninstalling nor clearing the app's local storage proves that all backup copies are deleted.

### Optional translation feedback

`ExternalUrlService.cs` builds a Google Forms URL and calls `Application.OpenURL` only after the URL, expected HTTPS host, and all entry IDs pass validation. The scene references `Assets/_Project/UI/ExternalLinksConfig.asset`; that asset has an **empty destination URL and empty field IDs**, so the current code returns without opening a form.

If configured later, the prefilled URL would contain the locale code, locale display name, app version, Unity platform string, and source `LanguageScreen`. Navigating to that URL would expose those parameters to its recipient before any form submission. The final form's questions, sign-in/email settings, access, retention, and provider processing would require a new review. They are not represented as an active collection flow in this policy.

The same config's `privacyPolicyUrl` is empty. No runtime reader of that property or implemented privacy-link opening flow was found. A website policy does not establish that the app satisfies the separate in-app-link requirement.

## Unity Analytics and diagnostics: separate findings

`ProjectSettings/UnityConnectSettings.asset` contains:

```text
UnityConnectSettings.m_Enabled: 0
InsightsSettings.m_EngineDiagnosticsEnabled: 1
InsightsSettings.m_Enabled: 0
CrashReportingSettings.m_EnableCloudDiagnosticsReporting: 0
UnityAnalyticsSettings.m_Enabled: 0
UnityAnalyticsSettings.m_InitializeOnStartup: 1
UnityAnalyticsSettings.m_PackageRequiringCoreStatsPresent: 0
UnityAdsSettings.m_Enabled: 0
UnityPurchasingSettings.m_Enabled: 0
PerformanceReportingSettings.m_Enabled: 0
```

`ProjectSettings.asset` also has `cloudEnabled: 0`, an empty `cloudProjectId`, empty enabled cloud services, `submitAnalytics: 1`, and `enableCrashReportAPI: 0`. No build-profile asset was found in Assets, ProjectSettings, or UserSettings.

These flags must not be collapsed into either “Unity definitely collects diagnostics” or “all Unity processing is disabled.” Legacy Analytics is disabled; the separate engine-diagnostics flag remains enabled; the project is unlinked. Unity's version-specific build-profile documentation says diagnostic collection requires a Unity Cloud link and is disabled for unlinked projects. That supports an expectation about this configuration, not verification of the final release's native runtime traffic. The serialized `submitAnalytics` field is recorded without assigning an unsupported meaning to it.

**Still required:** final release build/profile evidence and runtime observation of startup, gameplay, pause/resume, local settings, network recovery, and error/diagnostic paths. Confirm destinations and payload categories, including any device/install IDs, IP processing, diagnostics, logs, provider retention, consent and controls. Merely finding Unity endpoint strings, an Analytics module, or Internet permission does not establish an actual upload.

## Android artifact inspection

Existing `MergePlanets.apk` SHA-256:

```text
7a7c538154d0c91b749319956a3d2e53807948b3c09a63f48afd4b120026a1a3
```

The APK reports version `0.1` / code `1`, target API `36`, minimum API `25`, and ARM64 native code. Its requested permissions include:

- `android.permission.INTERNET`.
- `android.permission.VIBRATE`.
- An app-scoped signature permission for AndroidX non-exported receivers.

No camera, microphone, contacts, location, external-storage, advertising-ID, or billing permission was found in the inspected APK manifest. The APK and cached generated build both include Internet permission even though the source's `ForceInternetPermission` field is off. Final merged manifests matter more than that one source checkbox.

Cached build artifacts include development player-connection configuration, whereas the existing APK's boot configuration differs. The custom build script explicitly creates a Development build. These artifacts are not interchangeable with a signed production release. No network capture, on-device behavioral test, mailbox administration review, or Unity dashboard inspection was performed. No new build was made because the Unity project must remain unchanged.

A read-only device-discovery attempt with `adb devices -l` failed: the environment has no USB bus access and cannot create the ADB listener/network sockets. Device availability could therefore not be determined here. Runtime testing needs an environment with working Android device/ADB access, or independently supplied verifiable traffic and log evidence for the exact release.

## Website policy and Google Play Data safety

The route `/privacy/merge-planets/` is implemented as static HTML with no authentication or geofencing code. It retains its draft notice and `noindex` metadata; `noindex` is not access control. Live hosting access still needs external confirmation. No indexable final policy is implied.

| Area | Current policy treatment / Data safety consequence |
| --- | --- |
| Best score, language, sound, vibration | Described as on-device preferences in the reviewed code, with Android backup caveat. Google's form distinguishes on-device-only processing from off-device transmission. |
| Unity runtime data | Explicitly unresolved for the requested release; no fabricated collection or blanket “no data collected” claim. SDK/engine transmissions must be included if verified. |
| Support email | Public Outlook address and voluntary correspondence described separately from game telemetry. Retention and operational safeguards still need studio confirmation. |
| Google Forms | Described as unconfigured, with no current form opening; future activation needs a provider/data-flow review. |
| Advertising / billing | No current integrations. Planned AdMob and one-time Remove Ads purchase are clearly future work. No future SDK behavior is presented as current. |
| Children | No invented age threshold, adult-only assertion, or unsupported parental/child-data claim. Audience confirmation remains required. |
| Security and deletion | Actual local storage behavior is distinguished from unverified encryption, provider retention, mail controls, and backup erasure. |

No Play Console Data safety answers were submitted or certified. They must match the same verified release inventory as the finalized policy.

## Exact remaining blockers

1. **Release identity and artifact:** identify the exact source revision and provide access to the production APK/AAB for `com.feainne.mergeplanets`, its merged manifest, and build/profile configuration. The accessible source is real, but the intended package is not configured there. Confirm the public developer identity in the store listing.
2. **Runtime/Unity evidence:** verify the final Unity Cloud/Diagnostics state and observe actual release traffic. Supply a controlled test device/build and suitable network/log evidence, or equivalent verifiable results; provide Unity dashboard configuration if that release is linked. Determine actual data categories, recipients, purposes, retention, and controls if transmissions occur.
3. **Backup behavior:** confirm final Android backup/device-transfer settings and the scope of saved preferences included.
4. **Audience:** confirm intended Google Play age groups and regions served, then any applicable child-data and consent handling. This cannot be inferred from casual gameplay or absence of an age gate.
5. **Support operations:** specify actual support/privacy-email retention and deletion criteria, mailbox/backup handling, authorized access and safeguards, and applicable request-handling procedures. No private inbox access is required merely to provide these policy decisions.
6. **In-app policy access:** verify an actual link or policy text in the app and its designated Play Console link. The current config is empty; this audit intentionally does not modify it.
7. **Publication:** set the effective date and confirm material-update notification procedures after the release and operational checks. Live HTTP access must be verified externally: this environment's direct request failed DNS resolution and its web fetch could not retrieve the hosted page.

There is **no missing permission to read the discovered Unity source**. The missing evidence is the exact intended release, its observed runtime behavior, and the studio's operational/audience decisions. Until these are resolved, the policy is **not ready** for Google Play submission.

## Official references reviewed

- [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311).
- [Google Play Data safety definitions and guidance](https://support.google.com/googleplay/android-developer/answer/10787469).
- [Unity 6.3 build-profile diagnostics reference](https://docs.unity.com/en-us/engine/6000.3/manual/building-and-publishing/build-settings/build-profiles-reference).
- [Unity developer privacy FAQ](https://unity.com/legal/developer-privacy-policy-faq) and [player/app-user privacy policy](https://unity.com/legal/game-player-and-app-user-privacy-policy).
- [Android Auto Backup documentation](https://developer.android.com/identity/data/autobackup).
- [Microsoft Privacy Statement](https://www.microsoft.com/en-us/privacy/privacystatement).
