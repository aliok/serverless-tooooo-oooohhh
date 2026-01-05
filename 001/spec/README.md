Notes:
Function CRD includes lots of stuff.

Pros:
- Good UX for users of the Function platform, instead of an API Soup.
- Maybe omitting some details that are not relevant for the function user (e.g. broker name).
- Good UI and CLI integration possibilities.

Cons:
- Getting too big, like Knative's Serving CRD. We wanted to get away from that.
- What if a user wants to change a little detail that is not supported by the Function CRD? e.g. specify `initialCooldownPeriod` of the KEDA ScaledObject to be created for the Function autoscaling.
- 
