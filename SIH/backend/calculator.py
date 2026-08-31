"""
NER-SafeSlope Landslide Risk Assessment Engine - Calculation Module

Implements the official 4-factor weighted landslide hazard formula:
- Rainfall Accumulation / Intensity: 40%
- Slope Angle (Topography):          30%
- Soil Moisture (Saturation):       20%
- Historical Landslide Frequency:   10%

Formula:
  Risk Score = (Rainfall_Norm * 0.40) + (Slope_Norm * 0.30) + (SoilMoisture_Norm * 0.20) + (History_Norm * 0.10)
  Range: 0 to 100

Risk Level Classifications:
  0  - 30  -> LOW
  31 - 60  -> MODERATE
  61 - 80  -> HIGH
  81 - 100 -> CRITICAL
"""

from typing import List, Dict, Any


# Fixed Weights
WEIGHT_RAINFALL = 0.40
WEIGHT_SLOPE = 0.30
WEIGHT_SOIL_MOISTURE = 0.20
WEIGHT_HISTORICAL_EVENTS = 0.10

# Natural Geotechnical Normalization Thresholds for Himalayan / North-Eastern Terrain
MAX_RAINFALL_THRESHOLD_MM = 135.0  # 135mm+ 24h cloudburst accumulation = 100% rain risk score
MAX_SLOPE_THRESHOLD_DEG = 45.0     # 45deg+ mountain slope = 100% slope failure risk score
MAX_HISTORICAL_COUNT_SATURATION = 4 # 4+ historical events = 100% history risk score


def normalize_rainfall(rainfall_mm: float) -> float:
    """Normalizes rainfall accumulation (mm) to a 0-100 scale."""
    if rainfall_mm <= 0:
        return 0.0
    return min((float(rainfall_mm) / MAX_RAINFALL_THRESHOLD_MM) * 100.0, 100.0)


def normalize_slope(slope_deg: float) -> float:
    """Normalizes slope gradient in degrees to a 0-100 scale."""
    if slope_deg <= 0:
        return 0.0
    return min((float(slope_deg) / MAX_SLOPE_THRESHOLD_DEG) * 100.0, 100.0)


def normalize_soil_moisture(moisture_pct: float) -> float:
    """Normalizes soil saturation percentage to a 0-100 scale."""
    if moisture_pct <= 0:
        return 0.0
    return min(max(float(moisture_pct), 0.0), 100.0)


def normalize_historical_events(count: int) -> float:
    """Normalizes historical landslide count to a 0-100 scale."""
    if count <= 0:
        return 0.0
    return min(float(count) * (100.0 / MAX_HISTORICAL_COUNT_SATURATION), 100.0)


def classify_risk_level(score: int) -> str:
    """
    Classifies a 0-100 numerical score into standard risk levels:
    - 0 to 30:   LOW
    - 31 to 60:  MODERATE
    - 61 to 80:  HIGH
    - 81 to 100: CRITICAL
    """
    if score >= 81:
        return "CRITICAL"
    elif score >= 61:
        return "HIGH"
    elif score >= 31:
        return "MODERATE"
    return "LOW"


