SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict uAIIDGnW1bMgtYglmdZJEXytcukxGgVnn4wPMjlszmOjtpwclackFIEFAb3AFj3

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('dc5ab1e8-6a14-488d-936d-c44f5523cbae', '439d2f37-3dc9-4cde-a2c2-5890ec2bf551', '44de8f09-21e5-4d0f-8653-0eb7aa24ee8e', 's256', '0WNhaWlSp_Mbj4PQgakxYtoqhTdN3dKNk4Lr-WgN-3E', 'email', '', '', '2026-02-04 04:15:45.038796+00', '2026-02-04 04:15:45.038796+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'authenticated', 'authenticated', 'chamodakavishka03@gmail.com', '$2a$10$02TpUuEG9zhHDh/k7XzYt.1k4FkPHw9VnWv5L8S59GiwEmQYBTIzm', '2026-02-04 04:56:11.974857+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-04 08:38:27.021156+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "da95fff7-a8f4-48e2-b9d4-4e6bd0817709", "email": "chamodakavishka03@gmail.com", "username": "Chamoda KKavi", "full_name": "Chamoda KKavi", "email_verified": true, "phone_verified": false}', NULL, '2026-02-04 04:56:11.93993+00', '2026-02-05 06:22:21.139105+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'authenticated', 'authenticated', 'chamoda@gmail.com', '$2a$10$V5X6w0xYF9iugRUznyKd4.Tadd7zqzrca1sPkjZRSsmHfJsknUl/i', '2026-02-04 06:54:53.079678+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-03-03 14:42:03.825385+00', '{"role": "admin", "provider": "email", "providers": ["email"]}', '{"sub": "7329a315-b0f2-47c8-ac6e-005a8188a7f8", "email": "chamoda@gmail.com", "username": "Chamoda DEV", "full_name": "Chamoda DEV", "email_verified": true, "phone_verified": false}', NULL, '2026-02-04 06:54:53.04312+00', '2026-03-03 14:42:03.828407+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5ec43539-08cd-4269-9523-58eb0923277c', 'authenticated', 'authenticated', 'samitha@gmail.com', '$2a$10$2CKqpw81sstBAfNR2qoTiuWUrmBgYz5ejrCkBEL8gFrMZ5fMasErC', '2026-02-08 14:25:21.101446+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-03-03 15:17:50.117159+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "5ec43539-08cd-4269-9523-58eb0923277c", "email": "samitha@gmail.com", "username": "samitha", "full_name": "samitha", "email_verified": true, "phone_verified": false}', NULL, '2026-02-08 14:25:21.058151+00', '2026-03-03 15:17:50.179637+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '{"sub": "da95fff7-a8f4-48e2-b9d4-4e6bd0817709", "email": "chamodakavishka03@gmail.com", "username": "Chamoda KKavi", "full_name": "Chamoda KKavi", "email_verified": false, "phone_verified": false}', 'email', '2026-02-04 04:56:11.965785+00', '2026-02-04 04:56:11.966397+00', '2026-02-04 04:56:11.966397+00', '6aa75584-1a70-4edc-b9ba-3700d96bf083'),
	('7329a315-b0f2-47c8-ac6e-005a8188a7f8', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{"sub": "7329a315-b0f2-47c8-ac6e-005a8188a7f8", "email": "chamoda@gmail.com", "username": "Chamoda DEV", "full_name": "Chamoda DEV", "email_verified": false, "phone_verified": false}', 'email', '2026-02-04 06:54:53.072647+00', '2026-02-04 06:54:53.072722+00', '2026-02-04 06:54:53.072722+00', '350005df-5354-4215-b067-9640f012f197'),
	('5ec43539-08cd-4269-9523-58eb0923277c', '5ec43539-08cd-4269-9523-58eb0923277c', '{"sub": "5ec43539-08cd-4269-9523-58eb0923277c", "email": "samitha@gmail.com", "username": "samitha", "full_name": "samitha", "email_verified": false, "phone_verified": false}', 'email', '2026-02-08 14:25:21.088832+00', '2026-02-08 14:25:21.088894+00', '2026-02-08 14:25:21.088894+00', '6fc817b4-eab2-44f9-917a-fe05fc959ee9');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('b7dca232-2137-4abd-ba20-5a2e15ce0a41', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 04:56:11.981911+00', '2026-02-04 04:56:11.981911+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('080b910b-8122-4c4f-b559-b6351c487139', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 04:57:20.76293+00', '2026-02-04 04:57:20.76293+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('9b5774bf-0b6f-4c46-84d9-e875231d873b', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 05:03:16.874998+00', '2026-02-04 06:03:23.856287+00', NULL, 'aal1', NULL, '2026-02-04 06:03:23.856181', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('090e4751-9db6-48f0-8c0d-8b20f9d78b7d', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 06:21:45.279843+00', '2026-02-04 06:21:45.279843+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('625780a3-d8fa-4da6-818c-74200baa2a1a', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 06:23:49.74788+00', '2026-02-04 06:23:49.74788+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('9f5b6f92-36b7-4284-8c08-c6699538e8d1', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 06:24:15.917884+00', '2026-02-04 06:24:15.917884+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('d443ef45-f1d7-443d-aa21-22d3fda05e79', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 06:31:10.151593+00', '2026-02-04 06:31:10.151593+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('a9d0b569-1e6c-40a5-b3f0-cfca96bfe928', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 06:54:53.089436+00', '2026-02-04 06:54:53.089436+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('e253dba9-1d7b-4034-b8b8-3e3790b419fa', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 06:55:06.739642+00', '2026-02-04 06:55:06.739642+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('8e225c66-9e13-4033-82c8-6a737a25d9f8', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 07:00:04.289003+00', '2026-02-04 07:00:04.289003+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('a9595832-d8d4-4ac8-bd22-be02fa439a9a', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 07:55:42.548203+00', '2026-02-04 07:55:42.548203+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('ba842522-1197-4b55-a29d-bfa0ea594d1f', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 07:58:36.833735+00', '2026-02-04 07:58:36.833735+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('ac219c06-02a7-483e-a640-369510e249ff', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 07:19:09.978976+00', '2026-02-04 08:28:26.458107+00', NULL, 'aal1', NULL, '2026-02-04 08:28:26.457999', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('86ccc9a6-1c3e-4abc-af9b-ffd4c2e142c8', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 08:34:20.078052+00', '2026-02-04 08:34:20.078052+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.65.113', NULL, NULL, NULL, NULL, NULL),
	('e7c4195b-e3b0-4bbb-84bc-eb1ecc242efd', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 08:38:27.021265+00', '2026-02-05 06:22:21.151109+00', NULL, 'aal1', NULL, '2026-02-05 06:22:21.150987', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.74.142', NULL, NULL, NULL, NULL, NULL),
	('889cc393-47b6-44cd-ac5b-9d6b257f80e3', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-05 05:55:37.178058+00', '2026-02-07 04:55:45.011449+00', NULL, 'aal1', NULL, '2026-02-07 04:55:45.011329', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '175.157.230.198', NULL, NULL, NULL, NULL, NULL),
	('e2720125-5bc5-4107-9c7b-55059004e773', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 06:33:05.857157+00', '2026-02-04 11:10:15.083736+00', NULL, 'aal1', NULL, '2026-02-04 11:10:15.08362', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '188.166.237.1', NULL, NULL, NULL, NULL, NULL),
	('520892f8-7f9a-4d4e-8802-e22a91a1939c', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 11:10:30.224467+00', '2026-02-04 11:10:30.224467+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '188.166.237.1', NULL, NULL, NULL, NULL, NULL),
	('f6ca2b77-b0ea-4b7c-9c2f-95c1f491a9b2', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 11:10:53.642092+00', '2026-02-04 11:10:53.642092+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.118 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.22.1-gn', '175.157.228.32', NULL, NULL, NULL, NULL, NULL),
	('e19c7995-094a-4369-97ee-bf8ff868e3c4', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 07:58:05.729045+00', '2026-02-04 11:29:33.679334+00', NULL, 'aal1', NULL, '2026-02-04 11:29:33.679225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '111.223.188.66', NULL, NULL, NULL, NULL, NULL),
	('01faf99c-81cb-4ebc-b50e-add0f43f0175', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 11:12:41.946738+00', '2026-02-04 15:42:20.794031+00', NULL, 'aal1', NULL, '2026-02-04 15:42:20.793881', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '188.166.237.1', NULL, NULL, NULL, NULL, NULL),
	('1aeda070-bae2-4c29-b4be-51542fb1a51d', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-05 06:34:21.683369+00', '2026-02-05 10:22:45.397055+00', NULL, 'aal1', NULL, '2026-02-05 10:22:45.396913', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.74.142', NULL, NULL, NULL, NULL, NULL),
	('5986ab17-1c5a-4a31-901a-6a43f6f15571', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-06 03:24:26.842858+00', '2026-02-08 03:08:06.084686+00', NULL, 'aal1', NULL, '2026-02-08 03:08:06.084576', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('91e635e0-8947-4edb-8003-43cd89bae615', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-05 10:22:53.421259+00', '2026-02-05 14:38:09.906462+00', NULL, 'aal1', NULL, '2026-02-05 14:38:09.906346', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.74.142', NULL, NULL, NULL, NULL, NULL),
	('ae2cbd3a-f95e-4017-8db7-b0d9af52119d', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-05 15:13:16.041278+00', '2026-02-06 03:24:15.863308+00', NULL, 'aal1', NULL, '2026-02-06 03:24:15.863193', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.74.142', NULL, NULL, NULL, NULL, NULL),
	('3e81cae8-53e0-4f41-8856-9fdec9820a4a', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 03:08:27.550187+00', '2026-02-08 08:50:47.063327+00', NULL, 'aal1', NULL, '2026-02-08 08:50:47.063203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('8e3607f7-6815-4995-9061-f4b11eec9838', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 08:51:00.346662+00', '2026-02-08 13:43:43.552116+00', NULL, 'aal1', NULL, '2026-02-08 13:43:43.552008', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('de4bc641-6c19-4c90-b8ae-54e74a04d1ed', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:25:21.10745+00', '2026-02-08 14:25:21.10745+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('6a4dc2d0-7ff5-46d3-9b4b-161baed1881d', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:25:35.857909+00', '2026-02-08 14:25:35.857909+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('d8546596-2bc1-429a-bbd1-3bdd3b58ea91', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:26:48.95512+00', '2026-02-08 14:26:48.95512+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('2e6aacd9-7bc9-40ee-800e-759d31d0d39a', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 14:25:54.165653+00', '2026-02-08 14:25:54.165653+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('a143dbbd-4a45-4da4-90d3-ea259f737a6e', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:28:49.152839+00', '2026-02-08 14:28:49.152839+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('cf0074a7-df54-49e8-8623-6b3d06b39b96', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:33:49.02897+00', '2026-02-08 14:33:49.02897+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('8bb27412-1e43-41c4-ad3b-9800d21d84fb', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:41:45.620446+00', '2026-02-08 14:41:45.620446+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('7aca11a9-d9c7-480a-9992-28540bb95f9f', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 14:42:14.008111+00', '2026-02-08 14:42:14.008111+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('d7f70d24-16b0-4d63-8638-0cc9c88f34d5', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:51:58.99737+00', '2026-02-08 14:51:58.99737+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('5f089b93-6462-475b-b122-233f20389df6', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:56:07.072738+00', '2026-02-08 14:56:07.072738+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('cf046e36-5249-4022-b68e-083fe5cc141b', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:56:18.623119+00', '2026-02-08 14:56:18.623119+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('ede84715-d06b-4533-a737-3b5373541b9a', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 14:59:43.077624+00', '2026-02-08 14:59:43.077624+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('032648cf-8bb1-430e-9039-45c435591bdf', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 15:00:36.585806+00', '2026-02-08 15:00:36.585806+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('12a15f6a-d9be-4298-9147-531ab8311e12', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:01:09.072018+00', '2026-02-08 15:01:09.072018+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('6566b2e6-e568-4637-b090-10eb4160a941', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:05:45.108593+00', '2026-02-08 15:05:45.108593+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('da33e68d-b608-4e46-8756-c05c42b179c3', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:05:50.354634+00', '2026-02-08 15:05:50.354634+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('31b5ca60-8452-4b13-885b-797129c44023', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:05:54.172216+00', '2026-02-08 15:05:54.172216+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('2f33b04c-8cd0-4e4e-9704-16ae9a63d070', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:05:56.188607+00', '2026-02-08 15:05:56.188607+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('a0f06e2a-7233-405b-baaf-b07825a661db', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:06:05.420383+00', '2026-02-08 15:06:05.420383+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('b332ca3a-2b96-4165-8f6c-cba1fd330994', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 15:06:20.668444+00', '2026-02-08 15:06:20.668444+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('fe672ea0-e14e-4fbf-9eda-eb5d97ec7f0a', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:45:57.487997+00', '2026-02-08 15:45:57.487997+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('9315e16a-86ab-4d3b-86e2-fc00bce4df36', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 15:59:46.689857+00', '2026-02-08 15:59:46.689857+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('c559a42e-6cdc-40b1-9417-e34960d8d194', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 16:00:15.856615+00', '2026-02-08 16:00:15.856615+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('d7245ade-d7ae-43f2-9a58-785f3c354826', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 16:43:07.503503+00', '2026-02-08 16:43:07.503503+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('3c87fc75-bc17-4eb2-904c-121243c27b61', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 16:47:00.191702+00', '2026-02-08 16:47:00.191702+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('b30e5dc6-6078-4d29-a711-370aff1c4d74', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 16:47:17.108138+00', '2026-02-08 16:47:17.108138+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('d7f3598d-1a0e-402a-a9c4-0958bb408427', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 16:50:35.618427+00', '2026-02-08 16:50:35.618427+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('86304c55-3ceb-4936-94a9-5d5dbb460212', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 16:53:09.418981+00', '2026-02-08 16:53:09.418981+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('266bfdd5-6023-4d0f-8d1d-9213ea55918b', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 16:53:45.718421+00', '2026-02-08 16:53:45.718421+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('20abea5c-573e-4fbf-9367-3c818076a4ed', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 16:55:53.824127+00', '2026-02-08 16:55:53.824127+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('b52cac85-fd39-4c3e-9869-e8c4f7a9660d', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 16:56:13.629426+00', '2026-02-08 16:56:13.629426+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('47d1ac58-05c7-45ca-88ff-a59cc37a4580', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 17:00:11.752265+00', '2026-02-08 17:00:11.752265+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('14b18657-59e2-4ead-afdc-9c695c1292dd', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-08 17:04:46.225704+00', '2026-02-08 17:04:46.225704+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('ec869877-099e-4d90-b044-72286fc883df', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-14 15:49:20.53058+00', '2026-02-14 15:49:20.53058+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.64.53', NULL, NULL, NULL, NULL, NULL),
	('93a47c4a-e5fb-4512-a6ef-a25b91a1893f', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 17:04:59.764735+00', '2026-02-09 02:31:56.493526+00', NULL, 'aal1', NULL, '2026-02-09 02:31:56.493412', 'Next.js Middleware', '112.135.73.163', NULL, NULL, NULL, NULL, NULL),
	('1bc97ed3-9cbe-4bb7-b95f-e76463d1e693', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-09 02:32:11.679779+00', '2026-02-11 10:23:35.917855+00', NULL, 'aal1', NULL, '2026-02-11 10:23:35.917742', 'Next.js Middleware', '112.135.77.65', NULL, NULL, NULL, NULL, NULL),
	('aed65973-4d9b-4a6a-b3d1-033751e4a260', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-11 10:23:50.676476+00', '2026-02-11 10:23:50.676476+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.77.65', NULL, NULL, NULL, NULL, NULL),
	('4ef9e0b9-d7a6-431c-a3ce-b223f6a7423e', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-11 10:25:18.69865+00', '2026-02-11 10:25:18.69865+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.77.65', NULL, NULL, NULL, NULL, NULL),
	('c50540c8-184f-4792-8210-99cc2daa4e63', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-11 10:29:05.806098+00', '2026-02-11 10:29:05.806098+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.77.65', NULL, NULL, NULL, NULL, NULL),
	('d379ac86-1b1f-4f3a-9097-bfecc6ce0f44', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-14 15:48:25.686788+00', '2026-02-14 15:48:25.686788+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '112.135.64.53', NULL, NULL, NULL, NULL, NULL),
	('15744b98-fffc-4bc9-9fe4-5c61fae1ae6b', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-20 03:28:13.242797+00', '2026-02-20 05:39:10.426968+00', NULL, 'aal1', NULL, '2026-02-20 05:39:10.426848', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '188.166.237.1', NULL, NULL, NULL, NULL, NULL),
	('c70bda9a-f67f-40cc-af58-6d89790eb047', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-25 04:12:37.991195+00', '2026-02-25 11:01:52.142796+00', NULL, 'aal1', NULL, '2026-02-25 11:01:52.142687', 'Next.js Middleware', '188.166.237.1', NULL, NULL, NULL, NULL, NULL),
	('7d13cb38-c7a7-4eec-aa74-817dc539fc96', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-02-25 11:02:06.077052+00', '2026-02-25 11:02:06.077052+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '188.166.237.1', NULL, NULL, NULL, NULL, NULL),
	('37aa0575-fc76-4618-b4b8-a5086b1ad67d', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-03-03 13:16:15.169209+00', '2026-03-03 14:28:27.446706+00', NULL, 'aal1', NULL, '2026-03-03 14:28:27.446585', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '112.135.74.216', NULL, NULL, NULL, NULL, NULL),
	('2fc0ea72-b0be-490c-89a0-74fa7dbee4be', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-07 04:56:25.726573+00', '2026-03-03 14:39:18.802444+00', NULL, 'aal1', NULL, '2026-03-03 14:39:18.802337', 'Next.js Middleware', '112.135.74.216', NULL, NULL, NULL, NULL, NULL),
	('a3b50dfb-5a37-4a7c-ad74-6dfce1af6ab7', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-03-03 14:39:35.709286+00', '2026-03-03 14:39:35.709286+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '104.64.211.19', NULL, NULL, NULL, NULL, NULL),
	('c6d2a7d5-4ea9-42a6-b2eb-476ee9c110aa', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-03-03 14:41:53.268014+00', '2026-03-03 14:41:53.268014+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '104.64.211.19', NULL, NULL, NULL, NULL, NULL),
	('f97c939c-467f-462f-be09-d6e563689d08', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-03-03 14:42:03.825471+00', '2026-03-03 14:42:03.825471+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '104.64.211.19', NULL, NULL, NULL, NULL, NULL),
	('ce488bdf-0a91-40c8-8eee-25fa124a7982', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-03-03 14:42:37.497121+00', '2026-03-03 14:42:37.497121+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '104.64.211.19', NULL, NULL, NULL, NULL, NULL),
	('71b7a204-73c9-4aec-a4a0-8fbbcc6263ed', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-03-03 14:45:12.272519+00', '2026-03-03 14:45:12.272519+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '104.64.211.19', NULL, NULL, NULL, NULL, NULL),
	('e4d58a5c-43e9-43b1-8790-59eb046042ab', '5ec43539-08cd-4269-9523-58eb0923277c', '2026-03-03 15:17:50.119035+00', '2026-03-03 15:17:50.119035+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '104.64.211.19', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('b7dca232-2137-4abd-ba20-5a2e15ce0a41', '2026-02-04 04:56:11.996924+00', '2026-02-04 04:56:11.996924+00', 'password', '61cf00ac-79de-4238-bcea-11b49ca7343d'),
	('080b910b-8122-4c4f-b559-b6351c487139', '2026-02-04 04:57:20.768183+00', '2026-02-04 04:57:20.768183+00', 'password', 'a1b4f1b5-f853-429d-ae49-015a498f1ea0'),
	('9b5774bf-0b6f-4c46-84d9-e875231d873b', '2026-02-04 05:03:16.931499+00', '2026-02-04 05:03:16.931499+00', 'password', 'ce6d4c2b-f16c-40ad-aa01-b558d4622bb3'),
	('090e4751-9db6-48f0-8c0d-8b20f9d78b7d', '2026-02-04 06:21:45.28409+00', '2026-02-04 06:21:45.28409+00', 'password', 'f65afb2e-dd9d-4734-8f2c-47b87bb0b035'),
	('625780a3-d8fa-4da6-818c-74200baa2a1a', '2026-02-04 06:23:49.769259+00', '2026-02-04 06:23:49.769259+00', 'password', '6b3de27f-32e8-4d9f-b575-9b0fbc5e3f68'),
	('9f5b6f92-36b7-4284-8c08-c6699538e8d1', '2026-02-04 06:24:15.92124+00', '2026-02-04 06:24:15.92124+00', 'password', 'bbbc2276-ace2-4e8b-97e3-2dc2b5b5e003'),
	('d443ef45-f1d7-443d-aa21-22d3fda05e79', '2026-02-04 06:31:10.167265+00', '2026-02-04 06:31:10.167265+00', 'password', '21b8a3b2-9829-4f02-ad42-526c67dc56dc'),
	('e2720125-5bc5-4107-9c7b-55059004e773', '2026-02-04 06:33:05.861304+00', '2026-02-04 06:33:05.861304+00', 'password', '444c3a1b-3683-4cab-955c-c93e4c9a35ce'),
	('a9d0b569-1e6c-40a5-b3f0-cfca96bfe928', '2026-02-04 06:54:53.122144+00', '2026-02-04 06:54:53.122144+00', 'password', 'eab203a4-afc0-4bee-9fb9-9194da94625d'),
	('e253dba9-1d7b-4034-b8b8-3e3790b419fa', '2026-02-04 06:55:06.744626+00', '2026-02-04 06:55:06.744626+00', 'password', '0c2f01f3-d903-429a-adb5-19fc000d64b9'),
	('8e225c66-9e13-4033-82c8-6a737a25d9f8', '2026-02-04 07:00:04.296905+00', '2026-02-04 07:00:04.296905+00', 'password', 'ac3c936d-27d0-4bc4-9429-e4ed4c5b7f61'),
	('ac219c06-02a7-483e-a640-369510e249ff', '2026-02-04 07:19:10.016996+00', '2026-02-04 07:19:10.016996+00', 'password', '72226890-33ca-4fe4-9c48-1274ad98d6fc'),
	('a9595832-d8d4-4ac8-bd22-be02fa439a9a', '2026-02-04 07:55:42.591278+00', '2026-02-04 07:55:42.591278+00', 'password', '38f80bd1-bd23-4e08-81d2-b235893a6ebd'),
	('e19c7995-094a-4369-97ee-bf8ff868e3c4', '2026-02-04 07:58:05.763832+00', '2026-02-04 07:58:05.763832+00', 'password', '929cc46a-eb62-4108-875b-9cb3850ce03f'),
	('ba842522-1197-4b55-a29d-bfa0ea594d1f', '2026-02-04 07:58:36.836322+00', '2026-02-04 07:58:36.836322+00', 'password', 'fc12c725-d45a-4508-bc25-1d0a6e1dd5aa'),
	('86ccc9a6-1c3e-4abc-af9b-ffd4c2e142c8', '2026-02-04 08:34:20.146493+00', '2026-02-04 08:34:20.146493+00', 'password', '32a4023e-ea84-466d-9e91-a020fe285c6c'),
	('e7c4195b-e3b0-4bbb-84bc-eb1ecc242efd', '2026-02-04 08:38:27.042813+00', '2026-02-04 08:38:27.042813+00', 'password', '23a2975f-5f6b-417a-aa23-37ca5cc333df'),
	('520892f8-7f9a-4d4e-8802-e22a91a1939c', '2026-02-04 11:10:30.233919+00', '2026-02-04 11:10:30.233919+00', 'password', 'a762ba8f-93a2-4eeb-9b60-78d0c15c4d21'),
	('f6ca2b77-b0ea-4b7c-9c2f-95c1f491a9b2', '2026-02-04 11:10:53.64602+00', '2026-02-04 11:10:53.64602+00', 'password', '61586345-d37a-4f41-8c20-4c38cb49a6b1'),
	('01faf99c-81cb-4ebc-b50e-add0f43f0175', '2026-02-04 11:12:42.011266+00', '2026-02-04 11:12:42.011266+00', 'password', 'c2e2cbcb-dadd-42bb-8624-98c3bcb5929d'),
	('889cc393-47b6-44cd-ac5b-9d6b257f80e3', '2026-02-05 05:55:37.25972+00', '2026-02-05 05:55:37.25972+00', 'password', '9f930a9d-3ebc-402d-9439-11775dc0ab34'),
	('1aeda070-bae2-4c29-b4be-51542fb1a51d', '2026-02-05 06:34:21.733597+00', '2026-02-05 06:34:21.733597+00', 'password', 'a805ee75-ec7f-4cc9-bd03-2c28dbe53989'),
	('91e635e0-8947-4edb-8003-43cd89bae615', '2026-02-05 10:22:53.433776+00', '2026-02-05 10:22:53.433776+00', 'password', 'd50c20ad-2aed-4173-9bae-a19c82bacf6c'),
	('ae2cbd3a-f95e-4017-8db7-b0d9af52119d', '2026-02-05 15:13:16.08626+00', '2026-02-05 15:13:16.08626+00', 'password', 'e46187de-833c-467a-be86-619bbcab254c'),
	('5986ab17-1c5a-4a31-901a-6a43f6f15571', '2026-02-06 03:24:26.856025+00', '2026-02-06 03:24:26.856025+00', 'password', 'a83f1c7a-f692-46bb-9179-252e6c21b6b9'),
	('2fc0ea72-b0be-490c-89a0-74fa7dbee4be', '2026-02-07 04:56:25.7398+00', '2026-02-07 04:56:25.7398+00', 'password', '53d5d053-1846-4187-807a-b00651ac347a'),
	('3e81cae8-53e0-4f41-8856-9fdec9820a4a', '2026-02-08 03:08:27.566268+00', '2026-02-08 03:08:27.566268+00', 'password', '052da825-a2dd-42f9-acb7-872685b2be29'),
	('8e3607f7-6815-4995-9061-f4b11eec9838', '2026-02-08 08:51:00.363774+00', '2026-02-08 08:51:00.363774+00', 'password', '2f3d6ba6-331d-4fef-b80a-1cec2ae56dfe'),
	('de4bc641-6c19-4c90-b8ae-54e74a04d1ed', '2026-02-08 14:25:21.135823+00', '2026-02-08 14:25:21.135823+00', 'password', '64204ac6-fbc2-4249-8211-7362ae9a4374'),
	('6a4dc2d0-7ff5-46d3-9b4b-161baed1881d', '2026-02-08 14:25:35.860923+00', '2026-02-08 14:25:35.860923+00', 'password', 'c0b09849-fc04-47f0-8b41-237bc7667186'),
	('2e6aacd9-7bc9-40ee-800e-759d31d0d39a', '2026-02-08 14:25:54.171184+00', '2026-02-08 14:25:54.171184+00', 'password', '7c2a4d91-9cb5-441a-a7f7-1e3da0ca44e4'),
	('d8546596-2bc1-429a-bbd1-3bdd3b58ea91', '2026-02-08 14:26:48.957436+00', '2026-02-08 14:26:48.957436+00', 'password', 'c20e8c11-4c6e-4b17-9d07-76e8276c01c4'),
	('a143dbbd-4a45-4da4-90d3-ea259f737a6e', '2026-02-08 14:28:49.171181+00', '2026-02-08 14:28:49.171181+00', 'password', 'f6493151-ff34-40fd-bbcd-982c25e75d36'),
	('cf0074a7-df54-49e8-8623-6b3d06b39b96', '2026-02-08 14:33:49.048564+00', '2026-02-08 14:33:49.048564+00', 'password', '8e9e007b-e474-43d3-9360-dadcbe6d1ab0'),
	('8bb27412-1e43-41c4-ad3b-9800d21d84fb', '2026-02-08 14:41:45.63457+00', '2026-02-08 14:41:45.63457+00', 'password', 'b840287e-cf51-435f-a871-2eade9073b80'),
	('7aca11a9-d9c7-480a-9992-28540bb95f9f', '2026-02-08 14:42:14.086007+00', '2026-02-08 14:42:14.086007+00', 'password', '1a3095f7-cae8-4453-a376-42141958da52'),
	('d7f70d24-16b0-4d63-8638-0cc9c88f34d5', '2026-02-08 14:51:59.01671+00', '2026-02-08 14:51:59.01671+00', 'password', '367e2f2f-ffdf-48e5-975d-ceed39df59d6'),
	('5f089b93-6462-475b-b122-233f20389df6', '2026-02-08 14:56:07.085408+00', '2026-02-08 14:56:07.085408+00', 'password', '2c3a902e-814e-489e-a7e6-d21dfeaa2064'),
	('cf046e36-5249-4022-b68e-083fe5cc141b', '2026-02-08 14:56:18.625758+00', '2026-02-08 14:56:18.625758+00', 'password', '52040259-1661-42ab-acb6-674bd5963e31'),
	('ede84715-d06b-4533-a737-3b5373541b9a', '2026-02-08 14:59:43.081268+00', '2026-02-08 14:59:43.081268+00', 'password', '1e2fcd04-beb7-4ef5-a027-ae915f344cb6'),
	('032648cf-8bb1-430e-9039-45c435591bdf', '2026-02-08 15:00:36.592056+00', '2026-02-08 15:00:36.592056+00', 'password', '9bae2245-b8c5-4dfd-b2a5-186ca65f9da7'),
	('12a15f6a-d9be-4298-9147-531ab8311e12', '2026-02-08 15:01:09.074464+00', '2026-02-08 15:01:09.074464+00', 'password', 'e9e0ccac-5080-4214-9df6-1a072f36bc80'),
	('6566b2e6-e568-4637-b090-10eb4160a941', '2026-02-08 15:05:45.191397+00', '2026-02-08 15:05:45.191397+00', 'password', 'bf0426b3-c6f0-40da-8b12-5fe24cf59a34'),
	('da33e68d-b608-4e46-8756-c05c42b179c3', '2026-02-08 15:05:50.358992+00', '2026-02-08 15:05:50.358992+00', 'password', '025c7447-2489-408a-a7df-839fa37cd708'),
	('31b5ca60-8452-4b13-885b-797129c44023', '2026-02-08 15:05:54.175496+00', '2026-02-08 15:05:54.175496+00', 'password', '98a57700-9299-4a2b-8aa3-aac20414e30e'),
	('2f33b04c-8cd0-4e4e-9704-16ae9a63d070', '2026-02-08 15:05:56.192394+00', '2026-02-08 15:05:56.192394+00', 'password', '1f61c6e1-bc4b-47af-812f-49aeaeef9f09'),
	('a0f06e2a-7233-405b-baaf-b07825a661db', '2026-02-08 15:06:05.422756+00', '2026-02-08 15:06:05.422756+00', 'password', '00aa8199-1048-4050-aeb2-ba8c7a7f0d32'),
	('b332ca3a-2b96-4165-8f6c-cba1fd330994', '2026-02-08 15:06:20.67199+00', '2026-02-08 15:06:20.67199+00', 'password', 'e59a9223-a430-4275-939c-a348f0bd79cd'),
	('fe672ea0-e14e-4fbf-9eda-eb5d97ec7f0a', '2026-02-08 15:45:57.519869+00', '2026-02-08 15:45:57.519869+00', 'password', '3508ecdb-2036-4acc-a765-0c20f22e8078'),
	('9315e16a-86ab-4d3b-86e2-fc00bce4df36', '2026-02-08 15:59:46.712736+00', '2026-02-08 15:59:46.712736+00', 'password', '4c1ad77f-80e8-4a66-ba07-5c9ebaf15d1d'),
	('c559a42e-6cdc-40b1-9417-e34960d8d194', '2026-02-08 16:00:15.860217+00', '2026-02-08 16:00:15.860217+00', 'password', 'a5afcc13-327f-40cc-b666-3820503e62c3'),
	('d7245ade-d7ae-43f2-9a58-785f3c354826', '2026-02-08 16:43:07.591127+00', '2026-02-08 16:43:07.591127+00', 'password', 'e6ebf6b1-33b4-41c7-bbf6-74763875a33a'),
	('3c87fc75-bc17-4eb2-904c-121243c27b61', '2026-02-08 16:47:00.212877+00', '2026-02-08 16:47:00.212877+00', 'password', '391ef2b1-4047-47c1-aa29-3785fdfbddef'),
	('b30e5dc6-6078-4d29-a711-370aff1c4d74', '2026-02-08 16:47:17.114163+00', '2026-02-08 16:47:17.114163+00', 'password', 'daeedbd7-e1ac-4a84-b41b-414012503284'),
	('d7f3598d-1a0e-402a-a9c4-0958bb408427', '2026-02-08 16:50:35.71942+00', '2026-02-08 16:50:35.71942+00', 'password', '255a8c5a-eaa9-49b2-882f-877bceac14e6'),
	('86304c55-3ceb-4936-94a9-5d5dbb460212', '2026-02-08 16:53:09.438456+00', '2026-02-08 16:53:09.438456+00', 'password', '38207c82-3c8c-474a-a375-35a63732e78f'),
	('266bfdd5-6023-4d0f-8d1d-9213ea55918b', '2026-02-08 16:53:45.721116+00', '2026-02-08 16:53:45.721116+00', 'password', '65f95d88-db67-49a4-866b-f935e6580954'),
	('20abea5c-573e-4fbf-9367-3c818076a4ed', '2026-02-08 16:55:53.829389+00', '2026-02-08 16:55:53.829389+00', 'password', '66f80606-6af5-48f2-bb56-8c07e991b551'),
	('b52cac85-fd39-4c3e-9869-e8c4f7a9660d', '2026-02-08 16:56:13.631687+00', '2026-02-08 16:56:13.631687+00', 'password', '44f76827-6a48-4ca4-b408-82f3630989f5'),
	('47d1ac58-05c7-45ca-88ff-a59cc37a4580', '2026-02-08 17:00:11.75724+00', '2026-02-08 17:00:11.75724+00', 'password', '2d00efdb-8b9c-4d29-91ac-3fe6e8285051'),
	('14b18657-59e2-4ead-afdc-9c695c1292dd', '2026-02-08 17:04:46.252887+00', '2026-02-08 17:04:46.252887+00', 'password', '988d2b42-0f71-4abd-b643-c25d0a5aec49'),
	('93a47c4a-e5fb-4512-a6ef-a25b91a1893f', '2026-02-08 17:04:59.767232+00', '2026-02-08 17:04:59.767232+00', 'password', '67063f03-cb45-4258-97f4-4f688a2552b7'),
	('1bc97ed3-9cbe-4bb7-b95f-e76463d1e693', '2026-02-09 02:32:11.694684+00', '2026-02-09 02:32:11.694684+00', 'password', '70847047-c2cc-49af-a8f4-daedafde2b64'),
	('aed65973-4d9b-4a6a-b3d1-033751e4a260', '2026-02-11 10:23:50.690165+00', '2026-02-11 10:23:50.690165+00', 'password', '55c2e5bb-2b1d-4902-9803-79c7e8a8a8da'),
	('4ef9e0b9-d7a6-431c-a3ce-b223f6a7423e', '2026-02-11 10:25:18.759514+00', '2026-02-11 10:25:18.759514+00', 'password', 'cbafe555-e085-4ca2-ad3c-5e709fc56d83'),
	('c50540c8-184f-4792-8210-99cc2daa4e63', '2026-02-11 10:29:05.826814+00', '2026-02-11 10:29:05.826814+00', 'password', 'ca13c835-3ce6-49f4-9c33-c735deab0eda'),
	('d379ac86-1b1f-4f3a-9097-bfecc6ce0f44', '2026-02-14 15:48:25.772747+00', '2026-02-14 15:48:25.772747+00', 'password', 'e4802906-65b9-4fae-a61f-7402946076b2'),
	('ec869877-099e-4d90-b044-72286fc883df', '2026-02-14 15:49:20.575182+00', '2026-02-14 15:49:20.575182+00', 'password', 'b3d97a69-14b2-4289-a9c9-20a2669eedf4'),
	('15744b98-fffc-4bc9-9fe4-5c61fae1ae6b', '2026-02-20 03:28:13.33204+00', '2026-02-20 03:28:13.33204+00', 'password', 'f064e325-8a99-4ca0-975d-dd9223febe3b'),
	('c70bda9a-f67f-40cc-af58-6d89790eb047', '2026-02-25 04:12:38.091905+00', '2026-02-25 04:12:38.091905+00', 'password', 'e318cc5e-7854-4a83-9785-0780a3747ac7'),
	('7d13cb38-c7a7-4eec-aa74-817dc539fc96', '2026-02-25 11:02:06.096794+00', '2026-02-25 11:02:06.096794+00', 'password', '7e5d1959-ef81-450a-9276-76d691b6dc0d'),
	('37aa0575-fc76-4618-b4b8-a5086b1ad67d', '2026-03-03 13:16:15.256974+00', '2026-03-03 13:16:15.256974+00', 'password', '38591d34-1899-48ca-968f-3793b69730d7'),
	('a3b50dfb-5a37-4a7c-ad74-6dfce1af6ab7', '2026-03-03 14:39:35.717772+00', '2026-03-03 14:39:35.717772+00', 'password', 'cef167b3-565e-459a-988e-3b0d081a2ac6'),
	('c6d2a7d5-4ea9-42a6-b2eb-476ee9c110aa', '2026-03-03 14:41:53.273862+00', '2026-03-03 14:41:53.273862+00', 'password', 'de6de7d9-17f7-497d-8721-306a0561a7b4'),
	('f97c939c-467f-462f-be09-d6e563689d08', '2026-03-03 14:42:03.828719+00', '2026-03-03 14:42:03.828719+00', 'password', 'cd595ea4-0f08-4c56-9910-69c7cd6895a6'),
	('ce488bdf-0a91-40c8-8eee-25fa124a7982', '2026-03-03 14:42:37.572861+00', '2026-03-03 14:42:37.572861+00', 'password', 'a3a0411f-51a2-4041-9d8f-96f4d787c671'),
	('71b7a204-73c9-4aec-a4a0-8fbbcc6263ed', '2026-03-03 14:45:12.284142+00', '2026-03-03 14:45:12.284142+00', 'password', '4a98c207-7460-4aa7-a4a7-38cfa2adad3b'),
	('e4d58a5c-43e9-43b1-8790-59eb046042ab', '2026-03-03 15:17:50.181936+00', '2026-03-03 15:17:50.181936+00', 'password', '16b6489d-9d25-4a4a-a179-cfbea87a8a79');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 4, 'nbsdsgnwxdtp', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 04:56:11.989773+00', '2026-02-04 04:56:11.989773+00', NULL, 'b7dca232-2137-4abd-ba20-5a2e15ce0a41'),
	('00000000-0000-0000-0000-000000000000', 5, '653fu2jph6gu', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 04:57:20.765742+00', '2026-02-04 04:57:20.765742+00', NULL, '080b910b-8122-4c4f-b559-b6351c487139'),
	('00000000-0000-0000-0000-000000000000', 6, 'cqhcnj37opr6', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', true, '2026-02-04 05:03:16.897296+00', '2026-02-04 06:03:23.834972+00', NULL, '9b5774bf-0b6f-4c46-84d9-e875231d873b'),
	('00000000-0000-0000-0000-000000000000', 7, 'xht45z452sor', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 06:03:23.846944+00', '2026-02-04 06:03:23.846944+00', 'cqhcnj37opr6', '9b5774bf-0b6f-4c46-84d9-e875231d873b'),
	('00000000-0000-0000-0000-000000000000', 9, 'quuly7brrx4w', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 06:21:45.281666+00', '2026-02-04 06:21:45.281666+00', NULL, '090e4751-9db6-48f0-8c0d-8b20f9d78b7d'),
	('00000000-0000-0000-0000-000000000000', 10, '3g32nf2d6znx', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 06:23:49.761888+00', '2026-02-04 06:23:49.761888+00', NULL, '625780a3-d8fa-4da6-818c-74200baa2a1a'),
	('00000000-0000-0000-0000-000000000000', 11, '7cii44n2ojqi', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 06:24:15.919008+00', '2026-02-04 06:24:15.919008+00', NULL, '9f5b6f92-36b7-4284-8c08-c6699538e8d1'),
	('00000000-0000-0000-0000-000000000000', 12, 'b3rusmj66szp', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 06:31:10.164011+00', '2026-02-04 06:31:10.164011+00', NULL, 'd443ef45-f1d7-443d-aa21-22d3fda05e79'),
	('00000000-0000-0000-0000-000000000000', 14, 'rrl3qgrqmkgr', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 06:54:53.101062+00', '2026-02-04 06:54:53.101062+00', NULL, 'a9d0b569-1e6c-40a5-b3f0-cfca96bfe928'),
	('00000000-0000-0000-0000-000000000000', 15, '6ytssvmyooqp', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 06:55:06.742374+00', '2026-02-04 06:55:06.742374+00', NULL, 'e253dba9-1d7b-4034-b8b8-3e3790b419fa'),
	('00000000-0000-0000-0000-000000000000', 16, 'pbrgqvffx67v', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 07:00:04.293896+00', '2026-02-04 07:00:04.293896+00', NULL, '8e225c66-9e13-4033-82c8-6a737a25d9f8'),
	('00000000-0000-0000-0000-000000000000', 13, 'nhba7eahboyf', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', true, '2026-02-04 06:33:05.858986+00', '2026-02-04 07:35:29.57734+00', NULL, 'e2720125-5bc5-4107-9c7b-55059004e773'),
	('00000000-0000-0000-0000-000000000000', 19, 'loxknrbymjy7', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 07:55:42.573181+00', '2026-02-04 07:55:42.573181+00', NULL, 'a9595832-d8d4-4ac8-bd22-be02fa439a9a'),
	('00000000-0000-0000-0000-000000000000', 21, 'fu4ln4onetd3', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 07:58:36.834896+00', '2026-02-04 07:58:36.834896+00', NULL, 'ba842522-1197-4b55-a29d-bfa0ea594d1f'),
	('00000000-0000-0000-0000-000000000000', 17, 'lnzwsz3km5f7', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-04 07:19:09.996888+00', '2026-02-04 08:28:26.430942+00', NULL, 'ac219c06-02a7-483e-a640-369510e249ff'),
	('00000000-0000-0000-0000-000000000000', 22, 'gr2dpilsr3o3', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 08:28:26.445558+00', '2026-02-04 08:28:26.445558+00', 'lnzwsz3km5f7', 'ac219c06-02a7-483e-a640-369510e249ff'),
	('00000000-0000-0000-0000-000000000000', 23, 'iylzo2myq2hg', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 08:34:20.119021+00', '2026-02-04 08:34:20.119021+00', NULL, '86ccc9a6-1c3e-4abc-af9b-ffd4c2e142c8'),
	('00000000-0000-0000-0000-000000000000', 24, 'dpt5qrgzk2yw', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', true, '2026-02-04 08:38:27.029347+00', '2026-02-04 09:37:44.911664+00', NULL, 'e7c4195b-e3b0-4bbb-84bc-eb1ecc242efd'),
	('00000000-0000-0000-0000-000000000000', 25, 'uoxarfrvbnz6', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', true, '2026-02-04 09:37:44.919236+00', '2026-02-04 10:35:59.301685+00', 'dpt5qrgzk2yw', 'e7c4195b-e3b0-4bbb-84bc-eb1ecc242efd'),
	('00000000-0000-0000-0000-000000000000', 18, 'mgzaxpjrcavh', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', true, '2026-02-04 07:35:29.585874+00', '2026-02-04 11:10:15.046121+00', 'nhba7eahboyf', 'e2720125-5bc5-4107-9c7b-55059004e773'),
	('00000000-0000-0000-0000-000000000000', 27, 'axhvcvee6rsm', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-04 11:10:15.062075+00', '2026-02-04 11:10:15.062075+00', 'mgzaxpjrcavh', 'e2720125-5bc5-4107-9c7b-55059004e773'),
	('00000000-0000-0000-0000-000000000000', 28, 'x6ls2os5aeg5', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 11:10:30.231262+00', '2026-02-04 11:10:30.231262+00', NULL, '520892f8-7f9a-4d4e-8802-e22a91a1939c'),
	('00000000-0000-0000-0000-000000000000', 29, 'idr42xhtfjly', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 11:10:53.643916+00', '2026-02-04 11:10:53.643916+00', NULL, 'f6ca2b77-b0ea-4b7c-9c2f-95c1f491a9b2'),
	('00000000-0000-0000-0000-000000000000', 20, 'advgsx2lk2ag', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-04 07:58:05.756545+00', '2026-02-04 11:29:33.638526+00', NULL, 'e19c7995-094a-4369-97ee-bf8ff868e3c4'),
	('00000000-0000-0000-0000-000000000000', 31, '4cg4362s5ukm', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 11:29:33.655239+00', '2026-02-04 11:29:33.655239+00', 'advgsx2lk2ag', 'e19c7995-094a-4369-97ee-bf8ff868e3c4'),
	('00000000-0000-0000-0000-000000000000', 30, 'vfmwd7l4zuas', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-04 11:12:41.979681+00', '2026-02-04 13:38:58.055978+00', NULL, '01faf99c-81cb-4ebc-b50e-add0f43f0175'),
	('00000000-0000-0000-0000-000000000000', 32, 'z6cstmlutz5x', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-04 13:38:58.080797+00', '2026-02-04 15:42:20.736764+00', 'vfmwd7l4zuas', '01faf99c-81cb-4ebc-b50e-add0f43f0175'),
	('00000000-0000-0000-0000-000000000000', 33, '5spc3azc4nri', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-04 15:42:20.76578+00', '2026-02-04 15:42:20.76578+00', 'z6cstmlutz5x', '01faf99c-81cb-4ebc-b50e-add0f43f0175'),
	('00000000-0000-0000-0000-000000000000', 26, 'w6r673xyhhqa', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', true, '2026-02-04 10:35:59.32762+00', '2026-02-05 06:22:21.107558+00', 'uoxarfrvbnz6', 'e7c4195b-e3b0-4bbb-84bc-eb1ecc242efd'),
	('00000000-0000-0000-0000-000000000000', 35, 'a2ku7zn2memb', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', false, '2026-02-05 06:22:21.12514+00', '2026-02-05 06:22:21.12514+00', 'w6r673xyhhqa', 'e7c4195b-e3b0-4bbb-84bc-eb1ecc242efd'),
	('00000000-0000-0000-0000-000000000000', 36, '7p5oa4xa4u2y', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 06:34:21.713684+00', '2026-02-05 10:22:45.342035+00', NULL, '1aeda070-bae2-4c29-b4be-51542fb1a51d'),
	('00000000-0000-0000-0000-000000000000', 37, 'lifmzcxyouya', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-05 10:22:45.362971+00', '2026-02-05 10:22:45.362971+00', '7p5oa4xa4u2y', '1aeda070-bae2-4c29-b4be-51542fb1a51d'),
	('00000000-0000-0000-0000-000000000000', 38, 'hxodzk4zbzfo', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 10:22:53.430996+00', '2026-02-05 11:21:24.132144+00', NULL, '91e635e0-8947-4edb-8003-43cd89bae615'),
	('00000000-0000-0000-0000-000000000000', 39, '4nopdecf74zc', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 11:21:24.157886+00', '2026-02-05 12:19:49.765945+00', 'hxodzk4zbzfo', '91e635e0-8947-4edb-8003-43cd89bae615'),
	('00000000-0000-0000-0000-000000000000', 40, 'qmy5aiwshxgr', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 12:19:49.775253+00', '2026-02-05 13:23:38.300863+00', '4nopdecf74zc', '91e635e0-8947-4edb-8003-43cd89bae615'),
	('00000000-0000-0000-0000-000000000000', 41, '4bemalxx7j3r', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 13:23:38.334045+00', '2026-02-05 14:38:09.84564+00', 'qmy5aiwshxgr', '91e635e0-8947-4edb-8003-43cd89bae615'),
	('00000000-0000-0000-0000-000000000000', 42, 'ofjvriopbmsl', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-05 14:38:09.871485+00', '2026-02-05 14:38:09.871485+00', '4bemalxx7j3r', '91e635e0-8947-4edb-8003-43cd89bae615'),
	('00000000-0000-0000-0000-000000000000', 43, '75dyhyxltqij', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 15:13:16.062741+00', '2026-02-06 03:24:15.793744+00', NULL, 'ae2cbd3a-f95e-4017-8db7-b0d9af52119d'),
	('00000000-0000-0000-0000-000000000000', 44, 'ckllkpggkacr', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-06 03:24:15.82717+00', '2026-02-06 03:24:15.82717+00', '75dyhyxltqij', 'ae2cbd3a-f95e-4017-8db7-b0d9af52119d'),
	('00000000-0000-0000-0000-000000000000', 34, 'r25kzro3klbx', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-05 05:55:37.219463+00', '2026-02-07 04:55:44.949801+00', NULL, '889cc393-47b6-44cd-ac5b-9d6b257f80e3'),
	('00000000-0000-0000-0000-000000000000', 46, 'crmcr2jn3c5q', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-07 04:55:44.980624+00', '2026-02-07 04:55:44.980624+00', 'r25kzro3klbx', '889cc393-47b6-44cd-ac5b-9d6b257f80e3'),
	('00000000-0000-0000-0000-000000000000', 47, 'ghg7ftbjgahx', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-07 04:56:25.737683+00', '2026-02-07 06:02:13.822915+00', NULL, '2fc0ea72-b0be-490c-89a0-74fa7dbee4be'),
	('00000000-0000-0000-0000-000000000000', 45, 'ihlzbnjwjgfd', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-06 03:24:26.853903+00', '2026-02-08 03:08:06.021459+00', NULL, '5986ab17-1c5a-4a31-901a-6a43f6f15571'),
	('00000000-0000-0000-0000-000000000000', 49, 'ia73kxdouk5j', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 03:08:06.047678+00', '2026-02-08 03:08:06.047678+00', 'ihlzbnjwjgfd', '5986ab17-1c5a-4a31-901a-6a43f6f15571'),
	('00000000-0000-0000-0000-000000000000', 50, 'eokwtizodet2', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 03:08:27.563397+00', '2026-02-08 08:50:46.994979+00', NULL, '3e81cae8-53e0-4f41-8856-9fdec9820a4a'),
	('00000000-0000-0000-0000-000000000000', 51, 'eytgho2nkjme', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 08:50:47.02686+00', '2026-02-08 08:50:47.02686+00', 'eokwtizodet2', '3e81cae8-53e0-4f41-8856-9fdec9820a4a'),
	('00000000-0000-0000-0000-000000000000', 52, 'ixsowotujgfh', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 08:51:00.359905+00', '2026-02-08 09:49:18.313362+00', NULL, '8e3607f7-6815-4995-9061-f4b11eec9838'),
	('00000000-0000-0000-0000-000000000000', 53, 'hq6f3x3dcppy', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 09:49:18.332894+00', '2026-02-08 10:47:48.398651+00', 'ixsowotujgfh', '8e3607f7-6815-4995-9061-f4b11eec9838'),
	('00000000-0000-0000-0000-000000000000', 54, 'pjl6jgqkc77d', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 10:47:48.419243+00', '2026-02-08 11:46:18.324093+00', 'hq6f3x3dcppy', '8e3607f7-6815-4995-9061-f4b11eec9838'),
	('00000000-0000-0000-0000-000000000000', 55, 'xkg3aycuydhl', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 11:46:18.340651+00', '2026-02-08 12:45:28.172647+00', 'pjl6jgqkc77d', '8e3607f7-6815-4995-9061-f4b11eec9838'),
	('00000000-0000-0000-0000-000000000000', 56, 'emmkirfjprhf', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 12:45:28.184248+00', '2026-02-08 13:43:43.491534+00', 'xkg3aycuydhl', '8e3607f7-6815-4995-9061-f4b11eec9838'),
	('00000000-0000-0000-0000-000000000000', 48, 'ccn67o64uk5w', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-07 06:02:13.850231+00', '2026-03-03 14:39:18.779385+00', 'ghg7ftbjgahx', '2fc0ea72-b0be-490c-89a0-74fa7dbee4be'),
	('00000000-0000-0000-0000-000000000000', 57, 'vki6rlwws6ld', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 13:43:43.512626+00', '2026-02-08 13:43:43.512626+00', 'emmkirfjprhf', '8e3607f7-6815-4995-9061-f4b11eec9838'),
	('00000000-0000-0000-0000-000000000000', 58, 'nkcdgb5pxecg', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:25:21.115253+00', '2026-02-08 14:25:21.115253+00', NULL, 'de4bc641-6c19-4c90-b8ae-54e74a04d1ed'),
	('00000000-0000-0000-0000-000000000000', 59, 'c23cnvoeivye', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:25:35.859647+00', '2026-02-08 14:25:35.859647+00', NULL, '6a4dc2d0-7ff5-46d3-9b4b-161baed1881d'),
	('00000000-0000-0000-0000-000000000000', 60, '6i4sno5se5wx', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 14:25:54.168619+00', '2026-02-08 14:25:54.168619+00', NULL, '2e6aacd9-7bc9-40ee-800e-759d31d0d39a'),
	('00000000-0000-0000-0000-000000000000', 61, 'eeagzi3tbcfb', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:26:48.956138+00', '2026-02-08 14:26:48.956138+00', NULL, 'd8546596-2bc1-429a-bbd1-3bdd3b58ea91'),
	('00000000-0000-0000-0000-000000000000', 62, '2n6qm67ta2cx', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:28:49.166226+00', '2026-02-08 14:28:49.166226+00', NULL, 'a143dbbd-4a45-4da4-90d3-ea259f737a6e'),
	('00000000-0000-0000-0000-000000000000', 63, 'kv3t7mrnzkco', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:33:49.038614+00', '2026-02-08 14:33:49.038614+00', NULL, 'cf0074a7-df54-49e8-8623-6b3d06b39b96'),
	('00000000-0000-0000-0000-000000000000', 64, '2n3qsjgtdyhh', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:41:45.630889+00', '2026-02-08 14:41:45.630889+00', NULL, '8bb27412-1e43-41c4-ad3b-9800d21d84fb'),
	('00000000-0000-0000-0000-000000000000', 65, 'vjbjh23ajkyl', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 14:42:14.059716+00', '2026-02-08 14:42:14.059716+00', NULL, '7aca11a9-d9c7-480a-9992-28540bb95f9f'),
	('00000000-0000-0000-0000-000000000000', 66, 'tajh57s4ds3c', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:51:59.00626+00', '2026-02-08 14:51:59.00626+00', NULL, 'd7f70d24-16b0-4d63-8638-0cc9c88f34d5'),
	('00000000-0000-0000-0000-000000000000', 67, '7tmb5uab4c4s', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:56:07.07689+00', '2026-02-08 14:56:07.07689+00', NULL, '5f089b93-6462-475b-b122-233f20389df6'),
	('00000000-0000-0000-0000-000000000000', 68, 'oi2gmplfbncn', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:56:18.62444+00', '2026-02-08 14:56:18.62444+00', NULL, 'cf046e36-5249-4022-b68e-083fe5cc141b'),
	('00000000-0000-0000-0000-000000000000', 69, 'fkduozyhqrlx', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 14:59:43.079104+00', '2026-02-08 14:59:43.079104+00', NULL, 'ede84715-d06b-4533-a737-3b5373541b9a'),
	('00000000-0000-0000-0000-000000000000', 70, 'ba33vt572wus', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 15:00:36.587333+00', '2026-02-08 15:00:36.587333+00', NULL, '032648cf-8bb1-430e-9039-45c435591bdf'),
	('00000000-0000-0000-0000-000000000000', 71, 'ggavpjojbpig', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:01:09.073118+00', '2026-02-08 15:01:09.073118+00', NULL, '12a15f6a-d9be-4298-9147-531ab8311e12'),
	('00000000-0000-0000-0000-000000000000', 72, '3cbaiblfhdbv', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:05:45.155563+00', '2026-02-08 15:05:45.155563+00', NULL, '6566b2e6-e568-4637-b090-10eb4160a941'),
	('00000000-0000-0000-0000-000000000000', 73, '3djoqxsidcq2', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:05:50.355673+00', '2026-02-08 15:05:50.355673+00', NULL, 'da33e68d-b608-4e46-8756-c05c42b179c3'),
	('00000000-0000-0000-0000-000000000000', 74, 'dykvf4stomuc', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:05:54.174089+00', '2026-02-08 15:05:54.174089+00', NULL, '31b5ca60-8452-4b13-885b-797129c44023'),
	('00000000-0000-0000-0000-000000000000', 75, 'ymd4mozly5yj', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:05:56.189635+00', '2026-02-08 15:05:56.189635+00', NULL, '2f33b04c-8cd0-4e4e-9704-16ae9a63d070'),
	('00000000-0000-0000-0000-000000000000', 76, 'nonopokrzulz', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:06:05.421479+00', '2026-02-08 15:06:05.421479+00', NULL, 'a0f06e2a-7233-405b-baaf-b07825a661db'),
	('00000000-0000-0000-0000-000000000000', 77, '4oehd24iu26l', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 15:06:20.669893+00', '2026-02-08 15:06:20.669893+00', NULL, 'b332ca3a-2b96-4165-8f6c-cba1fd330994'),
	('00000000-0000-0000-0000-000000000000', 78, '77t6333o2jgj', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:45:57.499604+00', '2026-02-08 15:45:57.499604+00', NULL, 'fe672ea0-e14e-4fbf-9eda-eb5d97ec7f0a'),
	('00000000-0000-0000-0000-000000000000', 79, 'cyn2subm6b2m', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 15:59:46.702492+00', '2026-02-08 15:59:46.702492+00', NULL, '9315e16a-86ab-4d3b-86e2-fc00bce4df36'),
	('00000000-0000-0000-0000-000000000000', 80, 'ielkh3luzr2p', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 16:00:15.858261+00', '2026-02-08 16:00:15.858261+00', NULL, 'c559a42e-6cdc-40b1-9417-e34960d8d194'),
	('00000000-0000-0000-0000-000000000000', 81, 'bu4tfewyhv6e', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 16:43:07.550185+00', '2026-02-08 16:43:07.550185+00', NULL, 'd7245ade-d7ae-43f2-9a58-785f3c354826'),
	('00000000-0000-0000-0000-000000000000', 82, '3gw3yeq7pksx', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 16:47:00.203349+00', '2026-02-08 16:47:00.203349+00', NULL, '3c87fc75-bc17-4eb2-904c-121243c27b61'),
	('00000000-0000-0000-0000-000000000000', 83, '7x644ceovftq', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 16:47:17.111614+00', '2026-02-08 16:47:17.111614+00', NULL, 'b30e5dc6-6078-4d29-a711-370aff1c4d74'),
	('00000000-0000-0000-0000-000000000000', 84, 'guku253m4sw7', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 16:50:35.674794+00', '2026-02-08 16:50:35.674794+00', NULL, 'd7f3598d-1a0e-402a-a9c4-0958bb408427'),
	('00000000-0000-0000-0000-000000000000', 85, 'qv6q3sy54reh', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 16:53:09.431686+00', '2026-02-08 16:53:09.431686+00', NULL, '86304c55-3ceb-4936-94a9-5d5dbb460212'),
	('00000000-0000-0000-0000-000000000000', 86, 'cnacctevblso', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 16:53:45.719665+00', '2026-02-08 16:53:45.719665+00', NULL, '266bfdd5-6023-4d0f-8d1d-9213ea55918b'),
	('00000000-0000-0000-0000-000000000000', 87, 'j6etm2vwpwju', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-08 16:55:53.827168+00', '2026-02-08 16:55:53.827168+00', NULL, '20abea5c-573e-4fbf-9367-3c818076a4ed'),
	('00000000-0000-0000-0000-000000000000', 88, 'bd5znwfyvfww', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 16:56:13.630424+00', '2026-02-08 16:56:13.630424+00', NULL, 'b52cac85-fd39-4c3e-9869-e8c4f7a9660d'),
	('00000000-0000-0000-0000-000000000000', 89, 'tw3jpgyrropr', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 17:00:11.754143+00', '2026-02-08 17:00:11.754143+00', NULL, '47d1ac58-05c7-45ca-88ff-a59cc37a4580'),
	('00000000-0000-0000-0000-000000000000', 90, 'f2zdkngewgos', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-08 17:04:46.238483+00', '2026-02-08 17:04:46.238483+00', NULL, '14b18657-59e2-4ead-afdc-9c695c1292dd'),
	('00000000-0000-0000-0000-000000000000', 91, 'jswiflv7m7fo', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 17:04:59.765819+00', '2026-02-08 18:34:49.019276+00', NULL, '93a47c4a-e5fb-4512-a6ef-a25b91a1893f'),
	('00000000-0000-0000-0000-000000000000', 92, 'orztg75igrdr', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-08 18:34:49.049301+00', '2026-02-09 02:31:56.432526+00', 'jswiflv7m7fo', '93a47c4a-e5fb-4512-a6ef-a25b91a1893f'),
	('00000000-0000-0000-0000-000000000000', 93, 'm2z2qeu63mze', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-09 02:31:56.461698+00', '2026-02-09 02:31:56.461698+00', 'orztg75igrdr', '93a47c4a-e5fb-4512-a6ef-a25b91a1893f'),
	('00000000-0000-0000-0000-000000000000', 94, 'r4m3r5yf46tb', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-09 02:32:11.693223+00', '2026-02-09 03:30:39.934073+00', NULL, '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 95, 'ie554l77yoy2', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-09 03:30:39.955586+00', '2026-02-09 05:06:44.470676+00', 'r4m3r5yf46tb', '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 96, 'h6a2cfluwgcq', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-09 05:06:44.503068+00', '2026-02-09 06:05:22.717456+00', 'ie554l77yoy2', '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 97, 'gbzuddhyzi5y', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-09 06:05:22.733372+00', '2026-02-09 07:12:56.773579+00', 'h6a2cfluwgcq', '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 98, 'apqvn4xj5nm4', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-09 07:12:56.797158+00', '2026-02-09 09:27:04.72229+00', 'gbzuddhyzi5y', '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 99, 'iguj7oduikxu', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-09 09:27:04.74012+00', '2026-02-11 10:23:35.858878+00', 'apqvn4xj5nm4', '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 100, 'yt2hjo46lr7s', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-11 10:23:35.885622+00', '2026-02-11 10:23:35.885622+00', 'iguj7oduikxu', '1bc97ed3-9cbe-4bb7-b95f-e76463d1e693'),
	('00000000-0000-0000-0000-000000000000', 101, 'nbnuoxr53t7m', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-11 10:23:50.688812+00', '2026-02-11 10:23:50.688812+00', NULL, 'aed65973-4d9b-4a6a-b3d1-033751e4a260'),
	('00000000-0000-0000-0000-000000000000', 102, '4p3xobprbvrj', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-11 10:25:18.736138+00', '2026-02-11 10:25:18.736138+00', NULL, '4ef9e0b9-d7a6-431c-a3ce-b223f6a7423e'),
	('00000000-0000-0000-0000-000000000000', 103, 'cvguhz3ez5vj', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-11 10:29:05.818879+00', '2026-02-11 10:29:05.818879+00', NULL, 'c50540c8-184f-4792-8210-99cc2daa4e63'),
	('00000000-0000-0000-0000-000000000000', 104, 'enqjdjrajzhg', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-14 15:48:25.733157+00', '2026-02-14 15:48:25.733157+00', NULL, 'd379ac86-1b1f-4f3a-9097-bfecc6ce0f44'),
	('00000000-0000-0000-0000-000000000000', 105, 'pdweztv33qqw', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-14 15:49:20.551333+00', '2026-02-14 15:49:20.551333+00', NULL, 'ec869877-099e-4d90-b044-72286fc883df'),
	('00000000-0000-0000-0000-000000000000', 106, '4il56qb45fqo', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-20 03:28:13.287383+00', '2026-02-20 05:39:10.365512+00', NULL, '15744b98-fffc-4bc9-9fe4-5c61fae1ae6b'),
	('00000000-0000-0000-0000-000000000000', 107, 'dnqmwp4sxrhs', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-20 05:39:10.391833+00', '2026-02-20 05:39:10.391833+00', '4il56qb45fqo', '15744b98-fffc-4bc9-9fe4-5c61fae1ae6b'),
	('00000000-0000-0000-0000-000000000000', 108, 'l6vjaojvglea', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', true, '2026-02-25 04:12:38.04109+00', '2026-02-25 11:01:52.071897+00', NULL, 'c70bda9a-f67f-40cc-af58-6d89790eb047'),
	('00000000-0000-0000-0000-000000000000', 109, 'dujsia6iui3o', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-02-25 11:01:52.104214+00', '2026-02-25 11:01:52.104214+00', 'l6vjaojvglea', 'c70bda9a-f67f-40cc-af58-6d89790eb047'),
	('00000000-0000-0000-0000-000000000000', 110, '3tipbiuhadi6', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-02-25 11:02:06.089716+00', '2026-02-25 11:02:06.089716+00', NULL, '7d13cb38-c7a7-4eec-aa74-817dc539fc96'),
	('00000000-0000-0000-0000-000000000000', 111, 'ucy7vzsonl7w', '5ec43539-08cd-4269-9523-58eb0923277c', true, '2026-03-03 13:16:15.214114+00', '2026-03-03 14:28:27.388245+00', NULL, '37aa0575-fc76-4618-b4b8-a5086b1ad67d'),
	('00000000-0000-0000-0000-000000000000', 112, 'csb6xkusjldo', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-03-03 14:28:27.414661+00', '2026-03-03 14:28:27.414661+00', 'ucy7vzsonl7w', '37aa0575-fc76-4618-b4b8-a5086b1ad67d'),
	('00000000-0000-0000-0000-000000000000', 113, 'ale2f7mwmbqp', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-03-03 14:39:18.78932+00', '2026-03-03 14:39:18.78932+00', 'ccn67o64uk5w', '2fc0ea72-b0be-490c-89a0-74fa7dbee4be'),
	('00000000-0000-0000-0000-000000000000', 114, 'pwbfhhnr7uxd', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-03-03 14:39:35.716391+00', '2026-03-03 14:39:35.716391+00', NULL, 'a3b50dfb-5a37-4a7c-ad74-6dfce1af6ab7'),
	('00000000-0000-0000-0000-000000000000', 115, '3lskggs76xhg', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-03-03 14:41:53.271556+00', '2026-03-03 14:41:53.271556+00', NULL, 'c6d2a7d5-4ea9-42a6-b2eb-476ee9c110aa'),
	('00000000-0000-0000-0000-000000000000', 116, '3m3tvxie4ir7', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', false, '2026-03-03 14:42:03.827436+00', '2026-03-03 14:42:03.827436+00', NULL, 'f97c939c-467f-462f-be09-d6e563689d08'),
	('00000000-0000-0000-0000-000000000000', 117, 'klvgwrpg3dz5', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-03-03 14:42:37.541432+00', '2026-03-03 14:42:37.541432+00', NULL, 'ce488bdf-0a91-40c8-8eee-25fa124a7982'),
	('00000000-0000-0000-0000-000000000000', 118, 'mdq7t5uhcbia', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-03-03 14:45:12.277733+00', '2026-03-03 14:45:12.277733+00', NULL, '71b7a204-73c9-4aec-a4a0-8fbbcc6263ed'),
	('00000000-0000-0000-0000-000000000000', 119, 'n3aqjick56yg', '5ec43539-08cd-4269-9523-58eb0923277c', false, '2026-03-03 15:17:50.15089+00', '2026-03-03 15:17:50.15089+00', NULL, 'e4d58a5c-43e9-43b1-8790-59eb046042ab');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cart" ("id", "product_id", "qty", "created_at", "user_id") VALUES
	(2, '3', 1, '2026-02-04 06:18:08.694291+00', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709'),
	(6, '7', 1, '2026-02-05 06:34:49.591002+00', '7329a315-b0f2-47c8-ac6e-005a8188a7f8'),
	(7, '2', 5, '2026-02-07 04:58:21.496007+00', '7329a315-b0f2-47c8-ac6e-005a8188a7f8'),
	(8, '1', 5, '2026-02-08 08:51:28.261906+00', '7329a315-b0f2-47c8-ac6e-005a8188a7f8'),
	(9, '26', 3, '2026-02-14 15:50:44.248487+00', '5ec43539-08cd-4269-9523-58eb0923277c');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "u_name", "u_surname", "u_email", "u_tel", "u_district", "u_type", "u_notify", "created_at", "u_avatar", "u_role") VALUES
	('da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Chamoda kavishka', 'hapuarachchi', 'chamodakavishka03@gmail.com', '+94740306413', 'Gampaha', 'Farmer', false, '2026-02-04 04:56:11.938974+00', 'https://bit.ly/broken-link', 'user'),
	('7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'Chamoda ', 'Madhushanka', 'chamoda@gmail.com', '+94778339120', NULL, NULL, false, '2026-02-04 06:54:53.040455+00', NULL, 'admin'),
	('5ec43539-08cd-4269-9523-58eb0923277c', 'samitha', 'hapuarachchi', 'samitha@gmail.com', '+94740306413', NULL, NULL, false, '2026-02-08 14:25:21.057789+00', NULL, 'user');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "user_id", "content", "image", "created_at") VALUES
	(1, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Successfully harvested 50kg of Carrots today! The organic fertilizer mix really worked wonders this season. 🥕🚜 #OrganicFarming #Harvest', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80', '2026-02-04 06:52:54.352403+00'),
	(2, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Does anyone know the current wholesale price for Green Chillies in Dambulla market? Planning to transport my stock tomorrow.', NULL, '2026-02-04 06:52:54.352403+00'),
	(3, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'I have 200kg of Red Onions available for immediate sale. Located in Anuradhapura. DM me for prices! 🧅', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', '2026-02-04 06:52:54.352403+00'),
	(4, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'My tomato plants are showing yellow spots on leaves. Is this a fungal infection? Any recommended organic remedies? 🍅❓', 'https://images.unsplash.com/photo-1591857177580-dc82b9e4e119?auto=format&fit=crop&w=800&q=80', '2026-02-04 06:52:54.352403+00'),
	(5, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Heavy rains expected in the Uva province this week. Make sure to clear your drainage canals to prevent waterlogging!', NULL, '2026-02-04 06:52:54.352403+00'),
	(6, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Just bought a new water pump for the paddy field. Hoping this speeds up the irrigation process. 💧🚜', 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80', '2026-02-04 06:52:54.352403+00'),
	(7, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Finally received my GAP (Good Agricultural Practices) certification! A big step forward for export quality veggies. 📜✅', NULL, '2026-02-04 06:52:54.352403+00'),
	(8, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Fresh Papayas for sale! Sweet and naturally ripened. Wholesale inquiries welcome. 🥭', 'https://images.unsplash.com/photo-1517282009959-f000ec3b5d24?auto=format&fit=crop&w=800&q=80', '2026-02-04 06:52:54.352403+00'),
	(9, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Big thanks to the local agrarian officer for the workshop on pest control today. Learned a lot!', NULL, '2026-02-04 06:52:54.352403+00'),
	(10, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Nothing beats a cup of tea in the middle of the field after a hard morning work. ☕🌄', 'https://images.unsplash.com/photo-1544965838-54ef8406f868?auto=format&fit=crop&w=800&q=80', '2026-02-04 06:52:54.352403+00'),
	(13, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'hehe . it works', 'https://hwgpwjprnpnwbxbbujzz.supabase.co/storage/v1/object/public/posts/7329a315-b0f2-47c8-ac6e-005a8188a7f8-1770189581806.jpg', '2026-02-04 07:19:47.044468+00'),
	(11, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'yoww', NULL, '2026-02-04 07:17:51.16699+00'),
	(16, '5ec43539-08cd-4269-9523-58eb0923277c', 'my post ', NULL, '2026-02-14 15:50:13.34829+00');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."comments" ("id", "user_id", "post_id", "content", "created_at") VALUES
	(1, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 1, 'wow. nice', '2026-02-04 06:58:26.651401+00'),
	(2, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 13, 'hnhn', '2026-02-04 08:45:54.463141+00'),
	(3, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 13, 'jjj', '2026-02-04 08:46:00.420908+00'),
	(4, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 13, 'oakjy', '2026-02-07 04:59:14.082182+00');


--
-- Data for Name: crop_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."crop_registrations" ("id", "user_id", "crop_name", "planting_date", "harvest_date", "land_size_acres", "status", "created_at") VALUES
	(1, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-19', '2026-05-19', 1, 'approved', '2026-02-04 09:29:27.077781+00'),
	(2, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-19', '2026-05-19', 1, 'approved', '2026-02-04 09:31:41.362695+00'),
	(3, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-18', '2026-05-18', 1, 'approved', '2026-02-04 09:33:43.300992+00'),
	(4, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-21', '2026-05-21', 1, 'approved', '2026-02-04 09:33:47.761096+00'),
	(5, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-22', '2026-05-22', 1, 'approved', '2026-02-04 09:33:51.268675+00'),
	(6, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-07', '2026-05-07', 1, 'approved', '2026-02-04 09:33:54.673397+00'),
	(7, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-15', '2026-05-15', 1, 'approved', '2026-02-04 09:33:58.52964+00'),
	(8, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-13', '2026-05-13', 1, 'approved', '2026-02-04 09:34:01.94155+00'),
	(9, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-01', '2026-05-01', 1, 'approved', '2026-02-04 09:34:50.968848+00'),
	(10, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-06', '2026-05-06', 1, 'approved', '2026-02-04 09:34:54.18845+00'),
	(11, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-17', '2026-05-17', 1, 'approved', '2026-02-04 09:36:33.018938+00'),
	(12, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-02-17', '2026-05-17', 1, 'approved', '2026-02-04 09:37:48.479717+00'),
	(13, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-03-06', '2026-06-06', 1, 'approved', '2026-02-04 09:37:54.69659+00'),
	(14, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 'Carrot', '2026-03-11', '2026-06-11', 1, 'approved', '2026-02-04 09:38:07.3598+00');


--
-- Data for Name: farmer_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."farmer_registrations" ("id", "farmer_id", "crop_name", "amount_mt", "registered_at") VALUES
	(1, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'CARROT', 20, '2026-02-05 10:32:51.931095+00'),
	(2, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'CARROT', 100000, '2026-02-05 10:33:56.661742+00'),
	(3, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'CARROT', 45000, '2026-02-05 10:34:05.258889+00'),
	(4, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'CARROT', 1000, '2026-02-05 10:34:27.86413+00'),
	(5, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'CARROT', 12, '2026-02-05 11:40:30.728978+00'),
	(6, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 'LEEKS', 20000, '2026-02-07 04:57:02.268062+00');


--
-- Data for Name: national_targets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."national_targets" ("id", "crop_name", "target_limit_mt", "year", "month", "updated_at") VALUES
	(1, 'CARROT', 149000, 2026, 4, '2026-02-05 10:26:18.720347+00'),
	(2, 'BEANS', 50000, 2026, 4, '2026-02-05 10:26:18.720347+00'),
	(3, 'LEEKS', 60000, 2026, 4, '2026-02-05 10:26:18.720347+00'),
	(4, 'CABBAGE', 80000, 2026, 4, '2026-02-05 10:26:18.720347+00');


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."news" ("n_id", "n_img", "n_title", "n_description", "n_type", "created_at", "n_author") VALUES
	(1, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300&h=200', 'New Sustainable Farming Initiative Launched', 'The Ministry of Agriculture has announced a new subsidy plan for farmers adopting organic practices. This initiative aims to reduce chemical usage by 40% over the next five years while ensuring soil health.', 'Policy', '2026-01-30 18:00:24.312135+00', 'Ministry of Agri'),
	(2, 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=300&h=200', 'Top 5 Tools Every Modern Farmer Needs', 'From automated irrigation systems to drone monitoring, technology is changing the landscape of farming. We explore the most essential tools that can increase your yield this season.', 'Technology', '2026-01-30 18:00:24.312135+00', 'Tech Farm Weekly'),
	(3, 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=300&h=200', 'Weather Alert: Heavy Rains Expected', 'Meteorologists predict heavy rainfall across the western province starting next week. Farmers are advised to clear drainage systems and protect sensitive seedlings immediately.', 'Alert', '2026-01-30 18:00:24.312135+00', 'Weather Center'),
	(7, 'https://hwgpwjprnpnwbxbbujzz.supabase.co/storage/v1/object/public/news/news-1770578133137.png', 'new title', 'vffvfvf', 'General', '2026-02-08 19:15:36.473805+00', '');


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."post_likes" ("id", "user_id", "post_id", "created_at") VALUES
	(1, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 1, '2026-02-04 06:58:29.036331+00'),
	(6, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 2, '2026-02-04 06:58:38.773643+00'),
	(8, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 2, '2026-02-04 07:00:23.771623+00'),
	(11, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 1, '2026-02-04 07:05:05.479316+00'),
	(12, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 3, '2026-02-04 07:05:09.088571+00'),
	(16, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 11, '2026-02-04 08:46:07.282418+00'),
	(17, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 13, '2026-02-04 08:46:14.969441+00');


--
-- Data for Name: production_limits; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."production_limits" ("id", "crop_name", "harvest_month", "max_farmers") VALUES
	(1, 'Carrot', 6, 5),
	(2, 'Beans', 5, 20),
	(3, 'Pumpkin', 7, 15);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "created_at", "name", "weight", "price", "type", "stock", "image", "category", "images", "description") VALUES
	(6, '2026-01-26 13:42:17.809228+00', 'Pumpkin (Wattakka)', '20g', 220, 'Fast Growth', '15', NULL, 'Vegetable', NULL, NULL),
	(7, '2026-01-26 13:42:17.809228+00', 'Cabbage', '10g', 190, 'High Yield', '60', NULL, 'Vegetable', NULL, NULL),
	(9, '2026-01-26 13:42:17.809228+00', 'Bitter Gourd (Karawila)', '15g', 210, 'Fast Growth', '30', NULL, 'Vegetable', NULL, NULL),
	(10, '2026-01-26 13:42:17.809228+00', 'Green Chillies', '5g', 130, 'High Yield', '100', NULL, 'Vegetable', NULL, NULL),
	(11, '2026-01-26 13:42:17.809228+00', 'Mammoty (Heavy Duty)', '1.5kg', 2500, 'Standard', '10', NULL, 'Tool', NULL, NULL),
	(12, '2026-01-26 13:42:17.809228+00', 'Hand Hoe', '500g', 850, 'Standard', '20', NULL, 'Tool', NULL, NULL),
	(13, '2026-01-26 13:42:17.809228+00', 'Knapsack Sprayer (16L)', '3kg', 4500, 'Manual', '5', NULL, 'Tool', NULL, NULL),
	(14, '2026-01-26 13:42:17.809228+00', 'Pruning Shears', '300g', 1200, 'Stainless Steel', '15', NULL, 'Tool', NULL, NULL),
	(15, '2026-01-26 13:42:17.809228+00', 'Watering Can', '1kg', 950, 'Plastic', '30', NULL, 'Tool', NULL, NULL),
	(16, '2026-01-26 13:42:17.809228+00', 'Hand Fork', '250g', 600, 'Standard', '25', NULL, 'Tool', NULL, NULL),
	(18, '2026-01-26 13:42:17.809228+00', 'Garden Rake', '1kg', 1500, 'Standard', '12', NULL, 'Tool', NULL, NULL),
	(19, '2026-01-26 13:42:17.809228+00', 'Sickle', '400g', 550, 'Steel', '50', NULL, 'Tool', NULL, NULL),
	(20, '2026-01-26 13:42:17.809228+00', 'Garden Trowel', '200g', 450, 'Standard', '40', NULL, 'Tool', NULL, NULL),
	(2, '2026-01-26 13:42:17.809228+00', 'Carrot (Nuwara Eliya)', '5g', 200, 'Organic', '20', '', 'Vegetable', NULL, ''),
	(1, '2026-01-26 13:42:17.809228+00', 'Beans (Green)', '10g', 150, 'High Yield', '30', '', 'Vegetable', NULL, ''),
	(22, '2026-02-08 17:30:24.411183+00', 'Beans (Green)', NULL, 100, 'seeds', '70', 'https://hwgpwjprnpnwbxbbujzz.supabase.co/storage/v1/object/public/products/1770571820999-lfhm97dyt1g.png', NULL, NULL, 'xxa'),
	(26, '2026-02-11 10:24:29.868657+00', 'Beans (red)', NULL, 160, 'seeds', '20', 'https://hwgpwjprnpnwbxbbujzz.supabase.co/storage/v1/object/public/products/1770805468590.png', NULL, NULL, '');


--
-- Data for Name: saved_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."saved_posts" ("id", "user_id", "post_id", "created_at") VALUES
	(2, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 2, '2026-02-04 07:02:54.983125+00'),
	(3, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 3, '2026-02-04 07:28:02.609232+00'),
	(4, 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', 13, '2026-02-04 07:28:19.962372+00'),
	(7, '7329a315-b0f2-47c8-ac6e-005a8188a7f8', 11, '2026-02-07 05:26:21.523712+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('posts', 'posts', NULL, '2026-02-04 07:13:18.197597+00', '2026-02-04 07:13:18.197597+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('products', 'products', NULL, '2026-02-08 17:14:04.996838+00', '2026-02-08 17:14:04.996838+00', true, false, 1048576, '{image/*}', NULL, 'STANDARD'),
	('news', 'news', NULL, '2026-02-08 18:57:52.925059+00', '2026-02-08 18:57:52.925059+00', true, false, 1048576, '{image/*}', NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('740f3b82-b6e4-49ae-873d-585c0d735624', 'posts', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709-1770189481496.png', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '2026-02-04 07:18:06.609039+00', '2026-02-04 07:18:06.609039+00', '2026-02-04 07:18:06.609039+00', '{"eTag": "\"aa45c6b28d16e543047bbeedf29a5525\"", "size": 2691050, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-04T07:18:07.000Z", "contentLength": 2691050, "httpStatusCode": 200}', 'd0657e18-4e3f-48ec-baf3-ef8b27fc6bb6', 'da95fff7-a8f4-48e2-b9d4-4e6bd0817709', '{}'),
	('ac7d07b8-4096-4a36-a4d8-6ddd40245963', 'posts', '7329a315-b0f2-47c8-ac6e-005a8188a7f8-1770189581806.jpg', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-04 07:19:46.745269+00', '2026-02-04 07:19:46.745269+00', '2026-02-04 07:19:46.745269+00', '{"eTag": "\"e7bbc91e9ea7f7bed614a252a76f071b\"", "size": 2090237, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-02-04T07:19:47.000Z", "contentLength": 2090237, "httpStatusCode": 200}', '926e7f88-009b-4086-89fe-5111e89fdbf5', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('4d86adc3-eee3-444c-bea4-c2acff12b7bb', 'products', '.emptyFolderPlaceholder', NULL, '2026-02-08 17:23:40.345288+00', '2026-02-08 17:23:40.345288+00', '2026-02-08 17:23:40.345288+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T17:23:40.347Z", "contentLength": 0, "httpStatusCode": 200}', 'ed9a0520-d08a-4e2a-834b-763d3c098e46', NULL, '{}'),
	('cc201785-ec84-4048-9fa6-07ac29d22e78', 'products', '1770571820999-lfhm97dyt1g.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 17:30:24.166261+00', '2026-02-08 17:30:24.166261+00', '2026-02-08 17:30:24.166261+00', '{"eTag": "\"7b054a54368c7f2f8d533d088dc30187\"", "size": 22522, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T17:30:25.000Z", "contentLength": 22522, "httpStatusCode": 200}', 'dd863030-93c3-42de-9dec-d211a629827b', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('5b177a93-72fb-46d1-9051-f674112d6e04', 'products', '1770571957347.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 17:32:40.971156+00', '2026-02-08 17:32:40.971156+00', '2026-02-08 17:32:40.971156+00', '{"eTag": "\"4aa9fa3ddca453c37a38224698c97ec4\"", "size": 737433, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T17:32:41.000Z", "contentLength": 737433, "httpStatusCode": 200}', '73c71485-f411-4066-a82f-030fce6f2577', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('0aa240ae-358c-4165-960d-990f75636ad2', 'news', 'news-1770577111578.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 18:58:35.943105+00', '2026-02-08 18:58:35.943105+00', '2026-02-08 18:58:35.943105+00', '{"eTag": "\"3a4d2c4e728c3b7a5b594883c9e40421\"", "size": 361254, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T18:58:36.000Z", "contentLength": 361254, "httpStatusCode": 200}', '9551c5ff-1a96-4cb3-aec0-8f035052ebb2', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('2e4b84c7-fa72-4279-acee-a821948a9cd0', 'news', 'news-1770577256124.avif', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 19:00:59.224087+00', '2026-02-08 19:00:59.224087+00', '2026-02-08 19:00:59.224087+00', '{"eTag": "\"a8cc8a4cdcfdf26113956a87c348859b\"", "size": 16677, "mimetype": "image/avif", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T19:01:00.000Z", "contentLength": 16677, "httpStatusCode": 200}', '58ff1928-9809-4cdd-ab54-4bb52aee64a7', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('2fc2cd41-af92-46a0-af02-c101f4a2f014', 'news', 'news-1770577264218.avif', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 19:01:07.025074+00', '2026-02-08 19:01:07.025074+00', '2026-02-08 19:01:07.025074+00', '{"eTag": "\"a8cc8a4cdcfdf26113956a87c348859b\"", "size": 16677, "mimetype": "image/avif", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T19:01:07.000Z", "contentLength": 16677, "httpStatusCode": 200}', 'c94b1c7e-27ed-45a0-b0ff-4139e0102027', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('9e0b8702-e40a-44b2-b1e1-414fe46d11c9', 'news', 'news-1770577499375.jpg', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 19:05:02.676497+00', '2026-02-08 19:05:02.676497+00', '2026-02-08 19:05:02.676497+00', '{"eTag": "\"96e3ca539f15b2cd308477352355705f\"", "size": 9892, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T19:05:03.000Z", "contentLength": 9892, "httpStatusCode": 200}', '86e20846-dda6-4d72-b81f-e8719702dd99', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('bc1400fe-371b-4600-ad9a-b5f54cb116f0', 'news', 'news-1770577704949.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 19:08:28.349046+00', '2026-02-08 19:08:28.349046+00', '2026-02-08 19:08:28.349046+00', '{"eTag": "\"cc8924f4ae870752a1328b7b0fdcba9b\"", "size": 61045, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T19:08:29.000Z", "contentLength": 61045, "httpStatusCode": 200}', 'e2e03c15-b981-4aa0-8207-80883bdcfec8', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('096b4339-03be-4402-b18b-965475fb003f', 'news', 'news-1770578133137.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-08 19:15:36.245819+00', '2026-02-08 19:15:36.245819+00', '2026-02-08 19:15:36.245819+00', '{"eTag": "\"a2ba7e151649ae2adcaf6eba12330527\"", "size": 118481, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-08T19:15:37.000Z", "contentLength": 118481, "httpStatusCode": 200}', '73bd0b1c-3c63-4636-ba3b-c6dd4f65c526', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('4e2e61ed-6a67-4040-b644-63a6fec53d4f', 'posts', '7329a315-b0f2-47c8-ac6e-005a8188a7f8-1770605846746.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-09 02:57:31.86251+00', '2026-02-09 02:57:31.86251+00', '2026-02-09 02:57:31.86251+00', '{"eTag": "\"a42ffc25115846cc70cdb76d6dca9d6d\"", "size": 1214423, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-09T02:57:32.000Z", "contentLength": 1214423, "httpStatusCode": 200}', '02947cc3-a5f6-44ed-a166-7fdc8f5cbf73', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}'),
	('cde7422c-71c5-4080-ba67-a895aa25fb07', 'products', '1770805468590.png', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '2026-02-11 10:24:29.459018+00', '2026-02-11 10:24:29.459018+00', '2026-02-11 10:24:29.459018+00', '{"eTag": "\"3a4d2c4e728c3b7a5b594883c9e40421\"", "size": 361254, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-02-11T10:24:30.000Z", "contentLength": 361254, "httpStatusCode": 200}', '94d2b780-ab8e-4323-a710-d9f979607c99', '7329a315-b0f2-47c8-ac6e-005a8188a7f8', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 119, true);


--
-- Name: cart_c_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."cart_c_id_seq"', 9, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."comments_id_seq"', 4, true);


--
-- Name: crop_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."crop_registrations_id_seq"', 14, true);


--
-- Name: farmer_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."farmer_registrations_id_seq"', 6, true);


--
-- Name: national_targets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."national_targets_id_seq"', 4, true);


--
-- Name: news_n_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."news_n_id_seq"', 7, true);


--
-- Name: post_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_likes_id_seq"', 18, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_id_seq"', 16, true);


--
-- Name: production_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."production_limits_id_seq"', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 26, true);


--
-- Name: saved_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."saved_posts_id_seq"', 7, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict uAIIDGnW1bMgtYglmdZJEXytcukxGgVnn4wPMjlszmOjtpwclackFIEFAb3AFj3

RESET ALL;
