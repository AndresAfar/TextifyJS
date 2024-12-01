// src/RichTextEditor.js
import "./index.css";
export class RichTextEditor {
    constructor(selector, options = {}) {
      this.container = typeof selector === 'string' 
        ? document.querySelector(selector) 
        : selector;
      
      this.options = {
        height: 510,
        width: 896,
        placeholder: 'Comienza a escribir aquí...',
        toolbar: {
          basic: true,
          formatting: true,
          alignment: true,
          lists: true,
          media: true,
        },
        fonts: [
          { name: 'Arial', value: 'Arial' },
          { name: 'Times New Roman', value: 'Times New Roman' },
          { name: 'Courier New', value: 'Courier New' },
          { name: 'Georgia', value: 'Georgia' },
          { name: 'Verdana', value: 'Verdana' }
        ],
        colors: [
          '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
          '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
        ],
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
      // Crear clase CSS dinámica con las dimensiones
      const pxToRem = (px) => px / 16; // Conversión de px a rem

      const style = document.createElement('style');
      style.innerHTML = `
        .rich-editor-container {
          max-width: ${pxToRem(this.options.width)}rem; 
          max-height: ${pxToRem(this.options.height)}rem; 
        }
      `;
      document.head.appendChild(style);
      
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
              <option value="h4">Título 4</option>
              <option value="pre">Código</option>
            </select>
            
            <select class="font-name toolbar-select">
              ${this.options.fonts.map(font => 
                `<option value="${font.value}">${font.name}</option>`
              ).join('')}
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
            <button data-command="strikethrough" class="toolbar-btn" title="Tachado">
              <i class="fas fa-strikethrough"></i>
            </button>
            <select class="text-color toolbar-select">
              <option value="#374151">Color de texto</option>
              ${this.options.colors.map(color => 
                `<option value="${color}" style="background-color: ${color}">${color}</option>`
              ).join('')}
            </select>
  
            <select class="bg-color toolbar-select">
              <option value="">Color de fondo</option>
              ${this.options.colors.map(color => 
                `<option value="${color}" style="background-color: ${color}">${color}</option>`
              ).join('')}
            </select>
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
              <button data-command="indent" class="toolbar-btn" title="Aumentar sangría">
                <i class="fas fa-indent"></i>
              </button>
              <button data-command="outdent" class="toolbar-btn" title="Disminuir sangría">
                <i class="fas fa-outdent"></i>
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

      // fontName
      const fontName = this.container.querySelector('.font-name');
      if (fontName) {
        fontName.addEventListener('change', () => {
          this.executeCommand('fontName', fontName.value);
        });
      }

      // textColor
      const textColor = this.container.querySelector('.text-color');
      if (textColor) {
        textColor.addEventListener('change', () => {
          this.executeCommand('foreColor', textColor.value);
        });
      }

      // bgColor
      const bgColor = this.container.querySelector('.bg-color');
      if (bgColor) {
        bgColor.addEventListener('change', (e) => {
          const selectedValue = e.target.value;
          if (selectedValue === '') {
            // First we try to remove the color using removeFormat
            this.executeCommand('removeFormat');
            
            // Como respaldo, también establecemos explícitamente el color de fondo a transparente
            try {
              document.execCommand('backColor', false, 'transparent');
              // As a backup, we also explicitly set the background color to transparent:
              document.execCommand('hiliteColor', false, 'transparent');
            } catch(e) {
              console.log('Error al remover color:', e);
            }
          } else {
            this.executeCommand('hiliteColor', selectedValue);
          }
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