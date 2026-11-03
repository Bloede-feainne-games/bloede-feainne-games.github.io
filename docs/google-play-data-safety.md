# Google Play Data safety — Merge Planets с Google Play Games

Дата проверки: **3 ноября 2026**. Package: `com.feainne.mergeplanets`. Разработчик: Bloede Feainne Games. Публичный контакт: `bloedefeainne.games@outlook.com`.

## Область применимости и статус

Это инструкция для **онлайн-конфигурации текущего Unity working tree**: Unity 6000.3.27f2, версия приложения 0.1.1 / version code 2 в исходниках, Google Unity Plugin 2.2.1, native `play-services-games-v2:22.0.0`. Оба поля `EnableGooglePlayGames` и `IncludeGooglePlayGamesInBuild` включены; Android define `MERGE_PLANETS_GPGS` присутствует. Версию фактически загружаемого AAB нужно сверить отдельно.

Старые ответы «данные не собираются» **не применять** к обновлению. Форма относится к приложению/package и совокупности активных вариантов, а не только к одному экрану или одной стране. Офлайн-версия не отменяет сбор в доступной онлайн-версии.

Проверены исходники, SDK, существующие отчёты Gradle/native smoke manifest и найденный старый AAB. Найден `Builds/Android/MergePlanets-closed-test.aab` от **1 ноября 2026 18:21:49 UTC**: в его dependency metadata нет PGS, а в protobuf manifest нет INTERNET, ACCESS_NETWORK_STATE, APP_ID и PlayGamesInitProvider. Он предшествует интеграции; это не аудит нового релизного AAB, не проверка Google-аккаунта на телефоне и не чтение заполненной формы в вашем Play Console. Нельзя объявить оставшиеся неизвестные параметры Google известными только на основании отсутствия вызова в игровом C#.

Политика для публикации: `https://bloede-feainne-games.github.io/privacy/merge-planets/`. Подготовленные изменения пока локальные. Перед отправкой формы необходимо отдельно разрешить публикацию политики, затем проверить её публичную версию.

## 1. Основные вопросы формы

Точные формулировки/условные поля могут отличаться. Названия ниже соответствуют смыслу официальной формы; при наличии её CSV-экспорта следует сопоставить реальные question IDs.

| Вопрос | Рекомендуемый ответ для текущего кода | Обоснование / ограничение |
| --- | --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** | PGS получает идентичность, игровые результаты, достижение, сохранения; SDK документирует собственные метрики. Наличие только Google-сервера не превращает передачу в локальную обработку. |
| Is all user data collected by your app encrypted in transit? | **Yes, на основании документации PGS и найденных потоков** | Google заявляет HTTPS для данных своего PGS disclosure; собственных HTTP uploads не найдено. Это не проверка пакетов и не end-to-end encryption. Если финальный APK содержит иной endpoint/SDK, ответ пересмотреть. |
| Which account-creation methods does your app support? | **OAuth / Google-managed sign-in — для вопроса о поддерживаемой SSO-аутентификации; границы account creation подтвердить по реальной форме** | Своей регистрации/базы аккаунтов нет; используется профиль Google Play Games, а ручной вход может предложить создание Google-managed gamer profile. Google включает SSO в определение app account. Поэтому автоматически выбирать «My app does not allow users to create an account» лишь из-за отсутствия своего backend нельзя. Если форма отдельно различает только внешний вход и создание app account, сверить её точную формулировку и PGS flow. Для применимого OAuth/app-account flow выполнить требования удаления до подачи. |
| Can users log in with accounts created outside your app? | **Yes — Google Play Games / Google-managed account** | Есть автоматический Authenticate и ручной ManuallyAuthenticate. Нельзя отвечать No только потому, что ввод пароля выполняет Google. |
| Do you provide a way for users to request that their data is deleted? | **Не заявлять безусловный Yes для всех данных приложения; при общем вопросе о едином реализованном механизме — No** | В игре нет DeleteCloudData, sign-out/opt-out и студийного механизма удаления всех Google-данных. В политике даны реальные Google self-service и Android controls; email удаляет студийную переписку, а не Google-аккаунт. Если конкретное поле Console принимает маршрут удаления у поставщика, согласовать ответ Yes с его точной формулировкой и проверить этот маршрут для своей игры. |
| Is data automatically deleted within 90 days? | **No** | Ни локальный формат, ни очередь, ни настройки не имеют такого TTL. Для Google такой срок не подтверждён. |
| Account deletion URL, если обязателен | **Не выдавать существующий privacy URL за проверенный полноценный механизм удаления app account** | `…/privacy/merge-planets/#retention` — доступная инструкция для Google/local/support данных. Если применяется app-account requirement, отдельно подтвердить, что данный flow соответствует ему, либо реализовать требуемый путь. Одного текста политики недостаточно для отсутствующей функции. |
| Independent security review / MASA | **No / не отмечать** | Тесты Unity и R8 не являются независимой сертификацией. |
| Families commitment badge | **Не отмечать без отдельного подтверждения** | Возрастную аудиторию и Families compliance нельзя определить по этой интеграции. Локальная игра без входа сама по себе не сертифицирует онлайн SDK для детей. |
| UPI verification | **Не применимо / не отмечать** | Платёжной функции нет. |

