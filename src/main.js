// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

// src/main.js
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const buttons = document.querySelectorAll('button[data-command]');
  const formatBlock = document.getElementById('formatBlock');
  const fontName = document.getElementById('fontName');
  const charCount = document.getElementById('charCount');
  const wordCount = document.getElementById('wordCount');

  // Función para actualizar contadores
  const updateCounters = () => {
    const text = editor.innerText;
    charCount.textContent = `Caracteres: ${text.length}`;
    wordCount.textContent = `Palabras: ${text.trim().split(/\s+/).length}`;
  };

  // Función para actualizar estado de botones
  const updateButtonStates = () => {
    buttons.forEach(button => {
      const command = button.getAttribute('data-command');
      if (document.queryCommandState(command)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  };

  // Event listeners para botones
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const command = button.getAttribute('data-command');
      
      if (command === 'createLink') {
        const url = prompt('Ingresa la URL del enlace:');
        if (url) document.execCommand(command, false, url);
      } else {
        document.execCommand(command, false, null);
      }
      
      editor.focus();
      updateButtonStates();
    });
  });

  // Event listener para formato de bloque
  formatBlock.addEventListener('change', () => {
    document.execCommand('formatBlock', false, formatBlock.value);
    editor.focus();
  });

  // Event listener para fuente
  fontName.addEventListener('change', () => {
    document.execCommand('fontName', false, fontName.value);
    editor.focus();
  });

  // Manejo de imágenes
  document.getElementById('image-upload').addEventListener('click', () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      document.execCommand('insertImage', false, url);
      editor.focus();
    }
  });

  // Event listeners para el editor
  editor.addEventListener('input', () => {
    updateCounters();
  });

  editor.addEventListener('keyup', updateButtonStates);
  editor.addEventListener('mouseup', updateButtonStates);

  // Drag and drop de imágenes
  editor.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  editor.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.execCommand('insertImage', false, e.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  });

  // Inicialización
  updateCounters();
  updateButtonStates();
});

// Función para prevenir pegado de contenido con formato
document.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
});