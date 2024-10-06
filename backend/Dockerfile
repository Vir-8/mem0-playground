# Dockerfile for Django
# Use an official Python runtime as a parent image
FROM python:3.12

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /

# Copy the requirements file into the container
COPY requirements.txt ./

# Install the Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of your Django project to the working directory
COPY . .

# Expose the port Django will run on
EXPOSE 8000

# Command to run Gunicorn WSGI server for production
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
