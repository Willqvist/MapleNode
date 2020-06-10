const dropdowns = {};
const activeDropdowns = [];
const dropdownBtns = document.getElementsByClassName('dropdownBtn');
document.addEventListener(
  'click',
  function (e) {
    let element;
    for (let i = 0; i < activeDropdowns.length; i++) {
      element = activeDropdowns[i];
      if (!element.parent.contains(e.target)) {
          console.log("IM HERE");
          toggleDropdown(element.parent, element.element, false);
      }
    }
  },
  false
);

function isButton(elem) {
    const parent = elem.parentNode;
    return elem.className.includes('dropdownBtn') || parent.className.includes('dropdownBtn');
}

export function setClickListener(parent) {
  parent.addEventListener(
    'click',
    function (e) {
      let attribute;
      if ((attribute = e.target.getAttribute('data-select')))
            dropdowns[this.getAttribute('data-dropdowncontent')](this, attribute, e.target.getAttribute('data-id'));

       if(isButton(e.target) || e.target.hasAttribute('data-select')) {
           const element = document.getElementById(this.getAttribute('data-dropdownContent'));
           const toggled = element.getAttribute('data-toggled') === 'true';
           toggleDropdown(parent, element, !toggled);
       } else {

       }
      console.log(e.target);
    },
    false
  );
}

export function setElementDropdown(element) {
  setClickListener(element);
}

export function toggleDropdown(parent, element, toggled) {

    const max = element.getAttribute('max') || null;
    element.style.height = max ? `${max*2.05+0.1}rem` : `auto`;
    if(max) element.style.overflowY = "scroll";
  element.setAttribute('data-toggled', toggled);
  if (toggled) {
    element.style.display = 'flex';
    activeDropdowns.push({ parent, element });
  } else {
    element.style.display = 'none';
    activeDropdowns.splice(activeDropdowns.indexOf(element), 1);
  }
}

export function dropdownClickHandler(object, method) {
  dropdowns[object.getAttribute('data-dropdowncontent')] = method;
}

for (let i = 0; i < dropdownBtns.length; i++) {
  setClickListener(dropdownBtns[i]);
}

const searches = document.getElementsByClassName('searchInput');
for(let i = 0; i < searches.length; i++) {
    const search = searches[i];
    const filter = document.getElementById(search.getAttribute("filter"));
    const filterOrg = [...filter.children];
    let prevValue = "";
    search.addEventListener('keyup', (e) => {
        const {value} = search;
        if(value === prevValue) return;
        prevValue = value;
        filter.innerHTML = '';
        for(let i = filterOrg.length-1; i >= 0; i--) {
            filter.appendChild(filterOrg[i]);
        }
        for(let i = filter.children.length-1; i >= 0; i--) {
            if(!filter.children[i].innerText.toLowerCase().includes(value.toLowerCase())) {
                filter.removeChild(filter.children[i]);
            }
        }
    });
}
