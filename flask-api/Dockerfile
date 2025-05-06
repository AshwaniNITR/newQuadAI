# Use an official PyTorch image with CUDA support
FROM python:3.12.3

# Set the working directory
WORKDIR /app

# Copy files to the container
COPY . /app

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126

# Expose the port Flask runs on
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "app:app", "--bind", "0.0.0.0:5000"]
