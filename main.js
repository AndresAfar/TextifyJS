import RichTextEditor from './src/RichTextEditor.js';

// Create an instance of the editor
const editor = new RichTextEditor('#editor-container', {
  height: 510,
  width: 896,
  language: 'en', // Spanish
  placeholder: 'Write here...',
  toolbar: {
    basic: true,
    formatting: true,
    alignment: true,
    lists: true,
    media: true,
  },
  fonts: [
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Georgia', value: 'Georgia' },
  ],
  counters: true,
  colors: ['#640D5F', '#3C552D']
});


// Change the theme
console.log(editor.getContent()); // Get the current content.
// editor.setContent('<h1>Hello world</h1>'); // Set content in the editor.