**Разделение account creation и sign-in:** Play Games Player ID — идентичность игрока, даже без собственной базы аккаунтов. Вопрос о внешнем входе имеет положительный ответ; SSO/OAuth нельзя отрицать только из-за отсутствия своего сервера. Трактовку создания Google-managed gamer profile в конкретном вопросе формы нужно подтвердить по Google policy/поддержке; статический код не заменяет это решение.

## 2. Типы данных и ответы по каждому

Статусы: **подтверждено кодом**; **документировано Google**; **не установлено для pinned SDK**. Во всех подтверждённых строках ниже **Ephemeral processing: No**: имя обслуживает профиль, идентификатор связывает записи, результаты/сохранения удерживаются, для SDK-метрик не доказана обработка только в памяти на время одного запроса.

| Data type в Console | Что найдено | Collected | Shared | Required / optional | Purposes of collection / sharing |
| --- | --- | --- | --- | --- | --- |
| Personal info → **Name** | Gamer display name, включая nickname; приложение читает его у Google и показывает в статусе. Не утверждается доступ к юридическому имени. | **Yes** | **Yes — рекомендуемая классификация без неподтверждённого исключения** | **Required для текущего автоматического flow**; Optional допустимо только после проверки универсального пользовательского выбора до сбора | **App functionality**. Для Google-managed profile — **Account management**, если форма относит его к аккаунту приложения. Нельзя автоматически добавлять marketing/personalization. |
| Personal info → **User IDs** | Play Games Player ID; локально `ownerPlayerId`, онлайн идентичность связывает score/achievement/snapshot | **Yes** | **Yes** с тем же ограничением исключений | **Required в текущем flow** | **App functionality**; условный **Account management** как выше |
| App activity → **Other actions** | Завершённые игровые результаты, First Fusion, состояние игрового поля, рекорд и cloud save metadata | **Yes** | **Yes** | **Required для автоматически синхронизируемых данных вошедшего игрока**; не Optional из-за наличия кнопки Sync | **App functionality**. Свои gameplay analytics/Game Stats events код не отправляет; Analytics не добавлять к каждому score по одному лишь имени SDK. |
| App info and performance → **Diagnostics** | Google документирует автоматические SDK diagnostics и stability/product-improvement analytics | **Yes — на основании заявления поставщика, не перехвата трафика** | **Yes**: собственные цели Google не подтверждают роль исключительно service provider | **Required**: пользовательского отключения SDK-метрик в приложении нет | **Analytics** (оценка работы/надёжности и исправление проблем); App functionality только если подтверждена отдельная функциональная необходимость |
| App activity → **App interactions** | Своих событий кликов/экранов нет; общее слово Analytics в PGS disclosure не перечисляет конкретные interaction events | **Не установлено отдельно** | Не выбирать автоматически | Если Google подтвердит такие автоматические события: Required без реального opt-out | Analytics, если подтверждено; не выдумывать перечень событий |
| App info and performance → **Crash logs** | Unity reporting выключен. Общее Diagnostics у Google не подтверждает конкретную отправку stack traces/crash logs native SDK 22.0.0 | **Не установлено отдельно** | Уточнить у поставщика | При подтверждении automatic crash collection: Required | Analytics; не подставлять наличие Crashlytics — его нет |
| Device or other IDs → **Device or other IDs** | Свои вызовы hardware/ad ID не найдены; Player ID является User ID. PGS disclosure не перечисляет конкретные технические IDs для 22.0.0 | **Не установлено для SDK** | Уточнить | Если подтвердится автоматический сбор — Required, если нет универсального opt-out | Точные цели взять из version-specific disclosure, не придумывать advertising |

