# 006 - Interactive Detail View Graphs with Reply CloudEvents

**Philosophy**: Same as 005, with fully interactive detail view graphs and bi-directional event flow visualization

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

The prototype includes example data:
- 2 Functions (example-function, processor-function) with reply event types
- 1 Broker (default)
- 1 Event Source (github-webhook)
- 1 Event Sink (http-webhook)

Both functions send reply CloudEvents back to the default broker.

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
