--
-- PostgreSQL database dump
--

\restrict tLRwcthj3ejerREXDqUkF2K8ND0L8wd2ZPCFG00Apy8QpnuNoLByjp0Saj4akVj

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2026-02-28 09:20:08

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
-- TOC entry 2 (class 3079 OID 25394)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 25432)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 916 (class 1247 OID 25444)
-- Name: asset_depreciation_depreciation_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_depreciation_method_enum AS ENUM (
    'STRAIGHT_LINE',
    'ACCELERATED'
);


ALTER TYPE public.asset_depreciation_depreciation_method_enum OWNER TO postgres;

--
-- TOC entry 919 (class 1247 OID 25450)
-- Name: asset_depreciation_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_frequency_enum AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'ANNUAL'
);


ALTER TYPE public.asset_depreciation_frequency_enum OWNER TO postgres;

--
-- TOC entry 922 (class 1247 OID 25458)
-- Name: asset_depreciation_useful_life_unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_useful_life_unit_enum AS ENUM (
    'MONTHS',
    'YEARS'
);


ALTER TYPE public.asset_depreciation_useful_life_unit_enum OWNER TO postgres;

--
-- TOC entry 925 (class 1247 OID 25464)
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
-- TOC entry 928 (class 1247 OID 25502)
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
-- TOC entry 931 (class 1247 OID 25540)
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
-- TOC entry 934 (class 1247 OID 25590)
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
-- TOC entry 937 (class 1247 OID 25628)
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
-- TOC entry 940 (class 1247 OID 25666)
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
-- TOC entry 221 (class 1259 OID 25703)
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
-- TOC entry 222 (class 1259 OID 25714)
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
-- TOC entry 233 (class 1259 OID 25921)
-- Name: dissolved_oxygen_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dissolved_oxygen_records (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sensor_id character varying NOT NULL,
    value double precision NOT NULL,
    "timestamp" timestamp with time zone,
    status character varying NOT NULL
);


ALTER TABLE public.dissolved_oxygen_records OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25726)
-- Name: emails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emails (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sender character varying NOT NULL,
    recepient character varying NOT NULL,
    subject text,
    body text NOT NULL,
    error_message text
);


ALTER TABLE public.emails OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25739)
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
-- TOC entry 225 (class 1259 OID 25758)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25766)
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
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 226
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 227 (class 1259 OID 25767)
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
-- TOC entry 228 (class 1259 OID 25781)
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
-- TOC entry 234 (class 1259 OID 25936)
-- Name: ph_level_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ph_level_records (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sensor_id character varying NOT NULL,
    ph_level double precision NOT NULL,
    "timestamp" timestamp with time zone,
    status character varying NOT NULL
);


ALTER TABLE public.ph_level_records OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25795)
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
-- TOC entry 230 (class 1259 OID 25809)
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
-- TOC entry 235 (class 1259 OID 25951)
-- Name: temperature_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temperature_records (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sensor_id character varying NOT NULL,
    temperature double precision NOT NULL,
    "timestamp" timestamp with time zone,
    unit character varying NOT NULL
);


ALTER TABLE public.temperature_records OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25819)
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
-- TOC entry 232 (class 1259 OID 25831)
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
-- TOC entry 236 (class 1259 OID 25966)
-- Name: water_level_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.water_level_records (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sensor_id character varying NOT NULL,
    level character varying NOT NULL,
    "timestamp" timestamp with time zone,
    status character varying NOT NULL
);


ALTER TABLE public.water_level_records OWNER TO postgres;

--
-- TOC entry 4951 (class 2604 OID 25847)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 5175 (class 0 OID 25703)
-- Dependencies: 221
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, performed_by, before, after, action, "transactionId", title, deleted_at, created_at, updated_at, version) FROM stdin;
019b00e4-f30a-712b-9a69-e6cef54447ed	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019b00e4-f2fe-73ee-9b1d-18d9fb4a0369", "email": "researcher.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-1b25-7418-92d2-acbc60408ec1", "role": "Researcher", "version": 2, "createdAt": "2025-12-09T01:33:37.445Z", "deletedAt": null, "updatedAt": "2025-12-09T01:33:54.301Z", "description": "The Researcher analyzes collected water-quality data to identify patterns and evaluate system performance. They use these insights to support experiments, improve monitoring strategies, and enhance fish health outcomes."}, "passKey": "$2b$10$wIQc6JXWFLW.oGAN8sQCzeNoWnOpXM3YxRv3QDztJ84JvEHr3BoZe", "version": 1, "fullname": "Researcher Demo", "password": "$2b$10$F2rFpIAywkhYQcGagBNYfeM0fOEv0SqZBW7bfAWd3R7XhQ6qG5OTy", "username": "@researcher", "createdAt": "2025-12-09T02:16:03.071Z", "deletedAt": null, "updatedAt": "2025-12-09T02:16:03.071Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019b00e4-f2fe-73ee-9b1d-18d9fb4a0369", "email": "researcher.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-1b25-7418-92d2-acbc60408ec1", "role": "Researcher", "version": 2, "createdAt": "2025-12-09T01:33:37.445Z", "deletedAt": null, "updatedAt": "2025-12-09T01:33:54.301Z", "description": "The Researcher analyzes collected water-quality data to identify patterns and evaluate system performance. They use these insights to support experiments, improve monitoring strategies, and enhance fish health outcomes."}, "passKey": "$2b$10$wIQc6JXWFLW.oGAN8sQCzeNoWnOpXM3YxRv3QDztJ84JvEHr3BoZe", "version": 1, "fullname": "Researcher Demo", "password": "$2b$10$F2rFpIAywkhYQcGagBNYfeM0fOEv0SqZBW7bfAWd3R7XhQ6qG5OTy", "username": "@researcher", "createdAt": "2025-12-09T02:16:03.071Z", "deletedAt": null, "updatedAt": "2025-12-09T02:16:03.071Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	User Account Created Researcher Demo	\N	2025-12-09 10:16:03.086371+08	2025-12-09 10:16:03.086371+08	1
019b00e6-f2af-71d8-b539-7ff53c471942	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	UPDATE	TX_USER-01997ac6-c5bb-7589-b79f-a6509ea5d44a	User Account UPDATED System Administrator	\N	2025-12-09 10:18:14.066816+08	2025-12-09 10:18:14.066816+08	1
019b00e8-7117-7606-b4a5-a9633cdf701e	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019b00e8-7114-74bf-8954-5de6625c4e52", "email": "fishpondoperator.demo@mail.com", "access": ["/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-a6c6-719c-9be8-8f44f0fca0ec", "role": "Fishpond-Operator", "version": 1, "createdAt": "2025-12-09T01:34:13.191Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:13.191Z", "description": "The Fishpond Operator manages daily pond activities and monitors real-time sensor data. They respond to alerts, maintain equipment, and ensure stable conditions for the fish."}, "passKey": "$2b$10$coBEiEA7OoWaPjTFo7zuNuoUHu8v/xr6lnTLjEjlVRp8gfCgU6gXK", "version": 1, "fullname": "Fish Pond Operator Demo", "password": "$2b$10$ZwrRv.jBBU39ieF580tPFOuLX52SBcIlTCABfkm7VAQthm9QAeGjK", "username": "@fishpondoperator", "createdAt": "2025-12-09T02:19:51.956Z", "deletedAt": null, "updatedAt": "2025-12-09T02:19:51.956Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019b00e8-7114-74bf-8954-5de6625c4e52", "email": "fishpondoperator.demo@mail.com", "access": ["/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-a6c6-719c-9be8-8f44f0fca0ec", "role": "Fishpond-Operator", "version": 1, "createdAt": "2025-12-09T01:34:13.191Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:13.191Z", "description": "The Fishpond Operator manages daily pond activities and monitors real-time sensor data. They respond to alerts, maintain equipment, and ensure stable conditions for the fish."}, "passKey": "$2b$10$coBEiEA7OoWaPjTFo7zuNuoUHu8v/xr6lnTLjEjlVRp8gfCgU6gXK", "version": 1, "fullname": "Fish Pond Operator Demo", "password": "$2b$10$ZwrRv.jBBU39ieF580tPFOuLX52SBcIlTCABfkm7VAQthm9QAeGjK", "username": "@fishpondoperator", "createdAt": "2025-12-09T02:19:51.956Z", "deletedAt": null, "updatedAt": "2025-12-09T02:19:51.956Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019b00e8-7114-74bf-8954-5de6625c4e52	User Account Created Fish Pond Operator Demo	\N	2025-12-09 10:19:51.962555+08	2025-12-09 10:19:51.962555+08	1
019b00e9-f624-7059-aa50-e6588509bdec	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019b00e9-f61f-73d9-b02a-e882acf17983", "email": "monitoringmanager.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-e1a0-77d8-bbc9-e433652a09de", "role": "Monitoring-Manager", "version": 1, "createdAt": "2025-12-09T01:34:28.256Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:28.256Z", "description": "The Monitoring Manager oversees overall system status through dashboards and historical reports. They use trends and analytics to guide decisions and coordinate actions with operators and researchers."}, "passKey": "$2b$10$dYjYt1sbGUNHYP38TAOuRO9f0Qw8LomwTR98bvHEiZA0sNFkm2J0C", "version": 1, "fullname": "Monitoring Manager", "password": "$2b$10$xvKr.5.5rmrDewDRysNWduNk/zijgEAtN/pL5XG/dhT05QS38tb4K", "username": "@monitoringmanager", "createdAt": "2025-12-09T02:21:31.552Z", "deletedAt": null, "updatedAt": "2025-12-09T02:21:31.552Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019b00e9-f61f-73d9-b02a-e882acf17983", "email": "monitoringmanager.demo@mail.com", "access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring"], "roleId": {"id": "019b00be-e1a0-77d8-bbc9-e433652a09de", "role": "Monitoring-Manager", "version": 1, "createdAt": "2025-12-09T01:34:28.256Z", "deletedAt": null, "updatedAt": "2025-12-09T01:34:28.256Z", "description": "The Monitoring Manager oversees overall system status through dashboards and historical reports. They use trends and analytics to guide decisions and coordinate actions with operators and researchers."}, "passKey": "$2b$10$dYjYt1sbGUNHYP38TAOuRO9f0Qw8LomwTR98bvHEiZA0sNFkm2J0C", "version": 1, "fullname": "Monitoring Manager", "password": "$2b$10$xvKr.5.5rmrDewDRysNWduNk/zijgEAtN/pL5XG/dhT05QS38tb4K", "username": "@monitoringmanager", "createdAt": "2025-12-09T02:21:31.552Z", "deletedAt": null, "updatedAt": "2025-12-09T02:21:31.552Z", "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019b00e9-f61f-73d9-b02a-e882acf17983	User Account Created Monitoring Manager	\N	2025-12-09 10:21:31.559698+08	2025-12-09 10:21:31.559698+08	1
019b020c-9206-761a-addd-9546b018a6d8	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	UPDATE	TX_USER-01997ac6-c5bb-7589-b79f-a6509ea5d44a	User Account UPDATED System Administrator	\N	2025-12-09 15:38:56.906532+08	2025-12-09 15:38:56.906532+08	1
019b020c-b26c-767b-9f91-58dc88dea0c8	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "019b00be-e1a0-77d8-bbc9-e433652a09de"}	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "019b00be-e1a0-77d8-bbc9-e433652a09de"}	UPDATE	TX_USER-019b00e9-f61f-73d9-b02a-e882acf17983	User Account UPDATED Monitoring Manager	\N	2025-12-09 15:39:05.199823+08	2025-12-09 15:39:05.199823+08	1
019b020c-cc1d-758c-bd3d-4787a1e190c2	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "019b00be-a6c6-719c-9be8-8f44f0fca0ec"}	{"access": ["/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "019b00be-a6c6-719c-9be8-8f44f0fca0ec"}	UPDATE	TX_USER-019b00e8-7114-74bf-8954-5de6625c4e52	User Account UPDATED Fish Pond Operator Demo	\N	2025-12-09 15:39:11.776671+08	2025-12-09 15:39:11.776671+08	1
019b020c-e7b0-745d-b778-fdf3e63cd74f	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "019b00be-1b25-7418-92d2-acbc60408ec1"}	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "019b00be-1b25-7418-92d2-acbc60408ec1"}	UPDATE	TX_USER-019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	User Account UPDATED Researcher Demo	\N	2025-12-09 15:39:18.834363+08	2025-12-09 15:39:18.834363+08	1
019b020d-151c-7208-a0ee-56a421e5e49c	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "01997a38-a91d-7288-b61b-49329c911b5d"}	{"access": ["/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications", "/dashboard", "/profile", "/account", "/temperature-monitoring", "/turbidity-monitoring", "/ph-water-monitoring", "/water-level-monitoring", "/do-monitoring"], "roleId": "01997a38-a91d-7288-b61b-49329c911b5d"}	UPDATE	TX_USER-019a99e7-111f-732e-87fe-ae62fc6714d8	User Account UPDATED System Moderator	\N	2025-12-09 15:39:30.46153+08	2025-12-09 15:39:30.46153+08	1
\.


