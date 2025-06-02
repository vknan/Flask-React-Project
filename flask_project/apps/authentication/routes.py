from flask import Blueprint, request, jsonify
from apps.extensions import db, bcrypt, jwt
from . import models # Import your SQLAlchemy models (User, CustomUser)
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, unset_jwt_cookies,
    set_access_cookies, set_refresh_cookies, get_jwt, decode_token
)
# from jwt.exceptions import DecodeError, InvalidTokenError # For handling JWT errors
from flask import current_app # To access app config and extensions
import re # For mobile number regex validation
from .token_blacklist import add_token_to_blacklist # Import your token blacklisting function
from datetime import timedelta # Needed for token expiration if not using config
from .utils import verify_django_password
import uuid # For generating UUIDs

auth_bp = Blueprint('authentication', __name__, url_prefix='/auth') # Using /auth prefix based on common practice, adjust if needed

# Based on Vijay_Portfolio/apps/authentication/urls.py and views.py

# Register Route (RegisterView - generics.CreateAPIView)
@auth_bp.route('/register/', methods=['POST'])
def register():
    try:
        data = request.get_json()
        current_app.logger.info(f"Received registration data: {data}")
        
        if not data:
            current_app.logger.error("No data provided in request")
            return jsonify({'message': 'No data provided'}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        mobile_number = data.get('mobile_number')
        profile_picture = data.get('profile_picture')
        bio = data.get('bio')
        first_name = data.get('first_name', '').strip()  # Strip whitespace
        last_name = data.get('last_name', '').strip()    # Strip whitespace

        # Validate required fields
        errors = {}
        if not username:
            errors['username'] = 'Username is required'
        if not email:
            errors['email'] = 'Email is required'
        elif not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            errors['email'] = 'Invalid email format'
        if not password:
            errors['password'] = 'Password is required'
        elif len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters long'
        if not role:
            errors['role'] = 'Role is required'
        elif role not in ['student', 'teacher']:
            errors['role'] = 'Invalid role. Must be either student or teacher'
        if not mobile_number:
            errors['mobile_number'] = 'Mobile number is required'
        elif not re.match(r'^\d{10}$', mobile_number):
            errors['mobile_number'] = 'Mobile number must be exactly 10 digits'
        if not first_name:
            errors['first_name'] = 'First name is required'
        elif len(first_name) < 2:
            errors['first_name'] = 'First name must be at least 2 characters long'

        if errors:
            current_app.logger.error(f"Validation errors: {errors}")
            return jsonify({
                'message': 'Validation failed',
                'errors': errors
            }), 400

        # Check if user or mobile number already exists
        existing_user = models.User.query.filter_by(username=username).first()
        if existing_user:
            current_app.logger.error(f"Username already exists: {username}")
            return jsonify({'message': 'Username already exists'}), 400

        existing_email = models.User.query.filter_by(email=email).first()
        if existing_email:
            current_app.logger.error(f"Email already exists: {email}")
            return jsonify({'message': 'Email already exists'}), 400

        existing_custom_user = models.CustomUser.query.filter_by(mobile_number=mobile_number).first()
        if existing_custom_user:
            current_app.logger.error(f"Mobile number already exists: {mobile_number}")
            return jsonify({'message': 'Mobile number already exists'}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create new user
        new_user = models.User(
            username=username,
            email=email,
            password=hashed_password,
            is_active=True,
            first_name=first_name,
            last_name=last_name
        )
        db.session.add(new_user)
        db.session.flush()  # Get the user ID without committing

        # Create custom user
        new_custom_user = models.CustomUser(
            custom_user_id=str(uuid.uuid4()),  # Generate a UUID for the custom_user_id
            user_id=new_user.id,
            role=role,
            mobile_number=mobile_number,
            profile_picture=profile_picture,
            bio=bio
        )
        db.session.add(new_custom_user)
        
        # Commit both changes
        db.session.commit()
        current_app.logger.info(f"Successfully registered user: {username}")

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name
            },
            'custom_user': {
                'custom_user_id': new_custom_user.custom_user_id,
                'role': new_custom_user.role,
                'mobile_number': new_custom_user.mobile_number,
                'profile_picture': new_custom_user.profile_picture,
                'bio': new_custom_user.bio
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error during user registration: {str(e)}")
        return jsonify({
            'message': 'Error registering user',
            'error': str(e)
        }), 500


# Login Route (CustomTokenObtainPairView - TokenObtainPairView)
@auth_bp.route('/login/', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({
                'message': 'Missing required fields',
                'details': {
                    'username': 'Username is required' if not username else None,
                    'password': 'Password is required' if not password else None
                }
            }), 422

        user = models.User.query.filter_by(username=username).first()

        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401

        if not user.is_active:
            return jsonify({'message': 'Account is disabled. Please contact support.'}), 403

        # Try Django password verification first
        if user.password.startswith('pbkdf2_sha256$'):
            if verify_django_password(password, user.password):
                # Create access and refresh tokens
                access_token = create_access_token(identity=str(user.id))
                refresh_token = create_refresh_token(identity=str(user.id))

                response = jsonify({'message': 'Login successful'})

                # Set tokens as HTTP-only cookies
                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)

                return response, 200
        else:
            # Try bcrypt verification for new users
            if bcrypt.check_password_hash(user.password, password):
                access_token = create_access_token(identity=str(user.id))
                refresh_token = create_refresh_token(identity=str(user.id))

                response = jsonify({'message': 'Login successful'})

                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)

                return response, 200

        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        current_app.logger.error(f"Error during login: {str(e)}")
        return jsonify({'message': 'An error occurred during login', 'error': str(e)}), 500


# Token Refresh Route (CustomTokenRefreshView - APIView)
@auth_bp.route('/token/refresh/', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user_id = get_jwt_identity()
    
    # Get the current refresh token's JTI
    current_token = get_jwt()
    old_refresh_jti = current_token['jti']
    
    # Create a new access token
    new_access_token = create_access_token(identity=str(current_user_id))
    
    response = jsonify({'message': 'Token refreshed successfully'})
    
    # Set new access token in cookie
    set_access_cookies(response, new_access_token)
    
    # Handle refresh token rotation
    rotate_refresh = current_app.config.get('JWT_ROTATE_REFRESH_TOKENS', True)
    
    if rotate_refresh:
        # Blacklist the old refresh token
        if old_refresh_jti:
            # Add the old refresh token to the blacklist
            # Use the refresh token expiration time for the blacklist
            expires_delta = current_app.config.get('JWT_REFRESH_TOKEN_EXPIRES', timedelta(days=30))
            add_token_to_blacklist(old_refresh_jti, expires_delta)
        
        # Create and set a new refresh token
        new_refresh_token = create_refresh_token(identity=str(current_user_id))
        set_refresh_cookies(response, new_refresh_token)
    
    return response, 200


# User Detail Route (UserDetailView - generics.RetrieveUpdateAPIView)
@auth_bp.route('/profile/', methods=['GET', 'PUT', 'PATCH'])
@jwt_required() # Requires a valid access token
def user_detail():
    current_user_id = get_jwt_identity()
    # Fetch both User and CustomUser data
    user = models.User.query.options(db.joinedload(models.User.custom_user)).get(current_user_id)

    if not user: # Should not happen if JWT identity is valid and user exists
        current_app.logger.error(f"User not found for ID: {current_user_id}")
        return jsonify({'message': 'User not found'}), 404

    if request.method == 'GET':
        # Log the user data before sending
        current_app.logger.info(f"User data being sent: id={user.id}, username={user.username}, first_name={user.first_name}, last_name={user.last_name}")
        
        # Serialize user and custom user data
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'custom_user': {
                'custom_user_id': user.custom_user.custom_user_id,
                'role': user.custom_user.role,
                'mobile_number': user.custom_user.mobile_number,
                'profile_picture': user.custom_user.profile_picture,
                'bio': user.custom_user.bio,
            } if user.custom_user else None
        }
        current_app.logger.info(f"Serialized user data: {user_data}")
        return jsonify(user_data)
    elif request.method in ['PUT', 'PATCH']:
        # Update user and custom user data
        data = request.get_json()

        # Update User fields
        if 'username' in data: user.username = data['username']
        if 'email' in data: user.email = data['email']
        # Update other User fields as needed

        # Update CustomUser fields
        if user.custom_user:
            if 'role' in data: user.custom_user.role = data['role']
            if 'mobile_number' in data: # Re-validate mobile number on update
                 mobile_number = data['mobile_number']
                 mobile_regex = r'^\d{10}$'  # Changed to match exactly 10 digits
                 if not re.match(mobile_regex, mobile_number):
                     return jsonify({'message': 'Invalid mobile number format'}), 400
                 user.custom_user.mobile_number = mobile_number

            if 'profile_picture' in data: user.custom_user.profile_picture = data['profile_picture']
            if 'bio' in data: user.custom_user.bio = data['bio']
            # Update other CustomUser fields as needed
        else:
            # Handle case where CustomUser might not exist (unlikely with OneToOneField)
            # If you want to create a CustomUser if it doesn't exist on profile update,
            # you would add logic here. Make sure required fields (like role, mobile_number) are in data.
            pass

        try:
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error during profile update: {e}")
            return jsonify({'message': 'Error updating profile', 'error': str(e)}), 500


# Logout Route (LogoutView - APIView)
@auth_bp.route('/logout/', methods=['POST'])
def logout():
    try:
        response = jsonify({'message': 'Logout successful'})
        
        # Get the refresh token from the cookie
        refresh_token_cookie = request.cookies.get(current_app.config.get('JWT_REFRESH_COOKIE_NAME', 'refresh_token'))
        
        if refresh_token_cookie:
            try:
                # Decode the refresh token to get its JTI
                decoded_token = decode_token(refresh_token_cookie)
                jti = decoded_token.get('jti')
                
                if jti:
                    # Add the refresh token to the blacklist
                    # Use the refresh token expiration time for the blacklist
                    expires_delta = current_app.config.get('JWT_REFRESH_TOKEN_EXPIRES', timedelta(days=30))
                    add_token_to_blacklist(jti, expires_delta)
            except Exception as e:
                current_app.logger.error(f"Error processing refresh token on logout: {e}")
                # Continue with logout even if blacklisting fails
        
        # Clear all JWT cookies
        unset_jwt_cookies(response)
        
        return response, 200
    except Exception as e:
        current_app.logger.error(f"Error during logout: {e}")
        # Even if there's an error, we still want to clear cookies
        response = jsonify({'message': 'Logout successful'})
        unset_jwt_cookies(response)
        return response, 200


# Activate User Route
@auth_bp.route('/activate/<int:user_id>/', methods=['POST'])
def activate_user(user_id):
    user = models.User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.is_active = True
    try:
        db.session.commit()
        return jsonify({'message': 'User activated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error activating user: {e}")
        return jsonify({'message': 'Error activating user', 'error': str(e)}), 500

# Remember to register this blueprint in your main app.py file.
# Example in app.py:
# from apps.authentication.routes import authentication_bp
# app.register_blueprint(authentication_bp) 