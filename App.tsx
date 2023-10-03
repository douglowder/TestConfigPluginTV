/**
 * Test app that shows some features of the Updates API
 */
import { Video } from 'expo-video';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ResizeMode } from 'expo-av';

export default function App() {
  const video = React.useRef<Video>(null);
  const [status, setStatus] = useState<any>({ isPlaying: false });
  useEffect(() => {
    if (video.current !== null) {
      video.current.pauseAsync();
    }
  }, [video.current]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Updates JS API test</Text>
      <UpdatesStatusView index={1} />
      <View style={{ flex: 3, alignItems: 'center' }}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying
              ? video.current && video.current?.pauseAsync()
              : video.current?.playAsync()
          }
        />
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping
          onPlaybackStatusUpdate={(s) => setStatus(() => s)}
        />
      </View>
    </SafeAreaView>
  );
}

function UpdatesStatusView(props: { index: number }) {
  const [updateMessage, setUpdateMessage] = React.useState('');

  // Displays a message showing whether or not the app is running
  // a downloaded update
  const runTypeMessage = `isEmbeddedLaunch = ${Updates.isEmbeddedLaunch}\n`;

  const checkAutomaticallyMessage = `Automatic check setting = ${Updates.checkAutomatically}`;

  const {
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    availableUpdate,
    checkError,
    downloadError,
    lastCheckForUpdateTimeSinceRestart,
  } = Updates.useUpdates();

  useEffect(() => {
    const checkingMessage = isChecking ? 'Checking for an update...\n' : '';
    const downloadingMessage = isDownloading ? 'Downloading...\n' : '';
    const availableMessage = isUpdateAvailable
      ? `Found a new update: manifest = \n${manifestToString(
          availableUpdate?.manifest,
        )}...` + '\n'
      : 'No new update available\n';
    const checkErrorMessage = checkError
      ? `Error in check: ${checkError.message}\n`
      : '';
    const downloadErrorMessage = downloadError
      ? `Error in check: ${downloadError.message}\n`
      : '';
    const lastCheckTimeMessage = lastCheckForUpdateTimeSinceRestart
      ? `Last check: ${
          lastCheckForUpdateTimeSinceRestart.toLocaleString() ?? ''
        }\n`
      : '';
    setUpdateMessage(
      checkingMessage +
        downloadingMessage +
        availableMessage +
        checkErrorMessage +
        downloadErrorMessage +
        lastCheckTimeMessage,
    );
  }, [
    availableUpdate?.manifest,
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    checkError,
    downloadError,
    lastCheckForUpdateTimeSinceRestart,
  ]);

  useEffect(() => {
    const handleReloadAsync = async () => {
      let countdown = 5;
      while (countdown > 0) {
        setUpdateMessage(
          `Downloaded update... launching it in ${countdown} seconds.`,
        );
        countdown = countdown - 1;
        await delay(1000);
      }
      await Updates.reloadAsync();
    };
    if (isUpdatePending) {
      handleReloadAsync();
    }
  }, [isUpdatePending]);

  const handleCheckButtonPress = () => {
    Updates.checkForUpdateAsync().catch(() => {});
  };

  const handleDownloadButtonPress = () => {
    Updates.fetchUpdateAsync().catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Status</Text>
      <Text style={styles.updateMessageText}>{updateMessage}</Text>
      <View>
        <Button
          title="Check manually for updates"
          onPress={handleCheckButtonPress}
        />
        {isUpdateAvailable ? (
          <Button title="Download update" onPress={handleDownloadButtonPress} />
        ) : null}
      </View>
    </View>
  );
}

const Button = (props: { title: string; onPress: any }) => {
  return (
    <Pressable
      style={({ pressed, focused }) => [
        styles.button,
        { opacity: pressed || focused ? 0.7 : 1.0 },
      ]}
      onPress={props.onPress}
    >
      <Text style={styles.buttonText}>{props.title}</Text>
    </Pressable>
  );
};

const scale = Platform.OS === 'ios' && Platform.isTV ? 2 : 1;

const styles = StyleSheet.create({
  video: {
    flex: 3,
    width: 480 * scale,
    height: 256 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50 * scale,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5 * scale,
    width: 200 * scale,
    paddingVertical: 6 * scale,
    paddingHorizontal: 16 * scale,
    borderRadius: 2 * scale,
    elevation: 3,
    backgroundColor: '#4630EB',
  },
  buttonText: {
    color: 'white',
    fontSize: 10 * scale,
  },
  updateMessageText: {
    margin: 5 * scale,
    height: 20 * scale,
    paddingVertical: 2 * scale,
    paddingHorizontal: 10 * scale,
    width: 480 * scale,
    borderColor: '#4630EB',
    borderWidth: 1,
    borderRadius: 2 * scale,
    fontSize: 10 * scale,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

///////////////////////////

/**
 * Promise wrapper for setTimeout()
 * @param {delay} timeout Timeout in ms
 * @returns a Promise that resolves after the timeout has elapsed
 */
const delay = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const manifestToString = (manifest?: any) => {
  return `id = ${manifest?.id ?? ''}`;
};