--
-- TOC entry 5176 (class 0 OID 25714)
-- Dependencies: 222
-- Data for Name: auth_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_logs (created_at, updated_at, id, "ipAddress", device, timestamptz, deleted_at, "userId", version) FROM stdin;
2026-01-30 20:31:04.330868+08	2026-01-30 20:31:04.330868+08	019c0ee2-b48b-713e-bd70-8a4605e061ae	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-30 20:31:04.330868	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2026-02-07 15:43:29.677616+08	2026-02-07 15:43:29.677616+08	019c370e-4b8e-75ec-aac5-543925f4ac7e	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-02-07 15:43:29.677616	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2026-02-21 15:01:14.720667+08	2026-02-21 15:01:14.720667+08	019c7f00-a561-774d-ba40-49537355ab3f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	2026-02-21 15:01:14.720667	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2026-02-23 20:16:21.151375+08	2026-02-23 20:16:21.151375+08	019c8a6d-da9f-7428-8239-87f78e219da5	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	2026-02-23 20:16:21.151375	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2026-02-25 19:07:46.13818+08	2026-02-25 19:07:46.13818+08	019c947b-c859-770b-bd77-00ec50bc1d05	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	2026-02-25 19:07:46.13818	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2026-02-27 19:25:13.471945+08	2026-02-27 19:25:13.471945+08	019c9ed8-7b80-75f8-b60b-8cd25d8ca4ef	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	2026-02-27 19:25:13.471945	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
\.


