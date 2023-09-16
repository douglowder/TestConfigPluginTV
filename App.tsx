/**
 * Test app that shows some features of the Updates API
 */
import { Video } from 'expo-video';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const video = React.useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Updates JS API test</Text>
      <UpdatesStatusView index={1} />
      <View style={styles.container}>
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
          resizeMode="contain"
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
    <View>
      <Text>View {props.index}</Text>
      <Text>{runTypeMessage}</Text>
      <Text>{checkAutomaticallyMessage}</Text>
      <Text> </Text>
      <Text style={styles.titleText}>Status</Text>
      <Text style={styles.updateMessageText}>{updateMessage}</Text>
      <Button
        title="Check manually for updates"
        onPress={handleCheckButtonPress}
      />
      {isUpdateAvailable ? (
        <Button title="Download update" onPress={handleDownloadButtonPress} />
      ) : null}
      <StatusBar style="auto" />
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

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: 960,
    height: 512,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#4630EB',
  },
  buttonText: {
    color: 'white',
  },
  updateMessageText: {
    margin: 10,
    height: 100,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: 250,
    borderColor: '#4630EB',
    borderWidth: 1,
    borderRadius: 4,
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
  return manifest
    ? JSON.stringify(
        {
          id: manifest.id,
        },
        null,
        2,
      )
    : 'null';
};
