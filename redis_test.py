# Importing Redis module

# Connecting to Redis server with provided credentials

# Setting a key-value pair in Redis

import redis

r = redis.Redis(
  host='redis-17198.csdasdasd301.ap-south-1-1.ec2.cloud.redislabs.com',
  port=17123298,
  password='vmydasasd16jAbvbsadasdasdaHXlBph9PqGn9pwsXK6P7NE')

r.set('foo', 'bar')
value = r.get('foo')
print(value)

# Retrieving value associated with the key from Redis

# Printing the retrieved value