--
-- PostgreSQL database dump
--

\restrict ZPrt7IY6wAOB0YJ8R70x0yZfMVBBpFyTdxKJN2oM1sKp3WEobEutAtXtm9sISwT

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: asset_depreciation_depreciation_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_depreciation_method_enum AS ENUM (
    'STRAIGHT_LINE',
    'ACCELERATED'
);


ALTER TYPE public.asset_depreciation_depreciation_method_enum OWNER TO postgres;

--
-- Name: asset_depreciation_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_frequency_enum AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'ANNUAL'
);


ALTER TYPE public.asset_depreciation_frequency_enum OWNER TO postgres;

--
-- Name: asset_depreciation_useful_life_unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_useful_life_unit_enum AS ENUM (
    'MONTHS',
    'YEARS'
);


ALTER TYPE public.asset_depreciation_useful_life_unit_enum OWNER TO postgres;

--
-- Name: asset_transactions_fromstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_transactions_fromstatus_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.asset_transactions_fromstatus_enum OWNER TO postgres;

--
-- Name: asset_transactions_tostatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_transactions_tostatus_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.asset_transactions_tostatus_enum OWNER TO postgres;

--
-- Name: asset_transactions_transactiontype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_transactions_transactiontype_enum AS ENUM (
    'purchase',
    'donation',
    'make_available',
    'direct_issuance',
    'request_issuance',
    'approve_issuance',
    'reject_issuance',
    'return_to_inventory',
    'request_repair',
    'return_for_repair',
    'send_to_repair',
    'complete_repair',
    'fail_repair',
    'request_disposal',
    'approve_disposal',
    'deprecate',
    'request_transfer',
    'approve_transfer',
    'reject_transfer',
    'report_lost',
    'report_stolen',
    'mark_recovered',
    'status_correction',
    'location_update'
);


ALTER TYPE public.asset_transactions_transactiontype_enum OWNER TO postgres;

--
-- Name: assets_inventory_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assets_inventory_status_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.assets_inventory_status_enum OWNER TO postgres;

--
-- Name: inventory_status_from_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_status_from_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.inventory_status_from_enum OWNER TO postgres;

--
-- Name: inventory_status_to_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_status_to_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.inventory_status_to_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    performed_by uuid,
    before jsonb,
    after jsonb,
    action text NOT NULL,
    "transactionId" text,
    title text,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "audit_logs_createdAt_not_null" NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "audit_logs_updatedAt_not_null" NOT NULL,
    version integer
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: auth_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_logs (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid NOT NULL,
    "ipAddress" character varying(64),
    device text,
    timestamptz timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" uuid,
    version integer
);


ALTER TABLE public.auth_logs OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    employee_id character varying(20) NOT NULL,
    first_name character varying NOT NULL,
    middle_name character varying,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    contact_number character varying(20) NOT NULL,
    "position" character varying(50) NOT NULL,
    department character varying(50) NOT NULL,
    is_verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    title text,
    description text,
    url_params character varying,
    actions text NOT NULL,
    status text NOT NULL,
    author uuid,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "notifications_createdAt_not_null" NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "notifications_updatedAt_not_null" NOT NULL,
    version integer
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    permission character varying NOT NULL,
    description character varying DEFAULT 'No description provided'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    version integer NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    role character varying NOT NULL,
    description character varying DEFAULT 'No description provided'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    version integer NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    "ipAddress" character varying(64),
    device text,
    "userId" uuid,
    "expiresAt" timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "sessions_createdAt_not_null" NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "sessions_updatedAt_not_null" NOT NULL,
    version integer
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "permissionId" uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    version integer NOT NULL,
    deleted_at timestamp without time zone,
    user_id uuid,
    permission_id uuid
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    full_name character varying NOT NULL,
    user_name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    failed_attempts integer DEFAULT 0 NOT NULL,
    version integer,
    role_id uuid,
    profile_image text,
    pass_key character varying,
    access json,
    lockout_until timestamp with time zone,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "users_createdAt_not_null" NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "users_updatedAt_not_null" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, performed_by, before, after, action, "transactionId", title, deleted_at, created_at, updated_at, version) FROM stdin;
