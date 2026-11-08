# Rotten Potatoes
Project for *Backend Web 1.1* @[MakeSchool]. Live at **https://projects.nebuloid.dev/rotten-potatoes/**.

If you spot an error, mark an issue on my github!

## Technologies
- MongoDB Atlas
- Robo 3T
- Render
- Cloudflare Workers
- Mongoose
- Node.js
- Express.js
- Handlebars.js
- Fetch

## Local Setup
To run this app, follow these steps:

### First Time Local Setup
1. open a terminal session
1. ensure you have [node.js] installed
1. clone this repository into a desireable directory
1. within a terminal, `cd` into the app's directory
1. run `npm install`
1. set the `TMDB_API_KEY` environment variable to your TMDB API key

### Running the App Locally
1. open a terminal session
1. ensure MongoDB is running and listening on `127.0.0.1:27017`; otherwise, start `mongod` in a separate terminal session
1. open a second terminal session
1. `cd` into the app's directory
1. run `npm start`
1. navigate to http://localhost:3000/ in a web browser

## Production Deployment
The production setup runs this Express app on **Render**, stores data in **MongoDB Atlas**, and uses a **Cloudflare Worker** to route only
`https://projects.nebuloid.dev/rotten-potatoes` to Render.
The rest of `projects.nebuloid.dev` continues to use its existing **GitHub Pages** origin.

### MongoDB Atlas
1. Create an Atlas cluster and a database user for this app.
1. Copy the cluster's application connection string and replace its database name with `rotten-potatoes`.
1. Keep the password URL-encoded in the connection string.
1. After creating the Render service, allow its outbound IP ranges in the Atlas Network Access list.
	Avoid `0.0.0.0/0` for a permanent deployment.

### Render
1. Create a Render Blueprint from this repository; [render.yaml](./render.yaml) defines the Node web service.
	If the service already exists, sync the Blueprint and confirm it tracks `main` with auto-deploy enabled.
1. Set the prompted `MONGODB_URI` to the Atlas connection string and `TMDB_API_KEY` to the TMDB API key.
1. Deploy and note the service's `onrender.com` hostname.
	The Blueprint tracks `main` and enables automatic deploys on pushes to that branch.

The Blueprint uses Render's free web-service plan, which can sleep while idle and have a cold start.
Change `plan` in `render.yaml` if you want an always-on service.
The Blueprint sets `PUBLIC_BASE_PATH=/rotten-potatoes`.
Do not remove this setting: the app uses it for Express routes, assets, links, forms, and redirects.
The build command compiles Sass during deployment; the start command runs the built app without requiring Sass at runtime.

### Cloudflare and Namecheap
**Namecheap** remains the registrar; **Cloudflare** provides DNS and the path-specific Worker route.

1. Add `nebuloid.dev` to Cloudflare and import its current DNS records.
1. Verify all imported records, especially any mail-related MX and TXT records, before changing nameservers.
1. In Namecheap, switch the domain to the two Cloudflare nameservers shown in the Cloudflare dashboard.
	Wait until Cloudflare confirms the zone is active.
1. In Cloudflare DNS, keep `projects.nebuloid.dev` pointed at the existing GitHub Pages origin and enable Cloudflare proxying for that record.
	Do not replace the GitHub Pages origin with Render.
1. In [cloudflare/wrangler.toml](./cloudflare/wrangler.toml), replace `RENDER_ORIGIN` with the deployed Render service's HTTPS origin.
1. The `Deploy Cloudflare Worker` GitHub Actions workflow deploys on pushes to `main` that change files under `cloudflare/`.
	It can also be started manually from the repository's **Actions** tab.
1. To deploy manually from the repository root, authenticate Wrangler and run:
	```sh
	npx wrangler deploy --config cloudflare/wrangler.toml
	```

The Worker routes `/rotten-potatoes` and its descendants to Render while preserving the path (required by the app's base-path setting).
Its wildcard route also catches query strings; similarly named but unrelated paths continue to GitHub Pages.
Keep `PUBLIC_BASE_PATH` in Render and the Worker's base path consistent if the public URL changes.
Namecheap only manages the domain registration and nameservers, and Atlas continues to host the app's data; neither needs a code deployment on each push.

# Component Structure
- **Main Layout:**
	*the main layout keeps the base structure for every page.*
- **Homepage:**
	*the homepage has a variety of options for viewing the movies index.*
- **Movies Index:**
	*the movies index page houses a list of movie-card subcomponents in a grid.*
	*each movie card utilizes two states: activated and hidden.*
	*when a movie card is activated, its details are shown.*
	*when a movie card is hidden, only its title and poster are shown.*
	- Movie Card
- **Shallow Movie Card:**
	- Title Bars
	- Details
	- Featured Poster
- **Deep Movie Card**
	- Title Bar
	- Details
	- Featured Poster
	- Poster Gallery
	- Backdrop Gallery
	- Trailer Gallery
	- Review Gallery

[MakeSchool]: https://www.makeschool.com/
[node.js]: https://nodejs.org/en/
