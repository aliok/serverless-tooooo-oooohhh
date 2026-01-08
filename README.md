# Serverless 2.0 Architecture Explorations

This repository contains paper prototypes and working implementations exploring different architectural approaches for Serverless 2.0.

## Approaches

### [001](001) - Comprehensive Function CRD
**Philosophy**: Single, comprehensive CRD containing all function configuration

**How it works**:
- Function CRD includes all fields: code, runtime, dependencies, scaling, networking, eventing
- Function controller creates all other resources (Deployment, HTTPScaledObject, Trigger, etc.)
- Users interact with only one API

**Key characteristics**:
- ✅ Excellent user experience - single API to learn
- ❌ Monolithic CRD - becomes large like Knative Serving
- ❌ Limited flexibility - hard to expose all underlying options
- ❌ Controller complexity - must implement all subsystem logic

**Status**: Specification only

---

### [002](002) - UI as Composition Layer
**Philosophy**: Minimal Function CRD + UI creates multiple Kubernetes resources

**How it works**:
- Function CRD contains only event semantics (subscriptions, sinks)
- UI acts as composition layer, creating multiple resources:
  - Build (Shipwright Build or OpenShift S2I)
  - Runtime (Deployment, Service)
  - Scaling (HTTPScaledObject or ScaledObject)
  - Networking (HTTPRoute, Ingress, or Route)
- Function controller only manages eventing resources (Triggers)
- All resources labeled with `serverless.openshift.io/function`

**Key characteristics**:
- ✅ Minimal, stable Function API - only eventing semantics
- ✅ Kubernetes-native composition - use existing controllers
- ✅ Flexible - users can directly modify underlying resources
- ✅ Loose coupling - subsystems evolve independently
- ❌ No transactional guarantees - eventual consistency
- ❌ UI becomes critical infrastructure
- ❌ Temporary inconsistencies visible to users

**Status**: Detailed specification + working prototype (see 004)

---

### [003](003) - Broker-Free Eventing
**Philosophy**: Hide eventing infrastructure complexity from users

**How it works**:
- Builds on approach 002
- Brokers completely hidden from users
- Platform auto-creates "default" broker in each namespace
- Users only see: Event Sources → Functions
- Event types become the connection points

**User experience**:
- Create Event Sources (GitHub, Kafka, Slack, Cron, etc.)
- Create Functions and subscribe to event types
- Never see Brokers, Triggers, or routing topology

**Key characteristics**:
- ✅ Simplified eventing - no broker concept for users
- ✅ Direct visual connections - Event Source → Function
- ✅ Reduced cognitive load - fewer abstractions
- ❌ Less control - can't configure broker settings
- ❌ Single broker topology - may not suit all use cases
- ❌ Advanced users may want broker visibility

**Status**: Working prototype

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

## Comparison Matrix

| Aspect                    | 001 (God CRD)          | 002 (UI Composition)              | 003 (Broker-Free)                 | 004 (002 + Sinks)                       |
|---------------------------|------------------------|-----------------------------------|-----------------------------------|-----------------------------------------|
| **Function CRD Size**     | Large, comprehensive   | Minimal, eventing-only            | Minimal, eventing-only            | Minimal, eventing + sinks               |
| **Controller Scope**      | All subsystems         | Eventing only                     | Eventing only                     | Eventing only                           |
| **Resource Creation**     | Controller creates all | UI creates most                   | UI creates most                   | UI creates most                         |
| **User Complexity**       | Single API             | Multiple resources (hidden by UI) | Multiple resources (hidden by UI) | Multiple resources (hidden by UI)       |
| **Flexibility**           | Limited                | High                              | Medium                            | High                                    |
| **Broker Visibility**     | Configurable           | Visible                           | Hidden                            | Visible                                 |
| **Event Sinks**           | Configurable           | Not in spec                       | Not in spec                       | ✅ Supported (destination configuration) |
| **Function Chaining**     | Configurable           | Not in spec                       | Not in spec                       | ✅ Supported                             |
| **Advanced Use Cases**    | Hard to support        | Well supported                    | Limited                           | Well supported                          |
| **UI Dependency**         | Optional               | Critical                          | Critical                          | Critical                                |
| **Implementation Status** | Spec only              | Prototype                         | Prototype                         | Prototype                               |



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
