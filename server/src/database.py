from __future__ import annotations

import hashlib
import os
import random
import re
import sqlite3
from contextlib import contextmanager
from typing import Generator

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "db.sqlite")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT NOT NULL UNIQUE,
    age_range TEXT,
    sex TEXT CHECK (sex IN ('Male','Female','Other','Unknown') OR sex IS NULL),
    wearable INTEGER NOT NULL DEFAULT 0 CHECK (wearable IN (0,1)),
    searchable INTEGER NOT NULL DEFAULT 1 CHECK (searchable IN (0,1)),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    indicator_count INTEGER NOT NULL DEFAULT 0,
    model TEXT NOT NULL DEFAULT '',
    char_count INTEGER NOT NULL DEFAULT 0,
    chunk_count INTEGER NOT NULL DEFAULT 0,
    page_count INTEGER NOT NULL DEFAULT 0,
    source_pdf_sha256 TEXT,
    raw_parse_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS report_indicators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    indicator_id TEXT NOT NULL,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_normalized TEXT NOT NULL,
    value TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL DEFAULT '',
    reference_range TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT '',
    instrument TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    UNIQUE(report_id, indicator_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_public_id ON profiles(public_id);
CREATE INDEX IF NOT EXISTS idx_profiles_search_filters ON profiles(searchable, sex, age_range);
CREATE INDEX IF NOT EXISTS idx_reports_profile_created ON reports(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_indicators_category ON report_indicators(report_id, category_normalized);
CREATE INDEX IF NOT EXISTS idx_report_indicators_name ON report_indicators(report_id, normalized_name);
"""


def init_db() -> None:
    os.makedirs(os.path.dirname(os.path.abspath(DB_PATH)), exist_ok=True)
    with _get_conn() as conn:
        conn.executescript(_SCHEMA)


@contextmanager
def _get_conn() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _normalize(value: str) -> str:
    return re.sub(r"[\u2013\u2014]", "-", value).strip().lower()


def _generate_public_id() -> str:
    return f"anon_{random.randint(1000, 9999)}"


def save_parse_result(result: dict) -> int:
    """Persist a parsed report and return the report id."""
    raw_json = __import__("json").dumps(result)
    sha256 = hashlib.sha256(raw_json.encode()).hexdigest()
    meta: dict = result.get("meta") or {}
    indicators: list[dict] = result.get("indicators") or []

    with _get_conn() as conn:
        # Create an anonymous profile per upload
        public_id = _generate_public_id()
        while conn.execute("SELECT 1 FROM profiles WHERE public_id = ?", (public_id,)).fetchone():
            public_id = _generate_public_id()

        profile_id: int = conn.execute(
            "INSERT INTO profiles (public_id) VALUES (?)",
            (public_id,),
        ).lastrowid  # type: ignore[assignment]

        report_id: int = conn.execute(
            """
            INSERT INTO reports
                (profile_id, file_name, content_type, indicator_count,
                 model, char_count, chunk_count, page_count, source_pdf_sha256, raw_parse_json)
            VALUES (?,?,?,?,?,?,?,?,?,?)
            """,
            (
                profile_id,
                result.get("fileName", ""),
                result.get("contentType", "application/pdf"),
                result.get("indicatorCount", 0),
                meta.get("model", ""),
                meta.get("char_count", 0),
                meta.get("chunk_count", 0),
                meta.get("page_count", 0),
                sha256,
                raw_json,
            ),
        ).lastrowid  # type: ignore[assignment]

        for pos, ind in enumerate(indicators):
            try:
                conn.execute(
                    """
                    INSERT OR IGNORE INTO report_indicators
                        (report_id, profile_id, position, indicator_id,
                         name, normalized_name, category, category_normalized,
                         value, unit, reference_range, status, instrument)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
                    """,
                    (
                        report_id,
                        profile_id,
                        pos,
                        ind.get("id", f"indicator-{pos}"),
                        ind.get("name", ""),
                        _normalize(ind.get("name", "")),
                        ind.get("category", "Lab Results"),
                        _normalize(ind.get("category", "lab results")),
                        ind.get("value", ""),
                        ind.get("unit", ""),
                        ind.get("referenceRange", ""),
                        ind.get("status", ""),
                        ind.get("instrument", ""),
                    ),
                )
            except sqlite3.IntegrityError:
                pass

    return report_id


def search_profiles(
    q: str | None = None,
    condition: str | None = None,
    medication: str | None = None,
    age: str | None = None,
    sex: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> dict:
    limit = min(max(1, limit), 100)
    offset = max(0, offset)

    q_norm = _normalize(q) if q else None
    condition_norm = _normalize(condition) if condition else None
    medication_norm = _normalize(medication) if medication else None
    age_norm = _normalize(age) if age else None
    sex_val = sex.strip() if sex else None
    q_like = f"%{q_norm}%" if q_norm else None

    with _get_conn() as conn:
        # Latest report per searchable profile
        rows = conn.execute(
            """
            WITH latest AS (
                SELECT r.id AS report_id, r.profile_id,
                       ROW_NUMBER() OVER (PARTITION BY r.profile_id ORDER BY r.created_at DESC, r.id DESC) AS rn
                FROM reports r
            )
            SELECT
                p.public_id AS id,
                COALESCE(p.age_range, 'Unknown') AS ageRange,
                COALESCE(p.sex, 'Unknown') AS sex,
                p.wearable,
                l.report_id
            FROM profiles p
            JOIN latest l ON l.profile_id = p.id AND l.rn = 1
            WHERE p.searchable = 1
              AND (:age IS NULL OR p.age_range = :age)
              AND (:sex IS NULL OR p.sex = :sex)
              AND (:condition_norm IS NULL OR EXISTS (
                    SELECT 1 FROM report_indicators ri
                    WHERE ri.report_id = l.report_id
                      AND ri.category_normalized = 'conditions & diagnoses'
                      AND ri.normalized_name = :condition_norm))
              AND (:medication_norm IS NULL OR EXISTS (
                    SELECT 1 FROM report_indicators ri
                    WHERE ri.report_id = l.report_id
                      AND ri.category_normalized = 'medications'
                      AND ri.normalized_name = :medication_norm))
              AND (:q_like IS NULL OR EXISTS (
                    SELECT 1 FROM report_indicators ri
                    WHERE ri.report_id = l.report_id
                      AND (ri.normalized_name LIKE :q_like
                           OR ri.category_normalized LIKE :q_like)))
            """,
            {
                "age": age_norm,
                "sex": sex_val,
                "condition_norm": condition_norm,
                "medication_norm": medication_norm,
                "q_like": q_like,
            },
        ).fetchall()

        items = []
        for row in rows:
            report_id = row["report_id"]

            conditions = [
                r[0] for r in conn.execute(
                    "SELECT DISTINCT name FROM report_indicators "
                    "WHERE report_id = ? AND category_normalized = 'conditions & diagnoses' "
                    "ORDER BY name LIMIT 5",
                    (report_id,),
                ).fetchall()
            ]
            meds = [
                r[0] for r in conn.execute(
                    "SELECT DISTINCT name FROM report_indicators "
                    "WHERE report_id = ? AND category_normalized = 'medications' "
                    "ORDER BY name LIMIT 5",
                    (report_id,),
                ).fetchall()
            ]

            # Simple matchScore
            score = 100
            if any([q_norm, condition_norm, medication_norm, age_norm, sex_val]):
                score = 0
                if condition_norm and any(_normalize(c) == condition_norm for c in conditions):
                    score += 40
                if medication_norm and any(_normalize(m) == medication_norm for m in meds):
                    score += 40
                if age_norm:
                    score += 10
                if sex_val:
                    score += 10
                if q_norm:
                    score += min(20, 5)
                score = min(score, 100)

            items.append({
                "id": row["id"],
                "conditions": conditions,
                "meds": meds,
                "ageRange": row["ageRange"],
                "sex": row["sex"],
                "matchScore": score,
                "wearable": bool(row["wearable"]),
            })

        items.sort(key=lambda x: x["matchScore"], reverse=True)
        total = len(items)
        return {
            "items": items[offset: offset + limit],
            "total": total,
            "limit": limit,
            "offset": offset,
        }
