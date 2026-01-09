# Serverless 2.0 Architecture Explorations

This repository contains paper prototypes and working implementations exploring different architectural approaches for Serverless 2.0.

## Approaches - Key Architectural Differences

| Aspect | 001 - God CRD | 002 - UI Composition | 003 - Broker-Free |
|--------|---------------|---------------------|-------------------|
| **Resource Creation** | Function controller creates all resources | UI creates multiple resources | UI creates multiple resources |
| **Resource Relationship** | Controller manages via ownerReferences | Resources labeled `serverless.openshift.io/function` + ownerRefs to Function CR | Resources labeled `serverless.openshift.io/function` + ownerRefs to Function CR |
| **Function Sink** | Configurable (Broker, Function, Service) | Only Broker | Only Broker (implicit) |
| **Event Source Sink** | Configurable | Only Broker | Only Broker (implicit) |
| **Function Replies** | Not specified | Not specified | Not specified |
| **Broker Visibility** | Visible and configurable | Visible and configurable | Hidden from users (auto-created) |
| **Event Routing** | Flexible | Flexible | All through brokers |
| **User Complexity** | Single API | Multiple resources (visible) | Multiple resources (brokers hidden) |
| **Controller Scope** | All subsystems | Eventing only | Eventing only |

**001 - God CRD**: Single comprehensive Function CRD. Controller creates and manages all resources (Deployment, Service, HTTPScaledObject, Trigger, etc.). Users only interact with Function CR.

**002 - UI Composition**: Minimal Function CRD (eventing only). UI creates multiple labeled resources. Function controller only manages Triggers. Resources relate via `serverless.openshift.io/function` label and ownerReferences.

**003 - Broker-Free**: Builds on 002, but hides Brokers completely. Platform auto-creates default broker. Users see Event Sources → Functions (brokers invisible in UI).

---

### [004](004) - Approach 002 + Event Sinks
**Philosophy**: Same as 002, with added support for event sinks/destinations

**How it works**:
- Same as approach 002 (UI as composition layer, minimal Function CRD)
- **Addition**: Functions can act as event sinks and chain to other functions/services
- Web-based prototype demonstrates the full approach

**Event sink capabilities**:
- Functions can receive events from sources
- Functions can send events to destinations (brokers, other functions, services)
- Supports function chaining and event forwarding
- Declarative destination configuration in Function CR

**Key characteristics**:
- ✅ Everything from approach 002
- ✅ Plus: Event sink/destination support
- ✅ Plus: Function chaining capabilities
- ✅ Working prototype validates the architecture

**Status**: Working prototype (HTML/CSS/JavaScript)

---

### [005](005) - Approach 004 + Event Type Discovery
**Philosophy**: Same as 004, with automatic discovery of event types produced by Functions

**How it works**:
- Same as approach 004 (UI as composition layer, event sinks)
- **Addition**: Function controller observes CloudEvents produced by Functions
- Controller populates `status.replyEventTypes` with discovered event types
- Network graph visualization shows actual event flow with real event types

**Event type discovery**:
- Function controller watches CloudEvents sent by Functions
- Observes `ce-type` header from produced events
- Updates Function CR status with discovered types
- UI reflects real event flow (not just declared subscriptions)

**Key characteristics**:
- ✅ Everything from approach 004
- ✅ Plus: Automatic event type discovery by Function controller
- ✅ Plus: Status field shows actual produced event types
- ✅ Plus: Interactive network graph with real-time event flow
- ✅ Improved observability - see what Functions actually produce

**Status**: Working prototype with interactive network graph

---

### [006](006) - Interactive Detail View Graphs with Reply CloudEvents
**Philosophy**: Same as 005, with fully interactive detail views and bi-directional event flow visualization

**Eventing Model**: All events flow through Brokers - no direct Function-to-Function or EventSource-to-Function connections

**How it works**:
- Same as approach 005 (UI composition, event sinks, event type discovery)
- **Architecture**: All events must flow through Brokers (Event Source → Broker → Function/Sink)
- **Addition**: All detail views use interactive SVG graphs with drag-and-drop
- **Addition**: Reply CloudEvents visualized as green arrows (Function → Broker)
- **Addition**: Click-through navigation between graph nodes
- **Addition**: Edge consolidation in all views

**Interactive graphs**:
- Function detail: Brokers ↔ Function with reply flows
- Broker detail: Event Sources → Broker → Functions/Sinks with replies
- Event Source detail: External → Event Source → Broker
- Event Sink detail: Brokers → Event Sink → External
- Drag nodes to reposition, edges auto-update
- Positions persist across navigation

**Reply CloudEvent visualization**:
- Gray arrows: Incoming events (Broker → Function)
- Green arrows: Reply events (Function → Broker)
- Shows complete bi-directional event flow
- Reply event types displayed on edges

