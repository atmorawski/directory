# Slack Public Channel Sync

Prosty wewnetrzny job `Node.js/TypeScript`, ktory pobiera liste publicznych kanalow Slacka, pomija archiwalne, generuje plik `CSV` i wysyla go mailem.

## Co robi

- pobiera publiczne kanaly z jednego workspace'a Slack
- eksportuje `channel_id`, nazwe, opis i informacje, czy kanal jest `Slack Connect`
- konczy dzialanie po wykonaniu synchronizacji
- nadaje sie do uruchamiania z `Railway Cron Job`

## Wymagania po stronie Slack

Utworz aplikacje Slack i nadaj jej:

- scope `channels:read`

Nastepnie zainstaluj aplikacje w workspace i skopiuj `Bot User OAuth Token`.

## Zmienne srodowiskowe

Skopiuj `.env.example` do `.env` i uzupelnij wartosci:

```env
SLACK_BOT_TOKEN=xoxb-your-token

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mailer@example.com
SMTP_PASS=replace-me
EMAIL_FROM=Slack Channel Sync <mailer@example.com>
EMAIL_TO=daniel@example.com

CSV_FILENAME=slack-public-channels.csv
```

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

albo po buildzie:

```bash
npm run build
npm run sync
```

Po uruchomieniu skrypt:

- pobierze kanaly
- wygeneruje `CSV`
- wysle mail
- zakonczy proces

## GitHub Actions

Repo zawiera workflow [`.github/workflows/slack-channel-sync.yml`](C:\Users\Andrzej\Documents\Wtyczka do Slacka\.github\workflows\slack-channel-sync.yml), ktory:

- uruchamia sie recznie przez `Run workflow`
- uruchamia sie codziennie o `08:00` czasu `Europe/Warsaw`
- obsluguje zmiane czasu lato/zima bez recznego przestawiania crona

### Sekrety w GitHub

W repozytorium ustaw `Settings` -> `Secrets and variables` -> `Actions` i dodaj:

- `SLACK_BOT_TOKEN`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `EMAIL_TO`
- `CSV_FILENAME`

### Reczne odpalenie

1. Wejdz w zakladke `Actions`.
2. Wybierz workflow `Slack Channel Sync`.
3. Kliknij `Run workflow`.

## Deployment na Railway Cron

1. Wrzucc projekt do repozytorium Git.
2. Utworz nowy projekt w Railway z tego repozytorium.
3. Dodaj wszystkie zmienne z `.env.example` jako Railway Variables.
4. Ustaw komendy:
   - Build command: `npm run build`
   - Start command: `npm run sync`
5. Dodaj `Cron Job` w Railway, ktory odpala komendę `npm run sync`.
6. Ustaw harmonogram codziennie o 12:00 czasu polskiego w interfejsie Railway.

Praktycznie job:

- budzi sie o zaplanowanej godzinie
- wykonuje synchronizacje
- wysyla mail
- konczy dzialanie

Uwaga: przy planach `Trial` / `Free` Railway moze nie pozwolic na polaczenia SMTP wychodzace. W takim przypadku lepsza opcja jest GitHub Actions.

## Polecany mailer

Mozesz uzyc dowolnego SMTP. Jesli chcesz prosty start, dobrze sprawdza sie:

- Google Workspace SMTP
- Mailgun SMTP
- Resend SMTP

## Dalsze rozszerzenia

- zapis ostatniego wygenerowanego `CSV` do storage
- wysylka do kilku odbiorcow
- eksport do `Google Sheets` zamiast maila
