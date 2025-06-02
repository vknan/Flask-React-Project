from datetime import datetime, timedelta
from flask import current_app
from apps.extensions import db
from .models import TokenBlacklist

def add_token_to_blacklist(jti, expires_delta=None):
    """
    Add a token to the blacklist.
    
    Args:
        jti (str): The JWT ID of the token to blacklist
        expires_delta (timedelta, optional): How long the token should remain blacklisted.
            Defaults to the JWT_ACCESS_TOKEN_EXPIRES setting.
    """
    if expires_delta is None:
        expires_delta = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=1))
    
    expires_at = datetime.utcnow() + expires_delta
    
    blacklisted_token = TokenBlacklist(
        jti=jti,
        expires_at=expires_at
    )
    
    try:
        db.session.add(blacklisted_token)
        db.session.commit()
        return True
    except Exception as e:
        current_app.logger.error(f"Error adding token to blacklist: {e}")
        db.session.rollback()
        return False

def is_token_blacklisted(jti):
    """
    Check if a token is blacklisted.
    
    Args:
        jti (str): The JWT ID to check
        
    Returns:
        bool: True if the token is blacklisted, False otherwise
    """
    try:
        token = TokenBlacklist.query.filter_by(jti=jti).first()
        if token:
            # Check if the token has expired
            if token.expires_at < datetime.utcnow():
                # Remove expired token from blacklist
                db.session.delete(token)
                db.session.commit()
                return False
            return True
        return False
    except Exception as e:
        current_app.logger.error(f"Error checking token blacklist: {e}")
        return False

def cleanup_expired_tokens():
    """
    Remove expired tokens from the blacklist.
    This can be called periodically (e.g., via a scheduled task).
    """
    try:
        TokenBlacklist.query.filter(TokenBlacklist.expires_at < datetime.utcnow()).delete()
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Error cleaning up expired tokens: {e}")
        db.session.rollback() 