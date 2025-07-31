import { GoogleScriptRun } from "./googleScriptRunMock";

export const google = {
  script: {
    run: new GoogleScriptRun(),

    history: {
      push(
        state?: {} | null,
        params?: { [key: string]: string } | null,
        hash?: string | null
      ) {
        console.log("🛠️ [MOCK] google.script.history.push called");
        const url = buildUrl(params, hash);
        history.pushState(state, "", url);
      },

      replace(
        state?: {} | null,
        params?: { [key: string]: string } | null,
        hash?: string | null
      ) {
        console.log("🛠️ [MOCK]  google.script.history.push called");
        const url = buildUrl(params, hash);
        history.replaceState(state, "", url);
      },

      setChangeHandler(callback: (e: { state: any; location: any }) => void) {
        console.log("🛠️ [MOCK]  google.script.history.setChangeHandler called");
        window.addEventListener("popstate", () => {
          const eventObj = {
            state: history.state,
            location: getLocationObj(),
          };

          callback(eventObj);
        });
      },
    },

    url: {
      getLocation(callback: (location: any) => void) {
        const locationObj = getLocationObj();
        callback(locationObj);
      },
    },
  },
};

const buildUrl = (
  params?: { [key: string]: string } | null,
  hash?: string | null
) => {
  const queryString = params
    ? "?" +
      Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&")
    : "";

  hash = hash ? `#${hash}` : "";

  return `${location.protocol}//${location.host}${queryString}${hash}`;
};

const getLocationObj = () => {
  const url = new URL(location.href);

  const parameters: Record<string, string[]> = {};
  url.searchParams.forEach((value, key) => {
    if (!parameters[key]) parameters[key] = [];
    parameters[key].push(value);
  });

  const parameter: Record<string, string> = {};
  Object.keys(parameters).forEach((key) => {
    parameter[key] = parameters[key][0];
  });

  return {
    hash: url.hash.replace(/^#/, ""),
    parameter,
    parameters,
  };
};