**Required не означает, что играть без сети запрещено.** Это классификация контроля сбора. Уже вошедший игрок получает автоматическую синхронизацию, а видимый интерфейс не предлагает отключить её. Inspector-флаг — выбор разработчика, не настройка для всех пользователей. Условия Google за пределами приложения могут влиять на вход; чтобы объявить категорию Optional, нужно подтвердить работоспособный выбор для всех пользователей/регионов до передачи соответствующего типа.

**Не подменять неизвестное запасным Yes или No.** Для трёх неподтверждённых типов нужна актуальная информация Google именно о `play-services-games-v2:22.0.0` (и его GMS processing): SDK Index/письменное разъяснение с типами, целями, обязательностью и передачей. Документ Google прямо ограничивает свою таблицу последней версией SDK. Общий сетевой аудит не назначается: вопрос адресный, о закрытой native SDK и её disclosure.

## 3. Передача третьим лицам и исключения Shared

Для текущего flow рекомендуем **Collected + Shared** для подтверждённых онлайн-типов, а не «No sharing, потому что это Google». Это рекомендация по классификации, не утверждение о проверенном договорном статусе Google.

Снять Shared можно **для конкретного потока**, если подтверждено применимое исключение Google:

- Service provider обрабатывает данные только по поручению разработчика. У PGS есть собственные Google-managed profile/service и цели улучшения SDK; роль исключительно processor для всех потоков не установлена.
- User-initiated transfer требует конкретного ожидаемого действия пользователя либо надлежащего раскрытия/согласия. Общая автоматическая авторизация, последующие фоновые sync и SDK-метрики не получают это исключение только от наличия Sign in / Sync.
- Не заявлять anonymization: Player ID и связанное с ним игровое состояние псевдонимны, не доказанно анонимны.

Таблицы лидеров могут показывать gamer identity/результаты другим игрокам с учётом Google visibility settings. Cloud snapshot не публикуется как leaderboard entry. Эти различия остаются в политике независимо от галочки Shared.

## 4. Остальные категории

| Категория | Рекомендация по найденной реализации |
| --- | --- |
| Location: precise / approximate | Не выбирать без подтверждённого сбора/вывода местоположения. Location API/permission/геоаналитики в игровом коде нет. Наличие IP у сетевого сервера само по себе не доказывает IP-based geolocation. |
| Email, address, phone, sensitive personal traits | Не выбирать для игрового SDK flow: таких запросов/payload нет. Добровольное письмо студии через отдельное приложение описано отдельно; игра не читает почтовый ящик. |
| Financial / purchase history | Не выбирать: рекламы и billing/IAP нет. Планируемая Remove Ads покупка не реализована. |
| Health / fitness | Не выбирать. |
| Messages | Не выбирать: встроенной почты/чата/доступа к SMS нет. |
| Photos / videos | Не выбирать на основании одного avatar URL: нет загрузки фотографий пользователя или чтения его галереи игровым кодом. Google profile/avatar metadata раскрыта как часть профиля. При добавлении custom-photo upload этот вывод пересмотреть. |
| Audio | Не выбирать: встроенная фоновая музыка — контент игры, а не сбор пользовательских аудиофайлов. |
| Files / docs | Не выбирать только потому, что JSON назван файлом: app-generated game state относится к gameplay/Other actions; пользовательские документы не читаются. |
| Calendar / contacts | Не выбирать. Вызовов friend-list API из нашей интеграции также нет. |
| Search / installed apps / browsing history | Не выбирать: таких payload нет. Открытие фиксированной policy URL в внешнем браузере не означает сбор истории браузера игрой. |
| Other user-generated content / other performance data | Не добавлять без отдельного подтверждённого потока. |

