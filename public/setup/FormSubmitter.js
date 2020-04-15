let form = document.getElementById("form");
let submitForm = document.getElementById("submitForm");
console.log(submitForm);
let fillField = document.getElementById("fillField");
let size = fillField.getBoundingClientRect();
let middle = (size.bottom - size.top) / 2;
let inputs = form.getElementsByTagName("input");
submitForm.addEventListener("click",function()
{
    let canSend = true;
    for(let i = 0; i < inputs.length; i++)
    {
        if(inputs[i].value.length == 0 && inputs[i].getAttribute("required") != null)
        {
            console.log(inputs[i]);
            let pos = inputs[i].getBoundingClientRect();
            //console.log(pos.);
            fillField.style.left = "calc("+pos.right + "px + 2em)";
            fillField.style.top = pos.top - middle + ((pos.bottom - pos.top) / 2) + window.pageYOffset + "px";
            canSend = false;
            break;
        }
    }
    if(canSend) {
        console.log("sending");
        form.submit();
    }
},false);