019b00e4-f30a-712b-9a69-e6cef54447ed	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019b00e4-f2fe-73ee-9b1d-18d9fb4a0369", "email": "researcher.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-1b25-7418-92d2-acbc60408ec1", "role": "Researcher", "version": 2, "createdAt": "2025-12-09T01:33:37.445Z", "deletedAt": null, "updatedAt": "2025-12-09T01:33:54.301Z", "description": "The Researcher analyzes collected water-quality data to identify patterns and evaluate system performance. They use these insights to support experiments, improve monitoring strategies, and enhance fish health outcomes."}, "passKey": "$2b$10$wIQc6JXWFLW.oGAN8sQCzeNoWnOpXM3YxRv3QDztJ84JvEHr3BoZe", "version": 1, "fullname": "Researcher Demo", "password": "$2b$10$F2rFpIAywkhYQcGagBNYfeM0fOEv0SqZBW7bfAWd3R7XhQ6qG5OTy", "username": "@researcher", "createdAt": "2025-12-09T02:16:03.071Z", "deletedAt": null, "updatedAt": "2025-12-09T02:16:03.071Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019b00e4-f2fe-73ee-9b1d-18d9fb4a0369", "email": "researcher.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-1b25-7418-92d2-acbc60408ec1", "role": "Researcher", "version": 2, "createdAt": "2025-12-09T01:33:37.445Z", "deletedAt": null, "updatedAt": "2025-12-09T01:33:54.301Z", "description": "The Researcher analyzes collected water-quality data to identify patterns and evaluate system performance. They use these insights to support experiments, improve monitoring strategies, and enhance fish health outcomes."}, "passKey": "$2b$10$wIQc6JXWFLW.oGAN8sQCzeNoWnOpXM3YxRv3QDztJ84JvEHr3BoZe", "version": 1, "fullname": "Researcher Demo", "password": "$2b$10$F2rFpIAywkhYQcGagBNYfeM0fOEv0SqZBW7bfAWd3R7XhQ6qG5OTy", "username": "@researcher", "createdAt": "2025-12-09T02:16:03.071Z", "deletedAt": null, "updatedAt": "2025-12-09T02:16:03.071Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	User Account Created Researcher Demo	\N	2025-12-09 10:16:03.086371+08	2025-12-09 10:16:03.086371+08	1
019b00e6-f2af-71d8-b539-7ff53c471942	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	UPDATE	TX_USER-01997ac6-c5bb-7589-b79f-a6509ea5d44a	User Account UPDATED System Administrator	\N	2025-12-09 10:18:14.066816+08	2025-12-09 10:18:14.066816+08	1
019b00e8-7117-7606-b4a5-a9633cdf701e	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019b00e8-7114-74bf-8954-5de6625c4e52", "email": "fishpondoperator.demo@mail.com", "access": ["/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-a6c6-719c-9be8-8f44f0fca0ec", "role": "Fishpond-Operator", "version": 1, "createdAt": "2025-12-09T01:34:13.191Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:13.191Z", "description": "The Fishpond Operator manages daily pond activities and monitors real-time sensor data. They respond to alerts, maintain equipment, and ensure stable conditions for the fish."}, "passKey": "$2b$10$coBEiEA7OoWaPjTFo7zuNuoUHu8v/xr6lnTLjEjlVRp8gfCgU6gXK", "version": 1, "fullname": "Fish Pond Operator Demo", "password": "$2b$10$ZwrRv.jBBU39ieF580tPFOuLX52SBcIlTCABfkm7VAQthm9QAeGjK", "username": "@fishpondoperator", "createdAt": "2025-12-09T02:19:51.956Z", "deletedAt": null, "updatedAt": "2025-12-09T02:19:51.956Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019b00e8-7114-74bf-8954-5de6625c4e52", "email": "fishpondoperator.demo@mail.com", "access": ["/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-a6c6-719c-9be8-8f44f0fca0ec", "role": "Fishpond-Operator", "version": 1, "createdAt": "2025-12-09T01:34:13.191Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:13.191Z", "description": "The Fishpond Operator manages daily pond activities and monitors real-time sensor data. They respond to alerts, maintain equipment, and ensure stable conditions for the fish."}, "passKey": "$2b$10$coBEiEA7OoWaPjTFo7zuNuoUHu8v/xr6lnTLjEjlVRp8gfCgU6gXK", "version": 1, "fullname": "Fish Pond Operator Demo", "password": "$2b$10$ZwrRv.jBBU39ieF580tPFOuLX52SBcIlTCABfkm7VAQthm9QAeGjK", "username": "@fishpondoperator", "createdAt": "2025-12-09T02:19:51.956Z", "deletedAt": null, "updatedAt": "2025-12-09T02:19:51.956Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019b00e8-7114-74bf-8954-5de6625c4e52	User Account Created Fish Pond Operator Demo	\N	2025-12-09 10:19:51.962555+08	2025-12-09 10:19:51.962555+08	1
019b00e9-f624-7059-aa50-e6588509bdec	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019b00e9-f61f-73d9-b02a-e882acf17983", "email": "monitoringmanager.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-e1a0-77d8-bbc9-e433652a09de", "role": "Monitoring-Manager", "version": 1, "createdAt": "2025-12-09T01:34:28.256Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:28.256Z", "description": "The Monitoring Manager oversees overall system status through dashboards and historical reports. They use trends and analytics to guide decisions and coordinate actions with operators and researchers."}, "passKey": "$2b$10$dYjYt1sbGUNHYP38TAOuRO9f0Qw8LomwTR98bvHEiZA0sNFkm2J0C", "version": 1, "fullname": "Monitoring Manager", "password": "$2b$10$xvKr.5.5rmrDewDRysNWduNk/zijgEAtN/pL5XG/dhT05QS38tb4K", "username": "@monitoringmanager", "createdAt": "2025-12-09T02:21:31.552Z", "deletedAt": null, "updatedAt": "2025-12-09T02:21:31.552Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019b00e9-f61f-73d9-b02a-e882acf17983", "email": "monitoringmanager.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-e1a0-77d8-bbc9-e433652a09de", "role": "Monitoring-Manager", "version": 1, "createdAt": "2025-12-09T01:34:28.256Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:28.256Z", "description": "The Monitoring Manager oversees overall system status through dashboards and historical reports. They use trends and analytics to guide decisions and coordinate actions with operators and researchers."}, "passKey": "$2b$10$dYjYt1sbGUNHYP38TAOuRO9f0Qw8LomwTR98bvHEiZA0sNFkm2J0C", "version": 1, "fullname": "Monitoring Manager", "password": "$2b$10$xvKr.5.5rmrDewDRysNWduNk/zijgEAtN/pL5XG/dhT05QS38tb4K", "username": "@monitoringmanager", "createdAt": "2025-12-09T02:21:31.552Z", "deletedAt": null, "updatedAt": "2025-12-09T02:21:31.552Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019b00e9-f61f-73d9-b02a-e882acf17983	User Account Created Monitoring Manager	\N	2025-12-09 10:21:31.559698+08	2025-12-09 10:21:31.559698+08	1
\.


