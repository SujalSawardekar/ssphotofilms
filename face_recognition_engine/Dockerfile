FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required by dlib and face-recognition
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py ml_core.py shortlisting_pipeline.py album_processor.py qr_generator.py ./
COPY templates/ ./templates/

# Create required directories
RUN mkdir -p album_images user_uploads testing_data databases

# Expose default port
EXPOSE 5001

# Set environment variables (can be overridden at runtime)
ENV HOST=0.0.0.0
ENV PORT=5001
ENV FLASK_ENV=development

# Run the application
CMD ["python", "app.py"]
