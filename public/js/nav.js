class SideNav extends HTMLElement {
  connectedCallback() {
    this.render();
    const currentPage = window.location.href;
    const nav = document.getElementById("site-links");
    for (const child of nav.children) {
      if (currentPage == child.href) {
        child.classList.add("active")
      }
    }
  }

  render() {
    this.innerHTML = `
      <div id="nav-bounding">
        <div class="shadow hover-move" id="site-links">
          <h2><span class="emoji">R</span>Internal<span class="emoji">Q</span></h2>
          <a href="/">Home</a>
        </div>
      
        <div class="shadow hover-move">
          <h2><span class="emoji flip">Q</span>External<span class="emoji flip">R</span></h2>
          <a href="https://less-than-three.atabook.org" aria-describedby="nav-atabook-tooltip" id="nav-atabook">Guestbook</a>
          <a href="https://www.wmpg.org/show/sun2300/" target="_blank" aria-describedby="nav-radio-tooltip" id="nav-radio">Radio</a>
          <a href="https://github.com/cae-lim" target="_blank" id="nav-github" aria-describedby="nav-github-tooltip">Github</a>
          <a href="https://www.tumblr.com/blog/ammonia-screw-666" target="_blank" id="nav-tumblr" aria-describedby="nav-tumblr-tooltip">Tumblr</a>
          <a href="https://keys.openpgp.org/search?q=caelouwho%40gmail.com" target="_blank" id="nav-openpgp" aria-describedby="nav-openpgp-tooltip">PGP Key</a>
        </div>
      
        <div class="shadow hover-move">
          <h2><span class="emoji flip hat">z</span>Featured<span class="emoji hat">z</span></h2>
          <a href="https://www.reaper.fm/" target="_blank" id="nav-reaper" aria-describedby="nav-reaper-tooltip">Reaper</a>
          <a href="https://sdaw.neocities.org" target="_blank" id="nav-sdaw" aria-describedby="nav-sdaw-tooltip">SDaw</a>
          <a href="https://strudel.cc" target="_blank" id="nav-strudel" aria-describedby="nav-strudel-tooltip">Strudel</a>
          <a href="https://www.dafont.com/emoji.font" target="_blank" id="nav-emojis" aria-describedby="nav-emojis-tooltip">Emojis</a>
          <a href="https://www.piskelapp.com/p/create/sprite/" target="_blank" id="nav-piskel" aria-describedby="nav-piskel-tooltip">Piskel</a>
        </div>
      </div>

      <my-tooltip data-for="#nav-atabook" data-position="right" id="nav-atabook-tooltip">
        Sign my guestbook!
      </my-tooltip>
      <my-tooltip data-for="#nav-radio" data-position="right" id="nav-radio-tooltip">
        View my archives, hit [Listen Now] to listen live!
      </my-tooltip>
      <my-tooltip data-for="#nav-github" data-position="right" id="nav-github-tooltip">
        Check out all my abandoned projects! (and the code for this site)
      </my-tooltip>
      <my-tooltip data-for="#nav-tumblr" data-position="right" id="nav-tumblr-tooltip">
        Check Follow me on tumblr!
      </my-tooltip>
      <my-tooltip data-for="#nav-openpgp" data-position="right" id="nav-openpgp-tooltip">
        Check my Openpgp public key
      </my-tooltip>
      <my-tooltip data-for="#nav-sdaw" data-position="right" id="nav-sdaw-tooltip">
        Check Awesome music creation tool hosted on neocities!
      </my-tooltip>
      <my-tooltip data-for="#nav-strudel" data-position="right" id="nav-strudel-tooltip">
        Check Music live coding platform, just try it.
      </my-tooltip>
      <my-tooltip data-for="#nav-emojis" data-position="right" id="nav-emojis-tooltip">
        Check The emoji font I use on this site <span class="emoji">m</span>
      </my-tooltip>
      <my-tooltip data-for="#nav-reaper" data-position="right" id="nav-reaper-tooltip">
        Check My DAW of choice <span class="emoji">k</span>
      </my-tooltip>
      <my-tooltip data-for="#nav-piskel" data-position="right" id="nav-piskel-tooltip">
        Check Easy to use pixel art editor
      </my-tooltip>
    `;
  }
}

customElements.define('side-nav', SideNav); 
