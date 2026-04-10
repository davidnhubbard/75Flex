# 75 Flex

75 Flex is a structured, flexible habit and consistency tracking system inspired by programs like 75 Hard — but designed for real life.

It combines:
- customizable daily commitments
- structured consistency scoring
- flexible logging
- gentle recovery from missed days

The system is designed to be:
- simple to use daily
- strict enough to build discipline
- flexible enough to stay sustainable

---

## 🧠 Core Concept

75 Flex is not just a habit tracker.

It is a **consistency system** built around:

- daily commitments
- clear completion rules
- structured progress tracking
- recoverable streaks (no “all-or-nothing reset”)

Instead of binary success/failure, each day is classified as:

- **Complete** → all commitments met  
- **Partial** → some commitments met  
- **Missed** → no meaningful progress  

This enables a more realistic and sustainable measure of progress over time.

---

## 🎯 Key Features

### Daily Logging
- multiple commitments per day
- flexible input types:
  - checkbox
  - numeric
  - incremental
  - total entry
- fast interaction model
- “Complete All” shortcut

---

### Plan System
- fully customizable plans
- predefined templates (e.g., 75 Hard, 75 Soft)
- whole-plan editing model
- internal versioning preserves historical correctness

---

### Progress Tracking
- consistency score (weighted):
  - Complete = 1.0
  - Partial = 0.5
  - Missed = 0.0
- rolling windows (7d, 30d, plan)
- heatmap visualization
- trend insights

---

### Flexible Reality Handling
- 3-day editable window (today + 2 days back)
- no full reset after missed days
- encourages recovery instead of abandonment

---

### Reminders & Re-engagement
- daily reminders (time + timezone aware)
- suppression when day is complete
- re-engagement mode after consecutive missed days

---

## 🏗️ Architecture Overview

This project is built using a **modular specification-driven architecture**.

### Core Layers

#### 1. Behavior (What the system does)
- daily logging
- plan management
- progress rules
- reminders

#### 2. Data Model (How it is structured)
- plans
- plan versions
- commitments
- days
- entries

#### 3. API Layer (How it is accessed)
- REST-based endpoints
- resource-oriented design
- consistent response shapes

#### 4. Contracts (What data looks like)
- canonical object definitions
- shared request/response models

#### 5. State Machines (What is true)
- day state (Complete / Partial / Missed)
- editability rules
- re-engagement state

#### 6. Validation (What is allowed)
- strict input rules
- cross-field consistency
- system integrity constraints

#### 7. Events (What happens)
- explicit event model
- traceable system behavior
- clean side-effect handling

#### 8. Background Processing (What happens later)
- reminders
- async processing
- retries and observability

---

## 📁 Project Structure (Spec-Oriented)
