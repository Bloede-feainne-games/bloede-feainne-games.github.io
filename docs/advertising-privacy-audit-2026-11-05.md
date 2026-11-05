# Merge Planets — аудит рекламы, возраста и конфиденциальности

## Актуализация: единая политика Alpha / Production — 5 ноября 2026

**Этот раздел заменяет выводы о текущем runtime из первоначального аудита ниже.** Старое исследование сохранено как история другой сборки; его четыре блокера нельзя автоматически приписывать новой Google-only Alpha. Политика не является разрешением включить production или заявлением юридической сертификации.

### Повторно проверенные факты

- Прочитаны актуальные `AgeEligibility.cs`, `NeutralAgeScreen.cs`, `GoogleRewardedAdsProvider.cs`, `RewardedAds.cs`, `AdMobBuildConfiguration.cs`, настройки, purchase provider и `Docs/AGE_ADVERTISING_TEST_2026-11-05.txt`. PGS/cloud/local sources сопоставлены с прежним SHA-снимком: их структура не изменилась. [Новый снимок 19 файлов](unified-privacy-source-snapshot.json) отделён от исторического.
- Текущий validation APK: **0.3 / code 4**, 66,212,972 байта, SHA-256 **b329989bb3efdd6d2935fbc9874b8ea7f3ad3a5f5bee144dfb3ee0f6b6422698**. Путь тот же: `Builds/Validation/AdMobAlphaAndroid/launcher/build/outputs/apk/release/launcher-release-unsigned.apk`.
- В этой задаче заново разобраны **18,425 DEX class definitions**: ноль классов `com.yandex`, `io.appmetrica`, `com.admob.mobileads`; Google rewarded и UMP присутствуют. Повторно прочитаны permissions через `aapt2`; нет AD_ID, AdServices, Billing и location. Бинарный manifest повторно сопоставлен с отчётом сборки. Это unsigned APK, а не подписанный release AAB и не доказательство состава уже загруженного в Console файла.
- Gradle исключает Yandex adapter, Yandex Mobile Ads, AppMetrica и Varioqub из всех runtime configurations. Editor dependency declarations остались для будущей работы. Наличие этих XML/Gradle строк не означает наличие SDK в APK.
- AdMob Unity 11.6.0 / Standard Android 25.5.0, UMP 4.0.0, GPGS Unity 2.2.1 / Android 22.0.0, Play In-App Updates Unity 1.8.5 / Android 2.1.0, Unity IAP 5.3.1 в проекте; IAP activation выключен. Unity reporting выключен. Версии вынесены в аудит, в публичной политике их нет.
- Child, Teen и Unknown теперь допускаются к **Google-only** rewarded. Child/Unknown получают Child treatment и UMP TFUA=true. Teen получает Teen только при достижении configured threshold; при текущем threshold=18 остаётся Child. Adult: Unspecified, UMP TFUA=false. Во всех ветках G, npa=1, publisher first-party ID и personalization выключены. Demo units не проверяют реальные production inventory.
- Stale UMP/init/load callbacks теперь ограждены `RewardedRequestFence` и проверкой текущего профиля. Suspend инвалидирует backend, очищает ready/showing handles. Старые Yandex calls удалены. Privacy-options requirement сохранён вне service; добавлен options-only путь после ограничения возраста. Это статическая проверка исправлений, не новая проверка на телефоне.
- Native Yandex lifecycle blocker в Alpha устранён физическим исключением SDK. Это **не реализация безопасного будущего Yandex lifecycle**. `EnableAdultYandexMediation=true` отвергается Validate; production Google-only дополнительно требует review inventory/audience flags. Flags не являются согласием игрока.

### Возраст: точное поведение вместо обещания ежегодного popup

Сохраняются category, answered, teenDate, adultDate, eligibleDate, lastDate, editAfter, version и integrity tag; raw age/DOB не сохраняются, но minor dates позволяют оценить введённый возраст. Child/Teen через календарный год становятся Unknown **при чтении**, сохранённый answered остаётся true; автоматической повторной анкеты нет. Возраст можно заново ввести через Age and player с существующим cooldown. Adult ежегодно не истекает. В политике это описано как ежегодное истечение решения с ограничениями до ручного обновления, а не обязательный popup или автоматическое взросление. Если продукту нужна именно автоматическая ежегодная анкета, её ещё нужно реализовать в Unity.

