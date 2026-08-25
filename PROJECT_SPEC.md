# NER-SafeSlope
## AI-Based Early Warning and Landslide Risk Monitoring System for the North Eastern Region

---

# 1. Project Overview

## Problem

The North Eastern Region (NER) of India frequently experiences:

- Landslides
- Flash floods
- Road blockages
- Slope failures
- Infrastructure damage
- Connectivity disruptions
- Isolation of remote villages

These incidents are influenced by:

- Heavy rainfall
- Fragile terrain
- Steep slopes
- Soil moisture
- Unplanned hill cutting
- Historical landslide patterns
- Changing weather conditions

Current monitoring is often reactive and dependent on manual reporting.

## Goal

Build an AI-assisted early warning and landslide risk monitoring platform that helps authorities and field teams:

1. Identify high-risk zones.
2. Monitor weather-linked risk.
3. Visualize vulnerable roads, villages and infrastructure.
4. Receive early warnings.
5. Collect geo-tagged field reports.
6. Prioritize emergency response.
7. Support decision-making during developing risk conditions.

---

# 2. Product Name

NER-SafeSlope

## Tagline

AI-Powered Landslide Early Warning & Risk Monitoring for the North Eastern Region

---

# 3. Product Vision

Transform fragmented disaster monitoring into a unified system:

Data
↓
Risk Analysis
↓
GIS Visualization
↓
Early Warning
↓
Field Verification
↓
Emergency Prioritization
↓
Response

The platform should help authorities move from:

REACTIVE MONITORING

to:

PROACTIVE RISK AWARENESS

---

# 4. Target Users

## 4.1 District Administration

Primary user of the main dashboard.

Needs:

- Regional risk overview
- High-risk zones
- Risk heatmap
- Weather conditions
- Road connectivity
- Village vulnerability
- Infrastructure status
- Active alerts
- Emergency priorities

---

## 4.2 Disaster Management Authorities

Needs:

- Risk trends
- Active incidents
- Alert management
- Affected areas
- Response prioritization
- Historical information

---

## 4.3 Field Officers

Needs:

- Mobile-friendly interface
- Nearby risk zones
- GPS location
- Incident reporting
- Photo/video upload
- Road blockage reporting
- Crack/slope movement reporting
- Offline reporting
- Automatic synchronization

---

## 4.4 Local Communities

Needs:

- Location-specific warnings
- Simple risk information
- Multilingual alerts
- Basic emergency information
- Ability to report visible hazards

---

# 5. Core MVP

The hackathon MVP must prioritize a complete working workflow rather than attempting to implement every feature in the problem statement.

## Mandatory MVP Features

### 5.1 GIS Risk Dashboard

Display:

- Risk zones
- Risk heatmap
- Roads
- Villages
- Infrastructure
- Landslide events
- Field reports

---

### 5.2 Risk Assessment

Calculate an explainable risk score from 0–100.

Example factors:

- Rainfall intensity
- Rainfall accumulation
- Soil moisture
- Terrain/slope
- Historical landslide frequency
- Field reports

---

### 5.3 Risk Severity

Use four severity levels:

0–30:
LOW

31–60:
MODERATE

61–80:
HIGH

81–100:
CRITICAL

Every risk display must show:

- Numerical score
- Severity label
- Contributing factors

---

### 5.4 Weather-Linked Risk

Display:

- Current rainfall
- Recent rainfall
- Rainfall trend
- Weather-linked risk

If real-time weather data is unavailable during development, use clearly labelled simulated/demo data.

---

### 5.5 Field Reporting

Field officers/citizens can submit:

- Incident type
- GPS location
- Photo
- Video where supported
- Description
- Timestamp

Supported report types:

- Crack
- Slope movement
- Road blockage
- Landslide
- Infrastructure damage
- Other

---

### 5.6 Alert System

Generate alerts based on configured risk conditions.

Alert should contain:

- Severity
- Location
- Time
- Risk reason
- Affected road/village
- Recommended response category

Example:

CRITICAL ALERT

Location:
Zone A

Risk:
84 — CRITICAL

Contributing factors:
- Heavy rainfall
- High slope
- High soil moisture

Affected:
Road X / Village Y

Response:
Immediate field inspection

---

### 5.7 Emergency Prioritization

Rank areas based on:

- Risk severity
- Population/village exposure
- Road importance
- Infrastructure vulnerability
- Recent field reports

Example:

Priority 1:
CRITICAL + road blocked + village affected

Priority 2:
HIGH + major road at risk

Priority 3:
MODERATE + isolated field report

---

# 6. Core Product Workflow

The primary workflow is:

Weather / Terrain / Historical / Field Data
↓
Data Processing
↓
Risk Engine
↓
Risk Score
↓
Risk Classification
↓
GIS Risk Map
↓
Alert Generation
↓
Emergency Prioritization
↓
Field Verification
↓
Updated Risk Assessment

---

# 7. Main Screens

## Authority Dashboard

Main landing screen.

Must contain:

- Regional risk summary
- GIS map
- Active alerts
- High-risk zones
- Road status
- Weather summary
- Emergency priorities

---

## Risk Map

Must display:

- Risk zones
- Heatmap
- Roads
- Villages
- Infrastructure
- Field reports
- Landslide events

Clicking a risk zone should open detailed information.

---

## Risk Zone Details

Display:

- Zone name
- Location
- Risk score
- Risk level
- Rainfall
- Soil moisture
- Slope
- Historical events
- Nearby roads
- Nearby villages
- Recent field reports
- Risk explanation

---

## Alerts

Display:

- Active alerts
- Alert severity
- Location
- Timestamp
- Reason
- Status

Alert statuses:

ACTIVE
ACKNOWLEDGED
RESOLVED

---

## Field Officer App

Screens:

- Login
- Nearby Risk
- Report Incident
- Capture Photo
- GPS Location
- Report Description
- My Reports
- Offline Queue

---

## Field Report Details

Display:

- Report type
- Reporter
- Location
- Timestamp
- Photo/video
- Description
- Verification status

---

## Emergency Priority

Display ranked incidents/zones.

Each priority item should show:

- Risk
- Location
- Affected population/area
- Road status
- Infrastructure impact
- Field reports
- Recommended priority

---

# 8. Core Entities

Use these exact entity names throughout the application.

## User

Represents a platform user.

Possible roles:

- Authority
- FieldOfficer
- Citizen

---

## Authority

Represents district/disaster-management authority users.

---

## FieldOfficer

Represents authorized personnel performing field reporting and verification.

---

## CitizenReport

Represents a geo-tagged report submitted by a citizen or field officer.

---

## RiskZone

Represents a geographically defined area being monitored for landslide risk.

---

## RiskAssessment

Represents the calculated risk state of a RiskZone.

Contains:

- Risk score
- Risk level
- Timestamp
- Contributing factors

---

## WeatherData

Represents weather information associated with a location/time.

Possible fields:

- Rainfall
- Rainfall accumulation
- Temperature
- Humidity
- Timestamp
- Location

---

## Road

Represents monitored road connectivity.

Possible statuses:

OPEN
RESTRICTED
BLOCKED
UNKNOWN

---

## Village

Represents a village or populated location within the monitored region.

---

## Infrastructure

Represents important infrastructure.

Examples:

- Bridges
- Roads
- Hospitals
- Schools
- Power infrastructure
- Communication infrastructure

---

## Alert

Represents a generated warning.

Statuses:

ACTIVE
ACKNOWLEDGED
RESOLVED

---

## LandslideEvent

Represents a historical or reported landslide event.

---

# 9. Risk Engine

## MVP Approach

The hackathon MVP should use an explainable weighted risk model.

Do not claim that the MVP is a scientifically validated landslide prediction model.

