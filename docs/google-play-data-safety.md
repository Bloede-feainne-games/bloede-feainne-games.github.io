# Merge Planets — изменения Data Safety перед рекламным выпуском

Обновлено **5 ноября 2026**. Пакет `com.feainne.mergeplanets`. Основание: [новый аудит исходников и APK](advertising-privacy-audit-2026-11-05.md). Этот документ заменяет offline/PGS-only рекомендации для новой рекламной конфигурации. Форма в Play Console **не изменялась и не отправлялась**.

Проверенная конфигурация: **Alpha 0.3 / code 4, Google TestAdMob, две возрастные ветки, реальные покупки выключены**. Yandex/адаптер/AppMetrica/Varioqub физически исключены из проверенного APK, хотя dependency declarations остались в Unity. Production Google-only и будущая Yandex integration выключены. Источник: актуализация в начале [аудита](advertising-privacy-audit-2026-11-05.md), проверка DEX и manifest, [новый source snapshot](unified-privacy-source-snapshot.json).

**Это подготовленные ответы, а не проверка сохранённой анкеты Console.** Её текущий export/скриншоты недоступны; фактические страны, age groups и активные tracks ещё не установлены. Ниже указаны расхождения со старыми локальными инструкциями и условные изменения формы.

## 1. Что изменить в Console

1. **Data collection and security → collects or shares user data: Yes.** Не возвращать offline No. Учитывать и SDK, и PGS/cloud, даже без собственного сервера.
2. **Добавить/подтвердить рекламные типы:** Approximate location, App interactions, Device or other IDs, Diagnostics. Источник этой четвёрки — актуальный Google Mobile Ads disclosure; сведения о Yandex не копировать из Google автоматически.
3. **Сохранить PGS:** gamer identity / User IDs, gameplay scores, achievements, cloud board/atlas/laser-and-daily-gift progress. Gameplay относится к **App activity → Other actions**, а не к пользовательским документам. Наличие JSON не создаёт Files and docs; автоматически сгенерированное состояние игры не следует по умолчанию превращать в Other user-generated content.
4. **В рекламных строках поставить Collected=Yes и Shared=Yes**, цели по таблице ниже. Для PGS не применять исключение sharing без проверки конкретного потока.
5. **Ephemeral=No** для указанных передаваемых типов: обработка только на время одного запроса не подтверждена. Это не утверждение о придуманном сроке хранения.
6. **Не добавлять Personalization**: наш код отключает персонализацию. `npa=1` не отменяет остальные типы/цели.
7. **Privacy policy URL** сохранить: `https://bloede-feainne-games.github.io/privacy/merge-planets/`. Сначала опубликовать проверенную редакцию и проверить HTTPS/старые anchors перед отправкой формы.

Data Safety описывает совокупность активных распространённых версий. Если хотя бы одна собирает тип обязательно, итоговая строка типа должна быть Required, даже если новая рекламная функция для него Optional. Сначала получить список реально активных tracks/artifacts; внутренний тест и публичные/закрытые tracks имеют разные требования.

## 2. Точные рекламные строки

| Поле Console | Collected / Shared | Required или Optional | Ephemeral | Цели collection и sharing |
| --- | --- | --- | --- | --- |
| Location → **Approximate location** | **Yes / Yes** — Google IP-derived general location | **Optional для ad-only потока**: UMP/ad initialization активируются после добровольного рекламного действия, локальная игра доступна без него | **No** | **Advertising or marketing; Analytics; Fraud prevention, security, and compliance** |
| App activity → **App interactions** | **Yes / Yes** — Google SDK/ad interactions, taps/video views | **Optional для ad-only потока**; если другой активный SDK/версия собирает этот тип обязательно — **Required** для итоговой строки | **No** | **Advertising or marketing; Analytics; Fraud prevention, security, and compliance** |
| Device or other IDs → **Device or other IDs** | **Yes / Yes** — Google disclosure включает app set/другие технические ID | **Optional для подтверждённого ad-only потока**; перед Submit уточнить, добавляет ли PGS 22.0.0 обязательный сбор того же типа, тогда итог **Required** | **No** | **Advertising or marketing; Analytics; Fraud prevention, security, and compliance** |
| App info and performance → **Diagnostics** | **Yes / Yes** — Google SDK reliability/performance information | **Required в итоговой форме**: PGS имеет automatic diagnostics без универсального in-app opt-out; рекламная часть сама по себе on-demand | **No** | **Analytics**, а для Mobile Ads также **Advertising or marketing; Fraud prevention, security, and compliance** |