Skip отменяет текущую попытку рекламы, но последующие добровольные действия допускают restricted Google ads. Age and player временно блокирует новые requests во время исправления; Skip снимает session block, оставляя Unknown. Ни correction, ни expiry не удаляют backup/recovery. Android Clear storage удаляет локальные данные вместе с игровыми; Android backups, PGS и provider servers имеют отдельный охват.

### Что изменено в публичном документе

Сохранены URL, контакт, общий header/footer, оформление и все старые anchors. Дата редакции 5 ноября 2026, первоначальная effective date сохранена. Убраны SDK/build versions, фиксированное число achievements и привязка к текущим implementation diagnostics. PGS identity/ranking/achievements, полный смысл cloud payload, local storage, deletion и сторонние providers сохранены.

Google ads и UMP описаны как реально используемые, включая test-mode technical processing. Yandex описан как **планируемый условный** adult/Russia provider; dated Alpha statement остаётся исторически верным после будущего релиза. AppMetrica не объявлена действующей аналитикой. Условия не разрешают произвольный новый сбор: additional analytics/location/purchases требуют отдельной проверки и disclosure. Rewarded laser/calendar функции сохранены без фиксированных цен/номиналов; paid shop отражён только как отключённый preview.

### Условия перед production и будущим включением Yandex

1. Проверить реальные Console возрастные группы, страны и активные artifacts, UMP messages и каждый live ad unit. Group name `RU_BY` не доказывает Russia-only; demo ad не проверяет live waterfall.
2. Для child/Unknown production AdMob подтвердить сертифицированный SDK, реально Google-only inventory, допустимые данные, содержание и Families-формат, включая возможность закрыть подпадающую под правило rewarded-рекламу в течение 5 секунд. G rating и технический проход UnitId не доказывают этого. Требуется Android device QA; если inventory не может выполнить условия, не включать соответствующий serving.
3. Будущий Yandex: реализовать действительный runtime age + Russia + provider/purpose consent gate **до любых** privacy/init/request эффектов; отключить native auto-init; обеспечить безопасный native lifetime, изоляцию несовершеннолетних/Unknown, отзыв и смену игрока, включая persisted background work. Нельзя просто снять Gradle exclusions или поставить review flags. Текущий код эту интеграцию не реализует.
4. UMP проверяется при первой рекламной активации каждого нового процесса, а не автоматически на каждом cold start без рекламы. Google рекомендует Update на каждом запуске. Проверить доступ к обязательным privacy options сразу после перезапуска до первой рекламы: нынешний on-demand `activationRequested=false` откладывает выяснение requirement. Для гарантированного доступа на каждом запуске нужна независимая от ad activation актуализация UMP/entry point с корректными age flags, без запуска ad SDK. Политика не обещает несуществующий startup callback или постоянно видимую кнопку.
5. PGS automatic authentication не защищена ad-only age gate. Проверить supervised accounts/6+ и фактическую доступность Google-managed profile creation. Не объявлять весь app Families-certified на основании исправлений рекламного провайдера.
6. Перед активацией Yandex установить точный состав и обработку его транзитивных модулей. Официальный SDK8 default disclosure не перечисляет Google-like diagnostics/interactions/location collection; нельзя приписывать их Yandex по аналогии или обещать zero-data из-за отсутствия AD_ID. Самостоятельная AppMetrica аналитика не покрыта условным рекламным абзацем.
7. Подписанный release AAB, реальные age switches/consent/refusal/withdrawal, SDK init/network и creatives проверить до релиза. В этой задаче Unity, Console и рекламные кабинеты не менялись, Unity tests и device QA заново не запускались. Старые Unity test reports прочитаны, но не выданы за выполненные здесь.

### Сверка Data Safety и пределы долгосрочности

[Обновлённая таблица](google-play-data-safety.md) относится к Google-only Alpha и отдельно перечисляет Yandex delta. Фактический сохранённый ответ Console не предоставлен и не прочитан; совпадение с ним не подтверждено. Сняты устаревшие предположения adult-only и bundled Yandex, сохранены реальные advertising/PGS disclosures. Обычные UI/achievement/SDK обновления и test→live не требуют переписывать политику **только при неизменной фактической обработке**. Новый SDK может поменять сбор даже без нового gameplay — требуется diff-аудит, а не механическая замена номера.

### Проверка внешних источников