Example:

Rainfall intensity:
40%

Rainfall accumulation:
20%

Slope:
20%

Historical landslide frequency:
10%

Soil moisture:
10%

Total:

100%

---

## Risk Calculation

Conceptually:

Risk Score =
Rainfall contribution
+
Accumulated rainfall contribution
+
Slope contribution
+
Historical contribution
+
Soil moisture contribution

Normalize the final result to:

0–100

---

# 10. Risk Explanation

The platform must explain why risk increased.

Example:

Risk Score: 78

Severity:
HIGH

Contributing factors:

- Heavy rainfall
- High rainfall accumulation
- Steep slope
- High soil moisture
- Historical landslide nearby

Never display only:

"AI predicts HIGH risk."

Always provide supporting factors.

---

# 11. AI/ML Strategy

## MVP

Use an explainable risk engine.

The architecture should allow replacement with a trained ML model later.

Possible future models:

- Random Forest
- XGBoost
- Gradient Boosting
- Neural Networks
- Time-series models

Potential future input features:

- Rainfall history
- Rainfall intensity
- Soil moisture
- Slope
- Elevation
- Land cover
- Geological information
- Historical landslide records
- Satellite-derived features

---

# 12. AI Safety Rules

The system must NOT:

- Guarantee that a landslide will occur.
- Claim 100% prediction accuracy.
- Invent sensor readings.
- Invent satellite observations.
- Invent government warnings.
- Give unsupported emergency instructions.
- Replace official disaster-management decisions.
- Recommend unsafe actions.
- Present synthetic data as real-world data.

Use terms such as:

- Risk score
- Risk level
- Predicted risk
- Potential risk
- Contributing factors
- Early warning

---

# 13. Data Sources

Potential data sources:

## Weather

Possible integration:

- IMD weather services/APIs where accessible
- Other authorized weather APIs for demonstration

---

## Satellite

Potential sources:

- ISRO resources where accessible
- Sentinel data
- Landsat data
- Other public Earth observation datasets

Satellite integration is optional for the initial MVP if access or processing complexity becomes a blocker.

---

## Terrain

Potential sources:

- Digital Elevation Models
- SRTM
- Other public elevation datasets

Terrain/slope data may be preprocessed into static demo data for the hackathon.

---

## Historical Landslides

Use:

- Public datasets
- Government datasets where available
- Research datasets
- Clearly labelled synthetic/demo records when necessary

---

## Sensor Data

Potential inputs:

- Soil moisture
- Rain gauges
- Other IoT sensors

If physical sensors are unavailable:

Use simulated sensor streams for the MVP.

All simulated data must be clearly identified as DEMO/SIMULATED.

---

# 14. Demo Data Policy

If real-time APIs or datasets are unavailable:

Use realistic synthetic data.

Example:

Rainfall:
105 mm

Soil Moisture:
82%

Slope:
37°

Historical Events:
4

Risk Score:
84

Risk:
CRITICAL

The UI must clearly distinguish:

LIVE DATA

from:

DEMO DATA

---

# 15. Real-Time Simulation

The hackathon demo may simulate incoming data.

Example:

10:00 AM

Rainfall:
40 mm

Risk:
42 — MODERATE

↓

10:30 AM

Rainfall:
72 mm

Risk:
68 — HIGH

↓

11:00 AM

Rainfall:
105 mm

Risk:
84 — CRITICAL

↓

Alert generated.

The simulation should demonstrate how the platform reacts to changing conditions.

---

# 16. GIS Requirements

The GIS interface is a core part of the platform.

It should support:

- Map navigation
- Risk heatmap
- Risk zone markers
- Road layers
- Village layers
- Infrastructure layers
- Field report markers
- Landslide event markers

Clicking a map element should display relevant details.

---

# 17. Field Reporting

Field reporting workflow:

Open Report
↓
Get GPS location
↓
Select report type
↓
Capture photo
↓
Add description
↓
Submit
↓
Store locally if offline
↓
Sync when connection returns

