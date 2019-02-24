let dropdowns = {};
let activeDropdowns = []; 
let dropdownBtns = document.getElementsByClassName("dropdownBtn");
for(let i = 0; i < dropdownBtns.length; i++)
{
    setClickListener(dropdownBtns[i]);
}
document.addEventListener("click",function(e)
 {
     let element;
     for(let i = 0; i < activeDropdowns.length; i++)
     {
         element = activeDropdowns[i];
         console.log("CLICK TARGET: ", e.target,"|",element.parent);
         if(!element.parent.contains(e.target))
             toggleDropdown(element.parent,element.element,false);
     }
 },false);
 function setClickListener(parent)
 {
    parent.addEventListener("click",function(e)
    {
        let attribute;
        if((attribute = e.target.getAttribute("data-select")))
        {
            console.log(this,attribute,e);
            dropdowns[this.getAttribute("data-dropdowncontent")](this,attribute,e.target.getAttribute("data-id"));
        }
        let element = document.getElementById(this.getAttribute("data-dropdownContent"));
        let toggled = element.getAttribute("data-toggled") === "true";
        toggleDropdown(parent,element,!toggled);
    },false);
 }
 function setElementDropdown(element)
 {
    setClickListener(element);
 }
 function toggleDropdown(parent,element,toggled)
 {
     element.setAttribute("data-toggled",toggled);
     if(toggled)
     {
         element.style.display = "flex";
         activeDropdowns.push({parent:parent,element:element});
     }
     else
     {
         element.style.display = "none";
         activeDropdowns.splice(activeDropdowns.indexOf(element),1);
     }
 }


 function dropdownClickHandler(object,method)
 {
    console.log("wew DROPDOWN: ",object.getAttribute("data-dropdowncontent"));
     dropdowns[object.getAttribute("data-dropdowncontent")] = method;
 }