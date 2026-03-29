const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const SUBTITLES_BASE_URL = process.env.SUBTITLES_BASE_URL || "https://raw.githubusercontent.com/andrey-243/office-en-subtitles/main/subtitles/";

const manifest = {
  id: "community.media.subtitles",
  version: "1.2.0",
  name: "Media Subtitles EN",
  description: "English subtitles addon",
  resources: ["subtitles"],
  types: ["series", "movie", "other"],
  catalogs: [],
};

const builder = new addonBuilder(manifest);

builder.defineSubtitlesHandler(async ({ type, id, extra }) => {
  const filename = extra && (extra.filename || extra.name || "");
  let code = null;

  if (filename) {
    const m = filename.match(/S(\d{2})E(\d{2})/i);
    if (m) code = `S${m[1].toUpperCase()}E${m[2].toUpperCase()}`;
  }

  if (!code) {
    const m = id.match(/S(\d{2})E(\d{2})/i);
    if (m) code = `S${m[1].toUpperCase()}E${m[2].toUpperCase()}`;
  }

  if (!code) return { subtitles: [] };

  const url = `${SUBTITLES_BASE_URL}${code}.srt`;

  return {
    subtitles: [
      {
        id:   `sub-en-${code}`,
        url:  url,
        lang: "eng",
      },
    ],
  };
});

const PORT = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port: PORT });
