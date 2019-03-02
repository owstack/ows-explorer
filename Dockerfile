FROM node:10

USER root
# Set up non root user
RUN useradd --user-group --create-home --shell /bin/false ows

# Setup environment variables
ENV APP_NAME=explorer-ui
ENV HOME_PATH=/home/ows
ENV APP_DIR=$HOME_PATH/$APP_NAME

# Set up folder
RUN mkdir -p $APP_DIR
RUN chown -R ows:ows $APP_DIR

# install modules
USER ows
COPY package.json $APP_DIR
WORKDIR $APP_DIR
RUN npm install

# copy other app files
COPY . $APP_DIR
RUN npm run bower-install
RUN npm run grunt-compile

USER root
RUN npm run apply
RUN chown -R ows:ows $APP_DIR

USER ows

ENV NODE_ENV=production

CMD ["npm", "start"]
