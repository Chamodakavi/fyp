# Monthly Registration Fix — Phase 1 findings and rollout notes

Branch: `new_feat_check`. Analysis date: 2026-10-08. Companion to
`03_monthly_registration_fix.md`.

## 1. Findings (what the code and the live data actually do)

| # | File / query | Observation | Bug | Fix |
|---|---|---|---|---|
| 1 | `src/app/api/advisory/route.ts` | Thin proxy to the Hugging Face engine. **Probed live:** `month` is the **registration** month; the engine adds the crop cycle itself (CARROT 2026-10 → `Target_Harvest_Date` "2027-02", `Planting_Date` "2026-10"). Format is `YYYY-MM`. | B1 | §5.2 variant: send the registration month, no client-side `+ cycle` |
| 2 | Engine, all 12 crops at 2027-01 | Cycles returned: ASH PLANTAINS 10, BEETROOT 3, BITTER GOURD 3, BRINJALS 4, CABBAGE 3, CAPSICUM 4, CARROT 4, CUCUMBER 2, LEEKS 5, LUFFA 3, RADDISH 2, TOMATOES 4. Matches the A1 table. BEANS and DRUMSTIC are rejected by the engine. | B9 | A1 + `CROP_CYCLE_FALLBACK` mirror in `quotaService.ts` |
| 3 | `AITargets.tsx` | Admin typed "Registration Window" month; it was sent to the engine (correct) but the harvest was taken by splitting the API string, and the window defaulted to the API `Planting_Date`. | B1, B2 | Rewritten (§5.2) |
| 4 | `quotaService.applyNationalTarget` | Wrote `target_harvest_date` / `planting_date` straight from the API strings. | B8 | Harvest passed in by caller, dates no longer sent; trigger A3 derives them |
| 5 | `TargetsManager.tsx` | Read `get_bucket_status`; scheduled windows had no Edit/Cancel; Extend only for open windows; sorted newest-harvest first, no grouping. | B3 | Rewritten (§5.3): `get_target_summary`, Edit dates / Cancel window, grouped by crop, harvest ascending |
| 6 | `dashboardService.getActiveCropWindows` | Summed `farmer_registrations` **by crop name** and converted MT → Ha with a hard-coded yield table; only the first 5 targets. | B4, B5 | Replaced by `getDashboardData()` on `get_target_summary` |
| 7 | `dashboardService.getDashboardKPIs` | "Total Regulated Land" = Σ(amount_mt / yield) across all registrations. | B5 | KPI is now "Registered supply (MT) across N harvest months" |
| 8 | `dashboardService.getSupplyTrajectory` | Targets keyed by harvest month, registrations keyed by **registration date** → the smooth Oct 2026–Apr 2027 curve. | B10 | One bar pair per target |
| 9 | `Dashboard.tsx` (farmer) | Reads `farmer_registrations` via `useRegisteredCrops` (not `crop_registrations`), but showed one MT total and an "Approved" chip. | B6 | Count of harvest months + "Next harvest"; rows show harvest month; chip "Registered" |
| 10 | `RegisterForm.tsx` | Already target-based (file 02). Flat dropdown, not grouped; did not disable targets already registered. | — | Grouped `<optgroup>` per crop, one option per harvest month |
| 11 | `RegisteredCrops.tsx` | Flat table, one row per registration. | — | Sections per harvest month |
| 12 | `utils/cropManager/cropManager.ts` | Does not exist in this repo. No `.insert()` into `farmer_registrations` outside RPCs. | — | Nothing to remove |
| 13 | Live DB: `crop_lifecycle`, `planting_year`, `get_target_summary` | **Do not exist yet.** The app code now depends on them. | — | Run `supabase/sql/03_monthly_registration_fix.sql` |
| 14 | Live DB: `national_targets` (anon read) | CABBAGE Jan 2027 (plant 2026-10), CARROT Feb 2027 (2026-10), CARROT Apr 2027 (2026-12), CARROT May 2027 (2027-01). `year/month` agree with `target_harvest_date` → D1 is clean. | — | — |
| 15 | Live DB: `registration_windows` | Target 11 (CARROT May 2027, registration month Jan 2027) has a hand-opened window 7–21 Oct **and** a scheduled Jan 2027 window. Target 10 has only its Dec window. Target 7 was closed early then reopened 7–21 Oct. | B2 in the wild | §6 step 3 below |
| 16 | Live DB: `farmer_registrations` | 4 active rows, every one linked to a target of the same crop (D4 clean). The 66 MT legacy row from the screenshots is no longer present. | B7 (resolved) | A6 can run once `target_id is null` count is 0 |
| 17 | Live DB: `crop_registrations` | Empty. No reads left in the code. | D5 | Leave the table; nothing writes it |
| 18 | `planting_date` / `target_harvest_date` | **text** (values like "2026-10"). | — | A3 uses `to_char` as written |

## 2. Decisions taken where the document left a choice

- **Engine month semantics:** the engine takes the registration month. The admin picks the registration month, the client sends it unchanged, computes the harvest month from `crop_lifecycle` for display, and `applyNationalTarget` refuses to publish if the engine's harvest month disagrees (that is how a cycle drift between the model and the table surfaces).
- **Carrot cycle stays 4** (October → February), matching the model. Change `crop_lifecycle` only together with the model.
- **Rainfall default** follows the harvest month in both AI Targets and the bulk Forecast Generator.
- **`BEANS` / `DRUMSTIC`** remain in `crop_lifecycle` for completeness but are not in `SUPPORTED_CROPS` because the engine rejects them.

## 3. Rollout order

1. Supabase SQL editor (staging first): run `supabase/sql/03_diagnostics.sql` (D1–D6), then `supabase/sql/03_monthly_registration_fix.sql` A1–A5, then the diagnostics again.
2. Data clean-up for the live rows found above, from the Targets & Windows page after deploying this branch:
   - CARROT May 2027 (target 11): the scheduled Jan 2027 window is correct for its registration month. The October window is wrong for that target. Either *Close now* on it, or keep it deliberately if you want early registration (then the January one should be cancelled to keep one window per target).
   - CARROT Feb 2027 (target 7) and CABBAGE Jan 2027 (target 9): their windows sit in October, which is their registration month. Fine.
   - CARROT Apr 2027 (target 10): window 1 Dec → 1 Jan Sri Lanka time, its registration month. Fine.
3. When `select count(*) from farmer_registrations where target_id is null` returns 0, run A6.
4. Deploy to a Vercel preview, run the §7 test checklist (T1–T12), then production.

## 4. What the code now expects from the database

| Object | Used by |
|---|---|
| `crop_lifecycle` (read) | `fetchCropCycles` → AI Targets, Forecast Generator |
| `get_target_summary(boolean)` | Targets & Windows, Register form, admin dashboard |
| `admin_update_window(bigint, timestamptz, timestamptz)` | Extend / edit dates |
| `admin_cancel_window(bigint)` | Cancel a scheduled window |
| `admin_open_planting_month(bigint, boolean)` (replaced) | Open registration month |
| trigger `national_targets_normalize` | `applyNationalTarget` no longer sends date strings |