5 ноября 2026 повторно проверены Google privacy, AdMob disclosure, UMP, PGS disclosure, Families и Data Safety definitions по официальным страницам в списке ниже. Yandex SDK8 disclosure после timeout веб-инструмента прочитан напрямую по HTTPS (HTTP 200); Yandex Privacy Policy доступна. Для provider links выполнена отдельная проверка HTTP. Публичный текст не содержит утверждения о сертификации GDPR/LGPD/COPPA.

### Проверка готовой редакции

- `git diff --check`: успешно. Все 5 HTML-страниц разобраны с проверкой парности тегов и уникальности IDs; 106 local links/fragments существуют.
- Сравнение с началом этой задачи: header/footer byte-identical, все прежние anchors, canonical URL, email, effective date и requested revision date сохранены; CSS/JS/assets не менялись.
- Desktop 1280×900 и mobile 360×800: изображения загружены, горизонтального overflow нет, оглавление указывает на реальные секции. Скриншот результата: `/tmp/merge-planets-unified-policy-desktop.png`.
- Проверены 13 внешних URL: 12 ответили HTTP 200 (Google account controls закономерно ведут на sign-in). Microsoft вернул 403 на прямой автоматический запрос; официальная страница успешно прочитана веб-инструментом с redirect на `https://www.microsoft.com/en-us/privacy/privacystatement`. Это не объявлено проверкой доступа анонимно ко всем account controls.
- Финальный SHA-снимок текущих Unity sources совпал. В этой задаче нет commit, push, публикации или изменений Unity/Console.

---

## Исторический аудит предыдущей сборки (сохранён без переписывания выводов)

Дата: **5 ноября 2026**. Пакет `com.feainne.mergeplanets`, Unity **6000.3.27f2**, версия **0.2.0 / code 3**. Проверены фактические файлы Unity working tree, установленный PackageCache, Maven POM/AAR, экспорт Gradle, merged manifest и бинарный manifest существующего validation APK. Это **не подтверждение готовности production или соответствия законодательству**.

**Результат:** найденные рекламные initialization providers удалены из проверенного manifest; все рекламные запросы из игрового кода для Unknown/Child/Teen запрещены. Нельзя подтвердить отсутствие обработки Yandex после взрослой сессии на общем устройстве. Найдены конкретные ошибки жизненного цикла и ограничения управления согласием; ниже указаны необходимые исправления Unity. Production-флаги должны оставаться выключенными.

## 1. Источники и границы проверки

Unity: `/home/vasilii/workspace/MobileGames/MergeDrop`. HEAD `b2efc71a59c033667266a0d82d8fcdf9da819307` — старый offline-коммит; новая интеграция находится в **незакоммиченном working tree**. Нельзя приписывать её этому коммиту. Во время аудита source manifest был перезаписан с иным порядком permissions и metadata; повторная XML-проверка подтвердила сохранение всех проверенных init/permission restrictions. Hash manifest в снимке обновлён после этой проверки; остальные 16 файлов совпали с первоначальным снимком. Снимок SHA-256 проверенных текущих исходников: [advertising-privacy-source-snapshot.json](advertising-privacy-source-snapshot.json).

Проверенный артефакт, прочитанный `aapt2 dump xmltree`, а не только его шаблон:

`Builds/Validation/AdMobAlphaAndroid/launcher/build/outputs/apk/release/launcher-release-unsigned.apk`

65,765,941 байт; SHA-256 `411b05f41c7a877603e5a1d9d9038000b7e0dc995a967028c5d277fd3c9a4857`. Это **unsigned validation APK**, не подписанный выпускной AAB; его наличие не доказывает соответствие будущей сборки текущему working tree. Предыдущий hash из `Docs/YANDEX_MEDIATION_VERIFICATION.md` описывает другой артефакт.

Без изменения Unity, запуска новых Unity-тестов, установки APK, тестирования на телефоне, сетевого перехвата, входа в рекламные кабинеты или изменения Play Console. Прочитанные прежние test reports не выдаются за заново выполненные проверки. Политика и документы сайта изменены локально; автоматической публикации этого аудита нет.

Владелец сообщил: планируется аудитория **6+**; Yandex — только **18+ / Россия / AdMob Waterfall**; под несовершеннолетних/Unknown создан отдельный блок без Yandex. Фактические выбранные группы/страны и включение Yandex в UMP не проверены. Название `MergePlanets_RU_BY_Adult` в asset не является доказательством России, Беларуси или фактической географии группы.

## 2. Проверенные SDK

