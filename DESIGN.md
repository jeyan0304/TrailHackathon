# NER-SafeSlope — Design System

## 1. Product

Name:
NER-SafeSlope

Tagline:
AI-Powered Landslide Early Warning & Risk Monitoring for North Eastern Region

Purpose:
Provide authorities and field teams with a real-time view of landslide risk, road connectivity, field reports, weather-linked risk, and emergency priorities.

---

## 2. Design Principles

1. Safety first
2. Information must be understandable within seconds
3. Map is the primary visualization
4. Risk severity must be visually obvious
5. Avoid unnecessary visual complexity
6. Design for low-network environments
7. Mobile-first for field officers
8. Desktop-first for district administration dashboards
9. Every AI prediction must have an explanation
10. Never present a prediction as certainty

---

## 3. Primary Users

### District Administration

Needs:
- Regional risk overview
- High-risk zones
- Road connectivity
- Active alerts
- Emergency priorities

### Field Officer

Needs:
- Current location
- Nearby risk zones
- Upload photo/video
- Report cracks or road blockage
- Work in low-network conditions

### Local Community

Needs:
- Simple warnings
- Location-specific risk
- Emergency instructions
- Multilingual notifications

---

## 4. Main Navigation

Authority Dashboard:
- Overview
- Risk Map
- Alerts
- Roads
- Field Reports
- Analytics

Field Officer:
- Nearby Risk
- Report Incident
- My Reports
- Offline Sync

---

## 5. Main Dashboard

The main dashboard must show:

- Current regional risk
- Risk heatmap
- Active alerts
- High-risk zones
- Road connectivity
- Weather conditions
- Emergency priorities

The GIS map is the primary visual element.

---

## 6. Risk Severity

Use these exact levels:

LOW
MODERATE
HIGH
CRITICAL

Risk colors:

LOW:
Green

MODERATE:
Yellow

HIGH:
Orange

CRITICAL:
Red

Do not use colors for decoration.
Colors must communicate risk severity.

Always include text labels/icons in addition to color.

---

## 7. Risk Score

Risk score range:

0–100

Interpretation:

0–30:
LOW

31–60:
MODERATE

61–80:
HIGH

81–100:
CRITICAL

Display both:
- Numerical score
- Severity label

Example:

Risk Score: 78
Severity: HIGH

---

## 8. Risk Explanation

Never display only:

"AI Prediction: HIGH"

Instead display:

Risk Score: 78 — HIGH

Contributing factors:

- Heavy rainfall
- Steep slope
- High soil moisture
- Historical landslide nearby

---

## 9. Map

The GIS map is the central component.

Map should support:

- Risk zones
- Roads
- Villages
- Infrastructure
- Field reports
- Landslide incidents
- Weather-linked risk

Use markers and heatmap layers.

Avoid excessive map markers.

---

## 10. Alert Design

Critical alerts must include:

- Severity
- Location
- Time
- Reason
- Affected road/village
- Recommended response

Example:

CRITICAL ALERT

Location:
Zone A

Reason:
Heavy rainfall + high slope risk

Affected:
NH Road / Village X

Action:
Inspect road segment immediately

---

## 11. Field Report

Field officers can submit:

- Report type
- GPS location
- Photo
- Video
- Description
- Timestamp

Report types:

- Crack
- Slope movement
- Road blockage
- Landslide
- Infrastructure damage
- Other

---

## 12. Mobile Design

Field officer screens must work on mobile.

Important requirements:

- Large buttons
- Minimal typing
- GPS-first workflow
- Camera access
- Offline queue
- Clear sync status

---

## 13. Offline Mode

Display connection state:

ONLINE
SYNCING
OFFLINE

When offline:

- Allow reports to be created
- Store reports locally
- Queue uploads
- Sync automatically when connection returns

---

## 14. Typography

Use a clean sans-serif font.

Use strong hierarchy:

Page title:
Large

Section title:
Medium

Body:
Readable

Alert:
Bold

Avoid excessive text.

---

## 15. Components

Create reusable components:

- Button
- Card
- Badge
- AlertCard
- RiskBadge
- RiskScore
- MapContainer
- StatCard
- ReportCard
- WeatherCard
- RoadStatus
- Sidebar
- Navbar
- Modal
- Toast
- LoadingState
- EmptyState

---

## 16. UI States

Every important component should support:

- Loading
- Success
- Error
- Empty
- Offline

---

## 17. Accessibility

Do not rely only on color.

Every risk level must include:

- Color
- Text
- Icon

Buttons must have clear labels.

---

## 18. Responsive Behavior

Desktop:
Optimized for district administration dashboard.

Tablet:
Optimized for field coordination.

Mobile:
Optimized for field officers and citizen reporting.

---

## 19. Visual Style

Overall style:

Professional
Government/Disaster Management
Modern
Trustworthy
Data-focused
Clean

Avoid:

- Gaming-style UI
- Excessive animations
- Neon colors
- Decorative 3D elements
- Unnecessary gradients
- Overly futuristic interfaces

---

## 20. Important Rule

Do not change the design system without team approval.

Do not create different visual systems for different team members.

All frontend developers must reuse these components and conventions.