// Follow the Patty: open and close cards, class votes, and the top bar.

// Open and close a timeline entry or evidence card
function setOpen(button, open) {
  var panel = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    panel.classList.add('is-entering');
    panel.hidden = false;
    void panel.offsetHeight; // let the browser draw it at 0 opacity first
    panel.classList.remove('is-entering');
  } else {
    panel.hidden = true;
  }
}

document.querySelectorAll('.toggle').forEach(function (button) {
  button.addEventListener('click', function () {
    setOpen(button, button.getAttribute('aria-expanded') !== 'true');
  });
});

// Up and down arrows move between entries in the same list.
// Escape inside an open card closes it.
document.addEventListener('keydown', function (event) {
  var target = event.target;

  if (event.key === 'Escape') {
    var openPanel = target.closest('.panel');
    if (openPanel) {
      var owner = document.querySelector('[aria-controls="' + openPanel.id + '"]');
      setOpen(owner, false);
      owner.focus();
    }
    return;
  }

  if (!target.classList.contains('toggle')) return;
  var list = target.closest('[data-keynav]');
  if (!list) return;

  var toggles = Array.prototype.slice.call(list.querySelectorAll('.toggle'));
  var index = toggles.indexOf(target);
  var next = null;

  if (event.key === 'ArrowDown') next = toggles[index + 1];
  if (event.key === 'ArrowUp') next = toggles[index - 1];
  if (event.key === 'Home') next = toggles[0];
  if (event.key === 'End') next = toggles[toggles.length - 1];

  if (next) {
    event.preventDefault();
    next.focus();
  }
});

// Class votes: one choice per step, shown in the summary list
document.querySelectorAll('.vote').forEach(function (group) {
  var step = group.getAttribute('data-step');
  var buttons = group.querySelectorAll('button');
  var tally = document.querySelector('[data-tally="' + step + '"]');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var alreadyPicked = button.getAttribute('aria-pressed') === 'true';
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });

      if (alreadyPicked) {
        tally.textContent = 'not decided yet';
        tally.classList.remove('decided');
      } else {
        button.setAttribute('aria-pressed', 'true');
        tally.textContent = 'explains ' + button.getAttribute('data-vote').toLowerCase();
        tally.classList.add('decided');
      }
    });
  });
});

// Underline the current section in the top bar
var navLinks = document.querySelectorAll('.topbar ul a');
if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        var current = link.getAttribute('href') === '#' + entry.target.id;
        if (current) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('.section').forEach(function (section) {
    observer.observe(section);
  });
}