| SDK/компонент | Подтверждённая версия и состояние |
| --- | --- |
| Google Play Games Unity / Android Games v2 | **2.2.1 / 22.0.0**; включён, автоматическая авторизация, рейтинг, 11 достижений, Saved Games |
| Google Mobile Ads Unity / Android Standard | **11.6.0 / 25.5.0**; выбран Standard, не Next-Gen; текущий `RewardedAdsMode: 1` = TestAdMob |
| Google UMP Android | **4.0.0**; privacy update → required form → `CanRequestAds()` перед рекламной инициализацией/загрузкой |
| Yandex AdMob custom-event adapter | **8.6.0.0**, `com.yandex.ads.adapter:admob-mobileads`; native entry `com.admob.mobileads.YandexRewarded` |
| Yandex Mobile Ads Android | **8.6.0**, `com.yandex.android:mobileads`; установлен, но Google demo units не вызывают live Yandex waterfall |
| AppMetrica Android | **8.6.0**, транзитивная зависимость Yandex, pin подтверждён; `analytics-identifiers` исключён, но App Set ID/прочие компоненты остаются |
| Varioqub adapters | **0.6.0**, транзитивные `appmetrica-adapter` / `analytic-adapter`; не отдельная подтверждённая студийная активация/аналитическая функция |
| Google Play In-App Updates | Unity **1.8.5**, Android **2.1.0**, core-common **2.0.4**; включён |
| Unity IAP | **5.3.1** установлен; `EnableLaserPurchases: 0`; native `com.android.billingclient:billing` не найден в проверенном runtime report; purchase preview ≠ реальные покупки |
| Unity Analytics / Engine Diagnostics / Cloud Diagnostics / Performance Reporting / Unity Ads | Выключены в UnityConnectSettings; это не выключает Google/Yandex SDK |

EDM — редакторский resolver, не отдельный player-рекламный провайдер. Наличие AppMetrica billing/crash API-модулей само по себе не доказывает покупку или передачу crash logs. Наличие `play-services-ads-identifier:18.0.0` и `play-services-appset:16.1.0` не равно наличию разрешения AAID и не доказывает отсутствие других ID.

## 3. Реальные рекламные вызовы и выдача наград

`CosmicLaserController.WatchAd`, `DailyRewardsController.WatchAd`, `GoogleRewardedAdsProvider` и `Core/RewardedAds.cs` подтверждают только **rewarded**:

- лазер при пополнении запаса и добровольный last-chance laser до окончания партии;
- дополнительный daily-gift bonus и восстановление допустимого пропущенного дня;
- бесплатный daily gift сохраняется; нет принудительного показа после проигрыша, banner/interstitial/game-over advertising flow не найден;
- `RewardedAd.Show` вызывается из явного рекламного действия; только earned callback подтверждает награду;
- локальный журнал и reward ledger предотвращают повторное начисление. Это не server-side verification. История наград/дней синхронизируется в прежнем игровом cloud payload;
- после закрытия рекламы сервис может preload следующую: обработка не ограничивается секундами просмотра.

Структура PGS, достижения, рейтинг и состав сохранений сохранены в политике. `CloudProgress` / `PlayGamesSceneBridge.Capture` содержат board/run, best score, achievements, atlas, laser ledger, gift history и revision/integrity metadata, но не age record и не sound/vibration/language preferences.

## 4. Возраст: сохраняется не только категория

`AgeEligibilityRecord` / `AgeEligibilityStore`:

| Поле | Значение |
| --- | --- |
| `version`, `category`, `answered` | версия, Unknown/Child/Teen/Adult, ответ/отказ |
| `teenDate`, `adultDate`, `eligibleDate` | рассчитанные даты перехода 13/18 лет и допуска к рекламе; для взрослого переходные даты сбрасываются |
| `lastDate`, `editAfter` | дата решения, ограничение корректировки на 30 дней |
| envelope/tag | HMAC integrity wrapper из ProgressIntegrity; не шифрование и не серверная проверка возраста |

Вводится целое число 1–120; нет DOB и предзаполненного/выделенного возраста. После закрытия поле очищается. Первоначальное число не сериализуется напрямую, **но для несовершеннолетнего разница дат позволяет приблизительно восстановить введённый возраст**. Нельзя писать «сохраняется только категория» или «возраст невозможно восстановить».