Вопрос **Advertising ID** — отдельная декларация App content: своего использования и ads SDK нет; в inspected native smoke manifest нет AD_ID. Окончательный ответ для публикации сверить с настоящим AAB. Не путать Play Games Player ID и рекламный ID.

## 5. Удаление и удержание — фактические границы

- Local `current-run.json`, `.bak`, `play-games-progress.json`, его backup, `pre-cloud-restore.json` и PlayerPrefs удаляются вместе через Android Clear storage. Restart очищает только текущую партию, не весь набор данных.
- Очередь score удаляет запись после подтверждённого SDK callback. Получение квитанции не означает удаления результата с Google leaderboard.
- Поле ownerPlayerId, earned First Fusion, acknowledgements и best score не имеют фиксированного TTL. Finished-run marker предотвращает восстановление завершённой партии из старой копии, но не является полной privacy erasure.
- Google позволяет удалять данные конкретной игры/profile через собственные controls. Отдельная Play History и provider retention могут требовать других действий; фиксированные 30/90 дней не подтверждены.
- Локальные копии/очереди и другие устройства могут повторно загрузить ранее удалённый cloud progress. Перед очисткой остановить игру, проверить sign-in/access settings Google, очистить local storage на всех своих устройствах и проверить Android backups. Не обещать вечную блокировку повторного сбора: её в игре нет.
- У студии нет нового player-data backend. Outlook-переписка удаляется по запросу в пределах реально контролируемой студией информации; это не универсальная команда удаления Google-данных.
- `EnableGooglePlayGames=false` блокирует наш код, но не гарантирует тишину native SDK в уже собранной онлайн-версии. Native smoke manifest содержит PlayGamesInitProvider. Полное исключение SDK — отдельная конфигурация сборки, а не пользовательский privacy control.

## 6. Что подтвердить перед отправкой формы

1. Разрешить публикацию подготовленной политики и проверить публичный HTTPS URL. До этого live-страница продолжает описывать офлайн-релиз.
2. Проверить release AAB: точные SDK/версии, INTERNET/ACCESS_NETWORK_STATE, PlayGamesInitProvider, отсутствие неожиданного Ads/Billing/AD_ID/другого SDK. Smoke APK не является финальным артефактом игры.
3. Получить version-specific ответ Google по Device/other IDs, отдельным Crash logs и App interactions. Сохранить его рядом с этой инструкцией; не переносить Firebase/AdMob disclosure на PGS.
4. Сверить account-creation/external-login/deletion вопросы реальной формы и трактовку PGS profile/SSO. Если нужен app-account deletion flow, он должен действительно существовать — HTML не добавляет SDK.Delete в приложение.
5. Для Optional подтвердить универсальный пользовательский выбор до сбора; в текущем коде его нет. Для снятия Shared подтвердить исключение для каждого потока, не для компании Google в целом.
6. Подтвердить реальную target audience/Families configuration и допустимость Google-функций для неё. Не придумывать возрастной порог или существующий age gate.

Итог: основные потоки и рекомендуемые ответы подготовлены, но форма **не сертифицирована для Submit**, пока перечисленные точечные неизвестные не разрешены. Это не требование полного перехвата сетевого трафика.

## Официальные источники

- PGS SDK disclosure (таблица описывает latest SDK): https://developer.android.com/games/pgs/data-collection
- Data safety, категории, обязательность и sharing exceptions: https://support.google.com/googleplay/android-developer/answer/10787469
- Типы данных Android: https://developer.android.com/privacy-and-security/declare-data-use
- Account deletion / SSO scope: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- Удаление данных игры/profile и отдельная Play History: https://support.google.com/googleplay/answer/9130646?hl=en
- User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Privacy Policy: https://policies.google.com/privacy

Проверка исходников и границы evidence: [privacy-audit-merge-planets.md](privacy-audit-merge-planets.md).
