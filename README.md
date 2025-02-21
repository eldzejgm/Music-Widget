# AudioWidget

AudioWidget is a custom JavaScript-based music player that can be easily integrated into your website. It allows you to play music from a specified folder, offering control buttons such as play/pause, previous/next track, and volume adjustment.

## Features

- **Automatic song loading** – The widget scans the specified folder for audio files (.mp3 or .wav) and creates a playlist.
- **Interactive controls** – Includes buttons for play/pause, stop, previous/next track, and volume adjustment.
- **Customization** – Allows customization of button icons and styles via configuration.

## Requirements

- A web browser that supports JavaScript ES6.
- Audio files (.mp3 or .wav) placed in a publicly accessible folder on your server.

## Installation

1. **Add script and style files to your webpage**:

   ```html
   <link rel="stylesheet" href="https://eldzejgm.github.io/Music-Widget/widget.css">
   ```

2. **Initialize the widget**:

   ```html
   <script type="module">
     import initAudioWidget from 'https://eldzejgm.github.io/Music-Widget/widget.js';
      initAudioWidget({
          musicPath: './music/',
          initialVolume: 0.7,
      });
   </script>
   ```

### Configuration Parameters

- `musicPath` (string): Path to the folder containing audio files.
- `initialVolume` (number): Initial volume level (0.0 - 1.0).
- `buttonClasses` (object): CSS classes for specific buttons.
- `buttonIcons` (object): Custom icons for buttons (Font Awesome classes or image URLs).
- `iconStyles` (object): CSS styles for button icons.

## Code Structure

- `init()`: Initializes the widget, creates an audio element, loads songs, and adds event listeners.
- `createUI()`: Creates the user interface, including control buttons.
- `loadSongsFromFolder()`: Loads a list of songs from the specified folder.
- `loadSong(index)`: Loads and plays a song based on its index.
- `addEventListeners()`: Adds event listeners to control buttons.

## Notes

- **Browser security** – Autoplay may require user interaction.
- **File accessibility** – Ensure audio files are publicly accessible.
- **Styling** – You can customize the widget’s appearance by modifying the `widget.css` file.
