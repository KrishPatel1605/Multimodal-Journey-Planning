# Use Java 21 instead of 17
FROM openjdk:21-jdk-slim

WORKDIR /app

# Install wget
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Download OTP JAR + graph.obj + config
RUN wget -O otp.jar "https://github.com/opentripplanner/OpenTripPlanner/releases/download/v2.5.0/otp-2.5.0-shaded.jar" \
 && wget -O graph.obj "https://cdpindia0-my.sharepoint.com/:u:/g/personal/dinesh_suthar_cdpindia_com/EdErpv3RHU1IhM6JwflIaUEBjy9uP_8QCOrv-nfbwwT3Ng?download=1" \
 && wget -O router-config.json "https://prod-files-secure.s3.us-west-2.amazonaws.com/e85255dc-3fdc-4993-a9ee-b8b24ea96552/2132a2f7-99ee-4c41-83f8-6292078af596/router-config.json"

EXPOSE 8080

CMD ["java", "-Xmx2G", "-jar", "otp.jar", "--load", "/app", "--serve", "--port", "8080"]