---

# 18. Offline Support

Field reporting must be designed for low-network environments.

Minimum MVP behavior:

OFFLINE
↓
Create report
↓
Store locally
↓
Show "Pending Sync"
↓
Network returns
↓
Upload automatically
↓
Status changes to "Synced"

---

# 19. Multilingual Support

The architecture should support multilingual content.

Initial MVP may support:

English
+
One additional regional language if time permits.

Do not hard-code user-facing strings directly into components.

Use a centralized translation structure.

---

# 20. Notification Strategy

Potential channels:

- In-app notification
- SMS
- Push notification

For hackathon MVP:

Prioritize:

1. In-app alerts
2. Simulated/working notification where feasible

SMS integration can be implemented if a reliable API is available.

---

# 21. Emergency Prioritization

Priority should consider:

Risk severity
+
Population exposure
+
Road importance
+
Infrastructure importance
+
Recent field reports

Example:

Priority Score =
Risk × Exposure × Infrastructure Importance

Use a transparent scoring approach for the MVP.

---

# 22. Technical Architecture

## Frontend

React
TypeScript
Tailwind CSS

---

## Backend

Supabase

Use:

- PostgreSQL
- Authentication
- Row Level Security
- Storage where required
- Realtime features where useful

---

## GIS

Use a suitable web mapping library.

Potential options:

- Leaflet
- MapLibre
- Mapbox

The final choice must be agreed upon by the team before implementation.

---

## AI/ML

Separate risk-analysis logic from the UI.

Architecture:

Frontend
↓
API / Service Layer
↓
Risk Engine
↓
Data Sources

---

# 23. Frontend Structure

Suggested structure:

src/

components/
pages/
layouts/
services/
types/
data/
hooks/
utils/
lib/

Shared components should be reusable.

Do not duplicate equivalent components across dashboards.

---

# 24. Backend Separation

Frontend must not contain:

- Database credentials
- Service-role keys
- Private API keys

Use environment variables.

Keep data-access logic separate from UI components.

---

# 25. Security

Minimum requirements:

- Authentication
- Authorization
- Row Level Security
- Secure environment variables
- HTTPS
- Restricted data access
- No secret keys in source code

Field officers and authorities should only access data allowed by their roles.

---

# 26. Development Strategy

Build in this order:

## Phase 1

Project setup

↓

## Phase 2

Core UI

↓

## Phase 3

GIS map

↓

## Phase 4

Mock risk engine

↓

## Phase 5

Risk visualization

↓

## Phase 6

Supabase integration

↓

## Phase 7

Field reporting

↓

## Phase 8

Alerts

↓

## Phase 9

AI/data integration

↓

## Phase 10

Offline functionality

↓

## Phase 11

Testing

↓

## Phase 12

Demo preparation

---

# 27. Team Responsibilities

## Person 1

Authority Dashboard + GIS Frontend

Responsible for:

- Main dashboard
- Risk map
- Risk zone details
- Risk cards
- Weather cards
- Road status
- Alert visualization

---

## Person 2

Field Officer + Citizen Frontend

Responsible for:

- Mobile UI
- Incident reporting
- GPS
- Photo/video capture
- Report history
- Offline queue
- Sync UI

---

## Person 3

Backend + Supabase

Responsible for:

- Database
- Authentication
- RLS
- Storage
- Data access
- Backend services
- API integrations

---

## Person 4

AI + Data + Integration

Responsible for:

- Risk engine
- Risk calculations
- Data processing
- Weather integration
- Satellite/data experimentation
- AI/ML experimentation
- Integration testing

---

# 28. Git Workflow

Each developer should work on a separate branch.

Example:

feature/authority-dashboard

feature/field-reporting

feature/supabase-backend

feature/risk-engine

Never directly push experimental changes to main.

Workflow:

