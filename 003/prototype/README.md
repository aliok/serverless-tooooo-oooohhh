# Approach 003: Broker-Free Eventing

This prototype demonstrates a broker-free eventing UI where brokers are completely hidden from users.

## Approach Summary

**Approach 003** builds on **Approach 002** but simplifies the eventing model:

| Aspect                | Approach 002                     | Approach 003 (This)                     |
|-----------------------|----------------------------------|-----------------------------------------|
| **Broker visibility** | Visible to users                 | Completely hidden                       |
| **Broker selection**  | User selects broker              | Platform manages "default"              |
| **Event connections** | Event Source → Broker → Function | Event Source → Function (broker hidden) |
| **Abstraction level** | Shows Knative topology           | Hides Knative topology                  |
| **User complexity**   | Must understand brokers          | Only understand sources and functions   |

**Key insight**: Further reduce cognitive load by hiding infrastructure concerns (brokers) and showing only logical connections (Event Source → Function).

---

## What Changed from 002

### User Experience
- **No "Brokers" tab** - Users only see "Functions" and "Event Sources"
- **No broker selection** - Event sources automatically send to platform-managed "default" broker
- **Direct connections** - UI shows Event Source → Function relationships
- **Simplified subscriptions** - Users subscribe to event types without choosing brokers

### Key Features

1. **Event Source Creation**
   - Support for GitHub, Kafka, Slack, and Cron sources
   - Automatic sink configuration to "default" broker
   - No broker dropdown or selection

2. **Function Event Subscriptions**
   - Browse event sources and select event types
   - Shows which sources produce each event type
   - No broker field in subscription data

3. **Visual Diagrams**
   - Event Source detail: shows which functions subscribe to its events
   - Function detail: shows which event sources produce subscribed event types
   - No broker boxes in diagrams

### Architecture

**Platform Responsibility:**
- Automatically create "default" broker in each namespace
- All event sources sink to "default" broker
- Function controller creates Triggers referencing "default" broker

**User Sees:**
- Event Sources (producers)
- Functions (consumers)
- Event types (connection points)

**User Never Sees:**
- Broker CRs
- Trigger CRs
- Broker configuration
- Event routing topology

### Generated YAMLs

**Event Source** (always sinks to "default"):
```yaml
apiVersion: sources.knative.dev/v1
kind: GitHubSource
spec:
  sink:
    ref:
      kind: Broker
      name: default  # ← Hardcoded
```

**Function CR** (no broker in subscriptions):
```yaml
apiVersion: serverless.openshift.io/v1alpha1
kind: Function
spec:
  eventing:
    subscriptions:
      - eventType: com.github.push
      - eventType: com.github.pull_request
```

**Trigger** (created by controller, not UI):
```yaml
apiVersion: eventing.knative.dev/v1
kind: Trigger
spec:
  broker: default  # ← Controller knows to use "default"
  filter:
    attributes:
      type: com.github.push
  subscriber:
    ref:
      kind: Service
      name: my-function
```

## Testing

Open `index.html` in a browser and verify:

1. Only "Functions" and "Event Sources" tabs visible
2. Create an event source - no broker selection required
3. Create a function and add event subscription
4. Subscription shows event source, not broker
5. Function detail diagram shows Event Source → Function connections

## Implementation Summary

- **state.js**: Removed brokers array, removed broker field from eventSources and eventSubscriptions
- **templates.js**: Hardcoded "default" broker in all event source YAMLs, simplified Function CR
- **index.html**: Removed all broker views and broker selection fields
- **app.js**: Updated event source and subscription handling to not use brokers

