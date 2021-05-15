---
layout: page
title: Trivy
nav_order: 3
path: /actions/trivy
group: Actions
---
# Trivy Container Scan

[Trivy](https://github.com/aquasecurity/trivy) is an open-source container and artifact vulnerability scanning tool.

The trivy action is configured to run once a day to identify unpatched vulnerabilities in the docker image.  At the time of writing, the image is based on a [distroless](https://github.com/GoogleContainerTools/distroless) image which only contains the application and the runtime dependencies.  For this reason, the scanner is unlikely to find anything.  There are situations where this could become useful, such as the base image becoming unmaintained or changing.