--
-- TOC entry 5187 (class 0 OID 25921)
-- Dependencies: 233
-- Data for Name: dissolved_oxygen_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dissolved_oxygen_records (id, version, created_at, updated_at, deleted_at, sensor_id, value, "timestamp", status) FROM stdin;
019c94c9-c227-72f4-b27d-3a144bebc31c	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.71	2026-02-25 20:32:32.031+08	critical
019c94c9-c227-72f4-b27d-3f7888bdee34	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.71	2026-02-25 20:32:35.286+08	critical
019c94c9-c227-72f4-b27d-427a4ef4580e	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.81	2026-02-25 20:32:38.13+08	critical
019c94c9-c227-72f4-b27d-447471c9ddfc	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.91	2026-02-25 20:32:41.051+08	critical
019c94c9-c227-72f4-b27d-4a08b8e44b3f	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.96	2026-02-25 20:32:44.094+08	critical
019c94c9-c227-72f4-b27d-4eca83978319	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.96	2026-02-25 20:32:47.092+08	critical
019c94c9-c227-72f4-b27d-502f8d554e2e	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	3.98	2026-02-25 20:32:50.311+08	critical
019c94c9-c227-72f4-b27d-55c68ddd89ab	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	4.03	2026-02-25 20:32:53.283+08	low
019c94c9-c227-72f4-b27d-58ecd4f5ac40	1	2026-02-25 20:32:56.359404+08	2026-02-25 20:32:56.359404+08	\N	DO_ESP32_01	4.05	2026-02-25 20:32:56.259+08	low
019c94ca-3662-7620-a345-f520c1b7d18e	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.05	2026-02-25 20:32:59.15+08	low
019c94ca-3662-7620-a345-fa1472ed43be	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.09	2026-02-25 20:33:02.224+08	low
019c94ca-3662-7620-a345-fc7e37a3cbe6	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.13	2026-02-25 20:33:05.271+08	low
019c94ca-3662-7620-a346-033e22ce3465	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.14	2026-02-25 20:33:08.094+08	low
019c94ca-3662-7620-a346-04ac5faaed11	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.14	2026-02-25 20:33:11.111+08	low
019c94ca-3662-7620-a346-0b4b1f130079	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.16	2026-02-25 20:33:14.173+08	low
019c94ca-3662-7620-a346-0cc78c9e4d80	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.13	2026-02-25 20:33:17.14+08	low
019c94ca-3662-7620-a346-102b68a88626	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.15	2026-02-25 20:33:20.223+08	low
019c94ca-3662-7620-a346-15c1837f6fdf	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.15	2026-02-25 20:33:23.1+08	low
019c94ca-3662-7620-a346-1a3a0009e7fc	1	2026-02-25 20:33:26.11506+08	2026-02-25 20:33:26.11506+08	\N	DO_ESP32_01	4.16	2026-02-25 20:33:26.055+08	low
019c94ca-ac05-74ff-8229-0ae7ea089087	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.15	2026-02-25 20:33:29.121+08	low
019c94ca-ac05-74ff-8229-0f2e4ec20f1c	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.15	2026-02-25 20:33:32.034+08	low
019c94ca-ac05-74ff-8229-1344b5ca5c8f	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.15	2026-02-25 20:33:35.164+08	low
019c94ca-ac05-74ff-8229-172347c7e1d5	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.13	2026-02-25 20:33:38.042+08	low
019c94ca-ac05-74ff-8229-1a4d7332cd62	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.11	2026-02-25 20:33:41.132+08	low
019c94ca-ac05-74ff-8229-1dfc03cb181a	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.05	2026-02-25 20:33:44.175+08	low
019c94ca-ac05-74ff-8229-201865444b4b	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.05	2026-02-25 20:33:47.053+08	low
019c94ca-ac05-74ff-8229-257faa15b573	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	4.01	2026-02-25 20:33:50.241+08	low
019c94ca-ac05-74ff-8229-2ac4b8451c8c	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	3.98	2026-02-25 20:33:53.187+08	critical
019c94ca-ac05-74ff-8229-2d9c437018eb	1	2026-02-25 20:33:56.229658+08	2026-02-25 20:33:56.229658+08	\N	DO_ESP32_01	3.95	2026-02-25 20:33:56.162+08	critical
019c94cb-20f0-7382-9388-73c3f33e4fd7	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.95	2026-02-25 20:33:59.254+08	critical
019c94cb-20f0-7382-9388-755af7ee492f	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.92	2026-02-25 20:34:02.195+08	critical
019c94cb-20f0-7382-9388-7a6c06071c32	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.87	2026-02-25 20:34:05.189+08	critical
019c94cb-20f0-7382-9388-7f15927b733d	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.86	2026-02-25 20:34:08.266+08	critical
019c94cb-20f0-7382-9388-839d6b2bb844	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.86	2026-02-25 20:34:11.154+08	critical
019c94cb-20f0-7382-9388-8725d6de73c8	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.83	2026-02-25 20:34:14.118+08	critical
019c94cb-20f0-7382-9388-8bc1fbd8c986	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.81	2026-02-25 20:34:17.083+08	critical
019c94cb-20f0-7382-9388-8c54245f19a4	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.8	2026-02-25 20:34:20.248+08	critical
019c94cb-20f0-7382-9388-90c4e927e6fb	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.8	2026-02-25 20:34:23.198+08	critical
019c94cb-20f0-7382-9388-96576c4dd4a7	1	2026-02-25 20:34:26.159921+08	2026-02-25 20:34:26.159921+08	\N	DO_ESP32_01	3.78	2026-02-25 20:34:26.157+08	critical
019c94cb-96b5-70bb-90fd-c5aea4b208fa	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.78	2026-02-25 20:34:29.024+08	critical
019c94cb-96b5-70bb-90fd-c857bb7127e1	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.74	2026-02-25 20:34:32.05+08	critical
019c94cb-96b5-70bb-90fd-cc1341ad5d78	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.74	2026-02-25 20:34:35.271+08	critical
019c94cb-96b5-70bb-90fd-d10fadc2755f	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.73	2026-02-25 20:34:38.994+08	critical
019c94cb-96b5-70bb-90fd-d4c439d6916e	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.72	2026-02-25 20:34:42.239+08	critical
019c94cb-96b5-70bb-90fd-d8826af0a96e	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.72	2026-02-25 20:34:44.038+08	critical
019c94cb-96b5-70bb-90fd-df006272b8fe	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.69	2026-02-25 20:34:47.254+08	critical
019c94cb-96b5-70bb-90fd-e39c9df4141f	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.67	2026-02-25 20:34:50.324+08	critical
019c94cb-96b5-70bb-90fd-e5c55cf988a4	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.67	2026-02-25 20:34:53.296+08	critical
019c94cb-96b5-70bb-90fd-ea57ad0c7f66	1	2026-02-25 20:34:56.309552+08	2026-02-25 20:34:56.309552+08	\N	DO_ESP32_01	3.67	2026-02-25 20:34:56.158+08	critical
019c94cc-0cbd-712d-987d-bf6865b4c868	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.67	2026-02-25 20:34:59.153+08	critical
019c94cc-0cbd-712d-987d-c3260ce46508	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.63	2026-02-25 20:35:02.102+08	critical
019c94cc-0cbd-712d-987d-c6bcdbc2b359	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.64	2026-02-25 20:35:05.196+08	critical
019c94cc-0cbd-712d-987d-cb312e7c40e1	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.64	2026-02-25 20:35:08.139+08	critical
019c94cc-0cbd-712d-987d-ce222caf9589	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.62	2026-02-25 20:35:11.338+08	critical
019c94cc-0cbd-712d-987d-d20aa2890c6f	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.61	2026-02-25 20:35:14.286+08	critical
019c94cc-0cbd-712d-987d-d69c83363602	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.6	2026-02-25 20:35:17.152+08	critical
019c94cc-0cbd-712d-987d-da716b99e8a2	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.6	2026-02-25 20:35:20.344+08	critical
019c94cc-0cbd-712d-987d-dec175a9f794	1	2026-02-25 20:35:26.525211+08	2026-02-25 20:35:26.525211+08	\N	DO_ESP32_01	3.59	2026-02-25 20:35:23.741+08	critical
019c94cc-765d-7209-9eba-7e8c1954811e	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.58	2026-02-25 20:35:26.604+08	critical
019c94cc-765d-7209-9eba-8353d3b9c9a1	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.57	2026-02-25 20:35:29.071+08	critical
019c94cc-765d-7209-9eba-84a212702f02	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.57	2026-02-25 20:35:32.139+08	critical
019c94cc-765d-7209-9eba-889d0325152c	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.57	2026-02-25 20:35:35.187+08	critical
019c94cc-765d-7209-9eba-8ed5775c4209	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.55	2026-02-25 20:35:38.453+08	critical
019c94cc-765d-7209-9eba-938e19d9b922	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.56	2026-02-25 20:35:41.128+08	critical
019c94cc-765d-7209-9eba-9659d0277b48	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.56	2026-02-25 20:35:44.184+08	critical
019c94cc-765d-7209-9eba-9bb321426bb8	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.55	2026-02-25 20:35:47.266+08	critical
019c94cc-765d-7209-9eba-9d594857f289	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.54	2026-02-25 20:35:50.333+08	critical
019c94cc-765d-7209-9eba-a1f21278c2f7	1	2026-02-25 20:35:53.565611+08	2026-02-25 20:35:53.565611+08	\N	DO_ESP32_01	3.51	2026-02-25 20:35:53.512+08	critical
019c94cc-8157-7249-9cec-d665775729c5	1	2026-02-25 20:35:56.375305+08	2026-02-25 20:35:56.375305+08	\N	DO_ESP32_01	3.51	2026-02-25 20:35:56.256+08	critical
019c94cc-f668-765f-870c-88088142190d	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.51	2026-02-25 20:35:59.024+08	critical
019c94cc-f668-765f-870c-8c2f4a376070	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.52	2026-02-25 20:36:02.261+08	critical
019c94cc-f668-765f-870c-900355979bf2	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.51	2026-02-25 20:36:05.168+08	critical
019c94cc-f668-765f-870c-94fdfdf91608	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.51	2026-02-25 20:36:08.171+08	critical
019c94cc-f668-765f-870c-9aa294cf683f	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.5	2026-02-25 20:36:11.431+08	critical
019c94cc-f668-765f-870c-9efa25e732fb	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.48	2026-02-25 20:36:14.043+08	critical
019c94cc-f668-765f-870c-a12836e8d80a	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.49	2026-02-25 20:36:17.265+08	critical
019c94cc-f668-765f-870c-a77b259c761f	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.49	2026-02-25 20:36:20.09+08	critical
019c94cc-f668-765f-870c-a86d164a58b0	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.48	2026-02-25 20:36:23.166+08	critical
019c94cc-f668-765f-870c-ad85c9c1a65a	1	2026-02-25 20:36:26.344617+08	2026-02-25 20:36:26.344617+08	\N	DO_ESP32_01	3.48	2026-02-25 20:36:26.181+08	critical
019c94cd-6b99-7757-8731-01958ec678ad	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.49	2026-02-25 20:36:29.045+08	critical
019c94cd-6b99-7757-8731-070f15caaf92	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.49	2026-02-25 20:36:32.239+08	critical
019c94cd-6b99-7757-8731-09aefd98be61	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.48	2026-02-25 20:36:35.237+08	critical
019c94cd-6b99-7757-8731-0dd173cf0c9e	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.47	2026-02-25 20:36:38.15+08	critical
019c94cd-6b99-7757-8731-12c51af6fdb1	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.46	2026-02-25 20:36:41.032+08	critical
019c94cd-6b99-7757-8731-14c7eec1d497	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.46	2026-02-25 20:36:44.425+08	critical
019c94cd-6b99-7757-8731-1abb94fb6269	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.72	2026-02-25 20:36:47.202+08	critical
019c94cd-6b99-7757-8731-1ed55fbda85a	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	3.92	2026-02-25 20:36:50.248+08	critical
019c94cd-6b99-7757-8731-22331767293f	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	4.01	2026-02-25 20:36:53.307+08	low
019c94cd-6b99-7757-8731-26a2d7ac841e	1	2026-02-25 20:36:56.346958+08	2026-02-25 20:36:56.346958+08	\N	DO_ESP32_01	4.01	2026-02-25 20:36:56.279+08	low
019c94cd-e0d1-7079-bf9b-c0dfbf906b9a	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.99	2026-02-25 20:36:59.243+08	critical
019c94cd-e0d1-7079-bf9b-c7e8a49b6471	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.87	2026-02-25 20:37:02.242+08	critical
019c94cd-e0d1-7079-bf9b-c9ebb709f3b9	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.76	2026-02-25 20:37:05.243+08	critical
019c94cd-e0d1-7079-bf9b-cf99f837c880	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.76	2026-02-25 20:37:08.104+08	critical
019c94cd-e0d1-7079-bf9b-d3e7c5b5afc4	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.67	2026-02-25 20:37:11.071+08	critical
019c94cd-e0d2-7639-bef9-770e16791b93	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.58	2026-02-25 20:37:14.042+08	critical
019c94cd-e0d2-7639-bef9-7af0c7c89e0e	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.52	2026-02-25 20:37:17.058+08	critical
019c94cd-e0d2-7639-bef9-7fe2cc89d971	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.52	2026-02-25 20:37:20.032+08	critical
019c94cd-e0d2-7639-bef9-833700b0d0e4	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.44	2026-02-25 20:37:23.144+08	critical
019c94cd-e0d2-7639-bef9-8592e5182f8a	1	2026-02-25 20:37:26.355055+08	2026-02-25 20:37:26.355055+08	\N	DO_ESP32_01	3.37	2026-02-25 20:37:26.288+08	critical
019c94ce-5519-73bb-90bd-c5569718b71f	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.32	2026-02-25 20:37:29.354+08	critical
019c94ce-5519-73bb-90bd-cb9bdf8300f1	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.32	2026-02-25 20:37:32.16+08	critical
019c94ce-5519-73bb-90bd-ccc50984633d	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.27	2026-02-25 20:37:35.047+08	critical
019c94ce-5519-73bb-90bd-d1253b9dba89	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.22	2026-02-25 20:37:38.192+08	critical
019c94ce-5519-73bb-90bd-d78429b1851f	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.22	2026-02-25 20:37:41.228+08	critical
019c94ce-5519-73bb-90bd-d90136d347c0	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.17	2026-02-25 20:37:44.248+08	critical
019c94ce-5519-73bb-90bd-df8620b55288	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.12	2026-02-25 20:37:47.027+08	critical
019c94ce-5519-73bb-90bd-e3c3d2b2b547	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.09	2026-02-25 20:37:50.048+08	critical
019c94ce-5519-73bb-90bd-e4d508534145	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.09	2026-02-25 20:37:53.217+08	critical
019c94ce-5519-73bb-90bd-eba6154136c8	1	2026-02-25 20:37:56.122977+08	2026-02-25 20:37:56.122977+08	\N	DO_ESP32_01	3.09	2026-02-25 20:37:56.078+08	critical
019c94ce-ca51-707f-9b17-37908e2e74bb	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	3.06	2026-02-25 20:37:59.176+08	critical
019c94ce-ca51-707f-9b17-3888f9bedddc	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	3.04	2026-02-25 20:38:02.337+08	critical
019c94ce-ca51-707f-9b17-3c646b815e6b	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	3.04	2026-02-25 20:38:05.221+08	critical
019c94ce-ca51-707f-9b17-43d20619577b	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	3.01	2026-02-25 20:38:08.096+08	critical
019c94ce-ca51-707f-9b17-45c4e36b3dd2	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	2.99	2026-02-25 20:38:11.132+08	critical
019c94ce-ca51-707f-9b17-48fdbd85bedc	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	2.96	2026-02-25 20:38:14.101+08	critical
019c94ce-ca51-707f-9b17-4fba9176eb16	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	2.96	2026-02-25 20:38:17.19+08	critical
019c94ce-ca51-707f-9b17-520e6c90843c	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	2.96	2026-02-25 20:38:20.142+08	critical
019c94ce-ca51-707f-9b17-56ddd9ce7e0b	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	2.94	2026-02-25 20:38:23.13+08	critical
019c94ce-ca51-707f-9b17-5878acf87993	1	2026-02-25 20:38:26.129008+08	2026-02-25 20:38:26.129008+08	\N	DO_ESP32_01	2.91	2026-02-25 20:38:26.08+08	critical
019c94cf-3fda-724d-a92f-d4b8d03b42d2	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.91	2026-02-25 20:38:29.255+08	critical
019c94cf-3fda-724d-a92f-db2ea7cb20e5	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.91	2026-02-25 20:38:32.043+08	critical
019c94cf-3fda-724d-a92f-dfcae83ef31f	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.87	2026-02-25 20:38:35.194+08	critical
019c94cf-3fda-724d-a92f-e0a84a8422cc	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.85	2026-02-25 20:38:38.087+08	critical
019c94cf-3fda-724d-a92f-e6b493de6275	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.85	2026-02-25 20:38:41.238+08	critical
019c94cf-3fda-724d-a92f-ea6eabfe9373	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.82	2026-02-25 20:38:44.146+08	critical
019c94cf-3fda-724d-a92f-ee0ae71132e9	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.82	2026-02-25 20:38:47.035+08	critical
019c94cf-3fda-724d-a92f-f2be398ce43c	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.82	2026-02-25 20:38:50.153+08	critical
019c94cf-3fda-724d-a92f-f5a32e977d02	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.82	2026-02-25 20:38:53.058+08	critical
019c94cf-3fda-724d-a92f-f80c603378f9	1	2026-02-25 20:38:56.217884+08	2026-02-25 20:38:56.217884+08	\N	DO_ESP32_01	2.79	2026-02-25 20:38:56.13+08	critical
019c94cf-b4f3-755a-9ef1-4a0d5f00359c	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.8	2026-02-25 20:38:59.461+08	critical
019c94cf-b4f3-755a-9ef1-4d21f4a7fd13	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.8	2026-02-25 20:39:02.705+08	critical
019c94cf-b4f3-755a-9ef1-524a8ffe2cd7	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.8	2026-02-25 20:39:05.183+08	critical
019c94cf-b4f3-755a-9ef1-56db50b5e5f0	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.77	2026-02-25 20:39:08.278+08	critical
019c94cf-b4f3-755a-9ef1-58a5dbb5a5df	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.8	2026-02-25 20:39:11.138+08	critical
019c94cf-b4f3-755a-9ef1-5df4f9a87757	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:14.126+08	critical
019c94cf-b4f3-755a-9ef1-6358d3e9059c	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:17.494+08	critical
019c94cf-b4f3-755a-9ef1-657a641fa789	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:20.829+08	critical
019c94cf-b4f3-755a-9ef1-6b755c5402d1	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:23.241+08	critical
019c94cf-b4f3-755a-9ef1-6fa435c0db2b	1	2026-02-25 20:39:26.195901+08	2026-02-25 20:39:26.195901+08	\N	DO_ESP32_01	2.77	2026-02-25 20:39:26.048+08	critical
019c94d0-2a45-771b-a4ec-c00c6c8c83b7	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.77	2026-02-25 20:39:29.503+08	critical
019c94d0-2a45-771b-a4ec-c42b17fba46a	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.79	2026-02-25 20:39:32.539+08	critical
019c94d0-2a45-771b-a4ec-ca3104fbe3af	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.79	2026-02-25 20:39:35.301+08	critical
019c94d0-2a45-771b-a4ec-cf3ff91a2191	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:38.3+08	critical
019c94d0-2a45-771b-a4ec-d35caabf6ebd	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:41.411+08	critical
019c94d0-2a45-771b-a4ec-d7738d3f09dd	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.76	2026-02-25 20:39:44.484+08	critical
019c94d0-2a45-771b-a4ec-dbdf34bbc675	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.76	2026-02-25 20:39:47.188+08	critical
019c94d0-2a45-771b-a4ec-ded6fdbbd12d	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.75	2026-02-25 20:39:50.249+08	critical
019c94d0-2a45-771b-a4ec-e0468658b8a9	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.75	2026-02-25 20:39:53.209+08	critical
019c94d0-2a45-771b-a4ec-e560005b81ed	1	2026-02-25 20:39:56.23013+08	2026-02-25 20:39:56.23013+08	\N	DO_ESP32_01	2.78	2026-02-25 20:39:56.086+08	critical
019c94d0-9fe0-7006-a4d0-2b793bb0554f	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:39:59.362+08	critical
019c94d0-9fe0-7006-a4d0-2e0aba5af9bb	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:02.469+08	critical
019c94d0-9fe0-7006-a4d0-32d368cead62	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:05.214+08	critical
019c94d0-9fe0-7006-a4d0-3482305be81f	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:08.271+08	critical
019c94d0-9fe0-7006-a4d0-3b1079094504	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:11.271+08	critical
019c94d0-9fe0-7006-a4d0-3d3c798c7305	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:14.475+08	critical
019c94d0-9fe0-7006-a4d0-422c04b81c30	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:17.193+08	critical
019c94d0-9fe0-7006-a4d0-47c9150621cc	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:20.609+08	critical
019c94d0-9fe0-7006-a4d0-4ace9bacba49	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:23.531+08	critical
019c94d0-9fe0-7006-a4d0-4fd7e17b32eb	1	2026-02-25 20:40:26.336458+08	2026-02-25 20:40:26.336458+08	\N	DO_ESP32_01	0	2026-02-25 20:40:26.191+08	critical
019c94d1-1651-710b-b93b-9430e1febc1f	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0	2026-02-25 20:40:29.405+08	critical
019c94d1-1651-710b-b93b-9bfe3583de28	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0	2026-02-25 20:40:32.92+08	critical
019c94d1-1651-710b-b93b-9dad796b9aa2	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:35.422+08	critical
019c94d1-1651-710b-b93b-a3ee52a4b559	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:38.308+08	critical
019c94d1-1651-710b-b93b-a6c1eb1f78ae	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:41.39+08	critical
019c94d1-1651-710b-b93b-a827b776e5c0	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0	2026-02-25 20:40:44.211+08	critical
019c94d1-1651-710b-b93b-ade3effa045a	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:47.287+08	critical
019c94d1-1651-710b-b93b-b33683636e3e	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0.01	2026-02-25 20:40:50.36+08	critical
019c94d1-1651-710b-b93b-b5cde7987c7f	1	2026-02-25 20:40:56.657435+08	2026-02-25 20:40:56.657435+08	\N	DO_ESP32_01	0	2026-02-25 20:40:53.264+08	critical
019c94d1-7e3c-7715-8388-cf956eba3e11	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0	2026-02-25 20:40:56.93+08	critical
019c94d1-7e3c-7715-8388-d2a369d699de	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0	2026-02-25 20:40:59.188+08	critical
019c94d1-7e3c-7715-8388-d61361e34111	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0	2026-02-25 20:41:02.191+08	critical
019c94d1-7e3c-7715-8388-d892e6a7af69	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0.01	2026-02-25 20:41:05.133+08	critical
019c94d1-7e3c-7715-8388-dd873b4fafd3	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0	2026-02-25 20:41:08.595+08	critical
019c94d1-7e3c-7715-8388-e26c5d38d425	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0.01	2026-02-25 20:41:11.184+08	critical
019c94d1-7e3c-7715-8388-e614b34c81ae	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0.01	2026-02-25 20:41:14.101+08	critical
019c94d1-7e3d-739c-b6b6-cf711afd4870	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0.01	2026-02-25 20:41:17.085+08	critical
019c94d1-7e3d-739c-b6b6-d331a45ab811	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0.01	2026-02-25 20:41:20.18+08	critical
019c94d1-7e3d-739c-b6b6-d5a818060803	1	2026-02-25 20:41:23.261138+08	2026-02-25 20:41:23.261138+08	\N	DO_ESP32_01	0	2026-02-25 20:41:23.114+08	critical
019c94d1-8ab0-7097-b0d3-73b11c01e310	1	2026-02-25 20:41:26.448801+08	2026-02-25 20:41:26.448801+08	\N	DO_ESP32_01	0	2026-02-25 20:41:26.124+08	critical
019c977b-996e-72f7-8bef-0562ab350205	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:29.199+08	critical
019c977b-996e-72f7-8bef-094ef7af8754	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:32.229+08	critical
019c977b-996e-72f7-8bef-0d5433dd3e85	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:35.218+08	critical
019c977b-996e-72f7-8bef-13b8b8e1d9ed	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:38.078+08	critical
019c977b-996e-72f7-8bef-166da4beb7d5	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0.01	2026-02-25 20:41:41.15+08	critical
019c977b-996e-72f7-8bef-19654b9249df	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:44.233+08	critical
019c977b-996e-72f7-8bef-1d470c6b27b9	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:47.363+08	critical
019c977b-996e-72f7-8bef-23dfb1ff72f7	1	2026-02-26 09:06:25.774377+08	2026-02-26 09:06:25.774377+08	\N	DO_ESP32_01	0	2026-02-25 20:41:50.208+08	critical
\.


