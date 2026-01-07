# Fake UI Implementation Plan - Broker-Free Edition

## Overview
This prototype demonstrates a Function composition UI where **brokers are completely hidden from users**. Users never see, configure, or think about brokers - they only interact with event sources and functions. The platform manages brokers automatically behind the scenes.

This follows the AWS Lambda pattern where users connect functions to event sources directly without understanding the underlying event routing infrastructure.

## Core Principle: No Broker Soup

**What Users See:**
- Event Sources (GitHub, Kafka, Slack, etc.) that produce events
- Functions that can subscribe to event types
- Direct connections: "My function receives events from this GitHub repo"

**What Users Don't See:**
- Brokers (completely hidden)
- Triggers (managed by controller)
- Event routing infrastructure

**What Happens Behind the Scenes:**
- Platform automatically creates a default broker per namespace
- Event Sources send to the default broker (user doesn't configure this)
- Function subscriptions create Triggers pointing to the default broker
- All broker management is automatic and invisible

## Implementation Phases

### Phase 1: Scaling & Runtime ✅ COMPLETED
(Same as 002)

### Phase 2: Networking ✅ COMPLETED
(Same as 002)

### Phase 3: Build Resources ✅ COMPLETED
(Same as 002)

### Phase 4: Event Sources Management (REVISED)

Instead of exposing brokers and manual broker selection, this phase focuses on Event Sources as the primary concept for eventing.

#### Goals
1. Enable users to create and manage Event Sources (GitHub, Kafka, Slack, Cron, etc.)
2. Event Sources automatically send events to a platform-managed broker (invisible to user)
3. Users see event sources as event producers, not broker sinks
4. No broker configuration or selection exposed in UI

#### Data Model

**Event Source:**
```javascript
{
  id: 'github-webhook-1',
  name: 'github-webhook',
  namespace: 'default',
  type: 'github', // github, slack, kafka, cron, etc.
  config: {
    // Type-specific configuration
    // For GitHub: repo URL, webhook secret
    // For Kafka: bootstrap servers, topics, consumer group
    // For Slack: webhook URL
    // etc.
  },
  eventTypes: ['com.github.push', 'com.github.pull_request'],
  createdAt: '...'
}
```

**Note:** No `broker` field! The platform handles broker assignment automatically.

#### UI Components

**Navigation:**
- Tabs: Functions | Event Sources
- No "Brokers" tab (brokers are invisible)

**Event Sources List View:**
- Table showing: Name, Type, Event Types, Connected Functions, Actions
- "Create Event Source" button
- Edit/Delete buttons per row
- Click event source name to view details

**Event Source Form (Create/Edit):**
- **Name** (text input)
- **Namespace** (text input, default: "default")
- **Source Type** (dropdown: GitHub, Kafka, Slack, Cron, Custom)
- Type-specific configuration fields (repo URL, topics, webhook URL, etc.)
- **Event Types Produced** (shown as read-only or configurable depending on source type)
- Auto-generate Event Source CR YAML

**Event Source Detail View:**
- Event source overview (name, type, configuration)
- Event types produced (with status indicators if available)
- Functions subscribed to these event types
- Generated resources (GitHubSource CR, KafkaSource CR, etc.)
- Visual diagram: This Event Source → [hidden broker] → Functions

#### Event Source Types

1. **GitHub Source**
   - Repository URL (e.g., "octocat/hello-world")
   - Event types to watch (checkboxes: push, pull_request, issues, release, etc.)
   - Access token (secret reference)

2. **Kafka Source**
   - Bootstrap servers (comma-separated list)
   - Topics (comma-separated list or multi-select)
   - Consumer group (optional)
   - SASL authentication (optional)

3. **Slack Source**
   - Webhook URL
   - Bot token (secret reference)
   - Event types (message, reaction, member_joined, etc.)

4. **Cron Source**
   - Schedule (cron expression with helper examples)
   - Data payload (JSON)
   - Timezone (optional)

5. **HTTP Source**
   - Exposes an endpoint that accepts CloudEvents
   - Show generated endpoint URL
   - Optional CORS and auth configuration

6. **Custom Source**
   - Free-form YAML configuration for advanced users

#### Resources Generated

Event Sources automatically send to a default broker. The UI generates:

**GitHub Source CR:**
```yaml
apiVersion: sources.knative.dev/v1
kind: GitHubSource
metadata:
  name: github-webhook
  namespace: default
spec:
  eventTypes:
    - push
    - pull_request
  owner: octocat
  repository: hello-world
  accessToken:
    secretKeyRef:
      name: github-token
      key: token
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default  # ← Platform-managed, always "default"
```

**Kafka Source CR:**
```yaml
apiVersion: sources.knative.dev/v1beta1
kind: KafkaSource
metadata:
  name: kafka-source
  namespace: default
spec:
  consumerGroup: knative-group
  bootstrapServers:
    - kafka.example.com:9092
  topics:
    - orders
    - payments
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default  # ← Platform-managed, always "default"
```

**Platform Responsibility:**
- Automatically create a Broker named "default" in each namespace (not shown in UI)
- All event sources in a namespace send to the same default broker
- Users never see or configure this broker

#### Success Criteria

- ✅ **Event Sources CRUD**: Create, list, view, edit, and delete event sources
- ✅ **No broker exposure**: Broker is never mentioned or configurable in UI
- ✅ **Multiple source types**: Support at least 6 event source types
- ✅ **Automatic sink configuration**: Event Sources always sink to default broker
- ✅ **Valid CRs**: Generate proper Knative Event Source CRs
- ✅ **Visual clarity**: Diagrams show Event Source → Function without broker in between

---

### Phase 5: Function Event Subscriptions (REVISED)

Users connect functions to event types produced by Event Sources. No broker selection required.

#### Goals
1. Allow functions to subscribe to event types
2. Show which Event Sources produce those event types
3. No broker selection or configuration
4. AWS Lambda-style trigger management

#### User Flow

1. **Create Function** - Function is created without subscriptions
2. **View Function Details** - See function overview and event subscriptions section
3. **Add Event Subscription** - Click "Subscribe to events" button
4. **Select Event Types** - Dialog shows:
   - List of available Event Sources with their event types
   - OR direct event type input (for wildcard or custom events)
5. **Subscription Created** - Function CR updated with event subscription

#### UI Components

**Function Detail View - Event Subscriptions Section:**
- "Subscribe to events" button
- List of current subscriptions showing:
  - Event type
  - Which Event Source(s) produce this event type
  - Remove button

**Event Subscription Dialog:**

Option A: Browse Event Sources
- Show list of existing Event Sources
- For each source, show event types it produces
- Checkboxes to select event types
- Example:
  ```
  GitHub: octocat/hello-world
    ☐ com.github.push
    ☐ com.github.pull_request

  Kafka: orders-topic
    ☐ com.example.order.created
    ☐ com.example.order.updated
  ```

Option B: Direct Event Type Input
- Text input for event type (e.g., "com.github.push")
- Shows warning if no Event Sources produce this type
- Shows which Event Sources produce this type if matches exist

**Event Subscription Display:**
Each subscription shows:
- Event type (e.g., "com.github.push")
- Source information: "Produced by: GitHub: octocat/hello-world"
- Remove button

#### Function CR Generated

```yaml
apiVersion: serverless.openshift.io/v1alpha1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  # ... runtime, scaling, networking, build config ...
  eventing:
    subscriptions:
      - eventTypes:
          - com.github.push
          - com.github.pull_request
          - com.example.order.created
```

**Note:** No `broker` field! The Function controller knows to create Triggers pointing to the "default" broker.

#### What the Function Controller Does

Behind the scenes, the controller:
1. Reads Function CR with event subscriptions
2. Creates Trigger CRs pointing to the "default" broker for each event type
3. Manages Trigger lifecycle

**Example Trigger CR (created by controller, not UI):**
```yaml
apiVersion: eventing.knative.dev/v1
kind: Trigger
metadata:
  name: my-function-github-push
  namespace: default
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: my-function
spec:
  broker: default  # ← Controller knows to use "default"
  filter:
    attributes:
      type: com.github.push
  subscriber:
    ref:
      apiVersion: v1
      kind: Service
      name: my-function
```

#### Success Criteria

- ✅ **No broker selection**: Users never choose or see broker names
- ✅ **Event Source discovery**: Users can browse Event Sources and their event types
- ✅ **Direct event type input**: Support for custom/wildcard event types
- ✅ **Visual connections**: Show which Event Sources produce subscribed event types
- ✅ **Function CR simplicity**: No broker field in eventing spec
- ✅ **Controller pattern**: UI creates Function CR, controller creates Triggers

---

### Phase 6: Event Flow Visualization

Add visual diagrams showing the complete event flow without exposing brokers.

#### Goals
1. Show event flow from Event Source to Function
2. Hide broker infrastructure in diagrams
3. Help users understand which events reach which functions

#### Diagram Types

**Event Source Detail View:**
```
┌─────────────────────────┐
│  GitHub: octocat/repo   │
│  Events: push, PR       │
└───────────┬─────────────┘
            │
            ├──► my-function (subscribed to: push)
            │
            └──► webhook-processor (subscribed to: push, pull_request)
```

**Function Detail View:**
```
GitHub: octocat/repo ──────┐
(com.github.push)          │
                           ├──► my-function
Kafka: orders-topic ───────┘
(com.example.order.created)
```

**Cross-Namespace Note:**
If Event Sources and Functions are in different namespaces, the platform handles cross-namespace routing automatically (still using brokers, but hidden).

#### Implementation

- Use simple text-based diagrams or SVG
- Show Event Sources on left, Functions on right
- Arrows show event flow
- Color code by event type
- No broker boxes or references

---

## Key Architectural Decisions

### 1. Default Broker Convention
- Every namespace has a broker named "default"
- Platform creates it automatically (via admission webhook or controller)
- All Event Sources send to "default" broker
- All Function Triggers subscribe to "default" broker

### 2. Event Source as Primary Concept
- Users think in terms of "Event Sources produce events"
- Not "Event Sources send to brokers"
- Broker is just plumbing

### 3. Function Subscriptions are Type-Based
- Functions subscribe to event types, not brokers
- Controller translates this to Triggers with broker reference

### 4. Cross-Namespace Events
- If needed, platform can use cross-namespace broker federation
- Or use a cluster-scoped broker
- Still invisible to users

### 5. YAML Generation
- Event Source CRs always have `sink.ref` pointing to "default" broker
- Function CRs have `eventing.subscriptions` without broker field
- UI never generates Broker or Trigger CRs (controller's job)

---

## What Users NEVER See

❌ Broker creation or configuration
❌ Broker selection dropdowns
❌ Broker names or namespaces
❌ Trigger CRs (controller-managed)
❌ Event routing topology (broker mesh, etc.)

## What Users DO See

✅ Event Sources (GitHub, Kafka, Slack, Cron, etc.)
✅ Event types produced by sources
✅ Functions that subscribe to event types
✅ Visual connections: Event Source → Function
✅ Status: "This function receives events from GitHub: octocat/repo"

---

## Implementation Plan

### Step 1: Remove Broker UI Elements
- Remove Phase 5 from 002 plan (Brokers CRUD)
- Remove broker selection from event subscription dialog
- Update Function CR YAML generator to omit broker field

### Step 2: Implement Event Sources UI
- Event Sources list view
- Event Source creation form (6 types: GitHub, Kafka, Slack, Cron, HTTP, Custom)
- Event Source detail view
- YAML generators for each source type (always sink to "default")

### Step 3: Implement Event Subscription UI
- Update function detail view with event subscriptions section
- Event subscription dialog with two modes:
  - Browse Event Sources and select event types
  - Direct event type input
- Show which Event Sources produce each subscribed event type

### Step 4: Add Visualizations
- Event Source detail view: show connected functions
- Function detail view: show connected event sources
- Simple text-based or SVG diagrams
- No broker boxes in diagrams

### Step 5: Documentation
- Add explanatory text: "Platform automatically manages event routing"
- Help tooltips explaining event sources and subscriptions
- No mention of brokers in user-facing documentation

---

## Example User Journey

### Creating an Event-Driven Function

1. **Create Event Source**
   - Navigate to "Event Sources" tab
   - Click "Create Event Source"
   - Select "GitHub"
   - Enter: repository="octocat/hello-world", events=[push, pull_request]
   - Click "Create"
   - UI creates GitHubSource CR with sink pointing to default broker (invisible)

2. **Create Function**
   - Navigate to "Functions" tab
   - Click "Create Function"
   - Fill in name, image, scaling, networking
   - Click "Create Function"
   - Function created without event subscriptions initially

3. **Subscribe to Events**
   - View function details
   - Click "Subscribe to events"
   - Dialog shows: "GitHub: octocat/hello-world" with checkboxes for [push, pull_request]
   - Check "push"
   - Click "Subscribe"
   - Function CR updated with subscription to "com.github.push"
   - Controller creates Trigger pointing to default broker (invisible)

4. **View Event Flow**
   - Function detail view shows:
     ```
     Event Subscriptions:
     - com.github.push
       Source: GitHub: octocat/hello-world
     ```
   - Event Source detail view shows:
     ```
     Connected Functions:
     - my-function (subscribed to: push)
     ```

**User Experience:**
- Simple and direct: "My function receives push events from this GitHub repo"
- No broker configuration or selection
- No need to understand Knative Eventing topology
- Platform handles all routing automatically

---

## FAQ: Why Hide Brokers?

**Q: Don't users need control over brokers for advanced features like delivery config?**
A: The platform can provide namespace-level or cluster-level delivery policies without exposing brokers. Advanced users can configure via backend APIs or CRDs if needed, but the UI keeps it simple.

**Q: What if users want multiple brokers for isolation?**
A: Use namespace isolation instead. Different namespaces have different default brokers. For same-namespace isolation, consider different event types or source filtering.

**Q: What about broker status and observability?**
A: Show event delivery metrics at the Event Source and Function level. Users see "GitHub events delivered" and "Function invocations from events" without seeing broker metrics.

**Q: How do users troubleshoot event routing issues?**
A: Provide event flow tracing from source to function. Show delivery attempts, failures, and retries at the connection level (Event Source → Function), not at the broker level.

**Q: Isn't this "hiding" making things harder to understand?**
A: No - it's the right abstraction. Users care about "where events come from" (sources) and "where events go to" (functions). Brokers are plumbing. Compare to AWS Lambda: users don't configure SNS topics' internal routing; they just connect Lambda to SNS.
