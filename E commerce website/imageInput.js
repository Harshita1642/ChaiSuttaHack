
document.getElementById('urlForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const urlInput = document.getElementById('urlInput').value;
  var newurl;
  fetch('http://127.0.0.1:5000/process_image', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageUrl: urlInput })
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    str = JSON.stringify(data);
    fin = JSON.parse(str);
    document.getElementById('descriptionContainer').innerHTML = `${fin.description.desc}`;
    document.getElementById('rating').innerHTML = `${fin.description.rate}`;
    document.getElementById('price').innerHTML = `${fin.description.price}`;  
    // newurl = fin.img
  })
  .catch(error => console.error('Error:', error));
  const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = `<img src="${urlInput}" alt="Image">
                               <p></p>`;
  return false;
});
