# Function API as a Semantic Anchor over Composed Kubernetes Resources

## Problem Statement

A single “serverless function” requires coordination across multiple Kubernetes domains:

* Build APIs (Shipwright, S2I, etc.)
* Core Kubernetes APIs (`Deployment`, `Service`)
* Scaling APIs (KEDA)
* Eventing APIs (Knative Eventing)
* Networking APIs (Ingress, Gateway API)
* Observability APIs (Prometheus, OpenTelemetry)

Individually, these APIs are reasonable. Collectively, they form an **API soup** that is inappropriate to expose directly to users who conceptually want to “create a Function”.

The goal of this design is to:

* **Avoid exposing users to this API soup**
* **Preserve Kubernetes-native composition**
* **Avoid creating a monolithic, tightly coupled CRD**

Exposing all of these directly to users creates an **API soup** that:

* Increases cognitive load
* Leads to misconfiguration
* Makes the system harder to explain, document, and evolve

---

## Design Goals

1. Expose a **single conceptual API** (“Function”) to users
2. Prevent direct user exposure to **multiple unrelated API groups**
3. Keep the Function CRD **minimal, stable, and semantically scoped**
4. Allow **independent evolution** of build, runtime, scaling, networking, and observability
5. Reuse **existing Kubernetes controllers** without reimplementing their logic
6. Avoid recreating a “god CRD” similar to Knative Serving

---

## Non-Goals

* The Function CR is not an execution specification
* The Function controller does not orchestrate builds, scaling, or networking
* The system does not guarantee transactional atomicity across all resources

---

## Core Design Principle

> **The Function CR describes what the function does (event semantics), not how the platform runs it.**

Anything that affects execution mechanics belongs in its native API and controller.

---

## High-Level Architecture

### Responsibility Split

| Component              | Responsibility                           |
|------------------------|------------------------------------------|
| UI                     | Resource composition, policy application |
| Function Controller    | Eventing resources only                  |
| Build Controllers      | Build reconciliation                     |
| KEDA                   | Scaling reconciliation                   |
| Kubernetes             | Runtime reconciliation                   |
| Networking Controllers | Ingress and routing                      |
| Observability Stack    | Metrics, tracing, logging                |

The Function controller is **not** a super-controller.

---

## User Experience Model

### User Perspective

* “I create a Function”
* “I configure triggers and behavior”
* “I don’t need to understand 6 API groups”

### Platform Perspective

* Multiple Kubernetes resources are created
* Each is reconciled by its native controller
* All resources are loosely associated via labels and owner references

The UI provides the abstraction boundary.

---

## Paper Prototype: YAML Applied by the UI

This section shows **exactly what the UI applies to the API server** when a user creates a Function.

### 1. Function (semantic anchor, eventing intent)

```yaml
apiVersion: serverless.openshift.io/v1alpha1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  eventing:
    subscriptions:
      - broker: default
        eventTypes:
          - com.github.push
          - com.slack.message
    sink:
      ref:
        apiVersion: v1
        kind: Service
        name: my-function
```

**Design decision**

* The Function spec contains only event semantics

**Reason**
Event subscriptions describe what the function does at the domain level and remain stable even if execution details change.

---

### 2. Build Resource (example: Shipwright)

```yaml
apiVersion: shipwright.io/v1beta1
kind: Build
metadata:
  name: my-function-build
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: my-function
spec:
  source:
    git:
      url: https://github.com/example/my-function
      revision: main
  strategy:
    name: nodejs
  output:
    image: registry.example.com/functions/my-function:latest
```

**Why not in the Function CR**

* Build systems vary
* Build APIs evolve independently
* Encoding this would destabilize the Function API

---

### 3. Runtime (Deployment)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: my-function
spec:
  replicas: 0
  selector:
    matchLabels:
      app: my-function
  template:
    metadata:
      labels:
        app: my-function
    spec:
      containers:
        - name: function
          image: registry.example.com/functions/my-function:latest
          ports:
            - containerPort: 8080
