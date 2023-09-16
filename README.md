# TestTV

A test app to try out `@config-plugins/tv`.

Includes code to exercise EAS Update, and show a video using `expo-video`.

## Quick start

```sh
eas init
eas build:configure
# Build an iOS simulator app
eas build -e preview -p ios
# Build an Apple TV simulator app
eas build -e preview_tv -p ios
# Build an Android phone app
eas build -e preview -p android
# Build an Android TV app
eas build -e preview_tv -p android
```

There are also profiles to build development apps for TV that can run against the packager with `npx expo start`.

# @config-plugins/tv

Expo Config Plugin to auto-configure the native directories for TV

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/tv"]
  }
}
```

or

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/tv",
        {
          "isTV": true,
          "showVerboseWarnings": false
        }
      ]
    ]
  }
}
```

## Usage

_Plugin parameters_:

- `isTV`: (optional boolean) If true, prebuild should generate Android and iOS files for TV (Android TV and Apple TV). If false, the default phone-appropriate files should be generated. Setting the environment variable EXPO_TV to "true" or "1" will override this value.
- `showVerboseWarnings`: (optional boolean) If true, verbose warnings will be shown during plugin execution.

_Warning_:

When this plugin is used to generate files in the iOS directory that build an Apple TV app, your React Native dependency in `package.json` must be set to the React Native TV fork, as shown in the example below:

```json
{
  "dependencies": {
    "react-native": "npm:react-native-tvos@^0.72.4-0"
  }
}
```

If this is not the case, the plugin will run successfully, but Cocoapods installation will fail, since React Native core repo does not support Apple TV.