def generate_contributing_factors(
    zone_name: str,
    rainfall_mm: float,
    slope_deg: float,
    soil_moisture_pct: float,
    historical_count: int,
    score: int,
    level: str
) -> List[str]:
    """
    Generates human-readable, evidence-based explanatory factors for the assessed sector
    using actual input values.
    """
    factors = []

    # 1. Rainfall factor
    if rainfall_mm >= 100.0:
        factors.append(f"Heavy continuous rainfall ({rainfall_mm:.1f} mm in 24h) is rapidly destabilizing upper slope strata")
    elif rainfall_mm >= 50.0:
        factors.append(f"Moderate persistent rainfall ({rainfall_mm:.1f} mm in 24h) maintaining high surface runoff")
    elif rainfall_mm > 0:
        factors.append(f"Light precipitation recorded ({rainfall_mm:.1f} mm in 24h)")
    else:
        factors.append("No active rainfall recorded in current monitoring window (baseline hydrological state)")

    # 2. Slope angle factor
    if slope_deg >= 35.0:
        factors.append(f"Steep mountain gradient ({slope_deg:.1f} deg slope angle) significantly increases gravitational shear stress")
    elif slope_deg >= 22.0:
        factors.append(f"Moderate hillside incline ({slope_deg:.1f} deg slope angle) vulnerable under elevated saturation")
    else:
        factors.append(f"Gentle terrain gradient ({slope_deg:.1f} deg slope angle) provides natural geotechnical stability")

    # 3. Soil moisture factor
    if soil_moisture_pct >= 75.0:
        factors.append(f"Hillside soil is highly waterlogged ({soil_moisture_pct:.1f}% saturation), reducing internal friction")
    elif soil_moisture_pct >= 50.0:
        factors.append(f"Moderate soil moisture saturation ({soil_moisture_pct:.1f}%) within allowable retention capacity")
    else:
        factors.append(f"Low soil moisture content ({soil_moisture_pct:.1f}%), indicating stable dry pore pressure")

    # 4. Historical landslide frequency
    if historical_count >= 3:
        factors.append(f"Sector has a recurring history of slope failures ({historical_count} historical landslide events documented)")
    elif historical_count > 0:
        factors.append(f"{historical_count} prior landslide event on geological record in this corridor")
    else:
        factors.append("No prior catastrophic slope failures logged in immediate sector registry")

    return factors


def calculate_risk(
    rainfall_mm: float,
    slope_deg: float,
    soil_moisture_pct: float,
    historical_count: int,
    zone_name: str = ""
) -> Dict[str, Any]:
    """
    Executes the 40/30/20/10 weighted calculation for a risk zone.

    Returns:
      dict containing:
        - risk_score (int 0-100)
        - risk_level (str: LOW, MODERATE, HIGH, CRITICAL)
        - contributing_factors (list of str)
        - breakdown (dict of subscores and weighted contributions)
    """
    rain_norm = normalize_rainfall(rainfall_mm)
    slope_norm = normalize_slope(slope_deg)
    soil_norm = normalize_soil_moisture(soil_moisture_pct)
    hist_norm = normalize_historical_events(historical_count)

    rain_weighted = rain_norm * WEIGHT_RAINFALL
    slope_weighted = slope_norm * WEIGHT_SLOPE
    soil_weighted = soil_norm * WEIGHT_SOIL_MOISTURE
    hist_weighted = hist_norm * WEIGHT_HISTORICAL_EVENTS

    raw_total = rain_weighted + slope_weighted + soil_weighted + hist_weighted
    final_score = int(round(max(0.0, min(100.0, raw_total))))
    final_level = classify_risk_level(final_score)
    factors = generate_contributing_factors(
        zone_name=zone_name,
        rainfall_mm=rainfall_mm,
        slope_deg=slope_deg,
        soil_moisture_pct=soil_moisture_pct,
        historical_count=historical_count,
        score=final_score,
        level=final_level
    )

    return {
        "risk_score": final_score,
        "risk_level": final_level,
        "contributing_factors": factors,
        "breakdown": {
            "rainfall": {
                "raw_value_mm": rainfall_mm,
                "normalized": round(rain_norm, 2),
                "weight": WEIGHT_RAINFALL,
                "contribution": round(rain_weighted, 2),
            },
            "slope_angle": {
                "raw_value_deg": slope_deg,
                "normalized": round(slope_norm, 2),
                "weight": WEIGHT_SLOPE,
                "contribution": round(slope_weighted, 2),
            },
            "soil_moisture": {
                "raw_value_pct": soil_moisture_pct,
                "normalized": round(soil_norm, 2),
                "weight": WEIGHT_SOIL_MOISTURE,
                "contribution": round(soil_weighted, 2),
            },
            "historical_landslides": {
                "raw_count": historical_count,
                "normalized": round(hist_norm, 2),
                "weight": WEIGHT_HISTORICAL_EVENTS,
                "contribution": round(hist_weighted, 2),
            },
        },
    }