--
-- Data for Name: auth_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_logs (created_at, updated_at, id, "ipAddress", device, timestamptz, deleted_at, "userId", version) FROM stdin;
2025-12-09 09:26:45.45362+08	2025-12-09 09:26:45.45362+08	019b00b7-d1cd-77ad-818d-7ddd464ffa7f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 09:26:45.45362	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:22:08.078343+08	2025-12-09 10:22:08.078343+08	019b00ea-84ce-7218-ac8f-1bad21a38290	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:22:08.078343	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:22:20.213375+08	2025-12-09 10:22:20.213375+08	019b00ea-b435-7302-ac21-bf35c8340f8e	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:22:20.213375	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
2025-12-09 10:23:34.712303+08	2025-12-09 10:23:34.712303+08	019b00eb-d737-770f-ba7d-c7365ffa0108	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:23:34.712303	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:25:48.102513+08	2025-12-09 10:25:48.102513+08	019b00ed-e046-72a5-a20c-eb4a49366049	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:25:48.102513	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
2025-12-09 10:27:05.12173+08	2025-12-09 10:27:05.12173+08	019b00ef-0d21-77cb-b827-6924a41f531b	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:27:05.12173	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
2025-12-09 10:30:08.159181+08	2025-12-09 10:30:08.159181+08	019b00f1-d81e-756f-85f6-05293d23ea8f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:30:08.159181	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
2025-12-09 10:30:43.398728+08	2025-12-09 10:30:43.398728+08	019b00f2-61c6-7194-a4f6-7f55c8123599	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:30:43.398728	\N	019b00e8-7114-74bf-8954-5de6625c4e52	1
2025-12-09 10:30:53.712093+08	2025-12-09 10:30:53.712093+08	019b00f2-8a0f-7460-bbb8-6bd5640fd299	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:30:53.712093	\N	019b00e9-f61f-73d9-b02a-e882acf17983	1
2025-12-09 10:31:07.561892+08	2025-12-09 10:31:07.561892+08	019b00f2-c029-7048-abe2-322915679c55	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:31:07.561892	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:32:33.793472+08	2025-12-09 10:32:33.793472+08	019b00f4-1101-709a-8af3-5c1a4f32914d	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:32:33.793472	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
2025-12-09 10:32:45.770468+08	2025-12-09 10:32:45.770468+08	019b00f4-3fca-76be-ab72-984cb88c0bd9	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:32:45.770468	\N	019b00e8-7114-74bf-8954-5de6625c4e52	1
2025-12-09 10:32:57.790538+08	2025-12-09 10:32:57.790538+08	019b00f4-6ebe-722a-92cf-c2e3cf4cf27f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:32:57.790538	\N	019b00e9-f61f-73d9-b02a-e882acf17983	1
2025-12-09 10:41:22.225891+08	2025-12-09 10:41:22.225891+08	019b00fc-2131-71c7-b76b-4f7e0d5a27ed	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:41:22.225891	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:42:16.150782+08	2025-12-09 10:42:16.150782+08	019b00fc-f3d6-766a-8741-82a304512e09	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:42:16.150782	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:52:18.949261+08	2025-12-09 10:52:18.949261+08	019b0106-2685-719e-ab22-f32e4eede2c2	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:52:18.949261	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 10:54:03.326202+08	2025-12-09 10:54:03.326202+08	019b0107-be3e-70af-86f9-3b5830e1cb8e	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 10:54:03.326202	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 11:04:06.859821+08	2025-12-09 11:04:06.859821+08	019b0110-f3ca-7172-b746-38c2c3743766	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 11:04:06.859821	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
2025-12-09 11:04:19.675541+08	2025-12-09 11:04:19.675541+08	019b0111-25da-76e8-a0d5-3ea4b987c2ab	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 11:04:19.675541	\N	019b00e8-7114-74bf-8954-5de6625c4e52	1
2025-12-09 11:25:27.000683+08	2025-12-09 11:25:27.000683+08	019b0124-7c58-77a8-b2dd-a02da58935e9	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 11:25:27.000683	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-12-09 11:43:23.856322+08	2025-12-09 11:43:23.856322+08	019b0134-eacf-728d-9c02-1b9d65b2fb63	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 11:43:23.856322	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	1
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, version, created_at, updated_at, deleted_at, employee_id, first_name, middle_name, last_name, email, contact_number, "position", department, is_verified) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, description, url_params, actions, status, author, "timestamp", deleted_at, created_at, updated_at, version) FROM stdin;
019b00e4-f311-748f-9d25-a67b3baefb42	User Account Created	User Account Created Researcher Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:16:03.090458+08	\N	2025-12-09 10:16:03.090458+08	2025-12-09 10:16:03.090458+08	1
019b00e6-f2b7-738d-9eaa-8903b4f4588a	User Account UPDATED	User Account UPDATED System Administrator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:18:14.071288+08	\N	2025-12-09 10:18:14.071288+08	2025-12-09 10:18:14.071288+08	1
019b00e8-711d-7338-85f5-e6eba839807b	User Account Created	User Account Created Fish Pond Operator Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:19:51.965756+08	\N	2025-12-09 10:19:51.965756+08	2025-12-09 10:19:51.965756+08	1
019b00e9-f62c-75e7-8661-e0532a80d84c	User Account Created	User Account Created Monitoring Manager	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:21:31.564441+08	\N	2025-12-09 10:21:31.564441+08	2025-12-09 10:21:31.564441+08	1
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, permission, description, created_at, updated_at, version, deleted_at) FROM stdin;
0199b8a1-8c49-774a-849a-b354dd5fc460	Export	Allows the user to export content.	2025-10-06 16:26:59.017817	2025-10-13 15:20:51.041851	2	\N
0199b8a1-7c0d-710f-9ba5-538c047473ce	Delete	Allows the user to remove content.	2025-10-06 16:26:54.862387	2025-10-13 15:21:09.515201	2	\N
0199b8a1-6889-74b8-8e8b-1f4417b0ce07	Update	Allows the user to modify existing content.	2025-10-06 16:26:49.866119	2025-10-13 15:21:21.771834	2	\N
0199b89f-7259-759a-8708-d8b1c2236d49	Create	Allows the user to create new content.	2025-10-06 16:24:41.304126	2025-10-13 15:21:35.948493	2	\N
0199dc71-25c2-719f-b489-6bc026086c4e	View	Allows the user to view and read content.test	2025-10-13 15:20:26.81978	2025-10-16 13:33:07.766429	2	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role, description, created_at, updated_at, version, deleted_at) FROM stdin;
01997a38-a91d-7288-b61b-49329c911b5d	Moderator	System Moderator	2025-09-24 13:35:57.724763	2025-09-30 13:14:15.815209	2	\N
019979a8-362a-7509-a04d-3404c42ebaa3	User	System User	2025-09-24 10:58:11.11437	2025-09-30 13:14:25.66666	2	\N
0199799e-a53c-712a-a759-5fee5d7e0cf5	Administrator	System Administrator	2025-09-24 10:47:44.187323	2025-09-30 13:14:36.101577	2	\N
019b00be-1b25-7418-92d2-acbc60408ec1	Researcher	The Researcher analyzes collected water-quality data to identify patterns and evaluate system performance. They use these insights to support experiments, improve monitoring strategies, and enhance fish health outcomes.	2025-12-09 09:33:37.445278	2025-12-09 09:33:54.301688	2	\N
019b00be-a6c6-719c-9be8-8f44f0fca0ec	Fishpond-Operator	The Fishpond Operator manages daily pond activities and monitors real-time sensor data. They respond to alerts, maintain equipment, and ensure stable conditions for the fish.	2025-12-09 09:34:13.191201	2025-12-09 09:34:13.191201	1	\N
019b00be-e1a0-77d8-bbc9-e433652a09de	Monitoring-Manager	The Monitoring Manager oversees overall system status through dashboards and historical reports. They use trends and analytics to guide decisions and coordinate actions with operators and researchers.	2025-12-09 09:34:28.256725	2025-12-09 09:34:28.256725	1	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "ipAddress", device, "userId", "expiresAt", created_at, deleted_at, updated_at, version) FROM stdin;
019b0134-ead5-72e8-8fdc-395991f53a13	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	2025-12-10 11:43:23.861+08	2025-12-09 11:43:23.862487+08	\N	2025-12-09 11:43:23.862487+08	1
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, "userId", "permissionId", created_at, updated_at, version, deleted_at, user_id, permission_id) FROM stdin;
4d86372d-424e-49c6-8e3e-80902cfd9b91	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199dc71-25c2-719f-b489-6bc026086c4e	2025-10-13 15:31:18.665554	2025-10-13 15:31:18.665554	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199dc71-25c2-719f-b489-6bc026086c4e
87f3e9e0-a0a1-43b0-aeef-6488bd77fa0f	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-10-07 09:42:40.015538	2025-10-07 09:42:40.015538	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-7c0d-710f-9ba5-538c047473ce
f839b6d6-5e03-4870-a0df-af1729df5594	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-10-07 09:42:40.015538	2025-10-07 09:42:40.015538	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-8c49-774a-849a-b354dd5fc460
03910af4-8768-4fa2-91dd-9c56944316f2	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-8c49-774a-849a-b354dd5fc460
f6ddaa0e-3858-4730-a9d9-a53f0ab08416	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-7c0d-710f-9ba5-538c047473ce
26b27af6-76ab-4b85-93a6-c9a63f638837	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
1be4f1b9-8744-4048-9da6-dfecdd513f24	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b89f-7259-759a-8708-d8b1c2236d49
665aee53-d4db-4ad5-b5a7-904f04d2cbad	019a99e7-111f-732e-87fe-ae62fc6714d8	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199dc71-25c2-719f-b489-6bc026086c4e
031c14ec-e48e-4386-a0cf-1659cef1bb3d	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b89f-7259-759a-8708-d8b1c2236d49	2025-10-07 09:42:40.015538	2025-10-07 09:42:40.015538	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b89f-7259-759a-8708-d8b1c2236d49
21b31e31-4902-443d-8953-5a2ab74c20e3	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-10-06 16:27:11.943596	2025-10-06 16:27:11.943596	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
b0482071-c530-407f-81e7-955e15b41f13	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-12-09 10:16:03.120341	2025-12-09 10:16:03.120341	1	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b8a1-8c49-774a-849a-b354dd5fc460
59d22087-e7ac-4282-9c9f-90786eb839b5	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-12-09 10:16:03.120341	2025-12-09 10:16:03.120341	1	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b8a1-7c0d-710f-9ba5-538c047473ce
58cda258-172b-4d4e-bf76-8843d3b5b6e9	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-12-09 10:16:03.120341	2025-12-09 10:16:03.120341	1	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
9f365f93-ad99-4146-b349-2159e1f3728b	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b89f-7259-759a-8708-d8b1c2236d49	2025-12-09 10:16:03.120341	2025-12-09 10:16:03.120341	1	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199b89f-7259-759a-8708-d8b1c2236d49
8a5cdf68-2c1a-46ee-aa7b-b5c9ddb632ec	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199dc71-25c2-719f-b489-6bc026086c4e	2025-12-09 10:16:03.120341	2025-12-09 10:16:03.120341	1	\N	019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	0199dc71-25c2-719f-b489-6bc026086c4e
e501de94-7391-4a07-be8d-0a16c159faef	019b00e8-7114-74bf-8954-5de6625c4e52	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-12-09 10:19:51.984687	2025-12-09 10:19:51.984687	1	\N	019b00e8-7114-74bf-8954-5de6625c4e52	0199b8a1-8c49-774a-849a-b354dd5fc460
06b2baf7-547c-4c82-a423-d85353dded05	019b00e8-7114-74bf-8954-5de6625c4e52	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-12-09 10:19:51.984687	2025-12-09 10:19:51.984687	1	\N	019b00e8-7114-74bf-8954-5de6625c4e52	0199b8a1-7c0d-710f-9ba5-538c047473ce
5e9af426-c1ee-4ce0-9057-98d82fdc1a9e	019b00e8-7114-74bf-8954-5de6625c4e52	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-12-09 10:19:51.984687	2025-12-09 10:19:51.984687	1	\N	019b00e8-7114-74bf-8954-5de6625c4e52	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
4c6176b0-0bc6-4e5a-bb8b-aa43a5cacacf	019b00e8-7114-74bf-8954-5de6625c4e52	0199b89f-7259-759a-8708-d8b1c2236d49	2025-12-09 10:19:51.984687	2025-12-09 10:19:51.984687	1	\N	019b00e8-7114-74bf-8954-5de6625c4e52	0199b89f-7259-759a-8708-d8b1c2236d49
a6169b43-e138-4415-b861-1c78197e7fe8	019b00e8-7114-74bf-8954-5de6625c4e52	0199dc71-25c2-719f-b489-6bc026086c4e	2025-12-09 10:19:51.984687	2025-12-09 10:19:51.984687	1	\N	019b00e8-7114-74bf-8954-5de6625c4e52	0199dc71-25c2-719f-b489-6bc026086c4e
17b018b9-1128-4bed-b4b7-87e3b4d6bc46	019b00e9-f61f-73d9-b02a-e882acf17983	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-12-09 10:21:31.592887	2025-12-09 10:21:31.592887	1	\N	019b00e9-f61f-73d9-b02a-e882acf17983	0199b8a1-8c49-774a-849a-b354dd5fc460
ed42d7ec-01ff-475a-b63c-f013fb275e3c	019b00e9-f61f-73d9-b02a-e882acf17983	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-12-09 10:21:31.592887	2025-12-09 10:21:31.592887	1	\N	019b00e9-f61f-73d9-b02a-e882acf17983	0199b8a1-7c0d-710f-9ba5-538c047473ce
9e58be37-74b8-4862-94ed-931d8501fa05	019b00e9-f61f-73d9-b02a-e882acf17983	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-12-09 10:21:31.592887	2025-12-09 10:21:31.592887	1	\N	019b00e9-f61f-73d9-b02a-e882acf17983	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
c2df37a6-4032-4499-902f-297ce7585bd0	019b00e9-f61f-73d9-b02a-e882acf17983	0199b89f-7259-759a-8708-d8b1c2236d49	2025-12-09 10:21:31.592887	2025-12-09 10:21:31.592887	1	\N	019b00e9-f61f-73d9-b02a-e882acf17983	0199b89f-7259-759a-8708-d8b1c2236d49
01f1dd4a-03bb-4b00-9853-6ca5d7ccc6f5	019b00e9-f61f-73d9-b02a-e882acf17983	0199dc71-25c2-719f-b489-6bc026086c4e	2025-12-09 10:21:31.592887	2025-12-09 10:21:31.592887	1	\N	019b00e9-f61f-73d9-b02a-e882acf17983	0199dc71-25c2-719f-b489-6bc026086c4e
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, user_name, email, password, failed_attempts, version, role_id, profile_image, pass_key, access, lockout_until, deleted_at, created_at, updated_at) FROM stdin;
019a99e7-111f-732e-87fe-ae62fc6714d8	System Moderator	@moderator	moderator@email.com	$2b$10$CRMbvc.dh/coMc6NLksfTOq/P4/ux2R3kvhG4zsfo3YaNW5997z2W	0	6	01997a38-a91d-7288-b61b-49329c911b5d	/uploads/users_profile_images/System Moderator-1763518761026.png	$2b$10$mvvtPfX2cc4JX.odjW/PJ.b3CbPBZ9B.bISim151RMvBXGBHzxK9e	["/dashboard","/academic","/student-records","/timetable","/examinations","/certificates","/documents","/announcements","/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/admin/audit-logs","/my-students","/schedule","/attendance","/my-examinations","/my-schedule","/my-grades","/assignments","/exam-schedule","/my-certificates","/my-documents"]	\N	\N	2025-11-19 10:17:28.608+08	2025-11-19 10:17:28.608+08
019b00e9-f61f-73d9-b02a-e882acf17983	Monitoring Manager	@monitoringmanager	monitoringmanager.demo@mail.com	$2b$10$xvKr.5.5rmrDewDRysNWduNk/zijgEAtN/pL5XG/dhT05QS38tb4K	0	3	019b00be-e1a0-77d8-bbc9-e433652a09de	\N	$2b$10$dYjYt1sbGUNHYP38TAOuRO9f0Qw8LomwTR98bvHEiZA0sNFkm2J0C	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring"]	\N	\N	2025-12-09 10:21:31.552+08	2025-12-09 10:21:31.552+08
019b00e8-7114-74bf-8954-5de6625c4e52	Fish Pond Operator Demo	@fishpondoperator	fishpondoperator.demo@mail.com	$2b$10$ZwrRv.jBBU39ieF580tPFOuLX52SBcIlTCABfkm7VAQthm9QAeGjK	0	4	019b00be-a6c6-719c-9be8-8f44f0fca0ec	\N	$2b$10$coBEiEA7OoWaPjTFo7zuNuoUHu8v/xr6lnTLjEjlVRp8gfCgU6gXK	["/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring"]	\N	\N	2025-12-09 10:19:51.956+08	2025-12-09 10:19:51.956+08
01997ac6-c5bb-7589-b79f-a6509ea5d44a	System Administrator	@admin	admin@email.com	$2b$10$Rf4GPpj4ZecQRcouop0Foe5GFdN2KBTYXqKULl.EJtp5wUVG.kbge	0	77	0199799e-a53c-712a-a759-5fee5d7e0cf5	/uploads/users_profile_images/System Administrator-1761726512573.png	$2b$10$jdV9D6RyqFw1dDPTTC1Xk.dqYVhSac/zgOu5KxRCHDiqhgk6Uevau	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring"]	\N	\N	2025-09-24 16:11:11.162+08	2025-11-04 16:44:24.886+08
019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	Researcher Demo	@researcher	researcher.demo@mail.com	$2b$10$F2rFpIAywkhYQcGagBNYfeM0fOEv0SqZBW7bfAWd3R7XhQ6qG5OTy	0	8	019b00be-1b25-7418-92d2-acbc60408ec1	\N	$2b$10$wIQc6JXWFLW.oGAN8sQCzeNoWnOpXM3YxRv3QDztJ84JvEHr3BoZe	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring"]	\N	\N	2025-12-09 10:16:03.071+08	2025-12-09 10:16:03.071+08
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: user_permissions PK_01f4295968ba33d73926684264f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: sessions PK_3238ef96f18b355b671619111bc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: permissions PK_920331560282b8bd21bb02290df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: employees PK_b9535a98350d5b26e7eb0c26af4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: auth_logs PK_f4ee581a4a56f10b64ffbfc1779; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "PK_f4ee581a4a56f10b64ffbfc1779" PRIMARY KEY (id);


