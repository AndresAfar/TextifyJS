import RichTextEditor from './src/RichTextEditor.js';

// Crear una instancia del editor
const editor = new RichTextEditor('#editor-container', {
  placeholder: 'Escribe aquí...',
  toolbar: {
    basic: true,
    formatting: true,
    alignment: true,
    lists: true,
    media: true,
  },
  counters: true,
  styles: {
    containerClass: '',
    toolbarClass: '',
    editorClass: '',
    buttonClass: '',
    counterClass: 'background-color: aqua;'
  },
  colors: ['#640D5F', '#3C552D']
});


// Cambiar el tema
console.log(editor.getContent()); // Obtén el contenido actual
// editor.setContent('<h1>Hola mundo</h1>'); // Establece contenido en el editor