```

**Design decision**

* Use standard Kubernetes primitives for runtime

**Reason**
This keeps debugging, tooling, and extensibility aligned with Kubernetes norms.

---

### 4. Service (stable network identity)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: my-function
spec:
  selector:
    app: my-function
  ports:
    - port: 80
      targetPort: 8080
```

**Design decision**

* The Service is the stable endpoint referenced by eventing and networking

**Reason**
Decouples event delivery from runtime topology.

---

### 5. Scaling (example: KEDA HTTPScaledObject)

```yaml
apiVersion: http.keda.sh/v1alpha1
kind: HTTPScaledObject
metadata:
  name: my-function-http
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: my-function
spec:
  scaleTargetRef:
    deployment: my-function
    service: my-function
    port: 80
  targetPendingRequests: 100
```

**Design decision**

* Scaling is configured via KEDA APIs

**Reason**
Scaling policies are execution details and change frequently.

---

### 6. Optional Networking (example: Gateway API)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  parentRefs:
    - name: default-gateway
  rules:
    - backendRefs:
        - name: my-function
          port: 80
```

**Design decision**

* Networking resources are optional and external to the Function API

**Reason**
Ingress models differ across clusters and must remain replaceable.

---

## Resources Created by the Function Controller

The Function controller reacts **only** to the Function CR.

### Trigger

```yaml
apiVersion: eventing.knative.dev/v1
kind: Trigger
metadata:
  name: my-function-events
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: my-function
      controller: true
spec:
  broker: default
  filter:
    attributes:
      type:
        - com.github.push
        - com.slack.message
  subscriber:
    ref:
      apiVersion: v1
      kind: Service
      name: my-function
```

The Function controller owns **only** eventing realization.

**Design decision**

* Eventing realization is centralized in one controller

**Reason**
Event semantics must be consistent and observable.

---

## Observability and Cross-Cutting Concerns

### Monitoring

* Optional `ServiceMonitor` / `PodMonitor`
* Created by UI or presets

**Reason**
Metrics configuration is operational policy, not function intent.

---

### Tracing

* Optional OpenTelemetry instrumentation
* Applied at runtime level

**Reason**
Tracing is tooling-specific and execution-related.

---

### Logging

* Handled via cluster-level logging
* No per-Function configuration

**Reason**
Observability is operational policy, not function intent.

---

## Preventing API Soup

Although the platform relies on multiple APIs, the user experience exposes **one conceptual API**: the Function.

The UI acts as:

* A composition layer
* A policy application layer
* A cognitive boundary

This avoids forcing users to reason about:

* Multiple API groups
* Controller interactions
* Resource wiring

At the same time, all underlying resources remain visible and debuggable.

---

## Ownership and Garbage Collection

All resources (composed or not):

* Share a `serverless.openshift.io/function` label
* Reference the Function via `ownerReferences`

This enables:

* Cascading deletion
* UI discovery
* Status aggregation

---

## Deletion Semantics

* Deleting a Function cascades to owned resources
* External resources not owned are left intact
* UI can warn on shared dependencies
---

## Drift Detection

Drift is expected.

The UI:

* Does not auto-correct by default

Controllers remain authoritative.

---

## Atomicity and Failure Model

* Resource creation is best-effort
* Partial state is expected and tolerated
* Controllers reconcile independently

True atomicity would require:

* Central orchestration
* Tight coupling
* Reduced flexibility

This design explicitly rejects that.

---

## Tradeoffs

### Pros

* Minimal, stable Function API
* No god CRD
* Replaceable subsystems
* Kubernetes-native debugging
* Reduced cognitive load for users

### Cons

* No transactional guarantees
* UI becomes operationally important
* Temporary inconsistencies are visible
* Advanced users can create drift

These tradeoffs are intentional and explicit.

---

## Conclusion

The Function CR is a **semantic and lifecycle anchor**, not an execution specification.

Composition happens in the UI.
Reconciliation happens in existing controllers.
Eventing intent lives in one place.
