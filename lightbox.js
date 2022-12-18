const template = document.createElement('template');
template.innerHTML = `
<style>
  * {
    box-sizing: border-box;
  }
  #lightbox {
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0, 0.85);
    opacity: 0;
    padding: 2rem var(--side-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    pointer-events: none;
    transition: opacity .5s ease-in;
    z-index: 10;
    height: 100%;
    width: 100%;
  }
  #lightbox.show {
    opacity: 1;
    z-index: 1000;
    pointer-events: all;
  }
  #lightbox img {
    max-height: 90%;
    max-width: 100%;
    border-radius: 1rem;
    transform: scale(0);
    transition: all .5s ease-out;
    z-index: 100;
  }
  #lightbox figcaption {
    color: var(--white);
    text-align: center;
    margin-top: 1rem;
  }

  #lightbox figure {
    margin: 0;
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }
  #lightbox.show img {
    transform: scale(1);
  }
  #lightbox.show img.just-loaded {
    transform: scale(1);
    transition: .5s ease-out all;
  }
  #lightbox .close-button {
    position: fixed; 
    right: 0;
    top: 0;
    margin: 2rem;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 2rem;
    color: var(--white);
    z-index: 9999;
  }
</style>
<div id="lightbox">
  <button class="close-button">&times;</button>
  <figure>
    <img loading='lazy' src="" alt="" />
    <figcaption></figcaption>
  </figure>
</div>
`
class Lightbox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const container = this.getAttribute('container') ? document.getElementById(this.getAttribute('container')) : document.getElementById("gallery");

    const lightbox = this.shadowRoot.querySelector('#lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCap = lightbox.querySelector('figcaption');
    container.querySelectorAll('img').forEach(image => {
      image.onclick = () => {
        lightboxImg.src = image.src;
        lightboxCap.innerHTML = image.getAttribute('alt');
        lightbox.classList.add("show");
        if ("imageSrc" in image.dataset) {
          const req = new Request(image.dataset.imageSrc);
          fetch(req)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.blob();
          })
          .then((response) => {
            if(image.src == lightboxImg.src) {
              lightboxImg.src = URL.createObjectURL(response);
              lightboxImg.classList.add("just-loaded");
            }
          });
        }
      }
    });
    this.shadowRoot.querySelector('#lightbox button').onclick = () => {
      lightbox.classList.remove("show");
      lightboxImg.classList.remove("just-loaded");
      lightboxCap.innerHTML = "";
    };
    lightbox.onclick = () => {
      lightbox.classList.remove("show");
      lightboxImg.classList.remove("just-loaded");
      lightboxCap.innerHTML = "";
    };
    lightboxImg.onclick = (e) => {
      e.stopPropagation();
    };

  }
}

window.customElements.define('light-box', Lightbox);
