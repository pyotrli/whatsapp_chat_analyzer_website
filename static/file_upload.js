// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers -->
// upload chat file.

// hide standard file upload button
window.onload = function()
{
  const input = document.querySelector('input');
  input.style.opacity = 0;
  input.addEventListener('change', updateFileDisplay);
}

// display file info when selected for upload
function updateFileDisplay()
{
  const input = document.querySelector('input');
  const preview = document.querySelector('.preview');
  while(preview.firstChild)
  {
    preview.removeChild(preview.firstChild);
  }

  const file = input.files[0];

  if (file.length === 0)
  {
    const para = document.createElement('p');
    para.textContent = 'No file selected';
    preview.appendChild(para);
  }
  else
  {
    const para = document.createElement('p');
    if(validFileType(file))
    {
      console.log(file.name);
      para.textContent = `File name: ${file.name}, file size: ${returnFileSize(file.size)}.`;
      preview.appendChild(para);
      document.getElementById('analyze_btn').disabled = false;
    }
    else
    {
      para.textContent = `File ${file.name} is not a valid type. Select .txt or .zip only`;
      preview.appendChild(para);
      document.getElementById('analyze_btn').disabled = true;
    }
  }
}

// check file type for validity. Zip and plain text ok.
function validFileType(file)
{
  return fileTypes.includes(file.type);
}

const fileTypes = ["text/plain", "application/zip"];

function returnFileSize(number)
{
  if(number < 1024)
  {
    return number + 'bytes';
  }
  else if(number >= 1024 && number < 1048576)
  {
    return (number/1024).toFixed(1) + 'KB';
  }
  else
  {
    return (number/1048576).toFixed(1) + 'MB';
  }
}
