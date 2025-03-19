# Healthcheck in Threat Dragon API Server

## Overview

1. Healthcheck Endpoint:


    - The application exposes a /healthz endpoint in controllers/healthz.js
    - This endpoint returns a 200 OK response with basic system information (uptime, current date, and "OK" message)
    - It's an unauthenticated route, accessible without any authentication token

2. Healthcheck Script:


    - A separate script healthcheck.js is used to actively check if the server is running properly
    - This script makes an HTTP request to the /healthz endpoint on localhost
    - It uses the configured SERVER_API_PROTOCOL (or defaults to 'https') and PORT (or defaults to '3000')
    - If the response status code is 200, the script exits with code 0 (success)
    - If the response status code is not 200 or if there's an error, it exits with code 1 (failure)

3. Docker Integration:


    - In the Dockerfile, a HEALTHCHECK directive is defined on line 61:
    HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
    - This tells Docker to run the healthcheck script every 10 seconds
    - It has a timeout of 2 seconds and a start period of 2 seconds
    - The healthcheck script's exit code determines if the container is healthy (0) or unhealthy (1)

4. Purpose:


    - The healthcheck allows Docker and orchestration systems (like Kubernetes or Docker Swarm) to monitor the application's

health - If the application becomes unhealthy, the container orchestration system can restart it - It also provides visibility into the application's health status 5. Note on Implementation: - The healthcheck script uses Node's http module to make the request - It includes logging to help diagnose any issues with the healthcheck - The SERVER_API_PROTOCOL setting is important here - if your application is configured to use HTTPS but doesn't have
proper certificates, the healthcheck might fail

This is a standard pattern for containerized applications, allowing infrastructure to automatically detect and recover from
application failures.