Branch
↓
Develop
↓
Test
↓
Commit
↓
Push
↓
Pull Request
↓
Review
↓
Merge

---

# 29. AI Development Rules

AI coding tools may be used by all team members.

Possible tools:

- ChatGPT
- Gemini
- Claude
- Antigravity
- Cursor

However:

AI tools must follow:

PROJECT_SPEC.md
DESIGN.md
CONVENTIONS.md

The AI must not independently redesign the application.

AI-generated code must be reviewed and understood by the developer.

---

# 30. Architecture Change Rule

If an AI suggests:

- New database table
- New framework
- New major dependency
- New API
- New core entity
- Major UI redesign

The developer must discuss it with the team before implementing it.

PROJECT_SPEC.md must be updated if the team approves a major architectural change.

---

# 31. MVP Priority

## MUST HAVE

- GIS risk map
- Risk score
- Risk severity
- Risk explanation
- Weather-linked risk
- Road/village visualization
- Alerts
- Field reports
- Emergency prioritization

## SHOULD HAVE

- Offline field reports
- Multilingual UI
- Real weather API
- Realtime updates
- Photo upload

## NICE TO HAVE

- Satellite imagery integration
- Soil moisture sensor integration
- SMS gateway
- Advanced ML model
- Advanced satellite analysis
- Predictive time-series model

If time becomes limited:

Build MUST HAVE features completely before starting NICE TO HAVE features.

---

# 32. Demo Story

The final demonstration should follow one realistic scenario.

Scenario:

A monitored zone experiences increasing rainfall.

↓

Rainfall data changes.

↓

Risk score increases.

↓

Zone changes:

MODERATE
→
HIGH
→
CRITICAL

↓

GIS map changes to critical status.

↓

Affected road and village become highlighted.

↓

System generates alert.

↓

Field officer receives alert.

↓

Field officer reaches the location and submits a geo-tagged report with a photo.

↓

Authority dashboard receives the report.

↓

Emergency priority increases.

↓

Authority can prioritize inspection/response.

---

# 33. Demo Data

Use clearly labelled demo data.

Example monitored locations:

Zone A
Zone B
Zone C
Zone D

Example:

Zone A

Rainfall:
105 mm

Soil Moisture:
82%

Slope:
37°

Historical Landslides:
4

Risk Score:
84

Risk:
CRITICAL

Road:
RESTRICTED

Nearby Village:
Village A

---

# 34. Key Product Differentiator

The platform should not be positioned as simply:

"Another landslide map."

The core differentiator is:

DATA
↓
RISK
↓
MAP
↓
WARNING
↓
FIELD VERIFICATION
↓
EMERGENCY PRIORITIZATION

The platform connects prediction, monitoring and response in one workflow.

---

# 35. Important Limitations

The hackathon prototype may use:

- Synthetic data
- Simulated sensor streams
- Simulated real-time updates
- Public datasets
- Limited regional data
- Rule-based risk scoring

These limitations must be communicated honestly.

Do not claim:

- Government deployment
- Scientifically validated prediction
- Guaranteed landslide prediction
- Real-time satellite monitoring unless actually implemented
- Official disaster warnings unless connected to an official source

---

# 36. Success Criteria

The MVP is considered successful if the team can demonstrate:

1. A risk zone appearing on the GIS map.
2. Risk score being calculated.
3. Risk level changing when input conditions change.
4. The system explaining why risk increased.
5. An alert being generated.
6. A field report being submitted with location.
7. The authority dashboard receiving the report.
8. Emergency priorities being updated.
9. The workflow working end-to-end.

---

# 37. Final Product Principle

The platform is a decision-support and early-warning system.

It should help authorities answer:

"Where is the risk?"

"Why is the risk high?"

"What is affected?"

"What changed?"

"Who needs to respond?"

"What should be prioritized?"

The system should provide information that enables faster and better disaster preparedness and response.

It does not replace official disaster-management authorities or field expertise.