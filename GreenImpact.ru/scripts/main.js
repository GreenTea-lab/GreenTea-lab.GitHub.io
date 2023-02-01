var myImage = document.querySelector('img');

myImage.onclick = function() {
    var mySrc = myImage.getAttribute('src');
    if(mySrc === 'imagine/Albedo.jpg') {
      myImage.setAttribute ('src','imagine/Alvedo.jpg');
    } else {
      myImage.setAttribute ('src','imagine/Albedo.jpg');
    }
}

