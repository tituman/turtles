
const output = document.getElementById('theDrawing');

if (window.FileList && window.File && window.FileReader) {
    document.getElementById('file-selector').addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file.type) {
        writeDebug('Error: The File.type property does not appear to be supported on this browser.');
        return;
      }
      if (!file.type.match('image.*')) {
        writeDebug('Error: The selected file does not appear to be an image.');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        output.innerHTML = event.target.result;
        console.log(event.target.result);
      });
      reader.readAsText(file);
    }); 
  }
