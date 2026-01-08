# Approach 004: UI Composition Layer + Event Sinks

## Overview

This is **Approach 002** (UI as Composition Layer) with the addition of **event sink/destination support**. The working web-based prototype demonstrates how a simple "Create Function" UI can compose multiple Kubernetes resources while hiding the underlying complexity from users.

**What's different from 002**: Functions can act as event sinks and send events to destinations (other functions, brokers, services), enabling function chaining and event forwarding.

**Key demonstration**: The gap between what users think they're creating ("a Function") and what the platform actually creates (Deployment, Service, HTTPScaledObject, Function CR, Triggers, etc.).

## Quick Start

1. Open `prototype/index.html` in your web browser
2. Fill out the "Create Function" form
3. Click "Create Function"
4. See the resources the UI would create
5. Expand each resource card to view generated YAML
6. Copy YAML to clipboard for real cluster deployment

No build tools, no server, no dependencies - just open the HTML file!

## What This Prototype Demonstrates

### 1. UI as Abstraction Layer
- **User sees**: Simple form with high-level concepts (function name, scaling method, networking)
- **Platform creates**: 4-6 Kubernetes resources from multiple API groups
- **Key insight**: Users never have to understand Deployment, Service, HTTPScaledObject, Trigger APIs

### 2. Visual Separation
The UI clearly shows two perspectives:
- **"What User Thinks"** (top, green) - "You created a Function with auto-scaling"
- **"What UI Creates"** (bottom, blue) - Deployment, Service, HTTPScaledObject, etc.

### 3. Resource Composition
All composed resources share a common label:
```yaml
labels:
  serverless.openshift.io/function: my-function
```

This enables:
- Discovery: Find all resources belonging to a function
- Deletion: Cascading cleanup via ownerReferences
- Status aggregation: Roll up health from all resources

### 4. Multi-Phase Implementation

The prototype implements 5 phases, each adding a new dimension of composition:

#### Phase 1: Scaling & Runtime ✅
- **Resources**: Deployment, Service, HTTPScaledObject/ScaledObject
- **Demonstrates**: Multiple scaling methods (HTTP concurrency, HTTP request rate, KEDA triggers)
- **Choices**: 7 KEDA trigger types (CPU, Memory, Prometheus, Kafka, RabbitMQ, Redis, Cron) + custom

#### Phase 2: Networking ✅
- **Resources**: HTTPRoute, Ingress, or OpenShift Route (optional)
- **Demonstrates**: Multiple networking approaches for different platforms
- **Choices**: Gateway API, Ingress, OpenShift Route, or no external access

#### Phase 3: Build ✅
- **Resources**: Shipwright Build or OpenShift BuildConfig (optional)
- **Demonstrates**: Building from source vs. pre-built images
- **Choices**: No build, Shipwright (7 strategies), or S2I (8 builder images)

#### Phase 4: Eventing ✅
- **Resources**: Function CR with event subscriptions
- **Demonstrates**: AWS Lambda-style post-creation workflow
- **Feature**: Add/remove event subscriptions after function creation

#### Phase 5: Event Sources & Brokers (In Progress)
- **Resources**: Broker CR, Event Source CRs (GitHubSource, KafkaSource, etc.)
- **Demonstrates**: Complete event-driven architecture management
- **Feature**: CRUD for brokers and event sources

## Architecture Principles Demonstrated

### 1. Minimal Function CRD
The Function CR contains **only eventing semantics** (subscriptions and sinks):
```yaml
apiVersion: serverless.openshift.io/v1alpha1
kind: Function
spec:
  eventing:
    subscriptions:
      - broker: default
        eventTypes:
          - com.github.push
    sink:
      ref:
        apiVersion: v1
        kind: Service
        name: downstream-function
      # OR send to broker:
      # ref:
      #   apiVersion: eventing.knative.dev/v1
      #   kind: Broker
      #   name: default
      # OR send to another function:
      # function: other-function-name
```

Everything else (build, runtime, scaling, networking) is composed via standard Kubernetes resources.

**Event sink addition (004 vs 002)**: The Function CR can declare where to send events after processing, enabling function chaining.

### 2. UI Responsibility
The UI (or CLI) is responsible for:
- Resource composition
- Policy application
- Providing cognitive boundary for users

### 3. Controller Responsibility
The Function controller is responsible for **eventing only**:
- Watches Function CRs
- Creates Knative Triggers based on subscriptions
- Does NOT manage build, runtime, scaling, or networking

### 4. Existing Controllers
Standard Kubernetes controllers handle their domains:
- **Kubernetes**: Deployment, Service reconciliation
- **KEDA**: HTTPScaledObject, ScaledObject reconciliation
- **Shipwright/OpenShift**: Build reconciliation
- **Gateway API/Ingress**: Networking reconciliation