Файл `age-eligibility.json` находится в `Application.persistentDataPath`. `ProgressIntegrity.AtomicWrite` может сохранять `.bak`, незавершённый `.tmp` и recovery-копии. `Age and player` вызывает `Decline`: primary record становится Unknown, cooldown сохраняется, предыдущий record может остаться в backup. Это **ограничение рекламы, не удаление**. Полное существующее удаление — Android Clear storage; вместе удалятся локальные игровые данные. Отдельного age-only erase UI нет. Uninstall обычно удаляет app storage; OS backups и ранее отправленные vendor records управляются отдельно. Явных backup exclusions для age-файлов не найдено. Прямой передачи численного возраста/дат в PGS или custom targeting нет; SDK получают regulatory age/consent signals.

## 5. Инициализация, идентификаторы, COPPA/TFUA

Проверены `AdMobBuildConfiguration.ConfigureManifest`, postprocessor, manifest AAR и actual APK:

- отсутствуют Google `MobileAdsInitProvider`, Yandex `YandexAdsInitializeProvider`, AppMetrica `PreloadInfoContentProvider`;
- `com.yandex.mobile.ads.AUTOMATIC_SDK_INITIALIZATION=false`, Google `DELAY_APP_MEASUREMENT_INIT=true`;
- `AdMobIntegrityCheckProvider` остаётся. Его constructor/onCreate и helper `b.yame` прочитаны через `javap`: проверка debug-флага и лог версии, не вызов Yandex initialization. Non-exported debug FileProvider тоже не является рекламным init provider;
- **AD_ID, AdServices, GPS/location, camera, microphone, phone-state, Billing permissions отсутствуют**. Есть INTERNET, ACCESS_NETWORK_STATE, VIBRATE, WAKE_LOCK, FOREGROUND_SERVICE, app-scoped receiver permission, BIND_GET_INSTALL_REFERRER_SERVICE;
- AppMetrica identifier module исключён в generated Gradle. Это не исключение App Set ID, сетевых запросов или всех технических данных;
- `Get()` создаёт provider без native initialize. Первый допустимый ad action запускает UMP; затем `MobileAds.DisableMediationInitialization()` и `MobileAds.Initialize()`; Yandex должен запускаться адаптером при выборе его сетью;
- действующий жёсткий `CanRequestForAge` принимает **только Adult**, даже если региональный threshold случайно снизить. Under18 ad unit существует, но runtime его не запрашивает;
- активный взрослый путь применяет `AgeRestrictedTreatment.Unspecified`, G, personalization disabled, publisher first-party ID disabled, `npa=1`; UMP `TagForUnderAgeOfConsent=false` для этого пути;
- `AgeRestrictedTreatment.Child` применяется при ограничении уже запущенного SDK; Teen branch в коде есть, но недостижим при действующем adult-only guard. Не писать, что все пользователи получают COPPA/child treatment;
- текущий GMA API использует `AgeRestrictedTreatment` как замену старых TFCD/TFUA. UMP TFUA — отдельный параметр; TFUA нельзя считать автоматическим согласием или настройкой Yandex;
- Yandex production settings: `setLocationTracking(false)`, `setAppAdAnalyticsReporting(false)`, `setUserConsent(false)`, `setAgeRestricted(false)` для adult; restricted=true при смене профиля. API имена проверены в actual AAR 8.6.0, а не перенесены из примера старого SDK.

**Что это доказывает:** найденные механизмы автостарта выключены; C# запрещает создание ad requests для cold child/unknown. **Чего не доказывает:** отсутствие всех внутренних native операций/передач после взрослой сессии, соблюдение всех Families правил, доступность/параметры live waterfall, реальную работу consent UI. Проверка итогового APK важнее настроек инспектора; здесь она выполнена, но runtime-теста на телефоне нет.

## 6. Исправления Unity перед production

### Блокер A — отложенный UMP callback может вернуть взрослые настройки

`GoogleRewardedAdsProvider.cs:107–122` и `:176–178`: результат UMP вызывает `ConfigureYandex(false)` **до** возврата в `RewardedAdsService`, где проверяется `suspended`. При смене Adult → Unknown/Child старый service приостанавливается, но его pending backend callback всё ещё может применить взрослые Yandex settings. `ShowPrivacyOptions` имеет ту же последовательность. Это статически найденная race; device-reproduction не выполнялся.

**Исправление:** передавать backend актуальный eligibility/consent generation token и проверку allowed непосредственно перед каждой записью vendor-настроек, init/load/show и в каждом асинхронном callback; инвалидировать token до `Suspend`/смены профиля/отзыва. Stale callback не должен ослаблять restrictions или снова load рекламу. Нужны тесты задержанных UMP update/form/options после Adult → Unknown/Child/Teen и после отзыва.

