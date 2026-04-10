## Progress & Summary API Endpoints

### Purpose

This section defines the primary API endpoints for progress retrieval, summary metrics, and visualization-ready reporting.

It establishes:
- How the client retrieves progress data
- How consistency scores are exposed across time windows
- How heatmap-ready day-state data is delivered
- How the API centralizes progress interpretation so the client does not need to reconstruct core logic

This section defines the behavioral contract for progress-related endpoints, not the final transport or framework implementation details.

---

### Core Principle

Progress endpoints should return **UI-ready, application-oriented data**.

The server should centralize:
- consistency calculations
- day-state interpretation
- summary counts
- heatmap shaping
- trend-oriented progress summaries

The client should not be responsible for recomputing these values from raw logging data.

---

## Endpoint Group Overview

The progress and summary API should include endpoints in the following categories:

1. Overall progress summary
2. Time-window consistency summaries
3. Heatmap day-state data
4. Day-state count summaries
5. Optional trend or insight summaries
6. Optional progress detail for a specific day range

---

## 1. Retrieve Overall Progress Summary

### Endpoint
`GET /progress/summary`

### Purpose
Returns a high-level summary of the authenticated user’s progress.

### Behavior
The response should provide an application-ready summary that may include:

- Current Consistency Score
- Current active plan reference
- Counts of Complete, Partial, and Missed days
- Current streak-like indicators if later supported
- High-level interpretive summary text if the product chooses to return it from the server
- Relevant current-period window defaults (such as last 7 days and last 30 days)

### Notes
This endpoint should act as the default summary source for the main progress screen or dashboard.

---

## 2. Retrieve Time-Window Consistency Summary

### Endpoint
`GET /progress/consistency`

### Purpose
Returns consistency metrics for one or more defined time windows.

### Query Parameters (Conceptual)
The endpoint may support parameters such as:

- `window=7d`
- `window=14d`
- `window=30d`
- `window=plan`
- optional support for multiple windows in one request

### Behavior
The response should include:

- Requested window definition
- Consistency Score
- Number of Complete Days
- Number of Partial Days
- Number of Missed Days
- Human-readable interpretation fields where useful

### Calculation Rules
The server must apply the system-wide Consistency Score model consistently:

- Complete = 1.0
- Partial = 0.5
- Missed = 0.0

The client must not be expected to recalculate this independently.

---

## 3. Retrieve Heatmap Data

### Endpoint
`GET /progress/heatmap`

### Purpose
Returns visualization-ready day-state data for the progress heatmap.

### Query Parameters (Conceptual)
The endpoint may support parameters such as:

- `window=30d`
- `startDate`
- `endDate`

The MVP may begin with a simple rolling-window model.

### Behavior
The response should return one record per day in the requested range, including fields such as:

- Calendar date
- Day state (Complete / Partial / Missed)
- Editability status if relevant
- Optional summary value for display or tooltip usage

### Notes
The response should be shaped so that the client can render a heatmap directly without reconstructing status from raw entries.

---

## 4. Retrieve Day-State Count Summary

### Endpoint
`GET /progress/day-counts`

### Purpose
Returns counts of Complete, Partial, and Missed days for a requested time range.

### Behavior
The response should include:

- Requested date window
- Count of Complete days
- Count of Partial days
- Count of Missed days
- Total number of days in the window

### Notes
This endpoint may overlap conceptually with `/progress/consistency`, but separating count-focused retrieval may improve clarity and reuse depending on implementation preferences.

It is acceptable for the final implementation to merge these concerns if the response model remains clean and well documented.

---

## 5. Retrieve Trend / Insight Summary

### Endpoint
`GET /progress/insights`

### Purpose
Returns lightweight, server-derived progress insights suitable for user-facing reinforcement or interpretation.

### Intended Use
This endpoint is for messages such as:

- “You’ve been more consistent this week”
- “You’re building momentum”
- “There were a few gaps—keep going”

### Behavior
The server may return:

- Trend direction
- Comparison to prior equivalent window
- Insight labels or categories
- Optional prewritten message suggestions
- Confidence or threshold indicators if needed

### Notes
This endpoint is optional for MVP, but strongly aligned with the product’s contextual feedback model.

If not implemented as a separate endpoint, equivalent data may be folded into `/progress/summary`.

---

## 6. Retrieve Progress Detail for a Date Range

### Endpoint
`GET /progress/range`

### Purpose
Returns a more detailed progress representation for a specific date range.

### Intended Use
Useful for:
- richer reporting screens
- admin or debug inspection
- detailed analysis beyond the primary summary card or heatmap

### Query Parameters (Conceptual)
- `startDate`
- `endDate`

### Behavior
The response may include:

- Day-level records
- Day states
- Aggregated commitment summaries
- Notes or day-level metadata where appropriate
- Consistency score for the range
- Summary counts

This endpoint should still remain application-oriented rather than exposing raw internal tables.

---

## Date Window Handling Rules

Progress endpoints must apply consistent rules for date windows.

The server must:

- Interpret requested windows according to the user’s local date context where appropriate
- Use the correct day boundaries
- Treat days with no day record as Missed according to the defined scoring model
- Ensure that historical plan-version behavior is respected indirectly through day evaluation logic

The client should not independently infer missing-day behavior.

---

## Response Shape Principles

Progress responses should be:

- Ready for UI use
- Consistent across endpoints
- Focused on interpreted values
- Minimal in unnecessary raw detail

Responses should prefer:

- explicit day states
- explicit counts
- explicit percentages
- explicit date ranges
- derived summary values

Responses should avoid:

- forcing the client to reconstruct scoring logic
- exposing internal database complexity without reason
- returning overly raw entry-level structures unless specifically requested by a diagnostic or detail endpoint

---

## Caching & Performance Considerations

Because progress endpoints may be read frequently, they should be designed with performance in mind.

The implementation should consider:

- efficient underlying queries
- appropriate indexing
- use of views or functions where helpful
- caching where appropriate and safe
- predictable response shapes that do not require excessive follow-up calls

Performance optimization must not compromise correctness.

---

## Error Conditions

Progress endpoints should handle and clearly report errors such as:

- Invalid date window
- Unsupported window parameter
- Invalid date format
- Unauthorized access
- Missing active plan where required
- Internal calculation failure

Errors must follow the system-wide error visibility and reporting principles.

---

## Strategic Principle

Progress endpoints should answer the user’s real questions clearly:

- How am I doing?
- Am I being consistent?
- What does my recent pattern look like?
- Is this working?

The guiding rule is:

Return meaningful progress, not raw math fragments.