--
-- Name: users UQ_074a1f262efaca6aba16f7ed920; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE (user_name);


--
-- Name: employees UQ_765bc1ac8967533a04c74a9f6af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE (email);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: employees UQ_c9a09b8e6588fb4d3c9051c8937; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_c9a09b8e6588fb4d3c9051c8937" UNIQUE (employee_id);


--
-- Name: roles UQ_ccc7c1489f3a6b3c9b47d4537c5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE (role);


--
-- Name: permissions UQ_efcbbce13db89dbd3ef8b7690ae; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "UQ_efcbbce13db89dbd3ef8b7690ae" UNIQUE (permission);


--
-- Name: IDX_13270b51f461a0ebfc0808ef62; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_13270b51f461a0ebfc0808ef62" ON public.sessions USING btree ("userId", "expiresAt");


--
-- Name: IDX_3dc66dbf37e5f226ef06db37cf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3dc66dbf37e5f226ef06db37cf" ON public.auth_logs USING btree ("userId", timestamptz);


--
-- Name: notifications FK_312d0b2167068d5f1fb30f5f673; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_312d0b2167068d5f1fb30f5f673" FOREIGN KEY (author) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_permissions FK_3495bd31f1862d02931e8e8d2e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: auth_logs FK_564498ad3b1e8e338de48222381; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "FK_564498ad3b1e8e338de48222381" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions FK_57de40bc620f456c7311aa3a1e6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_permissions FK_8145f5fadacd311693c15e41f10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: users FK_a2cecd1a3531c0b041e29ba46e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: audit_logs FK_ae97aac6d6d471b9d88cea1c971; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971" FOREIGN KEY (performed_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZPrt7IY6wAOB0YJ8R70x0yZfMVBBpFyTdxKJN2oM1sKp3WEobEutAtXtm9sISwT

