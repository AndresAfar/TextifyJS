// src/RichTextEditor.js
import "./index.css";
export class RichTextEditor {
    constructor(selector, options = {}) {
      this.container = typeof selector === 'string' 
        ? document.querySelector(selector) 
        : selector;
      
      this.options = {
        placeholder: 'Comienza a escribir aquí...',
        toolbar: {
          basic: true,
          formatting: true,
          alignment: true,
          lists: true,
          media: true,
        },
        counters: true,
        ...options
      };
  
      this.init();
    }
  
    init() {
      this.createStructure();
      this.setupToolbar();
      this.setupEditor();
      this.setupCounters();
    }
  
    createStructure() {
      this.container.classList.add('rich-editor-container');
      
      // Crear estructura HTML
      this.container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          ${this.createToolbarHTML()}
          <div class="relative">
            <div
              class="editor min-h-[400px] p-6 focus:outline-none"
              contenteditable="true"
            >
              <p>${this.options.placeholder}</p>
            </div>
          </div>
          ${this.options.counters ? this.createCountersHTML() : ''}
        </div>
      `;
  
      this.editor = this.container.querySelector('.editor');
    }
  
    createToolbarHTML() {
      const tools = [];
      
      if (this.options.toolbar.basic) {
        tools.push(`
          <div class="flex items-center space-x-2 border-r pr-2">
            <select class="format-block toolbar-select">
              <option value="p">Normal</option>
              <option value="h1">Título 1</option>
              <option value="h2">Título 2</option>
              <option value="h3">Título 3</option>
            </select>
            
            <select class="font-name toolbar-select">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
        `);
      }

      if (this.options.toolbar.formatting) {
        tools.push(`

          <div class="flex items-center space-x-1 border-r pr-2">
            <button data-command="bold" class="toolbar-btn" title="Negrita">
              <i class="fas fa-bold"></i>
            </button>
            <button data-command="italic" class="toolbar-btn" title="Cursiva">
              <i class="fas fa-italic"></i>
            </button>
            <button data-command="underline" class="toolbar-btn" title="Subrayado">
              <i class="fas fa-underline"></i>
            </button>
          </div>
        `);
      }

      if(this.options.toolbar.alignment){
        tools.push(`
          <div class="flex items-center space-x-1 border-r pr-2">
              <button data-command="justifyLeft" class="toolbar-btn" title="Alinear izquierda">
                <i class="fas fa-align-left"></i>
              </button>
              <button data-command="justifyCenter" class="toolbar-btn" title="Centrar">
                <i class="fas fa-align-center"></i>
              </button>
              <button data-command="justifyRight" class="toolbar-btn" title="Alinear derecha">
                <i class="fas fa-align-right"></i>
              </button>
              <button data-command="justifyFull" class="toolbar-btn" title="Justificar">
                <i class="fas fa-align-justify"></i>
              </button>
          </div>
        `)
      }

      if (this.options.toolbar.lists) {
        tools.push(`
            <div class="flex items-center space-x-1 border-r pr-2">
                <button data-command="insertUnorderedList" class="toolbar-btn" title="Lista con viñetas">
                    <i class="fas fa-list-ul"></i>
                </button>
                <button data-command="insertOrderedList" class="toolbar-btn" title="Lista numerada">
                    <i class="fas fa-list-ol"></i>
                </button>
            </div>
        `);
      }

      if (this.options.toolbar.media) {
        tools.push(`
            <div class="flex items-center space-x-1">
                <button id="link-upload" data-command="createLink" class="toolbar-btn" title="Insertar enlace">
                    <i class="fas fa-link"></i>
                </button>
                <button id="image-upload" class="toolbar-btn" title="Insertar imagen">
                    <i class="fas fa-image"></i>
                </button>
                <button data-command="undo" class="toolbar-btn" title="Deshacer">
                    <i class="fas fa-undo"></i>
                </button>
                <button data-command="redo" class="toolbar-btn" title="Rehacer">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `);
      }
  
      // Agregar más secciones según las opciones...
  
      return `
        <div class="border-b border-gray-200 p-4">
          <div class="flex flex-wrap gap-2">
            ${tools.join('')}
          </div>
        </div>
      `;
    }
  
    createCountersHTML() {
      return `
        <div class="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between text-sm text-gray-500">
          <div class="char-count">Caracteres: 0</div>
          <div class="word-count">Palabras: 0</div>
        </div>
      `;
    }
  
    setupToolbar() {
      this.container.querySelectorAll('.toolbar-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const command = button.getAttribute('data-command');
          this.executeCommand(command);
        });
      });
  
      // Setup selects
      const formatBlock = this.container.querySelector('.format-block');
      if (formatBlock) {
        formatBlock.addEventListener('change', () => {
          this.executeCommand('formatBlock', formatBlock.value);
        });
      }

      // Insertar imágenes mediante URL
      const imageUploadButton = this.container.querySelector('#image-upload');
      if (imageUploadButton) {
          imageUploadButton.addEventListener('click', () => {
              const url = prompt('Ingresa la URL de la imagen:');
              if (url) {
                  this.insertImage(url);
              }
          });
      }

      // Insertar enlace mediante URL
      const linkUploadButton = this.container.querySelector('#link-upload');
      if (linkUploadButton) {
        linkUploadButton.addEventListener('click', () => {
              const command = linkUploadButton.getAttribute('data-command');
              const url = prompt('Ingresa la URL del enlace:');
              if (url) document.execCommand(command, false, url);
          });
      }
    }
  
    executeCommand(command, value = null) {
      this.editor.focus();
      document.execCommand(command, false, value);
      this.updateButtonStates();
    }

    insertImage(url) {
      document.execCommand('insertImage', false, url);
      this.editor.focus();
    }
  
    setupEditor() {
      this.editor.addEventListener('input', () => this.updateCounters());
      this.editor.addEventListener('keyup', () => this.updateButtonStates());
      this.editor.addEventListener('mouseup', () => this.updateButtonStates());
    }
  
    setupCounters() {
      if (!this.options.counters) return;
      
      this.charCount = this.container.querySelector('.char-count');
      this.wordCount = this.container.querySelector('.word-count');
      this.updateCounters();
    }
  
    updateCounters() {
      if (!this.options.counters) return;
      
      const text = this.editor.innerText;
      this.charCount.textContent = `Caracteres: ${text.length}`;
      this.wordCount.textContent = `Palabras: ${text.trim().split(/\s+/).length}`;
    }
  
    updateButtonStates() {
      this.container.querySelectorAll('.toolbar-btn[data-command]').forEach(button => {
        const command = button.getAttribute('data-command');
        if (document.queryCommandState(command)) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
  
    // API Pública
    getContent() {
      return this.editor.innerHTML;
    }
  
    setContent(html) {
      this.editor.innerHTML = html;
      this.updateCounters();
    }
  
    destroy() {
      // Limpiar eventos y referencias
      this.container.innerHTML = '';
    }
  }

// Exportar como default
export default RichTextEditor;