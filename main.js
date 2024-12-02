import RichTextEditor from './src/RichTextEditor.js';

// Crear una instancia del editor
const editor = new RichTextEditor('#editor-container', {
  height: 510,
  width: 896,
  placeholder: 'Escribe aquí...',
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


// Cambiar el tema
console.log(editor.getContent()); // Obtén el contenido actual
// editor.setContent('<h1>Hola mundo</h1>'); // Establece contenido en el editor
