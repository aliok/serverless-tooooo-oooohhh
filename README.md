# Serverless 2.0 Architecture Explorations

This repository contains paper prototypes and working implementations exploring different architectural approaches for Serverless 2.0.

## Approaches - Key Architectural Differences

| Aspect | 001 - God CRD | 002 - UI Composition | 003 - Broker-Free | 004 - Event Sinks | 005 - Reply Management | 006 - Broker-Only |
|--------|---------------|---------------------|-------------------|-------------------|----------------------|-------------------|
| **Resource Creation** | Function controller creates all | UI creates multiple | UI creates multiple | UI creates multiple | UI creates multiple | UI creates multiple |
| **Resource Relationship** | Controller manages via ownerRefs | Labels + ownerRefs to Function CR | Labels + ownerRefs to Function CR | Labels + ownerRefs to Function CR | Labels + ownerRefs to Function CR | Labels + ownerRefs to Function CR |
| **Function Sink** | Configurable | Only Broker | Only Broker (implicit) | Anything (Broker/Function/Sink) | Anything (Broker/Function/Sink) | None (Functions don't have sinks) |
| **Event Source Sink** | Configurable | Only Broker | Only Broker (implicit) | Anything (Broker/Function/Sink) | Anything (Broker/Function/Sink) | Only Broker |
| **Function Replies** | Not specified | Not specified | Not specified | Not specified | ✅ Managed and specified | ✅ Managed (only to Brokers) |
| **Broker Visibility** | Visible | Visible | Hidden (auto-created) | Visible | Visible | Visible |
| **Event Routing** | Flexible | Flexible | All through brokers | Flexible | Flexible | ✅ All through brokers (enforced) |
| **User Complexity** | Single API | Multiple resources (visible) | Multiple resources (brokers hidden) | Multiple resources (visible) | Multiple resources (visible) | Multiple resources (visible) |
| **Controller Scope** | All subsystems | Eventing only | Eventing only | Eventing only | Eventing + reply discovery | Eventing + reply discovery |

**001 - God CRD**: Single comprehensive Function CRD. Controller creates and manages all resources (Deployment, Service, HTTPScaledObject, Trigger, etc.). Users only interact with Function CR.

**002 - UI Composition**: Minimal Function CRD (eventing only). UI creates multiple labeled resources. Function controller only manages Triggers. Resources relate via `serverless.openshift.io/function` label and ownerReferences. Functions can only sink to Brokers.

**003 - Broker-Free**: Builds on 002, but hides Brokers completely. Platform auto-creates default broker. Users see Event Sources → Functions (brokers invisible in UI).

**004 - Event Sinks**: Builds on 002. Adds Event Sink resources. Functions and Event Sources can sink to anything (Broker/Function/Event Sink). Flexible routing topology.

**005 - Reply Management**: Builds on 004. Adds Function reply specification and discovery. Function controller can observe and record reply event types in Function CR status.

**006 - Broker-Only**: Builds on 005. Enforces all events flow through Brokers. Functions cannot have sinks (only replies to Brokers). Event Sources can only sink to Brokers. Consistent event bus pattern.

---

## Detailed Documentation

- [001 - God CRD](001): Specification only
- [002 - UI Composition](002): Detailed specification
- [003 - Broker-Free](003): Working prototype
- [004 - Event Sinks](004): Working prototype (HTML/CSS/JavaScript)
- [005 - Reply Management](005): Working prototype with interactive network graph
- [006 - Broker-Only](006): Working prototype with comprehensive interactive visualization

---

## Additional Considerations

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
