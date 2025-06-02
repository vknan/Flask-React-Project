from datetime import datetime
from app import db # Import db directly from the main app.py
from apps.authentication.models import User # Import your User model

# Placeholder for User model - replace with your actual User model import or definition
# class User:
#     pass


class Course(db.Model):
    __tablename__ = 'myapp_course'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    lottieicon = db.Column(db.String(200), nullable=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=False)
    instructor = db.relationship('User', backref='myapp_course')

    # Define relationships if needed, e.g., modules = db.relationship('Module', backref='course', lazy=True)


class Module(db.Model):
    __tablename__ = 'myapp_module'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('myapp_course.id'), nullable=True)
    course = db.relationship('Course', backref=db.backref('myapp_module', lazy=True))
    title = db.Column(db.String(100), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Interval, nullable=True)


class SubModule(db.Model):
    __tablename__ = 'myapp_submodule'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('myapp_module.id'), nullable=True)
    module = db.relationship('Module', backref=db.backref('myapp_submodule', lazy=True))
    title = db.Column(db.String(100), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Interval, nullable=True)


class Lesson(db.Model):
    __tablename__ = 'myapp_lesson'
    id = db.Column(db.Integer, primary_key=True)
    submodule_id = db.Column(db.Integer, db.ForeignKey('myapp_submodule.id'), nullable=True)
    submodule = db.relationship('SubModule', backref=db.backref('myapp_lesson', lazy=True))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default='Enter text here', nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Interval, nullable=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=True)
    instructor = db.relationship('User', foreign_keys=[instructor_id])


class Quiz(db.Model):
    __tablename__ = 'myapp_quiz'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('myapp_course.id'), nullable=False)
    course = db.relationship('Course', backref=db.backref('myapp_quiz', lazy=True))


class Enrollment(db.Model):
    __tablename__ = 'myapp_enrollment'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('myapp_enrollment', lazy=True))
    course_id = db.Column(db.Integer, db.ForeignKey('myapp_course.id'), nullable=False)
    course = db.relationship('Course', backref=db.backref('myapp_enrollment', lazy=True))
    enrolled = db.Column(db.Boolean, default=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='enrolled') # You might want to use an Enum for choices

    __table_args__ = (db.UniqueConstraint('user_id', 'course_id', name='_user_course_uc'),)


class Tag(db.Model):
    __tablename__ = 'myapp_tag'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)


class Progress(db.Model):
    __tablename__ = 'myapp_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('myapp_progress', lazy=True))
    lesson_id = db.Column(db.Integer, db.ForeignKey('myapp_lesson.id'), nullable=False)
    lesson = db.relationship('Lesson', backref=db.backref('myapp_progress', lazy=True))
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_accessed = db.Column(db.DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)
    time_spent = db.Column(db.Interval, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    __table_args__ = (db.UniqueConstraint('user_id', 'lesson_id', name='_user_lesson_uc'),)

    # Methods like mark_complete, mark_incomplete, is_started would be defined here


class DiscussionPost(db.Model):
    __tablename__ = 'myapp_discussionpost'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('myapp_discussionpost', lazy=True))
    lesson_id = db.Column(db.Integer, db.ForeignKey('myapp_lesson.id'), nullable=False)
    lesson = db.relationship('Lesson', backref=db.backref('myapp_discussionpost', lazy=True))
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class About(db.Model):
    __tablename__ = 'myapp_about'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255), nullable=True) # Store image path/URL
    created = db.Column(db.DateTime, default=datetime.utcnow)


class Category(db.Model):
    __tablename__ = 'myapp_category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)


class Post(db.Model):
    __tablename__ = 'myapp_post'
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('myapp_category.id'), nullable=False)
    category = db.relationship('Category', backref=db.backref('myapp_post', lazy=True))
    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('myapp_post', lazy=True))
    title = db.Column(db.String(255), nullable=False)
    thumbnail = db.Column(db.String(255), nullable=True) # Store thumbnail path/URL
    description = db.Column(db.Text, default='Enter text here', nullable=False)
    tags = db.Column(db.String(255), nullable=True) # Consider a many-to-many relationship for tags
    posted_at = db.Column(db.Date, default=datetime.utcnow().date())
    is_published = db.Column(db.Boolean, default=False)

    # get_absolute_url method would be defined here


class Comment(db.Model):
    __tablename__ = 'myapp_comment'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('myapp_post.id'), nullable=False)
    post = db.relationship('Post', backref=db.backref('myapp_comment', lazy=True))
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    website = db.Column(db.String(100), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    commented_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_resolved = db.Column(db.Boolean, default=False)


class Contact(db.Model):
    __tablename__ = 'myapp_contact'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_resolved = db.Column(db.Boolean, default=False)
    contacted_date = db.Column(db.DateTime, default=datetime.utcnow) 