Это точные ответы для подтверждённого рекламного потока, а не заявление о каждом внутреннем поле закрытых SDK. Optional основан на реальном initial opt-in к рекламной функции, а не на возможности закрыть уже показанное видео. Возможность прекратить показ не равна отключению всех операций уже initialized Google SDK. Исправления session fences и privacy-options проверены статически; cold-start, отзыв и рестарт ещё требуют device QA. Если проверка cold-start/других SDK покажет обработку до выбора, пересчитать Optional для соответствующих типов.

**Yandex в текущей Alpha:** дополнительных runtime-получателей Yandex/AppMetrica нет; не указывать их сбор как уже действующий на основании developer dependency XML. Google-типы выше остаются необходимыми независимо от тестовых объявлений. Если в активных распространяемых старых сборках есть иной SDK/сбор, его нужно учесть отдельно.

**При будущей активации:** сверить фактические Yandex categories/permissions/транзитивные модули с [официальным SDK8 disclosure](https://ads.yandex.com/helpcenter/en/dev/android/app-privacy-android). Его default table описывает permission-dependent Device or other IDs и Advertising or marketing; App interactions, Diagnostics, Crash logs и location по умолчанию отмечены No. Это не доказательство отсутствия любого сетевого или служебного processing в будущей интеграции. Старые Unity-вызовы location/analytics setters удалены вместе с Yandex runtime — нельзя описывать их как работающую защиту будущего релиза. Ограничения должны быть реализованы заново и проверены.

## 3. Сохранить прежние PGS-потоки

| Тип Console | Что сохранить | Handling / цели |
| --- | --- | --- |
| Personal info → **User IDs** | Play Games Player ID, связанный score/achievement/cloud progress | **Collected=Yes; Shared=Yes** без неподтверждённого исключения; **Required** для текущего automatic flow без универсального in-app SDK-off control; **Ephemeral=No; App functionality** |
| App activity → **Other actions** | Результаты партий, достижения, atlas discoveries, board/run snapshot, laser reward/spending ledger, gift dates, sync/integrity metadata | **Collected=Yes; Shared=Yes** с тем же ограничением; **Required** для текущей automatic synchronization вошедшего игрока; **Ephemeral=No; App functionality**. Не добавлять advertising purpose к самому board payload — в custom ad targeting он не передаётся |
| Personal info → **Name** | Существующее раскрытие gamer display name / Google-managed gamer identity | Не удалять прежний Name на основании только отсутствия собственного текстового ввода. Точное Collected/Shared/Required поле проверить для actual native profile-creation/edit flow: простое получение уже существующего имени с сервера не является само по себе исходящей передачей. Если игра предоставляет Google-managed создание/изменение имени — **Yes / Yes, No ephemeral, App functionality**; Required/Optional — по реальному выбору пользователя до передачи |
| App info and performance → **Diagnostics** | Automatic PGS diagnostics, Google-documented | Объединить с рекламной строкой выше; выключенный Unity Diagnostics не означает выключенный PGS |

**Не переносить неустановленные сведения из старых отчётов в обязательные галочки.** SDK Index/disclosure PGS описывает latest SDK и не даёт полной wire-schema 22.0.0. Для Name/profile flow, отдельного Crash logs и обязательного Device IDs вне ads нужны точечные подтверждения. Google-managed identity, рейтинг, достижения и сохранения продолжают быть полностью раскрыты в политике независимо от классификации отдельных Console типов.

## 4. Что не добавлять без нового потока

- **Precise location:** No по проверенным API/permissions; приблизительное IP-location AdMob всё равно Yes.
- **Age / Other personal info:** числовой возраст, DOB и даты перехода не передаются нашим кодом; отдельная age collection на основании только локального `age-eligibility.json` не добавляется. Regulatory age-treatment/TFUA/consent signals действительно передаются SDK и описаны в политике; это не загрузка полного возраста/DOB. Если поставщик классифицирует сохраняемый возрастной статус как Other info, дополнить строку по его фактическому disclosure.
- **Crash logs:** отдельный тип пока не подтверждён; не выдавать общие Diagnostics или присутствие AppMetrica crash API за crash upload. Сначала ответ поставщика/точечная проверка конкретного режима; это оставшийся вопрос перед Submit, а не подтверждённый No.
- **Photos/videos:** загрузка avatar URL для leaderboard не доказывает upload пользовательской фотографии; проверить только actual Google-managed profile creation/edit flow, не добавлять произвольный Photos Yes.
- **Financial info / purchase history:** реальная оплата выключена. Rewarded receipt GUID и laser spending — игровые события, не платёжная карта и не подтверждённая реальная покупка. Unity IAP установлен ≠ Billing активирован. При включении IAP нужна новая проверка.
- Не добавлять email/телефон/адрес/контакты/health/audio/messages/search/browsing/installed apps/user documents без подтверждённой передачи. `queries` install-referrer provider и открытие policy во внешнем браузере не доказывают сбор списка приложений или истории браузера.

## 5. Security practices, deletion и соседние декларации

| Вопрос | Подготовленный ответ / изменение |
| --- | --- |
| Encryption in transit | **Yes для проверенного Google test flow** по provider HTTPS/TLS statements. Для будущего production Yandex/AppMetrica подтвердить, что *все* фактические каналы соответствуют этому ответу. Нельзя отмечать общий Yes на основании проверки одного Google endpoint. Local JSON не имеет отдельного confidentiality encryption |
| Deletion request | Предоставить `https://bloede-feainne-games.github.io/privacy/merge-planets/#retention`: реальные Android, Google game-data и vendor request routes, studio email. Удаление студийной переписки и запрос поставщику имеют разный охват. Не представлять это как реализованную in-game кнопку «стереть всё» или гарантированный отзыв всех SDK данных |
| Automatically deleted within 90 days | **No** — такой TTL для gameplay/age/vendor data не реализован/не подтверждён |
| Independent security review / MASA | **No / не отмечать** — source audit и Unity tests не являются независимой сертификацией |
| Families commitment / badge | Не выдавать этот аудит за положительную сертификацию; перед утверждением проверить serving/format и остальные условия, подтвердить actual 6+ age groups и применимые правила |
| App account creation/deletion | Собственного email/password backend нет; используется внешний Google Play Games account. Сохранить фактическое раскрытие external sign-in. Классификацию Google-managed profile creation и account-deletion requirement подтвердить по actual Console wording/flow; не подменять обязательный механизм одной privacy-страницей |
| **Contains ads** (App content, отдельно от Data Safety) | **Yes** — rewarded SDK ads, включая Google demo/test; убрать «рекламы нет» |
| **Advertising ID** (App content, отдельно) | Checked target36 validation APK не содержит **AD_ID**; это не основание для No в **Device or other IDs**. Для декларации AAID проверить финальный AAB и provider/config-specific доступ: отсутствие разрешения/удалённый optional модуль не доказывают отсутствие других ID |
| Target Audience and Content | Проверить и выбрать реальные группы для 6+, а не автоматически «18+» из-за взрослой рекламы. Child/Teen/Unknown допускаются к restricted Google ads; Adult — к взрослой Google ветке. Yandex недоступен всем в текущей Alpha. Страны ещё не подтверждены |

## 6. Расхождения и delta после включения Yandex

| Проверяемое утверждение / изменение | Что делать с декларацией |
| --- | --- |
| «Test ads не собирают данные» / old offline No | Неверно уже для Alpha: collects/shares Yes, Google advertising строки выше плюс PGS |
| «Все under-18/Unknown без рекламы» | Устарело: включён restricted Google-only route. Проверить optional/required для всего app; нельзя сделать данные детей невидимыми в форме |
| «Yandex/AppMetrica уже собирают в Alpha» | Не подтверждается и противоречит APK: не добавлять текущий Yandex flow. Условный абзац политики не является доказательством сбора |
| Новая Yandex сеть использует только уже раскрытые Device IDs для Advertising/marketing | Категория/цель могут уже быть Yes из-за Google: нового checkbox по названию сети нет. Всё равно повторно проверить collected/shared, optionality, retention, encryption, deletion и документировать нового получателя; обновить vendor/CMP настройки |
| Появятся AppMetrica telemetry, crash upload, дополнительные identifiers, location или consent/age uploads | Добавить только реально возникшие типы: например Crash logs / Diagnostics / Device IDs / Approximate location / Other personal info, и их реальные цели, collected/shared, required/optional и ephemeral. Нет заранее утверждённого набора для ещё не реализованного runtime. Дополнительные непокрытые цели/данные требуют изменения самой политики до включения |
| SDK начнёт работать при старте без добровольного ad action | Пересчитать Optional: такой тип может стать Required. Анализировать все источники, включая PGS, а не только новый vendor |
| Меняются transport/retention/deletion | Пересмотреть app-wide encryption/deletion ответы. Не обещать полного удаления provider data через Clear storage |
| Разрешается AAID или новые Android permissions | Повторно проверить отдельную Advertising ID декларацию и ограничения Families; строка Device IDs уже Yes не разрешает передачу AAID детьми/Unknown |
| Test units заменяются live Google-only units, данные и цели не меняются | Сами по себе новые IDs/оплата рекламы не требуют новых data-type галочек или переписывания политики. Live inventory, UMP, SDK поведение и Families формат нужно проверить |
| Новые achievements, интерфейс, SDK version без изменения обработки | Количество achievements и версии не входят в политику. Подтвердить отсутствие новых полей/получателей/целей при diff-аудите; только после этого оставлять disclosures прежними |

Consent records/age flags описаны публично. Отдельная классификация Other personal info зависит от фактически передаваемых и сохраняемых SDK полей; local age file сам по себе не является off-device collection. Consent purpose нельзя автоматически назвать рекламной персонализацией, если запросы остаются npa.

## 7. Перед Submit

1. Получить текущую анкету Console и список активных artifacts/tracks; сравнить каждую строку выше с реальными ответами. Без этого нельзя заявлять «расхождений нет».
2. Проверить Google-only live inventory для детей/Unknown, реальный rewarded format/закрываемость, age flags, UMP consent/revocation/restart privacy entry. Общий аудит Families включает и PGS6+.
3. Для будущего Yandex реализовать runtime provider-specific consent, RU-only adult routing, безопасный native lifecycle и защиту после смены игрока/отзыва. Текущий Validate запрещает эту функцию; изменения кабинета недостаточны.
4. Проверить конечный signed release AAB, а не полагаться только на unsigned validation APK и Gradle-шаблон.
5. Разрешить оставшиеся вопросы **Name/profile flow; отдельные Crash logs; PGS Device IDs/requiredness; точная классификация consent signals; будущий Yandex/AppMetrica processing; all-channels encryption/deletion scope**. Неподтверждённые поля не отправлять как установленные факты.
6. Опубликовать подготовленную политику по прежнему URL после отдельного решения о публикации, затем сохранить/отправить корректные ответы Console. Эта задача не выполняет push и не меняет Console.

## Официальные основания

- [Mobile Ads Unity disclosure](https://developers.google.com/admob/unity/privacy/play-data-disclosure), [Android disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure).
- [PGS disclosure](https://developer.android.com/games/pgs/data-collection), [типы Android](https://developer.android.com/privacy-and-security/declare-data-use).
- [Data Safety definitions, purposes, optional/required, aggregation and sharing exceptions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).
- [Yandex SDK 8 disclosure](https://ads.yandex.com/helpcenter/en/dev/android/app-privacy-android), [AppMetrica ID module](https://appmetrica.yandex.com/docs/en/sdk/android/get-ad-id).
- [UMP and vendor consent](https://developers.google.com/admob/unity/privacy/gdpr), [Families](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en).
