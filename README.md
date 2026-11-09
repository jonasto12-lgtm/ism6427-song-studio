# Song Studio

An AI music generator built for ISM 6427. Describe a song (or write your own lyrics) and the app creates two full versions with the [Suno API](https://docs.sunoapi.org/).

Live site: https://ism6427-song-studio.netlify.app

## How it works

- `public/index.html` is the web page people see.
- `netlify/functions/` holds small server functions that talk to SunoAPI.org:
  - `generate` starts a song, `status` checks on it, `credits` shows the remaining balance.
- The Suno key is stored on Netlify as the `SUNO_API_KEY` environment variable. It is never in this code.

## Deploying

Netlify is connected to this repository. Every push to `main` updates the live site automatically.
