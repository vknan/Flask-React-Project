# React_Django_Full_Stack
This is a Full Stack React Django Application
`React-Django Integrated using django-cors-headers, middleware and other configuration.`

# Install Python 3.12 version from [https://www.python.org](https://www.python.org/) website
- For Windows download python 3.12 version executable file.
- While Installing ensure you tick the box "Add to Python 3.12 to Path"

# Open Terminal (Powershell or Git bash)
- Check installed version using `python --version` or `python3 --version`
- By this you have `PIP` is also installed on your system.
- you can check version by using command `pip --version`.

# Install git from [https://git-scm.com/](https://git-scm.com/) this website
- download and install latest git version on your system.
- follow the instructions on screen and install.
- configure git on your terminal.
 
# Clone the Repository:
- open terminal and run following commands
- `git clone https://github.com/vknan/React_Django_Full_Stack.git` or
- via ssh `git clone git@github.com:vknan/React_Django_Full_Stack.git`
  
# Running Django Application (Backend Terminal)
1. Change directory inside Django project by `cd Vijay_Portfolio`
2. Use `Powershell` or `Git Bash` to create virtual environment by following below instructions given.
3. Install all required python libraries using `pip install -r requirements.txt` in your virtual environment.
4. run django server `python manage.py runserver --settings=myproject.settings.development`

# Installing the requirements from text file.
- use command `pip install -r requirements.txt`

# Creating Virtual Environment 
## On Power Shell
- use command `pip install virtualenv`
- Then create virtual environment using`virtualenv myenv`
- use command `cd myenv`
- use command `.\Scripts\Activate.ps1` to activate
- use command `deactivate` to deactivate environment

## On Git Bash
- install using command `pip install virtualenv` on git bash
- create virtual environment using `virtualenv myenv` on git bash
- Activate Virtual Environment by using terminal command `source myenv/Scripts/activate` if using git bash.
- use command `deactivate` to deactivate environment


# Api End points
1. `http:127.0.0.1:8000/api/courses/`
2. `http:127.0.0.1:8000/api/posts/`
3. `http:127.0.0.1:8000/api/comments/`
4. `http:127.0.0.1:8000/api/contacts/`
5. `http:127.0.0.1:8000/api/categories/`
6. `http:127.0.0.1:8000/api/enrollments/`
7. `http:127.0.0.1:8000/api/abouts/`
8. `http:127.0.0.1:8000/api/tags/`
9. `http:127.0.0.1:8000/api/lessons/`
10. `http:127.0.0.1:8000/api/quiz/`
11. `http:127.0.0.1:8000/api/modules/`
12. `http:127.0.0.1:8000/api/discussionposts/`
13. `http:127.0.0.1:8000/api/progress/`

# Running React Application (Front End Terminal)
To run your react application locally using below command for the first time.
1. Change directory inside react folder by`cd navikonline-react`
2. `npm install`

and then `npm start`
