# Merge Planets — Data Safety for the TestAdMob Alpha

> Historical 4 November snapshot, superseded by the [5 November source/APK audit](advertising-privacy-audit-2026-11-05.md) and [current Data Safety guide](google-play-data-safety.md). Statements below about no mediation, startup UMP, universal child treatment and missing age screening do not describe the current working tree. Retained as historical evidence, not release instructions.

Audit: 4 November 2026. Package `com.feainne.mergeplanets`. This is a preparation document, not a submitted Console declaration. No website publication or Console changes were performed.

## Evidence and limits

The current project adds Google Mobile Ads Unity 11.6.0 / Android 25.5.0 and UMP 4.0.0 to Play Games Unity 2.2.1 / Android Games v2 22.0.0 and In-App Updates 2.1.0. Unity IAP 5.3.1 remains installed; real purchases are off and native Billing is excluded from this Alpha. There is no mediation, Firebase, studio backend, Unity Analytics, or enabled Unity diagnostic reporting.

The native adapter uses Google's demo App ID and rewarded unit. UMP Update runs at startup; initialization/preload waits for successful privacy checks and CanRequestAds. Child treatment, G, non-personalization and disabled publisher first-party IDs apply to every user. Advertising-ID and AdServices permissions are removed. This is a configuration audit, not proof that every Google SDK is telemetry-free. No connected phone was available to observe actual test delivery or region-specific UMP behavior.

Sources:

- [Mobile Ads data disclosure](https://developers.google.com/admob/unity/privacy/play-data-disclosure) and [Android disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure): Google lists IP/general location, interactions, diagnostics and identifiers, with advertising, analytics and fraud-prevention purposes and TLS. Child/test settings do not justify declaring “no data.”
- [Play Games data disclosure](https://developer.android.com/games/pgs/data-collection): identity, game-service data, automatic SDK analytics/diagnostics, HTTPS and Google deletion controls.
- [Play form definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en): include SDK transfers; optional means users can control collection, not merely choose whether to watch an ad. Service-provider exceptions need an applicable basis.
- [UMP](https://developers.google.com/admob/unity/privacy), [under-age consent handling](https://developers.google.com/admob/unity/privacy/gdpr), [request targeting](https://developers.google.com/admob/unity/targeting).
- [Families requirements](https://support.google.com/googleplay/android-developer/answer/9893335) and [self-certified SDK list](https://support.google.com/googleplay/android-developer/answer/12955712). The standard GMA SDK version is in the listed range; this does not certify the whole game.
- [Ads declaration](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en), [account deletion](https://support.google.com/googleplay/android-developer/answer/13327111), [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311).

## Top-level Console answers

| Question / area | Recommended answer for this Alpha | Reason / qualification |
|---|---|---|
| Does the app collect or share required user-data types? | **Yes** | GPGS synchronization and native ad/UMP requests leave the device. |
| Is all collected user data encrypted in transit? | **Yes for the audited Google SDK paths**, subject to the final artifact retaining these paths | Google documents HTTPS/TLS; game code adds no HTTP upload endpoint. This says nothing about encryption of local JSON or end-to-end encryption. Do not include arbitrary external browser navigation as an app upload. |
| Does the app contain ads? | **Yes** | It integrates and offers real Google test rewarded ads. A test placement is not a mock-only UI and should not be described as an ad-free release. |
| Advertising ID declaration | **No for this restricted configuration** | No game code reads AAID; child treatment and removal of AD_ID apply. This is not a “No” for the broader Device or other IDs data type. Revisit on any age/SDK/configuration change. |
| Account creation methods | No separate app account is created; Google Play Games provides an external gamer identity | Do not invent an email/password registration system or claim the game cannot use an account. If Console asks about access using externally created accounts, answer **Yes**. If the displayed form treats the Google-managed profile creation flow as app account creation, select its Google/OAuth route and provide the deletion path; verify that precise wording/flow before submission. |
| Can users request deletion? | Provide the policy's **#retention** route and Google game-data deletion controls | Local reset, Google game-data deletion and studio-email deletion have different scopes. Do not promise that a support email erases Google ad logs or every backup. Confirm Console accepts the described request route; no in-app “delete everything” feature exists. |
| Automatically delete within 90 days? | **No** | No such retention schedule exists. |
| Independent security review / certification | **No** | No independent assessment was performed. |
| Target audience / Families | **Owner must confirm the actual Console age groups** | Every Alpha ad request currently receives child protections. Do not invent age-group selections, a neutral age screen, parental consent, or whole-app Families certification. |
| Real purchases / purchase information | **No active payment processing in this version** | Shop preview only; no prices, payment tokens or real purchase history generated by this Alpha. Editor transactions are local test data, not Android payment activity. |

Privacy policy URL after the prepared file is published by the owner:
`https://bloede-feainne-games.github.io/privacy/merge-planets/`
Deletion guidance URL: the same URL with `#retention`.

## Data types and purposes

The table separates direct code evidence from Google's SDK disclosure. **Required** is the conservative form answer where startup/preload has no universal in-app opt-out. Offline failure is not an opt-out. **Non-ephemeral** is recommended because cloud records and provider logs have no verified request-only retention guarantee.

| Console data type | Collected | Shared | Required / optional | Ephemeral | Purposes to select | Evidence and limit |
|---|---|---|---|---|---|---|
| Location → Approximate location | Yes | Yes | Required | No | Advertising or marketing; Analytics; Fraud prevention, security and compliance | Google's documented IP-derived location; no GPS request. The app itself does not calculate a user's location. |
| Location → Precise location | No | No | — | — | — | No location permission, GPS or precise-location API in game code/configuration. |
| Personal info → User IDs | Yes | Yes, conservative | Required, conservative aggregate | No | App functionality; Account management; and SDK-supported advertising/analytics/fraud purposes where an account-linked identifier is used | Play Games ID is associated with cloud progress and rankings; Google also documents possible account identifiers in ads. GPGS-only transfers require successful sign-in and can be avoided through Google's sign-in controls. Do not mark this entire category optional on that basis if another SDK collects it automatically. Exact account identifiers used by restricted test ads are not enumerated by the SDK documentation. |
| Device or other IDs | Yes | Yes | Required | No | Advertising or marketing; Analytics; Fraud prevention, security and compliance | SDK disclosure includes app-set and other technical identifiers. AD_ID permission and publisher first-party IDs are disabled; that does not eliminate this category. Receipt GUIDs identify reward events, not hardware. |
| App activity → App interactions | Yes | Yes | Required overall | No | App functionality; Analytics; Advertising or marketing; Fraud prevention, security and compliance | Scores, achievements, SDK interactions/ad views; automatic SDK operations mean this combined category is not universally optional. Do not add ad personalization. |
| App activity → Other user-generated content | Yes, recommended mapping for cloud board/atlas/inventory | Yes, conservative | Optional through Google sign-in controls for this payload | No | App functionality; Fraud prevention, security and compliance | Board snapshot, discovery/achievement state, gift/reward/spending ledger and integrity metadata uploaded through Saved Games. If Console classifies all such gameplay state as App interactions, document that mapping and do not invent an extra payload. |
| App info and performance → Diagnostics | Yes | Yes, conservative | Required | No | Analytics; Fraud prevention, security and compliance; App functionality for service reliability | Google documents SDK performance/stability diagnostics. Unity reporting being off is irrelevant to Google SDK reporting. |
| App info and performance → Crash logs | **Not established as a separate type** | Not established | — | — | — | Official pages say diagnostics but do not explicitly list crash traces for this exact restricted configuration. Do not claim either “verified no crash logs” or fabricated crash fields. Confirm the Android SDK disclosure/support classification before submitting this particular checkbox. |
| Personal info → Name; Photos and videos → Photos | No game-origin upload identified; check Google-managed profile scope | Not established as separate app uploads | — | — | — | LoadUsers downloads gamer names/avatars for display; our save format does not upload them. Google manages profile creation/editing. Downloading an existing avatar is not proof that the app uploads the user's photos or real name. Review any profile-creation flow exposed by native GPGS before marking separate collection. |
| Email, phone, address, contacts, friends list, messages, audio, files/documents, browsing/search history, health, financial/payment details | No evidence of collection by this integration | No evidence | — | — | — | The app requests none of these inputs/APIs. A voluntary email to Outlook is outside the app; the website opens in an external browser with no player query parameters. |

**Sharing:** Google is an external recipient. For GPGS-only data, a service-provider or user-initiated-transfer exception may apply, but the current game also auto-syncs; do not assume every transmission is exempt. The recommendations disclose sharing conservatively. For Mobile Ads, Google's own disclosure says collection and sharing, so do not answer “not shared” merely because the destination is Google. A provider's legal role and the form definition are separate from the network destination.

**No personalization purpose:** requests set Child, G, npa=1, PublisherPrivacyPersonalizationState.Disabled and PublisherFirstPartyIdEnabled=false. The game does not pass player ID, score or wallet as ad targeting or SSV custom data.

**Deletion:** the game has one canonical wallet; resetting a run does not erase it. Clear Android app storage for local data, delete Merge Planets game data in Google Play Games, and clear old-device copies/queued sync to avoid re-upload. Google ad/consent records use Google's controls and retention rules, not the game's local receipt deletion. No fixed Google deletion SLA is promised.

## Before submitting a Play update

1. Publish the prepared policy separately; the code change does not publish it. Keep the existing public URL and studio email `bloedefeainne.games@outlook.com`.
2. Confirm the owner’s actual age-group selection and review Families requirements for the whole app, including GPGS eligibility, ad presentation and store listing. Leave production approval flags false.
3. Confirm the remaining SDK data-type mapping above (especially separate crash logs and native profile-creation behavior) against the precise Console questions. This document deliberately does not certify uncertain fields.
4. Review the final release manifest/dependencies again if configuration changes. Test mode does not justify declaring “no data” or “no ads.”
5. Complete device QA for test ads, privacy choices, offline failures and reward recovery. No full traffic audit is required by this implementation; investigate traffic only if a concrete unresolved behavior appears.

## Verified merged Android manifest

The release manifest generated in this audit retains `com.feainne.mergeplanets`, version `0.2.0` / code `3`, and is not debuggable. Permissions: INTERNET, ACCESS_NETWORK_STATE, VIBRATE, WAKE_LOCK, FOREGROUND_SERVICE and the app-scoped DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. No AD_ID, AdServices, Billing, camera, microphone, phone-state or location permission remains. The AdMob APPLICATION_ID is the Google test ID. DELAY_APP_MEASUREMENT_INIT is true. Permissions alone do not describe all network processing: network access still permits SDK diagnostics and IP transmission.
