FROM ubuntu:22.04
SHELL ["/bin/bash","--login","-c"]
RUN apt-get update -y
RUN apt-get install curl -y
RUN adduser --disabled-password --gecos "" cas-user
RUN adduser cas-user sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER cas-user
WORKDIR /home/cas-user/
RUN touch ~/.bashrc && chmod +x ~/.bashrc
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
ENV NVM_DIR /home/cas-user/.nvm
RUN . $NVM_DIR/nvm.sh && nvm install 18.14.2
ENV NODE_PATH $NVM_DIR/v18.14.2/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v18.14.2/bin:$PATH
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm","start"]