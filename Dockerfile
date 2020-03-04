FROM python:3.6.10

CMD ["bash"]

RUN apt-get update
RUN pip install --upgrade pip
RUN apt install -y libsm6 libxext6 libxrender-dev

# Install Node.js 8 and npm 5
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
#RUN mkdir -p /workspace
WORKDIR /workspace

RUN rm -rf node_modules && npm install

COPY package.json ./
RUN npm install

COPY . .

#install python package
RUN pip install -r requirements.txt

EXPOSE 80
ENTRYPOINT npm start