--
-- TOC entry 5177 (class 0 OID 25726)
-- Dependencies: 223
-- Data for Name: emails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emails (id, version, created_at, updated_at, deleted_at, sender, recepient, subject, body, error_message) FROM stdin;
019b01b4-5759-710c-8c9c-2e2b293fb29a	1	2025-12-09 14:02:34.71472+08	2025-12-09 14:02:34.71472+08	\N	hypercore.tech.solutions@gmail.com	johnmarkpulmano.dev@gmail.com	🚨 CRITICAL: Water Temperature Alert	<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'><div style='background: #e74c3c; color: white; padding: 30px; text-align: center;'><h1>⚠️ Critical Alert</h1><p>Smart Fishpond Monitoring System</p></div><div style='background: #ffffff; padding: 30px; border: 2px solid #e74c3c;'><h2 style='color: #e74c3c;'>Water Temperature TOO HIGH</h2><div style='background: #fff5f5; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;'><p style='margin: 0;'><strong>Pond ID:</strong> POND-001</p><p style='margin: 10px 0 0 0;'><strong>Current Temperature:</strong> <span style='font-size: 24px; color: #e74c3c; font-weight: bold;'>35°C</span></p><p style='margin: 10px 0 0 0;'><strong>Safe Range:</strong> 20°C - 32°C</p></div><h3>🔧 Recommended Actions:</h3><ul><li>Activate aeration system immediately</li><li>Increase water circulation</li><li>Add cool water if available</li><li>Provide shade coverage</li></ul></div></div>	Invalid login: 535-5.7.8 Username and Password not accepted. For more information, go to\n535 5.7.8  https://support.google.com/mail/?p=BadCredentials 41be03b00d2f7-bf6a2746f95sm14452017a12.30 - gsmtp
019b01b9-7040-70ac-ab4f-4e9ef6956018	1	2025-12-09 14:08:08.768096+08	2025-12-09 14:08:08.768096+08	\N	johnmarkpulmano.dev@gmail.com	johnmarkpulmano.dev@gmail.com	🚨 CRITICAL: Water Temperature Alert	<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'><div style='background: #e74c3c; color: white; padding: 30px; text-align: center;'><h1>⚠️ Critical Alert</h1><p>Smart Fishpond Monitoring System</p></div><div style='background: #ffffff; padding: 30px; border: 2px solid #e74c3c;'><h2 style='color: #e74c3c;'>Water Temperature TOO HIGH</h2><div style='background: #fff5f5; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;'><p style='margin: 0;'><strong>Pond ID:</strong> POND-001</p><p style='margin: 10px 0 0 0;'><strong>Current Temperature:</strong> <span style='font-size: 24px; color: #e74c3c; font-weight: bold;'>35°C</span></p><p style='margin: 10px 0 0 0;'><strong>Safe Range:</strong> 20°C - 32°C</p></div><h3>🔧 Recommended Actions:</h3><ul><li>Activate aeration system immediately</li><li>Increase water circulation</li><li>Add cool water if available</li><li>Provide shade coverage</li></ul></div></div>	\N
\.


