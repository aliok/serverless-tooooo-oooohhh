# Approach 001: Comprehensive Function CRD

## Overview
Function CRD includes all the necessary fields to define a function, including code, runtime, dependencies, scaling, networking, and eventing configuration. The Function controller creates all other resources (Deployment, HTTPScaledObject, Trigger, etc.) based on this comprehensive CRD.

## Design Philosophy
The Function CRD serves as a "one-stop shop" for function definition, similar to Knative Serving's Service CRD. Users interact with a single API that abstracts away the complexity of multiple Kubernetes resource types.

## Pros
- **Excellent UX**: Users only need to understand one API instead of navigating API soup
- **Simplified configuration**: Details irrelevant to function users can be omitted (e.g., broker names, KEDA's `initialCooldownPeriod`)
- **Strong UI/CLI integration**: Single resource makes tooling integration straightforward
- **Consistent experience**: All function configuration in one place
- **Transaction-like semantics**: Single resource creation handles all dependencies

## Cons
- **Monolithic CRD**: Growing too large, similar to Knative's Serving CRD (which we wanted to avoid)
- **Limited flexibility**: What if a user wants to configure details not exposed in the Function CRD? (e.g., KEDA's `initialCooldownPeriod`)
- **Tight coupling**: All subsystems (build, runtime, scaling, networking) coupled to the Function API
- **Controller complexity**: Function controller must implement logic for all subsystems
- **Evolution challenges**: API changes affect all users, even if they only use subset of features
- **Advanced user friction**: Power users may prefer direct access to underlying resources
