import requests
import json

# Define the start and stop coordinates
start_latitude = 19.1677053
start_longitude = 72.960964
end_latitude = 19.1720999
end_longitude = 72.956671

# Define the API endpoint and your access token as a variable
url = "https://api.uber.com/v1/guests/trips/estimates"
access_token = 'IA.AQAAAAQdQrGtXcJvJtT9gR5ySaeW17ZExTpGnUimZ63_PJsMJq49airHPNk6yBs4oUwmlLZnBPu1JjJ8hGFl9zwhS-rDFIalQkOduuYxZkMQY7EiOjz1pziK_AWmTljyykp8FZL3b996wzbpOWJHZSiFCEMf3tI3TZTFxy9Cx94kZfr9Yw'  # Replace with your actual Uber access token

# Create the payload by interpolating the values
payload = {
    "pickup": {
        "latitude": start_latitude,
        "longitude": start_longitude
    },
    "dropoff": {
        "latitude": end_latitude,
        "longitude": end_longitude
    }
}

# Convert the payload to JSON format
payload_json = json.dumps(payload)

# Set the headers with your access token
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {access_token}'
}

# Send the POST request
response = requests.post(url, headers=headers, data=payload_json)

# Print the response text
print(response.text)
