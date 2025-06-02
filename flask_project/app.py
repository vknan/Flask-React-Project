from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv
from datetime import timedelta
import os

from apps.extensions import db, bcrypt, jwt
from apps.myapp.routes import myapp_bp
from apps.authentication.routes import auth_bp
from apps.authentication.token_blacklist import is_token_blacklisted

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='media')
    
    # Configure CORS
    CORS(app, 
         origins=["http://localhost:3000"],
         allow_credentials=True,
         supports_credentials=True,
         resources={r"/*": {
             "origins": ["http://localhost:3000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-CSRFToken", "x-csrftoken", "X-Requested-With"],
             "expose_headers": ["Content-Type", "Authorization", "X-CSRFToken", "x-csrftoken"],
             "max_age": 3600
         }},
         automatic_options=True
    )

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/navikonline')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # JWT configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
    app.config['JWT_ROTATE_REFRESH_TOKENS'] = True
    
    # Cookie settings
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
    app.config['JWT_COOKIE_SAMESITE'] = 'Lax'  # or 'Strict' for better security
    app.config['JWT_COOKIE_DOMAIN'] = None  # Set to your domain in production

    # Media file configuration
    app.config['MEDIA_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media')
    app.config['MEDIA_URL'] = '/media/'

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(myapp_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # Token blacklist loader
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blacklist(jwt_header, jwt_payload):
        return is_token_blacklisted(jwt_payload['jti'])

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to Navik Online API"})

    @app.route('/api/health')
    def health_check():
        try:
            # Try to connect to the database
            db.session.execute('SELECT 1')
            return jsonify({
                "status": "healthy",
                "database": "connected"
            })
        except OperationalError:
            return jsonify({
                "status": "unhealthy",
                "database": "disconnected"
            }), 500

    # Serve media files
    @app.route('/media/<path:filename>')
    def serve_media(filename):
        try:
            return send_from_directory(app.config['MEDIA_FOLDER'], filename)
        except Exception as e:
            app.logger.error(f"Error serving media file {filename}: {str(e)}")
            return jsonify({"error": "File not found"}), 404

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True) 