--
-- TOC entry 5178 (class 0 OID 25739)
-- Dependencies: 224
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, version, created_at, updated_at, deleted_at, employee_id, first_name, middle_name, last_name, email, contact_number, "position", department, is_verified) FROM stdin;
\.


--
-- TOC entry 5179 (class 0 OID 25758)
-- Dependencies: 225
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- TOC entry 5181 (class 0 OID 25767)
-- Dependencies: 227
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, description, url_params, actions, status, author, "timestamp", deleted_at, created_at, updated_at, version) FROM stdin;
019b00e4-f311-748f-9d25-a67b3baefb42	User Account Created	User Account Created Researcher Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:16:03.090458+08	\N	2025-12-09 10:16:03.090458+08	2025-12-09 10:16:03.090458+08	1
019b00e6-f2b7-738d-9eaa-8903b4f4588a	User Account UPDATED	User Account UPDATED System Administrator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:18:14.071288+08	\N	2025-12-09 10:18:14.071288+08	2025-12-09 10:18:14.071288+08	1
019b00e8-711d-7338-85f5-e6eba839807b	User Account Created	User Account Created Fish Pond Operator Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:19:51.965756+08	\N	2025-12-09 10:19:51.965756+08	2025-12-09 10:19:51.965756+08	1
019b00e9-f62c-75e7-8661-e0532a80d84c	User Account Created	User Account Created Monitoring Manager	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 10:21:31.564441+08	\N	2025-12-09 10:21:31.564441+08	2025-12-09 10:21:31.564441+08	1
019b020c-920f-70c9-9230-f13262c57faa	User Account UPDATED	User Account UPDATED System Administrator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 15:38:56.91204+08	\N	2025-12-09 15:38:56.91204+08	2025-12-09 15:38:56.91204+08	1
019b020c-b274-72c1-9f41-83ced62852eb	User Account UPDATED	User Account UPDATED Monitoring Manager	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 15:39:05.20436+08	\N	2025-12-09 15:39:05.20436+08	2025-12-09 15:39:05.20436+08	1
019b020c-cc24-7158-9e92-4af6bed593d5	User Account UPDATED	User Account UPDATED Fish Pond Operator Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 15:39:11.780286+08	\N	2025-12-09 15:39:11.780286+08	2025-12-09 15:39:11.780286+08	1
019b020c-e7b6-7089-a27d-4753349d417c	User Account UPDATED	User Account UPDATED Researcher Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 15:39:18.838225+08	\N	2025-12-09 15:39:18.838225+08	2025-12-09 15:39:18.838225+08	1
019b020d-151e-73db-9a64-66c834ec3fd6	User Account UPDATED	User Account UPDATED System Moderator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-09 15:39:30.463245+08	\N	2025-12-09 15:39:30.463245+08	2025-12-09 15:39:30.463245+08	1
\.


