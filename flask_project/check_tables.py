from app import create_app, db
from apps.authentication.models import User, CustomUser

def check_database():
    app = create_app()
    with app.app_context():
        try:
            # Check if tables exist
            print("Checking database tables...")
            
            # Check auth_user table
            user = User.query.first()
            if user:
                print("\nAuth User table structure:")
                print(f"ID: {user.id}")
                print(f"Username: {user.username}")
                print(f"Email: {user.email}")
                print(f"Password format: {user.password[:30]}...")  # Show first 30 chars of password
                print(f"Is Active: {user.is_active}")
                print(f"Is Staff: {user.is_staff}")
                print(f"Is Superuser: {user.is_superuser}")
                print(f"Date Joined: {user.date_joined}")
                print(f"Last Login: {user.last_login}")
            else:
                print("No users found in auth_user table")

            # Check custom user table
            custom_user = CustomUser.query.first()
            if custom_user:
                print("\nCustom User table structure:")
                print(f"Custom User ID: {custom_user.custom_user_id}")
                print(f"User ID: {custom_user.user_id}")
                print(f"Role: {custom_user.role}")
                print(f"Mobile Number: {custom_user.mobile_number}")
                print(f"Profile Picture: {custom_user.profile_picture}")
                print(f"Bio: {custom_user.bio}")
                print(f"Date Joined: {custom_user.date_joined}")
                print(f"Last Login: {custom_user.last_login}")
            else:
                print("No users found in custom_user table")

        except Exception as e:
            print(f"Error checking database: {str(e)}")

if __name__ == "__main__":
    check_database() 