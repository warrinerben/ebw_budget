# Simple AppData Static Web App (HTML/JS + Azure Functions + Table Storage)

## Prereqs
- Azure subscription
- Azure Storage account with Table `AppData`
- Static Web Apps (Free tier)
- `STORAGE_CONNECTION_STRING` and `TABLE_NAME` app settings

## Local dev (Functions)
- cd api
- npm init -y
- npm install @azure/data-tables uuid
- Use Azure Functions Core Tools to run the API

## Deploy
- Push this repo to GitHub
- Create Azure Static Web App (Free)
  - App location: `/public`
  - API location: `/api`
  - Output: `/public`
- In Static Web App configuration:
  - Set `STORAGE_CONNECTION_STRING`
  - Set `TABLE_NAME = AppData`
