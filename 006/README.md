# 006 - Interactive Detail View Graphs with Reply CloudEvents

**Philosophy**: Same as 005, with fully interactive detail view graphs and bi-directional event flow visualization

**Eventing Model**: All events flow through Brokers - no direct connections between Event Sources and Functions, or between Functions.

## What's New in 006

Building on approach 005, this iteration adds:

1. **Interactive SVG graphs for all detail views**
   - Function detail view: Brokers ↔ Function
   - Broker detail view: Event Sources → Broker → Functions/Sinks
   - Event Source detail view: External Source → Event Source → Broker
   - Event Sink detail view: Brokers → Event Sink → External Destination

2. **Drag-and-drop node positioning**
   - Drag any node to reposition it
   - Edges automatically update after drag
   - Positions persist across navigation
   - Smooth visual feedback during drag

3. **Reply CloudEvent visualization**
   - Green arrows show Functions replying back to Brokers
   - Bi-directional event flow: Broker → Function (gray) and Function → Broker (green)
   - Reply event types displayed on green edges
   - Vertical offset prevents edge collision

4. **Click-through navigation**
   - Click any node to navigate to its detail view
   - Quick exploration of the event topology
   - Navigate from overview to details and back

5. **Function CR status enhancement**
   - `status.eventing.replyEventTypes` shows what CloudEvents the function sends as replies
   - Visible in YAML preview

## Eventing Architecture

### All Events Flow Through Brokers

In approach 006, **all events must flow through Brokers**. There are no direct connections:

❌ **Not allowed**:
- Event Source → Function (direct)
- Function → Function (direct chaining)
- Event Source → Event Sink (direct)

✅ **Required flow**:
- Event Source → Broker → Function
- Event Source → Broker → Event Sink
- Function → Broker (reply) → Function (subscription)
- Function → Broker (reply) → Event Sink (subscription)

This ensures:
- **Consistent routing**: All event routing goes through the broker's delivery guarantees
- **Observability**: All events are visible in the broker topology
- **Reliability**: Broker provides retry, dead-letter queues, and delivery guarantees
- **Decoupling**: Publishers and subscribers don't need to know about each other

### Why Enforce Broker-Only Routing?

This architectural constraint (all events through brokers) provides several benefits:

1. **Single event bus pattern**: Brokers act as the central event bus for the namespace
2. **Uniform delivery semantics**: All events get the same retry and error handling
3. **Simplified debugging**: All event flow is visible in one place (the broker)
4. **Event filtering**: Brokers can filter events by type before delivery
5. **Multi-subscriber support**: Easily add/remove subscribers without changing producers
6. **Event replay**: Brokers can support event replay for recovery scenarios

Trade-offs:
- ❌ Extra hop adds minimal latency (~1-5ms)
- ❌ Cannot bypass broker for "fast path" scenarios
- ✅ Consistency and observability benefits outweigh performance cost for most use cases

### Event Flow Patterns

**Pattern 1: Event Source to Function**
```
GitHub Source → Broker → github-webhook-handler (processes event)
                    ↑                        ↓
                    └────────────────────────── (reply: webhook.processed)
```

**Pattern 2: Function Chaining (via Broker)**
```
github-webhook-handler → Broker (reply: webhook.processed) → notification-sender
                                                              (subscribes to webhook.processed)
```

**Pattern 3: Event Sink Integration**
```
notification-sender → Broker (reply: notification.sent) → slack-notifier
                                                           (sends to Slack webhook)
```

## How It Works

### Interactive Graphs

All detail views now use programmatically-generated SVG with:
- **Node positioning**: Columnar layout with drag-and-drop repositioning
- **Edge rendering**: Smart path calculation with arrowheads
- **Edge consolidation**: Multiple subscriptions between same nodes → single arrow
- **Position persistence**: `nodePositions` object stores positions per view

### Reply CloudEvents

Functions can send reply CloudEvents back to the broker that sent them the original event:

```javascript
// In Function subscription
{
    broker: 'default',
    eventType: 'dev.knative.sources.github.event',
    replyEventType: 'dev.knative.function.processed'  // Reply type
}
```

