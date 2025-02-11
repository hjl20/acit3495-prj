FROM python:3.12.9-alpine3.21

RUN mkdir -p /home/app
WORKDIR /home/app

COPY requirements.txt /home/app/
RUN pip install -r /home/app/requirements.txt

COPY . /home/app/

CMD ["python", "/home/app/app.py"]