--
-- TOC entry 5182 (class 0 OID 25781)
-- Dependencies: 228
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
-- TOC entry 5188 (class 0 OID 25936)
-- Dependencies: 234
-- Data for Name: ph_level_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ph_level_records (id, version, created_at, updated_at, deleted_at, sensor_id, ph_level, "timestamp", status) FROM stdin;
019c94c7-02f8-75ef-ac11-9a82c54d9e2a	1	2026-02-25 20:29:56.34518+08	2026-02-25 20:29:56.34518+08	\N	PH_ESP32_01	6.51	2026-02-25 20:29:43.923+08	normal
019c94c7-02f8-75ef-ac11-9c50e298e546	1	2026-02-25 20:29:56.34518+08	2026-02-25 20:29:56.34518+08	\N	PH_ESP32_01	6.51	2026-02-25 20:29:46.911+08	normal
019c94c7-02f8-75ef-ac11-a1f93efa782c	1	2026-02-25 20:29:56.34518+08	2026-02-25 20:29:56.34518+08	\N	PH_ESP32_01	6.51	2026-02-25 20:29:50.09+08	normal
019c94c7-02f8-75ef-ac11-a4b6f03491e1	1	2026-02-25 20:29:56.34518+08	2026-02-25 20:29:56.34518+08	\N	PH_ESP32_01	6.51	2026-02-25 20:29:53.162+08	normal
019c94c7-02f8-75ef-ac11-a9b9820395b4	1	2026-02-25 20:29:56.34518+08	2026-02-25 20:29:56.34518+08	\N	PH_ESP32_01	6.51	2026-02-25 20:29:56.028+08	normal
019c94c7-76e0-778f-95ca-1907943f4983	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:29:58.903+08	normal
019c94c7-76e0-778f-95ca-1d87613c63a6	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:01.928+08	normal
019c94c7-76e0-778f-95ca-20fa81b97c46	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:05.07+08	normal
019c94c7-76e0-778f-95ca-26aea4a05e92	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:08.215+08	normal
019c94c7-76e0-778f-95ca-2888d79022b8	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:11.016+08	normal
019c94c7-76e0-778f-95ca-2c1741bff117	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:14.459+08	normal
019c94c7-76e0-778f-95ca-32269265d0f4	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:16.955+08	normal
019c94c7-76e0-778f-95ca-37d6c7ccf02a	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:20.026+08	normal
019c94c7-76e0-778f-95ca-39c762c37394	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:23.164+08	normal
019c94c7-76e0-778f-95ca-3c7a32074875	1	2026-02-25 20:30:26.016247+08	2026-02-25 20:30:26.016247+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:25.932+08	normal
019c94c7-ed66-706c-bbc9-46827f367215	1	2026-02-25 20:30:56.359136+08	2026-02-25 20:30:56.359136+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:29.101+08	normal
019c94c7-ed66-706c-bbc9-4865b1c21936	1	2026-02-25 20:30:56.359136+08	2026-02-25 20:30:56.359136+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:31.93+08	normal
019c94c7-ed66-706c-bbc9-4eecceb02bd6	1	2026-02-25 20:30:56.359136+08	2026-02-25 20:30:56.359136+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:34.939+08	normal
019c94c7-ed66-706c-bbc9-531b6ab23559	1	2026-02-25 20:30:56.359136+08	2026-02-25 20:30:56.359136+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:38.012+08	normal
019c94c7-ed66-706c-bbc9-5717be2172cc	1	2026-02-25 20:30:56.359136+08	2026-02-25 20:30:56.359136+08	\N	PH_ESP32_01	6.51	2026-02-25 20:30:41.004+08	normal
\.


