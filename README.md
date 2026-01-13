# Stack Tracker 💊🚀

![dashboard screenshot](image-1.png)

A polished Next.js application for authenticated FHIR medication management. Users sign in with Auth0, are mirrored into PostgreSQL and HAPI FHIR (Patient resources), can browse Medications, add them to a personal medication stack (MedicationStatements), and create/delete resources. The repo ships with Docker Compose for a one-command spin-up of the full stack (web + HAPI FHIR + Postgres).

## Table of Contents
- [Stack Tracker 💊🚀](#stack-tracker-hapi-fhir-frontend-)
- [Overview](#overview)
- [Architecture & Containers](#architecture--containers)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Run with Docker Compose (recommended)](#run-with-docker-compose-recommended)
- [Local Development (no containers)](#local-development-no-containers)
- [App Anatomy](#app-anatomy)
- [API Surface](#api-surface)
- [Auth, Roles, and Sync Flow](#auth-roles-and-sync-flow)
- [Troubleshooting](#troubleshooting)
- [Scripts](#scripts)

## Overview

- 🔐 Auth0 login; the app refuses to run without the required Auth0 keys and shows a friendly setup screen.
- 🗄️ Authenticated users are persisted to Postgres and mirrored as FHIR Patients.
- 💊 Medications fetched from HAPI FHIR; users can delete or add them to their personal stack (MedicationStatements tied to their Patient).
- 🌗 Modern UI with Flowbite React and Tailwind CSS 4 (dark/light ready).
- 🐳 Dockerized: Next.js app (Node 22), HAPI FHIR R4 server, and Postgres configured via Compose.

## Architecture & Containers

- **web**: Next.js 15 app built into a standalone server (`node server.js`) from the multi-stage Dockerfile (base image `node:22-alpine`).
- **fhir**: HAPI FHIR R4 server (`hapiproject/hapi:latest`) using the bundled `application.yml`; exposed at http://localhost:8080/fhir.
- **db**: PostgreSQL 18 with data persisted to `./hapi.postgres` (bind-mounted). Credentials default to `admin/admin`, database `hapi`.
- Networking: services share the default compose network; `FHIR_BASE_URL` inside the web container uses `http://fhir:8080/fhir`, while host access uses http://localhost:8080/fhir.

## Features

- 🔑 Auth0 sign-in with automatic user sync into PostgreSQL and a corresponding FHIR Patient
- 📚 Medication browser (FHIR `Medication`) with delete and “Add to Stack” actions
- 🧺 Medication stack (FHIR `MedicationStatement`) linked to the logged-in patient
- 🛠️ Admin-only user table (guarded via stored `roles` array) and Medication creation UI
- 🌓 Dark/light UI via Flowbite React + Tailwind CSS 4
- 🐳 One-command containerized stack: web + HAPI FHIR + Postgres

## Tech Stack

- Next.js 15 (App Router) • React 19 • TypeScript 5
- Auth0 SPA SDK
- PostgreSQL + `pg` client
- HAPI FHIR R4 (`hapiproject/hapi`) backed by Postgres
- Tailwind CSS 4 + Flowbite React
- ESLint 9 + Prettier 3
- Docker / Docker Compose

## Environment Variables

Create `.env.local` in the repo root. Suggested defaults for Compose networking:
```
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id

DB_HOST=db
DB_PORT=5432
DB_NAME=hapi
DB_USER=admin
DB_PASSWORD=admin

FHIR_BASE_URL=http://fhir:8080/fhir
```

## Run with Docker Compose (recommended)

1) `docker compose up --build`
2) App: http://localhost:3000
3) HAPI FHIR: http://localhost:8080/fhir
4) Postgres: localhost:5432 (admin/admin, db `hapi`). Data persists under `hapi.postgres/`.

## Local Development (no containers)

1) `npm install`
2) `.env.local` for local services, e.g.:
```
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hapi
DB_USER=admin
DB_PASSWORD=admin
FHIR_BASE_URL=http://localhost:8080/fhir
```
3) Dev server: `npm run dev`
4) Production build: `npm run build` then `npm start`

## App Anatomy

- **Home**: redirects authenticated users to the dashboard.
- **Dashboard**: welcome banner, admin-gated cards, and the medication stack table (MedicationStatements).
- **Resources**: lists Medications with view/delete/add-to-stack actions.
- **Create Resource**: creates Medications (or any FHIR resource) via POST to FHIR.
- **Users**: admin view of `app_user` records; supports `?email=` filter.
- **Stack**: renders MedicationStatements tied to the logged-in patient.

## API Surface

- `GET /api/users` — list users; `?email=` filters by email
- `POST /api/users` — create user and FHIR Patient; expects `username`, `email`, `auth0_id`, optional `roles`, `profile_info`
- `POST /api/users/sync` — Auth0-triggered upsert; default roles `['user']`
- `GET /api/resources` — fetch Medications (`Medication?_count=50`)
- `POST /api/createresource` — create any FHIR resource; body must include `resourceType`
- `DELETE /api/deleteresource` — delete FHIR resource; body `{ resourceType, id }`
- `GET /api/medicationstatement` — list MedicationStatements
- `POST /api/stack` — create MedicationStatement for the current user (looks up `fhir_patient_id` via email header and references the selected Medication)

## Auth, Roles, and Sync Flow

1. User logs in via Auth0 (SPA SDK).
2. `useUserSync` fires `POST /api/users/sync` with Auth0 profile → upsert in Postgres.
3. A FHIR Patient is created (or reused) for the user; ID stored as `fhir_patient_id`.
4. UI checks `roles` from `app_user`; showing admin-only cards when `roles` includes `admin`.

## Troubleshooting

- 🔑 Auth0: ensure `NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID` exist; restart after changes.
- 🩺 FHIR: verify `FHIR_BASE_URL` (compose uses `http://fhir:8080/fhir`).
- 🗄️ DB: confirm Postgres reachable with the same credentials; in compose the host is `db`.

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm start` — run the standalone server output
- `npm run lint` — ESLint
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check
