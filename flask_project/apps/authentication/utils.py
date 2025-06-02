import hashlib
import base64
import re

def verify_django_password(password, encoded):
    """
    Verify a Django password against its encoded version.
    
    Args:
        password (str): The plain text password to verify
        encoded (str): The encoded password from Django (format: algorithm$iterations$salt$hash)
    
    Returns:
        bool: True if the password matches, False otherwise
    """
    if not encoded.startswith('pbkdf2_sha256$'):
        return False

    try:
        # Split the encoded password into its components
        algorithm, iterations, salt, hash = encoded.split('$')
        iterations = int(iterations)
        
        # Generate the hash using the same parameters
        hash_obj = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            iterations
        )
        
        # Convert the hash to base64
        generated_hash = base64.b64encode(hash_obj).decode('utf-8').strip()
        
        # Compare the generated hash with the stored hash
        return generated_hash == hash
    except Exception as e:
        print(f"Error verifying Django password: {e}")
        return False 