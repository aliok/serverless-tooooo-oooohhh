There are some paper prototypes of how Serverless 2.0 could look like.

[001](001)
- The Function CRD would be the main API for users to create and manage functions.
- CRD has all the necessary fields to define a function, including code, runtime, dependencies, etc.
- The Function controller would then go and create other resources, such as Deployment, HTTPScaledObject, Trigger, etc.

Pros/cons are written in the 001/README.md

[002](002)
- The Function CRD would be a meta resource that references other resources, such as Deployment, HTTPScaledObject, Trigger, etc.
- The UI / CLI would provide the illusion of a single Function resource, but under the hood, multiple resources from multiple API groups would be created.



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
