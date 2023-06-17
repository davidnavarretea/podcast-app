# Podcast App

This is a mini-application for listening to music podcasts. It allows users to browse popular podcasts, view podcast details, and listen to individual episodes.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the necessary dependencies.

bashCopy code

`npm install`

## Development Mode

To run the application in development mode, use the following command:

bashCopy code

`npm start`

This will start the development server and open the application in your browser at [http://localhost:3000](http://localhost:3000/). Any changes you make to the code will automatically reload the page.

## Production Mode

To build the application for production, use the following command:

bashCopy code

`npm run build`

This will create a production-ready build of the application in the `build` directory.

## Usage

### Home Page

The home page displays a list of the top 100 podcasts according to Apple's rankings. You can filter the podcasts by entering a search term in the input field. The list will update in real-time as you type.

Clicking on a podcast will navigate to the podcast detail page.

### Podcast Detail Page

The podcast detail page shows the details of a specific podcast, including the podcast's image, title, author, and description. It also displays the number of episodes and a list of episodes with their titles, release dates, and durations.

Clicking on an episode title will navigate to the episode detail page.

### Episode Detail Page

The episode detail page displays the details of a specific episode, including the podcast's image, title, author, description, and an audio player to listen to the episode.

### Note

Please note that this application is best viewed on the latest version of Google Chrome on desktop.

## Deployment

To deploy the application to a production environment, follow the instructions specific to your hosting provider. Make sure to serve the assets from the `build` directory.

## Credits

This application fetches podcast data from the iTunes API. The list of the top 100 podcasts is retrieved from [https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json](https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json).

## License

[MIT](https://choosealicense.com/licenses/mit/)
