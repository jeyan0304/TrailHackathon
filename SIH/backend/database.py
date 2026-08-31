"""
NER-SafeSlope Landslide Risk Assessment Engine - Database Access Layer

Connects to the Supabase database using existing client environment credentials.
Provides clean query interfaces for:
- risk_zones
- weather_data
- landslide_events
- risk_assessments
"""

import os
import json
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path


def load_env_file() -> Dict[str, str]:
    """
    Parses environment variables from local .env files without requiring external packages.
    Checks backend/.env and project root .env.
    """
    env_vars = {}
    search_paths = [
        Path(__file__).parent / ".env",
        Path(__file__).parent.parent / ".env",
        Path.cwd() / ".env",
        Path.cwd() / "SIH" / ".env",
    ]

    for p in search_paths:
        if p.is_file():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            env_vars[k.strip()] = v.strip().strip("'\"")
            except Exception as e:
                print(f"[Notice] Could not read env from {p}: {e}")

    return env_vars


ENV = load_env_file()

# Resolve Supabase Configuration
SUPABASE_URL = (
    os.environ.get("SUPABASE_URL")
    or os.environ.get("VITE_SUPABASE_URL")
    or ENV.get("SUPABASE_URL")
    or ENV.get("VITE_SUPABASE_URL")
    or ""
).rstrip("/")

SUPABASE_KEY = (
    os.environ.get("SUPABASE_KEY")
    or os.environ.get("SUPABASE_ANON_KEY")
    or os.environ.get("VITE_SUPABASE_PUBLISHABLE_KEY")
    or ENV.get("SUPABASE_KEY")
    or ENV.get("SUPABASE_ANON_KEY")
    or ENV.get("VITE_SUPABASE_PUBLISHABLE_KEY")
    or ""
)


def _supabase_request(endpoint: str, method: str = "GET", payload: Optional[Dict[str, Any]] = None) -> Tuple[Optional[Any], Optional[str]]:
    """
    Executes an authenticated HTTP REST request against Supabase PostgREST API using standard library.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None, "Missing SUPABASE_URL or SUPABASE_KEY in environment"

    url = f"{SUPABASE_URL}/rest/v1/{endpoint.lstrip('/')}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    data_bytes = None
    if payload is not None:
        data_bytes = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            body = response.read().decode("utf-8")
            if body:
                return json.loads(body), None
            return [], None
    except urllib.error.HTTPError as he:
        err_body = he.read().decode("utf-8", errors="ignore")
        return None, f"HTTP Error {he.code}: {err_body or he.reason}"
    except urllib.error.URLError as ue:
        return None, f"URL Error: {ue.reason}"
    except Exception as e:
        return None, f"Request Exception: {str(e)}"


def fetch_risk_zones() -> Tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Fetches monitored sectors from the existing `risk_zones` table.
    Columns: id, name, latitude, longitude, slope_angle, soil_moisture
    """
    data, err = _supabase_request("risk_zones?select=id,name,latitude,longitude,slope_angle,soil_moisture")
    if err:
        return [], err
    return data or [], None


def fetch_weather_data() -> Tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Fetches telemetry records from the existing `weather_data` table.
    Columns: id, risk_zone_id, rainfall, rainfall_accumulation, temperature, humidity, timestamp
    """
    data, err = _supabase_request("weather_data?select=id,risk_zone_id,rainfall,rainfall_accumulation,temperature,humidity,timestamp&order=timestamp.desc")
    if err:
        return [], err
    return data or [], None


def fetch_landslide_events() -> Tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Fetches geological record from the existing `landslide_events` table.
    Columns: id, risk_zone_id, date, description, latitude, longitude
    """
    data, err = _supabase_request("landslide_events?select=id,risk_zone_id,date,description,latitude,longitude")
    if err:
        return [], err
    return data or [], None


def fetch_risk_assessments() -> Tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Fetches existing risk assessment records from `risk_assessments` table.
    Columns: id, risk_zone_id, risk_score, risk_level, contributing_factors, timestamp
    """
    data, err = _supabase_request("risk_assessments?select=id,risk_zone_id,risk_score,risk_level,contributing_factors,timestamp&order=timestamp.desc")
    if err:
        return [], err
    return data or [], None


def write_risk_assessment(payload: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Attempts to write a computed risk assessment to the existing `risk_assessments` table.
    Gracefully returns RLS / permission notices if blocked by policy.
    """
    data, err = _supabase_request("risk_assessments", method="POST", payload=payload)
    if err:
        return None, err
    if data and isinstance(data, list) and len(data) > 0:
        return data[0], None
    return None, None