**Key characteristics**:
- ✅ Everything from approach 005
- ✅ Plus: Interactive SVG graphs for all detail views
- ✅ Plus: Drag-and-drop node positioning with persistence
- ✅ Plus: Reply CloudEvent visualization (bi-directional flow)
- ✅ Plus: Click-through navigation on graph nodes
- ✅ Plus: Edge consolidation in all views
- ✅ Enhanced observability - complete event topology visible

**Status**: Working prototype with comprehensive interactive visualization

---

## Comparison Matrix

| Aspect                      | 001 (God CRD)          | 002 (UI Composition)              | 003 (Broker-Free)                 | 004 (002 + Sinks)                       | 005 (004 + Discovery)                            | 006 (005 + Interactive)                                    |
|-----------------------------|------------------------|-----------------------------------|-----------------------------------|-----------------------------------------|--------------------------------------------------|------------------------------------------------------------|
| **Function CRD Size**       | Large, comprehensive   | Minimal, eventing-only            | Minimal, eventing-only            | Minimal, eventing + sinks               | Minimal, eventing + sinks + status               | Minimal, eventing + sinks + status + replies               |
| **Controller Scope**        | All subsystems         | Eventing only                     | Eventing only                     | Eventing only                           | Eventing + event type discovery                  | Eventing + event type discovery                            |
| **Resource Creation**       | Controller creates all | UI creates most                   | UI creates most                   | UI creates most                         | UI creates most                                  | UI creates most                                            |
| **User Complexity**         | Single API             | Multiple resources (hidden by UI) | Multiple resources (hidden by UI) | Multiple resources (hidden by UI)       | Multiple resources (hidden by UI)                | Multiple resources (hidden by UI)                          |
| **Flexibility**             | Limited                | High                              | Medium                            | High                                    | High                                             | High                                                       |
| **Broker Visibility**       | Configurable           | Visible                           | Hidden                            | Visible                                 | Visible                                          | Visible                                                    |
| **Event Routing**           | Flexible               | Flexible                          | All through brokers               | Flexible                                | Flexible                                         | ✅ All through brokers (enforced)                           |
| **Event Sinks**             | Configurable           | Not in spec                       | Not in spec                       | ✅ Supported (destination configuration) | ✅ Supported                                      | ✅ Supported                                                |
| **Function Chaining**       | Configurable           | Not in spec                       | Not in spec                       | ✅ Supported                             | ✅ Supported                                      | ✅ Supported                                                |
| **Event Type Discovery**    | Not supported          | Not supported                     | Not supported                     | Not supported                           | ✅ Automatic (by Function controller)             | ✅ Automatic (by Function controller)                       |
| **Reply CloudEvents**       | Not supported          | Not supported                     | Not supported                     | Not supported                           | Not visualized                                   | ✅ Visualized (green arrows, bi-directional)                |
| **Network Graph**           | Not implemented        | Not implemented                   | Not implemented                   | Not implemented                         | ✅ Interactive with real event types              | ✅ Interactive with reply flows                             |
| **Detail View Graphs**      | Not implemented        | Not implemented                   | Not implemented                   | Static HTML/CSS                         | Static HTML/CSS                                  | ✅ Interactive SVG with drag-and-drop                       |
| **Graph Navigation**        | Not implemented        | Not implemented                   | Not implemented                   | Links only                              | Links only                                       | ✅ Click-through on nodes                                   |
| **Edge Consolidation**      | Not implemented        | Not implemented                   | Not implemented                   | Not implemented                         | Overview only                                    | ✅ All views                                                |
| **Position Persistence**    | Not implemented        | Not implemented                   | Not implemented                   | Not implemented                         | Overview only                                    | ✅ All graphs (per-view storage)                            |
| **Observability**           | Basic                  | Basic                             | Basic                             | Basic                                   | ✅ Enhanced (shows actual produced event types)   | ✅✅ Comprehensive (topology + bi-directional flow)          |
| **Advanced Use Cases**      | Hard to support        | Well supported                    | Limited                           | Well supported                          | Well supported                                   | Well supported                                             |
| **UI Dependency**           | Optional               | Critical                          | Critical                          | Critical                                | Critical                                         | Critical                                                   |
| **Implementation Status**   | Spec only              | Prototype                         | Prototype                         | Prototype                               | ✅ Prototype with network visualization           | ✅✅ Prototype with comprehensive interactive visualization  |



Aspects to consider for Serverless 2.0:
- Function API
- Event subscriptions
- Event sinks (?)
  - Requires the user app being push-based (?)
- Building the function
  - Build from Git repo
- Online editor
- Autoscaling
- Vibe coder
  - Give prompt and get a function deployed
- CI/CD with Tekton (?)
- Advanced
  - Container level configuration
    - Stateful set, resource limits, etc.
