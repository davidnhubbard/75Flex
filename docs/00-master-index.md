# 75 Flex â€” Master Index & AI Navigation Map (Nuanced AI Version)

## Purpose

This document is the master navigation layer for the 75 Flex specification system.

It exists to:
- give humans and AI tools a reliable map of the specification
- define which files are authoritative for which topics
- reduce context overload during implementation
- prevent accidental rewriting of unrelated parts of the spec
- support modular prompting with tools such as ChatGPT, Codex, Moonchild, D0, or similar systems

This document is **not** the full product specification.

Detailed rules, behavior, data structures, API contracts, and implementation guidance live in the module files listed below.

---

## Core Product Summary

75 Flex is a flexible, forgiving habit-building system inspired by rigid challenge models like 75 Hard and softer consistency models like 75 Soft.

Core principles:
- no forced restarts
- progress is never erased
- plans are user-defined and adjustable
- consistency matters more than perfection
- the system should adapt to real life without losing behavioral truth

75 Flex is **not** a punitive challenge tracker.

It is a long-term behavior support system built around:
- flexible plan management
- daily logging
- historically accurate evaluation
- partial-progress recognition
- reminders and re-engagement
- consistency-based progress feedback

---

## Primary Architecture Principle

The specification is intentionally modular.

Each module should:
- own one primary domain
- define that domain in full
- avoid redefining rules that belong elsewhere
- reference other modules when needed
- remain safe to load independently with this index

This structure exists because:
- large monolithic specs are fragile
- AI tools perform better with focused context
- implementation accuracy improves when ownership is clear
- updates can be made without corrupting unrelated sections

---

## How to Use This Spec

### For Humans

Use this file to:
- understand the product structure
- locate the right file for a given topic
- avoid editing the wrong document
- assemble the minimum document set for a task

---

### For AI Tools (Critical Loading Rules)

When generating:
- code
- UX
- API handlers
- schema
- tests
- migrations
- implementation plans

use this rule:

1. Always include this file
2. Include only the modules needed for the task (typically 2â€“6)
3. Do not include the entire spec unless absolutely necessary
4. Treat module ownership as authoritative
5. Do not invent behavior that conflicts with the modules
6. Do not â€œfill gapsâ€ with assumptions â€” missing behavior must be resolved explicitly

---

## Source of Truth Rule

The specification hierarchy is:

1. This file defines structure and navigation
2. Domain modules define behavior
3. Data/API/architecture modules define implementation contracts
4. Code must follow the spec
5. Documentation must remain aligned with both spec and code

If two documents appear to conflict:
- prefer the more specific module over the general index
- resolve the inconsistency explicitly
- do not silently â€œaverageâ€ conflicting meanings

---

# ðŸ“¦ CURRENT SPEC MAP (Authoritative)

## 00 â€” Master Index  
Navigation layer (this document)

---

## 20 â€” Onboarding & Education  
Defines:
- entry flow
- system explanation
- user mental model
- progressive education

Primary role:
Ensures users do not misunderstand the system in ways that break behavior.

---

## 30 â€” Plan Creation & Management  
Defines:
- plan structure
- commitment definition
- creation flow
- editing model
- guardrails against bad plans

Primary role:
Prevents users from creating plans that guarantee failure.

---

## 40 â€” Daily Logging System  
Defines:
- day lifecycle
- logging model
- editability window
- backfill rules
- complete-all behavior

Primary role:
Defines the core daily interaction loop.

---

## 50 â€” Off-Track & Recovery System  
Defines:
- engagement states (On Track / At Risk / Off Track)
- consecutive missed-day rules
- recovery behavior (no reset)
- re-engagement model

Primary role:
Bridges failure and continuation without breaking progress.

---

## 60 â€” Plan Versioning & Historical Integrity  
Defines:
- hidden versioning
- historical correctness
- same-day plan-change behavior
- version-aware day evaluation

Primary role:
Prevents historical corruption.

---

## 70 â€” Progress & Feedback System  
Defines:
- consistency score
- heatmap model
- summary metrics
- reinforcement messaging

Primary role:
Translates behavior into meaningful feedback.

---

## 80 â€” Reminders & Re-engagement  
Defines:
- reminder timing
- suppression rules
- re-engagement messaging

Primary role:
Maintains continuity of engagement over time.

---

## 100 â€” Data Model & Schema  
Defines:
- entities
- relationships
- structural data rules

Primary role:
Defines how the system exists in persistent form.

---

## 110 â€” Technical Architecture Index  
Entry point to implementation layer

---

## 111â€“115 â€” API Layer  
Defines:
- REST structure
- endpoint design
- domain-specific APIs

Primary role:
Defines how the system is accessed.

---

## 116 â€” Authentication & Ownership  
Defines:
- user context
- access rules

---

## 117 â€” Error Handling & Visibility  
Defines:
- error surfacing
- no false success rules

---

## 118 â€” Debugging & Diagnostics  
Defines:
- inspection tools
- explanation helpers

---

## 119 â€” Documentation Integrity  
Defines:
- no drift rules between spec, code, and docs

---

## 120 â€” API Conventions  
Defines:
- envelopes
- pagination
- cross-cutting rules

---

## 130 â€” Canonical Data Contracts  
Defines:
- shared object shapes
- payload consistency

---

## 140 â€” State Machines & Derived State  
Defines:
- day state
- editability
- reminder state
- scoring dependencies

Primary role:
Defines what is true.

---

## 150 â€” Validation Rules  
Defines:
- input constraints
- system-level rules

---

## 160 â€” Event Model & Side Effects  
Defines:
- system events
- side-effect relationships

---

## 170 â€” Background Jobs & Processing  
Defines:
- async work
- scheduling
- retry behavior

---

## 180 â€” Build & Implementation Plan  
Defines:
- build sequence
- execution strategy
- AI tool usage

---

## 190 â€” Web vs Mobile Development Guide  
Defines:
- practical web-first then mobile implementation strategy
- what transfers directly vs what must be rebuilt for native apps
- phased migration posture and decision gate before mobile build

Primary role:
Reduces planning anxiety and keeps platform transition decisions clear.

---
# ðŸ§­ Module Ownership Rules

Each behavior belongs to exactly one primary module.

Cross-module duplication is a defect.

Examples:
- onboarding â†’ 20  
- plan creation â†’ 30  
- logging â†’ 40  
- recovery â†’ 50  
- versioning â†’ 60  
- progress â†’ 70  
- reminders â†’ 80  

---

# ðŸ§  AI Working Rules (Strict)

- Never rewrite large documents casually
- Never compress content unless explicitly requested
- Never assume missing behavior
- Always defer to module ownership
- Always preserve system intent over simplification

---

# ðŸ”§ Spec Maintenance Rules

When updating the spec:

- Do not silently compress content
- Do not remove nuance
- Do not rewrite unrelated modules
- Update the module that owns behavior
- Update references when modules change
- Keep this index aligned with actual files

---

# ðŸ§­ Structure Evolution Notes

This system is intentionally expandable.

Future modules may include:
- user lifecycle
- monetization
- analytics
- integrations
- admin tooling

This index must remain:
- stable
- complete
- authoritative

---

# ðŸš€ Strategic Principle

This system is not optimized for minimal size.

It is optimized for:
- clarity
- correctness
- durability
- AI-assisted development

Use this file to find truth.  
Use modules to implement truth.