--
-- TOC entry 5183 (class 0 OID 25795)
-- Dependencies: 229
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
-- TOC entry 5184 (class 0 OID 25809)
-- Dependencies: 230
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "ipAddress", device, "userId", "expiresAt", created_at, deleted_at, updated_at, version) FROM stdin;
019b01b4-49b6-756e-8a52-adb247cffe5d	::1	PostmanRuntime/7.49.1	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-10 14:02:31.221+08	2025-12-09 14:02:31.22382+08	\N	2025-12-09 14:02:31.22382+08	1
019b05c2-e27e-7448-8177-1bdee30aa3f8	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-11 08:56:56.702+08	2025-12-10 08:56:56.702865+08	\N	2025-12-10 08:56:56.702865+08	1
019b0af2-6484-763b-963f-99d194ba65f1	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-12 09:06:56.259+08	2025-12-11 09:06:56.260975+08	\N	2025-12-11 09:06:56.260975+08	1
019b0c86-38c4-705c-8407-38a1bc7c57fa	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-12 16:28:01.603+08	2025-12-11 16:28:01.605243+08	\N	2025-12-11 16:28:01.605243+08	1
019b0c86-3b80-7163-a7dd-cf2d03928282	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-12-12 16:28:02.303+08	2025-12-11 16:28:02.30523+08	\N	2025-12-11 16:28:02.30523+08	1
019b9d72-14ad-71f5-991b-d605e350d58a	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-01-09 19:50:57.964+08	2026-01-08 19:50:57.965404+08	\N	2026-01-08 19:50:57.965404+08	1
019bd081-3bf3-7279-83a9-999bcccd2394	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-01-19 17:48:09.073+08	2026-01-18 17:48:09.075049+08	\N	2026-01-18 17:48:09.075049+08	1
019bd081-426d-705c-893b-1039c4e9d9eb	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-01-19 17:48:10.732+08	2026-01-18 17:48:10.733141+08	\N	2026-01-18 17:48:10.733141+08	1
019bd081-61dd-73e5-bc1c-2b6b564ab987	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-01-19 17:48:18.78+08	2026-01-18 17:48:18.781388+08	\N	2026-01-18 17:48:18.781388+08	1
019c0ee2-b4a4-73ff-a2f5-620e9496b5a5	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-01-31 20:31:04.354+08	2026-01-30 20:31:04.356207+08	\N	2026-01-30 20:31:04.356207+08	1
019c370e-4bc0-72c9-abf0-b0851364a189	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-02-08 15:43:29.727+08	2026-02-07 15:43:29.728246+08	\N	2026-02-07 15:43:29.728246+08	1
019c7f00-a57e-759a-8907-dbc33d211831	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-02-22 15:01:14.749+08	2026-02-21 15:01:14.750918+08	\N	2026-02-21 15:01:14.750918+08	1
019c8a6d-daba-758d-8a9d-3d9ffed8f148	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-02-24 20:16:21.176+08	2026-02-23 20:16:21.178273+08	\N	2026-02-23 20:16:21.178273+08	1
019c947b-c89f-77bb-b65a-f363a89aa941	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-02-26 19:07:46.207+08	2026-02-25 19:07:46.208437+08	\N	2026-02-25 19:07:46.208437+08	1
019c9ed8-7ba8-7288-9851-6e53b6952e0f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2026-02-28 19:25:13.511+08	2026-02-27 19:25:13.512463+08	\N	2026-02-27 19:25:13.512463+08	1
\.


--
-- TOC entry 5189 (class 0 OID 25951)
-- Dependencies: 235
-- Data for Name: temperature_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temperature_records (id, version, created_at, updated_at, deleted_at, sensor_id, temperature, "timestamp", unit) FROM stdin;
019c94c4-4420-70c5-90ee-31c038259049	1	2026-02-25 20:26:56.416523+08	2026-02-25 20:26:56.416523+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:40.783+08	°C
019c94c4-4421-7210-a42a-c78f0fe67776	1	2026-02-25 20:26:56.416523+08	2026-02-25 20:26:56.416523+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:43.822+08	°C
019c94c4-4421-7210-a42a-c94824cbd53f	1	2026-02-25 20:26:56.416523+08	2026-02-25 20:26:56.416523+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:46.999+08	°C
019c94c4-4421-7210-a42a-ceb9bfcdd3f2	1	2026-02-25 20:26:56.416523+08	2026-02-25 20:26:56.416523+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:49.794+08	°C
019c94c4-4421-7210-a42a-d04b99cfa9ab	1	2026-02-25 20:26:56.416523+08	2026-02-25 20:26:56.416523+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:52.834+08	°C
019c94c4-4421-7210-a42a-d5a9d30db45a	1	2026-02-25 20:26:56.416523+08	2026-02-25 20:26:56.416523+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:55.907+08	°C
019c94c4-b73c-741f-a146-ba506c69aed7	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:26:58.874+08	°C
019c94c4-b73c-741f-a146-be1aebaab1b3	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:27:01.794+08	°C
019c94c4-b73c-741f-a146-c332e2705576	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:27:04.813+08	°C
019c94c4-b73c-741f-a146-c48c64438f84	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:27:07.797+08	°C
019c94c4-b73c-741f-a146-c8db3c7b7d7c	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:10.788+08	°C
019c94c4-b73c-741f-a146-ce8ab0ee96e5	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:13.786+08	°C
019c94c4-b73c-741f-a146-d26ef6f84b37	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:16.898+08	°C
019c94c4-b73c-741f-a146-d77bff4de67e	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:27:20.086+08	°C
019c94c4-b73c-741f-a146-dbf7f56e3a78	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.44	2026-02-25 20:27:22.839+08	°C
019c94c4-b73c-741f-a146-dfa5618c8df7	1	2026-02-25 20:27:25.885208+08	2026-02-25 20:27:25.885208+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:25.788+08	°C
019c94c5-2e80-750a-b6f2-606ba1641864	1	2026-02-25 20:27:56.417811+08	2026-02-25 20:27:56.417811+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:28.79+08	°C
019c94c5-2e81-707a-b4c6-12791e5a95e5	1	2026-02-25 20:27:56.417811+08	2026-02-25 20:27:56.417811+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:31.785+08	°C
019c94c5-2e81-707a-b4c6-174828bfdb9c	1	2026-02-25 20:27:56.417811+08	2026-02-25 20:27:56.417811+08	\N	TEMP_ESP32_01	30.5	2026-02-25 20:27:34.789+08	°C
\.


--
-- TOC entry 5185 (class 0 OID 25819)
-- Dependencies: 231
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
-- TOC entry 5186 (class 0 OID 25831)
-- Dependencies: 232
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, user_name, email, password, failed_attempts, version, role_id, profile_image, pass_key, access, lockout_until, deleted_at, created_at, updated_at) FROM stdin;
019b00e9-f61f-73d9-b02a-e882acf17983	Monitoring Manager	@monitoringmanager	monitoringmanager.demo@mail.com	$2b$10$xvKr.5.5rmrDewDRysNWduNk/zijgEAtN/pL5XG/dhT05QS38tb4K	0	4	019b00be-e1a0-77d8-bbc9-e433652a09de	\N	$2b$10$dYjYt1sbGUNHYP38TAOuRO9f0Qw8LomwTR98bvHEiZA0sNFkm2J0C	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring","/do-monitoring"]	\N	\N	2025-12-09 10:21:31.552+08	2025-12-09 10:21:31.552+08
019b00e8-7114-74bf-8954-5de6625c4e52	Fish Pond Operator Demo	@fishpondoperator	fishpondoperator.demo@mail.com	$2b$10$ZwrRv.jBBU39ieF580tPFOuLX52SBcIlTCABfkm7VAQthm9QAeGjK	0	5	019b00be-a6c6-719c-9be8-8f44f0fca0ec	\N	$2b$10$coBEiEA7OoWaPjTFo7zuNuoUHu8v/xr6lnTLjEjlVRp8gfCgU6gXK	["/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring","/do-monitoring"]	\N	\N	2025-12-09 10:19:51.956+08	2025-12-09 10:19:51.956+08
019b00e4-f2fe-73ee-9b1d-18d9fb4a0369	Researcher Demo	@researcher	researcher.demo@mail.com	$2b$10$F2rFpIAywkhYQcGagBNYfeM0fOEv0SqZBW7bfAWd3R7XhQ6qG5OTy	0	9	019b00be-1b25-7418-92d2-acbc60408ec1	\N	$2b$10$wIQc6JXWFLW.oGAN8sQCzeNoWnOpXM3YxRv3QDztJ84JvEHr3BoZe	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring","/do-monitoring"]	\N	\N	2025-12-09 10:16:03.071+08	2025-12-09 10:16:03.071+08
019a99e7-111f-732e-87fe-ae62fc6714d8	System Moderator	@moderator	moderator@email.com	$2b$10$CRMbvc.dh/coMc6NLksfTOq/P4/ux2R3kvhG4zsfo3YaNW5997z2W	0	7	01997a38-a91d-7288-b61b-49329c911b5d	/uploads/users_profile_images/System Moderator-1763518761026.png	$2b$10$mvvtPfX2cc4JX.odjW/PJ.b3CbPBZ9B.bISim151RMvBXGBHzxK9e	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring","/do-monitoring"]	\N	\N	2025-11-19 10:17:28.608+08	2025-11-19 10:17:28.608+08
01997ac6-c5bb-7589-b79f-a6509ea5d44a	System Administrator	@admin	admin@email.com	$2b$10$Rf4GPpj4ZecQRcouop0Foe5GFdN2KBTYXqKULl.EJtp5wUVG.kbge	0	101	0199799e-a53c-712a-a759-5fee5d7e0cf5	/uploads/users_profile_images/System Administrator-1761726512573.png	$2b$10$jdV9D6RyqFw1dDPTTC1Xk.dqYVhSac/zgOu5KxRCHDiqhgk6Uevau	["/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications","/dashboard","/profile","/account","/temperature-monitoring","/turbidity-monitoring","/ph-water-monitoring","/water-level-monitoring","/do-monitoring"]	\N	\N	2025-09-24 16:11:11.162+08	2025-11-04 16:44:24.886+08
\.


