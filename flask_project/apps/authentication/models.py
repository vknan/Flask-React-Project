from apps.extensions import db
from datetime import datetime
import uuid
# from flask_login import UserMixin # Consider using Flask-Login for user management

# Basic User model (equivalent to Django's auth.User for the purpose of relationships)
# You may need to add more fields from Django's User model if your app uses them
class User(db.Model):
    __tablename__ = 'auth_user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)  # Updated to match DB schema
    password = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(150), nullable=False)  # Updated to match DB schema
    last_name = db.Column(db.String(150), nullable=False)   # Updated to match DB schema
    is_active = db.Column(db.Boolean, default=True)
    is_staff = db.Column(db.Boolean, default=False)
    is_superuser = db.Column(db.Boolean, default=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)

    # Define the one-to-one relationship with CustomUser
    custom_user = db.relationship('CustomUser', backref='user', uselist=False)

    def __repr__(self):
        return f'<User {self.username}>'

    # You would typically add methods for password hashing and checking here

# CustomUser model (equivalent to Django's CustomUser)
class CustomUser(db.Model):
    __tablename__ = 'authentication_customuser'

    # Use char(32) type for primary key to match DB schema
    custom_user_id = db.Column(db.String(32), primary_key=True)

    # One-to-one relationship with the User model
    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), unique=True, nullable=False)

    ROLE_CHOICES = [('student', 'Student'), ('teacher', 'Teacher')]
    role = db.Column(db.String(20), nullable=False)

    profile_picture = db.Column(db.String(100), nullable=True)  # Updated to match DB schema
    bio = db.Column(db.Text, nullable=True)

    mobile_number = db.Column(db.String(15), unique=True, nullable=False)
    # Note: Implement regex validation in your application logic before saving

    date_joined = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        # Attempt to access the related User's first/last name if available
        try:
            return f'{self.user.first_name} {self.user.last_name} ({self.role})'
        except AttributeError:
            return f'CustomUser ({self.role}) - No User attached'

    # You might add methods related to roles or profile here

class TokenBlacklist(db.Model):
    __tablename__ = 'token_blacklist'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<TokenBlacklist {self.jti}>'

# Remember to import this models module in your app.py 