### Блокер B — смена игрока не останавливает уже запущенный SDK

`RefreshAge` уничтожает ready ad и останавливает новые requests; `RestrictExistingSdk` меняет flags. `Suspend` не выгружает SDK и не отменяет native initialization, уже отправленную работу или все активные callbacks. Поэтому обещание «Yandex никогда не обрабатывает данные детской аудитории» при общем процессе сейчас недоказуемо.

**Исправление:** реализовать проверяемую изоляцию взрослой рекламной сессии либо подтверждённый поставщиком механизм остановки/сброса обработки. При невозможности native shutdown — изолировать взрослую рекламу от детского игрового процесса с очисткой/запретом восстановления отложенной vendor-работы, либо исключить Yandex из смешанного 6+ выпуска до решения этого ограничения. Обычный reload Unity scene или перезапуск без проверки persisted background jobs недостаточен. До подтверждения безопасной модели не включать production Yandex для смешанной аудитории. Не подменять это UI-галочкой.

### Блокер C — разрешение Google запрашивать ads не подтверждает разрешение Yandex

`CanRequestAds()` проверяется, но нет отдельного runtime-решения, разрешающего конкретно Yandex для актуальных целей/региона. `setUserConsent(false)` не даёт положительного согласия и не гарантирует отсутствие любой обработки; `npa=1` не означает «не собирать данные». Владелец не проверял Yandex в UMP; mediation setup не доказывает consent setup.

**Исправление:** связать сетевой допуск Yandex с актуальным результатом проверенного CMP/TCF для этого провайдера и нужных целей. До разрешённого состояния не создавать Yandex privacy/init/load путь; выбрать гарантированно Google-only inventory или отключить ads, если безопасный fallback не реализован. При изменении/отзыве инвалидировать callbacks, уничтожить ready ads и обновить все сети **до** следующего load. Не выставлять `YandexPrivacyReviewed=true` вместо runtime-защиты.

### Блокер D — privacy-options entry пропадает при ограничении возраста

`PauseMenuController.RefreshAdPrivacy` зависит от `rewardedAds.PrivacyOptionsRequired`; `RefreshAge` обнуляет service. После Adult → Unknown кнопка может исчезнуть, хотя consent strings и запущенные SDK остались. Обещание постоянного доступа к обязательному отзыву/изменению тогда не выполняется.

**Исправление:** хранить/обновлять privacy-options requirement независимо от наличия активного рекламного service и сохранять доступ к обязательным формам после age restriction. Открытие формы не должно разблокировать SDK для ребёнка. Протестировать privacy options после смены игрока, отказа, рестарта и возвращения из background.

### Если планируется AdMob-реклама для детей/Unknown

Сейчас она запрещена; отдельный unit не меняет это. Не удалять adult-only guard только ради его использования. До включения реализовать отдельный путь без Yandex и неподтверждённых детских SDK, корректные возрастные сигналы **до init**, неперсонализированную рекламу и доказуемую закрываемость формата в требуемые Families сроки. Текущий rewarded ad не даёт доказанной гарантии закрытия через 5 секунд; G rating не решает это требование. Проверить точный self-certified SDK release. Yandex отсутствует в проверенном публичном списке Families self-certified SDK; использовать его как детскую сеть нельзя на основании одного COPPA setter.

### PGS и аудитория 6+

Play GamesInitProvider остаётся в APK, а `PlayGamesSyncService.Tick` автоматически вызывает authentication до ad-only age screen. Это не доказывает запрещённость PGS, но ad gate **не защищает весь сетевой стек**. Нужно подтвердить допустимость текущего PGS/account flow для 6+ и supervised accounts. Если SDK/операция недопустимы для детей — поставить их за соответствующую возрастную/родительскую защиту или использовать иную детскую конфигурацию; сохранить локальную игру. Не объявлять PGS нарушением лишь по факту наличия SDK, но и не выдавать Google account eligibility за выполненный аудит Families.

Дополнительно: age-only erasure с удалением backup/recovery и default Unknown улучшит privacy UX; сейчас честный доступный путь — Clear storage. Пересмотреть включение age metadata в Android backup.

## 7. Политика и Data Safety

