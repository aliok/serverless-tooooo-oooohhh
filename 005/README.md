# Approach 005: UI as Composition Layer with Event Sinks and Event Type Discovery

This approach extends [Approach 004](../004/README.md) by adding automatic discovery of event types produced by Functions.

## Key Features

### Function Controller Discovers Produced Event Types

The Function controller watches CloudEvents produced by Functions and populates the `status.replyEventTypes` field in the Function CR. This provides visibility into what event types a Function actually produces.

**Example Function CR with Status:**

```yaml
apiVersion: serverless.openshift.io/v1alpha1
kind: Function
metadata:
  name: processor-function
  namespace: default
spec:
  eventing:
    subscriptions:
      - broker: default
        eventTypes:
          - dev.knative.sources.github.event
    sink:
      ref:
        apiVersion: eventing.knative.dev/v1
        kind: Broker
        name: default
status:
  # Discovered by Function controller watching actual CloudEvents produced by the function
  replyEventTypes:
    - com.processor.data.transformed
    - com.processor.validation.failed
```

### How It Works

1. **Function produces CloudEvents** to its configured sink (Broker, Event Sink, or another Function)
2. **Function controller observes** the `ce-type` header of CloudEvents sent by the Function
3. **Controller updates** `status.replyEventTypes` with discovered event types
4. **Network graph visualization** uses these types to label edges showing event flow

### SinkBinding for Direct Event Sending

Functions use SinkBinding to receive the `K_SINK` environment variable, enabling them to actively send CloudEvents:

- **To Broker**: Function sends events back to Broker for routing to other subscribers
- **To Event Sink**: Function sends events directly to external systems (HTTP, Kafka, etc.)
- **To another Function**: Function chains directly to another Function (bypassing Broker)

This is **NOT** a reply mechanism - Functions actively send new events via the injected sink.

## Network Graph Visualization

The prototype includes an interactive network graph showing:

- **Event Sources** (left) → **Broker** (center) → **Functions** (right) → **Event Sinks** (far right)
- Edge labels show actual event types (both subscriptions and produced events)
- Drag-and-drop node positioning
- Color-coded arrows:
  - Gray: subscriptions (incoming events to Functions)
  - Blue: produced events (outgoing from Functions)

## Differences from Approach 004

| Feature | Approach 004 | Approach 005 |
|---------|--------------|--------------|
| Event Sinks | ✅ Yes | ✅ Yes |
| Function Status | Basic | ✅ Includes `replyEventTypes` |
| Event Type Discovery | Manual | ✅ Automatic (by Function controller) |
| Network Graph | Not implemented | ✅ Interactive graph with event types |
| Visual Flow | Static | ✅ Dynamic with discovered types |

## Controller Responsibilities

### Function Controller

- Creates Deployment, Service for the Function
- Creates HTTPScaledObject or ScaledObject for autoscaling
- Creates HTTPRoute/Ingress/Route for external access (if configured)
- **Creates SinkBinding** to inject `K_SINK` into Function pods
- **Watches CloudEvents** produced by the Function
- **Updates `status.replyEventTypes`** with discovered event types
- Creates Triggers for each event subscription

### Broker Controller

- Routes events based on `ce-type` CloudEvent attribute
- Implements delivery policies (retry, backoff)
- Filters events for Triggers

## Resource Composition Example

When a user creates a Function with event subscriptions and a sink:

**User sees:**
- One Function resource

**Platform creates:**
- Function CR (with status populated by controller)
- Deployment (runtime)
- Service (networking)
- HTTPScaledObject (autoscaling)
- SinkBinding (sink injection)
- Trigger (for each subscription)

**At runtime:**
- Function controller observes produced CloudEvents
- Status field is populated with actual event types
- Network graph reflects real event flow

## Try It

Open `005/prototype/index.html` in a browser to see:
- Interactive network graph with real event types
- Function detail view showing discovered event types
- Resource preview with status field
- Event flow visualization with drag-and-drop positioning