The visualization shows:
- **Gray arrows**: Incoming events (Broker → Function)
- **Green arrows**: Reply events (Function → Broker)

### Graph Rendering Architecture

```
Shared SVG Utilities (app.js)
├── createArrowheadMarker() - SVG marker definitions
├── generateEdgePath() - Path elements with color support
├── generateEdgeLabel() - Text labels with multi-line support
├── generateNodeSVG() - Node boxes with icons
├── consolidateEdges() - Merge duplicate edges
└── setupGraphDragAndDrop() - Drag-and-drop handlers

Detail View Renderers
├── renderFunctionDetailGraph() - Brokers ↔ Function
├── renderBrokerDetailGraph() - Sources → Broker → Subscribers
├── renderEventSourceDetailGraph() - External → Source → Broker
└── renderEventSinkDetailGraph() - Brokers → Sink → External
```

## User Experience

### Overview Tab
- Network graph showing all entities and connections
- Green reply arrows from Functions back to Brokers
- Drag any node to reposition
- Click any entity to view details

### Function Detail View
- Left column: Brokers sending events to this function
- Right: The function itself
- Gray arrows: Incoming events with event types
- Green arrows: Reply events sent back to brokers
- Click brokers to navigate to their detail views

### Broker Detail View
- Left column: Event Sources sending to this broker
- Center: The broker itself
- Right column: Functions and Event Sinks subscribed to this broker
- Green arrows show which functions reply back
- Click any node to navigate

### Event Source Detail View
- Left: External source (GitHub, Kafka, etc.)
- Center: Event Source resource
- Right: Target Broker
- Shows event types flowing through

### Event Sink Detail View
- Left column: Brokers sending events to this sink
- Center: The Event Sink
- Right: External destination
- Shows event types being delivered

## Key Characteristics

- ✅ Everything from approach 005
- ✅ Plus: Interactive SVG graphs for all detail views
- ✅ Plus: Drag-and-drop node positioning with persistence
- ✅ Plus: Reply CloudEvent visualization (bi-directional flow)
- ✅ Plus: Click-through navigation between entities
- ✅ Plus: Edge consolidation for cleaner graphs
- ✅ Plus: Function CR status shows reply event types
- ✅ Enhanced observability - see complete event flow topology

## Prototype

The prototype is a web-based application demonstrating:
- Overview network graph with all entities
- Interactive detail views for Functions, Brokers, Event Sources, and Event Sinks
- Drag-and-drop positioning
- Reply CloudEvent visualization
- Live YAML generation for all resources

### Running the Prototype

```bash
cd 006/prototype
python3 -m http.server 8000
# Open http://localhost:8000
```

### Demo Data

The prototype demonstrates a **Smart Meter IoT Processing Pipeline** with realistic event-driven architecture:

**Event Flow Chain**:
```
MQTT Meters → Broker → reading-normalizer → Broker → anomaly-detector → Broker → TimeSeries DB
                      (reply: reading.normalized)   (reply: anomaly.evaluated)   (stores anomalies)
```

**Resources**:
- **Functions**:
  - `reading-normalizer`: Validates, normalizes, and enriches incoming meter readings
    - Subscribes to: `com.example.meter.reading.received`
    - Replies with: `com.example.meter.reading.normalized`
  - `anomaly-detector`: Detects abnormal consumption patterns and evaluates risk
    - Subscribes to: `com.example.meter.reading.normalized`
    - Replies with: `com.example.meter.anomaly.evaluated`
- **Broker**: `default` (routes all events)
- **Event Source**: `mqtt-meter-source` (MQTT smart meters via Kafka bridge)
  - Produces: `com.example.meter.reading.received`
- **Event Sink**: `timeseries-db` (PostgreSQL database)
  - Subscribes to: `com.example.meter.anomaly.evaluated`
  - Stores anomalies in `meter_anomalies` table

**Use Case**: Smart meter data flows from IoT devices through MQTT, gets converted to CloudEvents, validated and normalized, checked for anomalies, and stored in a time-series database for monitoring.