## Use Cases

### For Architects
- Evaluate the UI composition approach
- Compare with Approach 001 (god CRD)
- Understand tradeoffs between abstraction and flexibility

### For Product Managers
- See what users would experience
- Evaluate workflow and UX patterns
- Compare with AWS Lambda, Google Cloud Functions

### For Developers
- Understand resource relationships
- See generated YAML for real cluster deployment
- Learn Kubernetes composition patterns

### For Stakeholders
- Visualize the "API soup" problem
- Understand how UI prevents user exposure to complexity
- See working proof-of-concept

## Technology Stack

**Why so simple?**
- **No framework**: Pure HTML/CSS/JavaScript
- **No build tools**: No npm, webpack, babel
- **No server**: Static files, open directly in browser
- **No dependencies**: Self-contained, portable

**Why?** Maximum accessibility and simplicity for a proof-of-concept. Anyone can open `index.html` and see it work.

## File Structure

```
004/
├── README.md (this file)
└── prototype/
    ├── PLAN.md           # Detailed implementation plan
    ├── index.html        # Main UI layout
    ├── styles.css        # Styling
    ├── app.js            # UI logic and event handling
    ├── state.js          # State management (functions, brokers, event sources)
    └── templates.js      # YAML generators for all resources
```

## Key Features

### 1. Live YAML Generation
- See exactly what YAML the UI would apply
- Updates in real-time as you change form inputs
- Copy to clipboard for real cluster deployment

### 2. Validation
- Required field validation
- Method-specific field validation
- Clear error messages

### 3. Multiple Options
- **Scaling**: HTTP concurrency, HTTP request rate, 7 KEDA trigger types, custom
- **Networking**: Gateway API, Ingress, OpenShift Route, none
- **Build**: No build, Shipwright (7 strategies), S2I (8 builders)
- **Eventing**: Post-creation subscription management

### 4. Realistic Examples
- Pre-populated with sensible defaults
- Example configurations for common use cases
- Generated YAMLs follow Kubernetes best practices

## Comparison with Other Approaches

| Aspect | 001 (God CRD) | 002 (Spec) | 003 (Broker-Free) | 004 (This) |
|--------|---------------|------------|-------------------|------------|
| **Relationship** | Different approach | Same approach | Different approach | 002 + Event Sinks |
| **Function CRD** | Comprehensive | Minimal, eventing-only | Minimal, eventing-only | Minimal, eventing + sinks |
| **Event Sinks** | Configurable | Not in spec | Not in spec | ✅ Supported |
| **Function Chaining** | Configurable | Not in spec | Not in spec | ✅ Supported |
| **Broker visibility** | Configurable | Visible | Hidden | Visible |
| **Implementation** | Spec only | Spec only | Prototype | Prototype |

**004 vs 002**: This is the same approach as 002, with the addition of event sink/destination support. Functions can forward events to other functions or services.

**004 vs 003**: Both are prototypes but different approaches - 004 keeps brokers visible (like 002), while 003 hides them completely for simpler UX.

## Tradeoffs Demonstrated

### Pros ✅
- **No API soup for users**: Simple form hides complexity
- **Kubernetes-native**: Uses standard resources and controllers
- **Flexible**: Users can modify underlying resources directly
- **Loosely coupled**: Subsystems evolve independently
- **Educational**: Makes composition pattern visible

### Cons ❌
- **UI becomes critical**: Not optional infrastructure
- **No transactional guarantees**: Resources created independently
- **Eventual consistency**: Temporary inconsistencies visible
- **More resources**: Users see 4-6 resources instead of 1
- **Advanced user question**: Why not just use kubectl with the resources directly?

## Next Steps

To deploy this in a real environment, you would need:

1. **Function Controller**
   - Watches Function CRs
   - Creates Knative Triggers based on subscriptions
   - Updates Function status

2. **UI Backend** (optional)
   - REST API for CRUD operations
   - Kubernetes API integration
   - Authentication/authorization

3. **Web Console Integration**
   - Embed into OpenShift Console or Kubernetes Dashboard
   - Real-time status updates
   - Resource aggregation and health checks

4. **CLI Tool**
   - Same composition logic as UI
   - Generate and apply YAML
   - Template-based workflows

## Related Documentation

- [Main README](../README.md) - Overview of all approaches
- [Approach 001](../001/spec/README.md) - Comprehensive Function CRD
- [Approach 002](../002/spec/README.md) - UI as Composition Layer (specification)
- [Approach 003](../003/prototype/README.md) - Broker-Free Eventing
- [Implementation Plan](prototype/PLAN.md) - Detailed phase-by-phase plan

## License

This is a proof-of-concept prototype for architectural exploration.
