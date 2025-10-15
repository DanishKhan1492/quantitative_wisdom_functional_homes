--
-- PostgreSQL database dump
--

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

------------------------------------------------------------
-- Table structure for table: category
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.category (
                                               category_id     BIGSERIAL PRIMARY KEY,
                                               category_name   VARCHAR(100) NOT NULL UNIQUE,
    category_type   VARCHAR(20) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    created_by      BIGINT,
    updated_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_by      BIGINT,
    CONSTRAINT check_category_type CHECK (
                                             category_type IN ('Apartment', 'Furniture', 'Product', 'Other')
    )
    );

ALTER TABLE public.category OWNER TO postgres;

------------------------------------------------------------
-- Table data for table: category
------------------------------------------------------------

INSERT INTO public.category (
    category_id,
    category_name,
    category_type,
    description,
    created_at,
    created_by,
    updated_at,
    updated_by
) VALUES
      (1, 'Low Cost', 'Apartment', 'Low Cost', '2025-09-20 12:00:20.079795', 1, '2025-09-20 12:00:20.081653', NULL),
      (2, 'Average Cost', 'Apartment', 'Average Cost', '2025-09-20 12:00:39.125353', 1, '2025-09-20 12:00:39.125470', NULL),
      (3, 'Luxury', 'Apartment', 'Luxury', '2025-09-20 12:00:52.225158', 1, '2025-09-20 12:00:52.225279', NULL),
      (4, 'Bedroom Furniture', 'Furniture', 'Bedroom', '2025-09-20 12:02:52.513297', 1, '2025-09-20 12:02:52.513402', NULL),
      (5, 'Living Room', 'Furniture', 'Living Room', '2025-09-20 12:03:09.065529', 1, '2025-09-20 12:03:09.065670', NULL),
      (6, 'Outdoor Furniture', 'Furniture', 'Outdoor', '2025-09-20 12:03:23.170688', 1, '2025-09-20 12:03:23.170799', NULL);

------------------------------------------------------------
-- Foreign key constraints
------------------------------------------------------------

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_created_by
    FOREIGN KEY (created_by) REFERENCES public.users(user_id);

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_updated_by
    FOREIGN KEY (updated_by) REFERENCES public.users(user_id);

------------------------------------------------------------
-- PostgreSQL database dump complete
------------------------------------------------------------
