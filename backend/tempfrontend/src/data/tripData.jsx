export const tripData = {
  "requestParameters": {
    "mode": "RAIL,BUS,WALK",
    "fromPlace": "19.1676979,72.9608239,",
    "toPlace": "19.1720804,72.9564921"
  },
  "plan": {
    "date": 1756122649104,
    "from": {
      "name": "Origin",
      "lon": 72.9608239,
      "lat": 19.1676979,
      "vertexType": "NORMAL"
    },
    "to": {
      "name": "Destination",
      "lon": 72.9564921,
      "lat": 19.1720804,
      "vertexType": "NORMAL"
    },
    "itineraries": [
      {
        "duration": 707,
        "startTime": 1756122649000,
        "endTime": 1756123356000,
        "walkTime": 707,
        "transitTime": 0,
        "waitingTime": 0,
        "walkDistance": 801.58,
        "walkLimitExceeded": false,
        "generalizedCost": 1339,
        "elevationLost": 0,
        "elevationGained": 0,
        "transfers": 0,
        "fare": {
          "fare": {

          },
          "details": {

          }
        },
        "legs": [
          {
            "startTime": 1756122649000,
            "endTime": 1756123356000,
            "departureDelay": 0,
            "arrivalDelay": 0,
            "realTime": false,
            "distance": 801.58,
            "generalizedCost": 1339,
            "pathway": false,
            "mode": "WALK",
            "transitLeg": false,
            "route": "",
            "agencyTimeZoneOffset": 19800000,
            "interlineWithPreviousLeg": false,
            "from": {
              "name": "Origin",
              "lon": 72.9608239,
              "lat": 19.1676979,
              "departure": 1756122649000,
              "vertexType": "NORMAL"
            },
            "to": {
              "name": "Destination",
              "lon": 72.9564921,
              "lat": 19.1720804,
              "arrival": 1756123356000,
              "vertexType": "NORMAL"
            },
            "legGeometry": {
              "points": "eu~sB{ci|LuAm@GLU^CBOH[f@w@hACFiAdB]h@c@p@_CFK?w@B[F_AVw@d@Un@EZMt@CL]fB[dBDLMLVVQREDUTUTQO",
              "length": 32
            },
            "steps": [
              {
                "distance": 53.09,
                "relativeDirection": "DEPART",
                "streetName": "V B Phadke Marg",
                "absoluteDirection": "NORTHEAST",
                "stayOn": false,
                "area": false,
                "bogusName": false,
                "lon": 72.9607875,
                "lat": 19.1677154,
                "elevation": "",
                "walkingBike": false
              },
              {
                "distance": 42.86,
                "relativeDirection": "LEFT",
                "streetName": "road",
                "absoluteDirection": "NORTHWEST",
                "stayOn": false,
                "area": false,
                "bogusName": true,
                "lon": 72.9610166,
                "lat": 19.168141,
                "elevation": "",
                "walkingBike": false
              },
              {
                "distance": 209.67,
                "relativeDirection": "SLIGHTLY_LEFT",
                "streetName": "Navghar Marg",
                "absoluteDirection": "NORTHWEST",
                "stayOn": false,
                "area": false,
                "bogusName": false,
                "lon": 72.9607193,
                "lat": 19.1683947,
                "elevation": "",
                "walkingBike": false
              },
              {
                "distance": 400.6,
                "relativeDirection": "RIGHT",
                "streetName": "Lokmanya Tilak Road",
                "absoluteDirection": "NORTH",
                "stayOn": false,
                "area": false,
                "bogusName": false,
                "lon": 72.9591304,
                "lat": 19.1695362,
                "elevation": "",
                "walkingBike": false
              },
              {
                "distance": 82.24,
                "relativeDirection": "RIGHT",
                "streetName": "path",
                "absoluteDirection": "NORTHWEST",
                "stayOn": false,
                "area": false,
                "bogusName": true,
                "lon": 72.9569028,
                "lat": 19.1717475,
                "elevation": "",
                "walkingBike": false
              },
              {
                "distance": 13.13,
                "relativeDirection": "RIGHT",
                "streetName": "steps",
                "absoluteDirection": "NORTHEAST",
                "stayOn": true,
                "area": false,
                "bogusName": true,
                "lon": 72.9563614,
                "lat": 19.1720361,
                "elevation": "",
                "walkingBike": false
              }
            ],
            "rentedBike": false,
            "walkingBike": false,
            "duration": 707
          }
        ],
        "tooSloped": false,
        "arrivedAtDestinationWithRentedBicycle": false
      }
    ]
  },
  "metadata": {
    "searchWindowUsed": 3000,
    "nextDateTime": 1756125649000,
    "prevDateTime": 1756119649000
  },
  "previousPageCursor": "MXxQUkVWSU9VU19QQUdFfDIwMjUtMDgtMjVUMDg6NTA6NDlafHwzaHxTVFJFRVRfQU5EX0FSUklWQUxfVElNRXx8fHx8fA==",
  "nextPageCursor": "MXxORVhUX1BBR0V8MjAyNS0wOC0yNVQxMjo0MDo0OVp8fDNofFNUUkVFVF9BTkRfQVJSSVZBTF9USU1FfHx8fHx8",
  "error": {
    "id": 409,
    "msg": "Origin is within a trivial distance of the destination.",
    "message": "TOO_CLOSE"
  },
  "debugOutput": {
    "precalculationTime": 394000,
    "directStreetRouterTime": 30996400,
    "transitRouterTime": 621405500,
    "filteringTime": 35064400,
    "renderingTime": 36196600,
    "totalTime": 724301900,
    "transitRouterTimes": {
      "tripPatternFilterTime": 24155800,
      "accessEgressTime": 184449700,
      "raptorSearchTime": 240386400,
      "itineraryCreationTime": 170834100
    }
  },
  "elevationMetadata": {
    "ellipsoidToGeoidDifference": -68.6862090006934,
    "geoidElevation": false
  }
}