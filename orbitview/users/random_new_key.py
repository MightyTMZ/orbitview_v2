import secrets

# Generate a random 64-byte key for JWT signing
jwt_signing_key = secrets.token_urlsafe(64)

print(jwt_signing_key)
