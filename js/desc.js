window.addEventListener('load', function() {
  var btnOpen  = document.getElementById('open-description');
  var btnClose = document.getElementById('close-description');
  var desc     = document.querySelector('div.description');
  
  btnOpen.onclick  = function() {
    btnClose.style.display = 'inline';
    btnOpen.style.display = 'none';
    desc.style.display = 'block';
  };
  
  btnClose.onclick = function() {
    btnOpen.style.display = 'inline';
    btnClose.style.display = 'none';
    desc.style.display = 'none';
  }
}, false);