--
-- TOC entry 5190 (class 0 OID 25966)
-- Dependencies: 236
-- Data for Name: water_level_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.water_level_records (id, version, created_at, updated_at, deleted_at, sensor_id, level, "timestamp", status) FROM stdin;
019c94c8-629c-775d-8515-9cf302794d68	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:30:59.336+08	stable
019c94c8-629c-775d-8515-a10d9b9e575a	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:31:02.487+08	stable
019c94c8-629c-775d-8515-a6c640e357f7	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:31:05.454+08	stable
019c94c8-629c-775d-8515-a8d9c532293c	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:31:08.428+08	stable
019c94c8-629c-775d-8515-ad189b41e127	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:31:11.328+08	stable
019c94c8-629c-775d-8515-b3e6fc000417	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:31:14.387+08	stable
019c94c8-629c-775d-8515-b54ce15fa0e1	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	1	2026-02-25 20:31:17.274+08	stable
019c94c8-629c-775d-8515-bbd6fa6032aa	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:20.164+08	low
019c94c8-629c-775d-8515-bc66ad93c9c4	1	2026-02-25 20:31:26.364952+08	2026-02-25 20:31:26.364952+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:23.474+08	low
019c94c8-cc58-75f9-818d-a31410d83e5a	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:26.377+08	low
019c94c8-cc58-75f9-818d-a5d662ef128c	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:29.45+08	low
019c94c8-cc58-75f9-818d-ab85e812c400	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:32.243+08	low
019c94c8-cc58-75f9-818d-ac368b7f29a7	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:35.255+08	low
019c94c8-cc58-75f9-818d-b2837ba83368	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:38.324+08	low
019c94c8-cc58-75f9-818d-b7ff57e7000f	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:41.293+08	low
019c94c8-cc58-75f9-818d-b9cd0a9bd7dc	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:44.365+08	low
019c94c8-cc58-75f9-818d-bebc5679214c	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:47.243+08	low
019c94c8-cc58-75f9-818d-c3d008c49270	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:50.31+08	low
019c94c8-cc58-75f9-818d-c5f2a6699832	1	2026-02-25 20:31:53.43262+08	2026-02-25 20:31:53.43262+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:53.377+08	low
019c94c9-4ccc-70ae-9f2c-af23e269122e	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:56.348+08	low
019c94c9-4ccc-70ae-9f2c-b3f07b840bb3	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:31:59.348+08	low
019c94c9-4ccc-70ae-9f2c-b6a807849c49	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:02.318+08	low
019c94c9-4ccc-70ae-9f2c-b8329b4c3546	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:05.359+08	low
019c94c9-4ccc-70ae-9f2c-bfd53e8cf960	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:08.33+08	low
019c94c9-4ccc-70ae-9f2c-c1da5805cda9	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:11.425+08	low
019c94c9-4ccc-70ae-9f2c-c44e4bbcb077	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:14.29+08	low
019c94c9-4ccc-70ae-9f2c-c8f1040541e6	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:17.34+08	low
019c94c9-4ccc-70ae-9f2c-cff1a0d8c43f	1	2026-02-25 20:32:26.315898+08	2026-02-25 20:32:26.315898+08	\N	FLOAT_ESP32_01	0	2026-02-25 20:32:20.213+08	low
\.


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 226
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- TOC entry 5006 (class 2606 OID 25851)
-- Name: user_permissions PK_01f4295968ba33d73926684264f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 25980)
-- Name: water_level_records PK_100fd87bf10c8706be58141e86f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.water_level_records
    ADD CONSTRAINT "PK_100fd87bf10c8706be58141e86f" PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 25853)
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 25950)
-- Name: ph_level_records PK_1c601245ba85a5a90b2ea22677d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ph_level_records
    ADD CONSTRAINT "PK_1c601245ba85a5a90b2ea22677d" PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 25855)
-- Name: sessions PK_3238ef96f18b355b671619111bc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 25935)
-- Name: dissolved_oxygen_records PK_4f798b0fb5b888dfe07faed5fb0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissolved_oxygen_records
    ADD CONSTRAINT "PK_4f798b0fb5b888dfe07faed5fb0" PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 25857)
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 25965)
-- Name: temperature_records PK_8ae3b5e638f07a4b2c147c86649; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temperature_records
    ADD CONSTRAINT "PK_8ae3b5e638f07a4b2c147c86649" PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 25859)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 25861)
-- Name: permissions PK_920331560282b8bd21bb02290df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 25863)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 25865)
-- Name: emails PK_a54dcebef8d05dca7e839749571; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 25867)
-- Name: employees PK_b9535a98350d5b26e7eb0c26af4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 25869)
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 25871)
-- Name: auth_logs PK_f4ee581a4a56f10b64ffbfc1779; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "PK_f4ee581a4a56f10b64ffbfc1779" PRIMARY KEY (id);


--
-- TOC entry 5010 (class 2606 OID 25873)
-- Name: users UQ_074a1f262efaca6aba16f7ed920; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE (user_name);


--
-- TOC entry 4987 (class 2606 OID 25875)
-- Name: employees UQ_765bc1ac8967533a04c74a9f6af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE (email);


--
-- TOC entry 5012 (class 2606 OID 25877)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 4989 (class 2606 OID 25879)
-- Name: employees UQ_c9a09b8e6588fb4d3c9051c8937; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_c9a09b8e6588fb4d3c9051c8937" UNIQUE (employee_id);


--
-- TOC entry 5001 (class 2606 OID 25881)
-- Name: roles UQ_ccc7c1489f3a6b3c9b47d4537c5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE (role);


--
-- TOC entry 4997 (class 2606 OID 25883)
-- Name: permissions UQ_efcbbce13db89dbd3ef8b7690ae; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "UQ_efcbbce13db89dbd3ef8b7690ae" UNIQUE (permission);


--
-- TOC entry 5002 (class 1259 OID 25884)
-- Name: IDX_13270b51f461a0ebfc0808ef62; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_13270b51f461a0ebfc0808ef62" ON public.sessions USING btree ("userId", "expiresAt");


--
-- TOC entry 4979 (class 1259 OID 25885)
-- Name: IDX_3dc66dbf37e5f226ef06db37cf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3dc66dbf37e5f226ef06db37cf" ON public.auth_logs USING btree ("userId", timestamptz);


--
-- TOC entry 5023 (class 2606 OID 25886)
-- Name: notifications FK_312d0b2167068d5f1fb30f5f673; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_312d0b2167068d5f1fb30f5f673" FOREIGN KEY (author) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5025 (class 2606 OID 25891)
-- Name: user_permissions FK_3495bd31f1862d02931e8e8d2e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 25896)
-- Name: auth_logs FK_564498ad3b1e8e338de48222381; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "FK_564498ad3b1e8e338de48222381" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 25901)
-- Name: sessions FK_57de40bc620f456c7311aa3a1e6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 25906)
-- Name: user_permissions FK_8145f5fadacd311693c15e41f10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- TOC entry 5027 (class 2606 OID 25911)
-- Name: users FK_a2cecd1a3531c0b041e29ba46e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 5021 (class 2606 OID 25916)
-- Name: audit_logs FK_ae97aac6d6d471b9d88cea1c971; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971" FOREIGN KEY (performed_by) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-02-28 09:20:09

--
-- PostgreSQL database dump complete
--

\unrestrict tLRwcthj3ejerREXDqUkF2K8ND0L8wd2ZPCFG00Apy8QpnuNoLByjp0Saj4akVj