This demonstrates:
1. **IoT event processing**: MQTT → CloudEvents conversion
2. **Function chaining via broker**: anomaly-detector subscribes to reading-normalizer's reply
3. **Event Sink integration**: Database stores final processed results
4. **Complete event-driven workflow**: IoT device → validate → analyze → persist

## Implementation Notes

### Edge Collision Avoidance

Reply edges are offset vertically by 20px to prevent collision with incoming edges:

```javascript
const verticalOffset = 20;
edges.push({
    from: { x: funcPos.x, y: funcPos.y + nodeHeight/2 + verticalOffset },
    to: { x: brokerPos.x + nodeWidth, y: brokerPos.y + nodeHeight/2 + verticalOffset },
    color: '#4CAF50'  // Green
});
```

### Position Persistence

Node positions are stored with unique keys per view:

```javascript
// Format: {viewType}-detail-{centerNodeId}-{nodeType}-{nodeId}
nodePositions['function-detail-example-function-broker-default-broker'] = { x: 50, y: 150 };
```

### Drag-and-Drop Implementation

1. Mouse down: Capture node and offset
2. Mouse move: Update node position in DOM directly (no re-render)
3. Mouse up: Save position and re-render graph to update edges
4. Click detection: Require > 5px movement to enter drag mode

### UI Backend Pattern (Production Implementation)

**IMPORTANT**: This prototype generates YAML client-side for demonstration purposes. In a real production implementation (e.g., OpenShift Console):

#### Architecture Flow

```
User fills form → UI client (browser) → UI backend (Console backend) → Kubernetes API
                                              ↓
                                    Creates ALL resources directly
```

#### What the UI Backend Creates

The **OpenShift Console backend** (or similar UI backend) receives the form data and creates ALL resources via Kubernetes API:

1. **Function CR** - the semantic anchor for grouping
2. **Deployment** - runtime workload
3. **Service** - network endpoint
4. **HTTPScaledObject** or **ScaledObject** - KEDA scaling config
5. **Trigger(s)** - one per event subscription
6. **Build/BuildConfig** - if build is configured
7. **HTTPRoute/Ingress/Route** - if external networking is configured

The UI backend would:
- Set `ownerReferences` on all created resources pointing back to the Function CR
- Populate `status.resources` with references to all created resources
- Populate `status.conditions` with initial state
- Create all resources in a single transaction (or rollback on failure)

#### Prototype Simplification

This prototype generates all resource YAMLs client-side (in the browser) to demonstrate:
1. What resources the UI backend would create
2. How the Function CR groups multiple platform resources
3. The relationship between user-facing form and platform implementation

In production, the UI client would send form data to the backend, and the backend would create all resources via Kubernetes API.

## Comparison with 005

| Aspect                          | 005                                  | 006                                                        |
|---------------------------------|--------------------------------------|------------------------------------------------------------|
| **Overview Graph**              | Interactive SVG, drag-and-drop       | Same + reply CloudEvents (green arrows)                    |
| **Function Detail View**        | Static HTML/CSS diagram              | Interactive SVG with drag-and-drop                         |
| **Broker Detail View**          | Static HTML/CSS diagram              | Interactive SVG with drag-and-drop                         |
| **Event Source Detail View**    | Static HTML/CSS diagram              | Interactive SVG with drag-and-drop                         |
| **Event Sink Detail View**      | Static HTML/CSS diagram              | Interactive SVG with drag-and-drop                         |
| **Reply CloudEvents**           | Not visualized                       | ✅ Green arrows showing bi-directional flow                |
| **Navigation**                  | Links between views                  | Click-through navigation on graph nodes                    |
| **Edge Consolidation**          | Overview only                        | ✅ All detail views                                        |
| **Position Persistence**        | Overview only                        | ✅ All graphs (per-view storage)                           |
| **Function CR Status**          | No reply types                       | ✅ Shows replyEventTypes                                   |

## Next Steps

Potential future enhancements:
- Event type filtering in graphs
- Timeline view showing historical event flow
- Live metrics overlay (event counts, latency)
- Export/import graph layouts
- Zoom and pan controls for large topologies
- Minimap for navigation
- Search and highlight in graphs
