import os
from datetime import datetime
from dotenv import load_dotenv
from app import create_app, db
from sqlalchemy import text
from apps.authentication.models import User, CustomUser, TokenBlacklist
from apps.myapp.models import Course, Module, SubModule, Lesson, Quiz, Enrollment, DiscussionPost

# Load environment variables
load_dotenv()

def get_table_columns(engine, table_name):
    """Get column names for a table"""
    with engine.connect() as conn:
        result = conn.execute(text(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = '{table_name}'
        """))
        return [row[0] for row in result]

def migrate_users():
    """Migrate users from myapp_ prefixed tables"""
    try:
        app = create_app()
        with app.app_context():
            # Get columns from source and target tables
            source_columns = get_table_columns(db.engine, 'myapp_user')
            target_columns = [c.name for c in User.__table__.columns]
            print(f"Source columns for users: {source_columns}")
            print(f"Target columns for users: {target_columns}")
            
            # Build dynamic query based on available columns
            select_columns = [col for col in source_columns if col in target_columns]
            query = f"""
                SELECT {', '.join(select_columns)}
                FROM myapp_user u
                LEFT JOIN myapp_customuser cu ON u.id = cu.user_id
            """
            
            result = db.session.execute(text(query))
            users = result.fetchall()
            
            for user in users:
                # Check if user already exists
                existing_user = User.query.filter_by(email=user.email).first()
                if not existing_user:
                    # Create new user
                    user_data = {col: getattr(user, col) for col in select_columns}
                    new_user = User(**user_data)
                    db.session.add(new_user)
                    db.session.flush()
                    
                    # Create custom user if it exists
                    if hasattr(user, 'role') and user.role:
                        custom_user_data = {
                            'custom_user_id': user.id,
                            'user_id': new_user.id,
                            'role': user.role,
                            'mobile_number': getattr(user, 'mobile_number', None),
                            'profile_picture': getattr(user, 'profile_picture', None),
                            'bio': getattr(user, 'bio', None)
                        }
                        new_custom_user = CustomUser(**custom_user_data)
                        db.session.add(new_custom_user)
            
            db.session.commit()
            print(f"Successfully migrated {len(users)} users")
    except Exception as e:
        print(f"Error migrating users: {e}")
        db.session.rollback()

def migrate_courses():
    """Migrate courses from myapp_ prefixed tables"""
    try:
        app = create_app()
        with app.app_context():
            # Get columns from source and target tables
            source_columns = get_table_columns(db.engine, 'myapp_course')
            target_columns = [c.name for c in Course.__table__.columns]
            print(f"Source columns for courses: {source_columns}")
            print(f"Target columns for courses: {target_columns}")
            
            # Build dynamic query based on available columns
            select_columns = [col for col in source_columns if col in target_columns]
            query = f"SELECT {', '.join(select_columns)} FROM myapp_course"
            
            result = db.session.execute(text(query))
            courses = result.fetchall()
            
            for course in courses:
                existing_course = Course.query.filter_by(id=course.id).first()
                if not existing_course:
                    course_data = {col: getattr(course, col) for col in select_columns}
                    new_course = Course(**course_data)
                    db.session.add(new_course)
            
            db.session.commit()
            print(f"Successfully migrated {len(courses)} courses")
    except Exception as e:
        print(f"Error migrating courses: {e}")
        db.session.rollback()

def migrate_modules():
    """Migrate modules from myapp_ prefixed tables"""
    try:
        app = create_app()
        with app.app_context():
            # Get columns from source and target tables
            source_columns = get_table_columns(db.engine, 'myapp_module')
            target_columns = [c.name for c in Module.__table__.columns]
            print(f"Source columns for modules: {source_columns}")
            print(f"Target columns for modules: {target_columns}")
            
            # Build dynamic query based on available columns
            select_columns = [col for col in source_columns if col in target_columns]
            query = f"SELECT {', '.join(select_columns)} FROM myapp_module"
            
            result = db.session.execute(text(query))
            modules = result.fetchall()
            
            for module in modules:
                existing_module = Module.query.filter_by(id=module.id).first()
                if not existing_module:
                    module_data = {col: getattr(module, col) for col in select_columns}
                    new_module = Module(**module_data)
                    db.session.add(new_module)
            
            db.session.commit()
            print(f"Successfully migrated {len(modules)} modules")
    except Exception as e:
        print(f"Error migrating modules: {e}")
        db.session.rollback()

def migrate_submodules():
    """Migrate submodules from myapp_ prefixed tables"""
    try:
        app = create_app()
        with app.app_context():
            # Get columns from source and target tables
            source_columns = get_table_columns(db.engine, 'myapp_submodule')
            target_columns = [c.name for c in SubModule.__table__.columns]
            print(f"Source columns for submodules: {source_columns}")
            print(f"Target columns for submodules: {target_columns}")
            
            # Build dynamic query based on available columns
            select_columns = [col for col in source_columns if col in target_columns]
            query = f"SELECT {', '.join(select_columns)} FROM myapp_submodule"
            
            result = db.session.execute(text(query))
            submodules = result.fetchall()
            
            for submodule in submodules:
                existing_submodule = SubModule.query.filter_by(id=submodule.id).first()
                if not existing_submodule:
                    submodule_data = {col: getattr(submodule, col) for col in select_columns}
                    new_submodule = SubModule(**submodule_data)
                    db.session.add(new_submodule)
            
            db.session.commit()
            print(f"Successfully migrated {len(submodules)} submodules")
    except Exception as e:
        print(f"Error migrating submodules: {e}")
        db.session.rollback()

def migrate_lessons():
    """Migrate lessons from myapp_ prefixed tables"""
    try:
        app = create_app()
        with app.app_context():
            # Get columns from source and target tables
            source_columns = get_table_columns(db.engine, 'myapp_lesson')
            target_columns = [c.name for c in Lesson.__table__.columns]
            print(f"Source columns for lessons: {source_columns}")
            print(f"Target columns for lessons: {target_columns}")
            
            # Build dynamic query based on available columns
            select_columns = [col for col in source_columns if col in target_columns]
            query = f"SELECT {', '.join(select_columns)} FROM myapp_lesson"
            
            result = db.session.execute(text(query))
            lessons = result.fetchall()
            
            for lesson in lessons:
                existing_lesson = Lesson.query.filter_by(id=lesson.id).first()
                if not existing_lesson:
                    lesson_data = {col: getattr(lesson, col) for col in select_columns}
                    new_lesson = Lesson(**lesson_data)
                    db.session.add(new_lesson)
            
            db.session.commit()
            print(f"Successfully migrated {len(lessons)} lessons")
    except Exception as e:
        print(f"Error migrating lessons: {e}")
        db.session.rollback()

def migrate_enrollments():
    """Migrate enrollments from myapp_ prefixed tables"""
    try:
        app = create_app()
        with app.app_context():
            # Get columns from source and target tables
            source_columns = get_table_columns(db.engine, 'myapp_enrollment')
            target_columns = [c.name for c in Enrollment.__table__.columns]
            print(f"Source columns for enrollments: {source_columns}")
            print(f"Target columns for enrollments: {target_columns}")
            
            # Build dynamic query based on available columns
            select_columns = [col for col in source_columns if col in target_columns]
            query = f"SELECT {', '.join(select_columns)} FROM myapp_enrollment"
            
            result = db.session.execute(text(query))
            enrollments = result.fetchall()
            
            for enrollment in enrollments:
                existing_enrollment = Enrollment.query.filter_by(id=enrollment.id).first()
                if not existing_enrollment:
                    enrollment_data = {col: getattr(enrollment, col) for col in select_columns}
                    new_enrollment = Enrollment(**enrollment_data)
                    db.session.add(new_enrollment)
            
            db.session.commit()
            print(f"Successfully migrated {len(enrollments)} enrollments")
    except Exception as e:
        print(f"Error migrating enrollments: {e}")
        db.session.rollback()

def main():
    """Main migration function"""
    print("Starting internal PostgreSQL table migration...")
    
    try:
        # Migrate data in the correct order (respecting foreign key constraints)
        print("\nMigrating users...")
        migrate_users()
        
        print("\nMigrating courses...")
        migrate_courses()
        
        print("\nMigrating modules...")
        migrate_modules()
        
        print("\nMigrating submodules...")
        migrate_submodules()
        
        print("\nMigrating lessons...")
        migrate_lessons()
        
        print("\nMigrating enrollments...")
        migrate_enrollments()
        
        print("\nMigration completed successfully!")
    
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    main() 