[Политика](../privacy/merge-planets/index.html) сохраняет адрес, дизайн, общий header/footer и старые якоря. Сохранены подтверждённые PGS/11 achievements/leaderboard/cloud/local disclosures. Добавлены Yandex/AppMetrica, добровольные rewarded placements, фактические age records/deletion, ограничения инициализации и согласия. Дата редакции — 5 ноября; первоначальная effective date сохранена. Нет обещания юридического соответствия или включённой production-рекламы.

[Точные изменения формы Data Safety](google-play-data-safety.md) отделяют текущую конфигурацию от предполагаемой production и перечисляют категории, цели, required/optional, encryption/deletion и нерешённые поля. Не добавлять Yandex crash/analytics/geolocation по аналогии с Google: публичная таблица Yandex SDK 8 перечисляет другую default-модель. Встраивание AppMetrica без отдельной студийной активации тоже не доказывает передачу всех данных из её общей таблицы.

## 8. Что ещё требуется подтвердить

1. Фактические Play Console age groups и страны. Намерение «6+» не равно сохранённой конфигурации.
2. Серверная RU-only adult waterfall связь; ссылка на отдельный under-18 unit не заменяет runtime guard.
3. Реальные CMP/UMP messages, Yandex vendor/purpose states, отказы и региональные режимы. Без этого нет положительного заключения о согласии.
4. У поставщика: какие технические метрики/ID остаются именно в Yandex 8.6.0 с выключенными app-ad analytics/location и без analytics-identifiers, включая SDK-internal AppMetrica. Общая таблица не заменяет конкретный constrained flow.
5. Точечная device QA: cold Child/Teen/Unknown без рекламы/UMP/Yandex init; adult opt-in/reject; смена игрока во время UMP/init/load/options; отказ после взрослого запуска; отсутствие Yandex init/request вне adult RU waterfall. Сопоставить native init logs с сетевыми событиями — сообщение об интеграции SDK не является init.
6. Signed release AAB после исправлений: те же ограничения в final manifest/runtime graph; затем privacy/deletion paths и форма Console. Текущий unsigned APK не является этим AAB.

## Проверка подготовленных файлов сайта

- Пять HTML-страниц, 103 локальных ссылки/fragment references и `git diff --check` прошли проверку.
- Сравнение с policy working copy на начало задачи подтвердило неизменность общего header/footer, сохранность всех старых IDs, PGS/achievement/cloud списка и Google game-data deletion paragraph.
- CSS, JavaScript, artwork и маршрут политики не менялись. Desktop 1280 px и mobile 360 px проверены в браузере: без горизонтального overflow; изображения загрузились, ссылки оглавления указывают на существующие разделы.
- Финальный SHA-256 snapshot соответствует 17 проверенным текущим Unity source/config files. Единственная замеченная во время аудита перезапись source manifest переставила узлы; ограничения повторно проверены.
- Исходники Unity не редактировались этим аудитом. Публикация, Console submission и production activation не выполнялись.

## Официальные источники (проверены 5 ноября 2026)

- [Google Mobile Ads disclosure](https://developers.google.com/admob/unity/privacy/play-data-disclosure), [Android disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure).
- [Google UMP](https://developers.google.com/admob/unity/privacy), [age treatment / TFCD / TFUA](https://developers.google.com/admob/unity/targeting).
- [Yandex SDK initialization](https://ads.yandex.com/helpcenter/en/dev/android/quick-start), [Yandex data disclosure](https://ads.yandex.com/helpcenter/en/dev/android/app-privacy-android), [Yandex TCF](https://ads.yandex.com/helpcenter/en/dev/android/tcf-2-0), [GDPR](https://ads.yandex.com/helpcenter/en/dev/android/gdpr), [COPPA](https://ads.yandex.com/helpcenter/en/dev/android/coppa).
- [AppMetrica ad-ID exclusion](https://appmetrica.yandex.com/docs/en/sdk/android/get-ad-id), [Ads SDK integration](https://appmetrica.yandex.com/docs/en/common/ads-sdk-integration).
- [Families full policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en), [self-certified list](https://support.google.com/googleplay/android-developer/answer/12955712?hl=en), [Data Safety definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).
- [PGS disclosure](https://developer.android.com/games/pgs/data-collection), [Google game-data deletion](https://support.google.com/googleplay/answer/9130646?hl=en), [Google privacy](https://policies.google.com/privacy), [Yandex privacy and requests](https://yandex.com/legal/confidential/en/).
