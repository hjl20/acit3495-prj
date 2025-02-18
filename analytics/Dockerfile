FROM python:3.12.9-alpine3.21

RUN mkdir -p /home/app
WORKDIR /home/app

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN chmod +x app.py

CMD ["python", "app.py"]