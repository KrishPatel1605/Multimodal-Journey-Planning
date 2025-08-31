# Use lightweight OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Install wget and unzip
RUN apt-get update && apt-get install -y wget unzip && rm -rf /var/lib/apt/lists/*

# Download OTP jar and graph.obj from external links
# ⚠️ Replace these links with your actual SharePoint / Google Drive direct-download links
RUN wget -O otp.jar "https://github.com/opentripplanner/OpenTripPlanner/releases/download/v2.5.0/otp-2.5.0-shaded.jar" \
    && wget -O graph.obj "https://cdpindia0-my.sharepoint.com/:u:/g/personal/dinesh_suthar_cdpindia_com/EdErpv3RHU1IhM6JwflIaUEBjy9uP_8QCOrv-nfbwwT3Ng?download=1"
# Expose OTP default port
EXPOSE 8080

# Run OTP when container starts
CMD ["java", "-Xmx2G", "-jar", "otp.jar", "--load", "/app", "--serve", "--port", "8080"]
