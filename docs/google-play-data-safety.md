# Google Play Data safety — Merge Planets 0.1

Package: **com.feainne.mergeplanets**. Developer: **Bloede Feainne Games**. Version code: **1**. Policy: **https://bloede-feainne-games.github.io/privacy/merge-planets/**.

These answers apply to Unity source commit `b2efc71a59c033667266a0d82d8fcdf9da819307`, the offline closed-testing configuration committed with the privacy-link update. They do not describe the old legacy APK or a future monetized release.

## Answers to enter

| Form area | Answer for this version | Basis |
| --- | --- | --- |
| Data collected or shared by the app | **No** | No custom uploads or service initialization; Diagnostics/Analytics disabled; Android Internet permission explicitly removed. |
| Collected data types | **None**; do not select any categories | Gameplay/preferences are on-device. No diagnostics, identifiers, or events are uploaded by this app configuration. |
| Shared data types | **None** | The game sends no player payload to a service or external app. The policy browser URL is fixed and contains no player parameters. |
| Per-type purpose, required/optional, ephemeral processing | **Not applicable / skipped** | No collected or shared data types are declared. |
| Encryption for collected data | **Not applicable / skipped on the no-data branch** | There is no app upload to certify as encrypted. Do not invent an encrypted telemetry or cloud-save service. |
| Account creation | **No account creation** | No registration, sign-in, authentication, or studio account system. |
| Account deletion URL | **Not applicable** | The app does not create accounts. Do not invent an account-deletion backend. |
| Data deletion request mechanism, if still asked | **Yes — the public privacy-request email in the policy** | `bloedefeainne.games@outlook.com` accepts correspondence/deletion enquiries. This does not mean the studio can remotely erase local saves. |
| Independent security review / validation badge | **Do not claim one** | No such review or certification is established by this work. |

For deletion requests, the public policy explains that game preferences are cleared in Android app settings, platform backups are managed through device/account controls, and studio support correspondence can be the subject of an email request. Do not describe this as automatic account deletion or remote deletion of a player database.

The console may hide questions after **No** to collection/sharing; skip hidden questions. “Not applicable” above describes that branch, not a fabricated checkbox or a certification. If an optional badge or security feature has not been independently established, leave the claim unset.

## Data categories

For this version, select **no collected/shared categories**: location; personal information; financial information; health/fitness; messages; photos/videos; audio; files/documents; calendar; contacts; app activity; web browsing; app information/performance; device or other identifiers.

Specific distinctions:

- Best score, sound, vibration, language, and initial interface-language resolution are local processing. Unity may process hardware/runtime information to run the engine, but this configuration does not upload it.
- Ordinary local logs are not an implemented diagnostics upload. Engine Diagnostics, legacy Analytics, Cloud Diagnostics reporting, and Performance Reporting are disabled.
- The game opens a constant policy URL in the external browser, not an embedded WebView or a prefilled player-data form. Browser requests and GitHub hosting logs are explained in the policy separately.
- Support email is sent voluntarily outside the game. There is no in-app email/message collector. The studio's processing of correspondence is disclosed in the policy rather than misdescribed as game telemetry.
- Android backup is platform-controlled. The game has no developer-operated cloud save or ability to access the user's external backup account.
- Translation feedback remains unconfigured. Enabling its prefilled form would require reviewing what is sent before using these answers again.

## Other Play Console fields

These are separate from the core Data safety declaration:

| Field | Answer / action |
| --- | --- |
| Privacy policy URL | `https://bloede-feainne-games.github.io/privacy/merge-planets/` |
| App access | No login, membership, or access credentials required. |
| Contains ads | **No**. AdMob is planned, not implemented. |
| Advertising ID | No advertising-ID use or permission in this configuration; confirm the generated artifact has no such permission. |
| In-app purchases | None in this version. Remove Ads is planned, not implemented. |
| Target audience and content rating | A publisher/product selection, not established by source analysis. Choose the real intended audience and complete the rating questionnaire. Do not infer an adult-only audience or claim a Families badge from these privacy facts. |

## Verified facts and remaining release work

**Verified:** project identity, source code and dependencies, disabled telemetry settings, the explicit manifest removal directives, the exact policy URL and serialized button wiring, local storage, unconfigured feedback, no new SDKs, and successful runtime/Editor managed C# compilation against the installed Unity assemblies.

**Not performed:** a new Unity player build, final AAB merged-manifest inspection, on-device button/gameplay smoke testing, and live-host HTTP confirmation. The Editor exits at licensing before compiling the project; an upload keystore/alias is also not configured. These are specific build/signing/verification limits, not a demand for a general network audit.

After restoring the Unity license and selecting the upload key, use `MergePlanetsClosedTestingBuild.BuildClosedTesting`. Before upload, confirm package/version, non-Development mode, no Internet/advertising-ID/billing permissions in the generated artifact, and that Pause → Privacy Policy opens the published page. If the build matches this configuration, use the answers above. If integrations or permissions differ, review those concrete differences rather than reusing this declaration blindly.

The policy text is finalized for the documented version. No final AAB or Play Console submission is claimed. No unresolved SDK integration currently requires a full intercepted-traffic audit.

References: [Google Data safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469), [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311), and [implementation evidence](privacy-audit-merge-planets.md).
